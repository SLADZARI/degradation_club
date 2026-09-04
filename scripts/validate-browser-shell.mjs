import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const errors=[];
const expect=(ok,msg)=>{if(!ok)errors.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};

function resolveFile(urlPath){
  let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);
  if(pathname.endsWith('/'))pathname+='index.html';
  const full=path.resolve(artifact,pathname.replace(/^\/+/,''));
  if(!full.startsWith(path.resolve(artifact)+path.sep)&&full!==path.resolve(artifact))return null;
  return full;
}

const server=http.createServer((req,res)=>{
  const file=resolveFile(req.url||'/');
  if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){
    const fallback=path.join(artifact,'404.html');
    res.statusCode=404;res.setHeader('content-type','text/html; charset=utf-8');res.end(fs.existsSync(fallback)?fs.readFileSync(fallback):'Not found');return;
  }
  res.statusCode=200;res.setHeader('content-type',mime[path.extname(file).toLowerCase()]||'application/octet-stream');res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});

const supabaseStub=()=>`
  const mode=globalThis.__QA_AUTH_MODE__||'guest';
  const authenticated=mode!=='guest',owner=mode==='owner',member=mode==='member'||owner;
  const user={id:'qa-browser-user',email:'qa-browser@dementor.invalid',user_metadata:{full_name:'QA Browser'}};
  const session=authenticated?{user}:null;const active={status:'active',valid_from:null,valid_to:null};
  const roleRows=owner?[{role:'owner_admin',...active}]:[];const membership=member?{...active}:null;
  const rowsFor=t=>t==='dc_role_assignments'?roleRows:[];
  const query=t=>{const c={select(){return c},eq(){return c},neq(){return c},in(){return c},is(){return c},order(){return c},limit(){return c},range(){return c},update(){return c},insert(){return c},upsert(){return c},delete(){return c},maybeSingle(){return Promise.resolve({data:t==='dc_system_memberships'?membership:null,error:null})},single(){return Promise.resolve({data:null,error:null})},then(resolve,reject){return Promise.resolve({data:rowsFor(t),error:null}).then(resolve,reject)}};return c};
  const bucket={createSignedUrl:async()=>({data:{signedUrl:'https://example.invalid/qa.webp'},error:null}),upload:async()=>({data:{path:'qa'},error:null}),remove:async()=>({data:[],error:null})};
  export function createClient(){return {auth:{getSession:async()=>({data:{session},error:null}),getUser:async()=>({data:{user:authenticated?user:null},error:null}),exchangeCodeForSession:async()=>({data:{session:{user}},error:null}),signInWithOAuth:async payload=>{globalThis.__QA_OAUTH__=payload;return {data:{},error:null}},signOut:async()=>({error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:query,rpc:async n=>({data:n==='dc_member_entry_status_v1'?{membership_active:member,community_activation_state:member?'MEMBER_ACTIVATED':null,artifact_slots_available:0,published_artifact_count:member?1:0}:null,error:null}),storage:{from:()=>bucket},functions:{invoke:async()=>({data:{},error:null})}}}
`;

async function context(mode='guest',viewport={width:1440,height:1000}){
  const c=await browser.newContext({viewport});
  await c.addInitScript(value=>{globalThis.__QA_AUTH_MODE__=value},mode);
  await c.route('https://cdn.jsdelivr.net/**',r=>r.request().url().includes('@supabase/supabase-js')?r.fulfill({status:200,contentType:'text/javascript; charset=utf-8',body:supabaseStub()}):r.abort());
  return c;
}

async function header(page,label){
  try{await page.locator('.dc-global-header').waitFor({state:'visible',timeout:4000})}catch{errors.push(`${label}: canonical public header did not render`);return}
  expect(await page.locator('.dc-global-header').count()===1,`${label}: expected one canonical header`);
  expect(await page.locator('header.topbar').count()===0,`${label}: legacy topbar survived`);
}

for(const route of ['/','/about/','/projects/','/community/','/merch/','/archive/','/join/']){
  const c=await context(),p=await c.newPage(),pageErrors=[];p.on('pageerror',e=>pageErrors.push(e.message));
  await p.goto(base+route,{waitUntil:'domcontentloaded'});await header(p,route);
  try{await p.locator('[data-global-login]').waitFor({state:'visible',timeout:4000})}catch{errors.push(`${route}: guest login service did not render`)}
  try{await p.locator('.dc-global-footer').waitFor({state:'visible',timeout:4000})}catch{errors.push(`${route}: canonical footer did not render`)}
  expect(await p.locator('.dc-global-footer').count()===1,`${route}: expected one canonical footer`);
  expect(await p.locator('.dc-utility-strip').count()===0,`${route}: legacy utility strip survived`);
  const labels=(await p.locator('#dc-global-nav > a').allTextContents()).map(v=>v.trim());
  expect(JSON.stringify(labels)===JSON.stringify(['О клубе','События','Проекты','Сообщество','Мерч']),`${route}: header labels drifted: ${labels.join(' / ')}`);
  expect((await p.locator('[data-global-join-cta]').getAttribute('href'))==='/join/',`${route}: primary club-entry CTA drifted`);
  expect((await p.locator('[data-global-join-cta]').textContent()).trim()==='Вступить в клуб',`${route}: primary club-entry CTA copy drifted`);
  expect(await p.locator('[data-global-login]:visible').count()===1,`${route}: guest must see exactly one login service`);
  expect(await p.locator('.dc-global-header').getByText('Account',{exact:true}).count()===0,`${route}: legacy Account navigation survived in canonical header`);
  expect(await p.locator('.dc-global-header').getByText('Join',{exact:true}).count()===0,`${route}: legacy Join navigation survived in canonical header`);
  const f=await p.locator('.dc-global-footer').evaluate(el=>({display:getComputedStyle(el).display,width:el.getBoundingClientRect().width,viewport:innerWidth}));
  expect(f.display==='block'&&f.width>=f.viewport*.98,`${route}: footer geometry drifted ${JSON.stringify(f)}`);
  expect(!pageErrors.some(e=>/Cannot set properties of null/i.test(e)),`${route}: null DOM error: ${pageErrors.join(' | ')}`);await c.close();
}

// Guest login service must reuse the canonical OAuth callback and return to Workspace.
{
  const c=await context('guest'),p=await c.newPage(),pageErrors=[];p.on('pageerror',e=>pageErrors.push(e.message));
  await p.goto(base+'/about/',{waitUntil:'domcontentloaded'});await header(p,'guest login contract');
  try{await p.locator('[data-global-login]').waitFor({state:'visible',timeout:4000});await p.locator('[data-global-login]').click();await p.waitForFunction(()=>Boolean(window.__QA_OAUTH__),{timeout:3000});const oauth=await p.evaluate(()=>window.__QA_OAUTH__);const redirect=new URL(oauth?.options?.redirectTo);expect(oauth?.provider==='google','GlobalHeader login: provider is not Google');expect(redirect.pathname==='/auth/callback/','GlobalHeader login: canonical callback route drifted');expect(redirect.searchParams.get('next')==='/workspace/','GlobalHeader login: callback does not return to Workspace')}catch(e){errors.push(`GlobalHeader login contract failed: ${e.message}`)}
  expect(!pageErrors.length,`GlobalHeader guest login errors: ${pageErrors.join(' | ')}`);await c.close();
}

// Authenticated guest keeps the club-entry CTA but login becomes identity -> Workspace.
{
  const c=await context('auth'),p=await c.newPage(),pageErrors=[],consoleMessages=[];p.on('pageerror',e=>pageErrors.push(e.message));p.on('console',m=>consoleMessages.push(m.text()));
  await p.goto(base+'/about/',{waitUntil:'domcontentloaded'});await header(p,'authenticated guest header');
  let identityReady=true;
  try{await p.locator('[data-global-identity]').waitFor({state:'visible',timeout:4000})}catch{identityReady=false;const state=await p.locator('.dc-global-header').getAttribute('data-dc-header-auth').catch(()=>null);const loginCount=await p.locator('[data-global-login]').count();const mode=await p.evaluate(()=>window.__QA_AUTH_MODE__).catch(()=>null);errors.push(`authenticated guest: identity state did not render; header=${state}; login=${loginCount}; mode=${mode}; console=${consoleMessages.slice(-5).join(' | ')}`)}
  if(identityReady){
    expect((await p.locator('[data-global-identity]').getAttribute('href'))==='/workspace/','authenticated guest: identity does not route to Workspace');
    expect((await p.locator('[data-global-identity]').innerText()).includes('QA Browser'),'authenticated guest: identity name missing');
    expect(await p.locator('[data-global-join-cta]:visible').count()===1,'authenticated guest: club-entry CTA must remain visible before membership');
    expect(await p.locator('[data-global-login]:visible').count()===0,'authenticated guest: login service survived after session');
  }
  expect(!pageErrors.length,`authenticated guest header errors: ${pageErrors.join(' | ')}`);await c.close();
}

// Mobile shell: brand + persistent club-entry CTA + burger; login lives inside the opened menu.
{
  const c=await context('guest',{width:360,height:800}),p=await c.newPage(),pageErrors=[];p.on('pageerror',e=>pageErrors.push(e.message));
  await p.goto(base+'/',{waitUntil:'domcontentloaded'});await header(p,'mobile guest header');
  try{await p.locator('[data-global-login]').waitFor({state:'attached',timeout:4000})}catch{errors.push('mobile guest: login service missing')}
  expect(await p.locator('.dc-global-brand:visible').count()===1,'mobile guest: brand missing');
  expect(await p.locator('[data-global-join-cta]:visible').count()===1,'mobile guest: persistent club-entry CTA missing while menu closed');
  expect(await p.locator('.dc-global-menu:visible').count()===1,'mobile guest: burger missing');
  expect(await p.locator('#dc-global-nav:visible').count()===0,'mobile guest: burger panel is open by default');
  const geometry=await p.locator('.dc-global-header').evaluate(el=>({scrollWidth:el.scrollWidth,clientWidth:el.clientWidth}));expect(geometry.scrollWidth<=geometry.clientWidth+1,`mobile guest: header overflows at 360px ${JSON.stringify(geometry)}`);
  await p.locator('.dc-global-menu').click();
  try{await p.locator('#dc-global-nav').waitFor({state:'visible',timeout:2000})}catch{errors.push('mobile guest: burger did not open')}
  expect(await p.locator('#dc-global-nav [data-global-login]:visible').count()===1,'mobile guest: login is not inside opened burger');
  expect(!pageErrors.length,`mobile guest header errors: ${pageErrors.join(' | ')}`);await c.close();
}

// Guest: canonical public header remains, private Workspace navigation does not.
{
  const c=await context('guest'),p=await c.newPage(),pageErrors=[];p.on('pageerror',e=>pageErrors.push(e.message));
  await p.goto(base+'/workspace/',{waitUntil:'domcontentloaded'});await header(p,'/workspace/ guest');
  try{await p.getByRole('button',{name:'ВОЙТИ ЧЕРЕЗ GOOGLE'}).waitFor({state:'visible',timeout:4000})}catch{errors.push('/workspace/: guest login gate did not render')}
  expect(await p.locator('[data-workspace-sidebar]:visible').count()===0,'/workspace/: guest can see private sidebar');
  expect(await p.locator('[data-global-logout]:visible').count()===0,'/workspace/: guest can see LOG OUT');
  expect(await p.locator('[data-member-tool]:visible').count()===0,'/workspace/: guest can see member routes');
  expect((await p.locator('.dc-global-brand').getAttribute('href'))==='/', '/workspace/: public brand does not return to /');
  expect(!pageErrors.length,`/workspace/ guest errors: ${pageErrors.join(' | ')}`);await c.close();
}

// PKCE success must land at root Workspace and never revive historical Pages prefix.
{
  const c=await context('member'),p=await c.newPage(),pageErrors=[];p.on('pageerror',e=>pageErrors.push(e.message));
  await p.goto(base+'/auth/callback/?code=qa&next=%2Fworkspace%2F',{waitUntil:'domcontentloaded'});
  try{await p.waitForURL(u=>new URL(u).pathname==='/workspace/',{timeout:5000})}catch{errors.push(`/auth/callback/: did not return to /workspace/; actual=${p.url()}`)}
  const finalPath=new URL(p.url()).pathname;expect(finalPath==='/workspace/',`/auth/callback/: final path ${finalPath}`);expect(!finalPath.includes('/degradation_club/'),'/auth/callback/: legacy prefix returned');expect(!pageErrors.length,`/auth/callback/ errors: ${pageErrors.join(' | ')}`);await c.close();
}

// Authenticated member: identity replaces login and redundant join CTA is hidden.
{
  const c=await context('member'),p=await c.newPage(),pageErrors=[];p.on('pageerror',e=>pageErrors.push(e.message));
  await p.goto(base+'/workspace/',{waitUntil:'domcontentloaded'});await header(p,'/workspace/ member');
  try{await p.locator('[data-workspace-sidebar]').waitFor({state:'visible',timeout:4000})}catch{errors.push('/workspace/: authenticated sidebar did not become visible')}
  try{await p.locator('[data-global-identity]').waitFor({state:'visible',timeout:4000})}catch{errors.push('/workspace/: member identity state did not render')}
  expect(await p.locator('[data-global-join-cta]:visible').count()===0,'/workspace/: active member still sees redundant join CTA');
  expect(await p.locator('[data-global-login]:visible').count()===0,'/workspace/: active member still sees login service');
  expect(await p.locator('[data-member-tool]:visible').count()>=2,'/workspace/: active member lacks Board/Artifacts navigation');
  try{await p.locator('[data-route="activity"]').first().click();await p.waitForFunction(()=>document.querySelector('#topTitle')?.textContent?.trim()==='MY ACTIVITY');expect((await p.locator('#appView').innerText()).includes('Моя активность'),'Workspace Activity did not render');await p.locator('[data-route="club"]').first().click();await p.waitForFunction(()=>document.querySelector('#topTitle')?.textContent?.trim()==='MY CLUB');expect((await p.locator('#appView').innerText()).includes('Мой клуб'),'Workspace My Club did not render')}catch(e){errors.push(`/workspace/: route transition failed: ${e.message}`)}
  expect(!pageErrors.length,`/workspace/ member errors: ${pageErrors.join(' | ')}`);await c.close();
}

// Child surfaces must never strand root Workspace navigation. One session crosses
// Board -> Home -> Review -> Activity -> Board -> Club without logout/login recovery.
{
  const c=await context('owner'),p=await c.newPage(),pageErrors=[];p.on('pageerror',e=>pageErrors.push(e.message));
  await p.goto(base+'/workspace/',{waitUntil:'domcontentloaded'});await header(p,'workspace navigation sequence');
  try{
    await p.locator('[data-workspace-sidebar]').waitFor({state:'visible',timeout:4000});
    await p.getByRole('link',{name:'COMMUNITY BOARD'}).waitFor({state:'visible',timeout:4000});
    await p.getByRole('link',{name:'COMMUNITY BOARD'}).click();
    await p.waitForURL(u=>new URL(u).pathname==='/workspace/board/');
    await p.getByRole('link',{name:'HOME'}).click();
    await p.waitForURL(u=>new URL(u).pathname==='/workspace/'&&new URL(u).hash==='#home');
    await p.waitForFunction(()=>document.querySelector('#topTitle')?.textContent?.trim()==='HOME');
    await p.getByRole('link',{name:'MEMBERSHIP REVIEW'}).waitFor({state:'visible',timeout:4000});
    await p.getByRole('link',{name:'MEMBERSHIP REVIEW'}).click();
    await p.waitForURL(u=>new URL(u).pathname==='/workspace/review/');
    await p.getByRole('link',{name:'MY ACTIVITY'}).click();
    await p.waitForURL(u=>new URL(u).pathname==='/workspace/'&&new URL(u).hash==='#activity');
    await p.waitForFunction(()=>document.querySelector('#topTitle')?.textContent?.trim()==='MY ACTIVITY');
    await p.getByRole('link',{name:'COMMUNITY BOARD'}).click();
    await p.waitForURL(u=>new URL(u).pathname==='/workspace/board/');
    await p.getByRole('link',{name:'MY CLUB'}).click();
    await p.waitForURL(u=>new URL(u).pathname==='/workspace/'&&new URL(u).hash==='#club');
    await p.waitForFunction(()=>document.querySelector('#topTitle')?.textContent?.trim()==='MY CLUB');
    expect((await p.locator('#appView').innerText()).includes('Мой клуб'),'Workspace sequence: My Club did not recover after child surfaces');
  }catch(e){errors.push(`Workspace child/root navigation sequence failed: ${e.message}; actual=${p.url()}`)}
  expect(!pageErrors.length,`Workspace navigation sequence errors: ${pageErrors.join(' | ')}`);await c.close();
}

// Board migration must preserve filters, pan/zoom and own-card positioning.
{
  const c=await context('member'),p=await c.newPage(),pageErrors=[];p.on('pageerror',e=>pageErrors.push(e.message));
  await p.goto(base+'/workspace/board/',{waitUntil:'domcontentloaded'});await header(p,'/workspace/board/');
  try{await p.locator('.dc-spatial-viewport').waitFor({state:'visible',timeout:5000})}catch{errors.push(`/workspace/board/: spatial viewport missing; errors=${pageErrors.join(' | ')||'none'}`)}
  expect(await p.locator('[data-workspace-sidebar]:visible').count()===1,'/workspace/board/: sidebar missing');expect(await p.locator('#boardFilters .dc-board-filter').count()>=5,'/workspace/board/: filters missing');expect(await p.locator('.dc-spatial-controls').count()===1,'/workspace/board/: pan/zoom controls missing');
  await p.evaluate(()=>{const host=document.getElementById('boardHost'),card=document.createElement('article');card.className='dc-notice';card.dataset.artifact='qa-artifact';card.innerHTML='<button type="button" data-close-artifact>QA</button>';host?.appendChild(card)});
  try{await p.locator('[data-artifact="qa-artifact"].is-own-movable').waitFor({state:'attached',timeout:2500})}catch{errors.push('/workspace/board/: own card did not become movable')}
  const pos=await p.locator('[data-artifact="qa-artifact"]').evaluate(el=>({left:el.style.left,top:el.style.top}));expect(Boolean(pos.left&&pos.top),'/workspace/board/: spatial position not assigned');expect(!pageErrors.length,`/workspace/board/ errors: ${pageErrors.join(' | ')}`);await c.close();
}

// Join member-return uses only live routes and no longer renders the duplicate account slab.
{
  const c=await context('member'),p=await c.newPage(),pageErrors=[];p.on('pageerror',e=>pageErrors.push(e.message));
  await p.goto(base+'/join/',{waitUntil:'domcontentloaded'});await header(p,'/join/ member');
  try{await p.locator('#dc9MemberReturn').waitFor({state:'visible',timeout:5000})}catch{errors.push(`/join/: member-return did not render; errors=${pageErrors.join(' | ')||'none'}`)}
  const hrefs=await p.locator('#dc9MemberReturn a').evaluateAll(nodes=>nodes.map(a=>a.getAttribute('href')));expect(hrefs.includes('/workspace/board/'),`/join/: Community CTA drifted (${hrefs.join(', ')})`);expect(hrefs.includes('/join/result/'),'/join/: DC-9 CTA missing');expect(hrefs.includes('/workspace/'),'/join/: Account CTA drifted');expect(!hrefs.includes('/account/'),'/join/: dead /account/ survived');
  const buttons=await p.locator('#dc9MemberReturn .dc9-button').evaluateAll(nodes=>nodes.map(el=>({display:getComputedStyle(el).display,height:el.getBoundingClientRect().height})));expect(buttons.length>=2&&buttons.every(x=>['flex','inline-flex'].includes(x.display)&&x.height>=48),`/join/: member CTA geometry drifted ${JSON.stringify(buttons)}`);
  expect(await p.locator('.dc-account-panel').count()===0,'/join/: authenticated duplicate account panel survived');
  const dark=await p.evaluate(()=>{const h=document.querySelector('.dc-global-header');if(!h)return[];const bottom=h.getBoundingClientRect().bottom;return[...document.querySelectorAll('body *')].map(el=>{const r=el.getBoundingClientRect(),bg=getComputedStyle(el).backgroundColor;return{tag:el.tagName,cls:String(el.className||''),top:r.top,height:r.height,width:r.width,bg}}).filter(x=>x.width>innerWidth*.8&&x.height>30&&x.top>=bottom-2&&x.top<bottom+220&&(x.bg==='rgb(17, 17, 17)'||x.bg==='rgb(0, 0, 0)'))});expect(dark.length===0,`/join/: unexplained dark slab below header: ${JSON.stringify(dark.slice(0,3))}`);expect(!pageErrors.length,`/join/ errors: ${pageErrors.join(' | ')}`);await c.close();
}

// Owner admin retains Workspace geometry under the same canonical public header.
{
  const c=await context('owner');await c.route('**/workspace/admin/owner-admin-access-v1.js',r=>r.fulfill({status:200,contentType:'text/javascript',body:'document.documentElement.dataset.dcOwnerAdmin="1";'}));const p=await c.newPage();await p.goto(base+'/workspace/admin/',{waitUntil:'domcontentloaded'});await header(p,'/workspace/admin/');await p.waitForTimeout(200);const layout=await p.locator('.dcw-app').evaluate(el=>({display:getComputedStyle(el).display,columns:getComputedStyle(el).gridTemplateColumns}));expect(layout.display==='grid'&&layout.columns&&layout.columns!=='none',`/workspace/admin/: layout drifted ${JSON.stringify(layout)}`);expect(await p.locator('.dca-tools').evaluate(el=>getComputedStyle(el).display)==='grid','/workspace/admin/: tool cards are not grid');await c.close();
}

await browser.close();await new Promise(resolve=>server.close(resolve));
if(errors.length){console.error('BROWSER SHELL SMOKE BLOCKED');for(const e of errors)console.error(`- ${e}`);process.exit(1)}
console.log('Browser shell smoke PASS: Russian auth-aware public shell + OAuth + guest/member boundary + mobile header + addressable Workspace navigation + spatial Board + Join + Admin');
