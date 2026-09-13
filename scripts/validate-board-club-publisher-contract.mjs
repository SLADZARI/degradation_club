import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const migration=read('supabase/migrations/20260913154500_board_club_publisher_v1.sql');
const board=read('community/board/board-club-publisher-v1.js');
const boardCss=read('community/board/board-club-publisher-v1.css');
const boardHtml=read('workspace/board/index.html');
const artifact=read('community/artifact/artifact-club-publisher-v1.js');
const artifactHtml=read('community/artifact/index.html');
const worker=read('supabase/functions/telegram-outbox-worker/index.ts');

const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};
const has=(text,needle)=>text.includes(needle);

expect(has(migration,'create table if not exists public.dc_artifact_publisher_overrides'),'publisher override table missing');
expect(has(migration,"publisher_scope text not null check (publisher_scope = 'club')"),'club-only publisher scope constraint missing');
expect(has(migration,'created_by uuid not null references public.profiles(id)'),'real admin audit owner missing');
expect(has(migration,'alter table public.dc_artifact_publisher_overrides enable row level security'),'publisher overrides RLS missing');
expect(has(migration,'revoke all on table public.dc_artifact_publisher_overrides from public, anon, authenticated'),'publisher overrides must not be directly readable');
expect(has(migration,'dc_owner_board_publisher_choice_v1'),'owner publisher choice command missing');
expect(has(migration,'if not public.dc_is_owner_admin(v_uid) then raise exception \'OWNER_ADMIN_REQUIRED\''),'publisher choice must be OWNER_ADMIN-only');
expect(has(migration,"v_scope not in ('profile','club')"),'publisher scope whitelist missing');
expect(has(migration,'dc_owner_board_publisher_state_v1'),'owner publisher state read missing');
expect(has(migration,'dc_artifact_publisher_scopes_v1'),'safe presentation projection missing');
expect(has(migration,"values (v_uid,'announcement'"),'canonical draft must keep real auth uid as author_profile_id');
expect(has(migration,"then 'DEMENTOR CLUB'::text else p.display_name"),'guest Board club identity masking missing');
expect(has(migration,"then '/assets/brand/dementor-mark-black.svg'::text else p.avatar_url"),'canonical club mark masking missing');
expect(has(migration,"'author_profile_id',case when po.publisher_scope='club' then null::uuid"),'guest detail must not leak personal author id for club publications');
expect(!/insert\s+into\s+public\.profiles/i.test(migration),'must not create a fake club profile');
expect(!/insert\s+into\s+public\.dc_memberships/i.test(migration),'must not create membership');
expect(!/insert\s+into\s+public\.dc_artifact_slot_grants/i.test(migration),'must not mint artifact slots');

expect(has(board,'ПУБЛИКОВАТЬ КАК'),'owner composer publisher selector missing');
expect(has(board,'value="profile"'),'personal publisher option missing');
expect(has(board,'value="club"'),'club publisher option missing');
expect(has(board,'DEMENTOR CLUB'),'club label missing');
expect(has(board,"dc_owner_board_publisher_choice_v1"),'composer must use owner-only publisher command');
expect(has(board,"dc_artifact_publisher_scopes_v1"),'Board must consume safe publisher projection');
expect(has(board,'CLUB / PUBLICATION'),'Board institutional presentation label missing');
expect(has(board,"if(card.dataset.publisherScope===CLUB_SCOPE)return false"),'club card rewrite must be idempotent');
expect(has(board,'boardRefreshRunning'),'publisher refresh must guard re-entrant mutation refresh');
expect(has(board,'requestAnimationFrame'),'publisher mutation refresh must be frame-coalesced');
expect(board.match(/author\.innerHTML=/g)?.length===1,'publisher renderer must have one author rewrite owner');
expect(has(boardCss,'.dc-publisher-choice'),'publisher selector styling missing');
expect(has(boardHtml,'board-club-publisher-v1.css'),'Workspace Board must load publisher CSS');
expect(has(boardHtml,'board-club-publisher-v1.js'),'Workspace Board must load publisher module');

expect(has(artifact,"dc_artifact_publisher_scopes_v1"),'Artifact must resolve institutional publisher projection');
expect(has(artifact,'DEMENTOR CLUB'),'Artifact club identity missing');
expect(has(artifact,"author.dataset.publisherScope===CLUB_SCOPE"),'Artifact club identity rewrite must be idempotent');
expect(has(artifact,'refreshQueued'),'Artifact mutation refresh must be coalesced');
expect(has(artifact,'requestAnimationFrame'),'Artifact mutation refresh must be frame-coalesced');
expect(artifact.match(/author\.innerHTML=/g)?.length===1,'Artifact publisher renderer must have one author rewrite owner');
expect(has(artifactHtml,'artifact-club-publisher-v1.js'),'Artifact page must load publisher module');

expect(has(worker,'.from("dc_artifact_publisher_overrides")'),'Telegram worker must read publisher override');
expect(has(worker,'publisherResult.data?.publisher_scope !== "club"'),'Telegram worker must branch on club scope');
expect(has(worker,'let author = "DEMENTOR CLUB"'),'Telegram club author label missing');
expect(has(worker,'`Автор: ${author}`'),'Telegram output must use resolved public identity');

if(errors.length){
  console.error('BOARD CLUB PUBLISHER CONTRACT FAILED');
  for(const error of errors)console.error(`- ${error}`);
  process.exit(1);
}

console.log('Board club publisher contract PASS: OWNER_ADMIN-only institutional identity, real author audit ownership, idempotent Board + Artifact publisher rendering, Guest/Telegram presentation aligned.');
