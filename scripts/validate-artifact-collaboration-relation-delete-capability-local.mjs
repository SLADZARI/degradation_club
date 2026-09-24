#!/usr/bin/env node
import { execFileSync } from 'node:child_process';

const container = process.argv[2];
if (!container || !/^supabase_db_/.test(container)) {
  throw new Error('local Supabase DB container argument required');
}

const AUTHOR = '11111111-1111-4111-8111-111111111111';
const PARTICIPANT = '22222222-2222-4222-8222-222222222222';
const OUTSIDER = '33333333-3333-4333-8333-333333333333';
const PARTICIPANT2 = '44444444-4444-4444-8444-444444444444';
const ADMIN = 'e9b8ec1d-76be-4607-bb5b-63c48c1b80fa';

function psql(sql) {
  return execFileSync('docker', [
    'exec', '-i', container,
    'psql', '-U', 'postgres', '-d', 'postgres',
    '-v', 'ON_ERROR_STOP=1', '-Atq',
  ], {
    input: sql,
    encoding: 'utf8',
    stdio: ['pipe','pipe','pipe'],
  }).trim();
}

function psqlAs(userId, sql) {
  const claims = JSON.stringify({ sub: userId, role: 'authenticated' }).replaceAll("'", "''");
  return psql([
    'set role authenticated;',
    "set request.jwt.claim.sub = '" + userId + "';",
    "set request.jwt.claim.role = 'authenticated';",
    "set request.jwt.claims = '" + claims + "';",
    sql,
  ].join('\n'));
}

function expect(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(label + ': expected ' + expected + ', got ' + actual);
  }
}

function expectError(userId, sql, expected, label) {
  try {
    psqlAs(userId, sql);
  } catch (error) {
    const message = String(error.stderr || '') + '\n' + String(error.stdout || '') + '\n' + String(error.message || '');
    if (message.includes(expected)) return;
    throw new Error(label + ': expected ' + expected + ', got ' + message);
  }
  throw new Error(label + ': expected error ' + expected);
}

function relationId(userId, relationType, artifactId, targetProgram) {
  const value = psqlAs(userId,
    "select public.dc_board_relation_create_v1('" + relationType + "','artifact','" + artifactId + "','program','" + targetProgram + "');"
  ).split(/\r?\n/).filter(Boolean).at(-1);
  if (!/^[0-9a-f-]{36}$/i.test(value || '')) {
    throw new Error('relation create did not return uuid for ' + relationType + ' / ' + targetProgram + ': ' + value);
  }
  return value;
}

function canDelete(userId, relationIdValue) {
  return psqlAs(userId,
    "select can_delete::text from public.dc_board_relations_read_v1() where relation_id='" + relationIdValue + "'::uuid;"
  );
}

const result = {};

psql([
  'insert into auth.users(id,aud,role,email,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,is_sso_user,is_anonymous)',
  "values ('" + PARTICIPANT2 + "','authenticated','authenticated','runtime-participant-2@example.invalid','{}','{}',now(),now(),false,false)",
  'on conflict(id) do nothing;',
  '',
  'update public.profiles',
  "set display_name='Runtime Participant 2'",
  "where id='" + PARTICIPANT2 + "'::uuid;",
  '',
  'insert into public.dc_system_memberships(profile_id,status,source_system,source_ref,provenance_status,confirmed_at)',
  "values ('" + PARTICIPANT2 + "'::uuid,'active','local-g5','relation-delete-capability','confirmed',now())",
  "on conflict(profile_id) do update set status='active',valid_to=null,updated_at=now();",
].join('\n'));

expect(psql("select count(*)::text from public.profiles where id='" + PARTICIPANT2 + "'::uuid;"), '1',
  'second participant profile exists');

const circleIdea = psql(
  "select id::text from public.dc_artifacts where author_profile_id='" + AUTHOR + "'::uuid and title='Runtime Circle Idea' and visibility='circle' and status='archived' order by created_at desc limit 1;"
);
if (!/^[0-9a-f-]{36}$/i.test(circleIdea || '')) throw new Error('archived Circle runtime Idea not found');

const circleRelation = relationId(PARTICIPANT, 'RELATED_TO', circleIdea, 'dumai-s-opasnostyu');
expect(canDelete(PARTICIPANT, circleRelation), 'true', 'JOINED participant Circle relation can_delete');
expect(psqlAs(OUTSIDER,
  "select count(*)::text from public.dc_board_relations_read_v1() where relation_id='" + circleRelation + "'::uuid;"
), '0', 'inaccessible Circle relation omitted from canonical read projection');
expect(canDelete(ADMIN, circleRelation), 'true', 'Owner Admin Circle relation can_delete');
psqlAs(PARTICIPANT, "select public.dc_board_relation_delete_v1('" + circleRelation + "'::uuid);");
result.relation_read_can_delete_joined = 'PASS';
result.relation_read_inaccessible_filtered = 'PASS';
result.relation_read_owner_admin_true = 'PASS';

const communityIdea = psql(
  "select id::text from public.dc_artifacts where author_profile_id='" + AUTHOR + "'::uuid and title='Runtime Community Idea 2' and visibility='community' and status='active' order by created_at desc limit 1;"
);
if (!/^[0-9a-f-]{36}$/i.test(communityIdea || '')) throw new Error('active Community runtime Idea not found');

psqlAs(AUTHOR, "select public.dc_artifact_invite_v1('" + communityIdea + "'::uuid,'" + PARTICIPANT + "'::uuid);");
psqlAs(AUTHOR, "select public.dc_artifact_invite_v1('" + communityIdea + "'::uuid,'" + PARTICIPANT2 + "'::uuid);");
psqlAs(PARTICIPANT, "select public.dc_artifact_invitation_respond_v1('" + communityIdea + "'::uuid,'JOINED');");
psqlAs(PARTICIPANT2, "select public.dc_artifact_invitation_respond_v1('" + communityIdea + "'::uuid,'JOINED');");

const ownRelation = relationId(PARTICIPANT, 'RELATED_TO', communityIdea, 'dumai-s-opasnostyu');
const otherRelation = relationId(PARTICIPANT2, 'RELATED_TO', communityIdea, 'dengi-na-veter');
const directionalRelation = relationId(AUTHOR, 'ABOUT', communityIdea, 'ne-komanda');

expect(canDelete(PARTICIPANT, ownRelation), 'true', 'own RELATED_TO can_delete after canonical reload');
expect(canDelete(PARTICIPANT, otherRelation), 'false', 'another participant relation can_delete false');
expect(canDelete(PARTICIPANT, directionalRelation), 'false', 'participant directional relation can_delete false');
expect(canDelete(AUTHOR, directionalRelation), 'true', 'canonical manager delete authority preserved');
expect(canDelete(ADMIN, ownRelation), 'true', 'Owner Admin can_delete true');

expectError(PARTICIPANT,
  "select public.dc_board_relation_delete_v1('" + otherRelation + "'::uuid);",
  'RELATION_DELETE_FORBIDDEN',
  'participant cannot delete another participant relation');
expectError(PARTICIPANT,
  "select public.dc_board_relation_delete_v1('" + directionalRelation + "'::uuid);",
  'RELATION_DELETE_FORBIDDEN',
  'participant cannot delete directional relation');

result.relation_read_other_participant_false = 'PASS';
result.relation_read_directional_participant_false = 'PASS';
result.relation_manager_authority_preserved = 'PASS';

psqlAs(PARTICIPANT, "select public.dc_artifact_leave_v1('" + communityIdea + "'::uuid);");
expect(canDelete(PARTICIPANT, ownRelation), 'false', 'LEFT participant can_delete false');
expectError(PARTICIPANT,
  "select public.dc_board_relation_delete_v1('" + ownRelation + "'::uuid);",
  'RELATION_DELETE_FORBIDDEN',
  'LEFT participant cannot delete own prior relation');

psqlAs(AUTHOR, "select public.dc_artifact_invite_v1('" + communityIdea + "'::uuid,'" + PARTICIPANT + "'::uuid);");
psqlAs(PARTICIPANT, "select public.dc_artifact_invitation_respond_v1('" + communityIdea + "'::uuid,'JOINED');");
expect(canDelete(PARTICIPANT, ownRelation), 'true', 're-JOINED participant regains own delete capability');

psqlAs(AUTHOR, "select public.dc_artifact_remove_participant_v1('" + communityIdea + "'::uuid,'" + PARTICIPANT + "'::uuid);");
expect(canDelete(PARTICIPANT, ownRelation), 'false', 'REMOVED participant can_delete false');
expectError(PARTICIPANT,
  "select public.dc_board_relation_delete_v1('" + ownRelation + "'::uuid);",
  'RELATION_DELETE_FORBIDDEN',
  'REMOVED participant cannot delete own prior relation');

result.relation_read_left_false = 'PASS';
result.relation_read_removed_false = 'PASS';

psqlAs(PARTICIPANT2, "select public.dc_board_relation_delete_v1('" + otherRelation + "'::uuid);");
psqlAs(AUTHOR, "select public.dc_board_relation_delete_v1('" + directionalRelation + "'::uuid);");
psqlAs(ADMIN, "select public.dc_board_relation_delete_v1('" + ownRelation + "'::uuid);");

expect(psql(
  "select count(*)::text from public.dc_board_relations where id in ('" + ownRelation + "'::uuid,'" + otherRelation + "'::uuid,'" + directionalRelation + "'::uuid) and deleted_at is not null;"
), '3', 'projection capability aligns with mutation authority');

result.relation_delete_capability_alignment = 'PASS';
process.stdout.write(JSON.stringify(result));
