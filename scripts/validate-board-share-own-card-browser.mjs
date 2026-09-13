import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {chromium,webkit} from 'playwright';

const root=path.join(process.cwd(),'_site');
const ART='11111111-1111-4111-8111-111111111111';
const USER='guest-1';
const failures=[];const expect=(ok,msg)=>{if(!ok)failures.push(msg)};

const artifact={id:ART,author_profile_id:USER,artifact_type:'announcement',title:'Own Artifact',body:'Production full-stack own movable Artifact for Share hit-target acceptance.',external_url:null,status:'active',starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-13T00:00:00.000Z',closed_at:null,created_at:'2026-09-13T00:00:00.000Z',visibility:'community',board_hidden_at:null};
const profile={profile_id:USER,display_name:'Member',full_name:'Member',nickname:'member',avatar_url:'/assets/brand/dementor-mark-black.svg'};
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
const session={user:{id:'${USER}',email:'member@example.test',user_metadata:{full_name:'Member',picture:'/assets/brand/dementor-mark-black.svg'}}};const artifact=${JSON.stringify(artifact)};const profile=${JSON.stringify(profile)};
function rowsFor(table,state){if(table==='dc_artifacts'){if(state.eq.status==='draft')return [];return [artifact]}if(table==='profiles'||table==='dc_member_public_profiles')return [profile];if(table==='dc_artifact_board_positions')return [{artifact_id:artifact.id,x:6000,y:4000,rotation:.35,size_class:'S',position_version:1}];return []}
function query(table){const state={eq:{}};const api={select(){return api},eq(k,v){state.eq[k]=v;return api},in(){return api},is(){return api},order(){return api},limit(){return api},update(){return api},insert(){return api},delete(){return api},maybeSingle:async()=>({data:rowsFor(table,state)[0]||null,error:null}),single:async()=>({data:rowsFor(table,state)[0]||null,error:null}),then(resolve,reject){return Promise.resolve({data:rowsFor(table,state),error:null}).then(resolve,reject)}};return api}
const client={auth:{getSession:async()=>({data:{session}})},from:table=>query(table),rpc:async(name)=>{if(name==='dc_board_promotion_state_read_v1'||name==='dc_guest_board_read_v1')return {data:[],error:null};return {data:null,error:null}},storage:{from:()=>({upload:async()=>({data:null,error:null}),remove:async()=>({data:null,error:null})})}};
export const getClient=()=>client;export async function currentSession(){return session}export async function getEntryStatus(){return {membership_active:true,artifact_slots_available:0,artifact_slots_consuming:1,published_artifact_count:1,sphere_gate_complete:true,sphere_count:9,community_activation_state:'MEMBER_ACTIVATED'}}
`;
const mime={'.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.html':'text/html; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
const server=http.createServer((req,res)=>{
  const u=new URL(req.url,'http://local');
  if(u.pathname==='/community-runtime-v1.js'){res.setHeader('content-type','text/javascript; charset=utf-8');res.end(runtimeStub);return}
  const requestPath=u.pathname==='/'?'/workspace/board/index.html':u.pathname.endsWith('/')?`${u.pathname}index.html`:u.pathname;
  const file=path.resolve(root,requestPath.replace(/^[/]+/,''));
  if(!file.startsWith(root)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
    const notFound=path.join(root,'404.html');
    res.statusCode=404;
    if(fs.existsSync(notFound)){res.setHeader('content-type','text/html; charset=utf-8');res.end(fs.readFileSync(notFound));return}
    res.end('not found');return;
  }
  res.setHeader('content-type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;

for(const [engine,browserType] of [['chromium',chromium],['webkit',webkit]]){
  const browser=await browserType.launch({headless:true});
  try{
    for(const viewport of [{width:1280,height:800},{width:390,height:844}]){
      const mobile=viewport.width<500;const context=await browser.newContext({viewport,hasTouch:mobile,isMobile:mobile});const page=await context.newPage();
      await page.addInitScript(()=>{
        globalThis.__TRACE=[];globalThis.__DC_COPIED='';
        Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{globalThis.__DC_COPIED=value}}});document.execCommand=()=>true;
        for(const type of ['pointerdown','pointerup','click'])document.addEventListener(type,event=>{globalThis.__TRACE.push({type,target:event.target?.tagName||'',className:String(event.target?.className||''),share:!!event.target?.closest?.('[data-board-share],[data-board-artifact-share]'),x:event.clientX,y:event.clientY})},true);
        const shellSession={user:{id:'guest-1',email:'member@example.test',user_metadata:{full_name:'Member',picture:'/assets/brand/dementor-mark-black.svg'}}};
        const shellRows={profiles:[{full_name:'Member',avatar_url:'/assets/brand/dementor-mark-black.svg'}],dc_role_assignments:[],dc_entity_assignments:[],dc_system_memberships:[{status:'active',valid_from:'2026-01-01T00:00:00.000Z',valid_to:null}]};
        const shellQuery=table=>{const rows=shellRows[table]||[];const api={select(){return api},eq(){return api},maybeSingle:async()=>({data:rows[0]||null,error:null}),then(resolve,reject){return Promise.resolve({data:rows,error:null}).then(resolve,reject)}};return api};
        globalThis.DEMENTOR_SUPABASE_CLIENT={auth:{getSession:async()=>({data:{session:shellSession}}),signOut:async()=>({error:null})},from:table=>shellQuery(table)};
      });
      await page.goto(`${base}/workspace/board/?debug=must-not-leak`);
      const card=page.locator(`.dc-notice[data-artifact="${ART}"]`);await card.waitFor({state:'visible'});await page.waitForFunction(id=>document.querySelector(`.dc-notice[data-artifact="${id}"]`)?.classList.contains('is-own-movable'),ART);
      expect(await card.locator(':scope > [data-board-share]').count()===0,`${engine}/${viewport.width}: legacy Artifact Share survived on closed Board card`);
      const runtime=await page.evaluate(()=>[...document.scripts].map(s=>s.src).find(src=>src.includes('board-own-drag-livefix'))||'');expect(runtime.endsWith('/community/board/board-own-drag-livefix-v2-2.js'),`${engine}/${viewport.width}: production Board did not load v2-2 runtime: ${runtime}`);
      const scripts=await page.evaluate(()=>[...document.scripts].map(s=>s.src).filter(Boolean));for(const owner of ['board-entry-v2.js','board-spatial-v1.js','board-layout-v2.js','board-fullscreen-v2-1.js','board-deeplink-auth-return-v1.js','board-own-drag-livefix-v2-2.js'])expect(scripts.some(src=>src.endsWith(`/community/board/${owner}`)),`${engine}/${viewport.width}: missing production owner ${owner}`);
      await page.waitForSelector('[data-shell-session] .dcw-session-profile',{state:'attached'});
      const shellIdentity=await page.locator('[data-shell-session] .dcw-session-profile').evaluate(node=>({name:node.querySelector('strong')?.textContent?.trim()||'',avatar:node.querySelector('img.dcw-session-avatar')?.getAttribute('src')||''}));
      expect(shellIdentity.name==='Member',`${engine}/${viewport.width}: canonical Workspace identity name missing`);expect(shellIdentity.avatar==='/assets/brand/dementor-mark-black.svg',`${engine}/${viewport.width}: canonical Workspace identity avatar missing`);
      const tutorialSkip=page.locator('.dc-board-tutorial [data-tutorial-skip]');
      await tutorialSkip.waitFor({state:'visible'});
      await tutorialSkip.click();
      await page.locator('.dc-board-tutorial').waitFor({state:'hidden'});
      await card.locator('.dc-board-open-hint').click();
      const overlay=page.locator('.dc-artifact-overlay');await overlay.waitFor({state:'visible'});expect(new URL(page.url()).searchParams.get('focus')===`artifact:${ART}`,`${engine}/${viewport.width}: opening Artifact did not set canonical focus`);
      const detail=page.frameLocator('.dc-artifact-overlay iframe');const share=detail.locator('[data-board-artifact-share]');await share.waitFor({state:'visible'});
      const box=await share.boundingBox();expect(!!box,`${engine}/${viewport.width}: detail Share has no bounding box`);if(!box){await context.close();continue}
      await share.click();
      const postcard=page.locator('.dc-board-share-postcard-layer');await postcard.waitFor({state:'visible'});await page.waitForTimeout(120);
      let state=await page.evaluate(()=>({copied:globalThis.__DC_COPIED||'',overlayHidden:document.querySelector('.dc-artifact-overlay')?.hidden??true,dragging:document.documentElement.dataset.boardDragging||'',trace:globalThis.__TRACE||[]}));
      expect(!state.copied,`${engine}/${viewport.width}: detail Share copied before explicit postcard action`);expect(!state.overlayHidden,`${engine}/${viewport.width}: detail Share closed Artifact overlay; trace=${JSON.stringify(state.trace)}`);expect(!state.dragging,`${engine}/${viewport.width}: detail Share started drag; trace=${JSON.stringify(state.trace)}`);
      expect(await postcard.getByText('Member').count()>=1,`${engine}/${viewport.width}: sender identity name missing`);expect(await postcard.locator('[data-postcard-sender-avatar]:not([hidden])').count()===1,`${engine}/${viewport.width}: sender identity avatar missing`);expect((await postcard.locator('.dc-board-share-postcard__brand').innerText()).replace(/\s+/g,' ').trim()==='DEMENTOR CLUB',`${engine}/${viewport.width}: postcard brand missing`);
      const shown=await postcard.locator('[data-postcard-url]').inputValue();const shownUrl=new URL(shown);expect(shownUrl.origin===base&&shownUrl.pathname==='/share/artifact/'&&shownUrl.searchParams.get('id')===ART&&shownUrl.searchParams.size===1,`${engine}/${viewport.width}: clean Share URL mismatch ${shown}`);
      await postcard.getByRole('button',{name:'КОПИРОВАТЬ ССЫЛКУ'}).click();await page.waitForTimeout(80);state=await page.evaluate(()=>({copied:globalThis.__DC_COPIED||'',overlayHidden:document.querySelector('.dc-artifact-overlay')?.hidden??true,dragging:document.documentElement.dataset.boardDragging||''}));expect(state.copied===shown,`${engine}/${viewport.width}: explicit postcard copy mismatch`);expect(!state.overlayHidden,`${engine}/${viewport.width}: postcard copy closed Artifact detail`);expect(!state.dragging,`${engine}/${viewport.width}: postcard copy started drag`);expect(await postcard.getByText('СКОПИРОВАНО').count()===1,`${engine}/${viewport.width}: postcard copy feedback missing`);
      const senderCardBox=await postcard.locator('.dc-board-share-postcard').boundingBox();if(mobile)expect(!!senderCardBox&&senderCardBox.x>=0&&senderCardBox.x+senderCardBox.width<=viewport.width+.5,`${engine}/${viewport.width}: sender postcard overflows viewport`);
      await postcard.getByRole('button',{name:'Закрыть'}).click();

      await page.goto(`${base}/workspace/board/?focus=artifact:${ART}&from=share`);
      const receive=page.locator('.dc-board-share-postcard-layer');await receive.waitFor({state:'visible'});
      expect(await receive.getByRole('button',{name:'ПОСМОТРЕТЬ АРТЕФАКТ →'}).count()===1,`${engine}/${viewport.width}: receive accept action missing`);
      expect(await receive.getByRole('button',{name:'ОСТАТЬСЯ НА ДОСКЕ'}).count()===1,`${engine}/${viewport.width}: receive stay action missing`);
      await page.waitForTimeout(760);
      expect(await page.locator('.dc-artifact-overlay').evaluate(el=>el.hidden),`${engine}/${viewport.width}: shared Artifact auto-opened before explicit accept`);
      expect(new URL(page.url()).searchParams.get('from')==='share',`${engine}/${viewport.width}: from=share consumed before recipient choice`);
      expect(new URL(page.url()).searchParams.get('focus')===`artifact:${ART}`,`${engine}/${viewport.width}: focus changed before recipient choice`);
      const receiveCardBox=await receive.locator('.dc-board-share-postcard').boundingBox();if(mobile)expect(!!receiveCardBox&&receiveCardBox.x>=0&&receiveCardBox.x+receiveCardBox.width<=viewport.width+.5,`${engine}/${viewport.width}: receive postcard overflows viewport`);
      await receive.getByRole('button',{name:'ПОСМОТРЕТЬ АРТЕФАКТ →'}).click();
      await page.locator('.dc-artifact-overlay').waitFor({state:'visible'});
      expect(new URL(page.url()).searchParams.get('from')===null,`${engine}/${viewport.width}: accept did not consume from=share`);
      expect(new URL(page.url()).searchParams.get('focus')===`artifact:${ART}`,`${engine}/${viewport.width}: accept lost canonical focus`);

      await page.goto(`${base}/workspace/board/?focus=artifact:${ART}&from=share`);
      const decline=page.locator('.dc-board-share-postcard-layer');await decline.waitFor({state:'visible'});await page.waitForTimeout(760);
      expect(await page.locator('.dc-artifact-overlay').evaluate(el=>el.hidden),`${engine}/${viewport.width}: second shared arrival auto-opened before stay choice`);
      await decline.getByRole('button',{name:'ОСТАТЬСЯ НА ДОСКЕ'}).click();
      await page.waitForFunction(()=>{const u=new URL(location.href);return !u.searchParams.has('focus')&&!u.searchParams.has('from')});
      expect(await page.locator('.dc-artifact-overlay').evaluate(el=>el.hidden),`${engine}/${viewport.width}: stay action opened/retained Artifact`);
      expect(await page.locator('.dc-board-share-postcard-layer:visible').count()===0,`${engine}/${viewport.width}: receive postcard remained after stay`);
      await context.close();
    }
  }finally{await browser.close()}
}
await new Promise(resolve=>server.close(resolve));
if(failures.length){console.error('BOARD FULL-STACK SHARE BLOCKED');for(const item of failures)console.error(`- ${item}`);process.exit(1)}
console.log('BOARD FULL-STACK SHARE PASS');
console.log('✓ real production Board HTML and runtime owner list loaded');
console.log('✓ canonical Workspace identity is supplied through the shell owner, not a parallel profile query');
console.log('✓ first-run Board tutorial is dismissed through its canonical ПРОПУСТИТЬ UI action before Artifact interaction');
console.log('✓ GitHub Pages 404 bridge resolves canonical /community/artifact/<uuid>/ into the Artifact detail surface');
console.log('✓ closed Artifact card has no Share trigger; open Artifact action row owns Share');
console.log('✓ sender postcard preserves open detail and shows canonical sender identity + brand');
console.log('✓ authenticated shared arrival stays on persistent receive postcard across Chromium/WebKit desktop/mobile');
console.log('✓ explicit receive accept retains focus and opens exact Artifact; stay clears focus/from and remains on Board');
console.log('✓ explicit postcard copy emits clean dedicated Artifact share URL across Chromium/WebKit desktop/mobile');