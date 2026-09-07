-- Thin SECURITY INVOKER wrapper for the Guest Board UI.
-- The INSERT remains governed by dc_artifact_responses RLS.

create or replace function public.dc_guest_board_response_submit_v1(
  p_artifact_id uuid,
  p_message text default null
)
returns uuid
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if public.dc_membership_active() then
    raise exception 'MEMBER_USE_CANONICAL_RESPONSE';
  end if;

  insert into public.dc_artifact_responses(
    artifact_id,
    responder_profile_id,
    message,
    status
  )
  values (
    p_artifact_id,
    auth.uid(),
    nullif(btrim(p_message),''),
    'submitted'
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.dc_guest_board_response_submit_v1(uuid,text) from public, anon;
grant execute on function public.dc_guest_board_response_submit_v1(uuid,text) to authenticated;
