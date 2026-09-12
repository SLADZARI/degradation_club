-- Board Telegram Promotion v1
-- Approved project-local Decision: operations/BOARD_TELEGRAM_PROMOTION_V1.md
-- Extends existing Artifact publication and dc_distribution_outbox owners in place.
-- Commit does NOT authorize production frontend merge/deploy.

begin;

-- 1) Artifact activity datetime and minimal Board-hide metadata.
alter table public.dc_artifacts
  add column if not exists activity_at timestamptz,
  add column if not exists board_hidden_at timestamptz,
  add column if not exists board_hidden_by uuid references public.profiles(id) on delete set null;

-- 2) Immutable Dementor promotion-support ledger. This is intentionally not
-- the later generic Board relation graph.
create table if not exists public.dc_artifact_promotion_support (
  artifact_id uuid not null references public.dc_artifacts(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (artifact_id, profile_id)
);

alter table public.dc_artifact_promotion_support enable row level security;
revoke all on table public.dc_artifact_promotion_support from public, anon, authenticated;

-- 3) Extend the existing canonical outbox vocabulary. Historical rows are not
-- rewritten or reopened by this migration.
alter table public.dc_distribution_outbox
  drop constraint if exists dc_distribution_outbox_status_check;

alter table public.dc_distribution_outbox
  add constraint dc_distribution_outbox_status_check
  check (status = any (array[
    'held'::text,
    'pending'::text,
    'processing'::text,
    'sent'::text,
    'failed'::text,
    'suppressed'::text,
    'delivery_unknown'::text,
    'cancelled'::text
  ]));

alter table public.dc_distribution_outbox
  alter column status set default 'held';

-- 4) One backend threshold owner.
create or replace function public.dc_artifact_promotion_threshold_v1()
returns integer
language sql
immutable
security definer
set search_path = ''
as $function$
  select 2;
$function$;

revoke all on function public.dc_artifact_promotion_threshold_v1() from public, anon, authenticated;

-- 5) Existing draft owner remains canonical. Activity datetime is changed by a
-- narrow own-draft command to keep the currently deployed create/update RPC
-- signatures backward-compatible until frontend release.
create or replace function public.dc_set_artifact_activity_v1(
  p_artifact_id uuid,
  p_activity_at timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_owner boolean;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  v_owner := public.dc_is_owner_admin(v_uid);
  if not public.dc_membership_active(v_uid) and not v_owner then raise exception 'MEMBERSHIP_REQUIRED'; end if;

  update public.dc_artifacts
     set activity_at = p_activity_at,
         updated_at = now()
   where id = p_artifact_id
     and author_profile_id = v_uid
     and status = 'draft';

  if not found then raise exception 'ARTIFACT_DRAFT_NOT_FOUND'; end if;
  return p_artifact_id;
end;
$function$;

revoke all on function public.dc_set_artifact_activity_v1(uuid,timestamptz) from public, anon;
grant execute on function public.dc_set_artifact_activity_v1(uuid,timestamptz) to authenticated;

-- 6) Extend canonical publication in-place. New publication atomically ensures
-- one held Telegram delivery row. Browser follow-up enqueue is no longer owner.
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

  update public.dc_artifacts
     set status='active',published_at=now(),updated_at=now()
   where id=p_artifact_id;

  insert into public.dc_distribution_outbox(artifact_id,channel,status,payload,available_at)
  values (
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
    where o.artifact_id=p_artifact_id and o.channel='telegram';
  end if;

  return jsonb_build_object(
    'artifact_id',p_artifact_id,
    'status','active',
    'published_at',now(),
    'owner_admin',v_owner,
    'slots_available',case when v_owner then null else greatest(v_granted-v_consuming-1,0) end,
    'telegram_outbox_id',v_outbox_id,
    'telegram_status','held'
  );
end;
$function$;

revoke all on function public.dc_publish_artifact_v1(uuid) from public, anon;
grant execute on function public.dc_publish_artifact_v1(uuid) to authenticated;

-- 7) Legacy author enqueue capability is retained only as a hard-deny compatibility
-- endpoint while old frontend may still call it. No authenticated actor can use it
-- to bypass promotion.
create or replace function public.dc_enqueue_artifact_distribution_v1(
  p_artifact_id uuid,
  p_channel text default 'telegram'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  raise exception 'PROMOTION_GATE_REQUIRED';
end;
$function$;

revoke all on function public.dc_enqueue_artifact_distribution_v1(uuid,text) from public, anon, authenticated;

-- 8) Safe promotion-state projection. Frontend receives the canonical threshold
-- from backend rather than owning the number 2.
create or replace function public.dc_board_promotion_state_read_v1()
returns table(
  artifact_id uuid,
  activity_at timestamptz,
  support_count bigint,
  promotion_threshold integer,
  my_support boolean,
  can_support boolean,
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

-- 9) Atomic immutable Dementor support + threshold release.
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
  if v_outbox.status='suppressed' then raise exception 'TELEGRAM_SUPPRESSED'; end if;
  if v_outbox.status in ('delivery_unknown','cancelled','failed') then raise exception 'DELIVERY_STATE_NOT_SUPPORTABLE'; end if;

  insert into public.dc_artifact_promotion_support(artifact_id,profile_id)
  values (p_artifact_id,v_uid)
  on conflict (artifact_id,profile_id) do nothing;

  select count(*)::bigint into v_count
  from public.dc_artifact_promotion_support s
  where s.artifact_id=p_artifact_id;

  if v_count >= v_threshold and v_outbox.status='held' then
    update public.dc_distribution_outbox
       set status='pending',
           available_at=now(),
           updated_at=now()
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

-- 10) Owner/Admin manual release uses the same outbox.
create or replace function public.dc_admin_promote_artifact_telegram_v1(p_artifact_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_artifact public.dc_artifacts%rowtype;
  v_status text;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.dc_is_owner_admin(v_uid) then raise exception 'OWNER_ADMIN_REQUIRED'; end if;
  perform public.dc_normalize_artifact_lifecycle_v1();

  select * into v_artifact from public.dc_artifacts a where a.id=p_artifact_id for update;
  if v_artifact.id is null
     or v_artifact.visibility <> 'community'
     or v_artifact.status <> 'active'
     or v_artifact.published_at is null
     or v_artifact.board_hidden_at is not null
     or (v_artifact.expires_at is not null and v_artifact.expires_at <= now())
  then raise exception 'ARTIFACT_NOT_PROMOTION_ELIGIBLE'; end if;

  select o.status into v_status
  from public.dc_distribution_outbox o
  where o.artifact_id=p_artifact_id and o.channel='telegram'
  for update;

  if v_status is null then raise exception 'PROMOTION_OUTBOX_MISSING'; end if;
  if v_status='suppressed' then raise exception 'TELEGRAM_SUPPRESSED'; end if;

  if v_status='held' then
    update public.dc_distribution_outbox
       set status='pending',available_at=now(),updated_at=now()
     where artifact_id=p_artifact_id and channel='telegram' and status='held';
    v_status := 'pending';
  end if;

  return jsonb_build_object('artifact_id',p_artifact_id,'delivery_status',v_status,'override',true);
end;
$function$;

revoke all on function public.dc_admin_promote_artifact_telegram_v1(uuid) from public, anon;
grant execute on function public.dc_admin_promote_artifact_telegram_v1(uuid) to authenticated;

-- 11) Owner/Admin suppression. Row lock makes suppression-vs-worker claim deterministic.
create or replace function public.dc_admin_suppress_artifact_telegram_v1(p_artifact_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_id uuid;
  v_status text;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.dc_is_owner_admin(v_uid) then raise exception 'OWNER_ADMIN_REQUIRED'; end if;

  select o.id,o.status into v_id,v_status
  from public.dc_distribution_outbox o
  where o.artifact_id=p_artifact_id and o.channel='telegram'
  for update;

  if v_id is null then raise exception 'PROMOTION_OUTBOX_MISSING'; end if;

  if v_status in ('held','pending') then
    update public.dc_distribution_outbox
       set status='suppressed',locked_at=null,updated_at=now()
     where id=v_id and status=v_status;
    v_status := 'suppressed';
  end if;

  return jsonb_build_object('artifact_id',p_artifact_id,'delivery_status',v_status);
end;
$function$;

revoke all on function public.dc_admin_suppress_artifact_telegram_v1(uuid) from public, anon;
grant execute on function public.dc_admin_suppress_artifact_telegram_v1(uuid) to authenticated;

-- 12) Minimal Artifact Board-hide. Canonical Artifact/history is retained.
create or replace function public.dc_admin_board_hide_artifact_v1(p_artifact_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_artifact_id uuid;
  v_outbox_id uuid;
  v_status text;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.dc_is_owner_admin(v_uid) then raise exception 'OWNER_ADMIN_REQUIRED'; end if;

  select a.id into v_artifact_id
  from public.dc_artifacts a
  where a.id=p_artifact_id and a.visibility='community' and a.published_at is not null
  for update;
  if v_artifact_id is null then raise exception 'ARTIFACT_NOT_FOUND'; end if;

  update public.dc_artifacts
     set board_hidden_at=coalesce(board_hidden_at,now()),
         board_hidden_by=coalesce(board_hidden_by,v_uid),
         updated_at=now()
   where id=p_artifact_id;

  select o.id,o.status into v_outbox_id,v_status
  from public.dc_distribution_outbox o
  where o.artifact_id=p_artifact_id and o.channel='telegram'
  for update;

  if v_outbox_id is not null and v_status in ('held','pending') then
    update public.dc_distribution_outbox
       set status='suppressed',locked_at=null,updated_at=now()
     where id=v_outbox_id and status=v_status;
    v_status := 'suppressed';
  end if;

  return jsonb_build_object(
    'artifact_id',p_artifact_id,
    'board_hidden',true,
    'delivery_status',v_status
  );
end;
$function$;

revoke all on function public.dc_admin_board_hide_artifact_v1(uuid) from public, anon;
grant execute on function public.dc_admin_board_hide_artifact_v1(uuid) to authenticated;

-- Owner/Admin moderation context for hidden Artifacts.
create or replace function public.dc_admin_board_hidden_read_v1()
returns table(
  artifact_id uuid,
  artifact_type text,
  title text,
  body text,
  status text,
  activity_at timestamptz,
  board_hidden_at timestamptz,
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
  select a.id,a.artifact_type,a.title,a.body,a.status,a.activity_at,a.board_hidden_at,o.status
  from public.dc_artifacts a
  left join public.dc_distribution_outbox o on o.artifact_id=a.id and o.channel='telegram'
  where a.visibility='community' and a.board_hidden_at is not null
  order by a.board_hidden_at desc;
end;
$function$;

revoke all on function public.dc_admin_board_hidden_read_v1() from public, anon;
grant execute on function public.dc_admin_board_hidden_read_v1() to authenticated;

-- 13) Explicit manual resolution of ambiguous delivery.
create or replace function public.dc_admin_resolve_delivery_unknown_v1(
  p_outbox_id uuid,
  p_resolution text,
  p_external_ref text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_status text;
  v_resolution text := lower(btrim(coalesce(p_resolution,'')));
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.dc_is_owner_admin(v_uid) then raise exception 'OWNER_ADMIN_REQUIRED'; end if;
  if v_resolution not in ('sent','retry','cancelled') then raise exception 'RESOLUTION_INVALID'; end if;

  select o.status into v_status
  from public.dc_distribution_outbox o
  where o.id=p_outbox_id
  for update;

  if v_status is null then raise exception 'OUTBOX_NOT_FOUND'; end if;
  if v_status <> 'delivery_unknown' then raise exception 'DELIVERY_NOT_UNKNOWN'; end if;

  if v_resolution='sent' then
    update public.dc_distribution_outbox
       set status='sent',
           sent_at=coalesce(sent_at,now()),
           external_ref=coalesce(nullif(btrim(p_external_ref),''),external_ref),
           locked_at=null,
           last_error=null,
           updated_at=now()
     where id=p_outbox_id and status='delivery_unknown';
    v_status := 'sent';
  elsif v_resolution='retry' then
    update public.dc_distribution_outbox
       set status='pending',available_at=now(),locked_at=null,updated_at=now()
     where id=p_outbox_id and status='delivery_unknown';
    v_status := 'pending';
  else
    update public.dc_distribution_outbox
       set status='cancelled',locked_at=null,updated_at=now()
     where id=p_outbox_id and status='delivery_unknown';
    v_status := 'cancelled';
  end if;

  return jsonb_build_object('outbox_id',p_outbox_id,'delivery_status',v_status,'manual_resolution',v_resolution);
end;
$function$;

revoke all on function public.dc_admin_resolve_delivery_unknown_v1(uuid,text,text) from public, anon;
grant execute on function public.dc_admin_resolve_delivery_unknown_v1(uuid,text,text) to authenticated;

-- 14) Worker-only state machine RPCs. Ordinary authenticated sessions receive no
-- EXECUTE grants. The Edge worker must authenticate as service_role.
create or replace function public.dc_distribution_requeue_failed_v1(p_limit integer default 5)
returns integer
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_count integer;
begin
  with candidates as (
    select o.id
    from public.dc_distribution_outbox o
    where o.status='failed'
      and o.available_at <= now()
      and o.attempts < 5
    order by o.created_at
    for update skip locked
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

create or replace function public.dc_distribution_claim_pending_v1(p_limit integer default 5)
returns table(id uuid,artifact_id uuid,attempts integer)
language plpgsql
security definer
set search_path = ''
as $function$
begin
  return query
  with candidates as (
    select o.id
    from public.dc_distribution_outbox o
    where o.status='pending'
      and o.available_at <= now()
      and o.attempts < 5
    order by o.created_at
    for update skip locked
    limit greatest(1,least(coalesce(p_limit,5),20))
  ), claimed as (
    update public.dc_distribution_outbox o
       set status='processing',
           locked_at=now(),
           attempts=o.attempts+1,
           updated_at=now()
    from candidates c
    where o.id=c.id and o.status='pending'
    returning o.id,o.artifact_id,o.attempts
  )
  select c.id,c.artifact_id,c.attempts from claimed c;
end;
$function$;

create or replace function public.dc_distribution_mark_sent_v1(p_outbox_id uuid,p_external_ref text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
begin
  update public.dc_distribution_outbox
     set status='sent',sent_at=now(),locked_at=null,external_ref=nullif(btrim(p_external_ref),''),last_error=null,updated_at=now()
   where id=p_outbox_id and status='processing';
  if not found then raise exception 'OUTBOX_NOT_PROCESSING'; end if;
  return true;
end;
$function$;

create or replace function public.dc_distribution_mark_failed_v1(p_outbox_id uuid,p_error text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
begin
  update public.dc_distribution_outbox
     set status='failed',locked_at=null,last_error=left(coalesce(p_error,'KNOWN_NON_DELIVERY'),500),available_at=now()+interval '5 minutes',updated_at=now()
   where id=p_outbox_id and status='processing';
  if not found then raise exception 'OUTBOX_NOT_PROCESSING'; end if;
  return true;
end;
$function$;

create or replace function public.dc_distribution_mark_unknown_v1(p_outbox_id uuid,p_error text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
begin
  update public.dc_distribution_outbox
     set status='delivery_unknown',locked_at=null,last_error=left(coalesce(p_error,'AMBIGUOUS_EXTERNAL_OUTCOME'),500),updated_at=now()
   where id=p_outbox_id and status='processing';
  if not found then raise exception 'OUTBOX_NOT_PROCESSING'; end if;
  return true;
end;
$function$;

revoke all on function public.dc_distribution_requeue_failed_v1(integer) from public, anon, authenticated;
revoke all on function public.dc_distribution_claim_pending_v1(integer) from public, anon, authenticated;
revoke all on function public.dc_distribution_mark_sent_v1(uuid,text) from public, anon, authenticated;
revoke all on function public.dc_distribution_mark_failed_v1(uuid,text) from public, anon, authenticated;
revoke all on function public.dc_distribution_mark_unknown_v1(uuid,text) from public, anon, authenticated;

grant execute on function public.dc_distribution_requeue_failed_v1(integer) to service_role;
grant execute on function public.dc_distribution_claim_pending_v1(integer) to service_role;
grant execute on function public.dc_distribution_mark_sent_v1(uuid,text) to service_role;
grant execute on function public.dc_distribution_mark_failed_v1(uuid,text) to service_role;
grant execute on function public.dc_distribution_mark_unknown_v1(uuid,text) to service_role;

-- 15) Hidden objects leave ordinary Guest Board presentation/interaction.
create or replace function public.dc_guest_board_read_v1()
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
    p.display_name,p.nickname,p.avatar_url,
    coalesce((select count(*)::bigint from public.dc_artifact_reactions r where r.artifact_id=a.id),0::bigint),
    coalesce((select count(*)::bigint from public.dc_guest_board_interests gi where gi.artifact_id=a.id),0::bigint),
    exists(select 1 from public.dc_guest_board_interests mine where mine.artifact_id=a.id and mine.profile_id=auth.uid()),
    bp.x,bp.y,bp.rotation,bp.size_class
  from public.dc_artifacts a
  join public.dc_member_public_profiles p on p.profile_id=a.author_profile_id
  left join public.dc_artifact_board_positions bp on bp.artifact_id=a.id and bp.board_id='community'
  where a.visibility='community'
    and a.status in ('active','expired','archived')
    and a.published_at is not null
    and a.board_hidden_at is null
    and (a.starts_at is null or a.starts_at <= now())
  order by a.published_at desc;
end;
$function$;

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
  if public.dc_membership_active() or public.dc_is_owner_admin() then raise exception 'MEMBER_USE_CANONICAL_DETAIL'; end if;
  perform public.dc_normalize_artifact_lifecycle_v1();

  select jsonb_build_object(
    'artifact',jsonb_build_object(
      'id',a.id,'author_profile_id',a.author_profile_id,'artifact_type',a.artifact_type,'title',a.title,'body',a.body,
      'external_url',a.external_url,'status',a.status,'visibility',a.visibility,'starts_at',a.starts_at,'activity_at',a.activity_at,
      'expires_at',a.expires_at,'published_at',a.published_at,'closed_at',a.closed_at,'created_at',a.created_at
    ),
    'author',jsonb_build_object('profile_id',p.profile_id,'display_name',p.display_name,'nickname',p.nickname,'avatar_url',p.avatar_url,'member_since',p.member_since),
    'reaction_count',coalesce((select count(*) from public.dc_artifact_reactions r where r.artifact_id=a.id),0),
    'guest_interest_count',coalesce((select count(*) from public.dc_guest_board_interests gi where gi.artifact_id=a.id),0),
    'my_guest_interest',exists(select 1 from public.dc_guest_board_interests mine where mine.artifact_id=a.id and mine.profile_id=v_uid),
    'my_guest_response_submitted',exists(select 1 from public.dc_artifact_responses rr where rr.artifact_id=a.id and rr.responder_profile_id=v_uid and rr.status='submitted'),
    'media',coalesce((select jsonb_agg(jsonb_build_object('id',m.id,'media_type',m.media_type,'storage_bucket',m.storage_bucket,'storage_path',m.storage_path,'metadata',m.metadata) order by m.created_at) from public.dc_artifact_media m where m.artifact_id=a.id),'[]'::jsonb)
  ) into v_result
  from public.dc_artifacts a
  join public.dc_member_public_profiles p on p.profile_id=a.author_profile_id
  where a.id=p_artifact_id
    and a.visibility='community'
    and a.status in ('active','expired','archived')
    and a.published_at is not null
    and a.board_hidden_at is null
    and (a.starts_at is null or a.starts_at <= now());

  if v_result is null then raise exception 'ARTIFACT_NOT_AVAILABLE'; end if;
  return v_result;
end;
$function$;

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
  if public.dc_membership_active() or public.dc_is_owner_admin() then raise exception 'MEMBER_USE_CANONICAL_REACTION'; end if;
  perform public.dc_normalize_artifact_lifecycle_v1();

  if not exists (
    select 1 from public.dc_artifacts a
    where a.id=p_artifact_id
      and a.visibility='community'
      and a.status in ('active','expired','archived')
      and a.published_at is not null
      and a.board_hidden_at is null
      and (a.starts_at is null or a.starts_at <= now())
  ) then raise exception 'ARTIFACT_NOT_AVAILABLE'; end if;

  if exists(select 1 from public.dc_guest_board_interests i where i.artifact_id=p_artifact_id and i.profile_id=v_uid) then
    delete from public.dc_guest_board_interests i where i.artifact_id=p_artifact_id and i.profile_id=v_uid;
    v_active := false;
  else
    insert into public.dc_guest_board_interests(artifact_id,profile_id) values (p_artifact_id,v_uid)
    on conflict (artifact_id,profile_id) do nothing;
    v_active := true;
  end if;

  select count(*)::bigint into v_count from public.dc_guest_board_interests i where i.artifact_id=p_artifact_id;
  return jsonb_build_object('active',v_active,'count',v_count);
end;
$function$;

-- 16) Hidden objects cannot receive new canonical Member reactions/responses or Guest responses.
drop policy if exists dc_artifact_reactions_insert_own on public.dc_artifact_reactions;
create policy dc_artifact_reactions_insert_own
on public.dc_artifact_reactions
for insert
to authenticated
with check (
  auth.uid()=profile_id
  and (public.dc_membership_active() or public.dc_is_owner_admin())
  and exists (
    select 1 from public.dc_artifacts a
    where a.id=dc_artifact_reactions.artifact_id
      and a.visibility='community'
      and a.status in ('active','expired','archived')
      and a.published_at is not null
      and a.board_hidden_at is null
  )
);

drop policy if exists dc_artifact_responses_insert_guest on public.dc_artifact_responses;
create policy dc_artifact_responses_insert_guest
on public.dc_artifact_responses
for insert
to authenticated
with check (
  auth.uid()=responder_profile_id
  and status='submitted'
  and not public.dc_membership_active()
  and not public.dc_is_owner_admin()
  and exists (
    select 1 from public.dc_artifacts a
    where a.id=dc_artifact_responses.artifact_id
      and a.author_profile_id<>auth.uid()
      and a.visibility='community'
      and a.status='active'
      and a.published_at is not null
      and a.board_hidden_at is null
      and (a.starts_at is null or a.starts_at<=now())
      and (a.expires_at is null or a.expires_at>now())
  )
);

drop policy if exists dc_artifact_responses_insert_own on public.dc_artifact_responses;
create policy dc_artifact_responses_insert_own
on public.dc_artifact_responses
for insert
to authenticated
with check (
  auth.uid()=responder_profile_id
  and status='submitted'
  and (public.dc_membership_active() or public.dc_is_owner_admin())
  and exists (
    select 1 from public.dc_artifacts a
    where a.id=dc_artifact_responses.artifact_id
      and a.author_profile_id<>auth.uid()
      and a.visibility='community'
      and a.status='active'
      and a.board_hidden_at is null
      and (a.expires_at is null or a.expires_at>now())
  )
);

commit;
