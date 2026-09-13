create unique index if not exists dc_artifact_responses_one_per_member_idx on public.dc_artifact_responses(artifact_id,responder_profile_id);

create or replace function public.dc_update_artifact_draft_v1(
  p_artifact_id uuid,
  p_body text,
  p_title text,
  p_external_url text,
  p_starts_at timestamptz,
  p_expires_at timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.dc_membership_active(v_uid) then raise exception 'MEMBERSHIP_REQUIRED'; end if;
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

revoke execute on function public.dc_update_artifact_draft_v1(uuid,text,text,text,timestamptz,timestamptz) from public, anon;
grant execute on function public.dc_update_artifact_draft_v1(uuid,text,text,text,timestamptz,timestamptz) to authenticated;

revoke execute on function public.dc_membership_active(uuid) from public, anon;
revoke execute on function public.dc_has_role(text,uuid) from public, anon;
revoke execute on function public.dc_is_owner_admin(uuid) from public, anon;
revoke execute on function public.dc_can_read_entity(uuid,uuid) from public, anon;
grant execute on function public.dc_membership_active(uuid) to authenticated;
grant execute on function public.dc_has_role(text,uuid) to authenticated;
grant execute on function public.dc_is_owner_admin(uuid) to authenticated;
grant execute on function public.dc_can_read_entity(uuid,uuid) to authenticated;
