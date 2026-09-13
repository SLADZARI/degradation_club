begin;

create or replace function mp_private.current_user_owns_report(target_report_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.mp_reports r
    where r.id = target_report_id
      and r.author_user_id = auth.uid()
  );
$$;

create or replace function mp_private.current_user_is_report_recipient(target_report_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.mp_report_recipients rr
    where rr.report_id = target_report_id
      and rr.recipient_user_id = auth.uid()
  );
$$;

revoke all on function mp_private.current_user_owns_report(uuid) from public;
revoke all on function mp_private.current_user_is_report_recipient(uuid) from public;
grant execute on function mp_private.current_user_owns_report(uuid) to authenticated;
grant execute on function mp_private.current_user_is_report_recipient(uuid) to authenticated;

drop policy if exists mp_reports_select on public.mp_reports;
create policy mp_reports_select on public.mp_reports for select to authenticated
using (
  author_user_id = auth.uid()
  or mp_private.current_user_is_mp_owner()
  or mp_private.current_user_is_report_recipient(id)
);

drop policy if exists mp_report_recipients_select on public.mp_report_recipients;
create policy mp_report_recipients_select on public.mp_report_recipients for select to authenticated
using (
  recipient_user_id = auth.uid()
  or mp_private.current_user_is_mp_owner()
  or mp_private.current_user_owns_report(report_id)
);

drop policy if exists mp_report_recipients_insert on public.mp_report_recipients;
create policy mp_report_recipients_insert on public.mp_report_recipients for insert to authenticated
with check (
  mp_private.current_user_is_mp_owner()
  or mp_private.current_user_owns_report(report_id)
);

drop policy if exists mp_report_recipients_delete on public.mp_report_recipients;
create policy mp_report_recipients_delete on public.mp_report_recipients for delete to authenticated
using (
  mp_private.current_user_is_mp_owner()
  or mp_private.current_user_owns_report(report_id)
);

drop policy if exists mp_report_items_select on public.mp_report_items;
create policy mp_report_items_select on public.mp_report_items for select to authenticated
using (
  mp_private.current_user_is_mp_owner()
  or mp_private.current_user_owns_report(report_id)
  or mp_private.current_user_is_report_recipient(report_id)
);

drop policy if exists mp_report_items_insert on public.mp_report_items;
create policy mp_report_items_insert on public.mp_report_items for insert to authenticated
with check (
  mp_private.current_user_is_mp_owner()
  or mp_private.current_user_owns_report(report_id)
);

drop policy if exists mp_report_items_update on public.mp_report_items;
create policy mp_report_items_update on public.mp_report_items for update to authenticated
using (
  mp_private.current_user_is_mp_owner()
  or mp_private.current_user_owns_report(report_id)
)
with check (
  mp_private.current_user_is_mp_owner()
  or mp_private.current_user_owns_report(report_id)
);

drop policy if exists mp_report_items_delete on public.mp_report_items;
create policy mp_report_items_delete on public.mp_report_items for delete to authenticated
using (
  mp_private.current_user_is_mp_owner()
  or mp_private.current_user_owns_report(report_id)
);

commit;