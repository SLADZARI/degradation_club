-- Dementor Club Community Board v2
-- Server-authoritative interaction gate: MEMBER_ACTIVATED is required before
-- a Member may react or respond to another Community Artifact.

begin;

create or replace function public.dc_member_activated_v1()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    auth.uid() is not null
    and public.dc_membership_active(auth.uid())
    and exists (
      select 1
      from public.dc_artifacts a
      where a.author_profile_id = auth.uid()
        and a.published_at is not null
        and a.status <> 'removed'
    );
$$;

revoke all on function public.dc_member_activated_v1() from public;
revoke all on function public.dc_member_activated_v1() from anon;
grant execute on function public.dc_member_activated_v1() to authenticated;

-- Defense in depth: direct table writes remain possible only for activated Members.
drop policy if exists dc_artifact_reactions_insert_own on public.dc_artifact_reactions;
create policy dc_artifact_reactions_insert_own
on public.dc_artifact_reactions
for insert
to authenticated
with check (
  (select auth.uid()) = profile_id
  and (select public.dc_member_activated_v1())
  and exists (
    select 1 from public.dc_artifacts a
    where a.id = artifact_id
      and a.visibility = 'community'
      and a.status = 'active'
      and (a.expires_at is null or a.expires_at > now())
  )
);

drop policy if exists dc_artifact_reactions_delete_own on public.dc_artifact_reactions;
create policy dc_artifact_reactions_delete_own
on public.dc_artifact_reactions
for delete
to authenticated
using (
  (select auth.uid()) = profile_id
  and (select public.dc_member_activated_v1())
);

drop policy if exists dc_artifact_responses_insert_own on public.dc_artifact_responses;
create policy dc_artifact_responses_insert_own
on public.dc_artifact_responses
for insert
to authenticated
with check (
  (select auth.uid()) = responder_profile_id
  and status = 'submitted'
  and (select public.dc_member_activated_v1())
  and exists (
    select 1 from public.dc_artifacts a
    where a.id = artifact_id
      and a.author_profile_id <> (select auth.uid())
      and a.visibility = 'community'
      and a.status = 'active'
      and (a.expires_at is null or a.expires_at > now())
  )
);

drop policy if exists dc_artifact_responses_update_own on public.dc_artifact_responses;
create policy dc_artifact_responses_update_own
on public.dc_artifact_responses
for update
to authenticated
using (
  (select auth.uid()) = responder_profile_id
  and (select public.dc_member_activated_v1())
)
with check (
  (select auth.uid()) = responder_profile_id
  and status = any(array['submitted'::text,'withdrawn'::text])
);

create unique index if not exists dc_artifact_responses_one_submitted_per_member
  on public.dc_artifact_responses (artifact_id, responder_profile_id)
  where status = 'submitted';

create or replace function public.dc_toggle_artifact_reaction_v2(p_artifact_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_existing uuid;
  v_active boolean;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.dc_member_activated_v1() then raise exception 'FIRST_ARTIFACT_REQUIRED'; end if;

  if not exists (
    select 1 from public.dc_artifacts a
    where a.id = p_artifact_id
      and a.visibility = 'community'
      and a.status = 'active'
      and (a.expires_at is null or a.expires_at > now())
  ) then raise exception 'ARTIFACT_NOT_AVAILABLE'; end if;

  select r.id into v_existing
  from public.dc_artifact_reactions r
  where r.artifact_id = p_artifact_id
    and r.profile_id = v_uid
    and r.reaction_type = 'interested'
  for update;

  if v_existing is null then
    insert into public.dc_artifact_reactions(artifact_id,profile_id,reaction_type)
    values (p_artifact_id,v_uid,'interested');
    v_active := true;
  else
    delete from public.dc_artifact_reactions where id = v_existing;
    v_active := false;
  end if;

  return jsonb_build_object('artifact_id',p_artifact_id,'active',v_active);
end;
$$;

revoke all on function public.dc_toggle_artifact_reaction_v2(uuid) from public;
revoke all on function public.dc_toggle_artifact_reaction_v2(uuid) from anon;
grant execute on function public.dc_toggle_artifact_reaction_v2(uuid) to authenticated;

create or replace function public.dc_submit_artifact_response_v2(p_artifact_id uuid, p_message text default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_id uuid;
  v_message text := nullif(btrim(coalesce(p_message,'')),'');
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.dc_member_activated_v1() then raise exception 'FIRST_ARTIFACT_REQUIRED'; end if;
  if v_message is not null and char_length(v_message) > 2000 then raise exception 'RESPONSE_MESSAGE_INVALID'; end if;

  if not exists (
    select 1 from public.dc_artifacts a
    where a.id = p_artifact_id
      and a.author_profile_id <> v_uid
      and a.visibility = 'community'
      and a.status = 'active'
      and (a.expires_at is null or a.expires_at > now())
  ) then raise exception 'ARTIFACT_NOT_AVAILABLE'; end if;

  if exists (
    select 1 from public.dc_artifact_responses r
    where r.artifact_id = p_artifact_id
      and r.responder_profile_id = v_uid
      and r.status = 'submitted'
  ) then raise exception 'RESPONSE_ALREADY_SUBMITTED'; end if;

  insert into public.dc_artifact_responses(artifact_id,responder_profile_id,message,status)
  values (p_artifact_id,v_uid,v_message,'submitted')
  returning id into v_id;

  return jsonb_build_object('response_id',v_id,'artifact_id',p_artifact_id,'status','submitted');
end;
$$;

revoke all on function public.dc_submit_artifact_response_v2(uuid,text) from public;
revoke all on function public.dc_submit_artifact_response_v2(uuid,text) from anon;
grant execute on function public.dc_submit_artifact_response_v2(uuid,text) to authenticated;

-- Media contract hardening: one private image, max 4 MiB, JPG/PNG/WebP only.
create or replace function public.dc_attach_artifact_media_v1(
  p_artifact_id uuid,
  p_storage_path text,
  p_media_type text,
  p_metadata jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_id uuid;
  v_storage_metadata jsonb;
  v_size bigint;
  v_mimetype text;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_media_type <> 'image' then raise exception 'MEDIA_TYPE_INVALID'; end if;
  if not exists (
    select 1 from public.dc_artifacts a
    where a.id=p_artifact_id and a.author_profile_id=v_uid and a.status='draft'
  ) then raise exception 'ARTIFACT_DRAFT_NOT_FOUND'; end if;
  if split_part(p_storage_path,'/',1) <> v_uid::text then raise exception 'MEDIA_PATH_INVALID'; end if;

  select o.metadata into v_storage_metadata
  from storage.objects o
  where o.bucket_id='dc-community-artifacts'
    and o.name=p_storage_path
    and o.owner_id=v_uid::text;

  if v_storage_metadata is null then raise exception 'MEDIA_OBJECT_NOT_FOUND'; end if;

  v_size := coalesce((v_storage_metadata->>'size')::bigint,(v_storage_metadata->>'contentLength')::bigint,0);
  v_mimetype := lower(coalesce(v_storage_metadata->>'mimetype',''));

  if v_size <= 0 or v_size > 4194304 then raise exception 'MEDIA_SIZE_INVALID'; end if;
  if v_mimetype not in ('image/jpeg','image/png','image/webp') then raise exception 'MEDIA_MIME_INVALID'; end if;
  if exists (select 1 from public.dc_artifact_media m where m.artifact_id=p_artifact_id) then raise exception 'MEDIA_LIMIT_REACHED'; end if;

  insert into public.dc_artifact_media(artifact_id,owner_profile_id,media_type,storage_bucket,storage_path,metadata)
  values (p_artifact_id,v_uid,'image','dc-community-artifacts',p_storage_path,coalesce(p_metadata,'{}'::jsonb))
  returning id into v_id;
  return v_id;
end;
$$;

commit;
