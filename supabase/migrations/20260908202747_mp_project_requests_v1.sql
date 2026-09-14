create table if not exists public.mp_project_requests (
  id uuid primary key default gen_random_uuid(),
  requester_user_id uuid not null references auth.users(id) on delete cascade,
  requester_email text not null,
  project_name text not null,
  company_name text null,
  summary text not null,
  goal text not null,
  website_url text null,
  request_state text not null default 'SUBMITTED',
  reviewed_by uuid null references auth.users(id),
  reviewed_at timestamptz null,
  decision_note text null,
  provisioned_project_id uuid null references public.mp_project_refs(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mp_project_requests_state_check check (request_state in ('SUBMITTED', 'REVIEW', 'APPROVED', 'PROVISIONED', 'REJECTED')),
  constraint mp_project_requests_project_name_check check (char_length(btrim(project_name)) between 2 and 160),
  constraint mp_project_requests_email_check check (char_length(btrim(requester_email)) between 3 and 320),
  constraint mp_project_requests_company_name_check check (company_name is null or char_length(btrim(company_name)) between 1 and 160),
  constraint mp_project_requests_summary_check check (char_length(btrim(summary)) between 10 and 2000),
  constraint mp_project_requests_goal_check check (char_length(btrim(goal)) between 10 and 2000),
  constraint mp_project_requests_website_check check (website_url is null or char_length(btrim(website_url)) between 1 and 500)
);
create index if not exists mp_project_requests_requester_idx on public.mp_project_requests (requester_user_id, created_at desc);
create index if not exists mp_project_requests_state_idx on public.mp_project_requests (request_state, created_at asc);
alter table public.mp_project_requests enable row level security;
revoke all on public.mp_project_requests from public;
grant select, insert on public.mp_project_requests to authenticated;
drop policy if exists mp_project_requests_select on public.mp_project_requests;
create policy mp_project_requests_select on public.mp_project_requests for select to authenticated using (requester_user_id = auth.uid() or mp_private.current_user_is_mp_owner());
drop policy if exists mp_project_requests_insert on public.mp_project_requests;
create policy mp_project_requests_insert on public.mp_project_requests for insert to authenticated with check (requester_user_id = auth.uid() and lower(btrim(requester_email)) = lower(coalesce(auth.jwt() ->> 'email', '')) and request_state = 'SUBMITTED' and reviewed_by is null and reviewed_at is null and decision_note is null and provisioned_project_id is null);
create or replace function public.mp_transition_project_request(p_request_id uuid,p_target_state text,p_decision_note text default null)
returns public.mp_project_requests
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_row public.mp_project_requests%rowtype;
  next_row public.mp_project_requests%rowtype;
begin
  if not mp_private.current_user_is_mp_owner() then
    raise exception 'project request transition requires PLATFORM_OWNER' using errcode = '42501';
  end if;
  select * into current_row from public.mp_project_requests where id = p_request_id for update;
  if not found then raise exception 'project request not found' using errcode = 'P0002'; end if;
  if not ((current_row.request_state = 'SUBMITTED' and p_target_state = 'REVIEW') or (current_row.request_state = 'REVIEW' and p_target_state in ('APPROVED', 'REJECTED'))) then
    raise exception 'invalid project request transition: % -> %', current_row.request_state, p_target_state using errcode = '22023';
  end if;
  update public.mp_project_requests
     set request_state = p_target_state,
         reviewed_by = auth.uid(),
         reviewed_at = now(),
         decision_note = case when p_target_state in ('APPROVED', 'REJECTED') then nullif(btrim(p_decision_note), '') else decision_note end,
         updated_at = now()
   where id = p_request_id
  returning * into next_row;
  return next_row;
end;
$$;
revoke all on function public.mp_transition_project_request(uuid, text, text) from public;
grant execute on function public.mp_transition_project_request(uuid, text, text) to authenticated;
comment on table public.mp_project_requests is 'WeeklyOS ProjectRequest runtime. Authentication or request approval alone does not create project access.';
comment on function public.mp_transition_project_request(uuid, text, text) is 'PLATFORM_OWNER-only R1 transition guard: SUBMITTED->REVIEW, REVIEW->APPROVED|REJECTED. No provisioning side effects.';;
