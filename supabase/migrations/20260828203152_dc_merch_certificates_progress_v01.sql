create table if not exists public.dc_merch_items (
  sku text primary key,
  title text not null,
  item_type text not null check (item_type in ('object','wear','paper','edition','project_edition')),
  base_price_eur numeric(10,2),
  sales_state text not null default 'not_open' check (sales_state in ('not_open','available','preorder','reservation_confirmed','production','shipped','sold_out','cancelled','archived')),
  public_visible boolean not null default true,
  source_ref text,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);
alter table public.dc_merch_items enable row level security;
grant select on public.dc_merch_items to anon, authenticated;
grant insert, update on public.dc_merch_items to authenticated;
drop policy if exists dc_merch_public_read on public.dc_merch_items;
create policy dc_merch_public_read on public.dc_merch_items for select using (public_visible = true or exists (select 1 from public.dc_role_assignments r where r.profile_id=auth.uid() and r.role='owner_admin' and r.status='active'));
drop policy if exists dc_merch_owner_admin_write on public.dc_merch_items;
create policy dc_merch_owner_admin_write on public.dc_merch_items for all to authenticated using (exists (select 1 from public.dc_role_assignments r where r.profile_id=auth.uid() and r.role='owner_admin' and r.status='active')) with check (exists (select 1 from public.dc_role_assignments r where r.profile_id=auth.uid() and r.role='owner_admin' and r.status='active'));

insert into public.dc_merch_items(sku,title,item_type,base_price_eur,sales_state,public_visible,source_ref)
values
('DC-OBJECT-001','OBJECT 001 — НЕ НАДО','object',220,'not_open',true,'dementor-club/merch/products/OBJECT_001_NE_NADO.md'),
('SH-DEM-01','OVERTHINKING IS MY CARDIO.','wear',null,'not_open',true,'dementor-club/merch/products/SH_DEM_01_OVERTHINKING_IS_MY_CARDIO.md'),
('SH-DEM-02','PERSONAL GROWTH CANCELLED.','wear',null,'not_open',true,'dementor-club/merch/products/SH_DEM_02_PERSONAL_GROWTH_CANCELLED.md'),
('SH-DEM-03','SUCCESS IS BORING.','wear',null,'not_open',true,'dementor-club/merch/products/SH_DEM_03_SUCCESS_IS_BORING.md')
on conflict (sku) do nothing;

create table if not exists public.dc_program_certificates (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  program_slug text not null,
  certificate_type text not null default 'completion',
  certificate_title text not null,
  certificate_code text not null unique,
  result_json jsonb not null default '{}'::jsonb,
  issued_at timestamptz not null default now(),
  unique(profile_id, program_slug, certificate_type)
);
alter table public.dc_program_certificates enable row level security;
grant select, insert, update on public.dc_program_certificates to authenticated;
drop policy if exists dc_cert_own_read on public.dc_program_certificates;
create policy dc_cert_own_read on public.dc_program_certificates for select to authenticated using (profile_id=auth.uid());
drop policy if exists dc_cert_own_insert on public.dc_program_certificates;
create policy dc_cert_own_insert on public.dc_program_certificates for insert to authenticated with check (profile_id=auth.uid());
drop policy if exists dc_cert_own_update on public.dc_program_certificates;
create policy dc_cert_own_update on public.dc_program_certificates for update to authenticated using (profile_id=auth.uid()) with check (profile_id=auth.uid());

create table if not exists public.dc_progress_signals (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  source_type text not null check (source_type in ('join','program','assessment')),
  source_ref text not null,
  stage_ref text,
  degradation_level numeric,
  level_label text,
  payload jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now(),
  unique(profile_id, source_type, source_ref, stage_ref)
);
alter table public.dc_progress_signals enable row level security;
grant select, insert, update on public.dc_progress_signals to authenticated;
drop policy if exists dc_progress_own_read on public.dc_progress_signals;
create policy dc_progress_own_read on public.dc_progress_signals for select to authenticated using (profile_id=auth.uid());
drop policy if exists dc_progress_own_insert on public.dc_progress_signals;
create policy dc_progress_own_insert on public.dc_progress_signals for insert to authenticated with check (profile_id=auth.uid());
drop policy if exists dc_progress_own_update on public.dc_progress_signals;
create policy dc_progress_own_update on public.dc_progress_signals for update to authenticated using (profile_id=auth.uid()) with check (profile_id=auth.uid());