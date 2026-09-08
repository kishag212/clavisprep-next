-- Longitudinal student context for personalized roadmap recommendations.
-- Apply in the Supabase SQL editor before deploying the expanded profile form.
alter table public.user_profiles
  add column if not exists student_context jsonb not null default '{}'::jsonb;

comment on column public.user_profiles.student_context is
  'Structured, student-provided planning context such as interests, constraints, priorities, confidence, challenges, and wins.';

create index if not exists user_profiles_student_context_gin
  on public.user_profiles using gin (student_context);
