import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {chromium,webkit} from 'playwright';

const root=path.join(process.cwd(),'_site');
const ART='11111111-1111-4111-8111-111111111111';
const failures=[];
const expect=(ok,msg)=>{if(!ok)failures.push(msg)};
const runtimeStub=`
export const route=p=>p;
const session={user:{id:'guest-1',email:'guest@example.test'}};
export const getClient=()=>({auth:{getSession:async()=>({data:{session}})}});
export async function currentSession(){return session}
export async function getEntryStatus(){return {membership_active:true,artifact_slots_available:0,artifact_slots_consuming:1,sphere_gate_complete:true,sphere_count:9}}
export async function loginWithGoogle(){}
`;
function harness(){return `<!doctype html><html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="/community/board/board.css">
<link rel="stylesheet" href="/community/board/board-qa-fix-v1.css">
<link rel="stylesheet" href="/community/board/board-integrations-v1.css">
<link rel="stylesheet" href="/community/board/board-spatial-v1.css">
<link rel="stylesheet" href="/community/board/board-fullscreen-v2-1.css">
<link rel="stylesheet" href="/community/board/board-mobile-air-v2-1.css">
<link rel="stylesheet" href="/community/board/board-deeplink-auth-return-v1.css">
<style>.dcw-main,.dcw-view,.dc-board-page,.dc-board-wall,.dc-board-shell{width:100%;height:100%;margin:0;padding:0}.dcw-sidebar{display:none!important}.dcw-main{height:100dvh!important}.dc-spatial-viewport{height:100dvh!important}.dc-spatial-world{transform:translate(-5750px,-3750px) scale(1)!important}</style>
</head><body class="dc-system-page dcw-body dc-board-fullscreen-v21">
<div class="dcw-main"><div class="dcw-view dc-board-page"><section class="dc-board-wall"><div class="dc-board-shell">
<nav id="boardFilters" class="dc-board-filters"></nav>
<div class="dc-spatial-viewport"><div id="boardHost" class="dc-board-grid dc-spatial-world">
<article class="dc-notice is-own-movable" data-artifact="${ART}" data-artifact-owned="1" data-position-version="1" data-size-class="S" style="left:100px;top:100px;--dc-card-rotation:.35deg"><h3>Own Artifact</h3><p class="dc-notice__body">Production-like own movable card with enough body text to exercise fullscreen card composition and hit testing.</p><div class="dc-notice__expiry">ACTIVE · COMMUNITY</div><div class="dc-notice__actions"></div></article>
</div></div></div></section></div></div>
<script>
globalThis.__TRACE=[];
Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{globalThis.__DC_COPIED=value}}});document.execCommand=()=>true;
for(const type of ['pointerdown','pointerup','click'])document.addEventListener(type,event=>{globalThis.__TRACE.push({type,target:event.target?.tagName||'',className:event.target?.className||'',share:!!event.target?.closest?.('[data-board-share]'),x:event.clientX,y:event.clientY})},true);
</script>
<script type="module" src="/community/board/board-fullscreen-v2-1.js"></script>
<script type="module" src="/community/board/board-deeplink-auth-return-v1.js"></script>
<script type="module" src="/community/board/board-own-drag-livefix-v2-1.js"></script>
</body></html>`}
const mime={'.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://local');if(u.pathname==='/__share_own_card__'){res.setHeader('content-type','text/html; charset=utf-8');res.end(harness());return}if(u.pathname==='/community-runtime-v1.js'){res.setHeader('content-type','text/javascript; charset=utf-8');res.end(runtimeStub);return}const file=path.resolve(root,u.pathname.replace(/^[/]+/,''));if(!file.startsWith(root)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('not found');return}res.setHeader('content-type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file))});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
for(const [engine,browserType] of [['chromium',chromium],['webkit',webkit]]){
  const browser=await browserType.launch({headless:true});
  try{
    for(const viewport of [{width:1280,height:800},{width:390,height:844}]){
      const mobile=viewport.width<500;
      const context=await browser.newContext({viewport,hasTouch:mobile,isMobile:mobile});
      const page=await context.newPage();
      await page.goto(`${base}/__share_own_card__`);
      const share=page.locator('.dc-notice > [data-board-share]');
      await share.waitFor({state:'visible'});
      const box=await share.boundingBox();
      expect(!!box,`${engine}/${viewport.width}: Share has no bounding box`);
      if(!box){await context.close();continue}
      const point={x:box.x+box.width/2,y:box.y+box.height/2};
      const hit=await page.evaluate(({x,y})=>{const el=document.elementFromPoint(x,y);return {tag:el?.tagName||'',className:el?.className||'',isShare:!!el?.closest?.('[data-board-share]')}},point);
      if(mobile)await page.touchscreen.tap(point.x,point.y);else await page.mouse.click(point.x,point.y);
      await page.waitForTimeout(220);
      const state=await page.evaluate(()=>({copied:globalThis.__DC_COPIED||'',overlayHidden:document.querySelector('.dc-artifact-overlay')?.hidden??true,dragging:document.documentElement.dataset.boardDragging||'',shareText:document.querySelector('[data-board-share]')?.textContent||'',trace:globalThis.__TRACE||[]}));
      expect(hit.isShare,`${engine}/${viewport.width}: center hit target is ${hit.tag}.${hit.className}, not Share`);
      expect(Boolean(state.copied),`${engine}/${viewport.width}: Share coordinate click did not copy; trace=${JSON.stringify(state.trace)}`);
      if(state.copied){const copied=new URL(state.copied);expect(copied.pathname==='/workspace/board/'&&copied.searchParams.get('focus')===`artifact:${ART}`,`${engine}/${viewport.width}: canonical URL mismatch ${state.copied}`)}
      expect(state.overlayHidden,`${engine}/${viewport.width}: Share coordinate click opened Artifact; trace=${JSON.stringify(state.trace)}`);
      expect(!state.dragging,`${engine}/${viewport.width}: Share coordinate click started drag; trace=${JSON.stringify(state.trace)}`);
      expect(state.shareText.includes('СКОПИРОВАНО'),`${engine}/${viewport.width}: copy feedback missing`);
      await context.close();
    }
  }finally{await browser.close()}
}
await new Promise(resolve=>server.close(resolve));
if(failures.length){console.error('BOARD OWN-CARD SHARE BLOCKED');for(const item of failures)console.error(`- ${item}`);process.exit(1)}
console.log('BOARD OWN-CARD SHARE PASS');
console.log('✓ production-like fullscreen hit target resolves to Share');
console.log('✓ coordinate click/tap copies without Artifact open or drag in Chromium + WebKit');
