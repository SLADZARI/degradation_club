-- Board Telegram Promotion v1 — worker/read hardening.
-- Keeps retry and UI projection aligned with current Artifact eligibility.

begin;

-- Promotion state now also exposes the canonical outbox id for explicit
-- Owner/Admin delivery_unknown resolution UI. New UI support is offered only while
-- promotion is still held; the backend still tolerates a racing third vote after
-- a concurrent second vote has already released the row to pending.
drop function if exists public.dc_board_promotion_state_read_v1();
create function public.dc_board_promotion_state_read_v1()
returns table(
  artifact_id uuid,
  activity_at timestamptz,
  support_count bigint,
  promotion_threshold integer,
  my_support boolean,
  can_support boolean,
  outbox_id uuid,
  delivery_status text
)
language sql
stable
security definer
set search_path = 'public', 'pg_temp'
as $function$
  select
    a.id,
    a.activity_at,
    coalesce((select count(*)::bigint from public.dc_artifact_promotion_support s where s.artifact_id=a.id),0::bigint),
    public.dc_artifact_promotion_threshold_v1(),
    exists(select 1 from public.dc_artifact_promotion_support mine where mine.artifact_id=a.id and mine.profile_id=auth.uid()),
    (
      auth.uid() is not null
      and not public.dc_is_owner_admin(auth.uid())
      and public.dc_has_role('dementor',auth.uid())
      and a.author_profile_id <> auth.uid()
      and a.status='active'
      and a.board_hidden_at is null
      and (a.starts_at is null or a.starts_at <= now())
      and (a.expires_at is null or a.expires_at > now())
      and o.status='held'
    ),
    o.id,
    o.status
  from public.dc_artifacts a
  left join public.dc_distribution_outbox o
    on o.artifact_id=a.id and o.channel='telegram'
  where auth.uid() is not null
    and a.visibility='community'
    and a.published_at is not null
    and a.status in ('active','expired','archived')
    and a.board_hidden_at is null
    and (a.starts_at is null or a.starts_at <= now());
$function$;

revoke all on function public.dc_board_promotion_state_read_v1() from public, anon;
grant execute on function public.dc_board_promotion_state_read_v1() to authenticated;

-- Direct support remains race-safe for a third vote that was already in flight when
-- another transaction released held -> pending, but support cannot be added after
-- processing/sent/failed/unknown/suppressed/cancelled.
create or replace function public.dc_support_artifact_promotion_v1(p_artifact_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_artifact public.dc_artifacts%rowtype;
  v_outbox public.dc_distribution_outbox%rowtype;
  v_count bigint;
  v_threshold integer := public.dc_artifact_promotion_threshold_v1();
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if public.dc_is_owner_admin(v_uid) then raise exception 'OWNER_ADMIN_USE_OVERRIDE'; end if;
  if not public.dc_has_role('dementor',v_uid) then raise exception 'DEMENTOR_REQUIRED'; end if;

  perform public.dc_normalize_artifact_lifecycle_v1();

  select * into v_artifact
  from public.dc_artifacts a
  where a.id=p_artifact_id
  for update;

  if v_artifact.id is null
     or v_artifact.visibility <> 'community'
     or v_artifact.status <> 'active'
     or v_artifact.published_at is null
     or v_artifact.board_hidden_at is not null
     or (v_artifact.starts_at is not null and v_artifact.starts_at > now())
     or (v_artifact.expires_at is not null and v_artifact.expires_at <= now())
  then raise exception 'ARTIFACT_NOT_PROMOTION_ELIGIBLE'; end if;

  if v_artifact.author_profile_id=v_uid then raise exception 'SELF_SUPPORT_FORBIDDEN'; end if;

  select * into v_outbox
  from public.dc_distribution_outbox o
  where o.artifact_id=p_artifact_id and o.channel='telegram'
  for update;

  if v_outbox.id is null then raise exception 'PROMOTION_OUTBOX_MISSING'; end if;
  if v_outbox.status not in ('held','pending') then raise exception 'DELIVERY_STATE_NOT_SUPPORTABLE'; end if;

  insert into public.dc_artifact_promotion_support(artifact_id,profile_id)
  values (p_artifact_id,v_uid)
  on conflict (artifact_id,profile_id) do nothing;

  select count(*)::bigint into v_count
  from public.dc_artifact_promotion_support s
  where s.artifact_id=p_artifact_id;

  if v_count >= v_threshold and v_outbox.status='held' then
    update public.dc_distribution_outbox
       set status='pending',available_at=now(),updated_at=now()
     where id=v_outbox.id and status='held';
    if found then v_outbox.status := 'pending'; end if;
  end if;

  return jsonb_build_object(
    'artifact_id',p_artifact_id,
    'support_count',v_count,
    'threshold',v_threshold,
    'my_support',true,
    'delivery_status',v_outbox.status
  );
end;
$function$;

revoke all on function public.dc_support_artifact_promotion_v1(uuid) from public, anon;
grant execute on function public.dc_support_artifact_promotion_v1(uuid) to authenticated;

-- Historical/hidden/inactive Artifacts must not be automatically retried even
-- when an old failed row still has attempts remaining.
create or replace function public.dc_distribution_requeue_failed_v1(p_limit integer default 5)
returns integer
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_count integer;
begin
  perform public.dc_normalize_artifact_lifecycle_v1();

  with candidates as (
    select o.id
    from public.dc_distribution_outbox o
    join public.dc_artifacts a on a.id=o.artifact_id
    where o.status='failed'
      and o.available_at <= now()
      and o.attempts < 5
      and a.status='active'
      and a.visibility='community'
      and a.board_hidden_at is null
      and a.published_at is not null
      and (a.starts_at is null or a.starts_at <= now())
      and (a.expires_at is null or a.expires_at > now())
    order by o.created_at
    for update of o skip locked
    limit greatest(1,least(coalesce(p_limit,5),20))
  )
  update public.dc_distribution_outbox o
     set status='pending',updated_at=now()
  from candidates c
  where o.id=c.id;

  get diagnostics v_count = row_count;
  return v_count;
end;
$function$;

revoke all on function public.dc_distribution_requeue_failed_v1(integer) from public, anon, authenticated;
grant execute on function public.dc_distribution_requeue_failed_v1(integer) to service_role;

-- Hidden moderation context exposes the outbox id to Owner/Admin only.
drop function if exists public.dc_admin_board_hidden_read_v1();
create function public.dc_admin_board_hidden_read_v1()
returns table(
  artifact_id uuid,
  artifact_type text,
  title text,
  body text,
  status text,
  activity_at timestamptz,
  board_hidden_at timestamptz,
  outbox_id uuid,
  delivery_status text
)
language plpgsql
security definer
set search_path = 'public', 'pg_temp'
as $function$
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.dc_is_owner_admin(auth.uid()) then raise exception 'OWNER_ADMIN_REQUIRED'; end if;

  return query
  select a.id,a.artifact_type,a.title,a.body,a.status,a.activity_at,a.board_hidden_at,o.id,o.status
  from public.dc_artifacts a
  left join public.dc_distribution_outbox o on o.artifact_id=a.id and o.channel='telegram'
  where a.visibility='community' and a.board_hidden_at is not null
  order by a.board_hidden_at desc;
end;
$function$;

revoke all on function public.dc_admin_board_hidden_read_v1() from public, anon;
grant execute on function public.dc_admin_board_hidden_read_v1() to authenticated;

commit;
