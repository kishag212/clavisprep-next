-- Read-only metadata audit. Does not select student records or change policies.
-- Run in the ClavisPrep Supabase SQL editor before pilot rollout.
begin transaction read only;

select c.relname as table_name, c.relrowsecurity as rls_enabled,
       c.relforcerowsecurity as force_rls
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('user_profiles', 'roadmap_activities');

select tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('user_profiles', 'roadmap_activities')
order by tablename, policyname;

select table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('user_profiles', 'roadmap_activities')
  and grantee in ('anon', 'authenticated')
order by table_name, grantee, privilege_type;

rollback;

-- Review every applicable policy: permissive policies combine with OR.
-- Reads/deletes need ownership in USING; inserts need it in WITH CHECK;
-- updates need both (WITH CHECK can inherit USING when omitted).
-- Expected ownership: auth.uid() = user_id. Never disable RLS for testing.
-- Metadata inspection supplements, but does not replace, a two-account test.
