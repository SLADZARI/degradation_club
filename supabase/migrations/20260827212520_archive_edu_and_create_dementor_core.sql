begin;

create schema if not exists legacy_edu;

-- Archive the complete old EDU domain without deleting data.
alter table if exists public.feedback set schema legacy_edu;
alter table if exists public.recommendations set schema legacy_edu;
alter table if exists public.tasks set schema legacy_edu;
alter table if exists public.session_links set schema legacy_edu;
alter table if exists public.session_summaries set schema legacy_edu;
alter table if exists public.sessions set schema legacy_edu;
alter table if exists public.employee_profiles set schema legacy_edu;
alter table if exists public.mentor_assignments set schema legacy_edu;
alter table if exists public.profiles set schema legacy_edu;
alter table if exists public.departments set schema legacy_edu;
alter table if exists public.companies set schema legacy_edu;

-- Fresh identity profile for Dementor Club.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy profiles_select_own
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy profiles_update_own
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Rebuild the auth trigger function for the club identity model only.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon;
revoke all on function public.handle_new_user() from authenticated;

-- Backfill existing Google/Auth users into the new profiles table.
insert into public.profiles (id, email, full_name, avatar_url, created_at, updated_at)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
  coalesce(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture'),
  coalesce(u.created_at, now()),
  coalesce(u.updated_at, now())
from auth.users u
on conflict (id) do nothing;

-- Public join applications. Auth is optional by design.
create table public.join_applications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  email text not null,
  full_name text,
  answers jsonb not null default '{}'::jsonb,
  status text not null default 'submitted' check (status in ('submitted','reviewing','accepted','rejected','withdrawn')),
  source text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);
create index join_applications_profile_id_idx on public.join_applications(profile_id);
create index join_applications_email_idx on public.join_applications(email);
create index join_applications_status_idx on public.join_applications(status);
alter table public.join_applications enable row level security;
create policy join_applications_anon_insert
  on public.join_applications for insert
  to anon
  with check (profile_id is null and status = 'submitted' and reviewed_at is null);
create policy join_applications_auth_insert
  on public.join_applications for insert
  to authenticated
  with check ((profile_id is null or profile_id = (select auth.uid())) and status = 'submitted' and reviewed_at is null);
create policy join_applications_select_own
  on public.join_applications for select
  to authenticated
  using (profile_id = (select auth.uid()));

-- Event registrations reference canonical Git entity IDs, not duplicated event content.
create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  profile_id uuid references public.profiles(id) on delete set null,
  email text not null,
  full_name text,
  party_size integer not null default 1 check (party_size between 1 and 20),
  status text not null default 'registered' check (status in ('registered','waitlisted','confirmed','cancelled','attended','no_show')),
  created_at timestamptz not null default now(),
  checked_in_at timestamptz
);
create index event_registrations_event_id_idx on public.event_registrations(event_id);
create index event_registrations_profile_id_idx on public.event_registrations(profile_id);
create index event_registrations_email_idx on public.event_registrations(email);
create index event_registrations_status_idx on public.event_registrations(status);
alter table public.event_registrations enable row level security;
create policy event_registrations_anon_insert
  on public.event_registrations for insert
  to anon
  with check (profile_id is null and status = 'registered' and checked_in_at is null);
create policy event_registrations_auth_insert
  on public.event_registrations for insert
  to authenticated
  with check ((profile_id is null or profile_id = (select auth.uid())) and status = 'registered' and checked_in_at is null);
create policy event_registrations_select_own
  on public.event_registrations for select
  to authenticated
  using (profile_id = (select auth.uid()));

-- Course/program enrolment, again keyed to canonical Git course IDs.
create table public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id text not null,
  profile_id uuid references public.profiles(id) on delete set null,
  email text not null,
  full_name text,
  status text not null default 'applied' check (status in ('applied','accepted','active','completed','cancelled','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index course_enrollments_course_id_idx on public.course_enrollments(course_id);
create index course_enrollments_profile_id_idx on public.course_enrollments(profile_id);
create index course_enrollments_email_idx on public.course_enrollments(email);
create index course_enrollments_status_idx on public.course_enrollments(status);
alter table public.course_enrollments enable row level security;
create policy course_enrollments_anon_insert
  on public.course_enrollments for insert
  to anon
  with check (profile_id is null and status = 'applied');
create policy course_enrollments_auth_insert
  on public.course_enrollments for insert
  to authenticated
  with check ((profile_id is null or profile_id = (select auth.uid())) and status = 'applied');
create policy course_enrollments_select_own
  on public.course_enrollments for select
  to authenticated
  using (profile_id = (select auth.uid()));

-- Public contact inbox. No public SELECT policy by design.
create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  name text,
  email text not null,
  message text not null,
  source_page text,
  status text not null default 'new' check (status in ('new','open','resolved','spam')),
  created_at timestamptz not null default now()
);
create index contact_requests_profile_id_idx on public.contact_requests(profile_id);
create index contact_requests_email_idx on public.contact_requests(email);
create index contact_requests_status_idx on public.contact_requests(status);
alter table public.contact_requests enable row level security;
create policy contact_requests_anon_insert
  on public.contact_requests for insert
  to anon
  with check (profile_id is null and status = 'new');
create policy contact_requests_auth_insert
  on public.contact_requests for insert
  to authenticated
  with check ((profile_id is null or profile_id = (select auth.uid())) and status = 'new');

commit;