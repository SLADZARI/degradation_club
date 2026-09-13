create table if not exists public.mp_publishing_accounts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.mp_project_refs(id) on delete set null,
  channel text not null default 'instagram' check (channel in ('instagram')),
  account_name text not null,
  external_account_id text not null,
  credential_ref text not null,
  status text not null default 'ACTIVE' check (status in ('ACTIVE','DISCONNECTED','ERROR')),
  token_expires_at timestamptz,
  last_verified_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(channel, external_account_id)
);

create table if not exists public.mp_publishing_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.mp_project_refs(id) on delete restrict,
  account_id uuid not null references public.mp_publishing_accounts(id) on delete restrict,
  format text not null default 'reel' check (format in ('reel')),
  title text,
  video_url text not null,
  cover_url text,
  caption text not null default '',
  publish_at timestamptz,
  status text not null default 'DRAFT' check (status in ('DRAFT','READY','APPROVED','SCHEDULED','PUBLISHING','PUBLISHED','FAILED','CANCELLED')),
  prepared_by uuid not null references auth.users(id) on delete restrict,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  external_container_id text,
  external_media_id text,
  external_permalink text,
  published_at timestamptz,
  last_error_code text,
  last_error_message text,
  retry_count integer not null default 0 check (retry_count >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mp_publishing_events (
  id uuid primary key default gen_random_uuid(),
  publishing_item_id uuid not null references public.mp_publishing_items(id) on delete cascade,
  event_type text not null check (event_type in ('ITEM_CREATED','READY','APPROVED','SCHEDULED','PUBLISH_STARTED','CONTAINER_CREATED','MEDIA_PROCESSED','PUBLISHED','FAILED','RETRY_REQUESTED','CANCELLED')),
  actor_user_id uuid references auth.users(id) on delete set null,
  source text not null default 'weekly-os',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists mp_publishing_items_project_status_idx on public.mp_publishing_items(project_id, status);
create index if not exists mp_publishing_items_schedule_idx on public.mp_publishing_items(status, publish_at) where status = 'SCHEDULED';
create index if not exists mp_publishing_events_item_created_idx on public.mp_publishing_events(publishing_item_id, created_at desc);

alter table public.mp_publishing_accounts enable row level security;
alter table public.mp_publishing_items enable row level security;
alter table public.mp_publishing_events enable row level security;

create policy mp_publishing_accounts_select on public.mp_publishing_accounts
for select to authenticated
using (
  mp_private.current_user_is_mp_owner()
  or (project_id is not null and exists (
    select 1 from public.mp_project_assignments a
    where a.project_id = mp_publishing_accounts.project_id
      and a.user_id = auth.uid()
      and a.status = 'ACTIVE'
      and (a.valid_to is null or a.valid_to > now())
  ))
);

create policy mp_publishing_accounts_manage on public.mp_publishing_accounts
for all to authenticated
using (
  mp_private.current_user_is_mp_owner()
  or (project_id is not null and mp_private.current_user_manages_project(project_id))
)
with check (
  mp_private.current_user_is_mp_owner()
  or (project_id is not null and mp_private.current_user_manages_project(project_id))
);

create policy mp_publishing_items_select on public.mp_publishing_items
for select to authenticated
using (
  mp_private.current_user_is_mp_owner()
  or exists (
    select 1 from public.mp_project_assignments a
    where a.project_id = mp_publishing_items.project_id
      and a.user_id = auth.uid()
      and a.status in ('ACTIVE','WAITING')
      and (a.valid_to is null or a.valid_to > now())
  )
);

create policy mp_publishing_items_insert on public.mp_publishing_items
for insert to authenticated
with check (
  prepared_by = auth.uid()
  and exists (
    select 1 from public.mp_project_assignments a
    where a.project_id = mp_publishing_items.project_id
      and a.user_id = auth.uid()
      and a.status = 'ACTIVE'
      and (a.valid_to is null or a.valid_to > now())
  )
);

create policy mp_publishing_items_manage on public.mp_publishing_items
for update to authenticated
using (
  mp_private.current_user_is_mp_owner()
  or mp_private.current_user_manages_project(project_id)
)
with check (
  mp_private.current_user_is_mp_owner()
  or mp_private.current_user_manages_project(project_id)
);

create policy mp_publishing_items_delete on public.mp_publishing_items
for delete to authenticated
using (
  status = 'DRAFT'
  and (
    prepared_by = auth.uid()
    or mp_private.current_user_is_mp_owner()
    or mp_private.current_user_manages_project(project_id)
  )
);

create policy mp_publishing_events_select on public.mp_publishing_events
for select to authenticated
using (
  exists (
    select 1 from public.mp_publishing_items i
    where i.id = publishing_item_id
      and (
        mp_private.current_user_is_mp_owner()
        or exists (
          select 1 from public.mp_project_assignments a
          where a.project_id = i.project_id
            and a.user_id = auth.uid()
            and a.status in ('ACTIVE','WAITING')
            and (a.valid_to is null or a.valid_to > now())
        )
      )
  )
);

create policy mp_publishing_events_insert on public.mp_publishing_events
for insert to authenticated
with check (
  actor_user_id = auth.uid()
  and exists (
    select 1 from public.mp_publishing_items i
    where i.id = publishing_item_id
      and (
        mp_private.current_user_is_mp_owner()
        or mp_private.current_user_manages_project(i.project_id)
      )
  )
);

grant select on public.mp_publishing_accounts to authenticated;
grant select, insert, update, delete on public.mp_publishing_items to authenticated;
grant select, insert on public.mp_publishing_events to authenticated;
