-- Owner Admin Community Ops v1
-- BQA-23 read-only projections for the existing canonical Owner Admin surface.
-- No new state, role, permission or mutation semantics.

create or replace function public.dc_admin_profile_search_v1(
  p_query text,
  p_limit integer default 12
)
returns table(
  profile_id uuid,
  profile_ref text,
  display_name text,
  nickname text,
  avatar_url text,
  membership_status text
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
begin
  if v_uid is null then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;
  if not public.dc_is_owner_admin(v_uid) then
    raise exception 'OWNER_ADMIN_REQUIRED' using errcode = '42501';
  end if;
  if char_length(v_query) < 2 or char_length(v_query) > 80 then
    raise exception 'PROFILE_QUERY_INVALID';
  end if;

  return query
  select
    p.id,
    'USER-' || upper(left(p.id::text,8)) as profile_ref,
    coalesce(
      nullif(btrim(p.display_name),''),
      nullif(btrim(p.nickname),''),
      'Пользователь ' || upper(left(p.id::text,8))
    ) as display_name,
    nullif(btrim(p.nickname),'') as nickname,
    p.avatar_url,
    m.status as membership_status
  from public.profiles p
  left join public.dc_system_memberships m on m.profile_id=p.id
  where position(
    v_query in lower(
      coalesce(p.display_name,'') || ' ' ||
      coalesce(p.nickname,'') || ' ' ||
      'user-' || left(p.id::text,8)
    )
  ) > 0
  order by
    coalesce(nullif(btrim(p.display_name),''),nullif(btrim(p.nickname),''),'Пользователь ' || upper(left(p.id::text,8))),
    p.id
  limit v_limit;
end;
$function$;

create or replace function public.dc_admin_artifact_slot_status_v1(
  p_profile_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_profile record;
  v_membership_status text;
  v_granted integer := 0;
  v_consuming integer := 0;
  v_available integer := 0;
  v_published integer := 0;
  v_history jsonb := '[]'::jsonb;
begin
  if v_uid is null then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;
  if not public.dc_is_owner_admin(v_uid) then
    raise exception 'OWNER_ADMIN_REQUIRED' using errcode = '42501';
  end if;

  select
    p.id,
    coalesce(
      nullif(btrim(p.display_name),''),
      nullif(btrim(p.nickname),''),
      'Пользователь ' || upper(left(p.id::text,8))
    ) as display_name,
    nullif(btrim(p.nickname),'') as nickname,
    p.avatar_url
  into v_profile
  from public.profiles p
  where p.id=p_profile_id;

  if v_profile.id is null then
    raise exception 'PROFILE_NOT_FOUND';
  end if;

  select m.status into v_membership_status
  from public.dc_system_memberships m
  where m.profile_id=p_profile_id;

  -- Keep the same capacity semantics as dc_member_entry_status_v1.
  select coalesce(sum(g.amount),0)::integer into v_granted
  from public.dc_artifact_slot_grants g
  where g.profile_id=p_profile_id;

  select count(*)::integer into v_consuming
  from public.dc_artifacts a
  where a.author_profile_id=p_profile_id
    and a.status in ('publishing','active')
    and (a.expires_at is null or a.expires_at > now());

  v_available := greatest(v_granted-v_consuming,0);

  select count(*)::integer into v_published
  from public.dc_artifacts a
  where a.author_profile_id=p_profile_id
    and a.published_at is not null
    and a.status <> 'removed';

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'grant_id',g.id,
        'amount',g.amount,
        'reason',g.reason,
        'source_system',g.source_system,
        'source_ref',g.source_ref,
        'provenance_status',g.provenance_status,
        'created_at',g.created_at,
        'granted_by_display_name',coalesce(
          nullif(btrim(gp.display_name),''),
          nullif(btrim(gp.nickname),''),
          'OWNER ADMIN'
        )
      )
      order by g.created_at desc, g.id
    ),
    '[]'::jsonb
  )
  into v_history
  from public.dc_artifact_slot_grants g
  left join public.profiles gp on gp.id=g.granted_by_profile_id
  where g.profile_id=p_profile_id;

  return jsonb_build_object(
    'profile',jsonb_build_object(
      'profile_id',v_profile.id,
      'profile_ref','USER-' || upper(left(v_profile.id::text,8)),
      'display_name',v_profile.display_name,
      'nickname',v_profile.nickname,
      'avatar_url',v_profile.avatar_url,
      'membership_status',v_membership_status
    ),
    'artifact_slots_granted',v_granted,
    'artifact_slots_consuming',v_consuming,
    'artifact_slots_available',v_available,
    'published_artifact_count',v_published,
    'grant_history',v_history
  );
end;
$function$;

revoke all on function public.dc_admin_profile_search_v1(text,integer) from public;
revoke all on function public.dc_admin_profile_search_v1(text,integer) from anon;
grant execute on function public.dc_admin_profile_search_v1(text,integer) to authenticated;

revoke all on function public.dc_admin_artifact_slot_status_v1(uuid) from public;
revoke all on function public.dc_admin_artifact_slot_status_v1(uuid) from anon;
grant execute on function public.dc_admin_artifact_slot_status_v1(uuid) to authenticated;
