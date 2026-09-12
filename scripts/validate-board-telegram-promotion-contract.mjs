import fs from 'node:fs';

const fail=[];
const expect=(ok,msg)=>{if(!ok)fail.push(msg)};
const read=p=>fs.readFileSync(p,'utf8');

const decision=read('operations/BOARD_TELEGRAM_PROMOTION_V1.md');
const migration=read('supabase/migrations/20260912153000_board_telegram_promotion_v1.sql');
const hardening=read('supabase/migrations/20260912153500_board_telegram_promotion_v1_worker_hardening.sql');
const board=read('community/board/board.js');
const entry=read('community/board/board-entry-v2.js');
const detail=read('community/artifact/artifact.js');
const worker=read('supabase/functions/telegram-outbox-worker/index.ts');

// Approved authority and one-owner invariant.
expect(decision.includes('status: APPROVED'),'decision is not APPROVED');
expect(decision.includes('dc_artifacts.activity_at'),'activity_at authority missing');
expect(decision.includes('dc_artifact_promotion_support'),'support-ledger authority missing');
expect(decision.includes('dc_distribution_outbox'),'canonical outbox authority missing');
expect(decision.includes('delivery_unknown'),'canonical ambiguous-delivery state missing');

// Activity datetime must not reuse starts_at.
expect(migration.includes('add column if not exists activity_at timestamptz'),'activity_at schema extension missing');
expect(migration.includes('dc_set_artifact_activity_v1'),'narrow activity command missing');
expect(board.includes('name="activity_at"'),'composer КОГДА field missing');
expect(board.includes("client.rpc('dc_set_artifact_activity_v1'"),'composer does not persist activity_at through canonical RPC');
expect(board.includes('activity_at'),'Board card activity_at presentation missing');
expect(detail.includes('activity_at'),'Artifact detail activity_at presentation missing');
expect(!board.includes("p_starts_at:activityAt"),'activity datetime incorrectly reuses starts_at');

// Canonical prospective outbox gate.
for(const state of ['held','pending','processing','sent','failed','suppressed','delivery_unknown','cancelled'])expect(migration.includes(`'${state}'::text`),`outbox state ${state} missing`);
expect(migration.includes("alter column status set default 'held'"),'outbox prospective default is not held');
expect(migration.includes("insert into public.dc_distribution_outbox(artifact_id,channel,status,payload,available_at)"),'publish path does not ensure canonical outbox row');
expect(migration.includes("'held',")&&migration.includes("on conflict (artifact_id,channel) do nothing"),'publish outbox ensure is not idempotent held creation');
expect(!board.includes("dc_enqueue_artifact_distribution_v1"),'frontend still owns enqueue follow-up');
expect(migration.includes("raise exception 'PROMOTION_GATE_REQUIRED'"),'legacy enqueue backend bypass is not hard-denied');
expect(migration.includes('revoke all on function public.dc_enqueue_artifact_distribution_v1(uuid,text) from public, anon, authenticated'),'legacy enqueue execute authority remains exposed');

// Promotion support semantics / authority.
expect(migration.includes('create table if not exists public.dc_artifact_promotion_support'),'support ledger missing');
expect(migration.includes('primary key (artifact_id, profile_id)'),'support uniqueness missing');
expect(migration.includes('dc_artifact_promotion_threshold_v1'),'canonical threshold owner missing');
expect(migration.includes('select 2;'),'approved threshold 2 missing from backend owner');
expect(migration.includes('dc_support_artifact_promotion_v1'),'atomic support command missing');
expect(migration.includes("public.dc_is_owner_admin(v_uid)")&&migration.includes("OWNER_ADMIN_USE_OVERRIDE"),'Owner/Admin support rejection missing');
expect(migration.includes("public.dc_has_role('dementor',v_uid)"),'canonical Dementor authority check missing');
expect(migration.includes('SELF_SUPPORT_FORBIDDEN'),'self-support rejection missing');
expect(migration.includes('for update')&&migration.includes("where id=v_outbox.id and status='held'"),'support/release concurrency guard missing');
expect(migration.includes('on conflict (artifact_id,profile_id) do nothing'),'support idempotency missing');
expect(board.includes('promotion_threshold'),'frontend does not consume backend threshold');
expect(!board.includes('const promotionThreshold=2')&&!board.includes('PROMOTION_THRESHOLD=2'),'frontend independently hardcodes promotion threshold');

// Owner/Admin moderation paths.
for(const fn of ['dc_admin_promote_artifact_telegram_v1','dc_admin_suppress_artifact_telegram_v1','dc_admin_board_hide_artifact_v1','dc_admin_resolve_delivery_unknown_v1'])expect(migration.includes(fn),`${fn} missing`);
expect(migration.includes("v_resolution not in ('sent','retry','cancelled')"),'delivery_unknown manual resolution vocabulary missing');
expect(migration.includes('board_hidden_at'),'minimal Board-hide state missing');
expect(board.includes('СКРЫТЬ С ДОСКИ'),'Owner/Admin Board-hide UI missing');
expect(board.includes('ОПУБЛИКОВАТЬ В TELEGRAM'),'Owner/Admin manual promotion UI missing');
expect(board.includes('НЕ ПУБЛИКОВАТЬ В TELEGRAM'),'Owner/Admin suppression UI missing');
expect(board.includes('CONTROLLED RETRY'),'ambiguous-delivery controlled retry UI missing');

// Hidden artifacts must leave ordinary presentation while history is retained.
expect(migration.includes('a.board_hidden_at is null'),'backend ordinary Board-hide exclusion missing');
expect(board.includes(".is('board_hidden_at',null)"),'member Board ordinary-hide exclusion missing');
expect(migration.includes('dc_admin_board_hidden_read_v1'),'Owner/Admin moderation read for hidden Artifacts missing');

// Worker authority / claim / ambiguity safety.
expect(migration.includes('dc_distribution_claim_pending_v1'),'canonical worker claim RPC missing');
expect(migration.includes("where o.status='pending'")&&migration.includes('for update skip locked'),'pending-only atomic worker claim missing');
expect(migration.includes('grant execute on function public.dc_distribution_claim_pending_v1(integer) to service_role'),'worker claim is not service-role only');
expect(migration.includes('revoke all on function public.dc_distribution_claim_pending_v1(integer) from public, anon, authenticated'),'ordinary authenticated worker claim not revoked');
expect(worker.includes('SUPABASE_SERVICE_ROLE_KEY'),'worker does not enforce service-role invocation');
expect(worker.includes('SERVICE_ROLE_REQUIRED'),'trusted worker invocation guard missing');
expect(worker.includes('dc_distribution_claim_pending_v1'),'worker bypasses canonical pending claim RPC');
expect(worker.includes('dc_distribution_mark_unknown_v1'),'worker cannot persist delivery_unknown');
expect(worker.includes('AmbiguousDeliveryOutcome'),'worker does not distinguish ambiguous external outcome');
expect(!worker.includes('.in("status", ["pending", "failed"])'),'worker still directly consumes pending+failed');
expect(!worker.includes('withSupabase({ auth: "user" })'),'ordinary user-auth worker wrapper remains');
expect(hardening.includes("a.status='active'")&&hardening.includes('a.board_hidden_at is null'),'failed retry is not revalidated against current Artifact eligibility');

// UI must not infer sent from threshold alone.
expect(board.includes("if(status==='sent')return '✓ TELEGRAM'"),'Board sent label is not bound to canonical sent state');
expect(entry.includes("if(status==='sent')return '✓ TELEGRAM'"),'Guest sent label is not bound to canonical sent state');
expect(detail.includes("if(status==='sent')return '✓ TELEGRAM'"),'Detail sent label is not bound to canonical sent state');
expect(board.includes("status==='delivery_unknown'"),'Board delivery_unknown UI missing');
expect(entry.includes("status==='delivery_unknown'"),'Guest delivery_unknown UI missing');
expect(detail.includes("status==='delivery_unknown'"),'Detail delivery_unknown UI missing');

if(fail.length){console.error('BOARD TELEGRAM PROMOTION V1 CONTRACT BLOCKED');fail.forEach(x=>console.error('- '+x));process.exit(1)}
console.log('Board Telegram Promotion v1 contract PASS: canonical activity datetime + atomic support gate + existing outbox owner + trusted worker + delivery ambiguity safety + admin moderation');
