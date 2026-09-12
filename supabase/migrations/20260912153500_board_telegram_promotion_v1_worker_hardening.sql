-- Board Telegram Promotion v1 — worker/read hardening.
-- Keeps retry and UI projection aligned with current Artifact eligibility.

begin;

-- Promotion state now also exposes the canonical outbox id for explicit
-- Owner/Admin delivery_unknown resolution UI.
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
      and coalesce(o.status,'') <> 'suppressed'
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
