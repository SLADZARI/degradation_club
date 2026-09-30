import fs from 'node:fs';

const failures=[];
const expect=(ok,msg)=>{if(!ok)failures.push(msg)};
const read=file=>fs.readFileSync(file,'utf8');

const admin=read('workspace/admin/index.html');
const page=read('workspace/admin/community-ops/index.html');
const runtime=read('workspace/admin/community-ops/community-ops-v1.js');
const guard=read('workspace/admin/owner-admin-access-v1.js');
const migration=read('supabase/migrations/20260930180000_owner_admin_community_ops_read_v1.sql');

expect(admin.includes('href="./community-ops/"'),'System Tools does not link Community Ops');
expect(page.includes('name="robots" content="noindex,nofollow,noarchive"'),'Community Ops must remain noindex');
expect((page.match(/data-workspace-sidebar/g)||[]).length===1,'Community Ops must have one Workspace sidebar');
expect((page.match(/workspace-shell-v1\.js/g)||[]).length===1,'Community Ops must load one Workspace shell');
expect((page.match(/owner-admin-access-v1\.js/g)||[]).length===1,'Community Ops must reuse Owner Admin access guard');
expect(guard.includes('dc:owner-admin-ready'),'Owner Admin guard readiness signal missing');
expect(runtime.includes("root.dataset.dcOwnerAdmin==='1'"),'Community Ops does not wait for canonical Owner Admin guard');

[
  'dc_admin_profile_search_v1',
  'dc_admin_artifact_slot_status_v1',
  'dc_admin_grant_artifact_slots_v1',
  'dc_artifact_participants_read_v1',
  'dc_artifact_invite_candidates_v1',
  'dc_artifact_invite_v1',
  'dc_artifact_remove_participant_v1',
  'dc_close_artifact_v1'
].forEach(rpc=>expect(runtime.includes(rpc),'Missing canonical RPC '+rpc));

expect(!/\.from\([^\n]+\)\.(?:insert|update|delete|upsert)\s*\(/.test(runtime),'Direct table mutation detected');
expect(!runtime.includes("select('email")&&!runtime.includes(',email'),'Private email selected');
expect(runtime.includes('grantPending'),'Duplicate slot-grant UI guard missing');
expect(runtime.includes('Выдать +'),'Slot grant confirmation copy missing');
expect(runtime.includes("client.rpc('dc_close_artifact_v1'"),'Archive bypasses canonical close RPC');
expect(runtime.includes("client.rpc('dc_artifact_invite_v1'"),'Invite bypasses canonical invite RPC');
expect(runtime.includes("client.rpc('dc_artifact_remove_participant_v1'"),'Remove bypasses canonical participant RPC');

expect(migration.includes('create or replace function public.dc_admin_profile_search_v1'),'Profile search projection missing');
expect(migration.includes('create or replace function public.dc_admin_artifact_slot_status_v1'),'Slot status projection missing');
expect((migration.match(/OWNER_ADMIN_REQUIRED/g)||[]).length>=2,'Owner Admin backend gate missing');
expect(migration.includes("'USER-' || upper(left(p.id::text,8))"),'Safe secondary profile reference missing');
expect(migration.includes("a.status in ('publishing','active')"),'Slot consuming formula drift');
expect(migration.includes('greatest(v_granted-v_consuming,0)'),'Slot available formula drift');
expect(migration.includes('public.dc_artifact_slot_grants'),'Canonical slot history ledger not used');
expect(!/\bcreate\s+(?:table|view|materialized\s+view)\b/i.test(migration),'Parallel persistent state created');
expect(!/\binsert\s+into\b|\bupdate\s+public\.|\bdelete\s+from\b/i.test(migration),'Read-only migration contains mutation SQL');
expect(migration.includes('grant execute on function public.dc_admin_profile_search_v1(text,integer) to authenticated'),'Profile read execute grant missing');
expect(migration.includes('grant execute on function public.dc_admin_artifact_slot_status_v1(uuid) to authenticated'),'Slot read execute grant missing');
expect(migration.includes('revoke all on function public.dc_admin_profile_search_v1(text,integer) from anon'),'Profile read anon revoke missing');
expect(migration.includes('revoke all on function public.dc_admin_artifact_slot_status_v1(uuid) from anon'),'Slot read anon revoke missing');

if(failures.length){
  console.error('Owner Admin Community Ops contract failed ('+failures.length+')');
  failures.forEach(f=>console.error('- '+f));
  process.exit(1);
}
console.log('Owner Admin Community Ops contract PASS: existing admin shell, safe read projections, canonical mutations, no parallel state/direct writes.');
