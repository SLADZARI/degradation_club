create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active','converted','abandoned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists carts_one_active_per_profile_idx on public.carts(profile_id) where status='active';
create index if not exists carts_profile_id_idx on public.carts(profile_id);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id text not null,
  sku text not null,
  title text not null,
  variant_id text,
  variant_label text,
  size text,
  unit_price_eur numeric(10,2) not null check (unit_price_eur >= 0),
  quantity integer not null default 1 check (quantity > 0 and quantity <= 99),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists cart_items_cart_id_idx on public.cart_items(cart_id);
create index if not exists cart_items_sku_idx on public.cart_items(sku);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  cart_id uuid references public.carts(id) on delete set null,
  reference text not null unique,
  status text not null default 'draft' check (status in ('draft','awaiting_payment','paid','confirmed','cancelled')),
  contact_name text,
  contact text,
  country text,
  city text,
  note text,
  currency text not null default 'EUR',
  total_eur numeric(10,2) not null default 0 check (total_eur >= 0),
  payment_method text not null default 'BLIK',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_profile_id_idx on public.orders(profile_id);
create index if not exists orders_status_idx on public.orders(status);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  sku text not null,
  title text not null,
  variant_id text,
  variant_label text,
  size text,
  unit_price_eur numeric(10,2) not null check (unit_price_eur >= 0),
  quantity integer not null check (quantity > 0 and quantity <= 99),
  metadata jsonb not null default '{}'::jsonb
);
create index if not exists order_items_order_id_idx on public.order_items(order_id);

alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy carts_select_own on public.carts for select to authenticated using (profile_id = (select auth.uid()));
create policy carts_insert_own on public.carts for insert to authenticated with check (profile_id = (select auth.uid()));
create policy carts_update_own on public.carts for update to authenticated using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));
create policy carts_delete_own on public.carts for delete to authenticated using (profile_id = (select auth.uid()));

create policy cart_items_select_own on public.cart_items for select to authenticated using (exists (select 1 from public.carts c where c.id=cart_id and c.profile_id=(select auth.uid())));
create policy cart_items_insert_own on public.cart_items for insert to authenticated with check (exists (select 1 from public.carts c where c.id=cart_id and c.profile_id=(select auth.uid())));
create policy cart_items_update_own on public.cart_items for update to authenticated using (exists (select 1 from public.carts c where c.id=cart_id and c.profile_id=(select auth.uid()))) with check (exists (select 1 from public.carts c where c.id=cart_id and c.profile_id=(select auth.uid())));
create policy cart_items_delete_own on public.cart_items for delete to authenticated using (exists (select 1 from public.carts c where c.id=cart_id and c.profile_id=(select auth.uid())));

create policy orders_select_own on public.orders for select to authenticated using (profile_id = (select auth.uid()));
create policy orders_insert_own on public.orders for insert to authenticated with check (profile_id = (select auth.uid()));
create policy orders_update_own on public.orders for update to authenticated using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));

create policy order_items_select_own on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id=order_id and o.profile_id=(select auth.uid())));
create policy order_items_insert_own on public.order_items for insert to authenticated with check (exists (select 1 from public.orders o where o.id=order_id and o.profile_id=(select auth.uid())));

revoke all on public.carts, public.cart_items, public.orders, public.order_items from anon;
grant select, insert, update, delete on public.carts, public.cart_items to authenticated;
grant select, insert, update on public.orders to authenticated;
grant select, insert on public.order_items to authenticated;