import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {webkit} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const errors=[];
const expect=(ok,msg)=>{if(!ok)errors.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png'};

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
const browser=await webkit.launch({headless:true});

const supabaseStub=()=>`
  const mode=globalThis.__QA_AUTH_MODE__||'guest';
  const authenticated=mode!=='guest';
  const member=mode==='member';
  const user={id:'qa-webkit-user',email:'qa-webkit@dementor.invalid',user_metadata:{full_name:'QA WebKit'}};
  const session=authenticated?{user}:null;
  const query=t=>{
    let rows=[];
    const c={select(){return c},eq(){return c},neq(){return c},in(){return c},is(){return c},order(){return c},limit(){return c},range(){return c},update(){return c},insert(){return c},upsert(){return c},delete(){return c},maybeSingle(){return Promise.resolve({data:t==='dc_system_memberships'&&member?{status:'active',valid_from:null,valid_to:null}:null,error:null})},single(){return Promise.resolve({data:null,error:null})},then(resolve,reject){return Promise.resolve({data:rows,error:null}).then(resolve,reject)}};return c
  };
  export function createClient(){return {auth:{getSession:async()=>({data:{session},error:null}),getUser:async()=>({data:{user:authenticated?user:null},error:null}),exchangeCodeForSession:async code=>({data:{session:{user},code},error:null}),signInWithOAuth:async payload=>{globalThis.__QA_OAUTH__=payload;return {data:{},error:null}},signOut:async()=>({error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:query,rpc:async n=>({data:n==='dc_member_entry_status_v1'?{membership_active:member,community_activation_state:member?'MEMBER_ACTIVATED':null,artifact_slots_available:0,published_artifact_count:member?1:0}:null,error:null}),storage:{from:()=>({})},functions:{invoke:async()=>({data:{},error:null})}}}
`;

async function context(mode='guest'){
  const c=await browser.newContext({viewport:{width:390,height:844}});
  await c.addInitScript(value=>{globalThis.__QA_AUTH_MODE__=value},mode);
  await c.route('https://cdn.jsdelivr.net/**',route=>route.request().url().includes('@supabase/supabase-js')?route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',body:supabaseStub()}):route.abort());
  return c;
}

// WebKit proxy for the reported Safari-only public login hang.
{
  const c=await context('guest'),p=await c.newPage(),pageErrors=[];p.on('pageerror',e=>pageErrors.push(e.message));
  await p.goto(base+'/about/',{waitUntil:'domcontentloaded'});
  try{await p.locator('[data-global-login]').waitFor({state:'visible',timeout:5000});await p.locator('[data-global-login]').click();await p.waitForFunction(()=>Boolean(window.__QA_OAUTH__),{timeout:4000});const oauth=await p.evaluate(()=>window.__QA_OAUTH__);const redirect=new URL(oauth?.options?.redirectTo);expect(oauth?.provider==='google','WebKit public login: provider is not Google');expect(redirect.pathname==='/auth/callback/','WebKit public login: callback route drifted');expect(redirect.searchParams.get('next')==='/workspace/','WebKit public login: callback next is not Workspace')}catch(error){errors.push(`WebKit public login did not start cleanly: ${error.message}`)}
  expect(!pageErrors.length,`WebKit public login page errors: ${pageErrors.join(' | ')}`);await c.close();
}

// WebKit executes the same PKCE callback module and must leave the callback instead of hanging.
{
  const c=await context('member'),p=await c.newPage(),pageErrors=[];p.on('pageerror',e=>pageErrors.push(e.message));
  await p.goto(base+'/auth/callback/?code=qa-webkit&next=%2Fworkspace%2F',{waitUntil:'domcontentloaded'});
  try{await p.waitForURL(url=>new URL(url).pathname==='/workspace/board/',{timeout:7000})}catch{errors.push(`WebKit PKCE callback did not complete to ordinary Member Board; actual=${p.url()}`)}
  expect(!new URL(p.url()).pathname.includes('/degradation_club/'),'WebKit auth: legacy path prefix returned');expect(!pageErrors.length,`WebKit callback page errors: ${pageErrors.join(' | ')}`);await c.close();
}

// Authenticated identity on a public page must resolve without a Safari/WebKit-only stuck checking state.
{
  const c=await context('member'),p=await c.newPage(),pageErrors=[];p.on('pageerror',e=>pageErrors.push(e.message));
  await p.goto(base+'/about/',{waitUntil:'domcontentloaded'});
  try{await p.locator('[data-global-identity]').waitFor({state:'visible',timeout:5000})}catch{errors.push('WebKit authenticated public header stayed stuck instead of rendering identity')}
  expect((await p.locator('.dc-global-header').getAttribute('data-dc-header-auth').catch(()=>null))==='member','WebKit authenticated public header did not resolve member state');expect(!pageErrors.length,`WebKit authenticated header errors: ${pageErrors.join(' | ')}`);await c.close();
}

await browser.close();await new Promise(resolve=>server.close(resolve));
if(errors.length){console.error('WEBKIT AUTH REGRESSION BLOCKED');for(const error of errors)console.error(`- ${error}`);process.exit(1)}
console.log('WebKit auth regression PASS: public Google start + PKCE callback escape + authenticated identity state');
