import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};

function resolveFile(urlPath){
  let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);
  if(pathname.endsWith('/'))pathname+='index.html';
  const rel=pathname.replace(/^\/+/, '');
  const full=path.resolve(artifact,rel);
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
const port=server.address().port;
const base=`http://127.0.0.1:${port}`;
const browser=await chromium.launch({headless:true});

const supabaseStub=(mode='guest')=>{
  const authenticated=mode!=='guest';
  const owner=mode==='owner';
  const member=mode==='member'||owner;
  return `
    const user={id:'qa-browser-user',email:'qa-browser@dementor.invalid',user_metadata:{full_name:'QA Browser'}};
    const session=${authenticated?'{user}':'null'};
    const active={status:'active',valid_from:null,valid_to:null};
    const roleRows=${owner?"[{role:'owner_admin',...active}]":"[]"};
    const assignmentRows=[];
    const membership=${member?'{...active}':'null'};
    const rowsFor=table=>table==='dc_role_assignments'?roleRows:table==='dc_entity_assignments'?assignmentRows:[];
    const query=(table)=>{
      const chain={
        select(){return chain},eq(){return chain},neq(){return chain},in(){return chain},is(){return chain},order(){return chain},limit(){return chain},range(){return chain},update(){return chain},insert(){return chain},upsert(){return chain},delete(){return chain},
        maybeSingle(){return Promise.resolve({data:table==='dc_system_memberships'?membership:null,error:null})},
        single(){return Promise.resolve({data:null,error:null})},
        then(resolve,reject){return Promise.resolve({data:rowsFor(table),error:null}).then(resolve,reject)}
      };return chain;
    };
    const storageBucket={createSignedUrl:async()=>({data:{signedUrl:'https://example.invalid/qa.webp'},error:null}),upload:async()=>({data:{path:'qa'},error:null}),remove:async()=>({data:[],error:null})};
    export function createClient(){return {
      auth:{
        getSession:async()=>({data:{session},error:null}),
        getUser:async()=>({data:{user:${authenticated?'user':'null'}},error:null}),
        exchangeCodeForSession:async()=>({data:{session:{user}},error:null}),
        signInWithOAuth:async()=>({data:{},error:null}),
        signOut:async()=>({error:null}),
        onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})
      },
      from:query,
      rpc:async(name)=>({data:name==='dc_member_entry_status_v1'?{membership_active:${member},community_activation_state:${member?"'MEMBER_ACTIVATED'":"null"},artifact_slots_available:0,published_artifact_count:${member?1:0}}:null,error:null}),
      storage:{from:()=>storageBucket},
      functions:{invoke:async()=>({data:{},error:null})
      }
    }}
  `;
};

async function newContext(mode='guest'){
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  await context.route('https://cdn.jsdelivr.net/**',route=>{
    const url=route.request().url();
    if(url.includes('@supabase/supabase-js'))return route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',body:supabaseStub(mode)});
    return route.abort();
  });
  return context;
}

async function waitHeader(page,route){
  try{await page.locator('.dc-global-header').waitFor({state:'visible',timeout:4000});}
  catch{errors.push(`${route}: canonical public header did not render`);return false}
  expect(await page.locator('.dc-global-header').count()===1,`${route}: expected exactly one canonical public header`);
  expect(await page.locator('header.topbar').count()===0,`${route}: legacy topbar exists in browser DOM`);
  return true;
}

async function checkPublicShell(route){
  const context=await newContext('guest');
  const page=await context.newPage();
  const pageErrors=[];page.on('pageerror',error=>pageErrors.push(error.message));
  await page.goto(base+route,{waitUntil:'domcontentloaded'});
  await waitHeader(page,route);
  try{await page.locator('.dc-global-footer').waitFor({state:'visible',timeout:4000});}catch{errors.push(`${route}: canonical footer did not render`)}
  expect(await page.locator('.dc-global-footer').count()===1,`${route}: expected exactly one canonical footer`);
  expect(await page.locator('.dc-utility-strip').count()===0,`${route}: legacy utility strip exists beside canonical footer`);
  const labels=(await page.locator('#dc-global-nav > a').allTextContents()).map(v=>v.trim());
  expect(JSON.stringify(labels)===JSON.stringify(['Club','Events','Projects','Community','Merch','Archive','Join','Account']),`${route}: header labels drifted: ${labels.join(' / ')}`);
  const footerStyle=await page.locator('.dc-global-footer').evaluate(el=>({display:getComputedStyle(el).display,width:el.getBoundingClientRect().width,viewport:innerWidth}));
  expect(footerStyle.display==='block',`${route}: canonical footer display is ${footerStyle.display}`);
  expect(footerStyle.width>=footerStyle.viewport*.98,`${route}: canonical footer does not span viewport (${footerStyle.width}/${footerStyle.viewport})`);
  expect(!pageErrors.some(e=>/Cannot set properties of null/i.test(e)),`${route}: null DOM runtime error: ${pageErrors.join(' | ')}`);
  await context.close();
}

for(const route of ['/','/about/','/projects/','/community/','/merch/','/archive/','/join/'])await checkPublicShell(route);

// Guest Workspace: public header remains available, but private navigation stays hidden until auth succeeds.
{
  const context=await newContext('guest');const page=await context.newPage();const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
  await page.goto(base+'/workspace/',{waitUntil:'domcontentloaded'});
  await waitHeader(page,'/workspace/ guest');
  try{await page.getByRole('button',{name:'ВОЙТИ ЧЕРЕЗ GOOGLE'}).waitFor({state:'visible',timeout:4000});}catch{errors.push(`/workspace/: guest login gate did not render; errors=${pageErrors.join(' | ')||'none'}`)}
  expect(await page.locator('[data-workspace-sidebar]:visible').count()===0,'/workspace/: guest can see private Workspace sidebar');
  expect(await page.locator('[data-global-logout]:visible').count()===0,'/workspace/: guest can see LOG OUT');
  expect(await page.locator('[data-member-tool]:visible').count()===0,'/workspace/: guest can see member-only navigation');
  expect((await page.locator('.dc-global-brand').getAttribute('href'))==='/', '/workspace/: public brand does not return to club home');
  expect(!pageErrors.length,`/workspace/ guest recovery produced page errors: ${pageErrors.join(' | ')}`);
  await context.close();
}

// OAuth callback: successful PKCE must land on root Workspace, never on the historical GitHub Pages prefix.
{
  const context=await newContext('member');const page=await context.newPage();
  const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
  await page.goto(base+'/auth/callback/?code=qa&next=%2Fworkspace%2F',{waitUntil:'domcontentloaded'});
  try{await page.waitForURL(url=>new URL(url).pathname==='/workspace/',{timeout:5000});}catch{errors.push(`/auth/callback/: successful login did not return to /workspace/; actual=${page.url()}`)}
  const callbackPath=new URL(page.url()).pathname;
  expect(callbackPath==='/workspace/',`/auth/callback/: final path is ${callbackPath}`);
  expect(!callbackPath.includes('/degradation_club/'),'/auth/callback/: legacy GitHub Pages prefix returned after OAuth');
  expect(!pageErrors.length,`/auth/callback/ produced page errors: ${pageErrors.join(' | ')}`);
  await context.close();
}

// Authenticated Workspace root views remain controller-owned while public header provides site exit.
{
  const context=await newContext('member');const page=await context.newPage();
  const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
  await page.goto(base+'/workspace/',{waitUntil:'domcontentloaded'});
  await waitHeader(page,'/workspace/ member');
  try{await page.locator('[data-workspace-sidebar]').waitFor({state:'visible',timeout:4000});}catch{errors.push('/workspace/: authenticated sidebar did not become visible')}
  expect(await page.locator('[data-member-tool]:visible').count()>=2,'/workspace/: active member cannot see Board/Artifacts navigation');
  try{
    await page.locator('[data-route="activity"]').first().click({timeout:4000});
    await page.waitForFunction(()=>document.querySelector('#topTitle')?.textContent?.trim()==='MY ACTIVITY',null,{timeout:4000});
    expect((await page.locator('#appView').innerText()).includes('Моя активность'),'Workspace Activity did not render');
    await page.locator('[data-route="club"]').first().click({timeout:4000});
    await page.waitForFunction(()=>document.querySelector('#topTitle')?.textContent?.trim()==='MY CLUB',null,{timeout:4000});
    expect((await page.locator('#appView').innerText()).includes('Мой клуб'),'Workspace My Club did not render');
  }catch(error){errors.push(`/workspace/: controller route transition failed: ${error.message}`)}
  expect(!pageErrors.length,`/workspace/ authenticated navigation produced page errors: ${pageErrors.join(' | ')}`);
  await context.close();
}

// Workspace Board must restore the production Board overlays, not merely embed the base card renderer.
{
  const context=await newContext('member');const page=await context.newPage();const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
  await page.goto(base+'/workspace/board/',{waitUntil:'domcontentloaded'});
  await waitHeader(page,'/workspace/board/');
  try{await page.locator('.dc-spatial-viewport').waitFor({state:'visible',timeout:5000});}catch{errors.push(`/workspace/board/: spatial viewport did not initialize; errors=${pageErrors.join(' | ')||'none'}`)}
  expect(await page.locator('[data-workspace-sidebar]:visible').count()===1,'/workspace/board/: Workspace sidebar missing');
  expect(await page.locator('#boardFilters .dc-board-filter').count()>=5,'/workspace/board/: Board filters did not initialize');
  expect(await page.locator('.dc-spatial-controls').count()===1,'/workspace/board/: pan/zoom controls missing');
  await page.evaluate(()=>{
    const host=document.getElementById('boardHost');
    const card=document.createElement('article');card.className='dc-notice';card.dataset.artifact='qa-artifact';card.innerHTML='<button type="button" data-close-artifact>QA</button>';host?.appendChild(card);
  });
  try{await page.locator('[data-artifact="qa-artifact"].is-own-movable').waitFor({state:'attached',timeout:2500});}catch{errors.push('/workspace/board/: activated member artifact did not become movable')}
  const fakeStyle=await page.locator('[data-artifact="qa-artifact"]').evaluate(el=>({left:el.style.left,top:el.style.top}));
  expect(Boolean(fakeStyle.left&&fakeStyle.top),'/workspace/board/: spatial position was not assigned to member artifact');
  expect(!pageErrors.length,`/workspace/board/ produced page errors: ${pageErrors.join(' | ')}`);
  await context.close();
}

// Join member-return: canonical routes, equal CTA geometry and no unexplained dark slab below header.
{
  const context=await newContext('member');const page=await context.newPage();const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
  await page.goto(base+'/join/',{waitUntil:'domcontentloaded'});
  await waitHeader(page,'/join/ member');
  try{await page.locator('#dc9MemberReturn').waitFor({state:'visible',timeout:5000});}catch{errors.push(`/join/: member-return did not render; errors=${pageErrors.join(' | ')||'none'}`)}
  const hrefs=await page.locator('#dc9MemberReturn a').evaluateAll(nodes=>nodes.map(a=>a.getAttribute('href')));
  expect(hrefs.includes('/workspace/board/'),`/join/: Community CTA is not /workspace/board/ (${hrefs.join(', ')})`);
  expect(hrefs.includes('/join/result/'),'/join/: DC-9 card CTA missing');
  expect(hrefs.includes('/workspace/'),'/join/: Account CTA is not /workspace/');
  expect(!hrefs.includes('/account/'),'/join/: dead /account/ CTA survived');
  const buttons=await page.locator('#dc9MemberReturn .dc9-button').evaluateAll(nodes=>nodes.map(el=>({display:getComputedStyle(el).display,height:el.getBoundingClientRect().height})));
  expect(buttons.length>=2&&buttons.every(x=>x.display==='inline-flex'&&x.height>=48),`/join/: member CTA geometry drifted ${JSON.stringify(buttons)}`);
  const darkBlocks=await page.evaluate(()=>{
    const header=document.querySelector('.dc-global-header');if(!header)return[];const bottom=header.getBoundingClientRect().bottom;
    return [...document.querySelectorAll('body *')].map(el=>{const r=el.getBoundingClientRect();const bg=getComputedStyle(el).backgroundColor;return{tag:el.tagName,cls:String(el.className||''),top:r.top,height:r.height,width:r.width,bg}}).filter(x=>x.width>innerWidth*.8&&x.height>30&&x.top>=bottom-2&&x.top<bottom+220&&(x.bg==='rgb(17, 17, 17)'||x.bg==='rgb(0, 0, 0)'));
  });
  expect(darkBlocks.length===0,`/join/: unexplained dark slab below header: ${JSON.stringify(darkBlocks.slice(0,3))}`);
  expect(!pageErrors.length,`/join/ member-return produced page errors: ${pageErrors.join(' | ')}`);
  await context.close();
}

// Owner Admin keeps Workspace geometry under the same public header.
{
  const context=await newContext('owner');await context.route('**/workspace/admin/owner-admin-access-v1.js',route=>route.fulfill({status:200,contentType:'text/javascript',body:'document.documentElement.dataset.dcOwnerAdmin="1";'}));
  const page=await context.newPage();await page.goto(base+'/workspace/admin/',{waitUntil:'domcontentloaded'});await waitHeader(page,'/workspace/admin/');await page.waitForTimeout(200);
  const layout=await page.locator('.dcw-app').evaluate(el=>({display:getComputedStyle(el).display,columns:getComputedStyle(el).gridTemplateColumns}));
  expect(layout.display==='grid',`/workspace/admin/: Workspace app display is ${layout.display}`);
  expect(layout.columns&&layout.columns!=='none',`/workspace/admin/: grid columns missing (${layout.columns})`);
  expect(await page.locator('.dca-tools').evaluate(el=>getComputedStyle(el).display)==='grid','/workspace/admin/: tool cards are not a grid');
  await context.close();
}

await browser.close();await new Promise(resolve=>server.close(resolve));
if(errors.filter(Boolean).length){console.error('BROWSER SHELL SMOKE BLOCKED');for(const error of errors.filter(Boolean))console.error(`- ${error}`);process.exit(1);}
console.log('Browser shell smoke PASS: public shell + OAuth recovery + guest boundary + Workspace + spatial Board + Join member return + Admin');
