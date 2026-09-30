import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const root=path.join(process.cwd(),'_site');
const failures=[];
const expect=(ok,msg)=>{if(!ok)failures.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};

function qaHtml(){
  return [
    '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
    '<link rel="stylesheet" href="/workspace/admin/community-ops/community-ops-v1.css"></head><body>',
    '<form id="profileSearchForm"><input id="profileSearch"><button type="submit">PROFILE</button></form>',
    '<div id="profileResults"></div><div id="slotPanel"></div>',
    '<form id="artifactSearchForm"><input id="artifactSearch"><button type="submit">ARTIFACT</button></form>',
    '<div id="artifactResults"></div><div id="artifactPanel"></div>',
    '<script>',
    "document.documentElement.dataset.dcOwnerAdmin='1';",
    'window.confirm=()=>true;',
    "const ids={g:'11111111-1111-4111-8111-111111111111',n:'22222222-2222-4222-8222-222222222222',m:'33333333-3333-4333-8333-333333333333',a1:'44444444-4444-4444-8444-444444444444',a2:'55555555-5555-4555-8555-555555555555',idea:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'};",
    "const qa=globalThis.__QA_STATE__={grantCalls:0,inviteCalls:0,removeCalls:0,closeCalls:0,granted:1,profiles:[",
    "{profile_id:ids.g,profile_ref:'USER-11111111',display_name:'Gabil Tagiev',nickname:'gabil',membership_status:'active'},",
    "{profile_id:ids.n,profile_ref:'USER-22222222',display_name:'Alex Same',nickname:'alex-one',membership_status:'active'},",
    "{profile_id:ids.m,profile_ref:'USER-33333333',display_name:'Maria QA',nickname:'maria',membership_status:'active'},",
    "{profile_id:ids.a1,profile_ref:'USER-44444444',display_name:'Alex Same',nickname:'alex-two',membership_status:'active'},",
    "{profile_id:ids.a2,profile_ref:'USER-55555555',display_name:'Alex Same',nickname:'alex-three',membership_status:'active'}],",
    "artifacts:[{id:ids.idea,author_profile_id:ids.g,artifact_type:'idea',title:'QA Idea Alpha',body:'Idea body',status:'active',visibility:'circle',created_at:'2026-09-30T09:00:00Z',published_at:'2026-09-30T10:00:00Z',closed_at:null}],",
    "participants:[{profile_id:ids.n,display_name:'Alex Same',nickname:'alex-one',participation_state:'INVITED'}]};",
    'class Query{constructor(t){this.t=t;this.f=[];this.one=false;this.n=null}select(){return this}in(k,v){this.f.push(r=>v.includes(r[k]));return this}eq(k,v){this.f.push(r=>r[k]===v);return this}ilike(k,v){const n=String(v).replaceAll("%","").toLowerCase();this.f.push(r=>String(r[k]||"").toLowerCase().includes(n));return this}order(){return this}limit(n){this.n=n;return this}maybeSingle(){this.one=true;return this.run()}async run(){let r=this.t==="dc_artifacts"?qa.artifacts.slice():qa.profiles.map(p=>({profile_id:p.profile_id,display_name:p.display_name,nickname:p.nickname}));for(const f of this.f)r=r.filter(f);if(this.n!=null)r=r.slice(0,this.n);return{data:this.one?(r[0]||null):r,error:null}}then(a,b){return this.run().then(a,b)}}',
    'window.DEMENTOR_SUPABASE_CLIENT={from:t=>new Query(t),rpc:async(n,a={})=>{',
    "if(n==='dc_admin_profile_search_v1'){const q=String(a.p_query||'').toLowerCase();return{data:qa.profiles.filter(p=>(p.display_name+' '+p.nickname+' '+p.profile_ref).toLowerCase().includes(q)),error:null}}",
    "if(n==='dc_admin_artifact_slot_status_v1'){const p=qa.profiles.find(x=>x.profile_id===a.p_profile_id);return{data:{profile:p,artifact_slots_granted:qa.granted,artifact_slots_consuming:1,artifact_slots_available:Math.max(qa.granted-1,0),published_artifact_count:2,grant_history:[]},error:null}}",
    "if(n==='dc_admin_grant_artifact_slots_v1'){qa.grantCalls++;await new Promise(r=>setTimeout(r,80));qa.granted+=Number(a.p_amount||0);return{data:{total_granted:qa.granted},error:null}}",
    "if(n==='dc_artifact_participants_read_v1')return{data:qa.participants,error:null};",
    "if(n==='dc_artifact_invite_candidates_v1')return{data:[{...qa.profiles.find(p=>p.profile_id===ids.m),current_state:null}],error:null};",
    "if(n==='dc_artifact_invite_v1'){qa.inviteCalls++;const p=qa.profiles.find(x=>x.profile_id===a.p_profile_id);qa.participants=qa.participants.filter(x=>x.profile_id!==a.p_profile_id);qa.participants.push({profile_id:p.profile_id,display_name:p.display_name,nickname:p.nickname,participation_state:'INVITED'});return{data:'invite',error:null}}",
    "if(n==='dc_artifact_remove_participant_v1'){qa.removeCalls++;qa.participants=qa.participants.filter(x=>x.profile_id!==a.p_profile_id);return{data:'remove',error:null}}",
    "if(n==='dc_close_artifact_v1'){qa.closeCalls++;qa.artifacts[0].status='archived';return{data:{status:'archived'},error:null}}",
    "return{data:null,error:{message:'UNEXPECTED_RPC '+n}}}};",
    '</script><script type="module" src="/workspace/admin/community-ops/community-ops-v1.js"></script></body></html>'
  ].join('');
}

const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url||'/','http://local').pathname;
  if(pathname==='/qa-community-ops.html'){res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end(qaHtml());return}
  const file=path.join(root,pathname.replace(/^\/+/,''));
  if(file.startsWith(root)&&fs.existsSync(file)&&fs.statSync(file).isFile()){
    res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});
    res.end(fs.readFileSync(file));return;
  }
  res.writeHead(404);res.end('not found');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true});

async function open(width=1280,height=900){
  const page=await browser.newPage({viewport:{width,height}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/qa-community-ops.html',{waitUntil:'domcontentloaded'});
  await page.locator('#profileResults .dco-state').waitFor({state:'attached',timeout:3000});
  return{page,errors};
}

try{
  const run=await open();
  const page=run.page;

  await page.locator('#profileSearch').fill('Alex');
  await page.locator('#profileSearchForm button').click();
  await page.waitForFunction(()=>document.querySelectorAll('#profileResults [data-profile-id]').length===3);
  const ambiguity=await page.locator('#profileResults').innerText();
  expect(ambiguity.includes('USER-22222222')&&ambiguity.includes('USER-44444444')&&ambiguity.includes('USER-55555555'),'same-name safe refs missing');

  await page.locator('#profileSearch').fill('Gabil');
  await page.locator('#profileSearchForm button').click();
  await page.locator('#profileResults [data-profile-id]').first().click();
  await page.locator('#slotGrantForm').waitFor({state:'attached'});
  expect((await page.locator('.dco-metrics').innerText()).includes('AVAILABLE'),'slot snapshot missing');

  await page.locator('#slotAmount').fill('3');
  await page.locator('#slotReason').fill('QA capacity');
  await page.locator('#slotSource').fill('qa/community-ops');
  await page.evaluate(()=>{
    const f=document.getElementById('slotGrantForm');
    f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
    f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  });
  await page.waitForFunction(()=>globalThis.__QA_STATE__.grantCalls===1&&globalThis.__QA_STATE__.granted===4);
  expect((await page.evaluate(()=>globalThis.__QA_STATE__.grantCalls))===1,'duplicate slot grant submitted');
  await page.waitForFunction(()=>document.querySelector('.dco-metrics')?.textContent.includes('4'));

  await page.locator('#artifactSearch').fill('Idea');
  await page.locator('#artifactSearchForm button').click();
  await page.locator('#artifactResults [data-artifact-id]').first().click();
  await page.locator('[data-artifact-status]').waitFor({state:'attached'});
  expect(await page.locator('a[href^="/community/artifact/"]').count()===1,'canonical Artifact detail handoff missing');

  await page.locator('#opsInviteSearch').fill('Maria');
  await page.locator('[data-invite-search]').click();
  await page.locator('[data-invite-profile]').click();
  await page.waitForFunction(()=>globalThis.__QA_STATE__.inviteCalls===1);
  await page.waitForFunction(()=>document.querySelector('#artifactPanel')?.textContent.includes('Maria QA'));

  const maria=page.locator('.dco-person').filter({hasText:'Maria QA'});
  await maria.locator('[data-remove-profile]').click();
  await page.waitForFunction(()=>globalThis.__QA_STATE__.removeCalls===1);
  expect(!(await page.locator('#artifactPanel').innerText()).includes('Maria QA'),'removed participant remained');

  await page.locator('[data-close-artifact]').click();
  await page.waitForFunction(()=>globalThis.__QA_STATE__.closeCalls===1&&globalThis.__QA_STATE__.artifacts[0].status==='archived');
  expect((await page.locator('#artifactPanel').innerText()).includes('HISTORY / НЕ АКТИВЕН'),'archive post-state missing');

  expect(!run.errors.length,'desktop page errors: '+run.errors.join(' | '));
  await page.close();

  for(const width of [390,360]){
    const mobile=await open(width,844);
    const size=await mobile.page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:window.innerWidth}));
    expect(size.scroll<=size.inner+1,width+'px horizontal overflow: '+size.scroll+' > '+size.inner);
    expect(!mobile.errors.length,width+'px page errors: '+mobile.errors.join(' | '));
    await mobile.page.close();
  }
}finally{
  await browser.close();server.close();
}

if(failures.length){
  console.error('Owner Admin Community Ops browser acceptance failed ('+failures.length+')');
  failures.forEach(f=>console.error('- '+f));
  process.exit(1);
}
console.log('Owner Admin Community Ops browser acceptance PASS: safe ambiguity, slot grant dedupe+reread, Idea invite/remove, canonical archive, desktop/390/360.');
