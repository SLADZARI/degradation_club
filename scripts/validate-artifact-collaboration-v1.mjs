import fs from 'node:fs';

const failures = [];
const expect = (ok, message) => { if (!ok) failures.push(message); };
const read = (path) => fs.readFileSync(path, 'utf8');

const migration = read('supabase/migrations/20260924002500_artifact_collaboration_v1.sql');
const workflow = read('.github/workflows/site-integrity.yml');
const publicActivity = read('supabase/migrations/20260921134959_public_activity_truth_boundary_v1.sql');
const telegramWorker = read('supabase/functions/telegram-outbox-worker/index.ts');
const shareOwner = read('community/board/board-deeplink-auth-return-v1.js');

function extractFunction(name) {
  let marker = 'create or replace function public.' + name + '(';
  let start = migration.indexOf(marker);
  if (start < 0) {
    marker = 'create function public.' + name + '(';
    start = migration.indexOf(marker);
  }
  if (start < 0) return '';
  const end = migration.indexOf('$function$;', start);
  return end < 0 ? '' : migration.slice(start, end + '$function$;'.length);
}

const participationStart = migration.indexOf('create table public.dc_artifact_participation_events');
const participationEnd = participationStart < 0 ? -1 : migration.indexOf('\n);', participationStart);
const participationTable = participationStart < 0 || participationEnd < 0
  ? ''
  : migration.slice(participationStart, participationEnd + 3);

const inviteCandidates = extractFunction('dc_artifact_invite_candidates_v1');
const appendParticipation = extractFunction('dc_append_artifact_participation_event_v1');
const canReadArtifact = extractFunction('dc_can_read_artifact_v1');
const canInteractArtifact = extractFunction('dc_can_interact_artifact_v1');
const mediaObjectRead = extractFunction('dc_can_read_artifact_media_object_v1');
const publishArtifact = extractFunction('dc_publish_artifact_v1');
const adminGrant = extractFunction('dc_admin_grant_artifact_slots_v1');
const relationRead = extractFunction('dc_board_relations_read_v1');
const relationCreate = extractFunction('dc_board_relation_create_v1');
const relationDelete = extractFunction('dc_board_relation_delete_v1');
const claimPending = extractFunction('dc_distribution_claim_pending_v1');

// One new persistence owner only.
expect(Boolean(participationTable), 'participation event ledger missing');
for (const state of ['INVITED','JOINED','DECLINED','LEFT','REMOVED']) {
  expect(participationTable.includes("'" + state + "'"), 'participation state missing: ' + state);
}
expect(participationTable.includes('transition_no integer'), 'participation transition sequence missing');
expect(participationTable.includes('actor_profile_id uuid'), 'participation actor audit missing');
expect(migration.includes('alter table public.dc_artifact_participation_events enable row level security'), 'participation RLS missing');
expect(migration.includes('revoke all on table public.dc_artifact_participation_events from public, anon, authenticated'), 'participation direct browser access not revoked');
expect(!migration.includes('create table public.dc_artifact_participants'), 'parallel participant current-state table detected');
expect(!/create table public\.[^;\n]*(slot|capacity|reward)/i.test(migration), 'parallel slot/capacity/reward table detected');

// Exact visibility semantics.
expect(migration.includes("visibility in ('community','circle')"), 'COMMUNITY/CIRCLE visibility allow-list missing');
expect(migration.includes("visibility <> 'circle' or artifact_type = 'idea'"), 'CIRCLE=Idea DB invariant missing');
expect(migration.includes('dc_set_artifact_visibility_v1'), 'draft visibility RPC missing');
expect(migration.includes('create trigger dc_artifact_board_position_on_publish_v1'), 'canonical Board position trigger replacement missing');
expect(migration.includes("new.visibility in ('community','circle')"), 'Board position trigger does not admit CIRCLE');

// Invite target is existing profile, bounded and email-free.
expect(Boolean(inviteCandidates), 'safe invite candidate RPC missing');
expect(inviteCandidates.includes('public.profiles'), 'invite lookup does not compose canonical profiles owner');
expect(inviteCandidates.includes('char_length(v_query) < 2'), 'invite lookup minimum query bound missing');
expect(inviteCandidates.includes('least(coalesce(p_limit,12),20)'), 'invite lookup result cap missing');
expect(!/\bemail\b/i.test(inviteCandidates), 'invite lookup exposes or references email');
expect(!inviteCandidates.includes('full_name'), 'invite lookup exposes non-safe full_name field');
expect(!extractFunction('dc_artifact_participants_read_v1').includes('full_name'), 'participant roster exposes non-safe full_name field');
expect(appendParticipation.includes('public.profiles'), 'participation mutation does not verify registered profile existence');
expect(appendParticipation.includes('ARTIFACT_AUTHOR_IS_NOT_PARTICIPANT'), 'author/participant distinction missing');
expect(!appendParticipation.includes('ARTIFACT_IDEA_NOT_AVAILABLE'), 'participant mutation exposes a distinct hidden Artifact existence error');
expect(!appendParticipation.includes('PARTICIPATION_AUTHOR_OR_OWNER_ADMIN_REQUIRED'), 'participant mutation exposes author/admin denial as an Artifact oracle');
expect(appendParticipation.includes("raise exception 'ARTIFACT_NOT_AVAILABLE'"), 'participant mutation generic no-oracle terminal state missing');
const profileCheckPos = appendParticipation.indexOf('PARTICIPANT_PROFILE_NOT_FOUND');
const artifactAuthPos = appendParticipation.indexOf("raise exception 'ARTIFACT_NOT_AVAILABLE'");
expect(profileCheckPos > artifactAuthPos && artifactAuthPos >= 0, 'profile existence is checked before Artifact authorization and can become an oracle');
expect(!inviteCandidates.includes('PARTICIPATION_AUTHOR_OR_OWNER_ADMIN_REQUIRED'), 'invite lookup exposes unauthorized hidden Artifact existence');
expect(inviteCandidates.includes("raise exception 'ARTIFACT_NOT_AVAILABLE'"), 'invite lookup generic no-oracle terminal state missing');

// Transition contract and re-invite.
for (const fragment of [
  "v_state = 'INVITED'",
  "v_state in ('JOINED','DECLINED')",
  "v_state = 'LEFT'",
  "v_state = 'REMOVED'",
  "v_current_state in ('INVITED','JOINED')",
  "v_current_state is distinct from 'INVITED'",
  "v_current_state is distinct from 'JOINED'",
  'coalesce(v_current_no,0) + 1'
]) {
  expect(appendParticipation.includes(fragment), 'participation transition guard missing: ' + fragment);
}
expect(!migration.includes('PARTICIPATES_IN'), 'generic participation relation leaked into Board relations');

// CIRCLE read and interaction distinction.
expect(Boolean(canReadArtifact), 'canonical Artifact read helper missing');
expect(canReadArtifact.includes("a.visibility = 'community'"), 'COMMUNITY read path missing');
expect(canReadArtifact.includes("a.visibility = 'circle'"), 'CIRCLE read path missing');
expect(canReadArtifact.includes("in ('INVITED','JOINED')"), 'CIRCLE read is not limited to INVITED/JOINED');
expect(Boolean(canInteractArtifact), 'Artifact interaction helper missing');
expect(canInteractArtifact.includes("= 'JOINED'"), 'CIRCLE interaction does not require JOINED');
expect(!canInteractArtifact.includes("in ('INVITED','JOINED')"), 'INVITED incorrectly receives interaction permission');

// Media / Storage must follow Artifact ACL.
expect(Boolean(mediaObjectRead), 'Storage Artifact ACL helper missing');
expect(mediaObjectRead.includes('public.dc_can_read_artifact_v1'), 'Storage helper does not compose Artifact ACL');
expect(migration.includes('dc_community_artifacts_storage_select_authorized_v1'), 'Artifact-aware Storage SELECT policy missing');
expect(migration.includes('drop policy if exists dc_community_artifacts_storage_select_members'), 'broad Member Storage SELECT policy not retired');

// Reactions/responses must not make INVITED equivalent to JOINED.
expect(migration.includes('dc_artifact_reactions_insert_own'), 'Member reaction policy missing');
expect(migration.includes('dc_artifact_responses_insert_own'), 'Member response policy missing');
expect(migration.includes('dc_artifact_responses_insert_guest'), 'Guest response policy missing');
expect(migration.includes('dc_artifact_responses_select_parties'), 'response read policy missing');
expect(migration.includes('public.dc_can_interact_artifact_v1(artifact_id)'), 'writes not bound to JOINED interaction ACL');
expect(migration.includes('public.dc_can_read_artifact_v1(artifact_id)'), 'response/reaction read not bound to Artifact ACL');
expect(extractFunction('dc_guest_board_interest_toggle_v1').includes('dc_can_interact_artifact_v1'), 'Guest interest write not bound to JOINED interaction ACL');

// Capacity: reuse exact owner, no Dementor bypass, visibility-neutral consumption.
expect(Boolean(adminGrant), 'Owner Admin slot grant RPC missing');
expect(adminGrant.includes('public.dc_artifact_slot_grants'), 'slot grant RPC does not compose canonical grant table');
expect(adminGrant.includes('public.dc_is_owner_admin'), 'slot grant RPC lacks Owner Admin guard');
expect(!adminGrant.includes('dc_has_role'), 'Dementor role leaked into slot grant authority');
expect(migration.includes('granted_by_profile_id'), 'durable slot grant actor provenance missing');
expect(Boolean(publishArtifact), 'publish RPC replacement missing');
expect(publishArtifact.includes("a.status in ('publishing','active')"), 'slot consumption statuses drifted');
const consumeStart = publishArtifact.indexOf('select count(*)::integer into v_consuming');
const consumeEnd = publishArtifact.indexOf("if v_granted-v_consuming <= 0", consumeStart);
const consumeBlock = consumeStart < 0 || consumeEnd < 0 ? '' : publishArtifact.slice(consumeStart, consumeEnd);
expect(!consumeBlock.includes('visibility'), 'slot consumption incorrectly differs by visibility');
expect(!publishArtifact.includes("dc_has_role('dementor'"), 'Dementor bypass detected in publish capacity');
expect(publishArtifact.includes("if v_artifact.visibility = 'community' then"), 'Telegram enqueue is not COMMUNITY-gated');

// Telegram must fail closed for CIRCLE.
expect(Boolean(claimPending), 'distribution pending claim hardening missing');
expect(claimPending.includes("a.visibility='community'"), 'pending claim can process non-COMMUNITY Artifact');
expect(claimPending.includes("set status='suppressed'"), 'ineligible pending outbox is not suppressed');
expect(telegramWorker.includes('artifact.visibility !== "community"'), 'Telegram worker lacks independent COMMUNITY check');

// Public Activity stays fail-closed.
expect(publicActivity.includes('NO_RELEASED_GENERIC_EDITORIAL_ELIGIBILITY_OWNER'), 'public Activity fail-closed marker missing');
expect(publicActivity.includes('where false;'), 'public Activity is not fail-closed');
expect(!migration.includes('create or replace function public.dc_public_activity_read_v1'), 'Artifact Collaboration migration reopens public Activity');

// Relations: read both endpoints; participant write only RELATED_TO; participant delete own edge only.
expect(Boolean(relationRead) && Boolean(relationCreate) && Boolean(relationDelete), 'relation RPC replacement incomplete');
expect(relationRead.includes('dc_can_read_board_endpoint_v1(r.origin_kind,r.origin_source_id)'), 'relation read lacks origin ACL');
expect(relationRead.includes('dc_can_read_board_endpoint_v1(r.target_kind,r.target_source_id)'), 'relation read lacks target ACL');
expect(relationCreate.includes("if v_relation_type='RELATED_TO' then"), 'RELATED_TO branch missing');
expect(relationCreate.includes('v_participant_related'), 'participant RELATED_TO permission path missing');
expect(relationCreate.includes('elsif not v_can_manage_origin then'), 'directional relation authorization drifted');
expect(relationDelete.includes('v_relation.created_by=v_uid'), 'participant relation delete is not creator-scoped');
expect(relationDelete.includes('v_participant_delete'), 'participant relation delete path missing');
expect(!relationDelete.includes("raise exception 'RELATION_NOT_FOUND'"), 'relation delete leaks hidden relation existence');
expect(relationDelete.includes("raise exception 'RELATION_NOT_AVAILABLE'"), 'relation delete generic no-oracle state missing');
expect(!/origin_kind\s*=\s*'person'|target_kind\s*=\s*'person'/i.test(migration), 'Person relation endpoint detected');

// Share remains transport-only; no invite/participant mutation in canonical share owner.
expect(shareOwner.includes('/share/artifact/'), 'canonical Artifact share transport missing');
expect(!/participant|participation|invite/i.test(shareOwner), 'Share/Auth return became a participation owner');

// Site Integrity must run this validator.
expect(workflow.includes('node scripts/validate-artifact-collaboration-v1.mjs'), 'Site Integrity does not run Artifact Collaboration validator');

// Migration hygiene.
expect(migration.startsWith('-- Artifact Collaboration v1'), 'migration header missing');
expect(migration.includes('\nbegin;') && /\ncommit;\s*$/.test(migration), 'migration transaction wrapper missing');
expect(!/supabase db push|service_role_key/i.test(migration), 'deployment/runtime secret command leaked into migration');

if (failures.length) {
  console.error('Artifact Collaboration v1 backend contract FAILED');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('Artifact Collaboration v1 backend contract PASS');
console.log('CIRCLE ACL / Storage / Telegram fail-closed checks PASS');
console.log('Participation transition + safe invite checks PASS');
console.log('Participant RELATED_TO permission boundary checks PASS');
console.log('Canonical slot owner reuse checks PASS');
