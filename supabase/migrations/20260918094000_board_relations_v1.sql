-- Board Relations v1 — Batch C schema/RPC/RLS contract.
-- Branch-only migration. Committing this file does NOT authorize live DB application.

begin;

create table public.dc_board_relations (
  id uuid primary key default gen_random_uuid(),
  relation_type text not null,
  origin_kind text not null,
  origin_source_id text not null,
  target_kind text not null,
  target_source_id text not null,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  deleted_by uuid,
  deleted_at timestamptz,

  constraint dc_board_relations_type_check
    check (relation_type in ('RELATED_TO','RESULT_OF','CONTINUES','ABOUT','REPORT_OF')),
  constraint dc_board_relations_origin_kind_check
    check (origin_kind in ('artifact','event','program')),
  constraint dc_board_relations_target_kind_check
    check (target_kind in ('artifact','event','program')),
  constraint dc_board_relations_origin_source_id_check
    check (origin_source_id = btrim(origin_source_id) and origin_source_id <> ''),
  constraint dc_board_relations_target_source_id_check
    check (target_source_id = btrim(target_source_id) and target_source_id <> ''),
  constraint dc_board_relations_origin_artifact_uuid_check
    check (
      origin_kind <> 'artifact'
      or origin_source_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    ),
  constraint dc_board_relations_target_artifact_uuid_check
    check (
      target_kind <> 'artifact'
      or target_source_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    ),
  constraint dc_board_relations_no_self_edge_check
    check ((origin_kind, origin_source_id) <> (target_kind, target_source_id)),
  constraint dc_board_relations_pair_check
    check (
      relation_type = 'RELATED_TO'
      or (relation_type = 'RESULT_OF' and target_kind = 'artifact')
      or (relation_type = 'CONTINUES' and origin_kind = target_kind)
      or (relation_type = 'ABOUT' and origin_kind = 'artifact')
      or (relation_type = 'REPORT_OF' and origin_kind = 'artifact' and target_kind in ('event','program'))
    ),
  constraint dc_board_relations_related_order_check
    check (
      relation_type <> 'RELATED_TO'
      or (origin_kind, origin_source_id) < (target_kind, target_source_id)
    ),
  constraint dc_board_relations_delete_audit_check
    check (
      (deleted_at is null and deleted_by is null)
      or (deleted_at is not null and deleted_by is not null)
    )
);

create unique index dc_board_relations_active_edge_uidx
  on public.dc_board_relations(
    relation_type,
    origin_kind,
    origin_source_id,
    target_kind,
    target_source_id
  )
  where deleted_at is null;

create index dc_board_relations_origin_lookup_idx
  on public.dc_board_relations(origin_kind, origin_source_id);

create index dc_board_relations_target_lookup_idx
  on public.dc_board_relations(target_kind, target_source_id);

alter table public.dc_board_relations enable row level security;
revoke all on table public.dc_board_relations from public, anon, authenticated;

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
    and (
      (
        r.origin_kind = 'artifact'
        and exists (
          select 1
          from public.dc_artifacts a
          where a.id = r.origin_source_id::uuid
            and a.visibility = 'community'
            and a.published_at is not null
            and a.status in ('active','expired','archived')
        )
      )
      or (
        r.origin_kind = 'event'
        and exists (
          select 1
          from public.dc_entities e
          join public.dc_events ev on ev.entity_id = e.id
          where e.entity_type = 'event'
            and e.slug = r.origin_source_id
            and e.provenance_status = 'confirmed'
        )
      )
      or (
        r.origin_kind = 'program'
        and exists (
          select 1
          from public.dc_entities e
          join public.dc_programs pr on pr.entity_id = e.id
          where e.entity_type = 'program'
            and e.slug = r.origin_source_id
            and e.provenance_status = 'confirmed'
        )
      )
    )
    and (
      (
        r.target_kind = 'artifact'
        and exists (
          select 1
          from public.dc_artifacts a
          where a.id = r.target_source_id::uuid
            and a.visibility = 'community'
            and a.published_at is not null
            and a.status in ('active','expired','archived')
        )
      )
      or (
        r.target_kind = 'event'
        and exists (
          select 1
          from public.dc_entities e
          join public.dc_events ev on ev.entity_id = e.id
          where e.entity_type = 'event'
            and e.slug = r.target_source_id
            and e.provenance_status = 'confirmed'
        )
      )
      or (
        r.target_kind = 'program'
        and exists (
          select 1
          from public.dc_entities e
          join public.dc_programs pr on pr.entity_id = e.id
          where e.entity_type = 'program'
            and e.slug = r.target_source_id
            and e.provenance_status = 'confirmed'
        )
      )
    )
  order by r.created_at, r.id;
end;
$function$;

revoke all on function public.dc_board_relations_read_v1() from public, anon, authenticated;
grant execute on function public.dc_board_relations_read_v1() to authenticated;

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
  if v_origin_source_id = '' or v_target_source_id = '' then
    raise exception 'RELATION_SOURCE_ID_REQUIRED';
  end if;

  if not (
    v_relation_type = 'RELATED_TO'
    or (v_relation_type = 'RESULT_OF' and v_target_kind = 'artifact')
    or (v_relation_type = 'CONTINUES' and v_origin_kind = v_target_kind)
    or (v_relation_type = 'ABOUT' and v_origin_kind = 'artifact')
    or (v_relation_type = 'REPORT_OF' and v_origin_kind = 'artifact' and v_target_kind in ('event','program'))
  ) then
    raise exception 'RELATION_ENDPOINT_PAIR_UNSUPPORTED';
  end if;

  -- Resolve and validate canonical origin.
  if v_origin_kind = 'artifact' then
    begin
      v_origin_artifact_id := v_origin_source_id::uuid;
    exception when invalid_text_representation then
      raise exception 'RELATION_ORIGIN_SOURCE_INVALID';
    end;
    v_origin_source_id := v_origin_artifact_id::text;
    if not exists (
      select 1
      from public.dc_artifacts a
      where a.id = v_origin_artifact_id
        and a.visibility = 'community'
        and a.published_at is not null
        and a.status in ('active','expired','archived')
    ) then
      raise exception 'RELATION_ORIGIN_SOURCE_NOT_AVAILABLE';
    end if;
  elsif v_origin_kind = 'event' then
    select e.id into v_origin_entity_id
    from public.dc_entities e
    join public.dc_events ev on ev.entity_id = e.id
    where e.entity_type = 'event'
      and e.slug = v_origin_source_id
      and e.provenance_status = 'confirmed';
    if v_origin_entity_id is null then
      raise exception 'RELATION_ORIGIN_SOURCE_NOT_AVAILABLE';
    end if;
  else
    select e.id into v_origin_entity_id
    from public.dc_entities e
    join public.dc_programs pr on pr.entity_id = e.id
    where e.entity_type = 'program'
      and e.slug = v_origin_source_id
      and e.provenance_status = 'confirmed';
    if v_origin_entity_id is null then
      raise exception 'RELATION_ORIGIN_SOURCE_NOT_AVAILABLE';
    end if;
  end if;

  -- Resolve and validate canonical target.
  if v_target_kind = 'artifact' then
    begin
      v_target_artifact_id := v_target_source_id::uuid;
    exception when invalid_text_representation then
      raise exception 'RELATION_TARGET_SOURCE_INVALID';
    end;
    v_target_source_id := v_target_artifact_id::text;
    if not exists (
      select 1
      from public.dc_artifacts a
      where a.id = v_target_artifact_id
        and a.visibility = 'community'
        and a.published_at is not null
        and a.status in ('active','expired','archived')
    ) then
      raise exception 'RELATION_TARGET_SOURCE_NOT_AVAILABLE';
    end if;
  elsif v_target_kind = 'event' then
    select e.id into v_target_entity_id
    from public.dc_entities e
    join public.dc_events ev on ev.entity_id = e.id
    where e.entity_type = 'event'
      and e.slug = v_target_source_id
      and e.provenance_status = 'confirmed';
    if v_target_entity_id is null then
      raise exception 'RELATION_TARGET_SOURCE_NOT_AVAILABLE';
    end if;
  else
    select e.id into v_target_entity_id
    from public.dc_entities e
    join public.dc_programs pr on pr.entity_id = e.id
    where e.entity_type = 'program'
      and e.slug = v_target_source_id
      and e.provenance_status = 'confirmed';
    if v_target_entity_id is null then
      raise exception 'RELATION_TARGET_SOURCE_NOT_AVAILABLE';
    end if;
  end if;

  if (v_origin_kind, v_origin_source_id) = (v_target_kind, v_target_source_id) then
    raise exception 'RELATION_SELF_EDGE_FORBIDDEN';
  end if;

  v_owner_admin := public.dc_is_owner_admin(v_uid);

  if v_origin_kind = 'artifact' then
    v_can_manage_origin := v_owner_admin or (
      public.dc_membership_active(v_uid)
      and exists (
        select 1 from public.dc_artifacts a
        where a.id = v_origin_artifact_id
          and a.author_profile_id = v_uid
      )
    );
  else
    v_can_manage_origin := v_owner_admin or (
      public.dc_membership_active(v_uid)
      and public.dc_has_role('dementor', v_uid)
      and exists (
        select 1
        from public.dc_entity_assignments a
        where a.profile_id = v_uid
          and a.entity_id = v_origin_entity_id
          and a.role = 'dementor'
          and a.status = 'active'
          and a.provenance_status = 'confirmed'
          and a.valid_from <= now()
          and (a.valid_to is null or a.valid_to > now())
      )
    );
  end if;

  if v_relation_type = 'RELATED_TO' then
    if v_target_kind = 'artifact' then
      v_can_manage_target := v_owner_admin or (
        public.dc_membership_active(v_uid)
        and exists (
          select 1 from public.dc_artifacts a
          where a.id = v_target_artifact_id
            and a.author_profile_id = v_uid
        )
      );
    else
      v_can_manage_target := v_owner_admin or (
        public.dc_membership_active(v_uid)
        and public.dc_has_role('dementor', v_uid)
        and exists (
          select 1
          from public.dc_entity_assignments a
          where a.profile_id = v_uid
            and a.entity_id = v_target_entity_id
            and a.role = 'dementor'
            and a.status = 'active'
            and a.provenance_status = 'confirmed'
            and a.valid_from <= now()
            and (a.valid_to is null or a.valid_to > now())
        )
      );
    end if;

    if not (v_can_manage_origin or v_can_manage_target) then
      raise exception 'RELATION_WRITE_FORBIDDEN' using errcode = '42501';
    end if;
  elsif not v_can_manage_origin then
    raise exception 'RELATION_WRITE_FORBIDDEN' using errcode = '42501';
  end if;

  v_store_origin_kind := v_origin_kind;
  v_store_origin_source_id := v_origin_source_id;
  v_store_target_kind := v_target_kind;
  v_store_target_source_id := v_target_source_id;

  if v_relation_type = 'RELATED_TO'
     and (
       v_store_origin_kind > v_store_target_kind
       or (
         v_store_origin_kind = v_store_target_kind
         and v_store_origin_source_id > v_store_target_source_id
       )
     ) then
    v_swap_kind := v_store_origin_kind;
    v_swap_source_id := v_store_origin_source_id;
    v_store_origin_kind := v_store_target_kind;
    v_store_origin_source_id := v_store_target_source_id;
    v_store_target_kind := v_swap_kind;
    v_store_target_source_id := v_swap_source_id;
  end if;

  if exists (
    select 1
    from public.dc_board_relations r
    where r.relation_type = v_relation_type
      and r.origin_kind = v_store_origin_kind
      and r.origin_source_id = v_store_origin_source_id
      and r.target_kind = v_store_target_kind
      and r.target_source_id = v_store_target_source_id
      and r.deleted_at is null
  ) then
    raise exception 'RELATION_DUPLICATE';
  end if;

  begin
    insert into public.dc_board_relations(
      relation_type,
      origin_kind,
      origin_source_id,
      target_kind,
      target_source_id,
      created_by
    ) values (
      v_relation_type,
      v_store_origin_kind,
      v_store_origin_source_id,
      v_store_target_kind,
      v_store_target_source_id,
      v_uid
    )
    returning id into v_id;
  exception when unique_violation then
    raise exception 'RELATION_DUPLICATE';
  end;

  return v_id;
end;
$function$;

revoke all on function public.dc_board_relation_create_v1(text,text,text,text,text) from public, anon, authenticated;
grant execute on function public.dc_board_relation_create_v1(text,text,text,text,text) to authenticated;

create or replace function public.dc_board_relation_delete_v1(p_relation_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_relation public.dc_board_relations%rowtype;
  v_owner_admin boolean := false;
  v_origin_artifact_id uuid;
  v_target_artifact_id uuid;
  v_origin_entity_id uuid;
  v_target_entity_id uuid;
  v_can_manage_origin boolean := false;
  v_can_manage_target boolean := false;
begin
  if v_uid is null then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;

  select * into v_relation
  from public.dc_board_relations r
  where r.id = p_relation_id
    and r.deleted_at is null
  for update;

  if v_relation.id is null then
    raise exception 'RELATION_NOT_FOUND';
  end if;

  v_owner_admin := public.dc_is_owner_admin(v_uid);

  if not v_owner_admin then
    if v_relation.origin_kind = 'artifact' then
      v_origin_artifact_id := v_relation.origin_source_id::uuid;
      v_can_manage_origin := public.dc_membership_active(v_uid)
        and exists (
          select 1 from public.dc_artifacts a
          where a.id = v_origin_artifact_id
            and a.visibility = 'community'
            and a.published_at is not null
            and a.status in ('active','expired','archived')
            and a.author_profile_id = v_uid
        );
    elsif v_relation.origin_kind = 'event' then
      select e.id into v_origin_entity_id
      from public.dc_entities e
      join public.dc_events ev on ev.entity_id = e.id
      where e.entity_type = 'event'
        and e.slug = v_relation.origin_source_id
        and e.provenance_status = 'confirmed';
      v_can_manage_origin := v_origin_entity_id is not null
        and public.dc_membership_active(v_uid)
        and public.dc_has_role('dementor', v_uid)
        and exists (
          select 1 from public.dc_entity_assignments a
          where a.profile_id = v_uid
            and a.entity_id = v_origin_entity_id
            and a.role = 'dementor'
            and a.status = 'active'
            and a.provenance_status = 'confirmed'
            and a.valid_from <= now()
            and (a.valid_to is null or a.valid_to > now())
        );
    elsif v_relation.origin_kind = 'program' then
      select e.id into v_origin_entity_id
      from public.dc_entities e
      join public.dc_programs pr on pr.entity_id = e.id
      where e.entity_type = 'program'
        and e.slug = v_relation.origin_source_id
        and e.provenance_status = 'confirmed';
      v_can_manage_origin := v_origin_entity_id is not null
        and public.dc_membership_active(v_uid)
        and public.dc_has_role('dementor', v_uid)
        and exists (
          select 1 from public.dc_entity_assignments a
          where a.profile_id = v_uid
            and a.entity_id = v_origin_entity_id
            and a.role = 'dementor'
            and a.status = 'active'
            and a.provenance_status = 'confirmed'
            and a.valid_from <= now()
            and (a.valid_to is null or a.valid_to > now())
        );
    end if;

    if v_relation.relation_type = 'RELATED_TO' then
      if v_relation.target_kind = 'artifact' then
        v_target_artifact_id := v_relation.target_source_id::uuid;
        v_can_manage_target := public.dc_membership_active(v_uid)
          and exists (
            select 1 from public.dc_artifacts a
            where a.id = v_target_artifact_id
              and a.visibility = 'community'
              and a.published_at is not null
              and a.status in ('active','expired','archived')
              and a.author_profile_id = v_uid
          );
      elsif v_relation.target_kind = 'event' then
        select e.id into v_target_entity_id
        from public.dc_entities e
        join public.dc_events ev on ev.entity_id = e.id
        where e.entity_type = 'event'
          and e.slug = v_relation.target_source_id
          and e.provenance_status = 'confirmed';
        v_can_manage_target := v_target_entity_id is not null
          and public.dc_membership_active(v_uid)
          and public.dc_has_role('dementor', v_uid)
          and exists (
            select 1 from public.dc_entity_assignments a
            where a.profile_id = v_uid
              and a.entity_id = v_target_entity_id
              and a.role = 'dementor'
              and a.status = 'active'
              and a.provenance_status = 'confirmed'
              and a.valid_from <= now()
              and (a.valid_to is null or a.valid_to > now())
          );
      elsif v_relation.target_kind = 'program' then
        select e.id into v_target_entity_id
        from public.dc_entities e
        join public.dc_programs pr on pr.entity_id = e.id
        where e.entity_type = 'program'
          and e.slug = v_relation.target_source_id
          and e.provenance_status = 'confirmed';
        v_can_manage_target := v_target_entity_id is not null
          and public.dc_membership_active(v_uid)
          and public.dc_has_role('dementor', v_uid)
          and exists (
            select 1 from public.dc_entity_assignments a
            where a.profile_id = v_uid
              and a.entity_id = v_target_entity_id
              and a.role = 'dementor'
              and a.status = 'active'
              and a.provenance_status = 'confirmed'
              and a.valid_from <= now()
              and (a.valid_to is null or a.valid_to > now())
          );
      end if;

      if not (v_can_manage_origin or v_can_manage_target) then
        raise exception 'RELATION_DELETE_FORBIDDEN' using errcode = '42501';
      end if;
    elsif not v_can_manage_origin then
      raise exception 'RELATION_DELETE_FORBIDDEN' using errcode = '42501';
    end if;
  end if;

  update public.dc_board_relations
  set deleted_at = now(),
      deleted_by = v_uid
  where id = v_relation.id
    and deleted_at is null;

  return v_relation.id;
end;
$function$;

revoke all on function public.dc_board_relation_delete_v1(uuid) from public, anon, authenticated;
grant execute on function public.dc_board_relation_delete_v1(uuid) to authenticated;

create or replace function public.dc_board_relation_source_slug_guard_v1()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $function$
begin
  if old.entity_type in ('event','program')
     and (
       new.entity_type is distinct from old.entity_type
       or new.slug is distinct from old.slug
     )
     and exists (
       select 1
       from public.dc_board_relations r
       where (r.origin_kind = old.entity_type and r.origin_source_id = old.slug)
          or (r.target_kind = old.entity_type and r.target_source_id = old.slug)
     ) then
    raise exception 'RELATION_SOURCE_ID_RENAME_REQUIRES_CONTROLLED_MIGRATION';
  end if;
  return new;
end;
$function$;

revoke all on function public.dc_board_relation_source_slug_guard_v1() from public, anon, authenticated;

drop trigger if exists dc_board_relation_source_slug_guard_v1 on public.dc_entities;
create trigger dc_board_relation_source_slug_guard_v1
before update of slug, entity_type on public.dc_entities
for each row
execute function public.dc_board_relation_source_slug_guard_v1();

commit;
