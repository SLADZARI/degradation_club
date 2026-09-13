import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {chromium} from 'playwright';

const root=path.join(process.cwd(),'_site');
const ART='11111111-1111-4111-8111-111111111111';
const failures=[];
const expect=(ok,msg)=>{if(!ok)failures.push(msg)};
const runtimeStub=`
export const route=p=>p;
export const getClient=()=>({});
export async function currentSession(){return {user:{id:'guest-1',email:'guest@example.test'}}}
export async function loginWithGoogle(){}
`;
function harness(){return `<!doctype html><html><head><style>body{margin:0}.dc-notice{position:absolute;width:280px;height:220px;left:100px;top:100px;border:1px solid #111}.dc-artifact-overlay[hidden]{display:none}</style><link rel="stylesheet" href="/community/board/board-deeplink-auth-return-v1.css"></head><body>
<div id="boardHost"><article class="dc-notice is-own-movable" data-artifact="${ART}" data-position-version="1" style="left:100px;top:100px"><h3>Own Artifact</h3><div class="dc-notice__actions"></div></article></div>
<section class="dc-artifact-overlay" hidden>OPEN</section>
<script>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{globalThis.__DC_COPIED=value}}});document.execCommand=()=>true;document.addEventListener('click',event=>{const card=event.target.closest?.('.dc-notice[data-artifact]');if(card&&!event.target.closest?.('button,a,input,textarea,select,label,dialog'))document.querySelector('.dc-artifact-overlay').hidden=false},true);</script>
<script type="module" src="/community/board/board-own-drag-livefix-v2-1.js"></script>
<script type="module" src="/community/board/board-deeplink-auth-return-v1.js"></script>
</body></html>`}
const mime={'.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://local');if(u.pathname==='/__share_own_card__'){res.setHeader('content-type','text/html; charset=utf-8');res.end(harness());return}if(u.pathname==='/community-runtime-v1.js'){res.setHeader('content-type','text/javascript; charset=utf-8');res.end(runtimeStub);return}const file=path.resolve(root,u.pathname.replace(/^\/+/,''));if(!file.startsWith(root)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('not found');return}res.setHeader('content-type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file))});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});
try{
  for(const viewport of [{width:1280,height:800},{width:390,height:844}]){
    const page=await browser.newPage({viewport});
    await page.goto(`${base}/__share_own_card__`);
    const share=page.locator('.dc-notice > [data-board-share]');
    await share.waitFor({state:'visible'});
    await share.click();
    await page.waitForFunction(()=>Boolean(globalThis.__DC_COPIED));
    const state=await page.evaluate(()=>({copied:globalThis.__DC_COPIED,overlayHidden:document.querySelector('.dc-artifact-overlay').hidden,dragging:document.documentElement.dataset.boardDragging||'',shareText:document.querySelector('[data-board-share]')?.textContent||''}));
    const copied=new URL(state.copied);
    expect(copied.pathname==='/workspace/board/'&&copied.searchParams.get('focus')===`artifact:${ART}`,`${viewport.width}px: Share did not copy canonical Artifact URL`);
    expect(state.overlayHidden,`${viewport.width}px: Share click opened own Artifact card`);
    expect(!state.dragging,`${viewport.width}px: Share click incorrectly started own-card drag`);
    expect(state.shareText.includes('СКОПИРОВАНО'),`${viewport.width}px: Share copy feedback missing`);
    await page.close();
  }
}finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
if(failures.length){console.error('BOARD OWN-CARD SHARE BLOCKED');for(const item of failures)console.error(`- ${item}`);process.exit(1)}
console.log('BOARD OWN-CARD SHARE PASS');
console.log('✓ Share on is-own-movable card copies canonical URL without drag or card open');
console.log('✓ desktop and 390px mobile pointer paths covered');
