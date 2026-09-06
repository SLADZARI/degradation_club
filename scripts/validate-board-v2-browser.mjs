import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium,webkit} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const failures=[];
const expect=(ok,msg)=>{if(!ok)failures.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg'};

function resolveFile(urlPath){
  let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);
  if(pathname.endsWith('/'))pathname+='index.html';
  const full=path.resolve(artifact,pathname.replace(/^\/+/,''));
  const root=path.resolve(artifact);
  if(full!==root&&!full.startsWith(root+path.sep))return null;
  return full;
}

const server=http.createServer((req,res)=>{
  const file=resolveFile(req.url||'/');
  if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){
    res.statusCode=404;res.end('Not found');return;
  }
  res.statusCode=200;res.setHeader('content-type',mime[path.extname(file).toLowerCase()]||'application/octet-stream');res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;

const supabaseStub=()=>`
  const mode=globalThis.__QA_BOARD_MODE__||'guest-incomplete';
  const authenticated=mode!=='unauthenticated';
  const member=['member-first','member','dementor','owner'].includes(mode);
  const role=mode==='owner'?'owner_admin':mode==='dementor'?'dementor':null;
  const activation=mode==='member-first'?'FIRST_ARTIFACT_REQUIRED':member?'MEMBER_ACTIVATED':null;
  const sphereCount=mode==='guest-incomplete'?3:authenticated?9:0;
  const user={id:'qa-board-user',email:'qa-board@dementor.invalid',user_metadata:{full_name:'QA Board'}};
  const session=authenticated?{user}:null;
  const entry={membership_active:member,community_activation_state:activation,sphere_count:sphereCount,sphere_gate_complete:sphereCount===9,artifact_slots_available:mode==='member-first'?1:0,published_artifact_count:member&&mode!=='member-first'?1:0};
  const application=mode==='applicant'?{id:'qa-app',status:'reviewing',created_at:'2026-09-06T10:00:00Z',reviewed_at:null}:null;
  const roles=role?[{profile_id:user.id,role,status:'active',valid_from:null,valid_to:null}]:[];
  const guestRows=[{artifact_id:'qa-artifact-1',artifact_type:'offer',title:'Нужен человек на съёмку',body:'Тестовая активная карточка клуба.',external_url:null,starts_at:null,expires_at:null,published_at:'2026-09-05T10:00:00Z',author_display_name:'QA Member',author_nickname:'qamember',author_avatar_url:null,reaction_count:2,guest_interest_count:1,my_guest_interest:false,board_x:1100,board_y:900,board_rotation:0,board_size_class:'M'}];
  const rowsFor=t=>t==='join_applications'?(application?[application]:[]):t==='dc_role_assignments'?roles:t==='profiles'?[{id:user.id,email:user.email,full_name:'QA Board',display_name:'QA Board',nickname:'qaboard',avatar_url:null}]:t==='dc_system_memberships'?(member?[{profile_id:user.id,status:'active',valid_from:null,valid_to:null}]:[]):[];
  const query=t=>{
    let rows=[...rowsFor(t)];
    const q={
      select(){return q},eq(k,v){rows=rows.filter(r=>r?.[k]===v);return q},neq(k,v){rows=rows.filter(r=>r?.[k]!==v);return q},in(k,v){rows=rows.filter(r=>v.includes(r?.[k]));return q},is(k,v){rows=rows.filter(r=>r?.[k]===v);return q},order(){return q},limit(n){rows=rows.slice(0,n);return q},range(a,b){rows=rows.slice(a,b+1);return q},insert(){return q},upsert(){return q},update(){return q},delete(){return q},
      maybeSingle(){return Promise.resolve({data:rows[0]||null,error:null})},single(){return Promise.resolve({data:rows[0]||null,error:null})},then(resolve,reject){return Promise.resolve({data:rows,error:null}).then(resolve,reject)}
    };return q;
  };
  const bucket={createSignedUrl:async()=>({data:{signedUrl:'https://example.invalid/qa.webp'},error:null}),upload:async()=>({data:{path:'qa'},error:null}),remove:async()=>({data:[],error:null})};
  export function createClient(){return {
    auth:{getSession:async()=>({data:{session},error:null}),getUser:async()=>({data:{user:authenticated?user:null},error:null}),signInWithOAuth:async()=>({data:{},error:null}),signOut:async()=>({error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},
    from:query,
    rpc:async(name,args)=>{
      if(name==='dc_member_entry_status_v1')return {data:entry,error:null};
      if(name==='dc_guest_board_read_v1')return {data:guestRows,error:null};
      if(name==='dc_guest_board_interest_toggle_v1')return {data:{active:true,count:2},error:null};
      if(name==='dc_get_my_active_or_draft_artifact_v1')return {data:null,error:null};
      return {data:null,error:null};
    },
    storage:{from:()=>bucket},functions:{invoke:async()=>({data:{},error:null})}
  }}
`;

async function openBoard(browser,mode,viewport){
  const ctx=await browser.newContext({viewport});
  await ctx.addInitScript(value=>{
    globalThis.__QA_BOARD_MODE__=value;
    try{
      localStorage.setItem('dc:board:tutorial:v2:qa-board-user:guest',JSON.stringify({done:true}));
      localStorage.setItem('dc:board:tutorial:v2:qa-board-user:member',JSON.stringify({done:true}));
      sessionStorage.setItem('dc_first_artifact_spotlight_dismissed_v1','1');
    }catch{}
  },mode);
  await ctx.route('https://cdn.jsdelivr.net/**',route=>route.request().url().includes('@supabase/supabase-js')?route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',body:supabaseStub()}):route.abort());
  const page=await ctx.newPage();
  const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
  await page.goto(base+'/workspace/board/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.documentElement.dataset.dcBoardUserState,{timeout:5000});
  await page.locator('.dc-spatial-viewport').waitFor({state:'visible',timeout:5000});
  return {ctx,page,pageErrors};
}

const stateCases=[
  ['guest-incomplete','AUTHENTICATED_GUEST_DC9_INCOMPLETE','guest-dc9-incomplete','GUEST / BOARD READ'],
  ['guest-complete','AUTHENTICATED_GUEST_DC9_COMPLETE','guest-dc9-complete','GUEST / BOARD READ'],
  ['applicant','APPLICANT','applicant','GUEST / BOARD READ'],
  ['member-first','MEMBER_NOT_ACTIVATED','member','MEMBER'],
  ['member','MEMBER_ACTIVATED','member','MEMBER'],
  ['dementor','DEMENTOR','member','MEMBER'],
  ['owner','OWNER_ADMIN','member','MEMBER']
];

for(const engine of [{name:'chromium',launch:()=>chromium.launch({headless:true})},{name:'webkit',launch:()=>webkit.launch({headless:true})}]){
  const browser=await engine.launch();
  for(const [mode,key,personalState,statusPrefix] of stateCases){
    const {ctx,page,pageErrors}=await openBoard(browser,mode,{width:1440,height:900});
    const actual=await page.evaluate(()=>document.documentElement.dataset.dcBoardUserState);
    expect(actual===key,`${engine.name}/${mode}: state ${actual} != ${key}`);
    await page.locator(`[data-personal-state="${personalState}"]`).waitFor({state:'visible',timeout:3000}).catch(()=>failures.push(`${engine.name}/${mode}: personal card ${personalState} missing`));
    const status=(await page.locator('#boardStatus').textContent()||'').trim();
    expect(status.startsWith(statusPrefix),`${engine.name}/${mode}: board status drifted: ${status}`);
    if(mode.startsWith('guest')||mode==='applicant'){
      expect(await page.locator('[data-guest-interest]').count()===1,`${engine.name}/${mode}: Guest interest action missing`);
      expect(await page.locator('[data-slot]').count()===0,`${engine.name}/${mode}: Guest leaked Artifact slot control`);
      expect(await page.locator('[data-response]').count()===0,`${engine.name}/${mode}: Guest leaked response control`);
    }
    expect(!pageErrors.length,`${engine.name}/${mode}: page errors: ${pageErrors.join(' | ')}`);
    await ctx.close();
  }
  await browser.close();
}

for(const viewport of [{width:390,height:844,label:'mobile-390'},{width:360,height:800,label:'mobile-360'}]){
  const browser=await chromium.launch({headless:true});
  for(const mode of ['guest-incomplete','member-first','member']){
    const {ctx,page,pageErrors}=await openBoard(browser,mode,viewport);
    const geo=await page.locator('.dc-spatial-viewport').evaluate(el=>({left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right,width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height,innerWidth,innerHeight,scrollWidth:document.documentElement.scrollWidth}));
    expect(geo.left>=-1&&geo.right<=geo.innerWidth+1,`${viewport.label}/${mode}: spatial viewport horizontal overflow ${JSON.stringify(geo)}`);
    expect(geo.height>=430,`${viewport.label}/${mode}: spatial viewport too short ${JSON.stringify(geo)}`);
    expect(geo.scrollWidth<=geo.innerWidth+1,`${viewport.label}/${mode}: document horizontal overflow ${JSON.stringify(geo)}`);
    const touch=await page.locator('.dc-spatial-viewport').evaluate(el=>getComputedStyle(el).touchAction);
    expect(touch==='none',`${viewport.label}/${mode}: Board touch-action must be none, got ${touch}`);
    expect(!pageErrors.length,`${viewport.label}/${mode}: page errors: ${pageErrors.join(' | ')}`);
    await ctx.close();
  }
  await browser.close();
}

server.close();
if(failures.length){console.error('BOARD V2 R10 BROWSER QA BLOCKED');for(const item of failures)console.error(`- ${item}`);process.exit(1)}
console.log('Board v2 R10 browser QA PASS: 7 states in Chromium+WebKit + mobile 360/390 responsive/touch geometry');
