import fs from 'node:fs';

const failures=[];
const expect=(ok,message)=>{if(!ok)failures.push(message)};
const read=path=>fs.readFileSync(path,'utf8');

const migrationPath='supabase/migrations/20260912131000_board_information_architecture_batch_a.sql';
const hardeningPath='supabase/migrations/20260912141500_board_information_architecture_batch_a_security_hardening.sql';
const migration=read(migrationPath);
const hardening=read(hardeningPath);
const board=read('community/board/board.js');
const entry=read('community/board/board-entry-v2.js');
const detail=read('community/artifact/artifact.js');
const integrations=read('community/board/board-integrations-v1.js');

// Lifecycle normalization must preserve history instead of hiding stale active rows.
expect(migration.includes('dc_normalize_artifact_lifecycle_v1'),'Batch A migration missing lifecycle normalizer');
expect(/status\s*=\s*'expired'/m.test(migration),'Lifecycle normalizer does not write expired status');
expect(/status\s*=\s*'active'[\s\S]*expires_at\s*<=\s*now\(\)/m.test(migration),'Lifecycle normalizer does not target stale active rows');
expect(board.includes("dc_normalize_artifact_lifecycle_v1"),'Member Board does not invoke lifecycle normalizer');
expect(board.includes(".in('status',['active','expired','archived'])"),'Member Board does not load current + history');

// Guest/Applicant Board history must use the canonical Guest RPC and include explicit lifecycle.
expect(migration.includes('drop function if exists public.dc_guest_board_read_v1()'),'Guest Board RPC shape change is not protected by drop/recreate');
expect(/a\.status in \('active','expired','archived'\)/.test(migration),'Guest Board history RPC does not include all historical statuses');
expect(entry.includes("dc_guest_board_read_v1"),'Guest Board entry does not use canonical Guest Board read RPC');
expect(entry.includes('artifact.status')||entry.includes('artifact_status')||entry.includes('status'),'Guest Board render has no lifecycle status handling');

// Guest Board read must remain authenticated-only after drop/recreate.
expect(hardening.includes('revoke all on function public.dc_guest_board_read_v1() from public'),'Guest Board read hardening does not revoke PUBLIC execute');
expect(hardening.includes('grant execute on function public.dc_guest_board_read_v1() to authenticated'),'Guest Board read hardening does not restore authenticated execute');

// Historical interaction policy: reactions allowed, responses frozen.
expect(migration.includes('dc_guest_board_interest_toggle_v1'),'Guest reaction owner missing from Batch A migration');
expect(migration.includes("a.status in ('active','expired','archived')"),'Historical Guest reaction scope missing');
expect(/create policy dc_artifact_reactions_insert_own[\s\S]*a\.status in \('active','expired','archived'\)/m.test(migration),'Member historical reaction INSERT policy missing');
expect(board.includes("isHistoricalStatus")&&board.includes('ОТКЛИКИ ЗАКРЫТЫ'),'Member Board does not freeze historical responses in UI');
expect(detail.includes("isHistorical()")&&detail.includes('ОТКЛИКИ ЗАКРЫТЫ / HISTORY'),'Artifact detail does not freeze historical responses');

// Artifact body must preserve stored text safely while rendering the minimal supported emphasis syntax.
expect(detail.includes('function renderArtifactBody'),'Artifact detail missing safe body formatter');
expect(detail.includes("const safe=esc(String(value||''))"),'Artifact body formatter must escape stored content before adding markup');
expect(detail.includes('renderArtifactBody(artifact.body)'),'Artifact detail bypasses the safe body formatter');

// Guest detail must be Board-safe and must not disclose response bodies.
expect(migration.includes('dc_guest_board_artifact_detail_read_v1'),'Guest Board-safe Artifact detail RPC missing');
const detailFn=migration.match(/create or replace function public\.dc_guest_board_artifact_detail_read_v1[\s\S]*?grant execute on function public\.dc_guest_board_artifact_detail_read_v1\(uuid\) to authenticated;/m)?.[0]||'';
expect(detailFn.includes("a.status in ('active','expired','archived')"),'Guest detail RPC does not include history');
expect(!detailFn.includes("'message', rr.message")&&!detailFn.includes('rr.message'),'Guest detail RPC leaks response message bodies');
expect(detail.includes("dc_guest_board_artifact_detail_read_v1"),'Artifact detail frontend does not call Guest-safe detail RPC');

// Guest media access must be narrow and backed by the canonical Artifact/media relation.
expect(migration.includes('dc_can_read_guest_board_media_v1'),'Narrow Guest media helper missing');
expect(migration.includes("bucket_id = 'dc-community-artifacts'"),'Guest media Storage policy is not bucket-scoped');
expect(migration.includes('join public.dc_artifacts a on a.id = m.artifact_id'),'Guest media helper is not anchored to canonical Artifact ownership');

// Entity projections must remain projections, not a second entity owner.
expect(migration.includes('dc_board_entity_projection_read_v1'),'Board-safe entity projection RPC missing');
expect(/e\.entity_type in \('event','program','project'\)/.test(migration),'Entity projection RPC is not limited to approved existing entity families');
expect(integrations.includes("dc_board_entity_projection_read_v1"),'Board integration does not load canonical entity projections');
expect(integrations.includes('entityToBoardProjection'),'Board integration bypasses the canonical projection mapper');

// No relation model or new history owner is allowed in Batch A.
expect(!/create table\s+[^;]*(relation|history)/i.test(migration),'Batch A unexpectedly creates a relation/history table');
expect(!migration.includes('promoted_entity_id =')&&!migration.includes('promoted_entity_type ='),'Batch A repurposes promoted_entity_* as a relation owner');

if(failures.length){
  console.error('Board Information Architecture Batch A contract FAILED');
  for(const failure of failures)console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Board Information Architecture Batch A contract PASS');