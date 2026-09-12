import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const fail=[];
const read=rel=>{const p=path.join(root,rel);if(!fs.existsSync(p)){fail.push(`missing ${rel}`);return''}return fs.readFileSync(p,'utf8')};
const expect=(ok,msg)=>{if(!ok)fail.push(msg)};

const entry=read('community/board/board-entry-v2.js');
const board=read('community/board/board.js');
const guestActions=read('community/board/board-guest-actions-v1.js');
const migration=read('supabase/migrations/20260906183000_guest_board_interest_v1.sql');
const responsePolicy=read('supabase/migrations/20260907210040_guest_board_responses_v1.sql');
const responseRpc=read('supabase/migrations/20260907210333_guest_board_response_rpc_v1.sql');
const accessV2=read('supabase/migrations/20260907215547_board_access_owner_admin_v2.sql');
const ownerStorage=read('supabase/migrations/20260907215922_board_owner_admin_storage_v2.sql');
const entityModel=read('community/board/board-entity-model-v1.js');
const integrations=read('community/board/board-integrations-v1.js');
const spatial=read('community/board/board-spatial-v1.js');
const fullscreen=read('community/board/board-fullscreen-v2-1.js');
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
expect(migration.includes("a.visibility = 'community'")&&migration.includes("a.status = 'active'"),'R9: baseline Guest-interest target is not restricted to live community Artifacts');
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

// R12: FIRST_ARTIFACT_REQUIRED is focus-only. Membership cannot remove Guest interaction rights.
expect(activation.includes("activationState==='FIRST_ARTIFACT_REQUIRED'"),'R12: first Artifact focus state disappeared');
expect(activation.includes("FOCUS_DISMISSED_KEY='dc_first_artifact_spotlight_dismissed_v1'"),'R12: session-local first-entry key missing');
expect(activation.includes("document.querySelector('.dc-spatial-viewport')||entryHost"),'R12: first-entry skip does not prefer visible spatial viewport');
expect(activation.includes("skip.style.zIndex='32'"),'R12: first-entry skip stacking correction missing');
expect(!activation.includes('dataset.activationLocked='),'R12: first Artifact still writes an interaction lock');
expect(activation.includes('delete button.dataset.activationLocked'),'R12: legacy interaction lock is not actively cleaned from reused DOM');
expect(!activation.includes("setAttribute('aria-disabled','true')"),'R12: first Artifact still sets reaction/response aria-disabled');
expect(!activation.includes('event.stopImmediatePropagation()'),'R12: activation layer still intercepts reaction/response clicks');
expect(!activation.includes('Сначала займите своё место'),'R12: legacy interaction-lock copy remains');

// R13: Owner Admin extends canonical Board owners rather than creating parallel state/layout/composer systems.
expect(accessV2.includes('or (select public.dc_is_owner_admin())'),'R13: Owner Admin is missing from canonical RLS paths');
expect(accessV2.includes('not (select public.dc_is_owner_admin())'),'R13: Guest response path does not exclude Owner Admin');
expect(accessV2.includes("raise exception 'MEMBER_USE_CANONICAL_REACTION'"),'R13: Owner Admin can still fall into Guest-interest path');
expect(accessV2.includes("raise exception 'MEMBER_USE_CANONICAL_RESPONSE'"),'R13: Owner Admin can still fall into Guest-response path');
expect(accessV2.includes('if not v_owner then')&&accessV2.includes('NO_ARTIFACT_SLOT_AVAILABLE'),'R13: Owner Admin publish does not explicitly bypass slot accounting');
expect(accessV2.includes("v_owner and a.visibility='community'")&&accessV2.includes("a.status in ('active','expired','archived')"),'R13: Owner Admin close authority is not bounded to Community Board Artifacts');
expect(!accessV2.includes('create table'),'R13: access patch created a parallel Board table');
expect(ownerStorage.includes("bucket_id = 'dc-community-artifacts'")&&ownerStorage.includes('(select public.dc_is_owner_admin())'),'R13: Owner Admin storage read/upload does not reuse canonical private Artifact bucket');
expect(ownerStorage.includes('(storage.foldername(name))[1] = (select auth.uid())::text'),'R13: Owner Admin storage upload is not confined to own auth.uid folder');
expect(!ownerStorage.includes('create bucket'),'R13: access patch created a parallel storage bucket');
expect(board.includes("function isOwnerAdmin(){return boardUserState()==='OWNER_ADMIN'}"),'R13: canonical Artifact controller does not resolve Owner Admin state');
expect(board.includes('data-admin-close-artifact'),'R13: Owner Admin moderation control missing');
expect(board.includes("!entryStatus.membership_active&&!isOwnerAdmin()"),'R13: Owner Admin without membership is still blocked from canonical Board controller');
expect(board.includes('OWNER ADMIN / READY'),'R13: Owner Admin does not reuse canonical composer');
expect(spatial.includes('is-admin-movable'),'R13: spatial owner does not mark Owner Admin movable Artifacts');
expect(spatial.includes(".dc-notice.is-own-movable,.dc-notice.is-admin-movable"),'R13: spatial drag owner does not include Owner Admin cards');
expect(spatial.includes("data-artifact-owned=\"1\""),'R13: МОЁ focus can collapse into arbitrary admin-movable card');
expect(spatial.includes('boardJustDragged'),'R13: drag completion does not suppress accidental fullscreen open');
expect(spatial.includes("window.addEventListener('dc:board-personal-state',scheduleSpatialRefresh)"),'R13: spatial owner is not synchronized to canonical resolved Board state');
expect(fullscreen.includes("if(isOwnerAdmin())")&&fullscreen.includes("host.dataset.access='owner-admin'"),'R13: fullscreen primary action does not expose Owner Admin composer');
expect(fullscreen.includes('interactiveTarget(event.target)'),'R13: fullscreen card-open handler still captures admin controls');

// R8/R5 safety: Board IA v1 supersedes the old required source-filter trio.
// ВСЁ remains the single required source view; object taxonomy is validated by Batch B.
expect(entityModel.includes("['all','ВСЁ']"),'R8: canonical ВСЁ source view missing');
expect(!entityModel.includes("['member','ОТ ЛЮДЕЙ']")&&!entityModel.includes("['platform','ОТ КЛУБА']"),'R8: superseded source-filter controls still present');
expect(integrations.includes('card.hidden=hidden'),'R8: filtered cards are not truly hidden');
expect(integrations.includes("dc:board-layout-request"),'R8: filter/projection layout event missing');
expect(spatial.includes('fitActiveContent'),'R5: fitActiveContent missing');
expect(spatial.includes('data-mine'),'R5: МОЁ camera control missing');

if(fail.length){console.error('BOARD V2 CONTRACT BLOCKED');for(const e of fail)console.error(`- ${e}`);process.exit(1)}
console.log('Board v2 contract PASS: Guest boundaries + monotonic first-Artifact interactions + Owner Admin canonical moderation/layout/storage + Board IA v1 filter compatibility + R5 safety');
