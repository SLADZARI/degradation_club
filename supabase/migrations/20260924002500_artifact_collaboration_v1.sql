-- Artifact Collaboration v1
-- Branch-only schema draft. LIVE DB APPLY IS NOT AUTHORIZED.
-- Extends canonical Artifact/slot/relation/media owners and adds one Artifact-scoped participation ledger.

begin;

-- 1) Canonical Artifact visibility extension. CIRCLE is Idea-only.
alter table public.dc_artifacts
  drop constraint dc_artifacts_visibility_check;

alter table public.dc_artifacts
  add constraint dc_artifacts_visibility_check
  check (
    visibility in ('community','circle')
    and (visibility <> 'circle' or artifact_type = 'idea')
  );

-- 2) One new Artifact-scoped participation owner: append-only transition ledger.
create table public.dc_artifact_participation_events (
  id uuid primary key default gen_random_uuid(),
  artifact_id uuid not null references public.dc_artifacts(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  transition_no integer not null,
  state text not null,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),

  constraint dc_artifact_participation_transition_no_check
    check (transition_no > 0),
  constraint dc_artifact_participation_state_check
    check (state in ('INVITED','JOINED','DECLINED','LEFT','REMOVED')),
  unique (artifact_id, profile_id, transition_no)
);

create index dc_artifact_participation_artifact_current_idx
  on public.dc_artifact_participation_events(artifact_id, profile_id, transition_no desc);

create index dc_artifact_participation_profile_current_idx
  on public.dc_artifact_participation_events(profile_id, artifact_id, transition_no desc);

alter table public.dc_artifact_participation_events enable row level security;
revoke all on table public.dc_artifact_participation_events from public, anon, authenticated;

comment on table public.dc_artifact_participation_events is
  'Artifact Collaboration v1 append-only participation transition ledger. Author ownership remains dc_artifacts.author_profile_id.';

-- Durable actor provenance for explicit Owner Admin capacity grants.
alter table public.dc_artifact_slot_grants
  add column granted_by_profile_id uuid references public.profiles(id) on delete set null;

-- 3) Current-viewer participation state. Never accepts an arbitrary viewer id.
create or replace function public.dc_my_artifact_participation_state_v1(p_artifact_id uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $function$
  select e.state
  from public.dc_artifact_participation_events e
  where auth.uid() is not null
    and e.artifact_id = p_artifact_id
    and e.profile_id = auth.uid()
  order by e.transition_no desc
  limit 1;
$function$;

revoke all on function public.dc_my_artifact_participation_state_v1(uuid) from public, anon, authenticated;
grant execute on function public.dc_my_artifact_participation_state_v1(uuid) to authenticated;

-- Canonical authenticated content-read predicate for published/history-visible Artifacts.
-- COMMUNITY remains readable to authenticated Board users.
-- CIRCLE is author / current INVITED / current JOINED / Owner Admin only.
create or replace function public.dc_can_read_artifact_v1(p_artifact_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select auth.uid() is not null
    and exists (
      select 1
      from public.dc_artifacts a
      where a.id = p_artifact_id
        and a.published_at is not null
        and a.status in ('active','expired','archived')
        and (
          a.visibility = 'community'
          or a.author_profile_id = auth.uid()
          or public.dc_is_owner_admin(auth.uid())
          or (
            a.visibility = 'circle'
            and public.dc_my_artifact_participation_state_v1(a.id) in ('INVITED','JOINED')
          )
        )
    );
$function$;

revoke all on function public.dc_can_read_artifact_v1(uuid) from public, anon, authenticated;
grant execute on function public.dc_can_read_artifact_v1(uuid) to authenticated;

-- Interaction predicate: INVITED is read-only until JOINED.
create or replace function public.dc_can_interact_artifact_v1(p_artifact_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select auth.uid() is not null
    and exists (
      select 1
      from public.dc_artifacts a
      where a.id = p_artifact_id
        and a.published_at is not null
        and a.status in ('active','expired','archived')
        and a.board_hidden_at is null
        and (
          a.visibility = 'community'
          or a.author_profile_id = auth.uid()
          or public.dc_is_owner_admin(auth.uid())
          or (
            a.visibility = 'circle'
            and public.dc_my_artifact_participation_state_v1(a.id) = 'JOINED'
          )
        )
    );
$function$;

revoke all on function public.dc_can_interact_artifact_v1(uuid) from public, anon, authenticated;
grant execute on function public.dc_can_interact_artifact_v1(uuid) to authenticated;

-- Storage helper: private bucket read follows exact Artifact ACL.
create or replace function public.dc_can_read_artifact_media_object_v1(
  p_bucket text,
  p_object_name text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select auth.uid() is not null
    and p_bucket = 'dc-community-artifacts'
    and (
      split_part(p_object_name,'/',1) = auth.uid()::text
      or public.dc_is_owner_admin(auth.uid())
      or exists (
        select 1
        from public.dc_artifact_media m
        where m.storage_bucket = p_bucket
          and m.storage_path = p_object_name
          and public.dc_can_read_artifact_v1(m.artifact_id)
      )
    );
$function$;

revoke all on function public.dc_can_read_artifact_media_object_v1(text,text) from public, anon, authenticated;
grant execute on function public.dc_can_read_artifact_media_object_v1(text,text) to authenticated;

-- 4) Internal append transition owner. No client EXECUTE grant.
create or replace function public.dc_append_artifact_participation_event_v1(
  p_artifact_id uuid,
  p_profile_id uuid,
  p_state text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_state text := upper(btrim(coalesce(p_state,'')));
  v_artifact public.dc_artifacts%rowtype;
  v_current_state text;
  v_current_no integer := 0;
  v_id uuid;
  v_owner_admin boolean := false;
begin
  if v_uid is null then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;

  if v_state not in ('INVITED','JOINED','DECLINED','LEFT','REMOVED') then
    raise exception 'PARTICIPATION_STATE_INVALID';
  end if;

  if not exists (select 1 from public.profiles p where p.id = p_profile_id) then
    raise exception 'PARTICIPANT_PROFILE_NOT_FOUND';
  end if;

  select * into v_artifact
  from public.dc_artifacts a
  where a.id = p_artifact_id
  for update;

  if v_artifact.id is null
     or v_artifact.artifact_type <> 'idea'
     or v_artifact.published_at is null
     or v_artifact.status not in ('active','expired','archived') then
    raise exception 'ARTIFACT_IDEA_NOT_AVAILABLE';
  end if;

  if p_profile_id = v_artifact.author_profile_id then
    raise exception 'ARTIFACT_AUTHOR_IS_NOT_PARTICIPANT';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_artifact_id::text || ':' || p_profile_id::text, 0)
  );

  select e.state, e.transition_no
    into v_current_state, v_current_no
  from public.dc_artifact_participation_events e
  where e.artifact_id = p_artifact_id
    and e.profile_id = p_profile_id
  order by e.transition_no desc
  limit 1;

  v_owner_admin := public.dc_is_owner_admin(v_uid);

  if v_state = 'INVITED' then
    if not (v_uid = v_artifact.author_profile_id or v_owner_admin) then
      raise exception 'PARTICIPATION_AUTHOR_OR_OWNER_ADMIN_REQUIRED' using errcode = '42501';
    end if;
    if v_current_state in ('INVITED','JOINED') then
      raise exception 'PARTICIPATION_ALREADY_CURRENT';
    end if;
  elsif v_state in ('JOINED','DECLINED') then
    if v_uid <> p_profile_id then
      raise exception 'PARTICIPATION_SELF_ACTION_REQUIRED' using errcode = '42501';
    end if;
    if v_current_state is distinct from 'INVITED' then
      raise exception 'PARTICIPATION_INVITE_REQUIRED';
    end if;
  elsif v_state = 'LEFT' then
    if v_uid <> p_profile_id then
      raise exception 'PARTICIPATION_SELF_ACTION_REQUIRED' using errcode = '42501';
    end if;
    if v_current_state is distinct from 'JOINED' then
      raise exception 'PARTICIPATION_JOIN_REQUIRED';
    end if;
  elsif v_state = 'REMOVED' then
    if not (v_uid = v_artifact.author_profile_id or v_owner_admin) then
      raise exception 'PARTICIPATION_AUTHOR_OR_OWNER_ADMIN_REQUIRED' using errcode = '42501';
    end if;
    if v_current_state not in ('INVITED','JOINED') then
      raise exception 'PARTICIPATION_CURRENT_STATE_REQUIRED';
    end if;
  end if;

  insert into public.dc_artifact_participation_events(
    artifact_id,
    profile_id,
    transition_no,
    state,
    actor_profile_id
  ) values (
    p_artifact_id,
    p_profile_id,
    coalesce(v_current_no,0) + 1,
    v_state,
    v_uid
  )
  returning id into v_id;

  return v_id;
end;
$function$;

revoke all on function public.dc_append_artifact_participation_event_v1(uuid,uuid,text)
  from public, anon, authenticated, service_role;

-- 5) Bounded safe registered-profile lookup for author / Owner Admin only.
create or replace function public.dc_artifact_invite_candidates_v1(
  p_artifact_id uuid,
  p_query text,
  p_limit integer default 12
)
returns table(
  profile_id uuid,
  display_name text,
  nickname text,
  avatar_url text,
  current_state text
)
language plpgsql
stable
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_query text := lower(btrim(coalesce(p_query,'')));
  v_limit integer := greatest(1, least(coalesce(p_limit,12),20));
  v_artifact public.dc_artifacts%rowtype;
begin
  if v_uid is null then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;

  if char_length(v_query) < 2 or char_length(v_query) > 80 then
    raise exception 'INVITE_QUERY_INVALID';
  end if;

  select * into v_artifact
  from public.dc_artifacts a
  where a.id = p_artifact_id;

  if v_artifact.id is null
     or v_artifact.artifact_type <> 'idea'
     or v_artifact.published_at is null
     or v_artifact.status not in ('active','expired','archived') then
    raise exception 'ARTIFACT_IDEA_NOT_AVAILABLE';
  end if;

  if not (v_artifact.author_profile_id = v_uid or public.dc_is_owner_admin(v_uid)) then
    raise exception 'PARTICIPATION_AUTHOR_OR_OWNER_ADMIN_REQUIRED' using errcode = '42501';
  end if;

  return query
  select
    p.id,
    coalesce(
      nullif(btrim(p.display_name),''),
      nullif(btrim(p.nickname),''),
      nullif(btrim(p.full_name),''),
      'Участник клуба'
    ) as display_name,
    nullif(btrim(p.nickname),'') as nickname,
    p.avatar_url,
    latest.state
  from public.profiles p
  left join lateral (
    select e.state
    from public.dc_artifact_participation_events e
    where e.artifact_id = p_artifact_id
      and e.profile_id = p.id
    order by e.transition_no desc
    limit 1
  ) latest on true
  where p.id <> v_artifact.author_profile_id
    and position(
      v_query in lower(
        coalesce(p.display_name,'') || ' ' ||
        coalesce(p.nickname,'') || ' ' ||
        coalesce(p.full_name,'')
      )
    ) > 0
  order by
    coalesce(nullif(btrim(p.display_name),''),nullif(btrim(p.nickname),''),nullif(btrim(p.full_name),''),p.id::text),
    p.id
  limit v_limit;
end;
$function$;

revoke all on function public.dc_artifact_invite_candidates_v1(uuid,text,integer)
  from public, anon, authenticated;
grant execute on function public.dc_artifact_invite_candidates_v1(uuid,text,integer)
  to authenticated;

create or replace function public.dc_artifact_participants_read_v1(p_artifact_id uuid)
returns table(
  profile_id uuid,
  display_name text,
  nickname text,
  avatar_url text,
  participation_state text,
  state_changed_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $function$
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;

  if not public.dc_can_read_artifact_v1(p_artifact_id) then
    raise exception 'ARTIFACT_NOT_AVAILABLE';
  end if;

  return query
  with latest as (
    select distinct on (e.profile_id)
      e.profile_id,
      e.state,
      e.created_at
    from public.dc_artifact_participation_events e
    where e.artifact_id = p_artifact_id
    order by e.profile_id, e.transition_no desc
  )
  select
    p.id,
    coalesce(
      nullif(btrim(p.display_name),''),
      nullif(btrim(p.nickname),''),
      nullif(btrim(p.full_name),''),
      'Участник клуба'
    ),
    nullif(btrim(p.nickname),''),
    p.avatar_url,
    l.state,
    l.created_at
  from latest l
  join public.profiles p on p.id = l.profile_id
  where l.state in ('INVITED','JOINED')
  order by l.created_at, p.id;
end;
$function$;

revoke all on function public.dc_artifact_participants_read_v1(uuid)
  from public, anon, authenticated;
grant execute on function public.dc_artifact_participants_read_v1(uuid)
  to authenticated;

-- Explicit mutation surface. No generic arbitrary-state RPC.
create or replace function public.dc_artifact_invite_v1(
  p_artifact_id uuid,
  p_profile_id uuid
)
returns uuid
language sql
security definer
set search_path = ''
as $function$
  select public.dc_append_artifact_participation_event_v1(
    p_artifact_id,
    p_profile_id,
    'INVITED'
  );
$function$;

revoke all on function public.dc_artifact_invite_v1(uuid,uuid)
  from public, anon, authenticated;
grant execute on function public.dc_artifact_invite_v1(uuid,uuid)
  to authenticated;

create or replace function public.dc_artifact_invitation_respond_v1(
  p_artifact_id uuid,
  p_decision text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_decision text := upper(btrim(coalesce(p_decision,'')));
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;
  if v_decision not in ('JOINED','DECLINED') then
    raise exception 'INVITATION_DECISION_INVALID';
  end if;
  return public.dc_append_artifact_participation_event_v1(
    p_artifact_id,
    auth.uid(),
    v_decision
  );
end;
$function$;

revoke all on function public.dc_artifact_invitation_respond_v1(uuid,text)
  from public, anon, authenticated;
grant execute on function public.dc_artifact_invitation_respond_v1(uuid,text)
  to authenticated;

create or replace function public.dc_artifact_leave_v1(p_artifact_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;
  return public.dc_append_artifact_participation_event_v1(
    p_artifact_id,
    auth.uid(),
    'LEFT'
  );
end;
$function$;

revoke all on function public.dc_artifact_leave_v1(uuid)
  from public, anon, authenticated;
grant execute on function public.dc_artifact_leave_v1(uuid)
  to authenticated;

create or replace function public.dc_artifact_remove_participant_v1(
  p_artifact_id uuid,
  p_profile_id uuid
)
returns uuid
language sql
security definer
set search_path = ''
as $function$
  select public.dc_append_artifact_participation_event_v1(
    p_artifact_id,
    p_profile_id,
    'REMOVED'
  );
$function$;

revoke all on function public.dc_artifact_remove_participant_v1(uuid,uuid)
  from public, anon, authenticated;
grant execute on function public.dc_artifact_remove_participant_v1(uuid,uuid)
  to authenticated;

-- 6) Draft-only visibility setting; CIRCLE can never be assigned to a non-Idea.
create or replace function public.dc_set_artifact_visibility_v1(
  p_artifact_id uuid,
  p_visibility text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_visibility text := lower(btrim(coalesce(p_visibility,'')));
  v_artifact public.dc_artifacts%rowtype;
begin
  if v_uid is null then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;
  if v_visibility not in ('community','circle') then
    raise exception 'ARTIFACT_VISIBILITY_INVALID';
  end if;

  select * into v_artifact
  from public.dc_artifacts a
  where a.id = p_artifact_id
    and a.status = 'draft'
    and (
      a.author_profile_id = v_uid
      or public.dc_is_owner_admin(v_uid)
    )
  for update;

  if v_artifact.id is null then
    raise exception 'ARTIFACT_DRAFT_NOT_FOUND';
  end if;

  if v_visibility = 'circle' and v_artifact.artifact_type <> 'idea' then
    raise exception 'CIRCLE_IDEA_REQUIRED';
  end if;

  update public.dc_artifacts
  set visibility = v_visibility,
      updated_at = now()
  where id = v_artifact.id;

  return v_artifact.id;
end;
$function$;

revoke all on function public.dc_set_artifact_visibility_v1(uuid,text)
  from public, anon, authenticated;
grant execute on function public.dc_set_artifact_visibility_v1(uuid,text)
  to authenticated;

-- Prevent subtype mutation from violating the CIRCLE=Idea invariant.
create or replace function public.dc_set_artifact_subtype_v1(
  p_artifact_id uuid,
  p_artifact_type text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_owner boolean;
  v_type text := lower(btrim(coalesce(p_artifact_type,'')));
  v_visibility text;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  v_owner := public.dc_is_owner_admin(v_uid);
  if not public.dc_membership_active(v_uid) and not v_owner then raise exception 'MEMBERSHIP_REQUIRED'; end if;
  if v_type not in ('announcement','post','idea','request') then raise exception 'ARTIFACT_TYPE_INVALID'; end if;

  select a.visibility into v_visibility
  from public.dc_artifacts a
  where a.id = p_artifact_id
    and a.author_profile_id = v_uid
    and a.status = 'draft'
  for update;

  if v_visibility is null then raise exception 'ARTIFACT_DRAFT_NOT_FOUND'; end if;
  if v_visibility = 'circle' and v_type <> 'idea' then raise exception 'CIRCLE_IDEA_REQUIRED'; end if;

  update public.dc_artifacts
     set artifact_type = v_type,
         updated_at = now()
   where id = p_artifact_id;

  return p_artifact_id;
end;
$function$;

-- 7) Raw Artifact/media/position access: preserve existing Member lane and add scoped CIRCLE.
drop policy if exists dc_artifacts_select_members on public.dc_artifacts;
create policy dc_artifacts_select_members
on public.dc_artifacts
for select
to authenticated
using (
  auth.uid() = author_profile_id
  or public.dc_is_owner_admin()
  or (
    public.dc_membership_active()
    and public.dc_can_read_artifact_v1(id)
  )
);

drop policy if exists dc_artifact_media_select_members on public.dc_artifact_media;
create policy dc_artifact_media_select_members
on public.dc_artifact_media
for select
to authenticated
using (
  auth.uid() = owner_profile_id
  or public.dc_is_owner_admin()
  or (
    public.dc_membership_active()
    and public.dc_can_read_artifact_v1(artifact_id)
  )
);

drop policy if exists dc_artifact_board_positions_select_members on public.dc_artifact_board_positions;
create policy dc_artifact_board_positions_select_members
on public.dc_artifact_board_positions
for select
to authenticated
using (
  (public.dc_membership_active() or public.dc_is_owner_admin())
  and exists (
    select 1
    from public.dc_artifacts a
    where a.id = dc_artifact_board_positions.artifact_id
      and public.dc_can_read_artifact_v1(a.id)
  )
);

drop policy if exists dc_artifact_board_positions_update_own on public.dc_artifact_board_positions;
create policy dc_artifact_board_positions_update_own
on public.dc_artifact_board_positions
for update
to authenticated
using (
  exists (
    select 1
    from public.dc_artifacts a
    where a.id = dc_artifact_board_positions.artifact_id
      and a.visibility in ('community','circle')
      and a.status = 'active'
      and a.published_at is not null
      and (a.expires_at is null or a.expires_at > now())
      and (
        (public.dc_membership_active() and a.author_profile_id = auth.uid())
        or public.dc_is_owner_admin()
      )
  )
)
with check (
  exists (
    select 1
    from public.dc_artifacts a
    where a.id = dc_artifact_board_positions.artifact_id
      and a.visibility in ('community','circle')
      and a.status = 'active'
      and a.published_at is not null
      and (a.expires_at is null or a.expires_at > now())
      and (
        (public.dc_membership_active() and a.author_profile_id = auth.uid())
        or public.dc_is_owner_admin()
      )
  )
);

-- CIRCLE Artifacts live on the canonical Community Board spatial owner too.
create or replace function public.dc_ensure_artifact_board_position_v1()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_index bigint;
  v_col bigint;
  v_row bigint;
  v_page bigint;
  v_x double precision;
  v_y double precision;
  v_rotation double precision;
begin
  if new.status <> 'active'
     or new.visibility not in ('community','circle')
     or new.published_at is null
     or (new.expires_at is not null and new.expires_at <= now()) then
    return new;
  end if;

  if exists (
    select 1 from public.dc_artifact_board_positions p where p.artifact_id = new.id
  ) then
    return new;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('dc-community-board-position-v1'));

  select count(*) into v_index
  from public.dc_artifact_board_positions p
  where p.board_id = 'community';

  v_col := v_index % 6;
  v_row := (v_index / 6) % 5;
  v_page := v_index / 30;
  v_x := 900 + (v_col * 620) + ((v_page % 2) * 150);
  v_y := 650 + (v_row * 520) + ((v_page % 3) * 120);
  v_rotation := ((v_index % 7) - 3) * 0.18;

  insert into public.dc_artifact_board_positions (
    artifact_id,board_id,x,y,rotation,size_class,position_version,placed_at,moved_at
  ) values (
    new.id,'community',v_x,v_y,v_rotation,null,1,now(),now()
  ) on conflict (artifact_id) do nothing;

  return new;
end;
$function$;

-- Storage must no longer treat active Membership as bucket-wide media access.
drop policy if exists dc_community_artifacts_storage_select_members on storage.objects;
drop policy if exists dc_community_artifacts_storage_select_board_guests on storage.objects;
drop policy if exists dc_community_artifacts_storage_select_authorized_v1 on storage.objects;

create policy dc_community_artifacts_storage_select_authorized_v1
on storage.objects
for select
to authenticated
using (
  bucket_id = 'dc-community-artifacts'
  and public.dc_can_read_artifact_media_object_v1(bucket_id,name)
);

-- 8) Reaction/response access composes CIRCLE state; INVITED stays read-only.
drop policy if exists dc_artifact_reactions_select_members on public.dc_artifact_reactions;
create policy dc_artifact_reactions_select_members
on public.dc_artifact_reactions
for select
to authenticated
using (
  (public.dc_membership_active() or public.dc_is_owner_admin())
  and public.dc_can_read_artifact_v1(artifact_id)
);

drop policy if exists dc_artifact_reactions_insert_own on public.dc_artifact_reactions;
create policy dc_artifact_reactions_insert_own
on public.dc_artifact_reactions
for insert
to authenticated
with check (
  auth.uid() = profile_id
  and (public.dc_membership_active() or public.dc_is_owner_admin())
  and public.dc_can_interact_artifact_v1(artifact_id)
);

drop policy if exists dc_artifact_reactions_delete_own on public.dc_artifact_reactions;
create policy dc_artifact_reactions_delete_own
on public.dc_artifact_reactions
for delete
to authenticated
using (
  auth.uid() = profile_id
  and (public.dc_membership_active() or public.dc_is_owner_admin())
  and public.dc_can_interact_artifact_v1(artifact_id)
);

drop policy if exists dc_artifact_responses_select_parties on public.dc_artifact_responses;
create policy dc_artifact_responses_select_parties
on public.dc_artifact_responses
for select
to authenticated
using (
  public.dc_can_read_artifact_v1(artifact_id)
  and (
    auth.uid() = responder_profile_id
    or exists (
      select 1
      from public.dc_artifacts a
      where a.id = dc_artifact_responses.artifact_id
        and a.author_profile_id = auth.uid()
    )
    or public.dc_is_owner_admin()
  )
);

drop policy if exists dc_artifact_responses_insert_own on public.dc_artifact_responses;
create policy dc_artifact_responses_insert_own
on public.dc_artifact_responses
for insert
to authenticated
with check (
  auth.uid() = responder_profile_id
  and status = 'submitted'
  and (public.dc_membership_active() or public.dc_is_owner_admin())
  and public.dc_can_interact_artifact_v1(artifact_id)
  and exists (
    select 1
    from public.dc_artifacts a
    where a.id = dc_artifact_responses.artifact_id
      and a.author_profile_id <> auth.uid()
      and a.status = 'active'
      and (a.expires_at is null or a.expires_at > now())
  )
);

drop policy if exists dc_artifact_responses_insert_guest on public.dc_artifact_responses;
create policy dc_artifact_responses_insert_guest
on public.dc_artifact_responses
for insert
to authenticated
with check (
  auth.uid() = responder_profile_id
  and status = 'submitted'
  and not public.dc_membership_active()
  and not public.dc_is_owner_admin()
  and public.dc_can_interact_artifact_v1(artifact_id)
  and exists (
    select 1
    from public.dc_artifacts a
    where a.id = dc_artifact_responses.artifact_id
      and a.author_profile_id <> auth.uid()
      and a.status = 'active'
      and a.published_at is not null
      and (a.starts_at is null or a.starts_at <= now())
      and (a.expires_at is null or a.expires_at > now())
  )
);

drop policy if exists dc_artifact_responses_update_own on public.dc_artifact_responses;
create policy dc_artifact_responses_update_own
on public.dc_artifact_responses
for update
to authenticated
using (
  auth.uid() = responder_profile_id
  and (public.dc_membership_active() or public.dc_is_owner_admin())
  and public.dc_can_read_artifact_v1(artifact_id)
)
with check (
  auth.uid() = responder_profile_id
  and status in ('submitted','withdrawn')
);

-- Guest interest uses the existing Guest lane. CIRCLE requires JOINED, not merely INVITED.
create or replace function public.dc_guest_board_interest_toggle_v1(p_artifact_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = 'public', 'pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_active boolean;
  v_count bigint;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if public.dc_membership_active() or public.dc_is_owner_admin() then
    raise exception 'MEMBER_USE_CANONICAL_REACTION';
  end if;
  perform public.dc_normalize_artifact_lifecycle_v1();

  if not public.dc_can_interact_artifact_v1(p_artifact_id) then
    raise exception 'ARTIFACT_NOT_AVAILABLE';
  end if;

  if exists (
    select 1
    from public.dc_guest_board_interests i
    where i.artifact_id = p_artifact_id
      and i.profile_id = v_uid
  ) then
    delete from public.dc_guest_board_interests i
    where i.artifact_id = p_artifact_id
      and i.profile_id = v_uid;
    v_active := false;
  else
    insert into public.dc_guest_board_interests(artifact_id,profile_id)
    values(p_artifact_id,v_uid)
    on conflict (artifact_id,profile_id) do nothing;
    v_active := true;
  end if;

  select count(*)::bigint into v_count
  from public.dc_guest_board_interests i
  where i.artifact_id = p_artifact_id;

  return jsonb_build_object('active',v_active,'count',v_count);
end;
$function$;

-- 9) Guest Board/detail projection: CIRCLE only for current INVITED/JOINED.
drop function if exists public.dc_guest_board_read_v1();

create function public.dc_guest_board_read_v1()
returns table(
  artifact_id uuid,
  artifact_type text,
  title text,
  body text,
  external_url text,
  status text,
  starts_at timestamptz,
  expires_at timestamptz,
  published_at timestamptz,
  closed_at timestamptz,
  author_display_name text,
  author_nickname text,
  author_avatar_url text,
  reaction_count bigint,
  guest_interest_count bigint,
  my_guest_interest boolean,
  board_x double precision,
  board_y double precision,
  board_rotation double precision,
  board_size_class text
)
language plpgsql
security definer
set search_path = 'public', 'pg_temp'
as $function$
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  perform public.dc_normalize_artifact_lifecycle_v1();

  return query
  select
    a.id,a.artifact_type,a.title,a.body,a.external_url,a.status,a.starts_at,a.expires_at,a.published_at,a.closed_at,
    case when po.publisher_scope='club' then 'DEMENTOR CLUB'::text else p.display_name end,
    case when po.publisher_scope='club' then null::text else p.nickname end,
    case when po.publisher_scope='club' then '/assets/brand/dementor-mark-black.svg'::text else p.avatar_url end,
    coalesce((select count(*)::bigint from public.dc_artifact_reactions r where r.artifact_id=a.id),0::bigint),
    coalesce((select count(*)::bigint from public.dc_guest_board_interests gi where gi.artifact_id=a.id),0::bigint),
    exists(select 1 from public.dc_guest_board_interests mine where mine.artifact_id=a.id and mine.profile_id=auth.uid()),
    bp.x,bp.y,bp.rotation,bp.size_class
  from public.dc_artifacts a
  join public.dc_member_public_profiles p on p.profile_id=a.author_profile_id
  left join public.dc_artifact_publisher_overrides po on po.artifact_id=a.id
  left join public.dc_artifact_board_positions bp on bp.artifact_id=a.id and bp.board_id='community'
  where public.dc_can_read_artifact_v1(a.id)
    and a.board_hidden_at is null
    and (a.starts_at is null or a.starts_at <= now())
  order by a.published_at desc;
end;
$function$;

revoke all on function public.dc_guest_board_read_v1() from public, anon, authenticated;
grant execute on function public.dc_guest_board_read_v1() to authenticated;

create or replace function public.dc_guest_board_artifact_detail_read_v1(p_artifact_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = 'public', 'pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_result jsonb;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if public.dc_membership_active() or public.dc_is_owner_admin() then
    raise exception 'MEMBER_USE_CANONICAL_DETAIL';
  end if;
  perform public.dc_normalize_artifact_lifecycle_v1();

  select jsonb_build_object(
    'artifact',jsonb_build_object(
      'id',a.id,
      'author_profile_id',case when po.publisher_scope='club' then null::uuid else a.author_profile_id end,
      'publisher_scope',coalesce(po.publisher_scope,'profile'),
      'artifact_type',a.artifact_type,
      'title',a.title,
      'body',a.body,
      'external_url',a.external_url,
      'status',a.status,
      'visibility',a.visibility,
      'starts_at',a.starts_at,
      'activity_at',a.activity_at,
      'expires_at',a.expires_at,
      'published_at',a.published_at,
      'closed_at',a.closed_at,
      'created_at',a.created_at
    ),
    'author',jsonb_build_object(
      'profile_id',case when po.publisher_scope='club' then null::uuid else p.profile_id end,
      'display_name',case when po.publisher_scope='club' then 'DEMENTOR CLUB'::text else p.display_name end,
      'nickname',case when po.publisher_scope='club' then null::text else p.nickname end,
      'avatar_url',case when po.publisher_scope='club' then '/assets/brand/dementor-mark-black.svg'::text else p.avatar_url end,
      'member_since',case when po.publisher_scope='club' then null::timestamptz else p.member_since end
    ),
    'reaction_count',coalesce((select count(*) from public.dc_artifact_reactions r where r.artifact_id=a.id),0),
    'guest_interest_count',coalesce((select count(*) from public.dc_guest_board_interests gi where gi.artifact_id=a.id),0),
    'my_guest_interest',exists(select 1 from public.dc_guest_board_interests mine where mine.artifact_id=a.id and mine.profile_id=v_uid),
    'my_guest_response_submitted',exists(select 1 from public.dc_artifact_responses rr where rr.artifact_id=a.id and rr.responder_profile_id=v_uid and rr.status='submitted'),
    'participation_state',public.dc_my_artifact_participation_state_v1(a.id),
    'media',coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id',m.id,
          'media_type',m.media_type,
          'storage_bucket',m.storage_bucket,
          'storage_path',m.storage_path,
          'metadata',m.metadata
        )
        order by m.created_at
      )
      from public.dc_artifact_media m
      where m.artifact_id=a.id
    ),'[]'::jsonb)
  ) into v_result
  from public.dc_artifacts a
  join public.dc_member_public_profiles p on p.profile_id=a.author_profile_id
  left join public.dc_artifact_publisher_overrides po on po.artifact_id=a.id
  where a.id=p_artifact_id
    and public.dc_can_read_artifact_v1(a.id)
    and a.board_hidden_at is null
    and (a.starts_at is null or a.starts_at <= now());

  if v_result is null then raise exception 'ARTIFACT_NOT_AVAILABLE'; end if;
  return v_result;
end;
$function$;

revoke all on function public.dc_guest_board_artifact_detail_read_v1(uuid)
  from public, anon, authenticated;
grant execute on function public.dc_guest_board_artifact_detail_read_v1(uuid)
  to authenticated;

-- 10) Publish uses the same capacity for COMMUNITY and CIRCLE.
-- Only COMMUNITY creates Telegram distribution state.
create or replace function public.dc_publish_artifact_v1(p_artifact_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_owner boolean;
  v_granted integer := 0;
  v_consuming integer := 0;
  v_artifact public.dc_artifacts%rowtype;
  v_outbox_id uuid;
  v_telegram_status text;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  v_owner := public.dc_is_owner_admin(v_uid);
  if not public.dc_membership_active(v_uid) and not v_owner then raise exception 'MEMBERSHIP_REQUIRED'; end if;

  perform 1 from public.profiles p where p.id=v_uid for update;

  update public.dc_artifacts
     set status='expired',updated_at=now()
   where author_profile_id=v_uid
     and status='active'
     and expires_at is not null
     and expires_at <= now();

  select * into v_artifact
  from public.dc_artifacts a
  where a.id=p_artifact_id
    and a.author_profile_id=v_uid
  for update;

  if v_artifact.id is null or v_artifact.status <> 'draft' then
    raise exception 'ARTIFACT_DRAFT_NOT_FOUND';
  end if;
  if v_artifact.expires_at is not null and v_artifact.expires_at <= now() then
    raise exception 'ARTIFACT_ALREADY_EXPIRED';
  end if;
  if v_artifact.visibility = 'circle' and v_artifact.artifact_type <> 'idea' then
    raise exception 'CIRCLE_IDEA_REQUIRED';
  end if;

  if not v_owner then
    select coalesce(sum(g.amount),0)::integer into v_granted
    from public.dc_artifact_slot_grants g
    where g.profile_id=v_uid;

    select count(*)::integer into v_consuming
    from public.dc_artifacts a
    where a.author_profile_id=v_uid
      and a.status in ('publishing','active')
      and (a.expires_at is null or a.expires_at > now());

    if v_granted-v_consuming <= 0 then
      raise exception 'NO_ARTIFACT_SLOT_AVAILABLE';
    end if;
  end if;

  update public.dc_artifacts
     set status='active',published_at=now(),updated_at=now()
   where id=p_artifact_id;

  if v_artifact.visibility = 'community' then
    insert into public.dc_distribution_outbox(
      artifact_id,channel,status,payload,available_at
    ) values (
      p_artifact_id,
      'telegram',
      'held',
      jsonb_build_object('artifact_id',p_artifact_id,'source','community_board_promotion_v1'),
      now()
    )
    on conflict (artifact_id,channel) do nothing
    returning id into v_outbox_id;

    if v_outbox_id is null then
      select o.id into v_outbox_id
      from public.dc_distribution_outbox o
      where o.artifact_id=p_artifact_id
        and o.channel='telegram';
    end if;
    v_telegram_status := 'held';
  else
    v_outbox_id := null;
    v_telegram_status := 'not_applicable';
  end if;

  return jsonb_build_object(
    'artifact_id',p_artifact_id,
    'status','active',
    'published_at',now(),
    'owner_admin',v_owner,
    'visibility',v_artifact.visibility,
    'slots_available',case when v_owner then null else greatest(v_granted-v_consuming-1,0) end,
    'telegram_outbox_id',v_outbox_id,
    'telegram_status',v_telegram_status
  );
end;
$function$;

-- Owner Admin close/archive must include CIRCLE while preserving author authority.
create or replace function public.dc_close_artifact_v1(p_artifact_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
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
      or (
        v_owner
        and a.visibility in ('community','circle')
        and a.status in ('active','expired','archived')
      )
    )
  for update;

  if v_old_status is null then raise exception 'ARTIFACT_NOT_FOUND'; end if;

  if v_old_status='draft' and v_author=v_uid then
    update public.dc_artifacts
       set status='removed',closed_at=now(),updated_at=now()
     where id=p_artifact_id;
  elsif v_old_status in ('active','expired') then
    update public.dc_artifacts
       set status='archived',closed_at=now(),updated_at=now()
     where id=p_artifact_id;
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
$function$;

-- 11) Owner Admin capacity grant reuses dc_artifact_slot_grants.
create or replace function public.dc_admin_grant_artifact_slots_v1(
  p_profile_id uuid,
  p_amount integer,
  p_reason text,
  p_source_ref text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_id uuid;
  v_reason text := btrim(coalesce(p_reason,''));
  v_source_ref text := btrim(coalesce(p_source_ref,''));
  v_total integer;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.dc_is_owner_admin(v_uid) then
    raise exception 'OWNER_ADMIN_REQUIRED' using errcode = '42501';
  end if;
  if not exists (select 1 from public.profiles p where p.id=p_profile_id) then
    raise exception 'PROFILE_NOT_FOUND';
  end if;
  if coalesce(p_amount,0) <= 0 then raise exception 'SLOT_GRANT_AMOUNT_INVALID'; end if;
  if char_length(v_reason) < 1 or char_length(v_reason) > 500 then raise exception 'SLOT_GRANT_REASON_INVALID'; end if;
  if char_length(v_source_ref) < 1 or char_length(v_source_ref) > 500 then raise exception 'SLOT_GRANT_PROVENANCE_REQUIRED'; end if;

  insert into public.dc_artifact_slot_grants(
    profile_id,
    amount,
    grant_key,
    reason,
    source_system,
    source_ref,
    provenance_status,
    granted_by_profile_id
  ) values (
    p_profile_id,
    p_amount,
    'owner-admin:' || gen_random_uuid()::text,
    v_reason,
    'dementor-club',
    v_source_ref,
    'confirmed',
    v_uid
  )
  returning id into v_id;

  select coalesce(sum(g.amount),0)::integer into v_total
  from public.dc_artifact_slot_grants g
  where g.profile_id=p_profile_id;

  return jsonb_build_object(
    'grant_id',v_id,
    'profile_id',p_profile_id,
    'amount',p_amount,
    'reason',v_reason,
    'source_ref',v_source_ref,
    'granted_by_profile_id',v_uid,
    'total_granted',v_total
  );
end;
$function$;

revoke all on function public.dc_admin_grant_artifact_slots_v1(uuid,integer,text,text)
  from public, anon, authenticated;
grant execute on function public.dc_admin_grant_artifact_slots_v1(uuid,integer,text,text)
  to authenticated;

-- 12) Board Relations: every reader must be able to read both endpoints.
create or replace function public.dc_can_read_board_endpoint_v1(
  p_kind text,
  p_source_id text
)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $function$
declare
  v_kind text := lower(btrim(coalesce(p_kind,'')));
  v_source_id text := btrim(coalesce(p_source_id,''));
  v_artifact_id uuid;
begin
  if auth.uid() is null then return false; end if;

  if v_kind = 'artifact' then
    begin
      v_artifact_id := v_source_id::uuid;
    exception when invalid_text_representation then
      return false;
    end;
    return public.dc_can_read_artifact_v1(v_artifact_id);
  elsif v_kind = 'event' then
    return exists (
      select 1
      from public.dc_entities e
      join public.dc_events ev on ev.entity_id=e.id
      where e.entity_type='event'
        and e.slug=v_source_id
        and e.provenance_status='confirmed'
    );
  elsif v_kind = 'program' then
    return exists (
      select 1
      from public.dc_entities e
      join public.dc_programs pr on pr.entity_id=e.id
      where e.entity_type='program'
        and e.slug=v_source_id
        and e.provenance_status='confirmed'
    );
  end if;

  return false;
end;
$function$;

revoke all on function public.dc_can_read_board_endpoint_v1(text,text)
  from public, anon, authenticated;
grant execute on function public.dc_can_read_board_endpoint_v1(text,text)
  to authenticated;

create or replace function public.dc_is_joined_idea_participant_v1(p_artifact_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select auth.uid() is not null
    and public.dc_my_artifact_participation_state_v1(p_artifact_id) = 'JOINED'
    and exists (
      select 1
      from public.dc_artifacts a
      where a.id=p_artifact_id
        and a.artifact_type='idea'
        and public.dc_can_read_artifact_v1(a.id)
    );
$function$;

revoke all on function public.dc_is_joined_idea_participant_v1(uuid)
  from public, anon, authenticated;
grant execute on function public.dc_is_joined_idea_participant_v1(uuid)
  to authenticated;

create or replace function public.dc_board_relations_read_v1()
returns table(
  relation_id uuid,
  relation_type text,
  origin_kind text,
  origin_source_id text,
  target_kind text,
  target_source_id text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $function$
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;

  return query
  select
    r.id,
    r.relation_type,
    r.origin_kind,
    r.origin_source_id,
    r.target_kind,
    r.target_source_id,
    r.created_at
  from public.dc_board_relations r
  where r.deleted_at is null
    and public.dc_can_read_board_endpoint_v1(r.origin_kind,r.origin_source_id)
    and public.dc_can_read_board_endpoint_v1(r.target_kind,r.target_source_id)
  order by r.created_at,r.id;
end;
$function$;

create or replace function public.dc_board_relation_create_v1(
  p_relation_type text,
  p_origin_kind text,
  p_origin_source_id text,
  p_target_kind text,
  p_target_source_id text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_relation_type text := upper(btrim(coalesce(p_relation_type,'')));
  v_origin_kind text := lower(btrim(coalesce(p_origin_kind,'')));
  v_origin_source_id text := btrim(coalesce(p_origin_source_id,''));
  v_target_kind text := lower(btrim(coalesce(p_target_kind,'')));
  v_target_source_id text := btrim(coalesce(p_target_source_id,''));
  v_origin_artifact_id uuid;
  v_target_artifact_id uuid;
  v_origin_entity_id uuid;
  v_target_entity_id uuid;
  v_owner_admin boolean := false;
  v_can_manage_origin boolean := false;
  v_can_manage_target boolean := false;
  v_participant_related boolean := false;
  v_store_origin_kind text;
  v_store_origin_source_id text;
  v_store_target_kind text;
  v_store_target_source_id text;
  v_swap_kind text;
  v_swap_source_id text;
  v_id uuid;
begin
  if v_uid is null then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;

  if v_relation_type not in ('RELATED_TO','RESULT_OF','CONTINUES','ABOUT','REPORT_OF') then
    raise exception 'RELATION_TYPE_UNSUPPORTED';
  end if;
  if v_origin_kind not in ('artifact','event','program')
     or v_target_kind not in ('artifact','event','program') then
    raise exception 'RELATION_ENDPOINT_KIND_UNSUPPORTED';
  end if;
  if v_origin_source_id='' or v_target_source_id='' then
    raise exception 'RELATION_SOURCE_ID_REQUIRED';
  end if;

  if not (
    v_relation_type='RELATED_TO'
    or (v_relation_type='RESULT_OF' and v_target_kind='artifact')
    or (v_relation_type='CONTINUES' and v_origin_kind=v_target_kind)
    or (v_relation_type='ABOUT' and v_origin_kind='artifact')
    or (v_relation_type='REPORT_OF' and v_origin_kind='artifact' and v_target_kind in ('event','program'))
  ) then
    raise exception 'RELATION_ENDPOINT_PAIR_UNSUPPORTED';
  end if;

  if not public.dc_can_read_board_endpoint_v1(v_origin_kind,v_origin_source_id)
     or not public.dc_can_read_board_endpoint_v1(v_target_kind,v_target_source_id) then
    raise exception 'RELATION_ENDPOINT_NOT_AVAILABLE';
  end if;

  if v_origin_kind='artifact' then
    begin v_origin_artifact_id:=v_origin_source_id::uuid;
    exception when invalid_text_representation then raise exception 'RELATION_ORIGIN_SOURCE_INVALID'; end;
    v_origin_source_id:=v_origin_artifact_id::text;
  elsif v_origin_kind='event' then
    select e.id into v_origin_entity_id
    from public.dc_entities e join public.dc_events ev on ev.entity_id=e.id
    where e.entity_type='event' and e.slug=v_origin_source_id and e.provenance_status='confirmed';
  else
    select e.id into v_origin_entity_id
    from public.dc_entities e join public.dc_programs pr on pr.entity_id=e.id
    where e.entity_type='program' and e.slug=v_origin_source_id and e.provenance_status='confirmed';
  end if;

  if v_target_kind='artifact' then
    begin v_target_artifact_id:=v_target_source_id::uuid;
    exception when invalid_text_representation then raise exception 'RELATION_TARGET_SOURCE_INVALID'; end;
    v_target_source_id:=v_target_artifact_id::text;
  elsif v_target_kind='event' then
    select e.id into v_target_entity_id
    from public.dc_entities e join public.dc_events ev on ev.entity_id=e.id
    where e.entity_type='event' and e.slug=v_target_source_id and e.provenance_status='confirmed';
  else
    select e.id into v_target_entity_id
    from public.dc_entities e join public.dc_programs pr on pr.entity_id=e.id
    where e.entity_type='program' and e.slug=v_target_source_id and e.provenance_status='confirmed';
  end if;

  if (v_origin_kind,v_origin_source_id)=(v_target_kind,v_target_source_id) then
    raise exception 'RELATION_SELF_EDGE_FORBIDDEN';
  end if;

  v_owner_admin:=public.dc_is_owner_admin(v_uid);

  if v_origin_kind='artifact' then
    v_can_manage_origin:=v_owner_admin or (
      public.dc_membership_active(v_uid)
      and exists (
        select 1 from public.dc_artifacts a
        where a.id=v_origin_artifact_id and a.author_profile_id=v_uid
      )
    );
  else
    v_can_manage_origin:=v_owner_admin or (
      public.dc_membership_active(v_uid)
      and public.dc_has_role('dementor',v_uid)
      and exists (
        select 1 from public.dc_entity_assignments a
        where a.profile_id=v_uid
          and a.entity_id=v_origin_entity_id
          and a.role='dementor'
          and a.status='active'
          and a.provenance_status='confirmed'
          and a.valid_from<=now()
          and (a.valid_to is null or a.valid_to>now())
      )
    );
  end if;

  if v_relation_type='RELATED_TO' then
    if v_target_kind='artifact' then
      v_can_manage_target:=v_owner_admin or (
        public.dc_membership_active(v_uid)
        and exists (
          select 1 from public.dc_artifacts a
          where a.id=v_target_artifact_id and a.author_profile_id=v_uid
        )
      );
    else
      v_can_manage_target:=v_owner_admin or (
        public.dc_membership_active(v_uid)
        and public.dc_has_role('dementor',v_uid)
        and exists (
          select 1 from public.dc_entity_assignments a
          where a.profile_id=v_uid
            and a.entity_id=v_target_entity_id
            and a.role='dementor'
            and a.status='active'
            and a.provenance_status='confirmed'
            and a.valid_from<=now()
            and (a.valid_to is null or a.valid_to>now())
        )
      );
    end if;

    v_participant_related :=
      (v_origin_kind='artifact' and public.dc_is_joined_idea_participant_v1(v_origin_artifact_id))
      or
      (v_target_kind='artifact' and public.dc_is_joined_idea_participant_v1(v_target_artifact_id));

    if not (v_can_manage_origin or v_can_manage_target or v_participant_related) then
      raise exception 'RELATION_WRITE_FORBIDDEN' using errcode = '42501';
    end if;
  elsif not v_can_manage_origin then
    raise exception 'RELATION_WRITE_FORBIDDEN' using errcode = '42501';
  end if;

  v_store_origin_kind:=v_origin_kind;
  v_store_origin_source_id:=v_origin_source_id;
  v_store_target_kind:=v_target_kind;
  v_store_target_source_id:=v_target_source_id;

  if v_relation_type='RELATED_TO'
     and (
       v_store_origin_kind>v_store_target_kind
       or (
         v_store_origin_kind=v_store_target_kind
         and v_store_origin_source_id>v_store_target_source_id
       )
     ) then
    v_swap_kind:=v_store_origin_kind;
    v_swap_source_id:=v_store_origin_source_id;
    v_store_origin_kind:=v_store_target_kind;
    v_store_origin_source_id:=v_store_target_source_id;
    v_store_target_kind:=v_swap_kind;
    v_store_target_source_id:=v_swap_source_id;
  end if;

  if exists (
    select 1 from public.dc_board_relations r
    where r.relation_type=v_relation_type
      and r.origin_kind=v_store_origin_kind
      and r.origin_source_id=v_store_origin_source_id
      and r.target_kind=v_store_target_kind
      and r.target_source_id=v_store_target_source_id
      and r.deleted_at is null
  ) then
    raise exception 'RELATION_DUPLICATE';
  end if;

  begin
    insert into public.dc_board_relations(
      relation_type,origin_kind,origin_source_id,target_kind,target_source_id,created_by
    ) values (
      v_relation_type,v_store_origin_kind,v_store_origin_source_id,
      v_store_target_kind,v_store_target_source_id,v_uid
    ) returning id into v_id;
  exception when unique_violation then
    raise exception 'RELATION_DUPLICATE';
  end;

  return v_id;
end;
$function$;

create or replace function public.dc_board_relation_delete_v1(p_relation_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid:=auth.uid();
  v_relation public.dc_board_relations%rowtype;
  v_owner_admin boolean:=false;
  v_origin_artifact_id uuid;
  v_target_artifact_id uuid;
  v_origin_entity_id uuid;
  v_target_entity_id uuid;
  v_can_manage_origin boolean:=false;
  v_can_manage_target boolean:=false;
  v_participant_delete boolean:=false;
begin
  if v_uid is null then
    raise exception 'AUTH_REQUIRED' using errcode='42501';
  end if;

  select * into v_relation
  from public.dc_board_relations r
  where r.id=p_relation_id and r.deleted_at is null
  for update;

  if v_relation.id is null then raise exception 'RELATION_NOT_FOUND'; end if;

  v_owner_admin:=public.dc_is_owner_admin(v_uid);

  if not v_owner_admin then
    if not public.dc_can_read_board_endpoint_v1(v_relation.origin_kind,v_relation.origin_source_id)
       or not public.dc_can_read_board_endpoint_v1(v_relation.target_kind,v_relation.target_source_id) then
      raise exception 'RELATION_NOT_AVAILABLE';
    end if;
  end if;

  if v_relation.origin_kind='artifact' then
    v_origin_artifact_id:=v_relation.origin_source_id::uuid;
    v_can_manage_origin:=public.dc_membership_active(v_uid)
      and exists (
        select 1 from public.dc_artifacts a
        where a.id=v_origin_artifact_id and a.author_profile_id=v_uid
      );
  elsif v_relation.origin_kind='event' then
    select e.id into v_origin_entity_id
    from public.dc_entities e join public.dc_events ev on ev.entity_id=e.id
    where e.entity_type='event' and e.slug=v_relation.origin_source_id and e.provenance_status='confirmed';
    v_can_manage_origin:=v_origin_entity_id is not null
      and public.dc_membership_active(v_uid)
      and public.dc_has_role('dementor',v_uid)
      and exists (
        select 1 from public.dc_entity_assignments a
        where a.profile_id=v_uid and a.entity_id=v_origin_entity_id
          and a.role='dementor' and a.status='active'
          and a.provenance_status='confirmed'
          and a.valid_from<=now() and (a.valid_to is null or a.valid_to>now())
      );
  elsif v_relation.origin_kind='program' then
    select e.id into v_origin_entity_id
    from public.dc_entities e join public.dc_programs pr on pr.entity_id=e.id
    where e.entity_type='program' and e.slug=v_relation.origin_source_id and e.provenance_status='confirmed';
    v_can_manage_origin:=v_origin_entity_id is not null
      and public.dc_membership_active(v_uid)
      and public.dc_has_role('dementor',v_uid)
      and exists (
        select 1 from public.dc_entity_assignments a
        where a.profile_id=v_uid and a.entity_id=v_origin_entity_id
          and a.role='dementor' and a.status='active'
          and a.provenance_status='confirmed'
          and a.valid_from<=now() and (a.valid_to is null or a.valid_to>now())
      );
  end if;

  if v_relation.relation_type='RELATED_TO' then
    if v_relation.target_kind='artifact' then
      v_target_artifact_id:=v_relation.target_source_id::uuid;
      v_can_manage_target:=public.dc_membership_active(v_uid)
        and exists (
          select 1 from public.dc_artifacts a
          where a.id=v_target_artifact_id and a.author_profile_id=v_uid
        );
    elsif v_relation.target_kind='event' then
      select e.id into v_target_entity_id
      from public.dc_entities e join public.dc_events ev on ev.entity_id=e.id
      where e.entity_type='event' and e.slug=v_relation.target_source_id and e.provenance_status='confirmed';
      v_can_manage_target:=v_target_entity_id is not null
        and public.dc_membership_active(v_uid)
        and public.dc_has_role('dementor',v_uid)
        and exists (
          select 1 from public.dc_entity_assignments a
          where a.profile_id=v_uid and a.entity_id=v_target_entity_id
            and a.role='dementor' and a.status='active'
            and a.provenance_status='confirmed'
            and a.valid_from<=now() and (a.valid_to is null or a.valid_to>now())
        );
    elsif v_relation.target_kind='program' then
      select e.id into v_target_entity_id
      from public.dc_entities e join public.dc_programs pr on pr.entity_id=e.id
      where e.entity_type='program' and e.slug=v_relation.target_source_id and e.provenance_status='confirmed';
      v_can_manage_target:=v_target_entity_id is not null
        and public.dc_membership_active(v_uid)
        and public.dc_has_role('dementor',v_uid)
        and exists (
          select 1 from public.dc_entity_assignments a
          where a.profile_id=v_uid and a.entity_id=v_target_entity_id
            and a.role='dementor' and a.status='active'
            and a.provenance_status='confirmed'
            and a.valid_from<=now() and (a.valid_to is null or a.valid_to>now())
        );
    end if;

    v_participant_delete :=
      v_relation.created_by=v_uid
      and (
        (v_relation.origin_kind='artifact' and public.dc_is_joined_idea_participant_v1(v_origin_artifact_id))
        or
        (v_relation.target_kind='artifact' and public.dc_is_joined_idea_participant_v1(v_target_artifact_id))
      );

    if not (v_can_manage_origin or v_can_manage_target or v_participant_delete) then
      raise exception 'RELATION_DELETE_FORBIDDEN' using errcode='42501';
    end if;
  elsif not v_can_manage_origin then
    raise exception 'RELATION_DELETE_FORBIDDEN' using errcode='42501';
  end if;

  update public.dc_board_relations
     set deleted_at=now(),deleted_by=v_uid
   where id=v_relation.id and deleted_at is null;

  return v_relation.id;
end;
$function$;

-- 13) Telegram defense in depth: pending claim itself is COMMUNITY-only.
create or replace function public.dc_distribution_claim_pending_v1(p_limit integer default 5)
returns table(id uuid, artifact_id uuid, attempts integer)
language plpgsql
security definer
set search_path = ''
as $function$
begin
  update public.dc_distribution_outbox o
     set status='suppressed',
         locked_at=null,
         updated_at=now(),
         last_error='ARTIFACT_NOT_DISTRIBUTABLE'
  from public.dc_artifacts a
  where o.artifact_id=a.id
    and o.status='pending'
    and (
      a.visibility<>'community'
      or a.status<>'active'
      or a.board_hidden_at is not null
      or a.published_at is null
      or (a.starts_at is not null and a.starts_at>now())
      or (a.expires_at is not null and a.expires_at<=now())
    );

  return query
  with candidates as (
    select o.id
    from public.dc_distribution_outbox o
    join public.dc_artifacts a on a.id=o.artifact_id
    where o.status='pending'
      and o.available_at<=now()
      and o.attempts<5
      and a.visibility='community'
      and a.status='active'
      and a.board_hidden_at is null
      and a.published_at is not null
      and (a.starts_at is null or a.starts_at<=now())
      and (a.expires_at is null or a.expires_at>now())
    order by o.created_at
    for update of o skip locked
    limit greatest(1,least(coalesce(p_limit,5),20))
  ), claimed as (
    update public.dc_distribution_outbox o
       set status='processing',
           locked_at=now(),
           attempts=o.attempts+1,
           updated_at=now()
    from candidates c
    where o.id=c.id
      and o.status='pending'
    returning o.id,o.artifact_id,o.attempts
  )
  select c.id,c.artifact_id,c.attempts
  from claimed c;
end;
$function$;

-- Explicit execute surface for replaced canonical functions remains unchanged.
revoke all on function public.dc_board_relations_read_v1() from public, anon, authenticated;
grant execute on function public.dc_board_relations_read_v1() to authenticated;

revoke all on function public.dc_board_relation_create_v1(text,text,text,text,text)
  from public, anon, authenticated;
grant execute on function public.dc_board_relation_create_v1(text,text,text,text,text)
  to authenticated;

revoke all on function public.dc_board_relation_delete_v1(uuid)
  from public, anon, authenticated;
grant execute on function public.dc_board_relation_delete_v1(uuid)
  to authenticated;

-- Public Activity remains untouched and fail-closed by 20260921134959_public_activity_truth_boundary_v1.
-- Share/Auth return remains transport-only and is not a database permission owner.

commit;
