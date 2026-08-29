-- Dementor Club / production RLS hotfix / 2026-08-29
-- Public catalog rows must be readable by anon without evaluating owner/admin tables.
-- Owner/admin write access remains governed by the separate authenticated policy.

begin;

drop policy if exists dc_merch_public_read on public.dc_merch_items;

create policy dc_merch_public_read
on public.dc_merch_items
for select
to public
using (public_visible = true);

commit;
