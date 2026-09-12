import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {chromium} from 'playwright';

const root=path.join(process.cwd(),'_site');
const failures=[];const expect=(ok,msg)=>{if(!ok)failures.push(msg)};
const ART='11111111-1111-4111-8111-111111111111';
const ENT='22222222-2222-4222-8222-222222222222';
const runtimeStub=`
export const route=p=>p;
export const getClient=()=>({});
export async function currentSession(){return globalThis.__DC_TEST_AUTH?{user:{id:'guest-1',email:'guest@example.test'}}:null}
export async function loginWithGoogle(next){globalThis.__DC_LOGIN_NEXT=next}
`;
function harness(){return `<!doctype html><html><head><link rel="stylesheet" href="/community/board/board-fullscreen-v2-1.css"><link rel="stylesheet" href="/community/board/board-deeplink-auth-return-v1.css"></head><body>
<div id="boardHost" class="dc-board-grid"><article class="dc-notice" data-artifact="${ART}"><h3>Artifact</h3><div class="dc-notice__actions"></div></article><article class="dc-projection" data-source-id="${ENT}"><h3>Entity</h3><div class="dc-notice__actions"><a href="/events/fuengirola/">ОТКРЫТЬ →</a></div></article></div>
<section class="dc-artifact-overlay" hidden><button data-overlay-close>close</button></section>
<script>globalThis.__DC_TEST_AUTH=!new URL(location.href).searchParams.has('unauth');Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{globalThis.__DC_COPIED=value}}});document.execCommand=()=>true;window.addEventListener('dc:board-focus-target',e=>{globalThis.__DC_FOCUS={type:e.detail.focus.type,id:e.detail.focus.id,open:e.detail.open};if(e.detail.open)document.querySelector('.dc-artifact-overlay').hidden=false});window.addEventListener('dc:board-close-artifact',()=>{const overlay=document.querySelector('.dc-artifact-overlay');const wasOpen=!overlay.hidden;overlay.hidden=true;if(wasOpen)window.dispatchEvent(new CustomEvent('dc:board-artifact-closed'))});document.addEventListener('click',e=>{const card=e.target.closest?.('.dc-notice[data-artifact]');if(card&&!e.target.closest('button,a'))document.querySelector('.dc-artifact-overlay').hidden=false});document.querySelector('[data-overlay-close]').addEventListener('click',()=>{const overlay=document.querySelector('.dc-artifact-overlay');const wasOpen=!overlay.hidden;overlay.hidden=true;if(wasOpen)window.dispatchEvent(new CustomEvent('dc:board-artifact-closed'))});</script>
<script type="module" src="/community/board/board-deeplink-auth-return-v1.js"></script>
</body></html>`}
const mime={'.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://local');if(u.pathname==='/__deeplink_harness__'){res.setHeader('content-type','text/html; charset=utf-8');res.end(harness());return}if(u.pathname==='/community-runtime-v1.js'){res.setHeader('content-type','text/javascript; charset=utf-8');res.end(runtimeStub);return}const file=path.resolve(root,u.pathname.replace(/^\/+/,''));if(!file.startsWith(root)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('not found');return}res.setHeader('content-type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file))});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});
try{
  const unauth=await browser.newPage();
  await unauth.goto(`${base}/__deeplink_harness__?unauth=1&focus=artifact:${ART}&from=share`);
  const gate=unauth.locator('.dc-board-deeplink-gate');await gate.waitFor({state:'visible'});expect(await gate.getByText('ВЫ ВОШЛИ НЕ ТУДА.').count()===1,'unauth: approved auth gate missing');await gate.getByRole('button',{name:'ВОЙТИ'}).click();const next=await unauth.evaluate(()=>globalThis.__DC_LOGIN_NEXT);expect(next===`/__deeplink_harness__?unauth=1&focus=artifact:${ART}&from=share`,`unauth: exact path/query not preserved: ${next}`);await unauth.close();

  const board=await browser.newPage();
  await board.goto(`${base}/__deeplink_harness__?from=share`);
  const artifactShare=board.locator('.dc-notice > [data-board-share]');await artifactShare.waitFor({state:'visible'});
  let state=await board.evaluate(()=>({overlayHidden:document.querySelector('.dc-artifact-overlay').hidden,share:!!document.querySelector('.dc-notice > [data-board-share]'),legacyActionsHidden:getComputedStyle(document.querySelector('.dc-notice__actions')).display==='none'}));
  expect(state.overlayHidden&&state.share&&state.legacyActionsHidden,'artifact share: visible direct-card control must survive hidden fullscreen actions on base Board');
  await artifactShare.click();const copied=await board.evaluate(()=>globalThis.__DC_COPIED);const copiedUrl=new URL(copied);expect(copiedUrl.origin===base&&copiedUrl.pathname==='/workspace/board/'&&copiedUrl.searchParams.get('from')==='share'&&copiedUrl.searchParams.get('focus')===`artifact:${ART}`,`artifact share: canonical URL mismatch ${copied}`);expect((await artifactShare.textContent())?.includes('СКОПИРОВАНО'),'artifact share: copied feedback missing');expect(await board.locator('.dc-artifact-overlay').evaluate(el=>el.hidden),'artifact share: clicking Share must not open Artifact overlay');await board.close();

  const artifact=await browser.newPage();
  await artifact.goto(`${base}/__deeplink_harness__?from=share&focus=artifact:${ART}`);await artifact.waitForFunction(()=>globalThis.__DC_FOCUS?.type==='artifact');state=await artifact.evaluate(()=>({focus:globalThis.__DC_FOCUS,hidden:document.querySelector('.dc-artifact-overlay').hidden}));expect(state.focus?.id===ART&&state.hidden===false,'artifact deeplink: existing fullscreen open/focus request missing');
  await artifact.locator('[data-overlay-close]').click();await artifact.waitForFunction(()=>!new URL(location.href).searchParams.has('focus'));expect(new URL(artifact.url()).searchParams.get('from')==='share','direct close: unrelated query parameter lost');
  await artifact.locator('.dc-notice').click({position:{x:10,y:10}});await artifact.waitForFunction(()=>new URL(location.href).searchParams.has('focus'));expect(new URL(artifact.url()).searchParams.get('focus')===`artifact:${ART}`,'normal open: focus was not pushed');await artifact.goBack();await artifact.waitForFunction(()=>!new URL(location.href).searchParams.has('focus'));expect(await artifact.locator('.dc-artifact-overlay').evaluate(el=>el.hidden),'Back: overlay did not close');await artifact.goForward();await artifact.waitForFunction(()=>new URL(location.href).searchParams.get('focus')?.startsWith('artifact:'));await artifact.waitForFunction(()=>globalThis.__DC_FOCUS?.open===true);expect(!(await artifact.locator('.dc-artifact-overlay').evaluate(el=>el.hidden)),'Forward: artifact did not reopen');await artifact.close();

  const entity=await browser.newPage();await entity.goto(`${base}/__deeplink_harness__?focus=entity:${ENT}`);await entity.waitForFunction(()=>globalThis.__DC_FOCUS?.type==='entity');const entityShare=entity.locator('.dc-projection > [data-board-share]');await entityShare.waitFor({state:'visible'});state=await entity.evaluate(()=>({focus:globalThis.__DC_FOCUS,hidden:document.querySelector('.dc-artifact-overlay').hidden,share:!!document.querySelector('.dc-projection > [data-board-share]')}));expect(state.focus?.id===ENT&&state.focus?.open===false,'entity deeplink: projection focus request incorrect');expect(state.hidden===true,'entity deeplink: must not open Artifact overlay');expect(state.share,'entity deeplink: visible direct-card share action missing');await entity.close();

  const mobile=await browser.newPage({viewport:{width:390,height:844}});await mobile.goto(`${base}/__deeplink_harness__`);const mobileShare=mobile.locator('.dc-notice > [data-board-share]');await mobileShare.waitFor({state:'visible'});const mobileBox=await mobileShare.boundingBox();expect(!!mobileBox&&mobileBox.width>0&&mobileBox.height>=26,'mobile share: compact visible control missing');await mobileShare.click();expect(await mobile.locator('.dc-artifact-overlay').evaluate(el=>el.hidden),'mobile share: clicking Share must not open Artifact overlay');await mobile.close();
}finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
if(failures.length){console.error('BOARD DEEPLINK AUTH-RETURN BROWSER BLOCKED');for(const item of failures)console.error(`- ${item}`);process.exit(1)}
console.log('BOARD DEEPLINK AUTH-RETURN BROWSER PASS');
console.log('✓ unauth gate preserves exact return path/query');
console.log('✓ base Board exposes clickable Artifact Share outside hidden legacy actions without opening overlay');
console.log('✓ Artifact direct focus, safe close, Back and Forward');
console.log('✓ Entity deep-link keeps a visible direct-card Share without second detail renderer');
console.log('✓ compact Share remains clickable at 390px mobile viewport');
