import fs from 'node:fs';

const failures=[];
const expect=(ok,message)=>{if(!ok)failures.push(message)};
const read=path=>fs.readFileSync(path,'utf8');

const workspace=read('workspace/board/index.html');
const worker=read('supabase/functions/telegram-outbox-worker/index.ts');
const scheduler=read('supabase/migrations/20260912170000_board_telegram_worker_scheduler_v1.sql');

expect(!workspace.includes('telegram-worker-trigger-'),'Workspace Board still owns worker invocation');
for(const version of ['v1','v2','v3']){
  expect(!fs.existsSync(`community/board/telegram-worker-trigger-${version}.js`),`legacy worker trigger ${version} still shipped`);
}

expect(scheduler.includes("'dc-telegram-outbox-worker-v1'"),'single canonical Telegram worker cron job missing');
expect(scheduler.includes('dc_telegram_worker_scheduler_tick_v1'),'scheduler tick owner missing');
expect(scheduler.includes('dc_validate_telegram_worker_scheduler_token_v1'),'scheduler token validation owner missing');
expect(scheduler.includes('vault.create_secret'),'scheduler token is not Vault-backed');
expect(scheduler.includes('extensions.gen_random_bytes(32)'),'scheduler secret is not generated server-side');
expect(!scheduler.includes('SUPABASE_SERVICE_ROLE_KEY'),'migration must not embed service role credential');
expect(!scheduler.includes('TELEGRAM_BOT_TOKEN'),'migration must not embed Telegram credential');

expect(worker.includes('TRUSTED_WORKER_INVOCATION_REQUIRED'),'worker has no explicit trusted-invocation failure state');
expect(worker.includes('x-dc-worker-token'),'worker lacks DB scheduler credential path');
expect(worker.includes('dc_validate_telegram_worker_scheduler_token_v1'),'worker bypasses scheduler token validator');
expect(worker.includes('auth === `Bearer ${serviceRoleKey}`'),'controlled service-role invocation path missing');
expect(!worker.includes('auth: "user"'),'worker must not treat user auth as processing authority');

if(failures.length){
  console.error('BOARD G8 CLEANUP CONTRACT BLOCKED');
  for(const failure of failures)console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Board G8 cleanup contract PASS: trusted scheduler is canonical and browser worker triggers are retired');
