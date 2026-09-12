-- Board IA G8 cleanup — trusted Telegram worker scheduler v1.
--
-- Purpose:
-- - restore one trusted automatic invocation path for telegram-outbox-worker;
-- - keep ordinary authenticated browser sessions outside worker authority;
-- - store scheduler credentials in Supabase Vault, never in public runtime code;
-- - call the existing canonical worker/outbox state machine rather than adding a second delivery owner.
--
-- Production application requires separate owner authorization.

begin;

create extension if not exists pg_net;
create extension if not exists pg_cron;

-- The project URL and publishable key are not privileged credentials, but keeping
-- all scheduler inputs in Vault avoids embedding runtime configuration in cron.job.
-- The worker scheduler token is generated inside Postgres and never committed.
do $block$
begin
  if not exists (select 1 from vault.secrets where name='dc_worker_project_url_v1') then
    perform vault.create_secret(
      'https://mmekfydwbvptbdatwitj.supabase.co',
      'dc_worker_project_url_v1',
      'Dementor Club trusted Telegram worker scheduler project URL'
    );
  end if;

  if not exists (select 1 from vault.secrets where name='dc_worker_publishable_key_v1') then
    perform vault.create_secret(
      'sb_publishable_a7e_Ndwwii8lyt_xmezoVw_ijxfh_yg',
      'dc_worker_publishable_key_v1',
      'Dementor Club trusted Telegram worker scheduler gateway key'
    );
  end if;

  if not exists (select 1 from vault.secrets where name='dc_telegram_worker_scheduler_token_v1') then
    perform vault.create_secret(
      encode(extensions.gen_random_bytes(32),'hex'),
      'dc_telegram_worker_scheduler_token_v1',
      'Dementor Club private token for DB cron -> telegram-outbox-worker'
    );
  end if;
end
$block$;

-- Worker v11 uses service role internally. This narrow function lets that worker
-- validate the opaque scheduler token without returning or exposing the stored
-- Vault secret. Ordinary API roles have no EXECUTE authority.
create or replace function public.dc_validate_telegram_worker_scheduler_token_v1(p_token text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select
    p_token is not null
    and length(p_token) >= 32
    and exists (
      select 1
      from vault.decrypted_secrets s
      where s.name='dc_telegram_worker_scheduler_token_v1'
        and s.decrypted_secret=p_token
    );
$function$;

revoke all on function public.dc_validate_telegram_worker_scheduler_token_v1(text) from public, anon, authenticated;
grant execute on function public.dc_validate_telegram_worker_scheduler_token_v1(text) to service_role;

-- One scheduler owner. It invokes the worker only when there is actionable work,
-- so an idle Board does not create a permanent stream of Edge Function calls.
-- Failed rows are included because worker v10+ owns eligibility revalidation and
-- controlled failed -> pending requeue through dc_distribution_requeue_failed_v1.
create or replace function public.dc_telegram_worker_scheduler_tick_v1()
returns bigint
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_project_url text;
  v_publishable_key text;
  v_scheduler_token text;
  v_request_id bigint;
begin
  if not exists (
    select 1
    from public.dc_distribution_outbox o
    where
      (o.status='pending' and o.available_at <= now())
      or (o.status='failed' and o.available_at <= now() and o.attempts < 5)
  ) then
    return null;
  end if;

  select s.decrypted_secret into v_project_url
  from vault.decrypted_secrets s
  where s.name='dc_worker_project_url_v1';

  select s.decrypted_secret into v_publishable_key
  from vault.decrypted_secrets s
  where s.name='dc_worker_publishable_key_v1';

  select s.decrypted_secret into v_scheduler_token
  from vault.decrypted_secrets s
  where s.name='dc_telegram_worker_scheduler_token_v1';

  if coalesce(v_project_url,'')=''
     or coalesce(v_publishable_key,'')=''
     or coalesce(v_scheduler_token,'')=''
  then
    raise exception 'WORKER_SCHEDULER_SECRET_MISSING';
  end if;

  select net.http_post(
    url := rtrim(v_project_url,'/') || '/functions/v1/telegram-outbox-worker',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'apikey',v_publishable_key,
      'x-dc-worker-token',v_scheduler_token
    ),
    body := jsonb_build_object(
      'source','db-cron-v1',
      'requested_at',now()
    ),
    timeout_milliseconds := 10000
  ) into v_request_id;

  return v_request_id;
end;
$function$;

revoke all on function public.dc_telegram_worker_scheduler_tick_v1() from public, anon, authenticated;
grant execute on function public.dc_telegram_worker_scheduler_tick_v1() to service_role;

-- pg_cron job names are canonical. Re-applying this migration contract replaces
-- only this named job rather than creating parallel schedulers.
do $block$
declare
  v_job_id bigint;
begin
  select j.jobid into v_job_id
  from cron.job j
  where j.jobname='dc-telegram-outbox-worker-v1'
  order by j.jobid desc
  limit 1;

  if v_job_id is not null then
    perform cron.unschedule(v_job_id);
  end if;

  perform cron.schedule(
    'dc-telegram-outbox-worker-v1',
    '* * * * *',
    'select public.dc_telegram_worker_scheduler_tick_v1();'
  );
end
$block$;

commit;
