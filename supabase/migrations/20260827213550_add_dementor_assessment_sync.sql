create table if not exists public.assessment_snapshots (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  assessment_version text not null default 'dc9-v1',
  state_json jsonb not null default '{}'::jsonb,
  client_updated_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.assessment_runs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  sphere_id text not null,
  assessment_version text not null default 'dc9-v1',
  result_json jsonb not null,
  answers_json jsonb,
  started_at timestamptz,
  completed_at timestamptz not null,
  source_key text not null,
  created_at timestamptz not null default now(),
  unique(profile_id, source_key)
);

create index if not exists assessment_runs_profile_id_idx on public.assessment_runs(profile_id);
create index if not exists assessment_runs_sphere_id_idx on public.assessment_runs(sphere_id);
create index if not exists assessment_runs_completed_at_idx on public.assessment_runs(completed_at desc);

alter table public.assessment_snapshots enable row level security;
alter table public.assessment_runs enable row level security;

create policy assessment_snapshots_select_own on public.assessment_snapshots
for select to authenticated using ((select auth.uid()) = profile_id);
create policy assessment_snapshots_insert_own on public.assessment_snapshots
for insert to authenticated with check ((select auth.uid()) = profile_id);
create policy assessment_snapshots_update_own on public.assessment_snapshots
for update to authenticated using ((select auth.uid()) = profile_id) with check ((select auth.uid()) = profile_id);

create policy assessment_runs_select_own on public.assessment_runs
for select to authenticated using ((select auth.uid()) = profile_id);
create policy assessment_runs_insert_own on public.assessment_runs
for insert to authenticated with check ((select auth.uid()) = profile_id);

revoke all on public.assessment_snapshots from anon;
revoke all on public.assessment_runs from anon;
grant select, insert, update on public.assessment_snapshots to authenticated;
grant select, insert on public.assessment_runs to authenticated;