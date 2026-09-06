-- Grant explicit Data API (PostgREST/GraphQL) access to public tables.
--
-- Background: Supabase is removing the automatic grant of public-schema tables
-- to the anon/authenticated roles. New projects: 2026-05-30. Existing projects'
-- NEW tables: enforced 2026-10-30. Without these grants, a fresh `supabase db
-- reset`, a new branch, or a brand-new project would create these tables with
-- no API exposure even though RLS policies exist.
--
-- Grants are coarse table-level permissions; RLS still gates rows. Every table
-- here is private (owner-scoped via auth.uid(), plus an admin read via
-- is_tracker_admin()), so anon gets nothing and privileges match each table's
-- actual policies. Re-running this migration is safe (GRANT is idempotent).

grant usage on schema public to authenticated, service_role;

-- tracker_profiles: own read/insert/update + admin read. No public access.
grant select, insert, update on table public.tracker_profiles to authenticated;
grant all on table public.tracker_profiles to service_role;

-- tracker_meals: own read/insert/delete + admin read. No update policy.
grant select, insert, delete on table public.tracker_meals to authenticated;
grant all on table public.tracker_meals to service_role;

-- tracker_dishes: own read/insert/update/delete (scoped via parent meal) + admin read.
grant select, insert, update, delete on table public.tracker_dishes to authenticated;
grant all on table public.tracker_dishes to service_role;

-- tracker_exercises: own read/insert/delete + admin read. No update policy.
grant select, insert, delete on table public.tracker_exercises to authenticated;
grant all on table public.tracker_exercises to service_role;

-- Sequences (only relevant for identity/serial columns; harmless otherwise).
grant usage, select on all sequences in schema public to authenticated, service_role;
