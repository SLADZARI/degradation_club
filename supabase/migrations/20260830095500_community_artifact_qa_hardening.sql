-- Community v1 production QA hardening.
-- 1) Restrict first stable Artifact attachment surface to images <= 4 MiB.
-- 2) Prepare a non-blocking Telegram distribution outbox.

begin;

update storage.buckets
set file_size_limit = 4194304,
    allowed_mime_types = array['image/jpeg','image/png','image/webp']::text[]
where id = 'dc-community-artifacts';

create table if not exists public.dc_distribution_outbox (
  id uuid primary key default gen_random_uuid(),
  artifact_id uuid not null references public.dc_artifacts(id) on delete cascade,
  channel text not null default 'telegram' check (channel in ('telegram')),
  status text not null default 'pending' check (status in ('pending','processing','sent','failed','cancelled')),
  payload jsonb not null default '{}'::jsonb,
  attempts integer not null default 0 check (attempts >= 0),
  available_at timestamptz not null default now(),
  locked_at timestamptz,
  sent_at timestamptz,
  external_ref text,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (artifact_id, channel)
);

alter table public.dc_distribution_outbox enable row level security;
revoke all on table public.dc_distribution_outbox from public, anon, authenticated;

create or replace function public.dc_enqueue_artifact_distribution_v1(
  p_artifact_id uuid,
  p_channel text default 'telegram'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_outbox_id uuid;
begin
  if v_user is null then
    raise exception 'Authentication required';
  end if;

  if p_channel <> 'telegram' then
    raise exception 'Unsupported distribution channel';
  end if;

  if not exists (
    select 1
    from public.dc_artifacts a
    where a.id = p_artifact_id
      and a.author_profile_id = v_user
      and a.status = 'active'
      and a.visibility = 'community'
  ) then
    raise exception 'Artifact is not eligible for distribution';
  end if;

  insert into public.dc_distribution_outbox (artifact_id, channel, payload)
  values (
    p_artifact_id,
    p_channel,
    jsonb_build_object('artifact_id', p_artifact_id, 'source', 'community_board_v1')
  )
  on conflict (artifact_id, channel) do nothing
  returning id into v_outbox_id;

  if v_outbox_id is null then
    select id into v_outbox_id
    from public.dc_distribution_outbox
    where artifact_id = p_artifact_id and channel = p_channel;
  end if;

  return v_outbox_id;
end;
$$;

revoke all on function public.dc_enqueue_artifact_distribution_v1(uuid,text) from public, anon;
grant execute on function public.dc_enqueue_artifact_distribution_v1(uuid,text) to authenticated;

commit;
