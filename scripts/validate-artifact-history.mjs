import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const errors=[];
const expect=(ok,msg)=>{if(!ok)errors.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg'};

function resolveFile(urlPath){
  let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);
  if(pathname.endsWith('/'))pathname+='index.html';
  const full=path.resolve(artifact,pathname.replace(/^\/+/,''));
  if(!full.startsWith(path.resolve(artifact)+path.sep)&&full!==path.resolve(artifact))return null;
  return full;
}

const server=http.createServer((req,res)=>{
  const file=resolveFile(req.url||'/');
  if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('Not found');return}
  res.statusCode=200;res.setHeader('content-type',mime[path.extname(file).toLowerCase()]||'application/octet-stream');res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});

const supabaseStub=()=>`
  const user={id:'qa-artifacts-user',email:'qa-artifacts@dementor.invalid',user_metadata:{full_name:'QA Artifacts'}};
  const session={user};const active={status:'active',valid_from:null,valid_to:null};
  const rows={
    profiles:[{id:user.id,email:user.email,full_name:'QA Artifacts',avatar_url:null}],
    dc_role_assignments:[],
    dc_entity_assignments:[],
    dc_system_memberships:[{profile_id:user.id,...active}],
    dc_artifacts:[
      {id:'qa-active',author_profile_id:user.id,artifact_type:'notice',title:'Куда двигаемся - народ?',body:'Активная запись.',external_url:null,status:'active',visibility:'community',created_at:'2026-09-04T09:00:00Z',published_at:'2026-09-04T10:00:00Z',closed_at:null},
      {id:'qa-archived',author_profile_id:user.id,artifact_type:'notice',title:'гусь',body:'Архивная запись.',external_url:null,status:'archived',visibility:'community',created_at:'2026-09-03T09:00:00Z',published_at:'2026-09-03T10:00:00Z',closed_at:'2026-09-04T08:00:00Z'}
    ]
  };
  const query=t=>{
    let data=[...(rows[t]||[])];
    const c={select(){return c},eq(k,v){data=data.filter(r=>r?.[k]===v);return c},neq(){return c},in(k,values){data=data.filter(r=>values.includes(r?.[k]));return c},is(){return c},order(){return c},limit(n){data=data.slice(0,n);return c},range(){return c},update(){return c},insert(){return c},upsert(){return c},delete(){return c},maybeSingle(){return Promise.resolve({data:data[0]||null,error:null})},single(){return Promise.resolve({data:data[0]||null,error:null})},then(resolve,reject){return Promise.resolve({data,error:null}).then(resolve,reject)}};return c
  };
  export function createClient(){return {auth:{getSession:async()=>({data:{session},error:null}),getUser:async()=>({data:{user},error:null}),signInWithOAuth:async()=>({data:{},error:null}),signOut:async()=>({error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:query,rpc:async n=>({data:n==='dc_member_entry_status_v1'?{membership_active:true,community_activation_state:'MEMBER_ACTIVATED',artifact_slots_available:0,published_artifact_count:1}:null,error:null}),storage:{from:()=>({})},functions:{invoke:async()=>({data:{},error:null})}}}
`;

const context=await browser.newContext({viewport:{width:1280,height:900}});
await context.route('https://cdn.jsdelivr.net/**',route=>route.request().url().includes('@supabase/supabase-js')?route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',body:supabaseStub()}):route.abort());
const page=await context.newPage();const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
await page.goto(base+'/workspace/artifacts/',{waitUntil:'domcontentloaded'});
try{
  await page.locator('[data-workspace-sidebar]').waitFor({state:'visible',timeout:5000});
  await page.locator('[data-artifact-history]').first().waitFor({state:'visible',timeout:5000});
  expect(await page.locator('.dc-global-header').count()===0,'My Artifacts: public header leaked into private Workspace');
  expect(await page.locator('[data-artifact-history]').count()===2,'My Artifacts: all-history projection must show active + archived records');

  await page.getByRole('button',{name:'АРХИВ'}).click();
  expect(await page.locator('[data-artifact-history]').count()===1,'My Artifacts: archive filter did not isolate archived history');
  const archived=page.locator('[data-artifact-history="qa-archived"]');
  expect(await archived.count()===1,'My Artifacts: archived fixture disappeared');
  expect((await archived.innerText()).includes('гусь'),'My Artifacts: archived title missing');
  expect((await archived.getAttribute('data-artifact-status'))==='archived','My Artifacts: archived status drifted');

  await page.getByRole('button',{name:'АКТИВНЫЕ'}).click();
  expect(await page.locator('[data-artifact-history]').count()===1,'My Artifacts: active filter did not isolate active history');
  const activeCard=page.locator('[data-artifact-history="qa-active"]');
  const boardLink=activeCard.getByRole('link',{name:'НА ДОСКУ →'});
  expect(await boardLink.count()===1,'My Artifacts: active Artifact lost Board continuation');
  expect((await boardLink.getAttribute('href'))==='/workspace/board/','My Artifacts: active Artifact still points to compatibility Board route');
}catch(error){errors.push(`My Artifacts browser flow failed: ${error.message}`)}
expect(!pageErrors.length,`My Artifacts page errors: ${pageErrors.join(' | ')}`);

await context.close();await browser.close();await new Promise(resolve=>server.close(resolve));
if(errors.length){console.error('MY ARTIFACTS REGRESSION BLOCKED');for(const error of errors)console.error(`- ${error}`);process.exit(1)}
console.log('My Artifacts regression PASS: canonical Workspace shell + active/archive history filters + archived record preservation + canonical Board route');
