-- Board Information Architecture v1 — Batch B
-- Canonical Artifact subtypes. Existing publication owner is extended in place.
-- No membership/slot/publish semantics are changed here.

begin;

-- Preserve every existing Artifact row/ID and reinterpret legacy `notice`
-- as the canonical authored announcement subtype.
alter table public.dc_artifacts drop constraint if exists dc_artifacts_type_check;

update public.dc_artifacts
   set artifact_type = 'announcement',
       updated_at = now()
 where artifact_type = 'notice';

alter table public.dc_artifacts
  add constraint dc_artifacts_type_check
  check (artifact_type = any (array['announcement'::text,'post'::text,'idea'::text,'request'::text]));

-- Keep the existing create RPC/signature as canonical draft owner; only its
-- default persisted subtype changes from legacy `notice` to `announcement`.
create or replace function public.dc_create_artifact_draft_v1(
  p_body text,
  p_title text default null::text,
  p_external_url text default null::text,
  p_starts_at timestamptz default null::timestamptz,
  p_expires_at timestamptz default null::timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
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
  values (v_uid,'announcement',nullif(btrim(coalesce(p_title,'')),''),btrim(p_body),nullif(btrim(coalesce(p_external_url,'')),''),'draft','community',p_starts_at,p_expires_at)
  returning id into v_id;
  return v_id;
end;
$function$;

-- Narrow subtype command for the existing canonical composer. It only changes
-- the caller's own draft and cannot alter published/history records.
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
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  v_owner := public.dc_is_owner_admin(v_uid);
  if not public.dc_membership_active(v_uid) and not v_owner then raise exception 'MEMBERSHIP_REQUIRED'; end if;
  if v_type not in ('announcement','post','idea','request') then raise exception 'ARTIFACT_TYPE_INVALID'; end if;

  update public.dc_artifacts
     set artifact_type = v_type,
         updated_at = now()
   where id = p_artifact_id
     and author_profile_id = v_uid
     and status = 'draft';

  if not found then raise exception 'ARTIFACT_DRAFT_NOT_FOUND'; end if;
  return p_artifact_id;
end;
$function$;

revoke all on function public.dc_set_artifact_subtype_v1(uuid,text) from public;
grant execute on function public.dc_set_artifact_subtype_v1(uuid,text) to authenticated;

commit;
