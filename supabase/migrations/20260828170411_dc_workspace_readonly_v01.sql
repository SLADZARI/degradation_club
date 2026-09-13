create table if not exists public.dc_system_memberships (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  status text not null check (status in ('planned','active','waiting','suspended','archived','revoked')),
  valid_from timestamptz not null default now(),
  valid_to timestamptz,
  source_system text not null default 'dementor-club',
  source_ref text,
  provenance_status text not null default 'confirmed' check (provenance_status in ('confirmed','inferred','planned','legacy')),
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dc_role_assignments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner_admin','dementor','club_member')),
  scope_type text not null default 'system' check (scope_type in ('system','self')),
  status text not null default 'active' check (status in ('planned','active','waiting','suspended','archived','revoked')),
  valid_from timestamptz not null default now(),
  valid_to timestamptz,
  source_system text not null default 'dementor-club',
  source_ref text,
  provenance_status text not null default 'confirmed' check (provenance_status in ('confirmed','inferred','planned','legacy')),
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(profile_id, role, scope_type)
);

create table if not exists public.dc_entities (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('program','event','project')),
  slug text not null,
  title text not null,
  status text not null,
  summary text,
  source_system text not null default 'dementor-club',
  source_ref text,
  provenance_status text not null default 'confirmed' check (provenance_status in ('confirmed','inferred','planned','legacy')),
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(entity_type, slug)
);

create table if not exists public.dc_programs (
  entity_id uuid primary key references public.dc_entities(id) on delete cascade,
  program_type text not null check (program_type in ('course','practice','experience','workshop','other')),
  delivery_mode text not null check (delivery_mode in ('self_paced','adaptive_digital','recurring','cohort','physical','hybrid')),
  content_summary text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.dc_events (
  entity_id uuid primary key references public.dc_entities(id) on delete cascade,
  location text,
  capacity integer check (capacity is null or capacity > 0),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.dc_entity_assignments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  entity_id uuid not null references public.dc_entities(id) on delete cascade,
  role text not null,
  status text not null default 'active' check (status in ('planned','active','waiting','suspended','archived','revoked')),
  valid_from timestamptz not null default now(),
  valid_to timestamptz,
  source_system text not null default 'dementor-club',
  source_ref text,
  provenance_status text not null default 'confirmed' check (provenance_status in ('confirmed','inferred','planned','legacy')),
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(profile_id, entity_id, role)
);

create or replace function public.dc_membership_active(p_profile_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.dc_system_memberships m
    where m.profile_id = p_profile_id
      and m.status = 'active'
      and m.valid_from <= now()
      and (m.valid_to is null or m.valid_to > now())
  );
$$;

create or replace function public.dc_has_role(p_role text, p_profile_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.dc_membership_active(p_profile_id) and exists (
    select 1 from public.dc_role_assignments r
    where r.profile_id = p_profile_id
      and r.role = p_role
      and r.status = 'active'
      and r.valid_from <= now()
      and (r.valid_to is null or r.valid_to > now())
  );
$$;

create or replace function public.dc_is_owner_admin(p_profile_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$ select public.dc_has_role('owner_admin', p_profile_id); $$;

create or replace function public.dc_can_read_entity(p_entity_id uuid, p_profile_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.dc_membership_active(p_profile_id)
    and (
      public.dc_is_owner_admin(p_profile_id)
      or exists (
        select 1 from public.dc_entity_assignments a
        where a.profile_id = p_profile_id
          and a.entity_id = p_entity_id
          and a.status = 'active'
          and a.valid_from <= now()
          and (a.valid_to is null or a.valid_to > now())
      )
    );
$$;

alter table public.dc_system_memberships enable row level security;
alter table public.dc_role_assignments enable row level security;
alter table public.dc_entities enable row level security;
alter table public.dc_programs enable row level security;
alter table public.dc_events enable row level security;
alter table public.dc_entity_assignments enable row level security;

drop policy if exists dc_memberships_select on public.dc_system_memberships;
create policy dc_memberships_select on public.dc_system_memberships for select to authenticated
using (profile_id = auth.uid() or public.dc_is_owner_admin());

drop policy if exists dc_roles_select on public.dc_role_assignments;
create policy dc_roles_select on public.dc_role_assignments for select to authenticated
using (profile_id = auth.uid() or public.dc_is_owner_admin());

drop policy if exists dc_entities_select on public.dc_entities;
create policy dc_entities_select on public.dc_entities for select to authenticated
using (public.dc_can_read_entity(id));

drop policy if exists dc_programs_select on public.dc_programs;
create policy dc_programs_select on public.dc_programs for select to authenticated
using (public.dc_can_read_entity(entity_id));

drop policy if exists dc_events_select on public.dc_events;
create policy dc_events_select on public.dc_events for select to authenticated
using (public.dc_can_read_entity(entity_id));

drop policy if exists dc_assignments_select on public.dc_entity_assignments;
create policy dc_assignments_select on public.dc_entity_assignments for select to authenticated
using (profile_id = auth.uid() or public.dc_is_owner_admin());

grant select on public.dc_system_memberships, public.dc_role_assignments, public.dc_entities, public.dc_programs, public.dc_events, public.dc_entity_assignments to authenticated;
grant execute on function public.dc_membership_active(uuid), public.dc_has_role(text,uuid), public.dc_is_owner_admin(uuid), public.dc_can_read_entity(uuid,uuid) to authenticated;

insert into public.dc_system_memberships(profile_id,status,source_ref,provenance_status,confirmed_at)
values
  ('e9b8ec1d-76be-4607-bb5b-63c48c1b80fa','active','operations/AUTH_SYNC_AND_ACCESS_BASELINE_2026-08-28.md','confirmed',now()),
  ('8c79a5a1-88a9-41cc-98d7-a487df690674','active','operations/AUTH_SYNC_AND_ACCESS_BASELINE_2026-08-28.md','confirmed',now())
on conflict (profile_id) do update set status=excluded.status, source_ref=excluded.source_ref, provenance_status=excluded.provenance_status, confirmed_at=excluded.confirmed_at, updated_at=now();

insert into public.dc_role_assignments(profile_id,role,scope_type,status,source_ref,provenance_status,confirmed_at)
values
  ('e9b8ec1d-76be-4607-bb5b-63c48c1b80fa','owner_admin','system','active','operations/AUTH_SYNC_AND_ACCESS_BASELINE_2026-08-28.md','confirmed',now()),
  ('8c79a5a1-88a9-41cc-98d7-a487df690674','owner_admin','system','active','operations/AUTH_SYNC_AND_ACCESS_BASELINE_2026-08-28.md','confirmed',now())
on conflict (profile_id,role,scope_type) do update set status=excluded.status, source_ref=excluded.source_ref, provenance_status=excluded.provenance_status, confirmed_at=excluded.confirmed_at, updated_at=now();

insert into public.dc_entities(entity_type,slug,title,status,summary,source_ref,provenance_status,confirmed_at)
values
 ('program','dumai-s-opasnostyu','Думай с опасностью','approved-draft','Курс последовательной деградации уверенности','courses/dumai-s-opasnostyu.md','confirmed',now()),
 ('program','dengi-na-veter','Деньги на ветер','mvp-in-development','Цифровой адаптивный карточечный курс','courses/dengi-na-veter.md','confirmed',now()),
 ('program','slaboumie-i-otvaga','Слабоумие и отвага','planned','Физический experience-program: разговор → авиационный опыт → разговор','courses/slaboumie-i-otvaga.md','confirmed',now()),
 ('program','ne-komanda','НЕ КОМАНДА','active','Регулярная онлайн-практика','courses/ne-komanda.md','confirmed',now()),
 ('event','fuengirola','Фуэнхирола','planned','Лаборатория несовместимых очевидностей','events/fuengirola.md','confirmed',now())
on conflict (entity_type,slug) do update set title=excluded.title,status=excluded.status,summary=excluded.summary,source_ref=excluded.source_ref,provenance_status=excluded.provenance_status,confirmed_at=excluded.confirmed_at,updated_at=now();

insert into public.dc_programs(entity_id,program_type,delivery_mode,content_summary,metadata)
select id,'course','self_paced','7 модулей · Карта опасности · web/self-paced',jsonb_build_object('dementor','Валентин Лосев') from public.dc_entities where entity_type='program' and slug='dumai-s-opasnostyu'
on conflict (entity_id) do update set program_type=excluded.program_type,delivery_mode=excluded.delivery_mode,content_summary=excluded.content_summary,metadata=excluded.metadata;

insert into public.dc_programs(entity_id,program_type,delivery_mode,content_summary,metadata)
select id,'course','adaptive_digital','8+ карточек · branching · local adaptive MVP',jsonb_build_object('dementor','Никита') from public.dc_entities where entity_type='program' and slug='dengi-na-veter'
on conflict (entity_id) do update set program_type=excluded.program_type,delivery_mode=excluded.delivery_mode,content_summary=excluded.content_summary,metadata=excluded.metadata;

insert into public.dc_programs(entity_id,program_type,delivery_mode,content_summary,metadata)
select id,'experience','physical','Варшава / Гданьск · разговор → авиационный опыт → разговор',jsonb_build_object('dementor','Евгений','runs_status','planned') from public.dc_entities where entity_type='program' and slug='slaboumie-i-otvaga'
on conflict (entity_id) do update set program_type=excluded.program_type,delivery_mode=excluded.delivery_mode,content_summary=excluded.content_summary,metadata=excluded.metadata;

insert into public.dc_programs(entity_id,program_type,delivery_mode,content_summary,metadata)
select id,'practice','recurring','Каждый понедельник · 10:00 · Europe/Madrid',jsonb_build_object('dementor','Габиль','schedule','Понедельник 10:00','timezone','Europe/Madrid') from public.dc_entities where entity_type='program' and slug='ne-komanda'
on conflict (entity_id) do update set program_type=excluded.program_type,delivery_mode=excluded.delivery_mode,content_summary=excluded.content_summary,metadata=excluded.metadata;

insert into public.dc_events(entity_id,location,capacity,metadata)
select id,'Fuengirola, Spain',7,jsonb_build_object('dementor','Габиль','visibility','member-details-after-onboarding') from public.dc_entities where entity_type='event' and slug='fuengirola'
on conflict (entity_id) do update set location=excluded.location,capacity=excluded.capacity,metadata=excluded.metadata;

insert into public.dc_entity_assignments(profile_id,entity_id,role,status,source_ref,provenance_status,confirmed_at)
select '8c79a5a1-88a9-41cc-98d7-a487df690674', id, 'author', 'active', 'courses/dengi-na-veter.md', 'confirmed', now()
from public.dc_entities where entity_type='program' and slug='dengi-na-veter'
on conflict (profile_id,entity_id,role) do update set status=excluded.status,source_ref=excluded.source_ref,provenance_status=excluded.provenance_status,confirmed_at=excluded.confirmed_at,updated_at=now();

insert into public.dc_entity_assignments(profile_id,entity_id,role,status,source_ref,provenance_status,confirmed_at)
select 'e9b8ec1d-76be-4607-bb5b-63c48c1b80fa', id, 'dementor', 'active', 'courses/slaboumie-i-otvaga.md', 'confirmed', now()
from public.dc_entities where entity_type='program' and slug='slaboumie-i-otvaga'
on conflict (profile_id,entity_id,role) do update set status=excluded.status,source_ref=excluded.source_ref,provenance_status=excluded.provenance_status,confirmed_at=excluded.confirmed_at,updated_at=now();