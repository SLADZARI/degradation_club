import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const out=path.join(root,'_site');
const fail=[];
const read=rel=>{
  const file=path.join(out,rel);
  if(!fs.existsSync(file)){fail.push(`missing built file: ${rel}`);return'';}
  return fs.readFileSync(file,'utf8');
};
const expect=(condition,message)=>{if(!condition)fail.push(message)};

const publicRoutes=['index.html','about/index.html','events/index.html','projects/index.html','community/index.html','merch/index.html','archive/index.html','join/index.html'];
for(const rel of publicRoutes){
  const html=read(rel);
  expect(!/<header[^>]*class=["']topbar(?:\s[^"']*)?["']/i.test(html),`${rel}: legacy page-owned topbar survived production build`);
  expect(html.includes('/global-header.css'),`${rel}: canonical header CSS missing`);
  expect(html.includes('/site-config.js'),`${rel}: canonical site config missing before auth-aware header`);
  expect(html.includes('/global-header.js'),`${rel}: canonical header runtime missing`);
  expect(html.indexOf('/site-config.js')<html.indexOf('/global-header.js'),`${rel}: site config must load before GlobalHeader`);
  expect(!/<footer\b/i.test(html),`${rel}: page-owned footer survived production build`);
  expect(html.includes('/global-footer.css'),`${rel}: canonical footer CSS missing`);
  expect(html.includes('/global-footer.js'),`${rel}: canonical footer runtime missing`);
}

const header=read('global-header.js');
for(const route of ['/about/','/events/','/projects/','/community/','/merch/','/join/','/workspace/'])expect(header.includes(`'${route}'`),`global-header.js: canonical route missing ${route}`);
for(const [route,label] of [['/about/','О клубе'],['/events/','События'],['/projects/','Проекты'],['/community/','Сообщество'],['/merch/','Мерч']])expect(header.includes(`link('${route}','${label}')`),`global-header.js: Russian primary navigation missing ${label}`);
expect(!header.includes("link('/archive/'"),'global-header.js: Archive must not return to primary header navigation');
expect(!header.includes("link('/join/','Join')"),'global-header.js: legacy Join menu item survived');
expect(!header.includes("link('/workspace/','Account')"),'global-header.js: legacy Account menu item survived');
expect(header.includes('data-global-join-cta')&&header.includes('Вступить в клуб'),'global-header.js: primary club-entry CTA missing');
expect(header.includes('data-global-login')&&header.includes('Войти'),'global-header.js: guest login service missing');
expect(header.includes("client.from('profiles')")&&header.includes('full_name,avatar_url'),'global-header.js: identity projection does not reuse canonical profile fields');
expect(header.includes("anchor.href='/workspace/'")&&header.includes('dataset.globalIdentity'),'global-header.js: authenticated identity does not resolve to Workspace');
expect(header.includes("'/auth/callback/?next='")&&header.includes("encodeURIComponent('/workspace/')"),'global-header.js: login callback must resolve through canonical auth callback to Workspace');
expect(!header.includes('dc-global-group'), 'global-header.js: dropdown/group navigation must not return');
expect(header.includes("document.querySelectorAll('header.topbar,header.dc-global-header')"),'global-header.js: legacy/duplicate header cleanup missing');
expect(!header.includes("if(runtimePath.startsWith('/workspace/'))return"),'global-header.js: canonical public header must remain visible in Workspace');

const footer=read('global-footer.js');
expect(footer.includes("document.querySelectorAll('footer,.dc-utility-strip')"),'global-footer.js: legacy footer/utility cleanup missing');
expect(footer.includes('href="/archive/"')&&footer.includes('>Archive<'),'global-footer.js: Archive route missing from footer/public access');

const config=read('site-config.js');
expect(config.includes("addScript('/global-header.js');addStyle('/global-header.css')"),'site-config.js: canonical header bootstrap missing');
expect(config.includes("addStyle('/workspace/workspace-public-header-v1.css')"),'site-config.js: Workspace header offset layer missing');

const shell=read('workspace/workspace-shell-v1.js');
expect(shell.includes("const board='/workspace/board/'"),'workspace shell: Board must stay inside Workspace');
expect(shell.includes('id="sessionBox"'),'workspace shell: controller sessionBox contract missing');
expect(shell.includes('data-work-nav'),'workspace shell: controller workNav contract missing');
expect(shell.includes('const viewLink='),'workspace shell: root views must be addressable links');
for(const route of ['home','club','activity','work','profile'])expect(shell.includes(`viewLink('${route}'`),`workspace shell: addressable root view missing ${route}`);
expect(shell.includes('href="${root}#${key}"'),'workspace shell: child surfaces cannot return to root hash views');
expect(shell.includes("dataset.dcWorkspaceAuth='guest'"),'workspace shell: explicit guest boundary state missing');
expect(shell.includes('host.hidden=true'),'workspace shell: guest/private navigation must begin hidden');
expect(shell.includes('data-member-tool'),'workspace shell: membership-gated private routes missing');

for(const rel of ['workspace/index.html','workspace/board/index.html','workspace/artifacts/index.html','workspace/review/index.html','workspace/admin/index.html']){
  const html=read(rel);
  expect(html.includes('/site-config.js'),`${rel}: canonical site config missing above Workspace`);
  expect(html.includes('/global-header.js'),`${rel}: canonical public header runtime missing above Workspace`);
  expect(html.includes('/global-header.css'),`${rel}: canonical public header CSS missing above Workspace`);
  expect(html.indexOf('/site-config.js')<html.indexOf('/global-header.js'),`${rel}: site config must load before Workspace GlobalHeader`);
  expect(!html.includes('/global-footer.js'),`${rel}: public footer must not leak into private Workspace`);
}

for(const rel of ['join/apply/index.html','join/result/index.html']){
  const html=read(rel);
  expect(!/<header[^>]*class=["']topbar(?:\s[^"']*)?["']/i.test(html),`${rel}: legacy page-owned topbar survived production build`);
  expect(html.includes('/global-header.js')&&html.includes('/global-header.css'),`${rel}: canonical public header missing`);
  expect(!html.includes('/global-footer.js'),`${rel}: private Join surface must not receive public footer`);
}

const workspace=read('workspace/index.html');
expect(workspace.includes('data-workspace-sidebar'),'workspace/index.html: shell host missing');
expect(workspace.includes('/workspace-shell-v1.js')||workspace.includes('./workspace-shell-v1.js'),'workspace/index.html: shared shell runtime missing');

const board=read('workspace/board/index.html');
for(const id of ['boardStatus','memberBadge','entryHost','artifactCount','boardFilters','boardHost'])expect(board.includes(`id="${id}"`),`workspace/board/index.html: board runtime host missing #${id}`);
expect(board.includes('../workspace-shell-v1.js'),'workspace/board/index.html: shared Workspace shell missing');
for(const asset of ['board-qa-fix-v1.css','board-integrations-v1.css','board-spatial-v1.css','telegram-worker-trigger-v3.js','board-integrations-v1.js','board-activation-gate-v1.js','board-spatial-v1.js'])expect(board.includes(asset),`workspace/board/index.html: restored Board module missing ${asset}`);

const legacyBoard=read('community/board/index.html');
expect(legacyBoard.includes('/workspace/board/'),'community/board/: compatibility route must resolve into Workspace Board');

const admin=read('workspace/admin/index.html');
expect(admin.includes('../../design-system/dementor-workspace/workspace.css'),'workspace/admin/: complete Workspace layout CSS missing');

const callback=read('auth/callback/index.html');
expect(callback.includes("params.get('next')||'/workspace/'"),'auth callback: Workspace must be the canonical default target');
expect(callback.includes('stripLegacyPrefix'),'auth callback: legacy next-path cleanup missing');
expect(!callback.includes("const defaultTarget=base+'/join/'"),'auth callback: legacy Join fallback survived');
expect(!callback.includes("startsWith('/')?'/degradation_club'"),'auth callback: production build corrupted inline path test');

const joinState=read('join/dc9-entry-state-v1.js');
expect(joinState.includes("route('/workspace/board/')"),'Join member return: Community must route to Workspace Board');
expect(joinState.includes("route('/workspace/')"),'Join member return: Account must route to Workspace');
expect(!joinState.includes("route('/account/')"),'Join member return: dead /account/ route survived');
expect(!joinState.includes("route('/community/board/')"),'Join member return: compatibility Board route must not be primary CTA');

const joinHtml=read('join/index.html');
expect(joinHtml.includes('/join/dc9-member-return-fix-v1.css'),'Join member return: CTA geometry correction layer missing');
expect(joinHtml.includes('id="dc9Picker"')&&!/id=["']dc9Picker["'][^>]*\shidden\b/i.test(joinHtml),'Join DC-9: sphere picker must be the visible entry surface');
expect(!joinHtml.includes('id="dc9Intro"'),'Join DC-9: obsolete standalone intro surface survived');
expect(!joinHtml.includes('id="dc9Start"'),'Join DC-9: redundant Start DC-9 button survived');
expect(joinHtml.includes('ДЕВЯТЬ<br><span>СФЕР.</span>'),'Join DC-9: merged entry must retain the existing nine-sphere framing');

const dc9Runtime=read('join/dc9-immersive-v1.js');
expect(!dc9Runtime.includes('renderIntro'),'Join DC-9: runtime still owns a separate intro state');
expect(!dc9Runtime.includes('dc9Start'),'Join DC-9: runtime still depends on the removed start button');
expect(dc9Runtime.includes("else renderPicker()"),'Join DC-9: default entry no longer resolves directly to the sphere picker');
expect(dc9Runtime.includes('DATA.levelNames'),'Join DC-9: completed sphere cards must expose existing result meaning instead of generic rule copy');
expect(dc9Runtime.includes('dc9ResetPicker'),'Join DC-9: progress reset capability was lost during intro/picker merge');

const applyRuntime=read('join/apply/apply.js');
expect(applyRuntime.includes("from '/community-runtime-v1.js'"),'Join apply: canonical community/auth runtime is not the owner');
expect(applyRuntime.includes("loginWithGoogle('/join/apply/'"),'Join apply: Google auth must return directly to application');
expect(applyRuntime.includes('await syncLocalAssessmentRuns(client,uid)'),'Join apply: anonymous DC-9 results are not attached before server gate evaluation');
expect(applyRuntime.indexOf('await syncLocalAssessmentRuns(client,uid)')<applyRuntime.indexOf("client.rpc('dc_member_entry_status_v1')"),'Join apply: server 9/9 gate is evaluated before local assessment sync');
expect(!applyRuntime.includes('@supabase/supabase-js'),'Join apply: duplicate Supabase client/auth owner survived');

const resultRuntime=read('join/result/result-v6.js');
expect(!resultRuntime.includes('loginWithGoogle'),'Join result: authentication must not happen before the application boundary');
expect(!resultRuntime.includes("route('/join/member/')"),'Join result: legacy member bridge must not be the primary application path');
expect(resultRuntime.includes("route('/join/apply/')"),'Join result: completed DC-9 must continue directly to canonical application');
expect(!resultRuntime.includes("route('/community/board/')"),'Join result: compatibility Board route must not be a member destination');
expect(resultRuntime.includes("route('/workspace/board/')"),'Join result: active Member must continue to Workspace Board');

if(fail.length){
  console.error('Shell contract validation failed:');
  for(const item of fail)console.error(`- ${item}`);
  process.exit(1);
}
console.log(`Shell contract validation PASS (${publicRoutes.length} public route families + site-config ownership + Russian auth-aware GlobalHeader + merged DC-9 entry/picker + canonical Join application auth + direct DC-9 result handoff + addressable Workspace navigation + Board contracts)`);
