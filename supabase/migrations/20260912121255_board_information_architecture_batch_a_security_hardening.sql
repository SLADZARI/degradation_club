-- Board Information Architecture v1 — Batch A security hardening.
-- Post-apply linter correction: keep Guest Board read authenticated-only.

begin;

revoke all on function public.dc_guest_board_read_v1() from public;
grant execute on function public.dc_guest_board_read_v1() to authenticated;

commit;
