import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const fail=[];
const read=rel=>{const p=path.join(root,rel);if(!fs.existsSync(p)){fail.push(`missing ${rel}`);return''}return fs.readFileSync(p,'utf8')};
const expect=(ok,msg)=>{if(!ok)fail.push(msg)};

const entry=read('community/board/board-entry-v2.js');
const guestActions=read('community/board/board-guest-actions-v1.js');
const migration=read('supabase/migrations/20260906183000_guest_board_interest_v1.sql');
const responsePolicy=read('supabase/migrations/20260907210040_guest_board_responses_v1.sql');
const responseRpc=read('supabase/migrations/20260907210333_guest_board_response_rpc_v1.sql');
const entityModel=read('community/board/board-entity-model-v1.js');
const integrations=read('community/board/board-integrations-v1.js');
const spatial=read('community/board/board-spatial-v1.js');
const activation=read('community/board/board-activation-gate-v1.js');

// R9: Guest gets narrow pre-membership interactions, never Member write authority.
expect(entry.includes("client.rpc('dc_guest_board_interest_toggle_v1'"),'R9: Guest interest UI does not use the narrow RPC');
expect(entry.includes('data-guest-interest'),'R9: Guest interest control missing');
expect(entry.includes('GUEST / LIGHT INTERACTION'),'R9: Guest interaction boundary not visible in UI');
expect(!entry.includes("from('dc_artifact_reactions')"),'R9: Guest entry must not write/read canonical reaction table directly');
expect(!entry.includes("from('dc_guest_board_interests')"),'R9: Guest entry must not access Guest-interest table directly');

expect(migration.includes('create table if not exists public.dc_guest_board_interests'),'R9: Guest-interest table migration missing');
expect(migration.includes('alter table public.dc_guest_board_interests enable row level security'),'R9: Guest-interest table RLS missing');
expect(migration.includes('revoke all on table public.dc_guest_board_interests from anon, authenticated'),'R9: direct table privileges are not closed');
expect(migration.includes('security definer'),'R9: narrow Guest-interest function is not SECURITY DEFINER');
expect(migration.includes('if public.dc_membership_active() then'),'R9: active Member is not rejected from Guest-interest RPC');
expect(migration.includes("raise exception 'MEMBER_USE_CANONICAL_REACTION'"),'R9: Member canonical-reaction boundary missing');
expect(migration.includes("a.visibility = 'community'")&&migration.includes("a.status = 'active'"),'R9: Guest-interest target is not restricted to live community Artifacts');
expect(migration.includes('revoke all on function public.dc_guest_board_interest_toggle_v1(uuid) from public, anon'),'R9: anon/public function execution not revoked');
expect(migration.includes('grant execute on function public.dc_guest_board_interest_toggle_v1(uuid) to authenticated'),'R9: authenticated execution grant missing');
expect(migration.includes('guest_interest_count bigint')&&migration.includes('my_guest_interest boolean'),'R9: Guest read projection is not extended with safe interest state');

// R11: Authenticated Guest may respond to a live community Artifact but cannot create/move it.
for(const state of ['AUTHENTICATED_GUEST_DC9_INCOMPLETE','AUTHENTICATED_GUEST_DC9_COMPLETE','APPLICANT'])expect(guestActions.includes(state),`R11: Guest response module missing state ${state}`);
expect(guestActions.includes('data-guest-response'),'R11: Guest response control missing');
expect(guestActions.includes("client.rpc('dc_guest_board_response_submit_v1'"),'R11: Guest response does not use guarded RPC');
expect(guestActions.includes("client.rpc('dc_guest_board_interest_toggle_v1'"),'R11: Guest reaction must remain usable beside fullscreen card-open handling');
expect(responsePolicy.includes('create policy dc_artifact_responses_insert_guest'),'R11: Guest response RLS policy missing');
expect(responsePolicy.includes('(select auth.uid()) = responder_profile_id'),'R11: Guest response ownership check missing');
expect(responsePolicy.includes('not (select public.dc_membership_active())'),'R11: Guest response policy is not limited to pre-membership state');
expect(responsePolicy.includes("a.visibility = 'community'")&&responsePolicy.includes("a.status = 'active'")&&responsePolicy.includes('a.published_at is not null'),'R11: Guest response target is not restricted to live community Artifacts');
expect(responseRpc.includes('security invoker'),'R11: Guest response RPC must preserve RLS via SECURITY INVOKER');
expect(responseRpc.includes("raise exception 'MEMBER_USE_CANONICAL_RESPONSE'"),'R11: Member canonical-response boundary missing');
expect(responseRpc.includes('auth.uid()'),'R11: Guest response RPC does not bind responder to authenticated user');
expect(responseRpc.includes('revoke all on function public.dc_guest_board_response_submit_v1(uuid,text) from public, anon'),'R11: Guest response RPC exposed to public/anon');
expect(responseRpc.includes('grant execute on function public.dc_guest_board_response_submit_v1(uuid,text) to authenticated'),'R11: Guest response RPC authenticated grant missing');

// R8/R5 safety: true filtering + camera/layout contracts remain intact.
for(const label of ['ВСЁ','ОТ ЛЮДЕЙ','ОТ КЛУБА'])expect(entityModel.includes(label),`R8: primary filter missing ${label}`);
expect(integrations.includes('card.hidden=hidden'),'R8: filtered cards are not truly hidden');
expect(integrations.includes("dc:board-layout-request"),'R8: filter/projection layout event missing');
expect(spatial.includes('fitActiveContent'),'R5: fitActiveContent missing');
expect(spatial.includes('data-mine'),'R5: МОЁ camera control missing');

// Compatibility correction: first-entry skip remains on visible spatial Board and keeps session-local key.
expect(activation.includes("FOCUS_DISMISSED_KEY='dc_first_artifact_spotlight_dismissed_v1'"),'R10 preflight: session-local first-entry key missing');
expect(activation.includes("document.querySelector('.dc-spatial-viewport')||entryHost"),'R10 preflight: first-entry skip does not prefer visible spatial viewport');
expect(activation.includes("skip.style.zIndex='32'"),'R10 preflight: first-entry skip stacking correction missing');

if(fail.length){console.error('BOARD V2 CONTRACT BLOCKED');for(const e of fail)console.error(`- ${e}`);process.exit(1)}
console.log('Board v2 contract PASS: Guest reaction/response boundaries + R8 filters/layout + R5 camera + first-entry compatibility');
