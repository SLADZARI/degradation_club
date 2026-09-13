import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {chromium,webkit} from 'playwright';

const root=path.join(process.cwd(),'_site');
const ART='11111111-1111-4111-8111-111111111111';
const USER='guest-1';
const failures=[];
const expect=(ok,msg)=>{if(!ok)failures.push(msg)};

const artifact={
  id:ART,author_profile_id:USER,artifact_type:'announcement',title:'Own Artifact',body:'Production full-stack own movable Artifact for Share hit-target acceptance.',external_url:null,status:'active',starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-13T00:00:00.000Z',closed_at:null,created_at:'2026-09-13T00:00:00.000Z',visibility:'community',board_hidden_at:null
};
const profile={profile_id:USER,display_name:'Member',nickname:'member',avatar_url:null};
const runtimeStub=`
export const DC_ARTIFACT_BUCKET='dc-artifacts';
export const route=p=>p;
export const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const formatDate=v=>v?new Date(v).toLocaleDateString('ru-RU'):'';
export const errorMessage=e=>String(e?.message||e||'ERROR');
export const safeFileName=v=>String(v||'file').replace(/[^a-z0-9._-]+/gi,'-');
export const mediaType=()=> 'image';
export async function signedMediaUrl(){return null}
export async function loginWithGoogle(){}
const session={user:{id:'${USER}',email:'member@example.test'}};
const artifact=${JSON.stringify(artifact)};
const profile=${JSON.stringify(profile)};
function rowsFor(table,state){
  if(table==='dc_artifacts'){
    if(state.eq.status==='draft')return [];
    return [artifact];
  }
  if(table==='profiles')return [profile];
  if(table==='dc_artifact_board_positions')return [{artifact_id:artifact.id,x:6000,y:4000,rotation:.35,size_class:'S',position_version:1}];
  return [];
}
function query(table){
  const state={eq:{}};
  const api={
    select(){return api},eq(k,v){state.eq[k]=v;return api},in(){return api},is(){return api},order(){return api},limit(){return api},
    update(){return api},insert(){return api},delete(){return api},
    maybeSingle:async()=>({data:rowsFor(table,state)[0]||null,error:null}),
    single:async()=>({data:rowsFor(table,state)[0]||null,error:null}),
    then(resolve,reject){return Promise.resolve({data:rowsFor(table,state),error:null}).then(resolve,reject)}
  };return api;
}
const client={
  auth:{getSession:async()=>({data:{session}})},
  from:table=>query(table),
  rpc:async(name,args)=>{
    if(name==='dc_board_promotion_state_read_v1')return {data:[],error:null};
    if(name==='dc_guest_board_read_v1')return {data:[],error:null};
    if(name==='dc_normalize_artifact_lifecycle_v1')return {data:null,error:null};
    return {data:null,error:null};
  },
  storage:{from:()=>({upload:async()=>({data:null,error:null}),remove:async()=>({data:null,error:null})})}
};
export const getClient=()=>client;
export async function currentSession(){return session}
export async function getEntryStatus(){return {membership_active:true,artifact_slots_available:0,artifact_slots_consuming:1,published_artifact_count:1,sphere_gate_complete:true,sphere_count:9,community_activation_state:'MEMBER_ACTIVATED'}}
`;

const mime={'.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.html':'text/html; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
const server=http.createServer((req,res)=>{
  const u=new URL(req.url,'http://local');
  if(u.pathname==='/community-runtime-v1.js'){res.setHeader('content-type','text/javascript; charset=utf-8');res.end(runtimeStub);return}
  const requestPath=u.pathname==='/'?'/workspace/board/index.html':u.pathname.endsWith('/')?`${u.pathname}index.html`:u.pathname;
  const file=path.resolve(root,requestPath.replace(/^[/]+/,''));
  if(!file.startsWith(root)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('not found');return}
  res.setHeader('content-type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;

for(const [engine,browserType] of [['chromium',chromium],['webkit',webkit]]){
  const browser=await browserType.launch({headless:true});
  try{
    for(const viewport of [{width:1280,height:800},{width:390,height:844}]){
      const mobile=viewport.width<500;
      const context=await browser.newContext({viewport,hasTouch:mobile,isMobile:mobile});
      const page=await context.newPage();
      await page.addInitScript(()=>{
        globalThis.__TRACE=[];globalThis.__DC_COPIED='';
        Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{globalThis.__DC_COPIED=value}}});
        document.execCommand=()=>true;
        for(const type of ['pointerdown','pointerup','click'])document.addEventListener(type,event=>{globalThis.__TRACE.push({type,target:event.target?.tagName||'',className:String(event.target?.className||''),share:!!event.target?.closest?.('[data-board-share]'),x:event.clientX,y:event.clientY})},true);
      });
      await page.goto(`${base}/workspace/board/`);
      const card=page.locator(`.dc-notice[data-artifact="${ART}"]`);
      await card.waitFor({state:'visible'});
      await page.waitForFunction(id=>document.querySelector(`.dc-notice[data-artifact="${id}"]`)?.classList.contains('is-own-movable'),ART);
      const share=card.locator(':scope > [data-board-share]');
      await share.waitFor({state:'visible'});

      const runtime=await page.evaluate(()=>[...document.scripts].map(s=>s.src).find(src=>src.includes('board-own-drag-livefix'))||'');
      expect(runtime.endsWith('/community/board/board-own-drag-livefix-v2-2.js'),`${engine}/${viewport.width}: production Board did not load v2-2 runtime: ${runtime}`);
      const scripts=await page.evaluate(()=>[...document.scripts].map(s=>s.src).filter(Boolean));
      for(const owner of ['board-entry-v2.js','board-spatial-v1.js','board-layout-v2.js','board-fullscreen-v2-1.js','board-deeplink-auth-return-v1.js','board-own-drag-livefix-v2-2.js'])expect(scripts.some(src=>src.endsWith(`/community/board/${owner}`)),`${engine}/${viewport.width}: missing production owner ${owner}`);

      const box=await share.boundingBox();
      expect(!!box,`${engine}/${viewport.width}: Share has no bounding box`);
      if(!box){await context.close();continue}
      const point={x:box.x+box.width/2,y:box.y+box.height/2};
      const hit=await page.evaluate(({x,y})=>{const el=document.elementFromPoint(x,y);return {tag:el?.tagName||'',className:String(el?.className||''),isShare:!!el?.closest?.('[data-board-share]')}},point);
      expect(hit.isShare,`${engine}/${viewport.width}: FULL STACK center hit target is ${hit.tag}.${hit.className}, not Share`);

      if(mobile)await page.touchscreen.tap(point.x,point.y);else await page.mouse.click(point.x,point.y);
      await page.waitForTimeout(250);
      const state=await page.evaluate(()=>({copied:globalThis.__DC_COPIED||'',overlayHidden:document.querySelector('.dc-artifact-overlay')?.hidden??true,dragging:document.documentElement.dataset.boardDragging||'',shareText:document.querySelector('[data-board-share]')?.textContent||'',trace:globalThis.__TRACE||[]}));
      expect(Boolean(state.copied),`${engine}/${viewport.width}: FULL STACK Share did not copy; trace=${JSON.stringify(state.trace)}`);
      expect(state.overlayHidden,`${engine}/${viewport.width}: FULL STACK Share opened Artifact; hit=${JSON.stringify(hit)} trace=${JSON.stringify(state.trace)}`);
      expect(!state.dragging,`${engine}/${viewport.width}: FULL STACK Share started drag; trace=${JSON.stringify(state.trace)}`);
      expect(state.shareText.includes('СКОПИРОВАНО'),`${engine}/${viewport.width}: FULL STACK copy feedback missing`);
      await context.close();
    }
  }finally{await browser.close()}
}
await new Promise(resolve=>server.close(resolve));
if(failures.length){console.error('BOARD FULL-STACK SHARE BLOCKED');for(const item of failures)console.error(`- ${item}`);process.exit(1)}
console.log('BOARD FULL-STACK SHARE PASS');
console.log('✓ real production Board HTML and runtime owner list loaded');
console.log('✓ production runtime reference is board-own-drag-livefix-v2-2.js');
console.log('✓ elementFromPoint resolves visible Share and click/tap copies without fullscreen or drag');
