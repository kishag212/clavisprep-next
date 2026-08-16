-- ClavisPrep — SAT feature schema
-- Run in the Supabase SQL editor (project mhkbdwisdpecccmdfgis).
-- Matches your existing conventions: uuid PKs, auth.uid() RLS, user_profiles as
-- the shared profile hub. Pro gating stays in app code via the subscriptions
-- table (status = active/trialing) — not enforced here.

-- ----------------------------------------------------------------------------
-- Item bank (admin-writable, everyone-readable when approved)
-- ----------------------------------------------------------------------------
create table if not exists sat_items (
  id          uuid primary key default gen_random_uuid(),
  section     text not null check (section in ('rw','math')),
  domain      text not null,
  skill       text,
  difficulty  int  not null check (difficulty between 1 and 5),
  stem        text not null,
  options     jsonb not null,            -- {"A":"...","B":"...","C":"...","D":"..."}
  correct     text not null check (correct in ('A','B','C','D')),
  explanation text not null,
  source      text not null default 'ai' check (source in ('ai','licensed','authored')),
  approved    boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table sat_items enable row level security;

-- Any signed-in user can read APPROVED items only.
create policy "read approved items" on sat_items
  for select using (auth.role() = 'authenticated' and approved = true);
-- No client writes. Load/approve items with the service role key (script/admin).

-- ----------------------------------------------------------------------------
-- Attempts + responses (a taken test)
-- ----------------------------------------------------------------------------
create table if not exists sat_attempts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  mode         text not null check (mode in ('full','section','diagnostic')),
  started_at   timestamptz not null default now(),
  finished_at  timestamptz,
  rw_scaled    int,   -- 200-800
  math_scaled  int,   -- 200-800
  total_scaled int    -- 400-1600
);

alter table sat_attempts enable row level security;
create policy "own attempts" on sat_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists sat_responses (
  id           uuid primary key default gen_random_uuid(),
  attempt_id   uuid not null references sat_attempts(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  item_id      uuid not null references sat_items(id),
  module_no    int  not null check (module_no in (1,2)),
  chosen       text check (chosen in ('A','B','C','D')),
  correct      boolean,
  time_seconds int,
  flagged      boolean not null default false
);

alter table sat_responses enable row level security;
create policy "own responses" on sat_responses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Score tracker, mistake journal, target (feed the tracker + predictor + roadmap)
-- ----------------------------------------------------------------------------
create table if not exists sat_scores (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  test_date  date not null,
  source     text not null check (source in ('official','practice','diagnostic')),
  total      int check (total between 400 and 1600),
  rw_score   int check (rw_score between 200 and 800),
  math_score int check (math_score between 200 and 800),
  notes      text,
  created_at timestamptz not null default now()
);

alter table sat_scores enable row level security;
create policy "own scores" on sat_scores
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists sat_mistakes (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  item_id        uuid references sat_items(id),
  section        text check (section in ('rw','math')),
  topic          text,
  question_text  text,
  why_wrong      text,
  ai_explanation text,
  mastered       boolean not null default false,
  created_at     timestamptz not null default now()
);

alter table sat_mistakes enable row level security;
create policy "own mistakes" on sat_mistakes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists sat_targets (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  target_total int check (target_total between 400 and 1600),
  target_date  date,
  updated_at   timestamptz not null default now()
);

alter table sat_targets enable row level security;
create policy "own target" on sat_targets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Note: upsert sat_targets with onConflict: 'user_id' from the client.
