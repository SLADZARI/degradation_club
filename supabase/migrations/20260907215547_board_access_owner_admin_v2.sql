-- Board Access & Owner Admin v2
-- Extends existing Board owners; no new membership state, slot grant, or layout table.

-- Canonical Member/Owner reactions.
drop policy if exists dc_artifact_reactions_select_members on public.dc_artifact_reactions;
create policy dc_artifact_reactions_select_members
on public.dc_artifact_reactions for select to authenticated
using (
  ((select public.dc_membership_active()) or (select public.dc_is_owner_admin()))
  and exists (
    select 1 from public.dc_artifacts a
    where a.id = dc_artifact_reactions.artifact_id
      and a.visibility = 'community'
      and a.status in ('active','expired','archived')
  )
);

drop policy if exists dc_artifact_reactions_insert_own on public.dc_artifact_reactions;
create policy dc_artifact_reactions_insert_own
on public.dc_artifact_reactions for insert to authenticated
with check (
  (select auth.uid()) = profile_id
  and ((select public.dc_membership_active()) or (select public.dc_is_owner_admin()))
  and exists (
    select 1 from public.dc_artifacts a
    where a.id = dc_artifact_reactions.artifact_id
      and a.visibility = 'community'
      and a.status = 'active'
      and (a.expires_at is null or a.expires_at > now())
  )
);

drop policy if exists dc_artifact_reactions_delete_own on public.dc_artifact_reactions;
create policy dc_artifact_reactions_delete_own
on public.dc_artifact_reactions for delete to authenticated
using (
  (select auth.uid()) = profile_id
  and ((select public.dc_membership_active()) or (select public.dc_is_owner_admin()))
);

-- Guest response path stays Guest-only; Owner Admin uses canonical response path.
drop policy if exists dc_artifact_responses_insert_guest on public.dc_artifact_responses;
create policy dc_artifact_responses_insert_guest
on public.dc_artifact_responses for insert to authenticated
with check (
  (select auth.uid()) = responder_profile_id
  and status = 'submitted'
  and not (select public.dc_membership_active())
  and not (select public.dc_is_owner_admin())
  and exists (
    select 1 from public.dc_artifacts a
    where a.id = dc_artifact_responses.artifact_id
      and a.author_profile_id <> (select auth.uid())
      and a.visibility = 'community'
      and a.status = 'active'
      and a.published_at is not null
      and (a.starts_at is null or a.starts_at <= now())
      and (a.expires_at is null or a.expires_at > now())
  )
);

drop policy if exists dc_artifact_responses_insert_own on public.dc_artifact_responses;
create policy dc_artifact_responses_insert_own
on public.dc_artifact_responses for insert to authenticated
with check (
  (select auth.uid()) = responder_profile_id
  and status = 'submitted'
  and ((select public.dc_membership_active()) or (select public.dc_is_owner_admin()))
  and exists (
    select 1 from public.dc_artifacts a
    where a.id = dc_artifact_responses.artifact_id
      and a.author_profile_id <> (select auth.uid())
      and a.visibility = 'community'
      and a.status = 'active'
      and (a.expires_at is null or a.expires_at > now())
  )
);

drop policy if exists dc_artifact_responses_update_own on public.dc_artifact_responses;
create policy dc_artifact_responses_update_own
on public.dc_artifact_responses for update to authenticated
using (
  (select auth.uid()) = responder_profile_id
  and ((select public.dc_membership_active()) or (select public.dc_is_owner_admin()))
)
with check (
  (select auth.uid()) = responder_profile_id
  and status in ('submitted','withdrawn')
);

-- Existing Artifact position table remains the one persistent layout owner.
drop policy if exists dc_artifact_board_positions_select_members on public.dc_artifact_board_positions;
create policy dc_artifact_board_positions_select_members
on public.dc_artifact_board_positions for select to authenticated
using (
  ((select public.dc_membership_active()) or (select public.dc_is_owner_admin()))
  and exists (
    select 1 from public.dc_artifacts a
    where a.id = dc_artifact_board_positions.artifact_id
      and a.visibility = 'community'
      and a.status in ('active','expired','archived')
  )
);

drop policy if exists dc_artifact_board_positions_update_own on public.dc_artifact_board_positions;
create policy dc_artifact_board_positions_update_own
on public.dc_artifact_board_positions for update to authenticated
using (
  exists (
    select 1 from public.dc_artifacts a
    where a.id = dc_artifact_board_positions.artifact_id
      and a.visibility = 'community'
      and a.status = 'active'
      and a.published_at is not null
      and (a.expires_at is null or a.expires_at > now())
      and (
        ((select public.dc_membership_active()) and a.author_profile_id = (select auth.uid()))
        or (select public.dc_is_owner_admin())
      )
  )
)
with check (
  exists (
    select 1 from public.dc_artifacts a
    where a.id = dc_artifact_board_positions.artifact_id
      and a.visibility = 'community'
      and a.status = 'active'
      and a.published_at is not null
      and (a.expires_at is null or a.expires_at > now())
      and (
        ((select public.dc_membership_active()) and a.author_profile_id = (select auth.uid()))
        or (select public.dc_is_owner_admin())
      )
  )
);

-- Guest-specific RPCs reject Owner Admin so the role uses canonical Member-style interactions.
create or replace function public.dc_guest_board_response_submit_v1(
  p_artifact_id uuid,
  p_message text default null
) returns uuid
language plpgsql
security invoker
set search_path = 'public', 'pg_temp'
as $$
declare
  v_id uuid;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;
  if public.dc_membership_active() or public.dc_is_owner_admin() then
    raise exception 'MEMBER_USE_CANONICAL_RESPONSE';
  end if;
  insert into public.dc_artifact_responses(artifact_id,responder_profile_id,message,status)
  values (p_artifact_id,auth.uid(),nullif(btrim(p_message),''),'submitted')
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.dc_guest_board_interest_toggle_v1(p_artifact_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = 'public', 'pg_temp'
as $$
declare
  v_uid uuid := auth.uid();
  v_active boolean;
  v_count bigint;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if public.dc_membership_active() or public.dc_is_owner_admin() then
    raise exception 'MEMBER_USE_CANONICAL_REACTION';
  end if;
  if not exists (
    select 1 from public.dc_artifacts a
    where a.id = p_artifact_id
      and a.visibility = 'community'
      and a.status = 'active'
      and a.published_at is not null
      and (a.starts_at is null or a.starts_at <= now())
      and (a.expires_at is null or a.expires_at > now())
  ) then raise exception 'ARTIFACT_NOT_AVAILABLE'; end if;

  if exists (
    select 1 from public.dc_guest_board_interests i
    where i.artifact_id = p_artifact_id and i.profile_id = v_uid
  ) then
    delete from public.dc_guest_board_interests i
    where i.artifact_id = p_artifact_id and i.profile_id = v_uid;
    v_active := false;
  else
    insert into public.dc_guest_board_interests(artifact_id,profile_id)
    values (p_artifact_id,v_uid)
    on conflict (artifact_id,profile_id) do nothing;
    v_active := true;
  end if;

  select count(*)::bigint into v_count
  from public.dc_guest_board_interests i
  where i.artifact_id = p_artifact_id;
  return jsonb_build_object('active',v_active,'count',v_count);
end;
$$;

-- Existing composer RPCs: active Member OR Owner Admin. Owner Admin bypasses slot accounting,
-- but no synthetic membership or slot grant is created.
create or replace function public.dc_create_artifact_draft_v1(
  p_body text,
  p_title text default null,
  p_external_url text default null,
  p_starts_at timestamptz default null,
  p_expires_at timestamptz default null
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_id uuid;
  v_owner boolean;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  v_owner := public.dc_is_owner_admin(v_uid);
  if not public.dc_membership_active(v_uid) and not v_owner then raise exception 'MEMBERSHIP_REQUIRED'; end if;
  if nullif(btrim(p_body),'') is null or char_length(btrim(p_body)) > 4000 then raise exception 'ARTIFACT_BODY_INVALID'; end if;
  if p_title is not null and (nullif(btrim(p_title),'') is null or char_length(btrim(p_title)) > 160) then raise exception 'ARTIFACT_TITLE_INVALID'; end if;
  if p_external_url is not null and char_length(p_external_url) > 1000 then raise exception 'ARTIFACT_URL_INVALID'; end if;
  if p_expires_at is not null and p_starts_at is not null and p_expires_at <= p_starts_at then raise exception 'ARTIFACT_EXPIRY_INVALID'; end if;
  if exists (select 1 from public.dc_artifacts a where a.author_profile_id=v_uid and a.status='draft') then raise exception 'DRAFT_ALREADY_EXISTS'; end if;

  insert into public.dc_artifacts(author_profile_id,artifact_type,title,body,external_url,status,visibility,starts_at,expires_at)
  values (v_uid,'notice',nullif(btrim(coalesce(p_title,'')),''),btrim(p_body),nullif(btrim(coalesce(p_external_url,'')),''),'draft','community',p_starts_at,p_expires_at)
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.dc_update_artifact_draft_v1(
  p_artifact_id uuid,
  p_body text,
  p_title text default null,
  p_external_url text default null,
  p_starts_at timestamptz default null,
  p_expires_at timestamptz default null
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_owner boolean;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  v_owner := public.dc_is_owner_admin(v_uid);
  if not public.dc_membership_active(v_uid) and not v_owner then raise exception 'MEMBERSHIP_REQUIRED'; end if;
  if nullif(btrim(p_body),'') is null or char_length(btrim(p_body)) > 4000 then raise exception 'ARTIFACT_BODY_INVALID'; end if;
  if p_title is not null and (nullif(btrim(p_title),'') is null or char_length(btrim(p_title)) > 160) then raise exception 'ARTIFACT_TITLE_INVALID'; end if;
  if p_external_url is not null and char_length(p_external_url) > 1000 then raise exception 'ARTIFACT_URL_INVALID'; end if;
  if p_expires_at is not null and p_starts_at is not null and p_expires_at <= p_starts_at then raise exception 'ARTIFACT_EXPIRY_INVALID'; end if;

  update public.dc_artifacts
  set title=nullif(btrim(coalesce(p_title,'')),''),
      body=btrim(p_body),
      external_url=nullif(btrim(coalesce(p_external_url,'')),''),
      starts_at=p_starts_at,
      expires_at=p_expires_at,
      updated_at=now()
  where id=p_artifact_id and author_profile_id=v_uid and status='draft';
  if not found then raise exception 'ARTIFACT_DRAFT_NOT_FOUND'; end if;
  return p_artifact_id;
end;
$$;

create or replace function public.dc_publish_artifact_v1(p_artifact_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_owner boolean;
  v_granted integer := 0;
  v_consuming integer := 0;
  v_artifact public.dc_artifacts%rowtype;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  v_owner := public.dc_is_owner_admin(v_uid);
  if not public.dc_membership_active(v_uid) and not v_owner then raise exception 'MEMBERSHIP_REQUIRED'; end if;

  perform 1 from public.profiles p where p.id=v_uid for update;
  update public.dc_artifacts set status='expired',updated_at=now()
  where author_profile_id=v_uid and status='active' and expires_at is not null and expires_at <= now();

  select * into v_artifact from public.dc_artifacts a
  where a.id=p_artifact_id and a.author_profile_id=v_uid for update;
  if v_artifact.id is null or v_artifact.status <> 'draft' then raise exception 'ARTIFACT_DRAFT_NOT_FOUND'; end if;
  if v_artifact.expires_at is not null and v_artifact.expires_at <= now() then raise exception 'ARTIFACT_ALREADY_EXPIRED'; end if;

  if not v_owner then
    select coalesce(sum(g.amount),0)::integer into v_granted
    from public.dc_artifact_slot_grants g where g.profile_id=v_uid;
    select count(*)::integer into v_consuming
    from public.dc_artifacts a
    where a.author_profile_id=v_uid
      and a.status in ('publishing','active')
      and (a.expires_at is null or a.expires_at > now());
    if v_granted - v_consuming <= 0 then raise exception 'NO_ARTIFACT_SLOT_AVAILABLE'; end if;
  end if;

  update public.dc_artifacts set status='active',published_at=now(),updated_at=now()
  where id=p_artifact_id;

  return jsonb_build_object(
    'artifact_id',p_artifact_id,
    'status','active',
    'published_at',now(),
    'owner_admin',v_owner,
    'slots_available',case when v_owner then null else greatest(v_granted-v_consuming-1,0) end
  );
end;
$$;

create or replace function public.dc_close_artifact_v1(p_artifact_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_owner boolean;
  v_old_status text;
  v_author uuid;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  v_owner := public.dc_is_owner_admin(v_uid);

  select a.status,a.author_profile_id into v_old_status,v_author
  from public.dc_artifacts a
  where a.id=p_artifact_id
    and (
      a.author_profile_id=v_uid
      or (v_owner and a.visibility='community' and a.status in ('active','expired','archived'))
    )
  for update;

  if v_old_status is null then raise exception 'ARTIFACT_NOT_FOUND'; end if;
  if v_old_status='draft' and v_author=v_uid then
    update public.dc_artifacts set status='removed',closed_at=now(),updated_at=now() where id=p_artifact_id;
  elsif v_old_status in ('active','expired') then
    update public.dc_artifacts set status='archived',closed_at=now(),updated_at=now() where id=p_artifact_id;
  elsif v_old_status in ('archived','removed') then
    null;
  else
    raise exception 'ARTIFACT_STATE_NOT_CLOSABLE';
  end if;

  return jsonb_build_object(
    'artifact_id',p_artifact_id,
    'previous_status',v_old_status,
    'status',(select status from public.dc_artifacts where id=p_artifact_id),
    'moderated_by_owner_admin',(v_owner and v_author<>v_uid)
  );
end;
$$;
