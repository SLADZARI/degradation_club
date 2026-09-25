-- Observed production compatibility overlay v1: exact policy state.
-- LOCAL VALIDATION ONLY. Read-only captured from production on 2026-09-24.
-- Scope is intentionally limited to the two proven policy differences.

drop policy if exists dc_merch_public_read on public.dc_merch_items;
create policy dc_merch_public_read
  on public.dc_merch_items
  for select
  to public
  using (public_visible = true);

drop policy if exists join_applications_auth_insert on public.join_applications;
