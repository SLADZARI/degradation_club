import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {chromium,webkit} from 'playwright';

const root=path.join(process.cwd(),'_site');
const failures=[];const expect=(ok,msg)=>{if(!ok)failures.push(msg)};
const ART='11111111-1111-4111-8111-111111111111';
const ENT='22222222-2222-4222-8222-222222222222';
const runtimeStub=`
export const route=p=>p;
export const getClient=()=>({});
export async function currentSession(){return globalThis.__DC_TEST_AUTH?{user:{id:'guest-1',email:'guest@example.test',user_metadata:{full_name:'Guest Sender',picture:'/assets/brand/dementor-mark-black.svg'}}}:null}
export async function loginWithGoogle(next){globalThis.__DC_LOGIN_NEXT=next}
`;
function harness(){return `<!doctype html><html><head><script>window.DEMENTOR_SITE_CONFIG={canonicalOrigin:'https://dementor.club'};</script><link rel="stylesheet" href="/community/board/board-fullscreen-v2-1.css"><link rel="stylesheet" href="/community/board/board-deeplink-auth-return-v1.css"></head><body>
<div id="boardHost" class="dc-board-grid"><article class="dc-notice" data-artifact="${ART}"><h3>Artifact</h3><div class="dc-notice__actions"></div></article><article class="dc-projection" data-source-id="${ENT}"><h3>Entity</h3><div class="dc-notice__actions"><a href="/events/fuengirola/">ОТКРЫТЬ →</a></div></article></div>
<section class="dc-artifact-overlay" hidden><button data-overlay-close>close</button><iframe title="Artifact" srcdoc="<div class='dc-artifact-actions'><a id='detailBack' href='/workspace/board/'>← BOARD</a></div>"></iframe></section>
<script>
const q=new URL(location.href).searchParams;globalThis.__DC_TEST_AUTH=!q.has('unauth');document.documentElement.dataset.dcBoardUserState=q.get('state')||'AUTHENTICATED_GUEST_DC9_COMPLETE';
Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{globalThis.__DC_COPIED=value}}});document.execCommand=()=>true;
window.addEventListener('dc:board-focus-target',e=>{globalThis.__DC_FOCUS={type:e.detail.focus.type,id:e.detail.focus.id,open:e.detail.open};if(e.detail.open)document.querySelector('.dc-artifact-overlay').hidden=false});
window.addEventListener('dc:board-close-artifact',()=>{const overlay=document.querySelector('.dc-artifact-overlay');const wasOpen=!overlay.hidden;overlay.hidden=true;if(wasOpen)window.dispatchEvent(new CustomEvent('dc:board-artifact-closed'))});
document.addEventListener('click',e=>{const card=e.target.closest?.('.dc-notice[data-artifact]');if(card&&!e.target.closest('button,a,input,dialog'))document.querySelector('.dc-artifact-overlay').hidden=false});
document.querySelector('[data-overlay-close]').addEventListener('click',()=>{const overlay=document.querySelector('.dc-artifact-overlay');const wasOpen=!overlay.hidden;overlay.hidden=true;if(wasOpen)window.dispatchEvent(new CustomEvent('dc:board-artifact-closed'))});
</script>
<script type="module" src="/community/board/board-deeplink-auth-return-v1.js"></script>
</body></html>`}
const mime={'.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.html':'text/html; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://local');if(u.pathname==='/__deeplink_harness__'){res.setHeader('content-type','text/html; charset=utf-8');res.end(harness());return}if(u.pathname==='/community-runtime-v1.js'){res.setHeader('content-type','text/javascript; charset=utf-8');res.end(runtimeStub);return}const requestPath=u.pathname.endsWith('/')?`${u.pathname}index.html`:u.pathname;const file=path.resolve(root,requestPath.replace(/^\/+/,''));if(!file.startsWith(root)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('not found');return}res.setHeader('content-type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file))});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;

async function expectPersistentReceive(page,label){
  const arrival=page.locator('.dc-board-share-postcard-layer');await arrival.waitFor({state:'visible'});
  expect(await arrival.getByText('ВАМ ПЕРЕДАЛИ АРТЕФАКТ').count()===1,`${label}: incoming postcard missing`);
  expect(await arrival.getByRole('button',{name:'ПОСМОТРЕТЬ АРТЕФАКТ →'}).count()===1,`${label}: accept action missing`);
  expect(await arrival.getByRole('button',{name:'ОСТАТЬСЯ НА ДОСКЕ'}).count()===1,`${label}: stay action missing`);
  await page.waitForTimeout(760);
  expect(await page.locator('.dc-artifact-overlay').evaluate(el=>el.hidden),`${label}: Artifact auto-opened before explicit accept`);
  const url=new URL(page.url());
  expect(url.searchParams.get('from')==='share',`${label}: from=share was consumed before explicit choice`);
  expect(url.searchParams.get('focus')===`artifact:${ART}`,`${label}: focus changed before explicit choice`);
  return arrival;
}

async function acceptShared(page,label){
  const arrival=await expectPersistentReceive(page,label);
  await arrival.getByRole('button',{name:'ПОСМОТРЕТЬ АРТЕФАКТ →'}).click();
  await page.waitForFunction(()=>globalThis.__DC_FOCUS?.type==='artifact');
  const url=new URL(page.url());
  expect(url.searchParams.get('from')===null,`${label}: accept did not consume from=share`);
  expect(url.searchParams.get('focus')===`artifact:${ART}`,`${label}: accept lost canonical focus`);
  expect(!(await page.locator('.dc-artifact-overlay').evaluate(el=>el.hidden)),`${label}: accept did not open exact Artifact`);
  expect(await page.locator('.dc-board-share-postcard-layer:visible').count()===0,`${label}: receive postcard remained after accept`);
}

async function stayShared(page,label,action='button'){
  const arrival=await expectPersistentReceive(page,label);
  if(action==='button')await arrival.getByRole('button',{name:'ОСТАТЬСЯ НА ДОСКЕ'}).click();
  else if(action==='close')await arrival.getByRole('button',{name:'Закрыть'}).click();
  else if(action==='escape')await page.keyboard.press('Escape');
  else if(action==='backdrop')await arrival.click({position:{x:2,y:2}});
  await page.waitForFunction(()=>{const u=new URL(location.href);return !u.searchParams.has('from')&&!u.searchParams.has('focus')});
  await page.waitForTimeout(120);
  const url=new URL(page.url());
  expect(url.searchParams.get('from')===null&&url.searchParams.get('focus')===null,`${label}: stay/close did not clear both from and focus`);
  expect(await page.locator('.dc-artifact-overlay').evaluate(el=>el.hidden),`${label}: stay/close opened or retained Artifact`);
  expect(await page.locator('.dc-board-share-postcard-layer:visible').count()===0,`${label}: postcard stayed visible after decline`);
}

const browser=await chromium.launch({headless:true});
try{
  const unauth=await browser.newPage();
  await unauth.goto(`${base}/__deeplink_harness__?unauth=1&focus=artifact:${ART}&from=share`);
  const receive=unauth.locator('.dc-board-share-postcard-layer');await receive.waitFor({state:'visible'});
  expect(await receive.getByText('ВАМ ПЕРЕДАЛИ АРТЕФАКТ').count()===1,'unauth share: receive postcard missing');
  expect(await receive.getByText('ВХОД ≠ ЧЛЕНСТВО').count()===1,'unauth share: membership disclaimer missing');
  expect((await receive.locator('.dc-board-share-postcard__brand').innerText()).replace(/\s+/g,' ').trim()==='DEMENTOR CLUB','unauth share: postcard brand missing');
  expect(await unauth.locator('.dc-artifact-overlay').evaluate(el=>el.hidden),'unauth share: target existence leaked through opened Artifact');
  await receive.getByRole('button',{name:'ВОЙТИ И ПОСМОТРЕТЬ →'}).click();
  const next=await unauth.evaluate(()=>globalThis.__DC_LOGIN_NEXT);
  expect(next===`/__deeplink_harness__?unauth=1&focus=artifact:${ART}&from=share`,`unauth share: exact path/query not preserved: ${next}`);
  await unauth.close();

  const generic=await browser.newPage();
  await generic.goto(`${base}/__deeplink_harness__?unauth=1&focus=artifact:${ART}`);
  await generic.locator('.dc-board-deeplink-gate').waitFor({state:'visible'});
  expect(await generic.getByText('ВЫ ВОШЛИ НЕ ТУДА.').count()===1,'ordinary deeplink: generic auth gate regressed');
  await generic.close();

  const board=await browser.newPage();
  await board.goto(`${base}/__deeplink_harness__?debug=must-not-leak`);
  expect(await board.locator('.dc-notice > [data-board-share]').count()===0,'sender: legacy Artifact Share survived on closed Board card');
  await board.locator('.dc-notice').click({position:{x:10,y:10}});
  await board.waitForFunction(()=>new URL(location.href).searchParams.get('focus')?.startsWith('artifact:'));
  expect(!(await board.locator('.dc-artifact-overlay').evaluate(el=>el.hidden)),'sender: Artifact detail did not open before Share');
  const detail=board.frameLocator('.dc-artifact-overlay iframe');const artifactShare=detail.locator('[data-board-artifact-share]');await artifactShare.waitFor({state:'visible'});
  await artifactShare.click();
  const sender=board.locator('.dc-board-share-postcard-layer');await sender.waitFor({state:'visible'});
  expect(!(await board.evaluate(()=>Boolean(globalThis.__DC_COPIED))),'sender: Share trigger must not copy before explicit action');
  expect(!(await board.locator('.dc-artifact-overlay').evaluate(el=>el.hidden)),'sender: postcard must preserve open Artifact detail');
  expect(await sender.getByText('Guest Sender').count()===1,'sender: canonical sender name preview missing');
  expect(await sender.locator('[data-postcard-sender-avatar]').count()===1,'sender: sender avatar slot missing');
  expect((await sender.locator('.dc-board-share-postcard__brand').innerText()).replace(/\s+/g,' ').trim()==='DEMENTOR CLUB','sender: postcard brand missing');
  const urlValue=await sender.locator('[data-postcard-url]').inputValue();const shareUrl=new URL(urlValue);
  expect(shareUrl.origin===base&&shareUrl.pathname==='/share/artifact/'&&shareUrl.searchParams.get('id')===ART&&shareUrl.searchParams.size===1,`sender: clean dedicated Share URL mismatch ${urlValue}`);
  await sender.getByRole('button',{name:'КОПИРОВАТЬ ССЫЛКУ'}).click();
  expect((await board.evaluate(()=>globalThis.__DC_COPIED))===urlValue,'sender: explicit copy did not copy shown URL');
  expect(await sender.getByText('СКОПИРОВАНО').count()===1,'sender: copied stamp missing');
  expect(!(await board.locator('.dc-artifact-overlay').evaluate(el=>el.hidden)),'sender: explicit copy closed Artifact detail');
  await sender.getByRole('button',{name:'Закрыть'}).click();
  expect(await artifactShare.evaluate(el=>el.ownerDocument.activeElement===el),'sender: close did not restore focus to detail Share trigger');
  await board.close();

  for(const state of ['AUTHENTICATED_GUEST_DC9_INCOMPLETE','AUTHENTICATED_GUEST_DC9_COMPLETE','APPLICANT','MEMBER_NOT_ACTIVATED','MEMBER_ACTIVATED','DEMENTOR','OWNER_ADMIN']){
    const page=await browser.newPage();
    await page.goto(`${base}/__deeplink_harness__?state=${state}&focus=artifact:${ART}&from=share`);
    await acceptShared(page,`role ${state}`);
    await page.close();
  }

  const stay=await browser.newPage();
  await stay.goto(`${base}/__deeplink_harness__?state=MEMBER_ACTIVATED&focus=artifact:${ART}&from=share`);
  await stayShared(stay,'member stay action','button');await stay.close();

  const close=await browser.newPage();
  await close.goto(`${base}/__deeplink_harness__?state=DEMENTOR&focus=artifact:${ART}&from=share`);
  await stayShared(close,'dementor close action','close');await close.close();

  const escape=await browser.newPage();
  await escape.goto(`${base}/__deeplink_harness__?state=OWNER_ADMIN&focus=artifact:${ART}&from=share`);
  await stayShared(escape,'owner Escape action','escape');await escape.close();

  const backdrop=await browser.newPage();
  await backdrop.goto(`${base}/__deeplink_harness__?state=MEMBER_ACTIVATED&focus=artifact:${ART}&from=share`);
  await stayShared(backdrop,'member backdrop action','backdrop');await backdrop.close();

  const artifact=await browser.newPage();
  await artifact.goto(`${base}/__deeplink_harness__?focus=artifact:${ART}`);await artifact.waitForFunction(()=>globalThis.__DC_FOCUS?.type==='artifact');
  expect(await artifact.locator('.dc-board-share-postcard-layer:visible').count()===0,'ordinary deeplink: receive postcard must not appear without from=share');
  await artifact.locator('[data-overlay-close]').click();await artifact.waitForFunction(()=>!new URL(location.href).searchParams.has('focus'));
  await artifact.locator('.dc-notice').click({position:{x:10,y:10}});await artifact.waitForFunction(()=>new URL(location.href).searchParams.has('focus'));
  expect(new URL(artifact.url()).searchParams.get('focus')===`artifact:${ART}`,'normal open: focus was not pushed');
  await artifact.goBack();await artifact.waitForFunction(()=>!new URL(location.href).searchParams.has('focus'));expect(await artifact.locator('.dc-artifact-overlay').evaluate(el=>el.hidden),'Back: overlay did not close');
  await artifact.goForward();await artifact.waitForFunction(()=>new URL(location.href).searchParams.get('focus')?.startsWith('artifact:'));await artifact.waitForFunction(()=>document.querySelector('.dc-artifact-overlay')?.hidden===false);expect(!(await artifact.locator('.dc-artifact-overlay').evaluate(el=>el.hidden)),'Forward: artifact did not reopen');await artifact.close();

  const entity=await browser.newPage();await entity.goto(`${base}/__deeplink_harness__?focus=entity:${ENT}`);await entity.waitForFunction(()=>globalThis.__DC_FOCUS?.type==='entity');const entityShare=entity.locator('.dc-projection > [data-board-share]');await entityShare.waitFor({state:'visible'});expect(await entity.locator('.dc-artifact-overlay').evaluate(el=>el.hidden),'entity deeplink: must not open Artifact overlay');await entityShare.click();const entityCopied=new URL(await entity.evaluate(()=>globalThis.__DC_COPIED));expect(entityCopied.searchParams.get('focus')===`entity:${ENT}`,'entity share: existing focus link regressed');await entity.close();

  const social=await browser.newPage();await social.goto(`${base}/share/artifact/?id=${ART}`,{waitUntil:'domcontentloaded'});await social.waitForURL(url=>url.pathname==='/workspace/board/'&&url.searchParams.get('from')==='share');expect(new URL(social.url()).searchParams.get('focus')===`artifact:${ART}`,'social share surface: human redirect lost exact Artifact');await social.close();

  const invalid=await browser.newPage();await invalid.goto(`${base}/share/artifact/?id=not-a-uuid`);await invalid.waitForTimeout(650);expect(new URL(invalid.url()).pathname==='/share/artifact/','invalid transport id: must not redirect to Board');expect(await invalid.getByText('ССЫЛКА НЕ СОБРАЛАСЬ.').count()===1,'invalid transport id: error state missing');expect(await invalid.getByRole('link',{name:'DEMENTOR CLUB →'}).getAttribute('href')==='/' ,'invalid transport id: safe club fallback missing');await invalid.close();

  const mobile=await browser.newPage({viewport:{width:390,height:844}});await mobile.goto(`${base}/__deeplink_harness__`);expect(await mobile.locator('.dc-notice > [data-board-share]').count()===0,'mobile: legacy closed-card Artifact Share survived');await mobile.locator('.dc-notice').click({position:{x:10,y:10}});await mobile.waitForFunction(()=>new URL(location.href).searchParams.get('focus')?.startsWith('artifact:'));const mobileShare=mobile.frameLocator('.dc-artifact-overlay iframe').locator('[data-board-artifact-share]');await mobileShare.waitFor({state:'visible'});await mobileShare.click();const mobileCard=mobile.locator('.dc-board-share-postcard');await mobileCard.waitFor({state:'visible'});const box=await mobileCard.boundingBox();expect(!!box&&box.x>=0&&box.x+box.width<=390.5,'mobile postcard: horizontal overflow');expect(!(await mobile.locator('.dc-artifact-overlay').evaluate(el=>el.hidden)),'mobile share: postcard must preserve open Artifact detail');await mobile.close();
}finally{await browser.close()}

for(const [engine,browserType] of [['chromium',chromium],['webkit',webkit]]){
  const matrixBrowser=await browserType.launch({headless:true});
  try{
    for(const viewport of [{width:1280,height:800},{width:390,height:844}]){
      const context=await matrixBrowser.newContext({viewport,hasTouch:viewport.width<500,isMobile:viewport.width<500});
      const accept=await context.newPage();
      await accept.goto(`${base}/__deeplink_harness__?state=MEMBER_ACTIVATED&focus=artifact:${ART}&from=share`);
      await acceptShared(accept,`${engine}/${viewport.width} accept`);
      await accept.close();
      const stay=await context.newPage();
      await stay.goto(`${base}/__deeplink_harness__?state=MEMBER_ACTIVATED&focus=artifact:${ART}&from=share`);
      await stayShared(stay,`${engine}/${viewport.width} stay`,'button');
      await stay.close();
      await context.close();
    }
  }finally{await matrixBrowser.close()}
}

await new Promise(resolve=>server.close(resolve));
if(failures.length){console.error('BOARD DEEPLINK AUTH-RETURN BROWSER BLOCKED');for(const item of failures)console.error(`- ${item}`);process.exit(1)}
console.log('BOARD DEEPLINK AUTH-RETURN BROWSER PASS');
console.log('✓ unauth shared entry uses generic Receive postcard and preserves exact OAuth return');
console.log('✓ all authenticated Board states stop at persistent incoming postcard; no timer/direct-open remains');
console.log('✓ explicit accept consumes from=share, retains focus and opens exact Artifact');
console.log('✓ stay / close / Escape / backdrop consume both from=share and focus and remain on Board');
console.log('✓ receive accept/stay matrix passes Chromium + WebKit on desktop and 390px mobile');
console.log('✓ ordinary non-share focus/history, Sender Share, Entity Share and transport behavior remain valid');