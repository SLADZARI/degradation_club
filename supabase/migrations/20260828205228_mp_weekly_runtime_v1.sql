begin;

create schema if not exists mp_private;

create table if not exists public.mp_system_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  system_role text not null check (system_role in ('PLATFORM_OWNER','TEAM_MEMBER','PARTNER','CLIENT','EXPERT')),
  status text not null default 'ACTIVE' check (status in ('INVITED','ACTIVE','SUSPENDED','REVOKED')),
  valid_from timestamptz not null default now(),
  valid_to timestamptz,
  source_ref text,
  created_at timestamptz not null default now(),
  unique(user_id, system_role)
);

create table if not exists public.mp_project_refs (
  id uuid primary key default gen_random_uuid(),
  project_key text not null unique,
  name text not null,
  source_ref text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mp_project_assignments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.mp_project_refs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null,
  relation text not null default 'CONTRIBUTOR' check (relation in ('OWNER','LEAD','CONTRIBUTOR','REVIEWER','PARTNER','CLIENT_COUNTERPART','OBSERVER')),
  status text not null default 'ACTIVE' check (status in ('INVITED','ACTIVE','WAITING','SUSPENDED','REVOKED')),
  source_ref text,
  confidence text not null default 'CONFIRMED' check (confidence in ('CONFIRMED','INFERRED','PLANNED','LEGACY')),
  valid_from timestamptz not null default now(),
  valid_to timestamptz,
  created_at timestamptz not null default now(),
  unique(project_id, user_id, role)
);

create table if not exists public.mp_reports (
  id uuid primary key default gen_random_uuid(),
  author_user_id uuid not null references auth.users(id) on delete cascade,
  report_type text not null check (report_type in ('DAILY','WEEKLY')),
  period_start date not null,
  period_end date not null,
  status text not null default 'DRAFT' check (status in ('DRAFT','SUBMITTED','REVIEWED','ARCHIVED')),
  headline text,
  summary text,
  source_ref text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (period_end >= period_start)
);

create table if not exists public.mp_report_recipients (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.mp_reports(id) on delete cascade,
  recipient_user_id uuid not null references auth.users(id) on delete cascade,
  state text not null default 'UNREAD' check (state in ('UNREAD','READ','ACKNOWLEDGED')),
  read_at timestamptz,
  acknowledged_at timestamptz,
  created_at timestamptz not null default now(),
  unique(report_id, recipient_user_id)
);

create table if not exists public.mp_report_items (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.mp_reports(id) on delete cascade,
  project_id uuid references public.mp_project_refs(id) on delete set null,
  item_type text not null check (item_type in ('RESULT','DECISION','WAITING','BLOCKER','REQUEST','NOTE')),
  title text not null,
  body text,
  item_state text,
  source_ref text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.mp_spore_awards (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.mp_project_refs(id) on delete restrict,
  result_key text not null,
  role text not null,
  score integer not null check (score >= 0),
  maturity text not null default 'CREATED' check (maturity in ('CREATED','VALIDATED','REALIZED')),
  reason text not null,
  evidence_ref text,
  evidence_type text,
  confidence text not null default 'MEDIUM' check (confidence in ('LOW','MEDIUM','HIGH')),
  scoring_version text not null default 'MP-SPORES-v0.3',
  source_ref text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, result_key, role, scoring_version)
);

create table if not exists public.mp_spore_events (
  id uuid primary key default gen_random_uuid(),
  award_id uuid not null references public.mp_spore_awards(id) on delete cascade,
  event_type text not null check (event_type in ('CREATED','VALIDATED','REALIZED','ADJUSTED','SUPERSEDED')),
  adjustment integer not null default 0,
  reason text not null,
  evidence_ref text,
  actor_user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.mp_spore_attributions (
  id uuid primary key default gen_random_uuid(),
  award_id uuid not null references public.mp_spore_awards(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  attribution_role text not null,
  share numeric(5,4) check (share is null or (share > 0 and share <= 1)),
  confidence text not null default 'CONFIRMED' check (confidence in ('CONFIRMED','INFERRED')),
  source_ref text,
  created_at timestamptz not null default now(),
  unique(award_id, user_id, attribution_role)
);

create or replace function mp_private.current_user_is_mp_member()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.mp_system_memberships m
    where m.user_id = auth.uid()
      and m.status = 'ACTIVE'
      and (m.valid_to is null or m.valid_to > now())
  );
$$;

create or replace function mp_private.current_user_is_mp_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.mp_system_memberships m
    where m.user_id = auth.uid()
      and m.system_role = 'PLATFORM_OWNER'
      and m.status = 'ACTIVE'
      and (m.valid_to is null or m.valid_to > now())
  );
$$;

revoke all on schema mp_private from public;
grant usage on schema mp_private to authenticated;
revoke all on function mp_private.current_user_is_mp_member() from public;
revoke all on function mp_private.current_user_is_mp_owner() from public;
grant execute on function mp_private.current_user_is_mp_member() to authenticated;
grant execute on function mp_private.current_user_is_mp_owner() to authenticated;

alter table public.mp_system_memberships enable row level security;
alter table public.mp_project_refs enable row level security;
alter table public.mp_project_assignments enable row level security;
alter table public.mp_reports enable row level security;
alter table public.mp_report_recipients enable row level security;
alter table public.mp_report_items enable row level security;
alter table public.mp_spore_awards enable row level security;
alter table public.mp_spore_events enable row level security;
alter table public.mp_spore_attributions enable row level security;

create policy mp_memberships_select on public.mp_system_memberships for select to authenticated
using (user_id = auth.uid() or mp_private.current_user_is_mp_owner());
create policy mp_memberships_owner_all on public.mp_system_memberships for all to authenticated
using (mp_private.current_user_is_mp_owner())
with check (mp_private.current_user_is_mp_owner());

create policy mp_project_refs_select on public.mp_project_refs for select to authenticated
using (mp_private.current_user_is_mp_member());
create policy mp_project_refs_owner_all on public.mp_project_refs for all to authenticated
using (mp_private.current_user_is_mp_owner())
with check (mp_private.current_user_is_mp_owner());

create policy mp_assignments_select on public.mp_project_assignments for select to authenticated
using (user_id = auth.uid() or mp_private.current_user_is_mp_owner());
create policy mp_assignments_owner_all on public.mp_project_assignments for all to authenticated
using (mp_private.current_user_is_mp_owner())
with check (mp_private.current_user_is_mp_owner());

create policy mp_reports_select on public.mp_reports for select to authenticated
using (
  author_user_id = auth.uid()
  or mp_private.current_user_is_mp_owner()
  or exists (select 1 from public.mp_report_recipients rr where rr.report_id = id and rr.recipient_user_id = auth.uid())
);
create policy mp_reports_insert on public.mp_reports for insert to authenticated
with check (author_user_id = auth.uid() and mp_private.current_user_is_mp_member());
create policy mp_reports_update on public.mp_reports for update to authenticated
using ((author_user_id = auth.uid() and status in ('DRAFT','SUBMITTED')) or mp_private.current_user_is_mp_owner())
with check ((author_user_id = auth.uid()) or mp_private.current_user_is_mp_owner());
create policy mp_reports_delete on public.mp_reports for delete to authenticated
using ((author_user_id = auth.uid() and status = 'DRAFT') or mp_private.current_user_is_mp_owner());

create policy mp_report_recipients_select on public.mp_report_recipients for select to authenticated
using (
  recipient_user_id = auth.uid()
  or mp_private.current_user_is_mp_owner()
  or exists (select 1 from public.mp_reports r where r.id = report_id and r.author_user_id = auth.uid())
);
create policy mp_report_recipients_insert on public.mp_report_recipients for insert to authenticated
with check (
  mp_private.current_user_is_mp_owner()
  or exists (select 1 from public.mp_reports r where r.id = report_id and r.author_user_id = auth.uid())
);
create policy mp_report_recipients_update on public.mp_report_recipients for update to authenticated
using (recipient_user_id = auth.uid() or mp_private.current_user_is_mp_owner())
with check (recipient_user_id = auth.uid() or mp_private.current_user_is_mp_owner());
create policy mp_report_recipients_delete on public.mp_report_recipients for delete to authenticated
using (
  mp_private.current_user_is_mp_owner()
  or exists (select 1 from public.mp_reports r where r.id = report_id and r.author_user_id = auth.uid())
);

create policy mp_report_items_select on public.mp_report_items for select to authenticated
using (
  exists (
    select 1 from public.mp_reports r
    where r.id = report_id
      and (
        r.author_user_id = auth.uid()
        or mp_private.current_user_is_mp_owner()
        or exists (select 1 from public.mp_report_recipients rr where rr.report_id = r.id and rr.recipient_user_id = auth.uid())
      )
  )
);
create policy mp_report_items_insert on public.mp_report_items for insert to authenticated
with check (
  exists (select 1 from public.mp_reports r where r.id = report_id and r.author_user_id = auth.uid())
  or mp_private.current_user_is_mp_owner()
);
create policy mp_report_items_update on public.mp_report_items for update to authenticated
using (
  exists (select 1 from public.mp_reports r where r.id = report_id and r.author_user_id = auth.uid())
  or mp_private.current_user_is_mp_owner()
)
with check (
  exists (select 1 from public.mp_reports r where r.id = report_id and r.author_user_id = auth.uid())
  or mp_private.current_user_is_mp_owner()
);
create policy mp_report_items_delete on public.mp_report_items for delete to authenticated
using (
  exists (select 1 from public.mp_reports r where r.id = report_id and r.author_user_id = auth.uid())
  or mp_private.current_user_is_mp_owner()
);

create policy mp_spore_awards_select on public.mp_spore_awards for select to authenticated
using (mp_private.current_user_is_mp_member());
create policy mp_spore_awards_insert on public.mp_spore_awards for insert to authenticated
with check (created_by = auth.uid() and mp_private.current_user_is_mp_member());
create policy mp_spore_awards_owner_update on public.mp_spore_awards for update to authenticated
using (mp_private.current_user_is_mp_owner())
with check (mp_private.current_user_is_mp_owner());

create policy mp_spore_events_select on public.mp_spore_events for select to authenticated
using (mp_private.current_user_is_mp_member());
create policy mp_spore_events_insert on public.mp_spore_events for insert to authenticated
with check (
  mp_private.current_user_is_mp_owner()
  or (
    event_type = 'CREATED'
    and actor_user_id = auth.uid()
    and exists (select 1 from public.mp_spore_awards a where a.id = award_id and a.created_by = auth.uid())
  )
);

create policy mp_spore_attributions_select on public.mp_spore_attributions for select to authenticated
using (mp_private.current_user_is_mp_member());
create policy mp_spore_attributions_owner_all on public.mp_spore_attributions for all to authenticated
using (mp_private.current_user_is_mp_owner())
with check (mp_private.current_user_is_mp_owner());

insert into public.mp_project_refs(project_key, name, source_ref) values
  ('inbetweenme','INbetweenME','https://github.com/SLADZARI/inbetweenme'),
  ('dementor-club','Dementor Club','https://github.com/SLADZARI/degradation_club'),
  ('bereg-k16','BEREG / K-16','https://github.com/SLADZARI/modernpilgrims-platform/tree/weekly-projects/projects/bereg'),
  ('seven-clicks','Seven Clicks','https://github.com/SLADZARI/seven_clicks'),
  ('autodevice','AUTODEVICE','https://github.com/SLADZARI/autodevice'),
  ('spain-transport-aid','Spain Transport Aid','https://github.com/SLADZARI/spain-transport-aid-mvp'),
  ('goldcars','GoldCars','https://github.com/SLADZARI/goldcars'),
  ('roles-rules','Roles & Rules','https://github.com/SLADZARI/ROLES-RULES-FRACTAL-2'),
  ('gabil-real-estate','Gabil Real Estate',null),
  ('weekly-os','Weekly OS','https://github.com/SLADZARI/modernpilgrims-platform/tree/weekly-projects')
on conflict (project_key) do update set name = excluded.name, source_ref = excluded.source_ref, updated_at = now();

commit;