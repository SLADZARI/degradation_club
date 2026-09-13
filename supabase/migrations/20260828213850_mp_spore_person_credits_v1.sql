create table if not exists public.mp_spore_credits (
  id uuid primary key default gen_random_uuid(),
  award_id uuid not null references public.mp_spore_awards(id) on delete cascade,
  person_key text,
  user_id uuid references auth.users(id) on delete cascade,
  side text not null check (side in ('PILGRIMS','CLIENT','PARTNER')),
  role text not null,
  contribution text not null,
  score integer check (score is null or score >= 0),
  status text not null default 'PENDING' check (status in ('PENDING','CONFIRMED','VOID')),
  evidence_ref text,
  confidence text not null default 'MEDIUM' check (confidence in ('LOW','MEDIUM','HIGH')),
  source_ref text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (person_key is not null or user_id is not null)
);

create unique index if not exists mp_spore_credits_identity_idx
  on public.mp_spore_credits (award_id, coalesce(person_key, ''), coalesce(user_id::text, ''), role, contribution);

alter table public.mp_spore_credits enable row level security;

create policy mp_spore_credits_select on public.mp_spore_credits for select to authenticated
using (
  user_id = auth.uid()
  or mp_private.current_user_is_mp_owner()
  or exists (
    select 1 from public.mp_spore_awards a
    where a.id = award_id
      and mp_private.current_user_manages_project(a.project_id)
  )
);

create policy mp_spore_credits_owner_manage on public.mp_spore_credits for all to authenticated
using (
  mp_private.current_user_is_mp_owner()
  or exists (
    select 1 from public.mp_spore_awards a
    where a.id = award_id
      and mp_private.current_user_manages_project(a.project_id)
  )
)
with check (
  mp_private.current_user_is_mp_owner()
  or exists (
    select 1 from public.mp_spore_awards a
    where a.id = award_id
      and mp_private.current_user_manages_project(a.project_id)
  )
);

grant select, insert, update, delete on public.mp_spore_credits to authenticated;
revoke all on public.mp_spore_credits from anon;