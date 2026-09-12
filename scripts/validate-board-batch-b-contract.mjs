import fs from 'node:fs';

const failures=[];
const expect=(ok,message)=>{if(!ok)failures.push(message)};
const read=path=>fs.readFileSync(path,'utf8');

const migration=read('supabase/migrations/20260912143000_board_information_architecture_batch_b_subtypes.sql');
const model=read('community/board/board-entity-model-v1.js');
const integrations=read('community/board/board-integrations-v1.js');
const board=read('community/board/board.js');
const guest=read('community/board/board-entry-v2.js');

const canonicalTypes=['announcement','post','idea','request'];

// Existing Artifact owner is extended in place; no new publication table is allowed.
expect(migration.includes("update public.dc_artifacts\n   set artifact_type = 'announcement'"),'legacy notice rows are not migrated in place to announcement');
expect(!/create table\s+[^;]*(artifact|publication|post|announcement)/i.test(migration),'Batch B creates a parallel publication table');
for(const type of canonicalTypes)expect(migration.includes(`'${type}'::text`)||migration.includes(`'${type}'`),`canonical Artifact subtype missing from migration: ${type}`);
expect(/add constraint dc_artifacts_type_check[\s\S]*announcement[\s\S]*post[\s\S]*idea[\s\S]*request/m.test(migration),'canonical Artifact subtype check constraint missing');
expect(!/add constraint dc_artifacts_type_check[\s\S]*'notice'::text/m.test(migration),'legacy notice remains allowed by the final Artifact type constraint');

// Existing create/publish ownership and slot semantics remain canonical.
expect(migration.includes('create or replace function public.dc_create_artifact_draft_v1'),'existing create draft owner is not extended in place');
expect(/insert into public\.dc_artifacts[\s\S]*values \(v_uid,'announcement'/m.test(migration),'new draft default subtype is not announcement');
expect(migration.includes('dc_set_artifact_subtype_v1'),'draft-only subtype command missing');
expect(/dc_set_artifact_subtype_v1[\s\S]*status = 'draft'/m.test(migration),'subtype command is not limited to drafts');
expect(!migration.includes('create or replace function public.dc_publish_artifact_v1'),'Batch B unexpectedly rewrites publish/slot ownership');

// Canonical composer must expose and persist exactly the approved subtype vocabulary.
expect(board.includes('ARTIFACT_SUBTYPES'),'canonical composer does not import the subtype vocabulary');
expect(board.includes('name="artifact_type"'),'canonical composer has no subtype selector');
expect(board.includes("dc_set_artifact_subtype_v1"),'canonical composer does not persist selected subtype');
expect(board.includes("select('id,artifact_type,title"),'own draft read omits Artifact subtype');
expect(board.includes('author_profile_id,artifact_type,title'),'Board card read omits Artifact subtype');
expect(board.includes('artifactSubtypeLabel(subtype)'),'Member Board cards do not expose subtype meaning');
expect(guest.includes('artifactSubtypeLabel(subtype)'),'Guest Board cards do not expose subtype meaning');

// Filter taxonomy must match the approved v1 object categories and keep ВСЁ as the only source-level control.
expect(/BOARD_FILTERS=\[\s*\[\s*'all'\s*,\s*'ВСЁ'\s*\]\s*\]/m.test(model),'ВСЁ is not the sole canonical source-level filter');
const requiredFilterIds=['artifact','event','program','practice','project','content'];
for(const id of requiredFilterIds)expect(model.includes(`['${id}'`),`canonical Board object filter missing: ${id}`);
expect(!model.includes("['forming'"),'ambiguous ФОРМИРУЕТСЯ global filter remains');
expect(!model.includes("['member','ОТ ЛЮДЕЙ']")&&!model.includes("['platform','ОТ КЛУБА']"),'legacy source filter controls remain canonical');
expect(integrations.includes("activeFilter='artifact';applyFilter();closeDrawer()"),'own-card locator does not bridge to the Artifact/publications filter');
expect(integrations.includes('ТИП ОБЪЕКТА'),'object-type filter drawer is not the canonical visible dimension');

// No lifecycle filter or Content CMS is introduced by Batch B.
expect(!/data-board-detail-filter=.*(expired|archived|active)/i.test(integrations),'Batch B introduces a lifecycle filter');
expect(!/create table\s+[^;]*(content|article)/i.test(migration),'Batch B invents a Content CMS');

if(failures.length){
  console.error('Board Information Architecture Batch B contract FAILED');
  for(const failure of failures)console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Board Information Architecture Batch B contract PASS');
