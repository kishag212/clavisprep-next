-- Prevent stale tabs from overwriting newer task outcomes.
-- SECURITY INVOKER preserves existing table grants and row-level security.
create or replace function public.save_roadmap_tasks_if_current(
  p_month_id text,
  p_owner_id uuid,
  p_expected_tasks jsonb,
  p_tasks jsonb
) returns boolean
language sql
security invoker
set search_path = ''
as $$
  with saved as (
    update public.roadmap_activities
    set tasks = p_tasks
    where id::text = p_month_id
      and user_id = p_owner_id
      and p_owner_id = auth.uid()
      and tasks::jsonb is not distinct from p_expected_tasks
      and jsonb_typeof(p_tasks) = 'array'
    returning 1
  )
  select exists(select 1 from saved);
$$;

revoke all on function public.save_roadmap_tasks_if_current(text, uuid, jsonb, jsonb) from public;
revoke all on function public.save_roadmap_tasks_if_current(text, uuid, jsonb, jsonb) from anon;
grant execute on function public.save_roadmap_tasks_if_current(text, uuid, jsonb, jsonb) to authenticated;
