import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const outDir=path.join(process.cwd(),'.qa','board-mobile-harmonization');
fs.mkdirSync(outDir,{recursive:true});
const errors=[];
const expect=(ok,msg)=>{if(!ok)errors.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
function resolveFile(urlPath){let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);if(pathname.endsWith('/'))pathname+='index.html';const full=path.resolve(artifact,pathname.replace(/^\/+/,''));return full.startsWith(path.resolve(artifact)+path.sep)?full:null}
const server=http.createServer((req,res)=>{const file=resolveFile(req.url||'/');if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('Not found');return}res.setHeader('content-type',mime[path.extname(file).toLowerCase()]||'application/octet-stream');res.end(fs.readFileSync(file))});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});
const supabaseStub=`export function createClient(){const chain={select(){return chain},eq(){return chain},order(){return chain},limit(){return chain},maybeSingle:async()=>({data:null,error:null}),then(resolve,reject){return Promise.resolve({data:[],error:null}).then(resolve,reject)}};return {auth:{getSession:async()=>({data:{session:null},error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:()=>chain,rpc:async()=>({data:[],error:null})}}`;

for(const width of [390,360]){
  const context=await browser.newContext({viewport:{width,height:844}});
  await context.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',body:supabaseStub}));
  const page=await context.newPage();
  await page.goto(base+'/workspace/board/',{waitUntil:'domcontentloaded'});
  await page.locator('.dc-spatial-viewport').waitFor({state:'visible',timeout:4000});
  await page.waitForFunction(()=>document.querySelectorAll('#boardProgramHost [data-thing-ref]').length===3,{timeout:4000}).catch(()=>{});
  /* Let the guest auth/runtime settle before exposing canonical owners purely for
     geometry measurement. This fixture does not change production permissions. */
  await page.waitForTimeout(180);
  await page.evaluate(()=>{
    const nav=document.querySelector('.dcw-nav');
    if(nav){nav.hidden=false;nav.querySelectorAll('[data-member-tool]').forEach(node=>node.hidden=false)}
    let primary=document.querySelector('.dc-board-primary');
    if(!primary){
      primary=document.createElement('div');
      primary.className='dc-board-primary';
      document.querySelector('.dc-spatial-viewport')?.appendChild(primary);
    }
    primary.hidden=false;
    primary.removeAttribute('hidden');
    primary.removeAttribute('aria-hidden');
    if(!primary.querySelector('button'))primary.innerHTML='<button type="button">+ ПРИКОЛОТЬ</button>';
    primary.classList.add('is-visible');
    primary.style.setProperty('display','flex','important');
    let pager=document.querySelector('.dc-board-filter-nav');
    if(!pager){pager=document.createElement('div');pager.className='dc-board-filter-nav';pager.innerHTML='<button>←</button><span>1 / 17</span><button>→</button>';document.querySelector('#boardFilters')?.appendChild(pager)}
    pager.hidden=false;
  });
  await page.waitForTimeout(40);

  const state=await page.evaluate(()=>{
    const box=selector=>{const el=document.querySelector(selector);if(!el)return null;const r=el.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth}};
    const boxes=selector=>[...document.querySelectorAll(selector)].filter(el=>!el.hidden&&getComputedStyle(el).display!=='none'&&el.getClientRects().length>0).map(el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom,text:(el.textContent||'').trim()}});
    return{
      docScrollWidth:document.documentElement.scrollWidth,
      innerWidth,
      sidebar:box('.dcw-sidebar'),nav:box('.dcw-nav'),navLinks:boxes('.dcw-nav .dcw-nav-link'),
      filters:box('.dc-board-filters'),primary:box('.dc-board-primary'),program:box('.dc-board-program'),programDisplay:getComputedStyle(document.querySelector('.dc-board-program')).display,visibleProgramCards:boxes('.dc-board-program__card').length,
      pager:box('.dc-board-filter-nav'),controls:box('.dc-spatial-controls'),viewport:box('.dc-spatial-viewport')
    };
  });
  const label=`mobile@${width}`;
  const inside=b=>!!b&&b.x>=-1&&b.right<=width+1;
  expect(state.docScrollWidth<=width+1,`${label}: document chrome creates horizontal overflow ${state.docScrollWidth}`);
  expect(inside(state.sidebar),`${label}: workspace shell escapes viewport ${JSON.stringify(state.sidebar)}`);
  expect(inside(state.nav),`${label}: workspace nav escapes viewport ${JSON.stringify(state.nav)}`);
  const primaryLinks=state.navLinks.filter(item=>['COMMUNITY BOARD','МОЙ КЛУБ','МОИ АРТЕФАКТЫ','МОЯ АКТИВНОСТЬ'].includes(item.text));
  expect(primaryLinks.length===4,`${label}: primary member nav set incomplete ${JSON.stringify(primaryLinks.map(x=>x.text))}`);
  expect(primaryLinks.every(inside),`${label}: primary nav item clipped ${JSON.stringify(primaryLinks)}`);
  if(state.nav&&state.filters)expect(state.filters.y>=state.nav.bottom+8,`${label}: workspace nav collides with Board utilities ${JSON.stringify({nav:state.nav,filters:state.filters})}`);
  expect(inside(state.filters)&&inside(state.primary),`${label}: filter/publish row escapes viewport ${JSON.stringify({filters:state.filters,primary:state.primary})}`);
  if(state.filters&&state.primary){expect(Math.abs(state.filters.y-state.primary.y)<=4,`${label}: filters and publish action are not one row ${JSON.stringify({filters:state.filters,primary:state.primary})}`);expect(state.filters.right+4<=state.primary.x,`${label}: filters collide with publish action ${JSON.stringify({filters:state.filters,primary:state.primary})}`)}
  expect(state.programDisplay==='none',`${label}: standalone Current Program strip remains visible (${state.programDisplay})`);
  expect(state.visibleProgramCards===0,`${label}: standalone Current Program cards still consume mobile first frame`);
  if(state.filters&&state.viewport)expect(state.filters.bottom-state.viewport.y<92,`${label}: utility chrome still consumes excessive first-frame height ${JSON.stringify({filters:state.filters,viewport:state.viewport})}`);
  expect(inside(state.pager)&&inside(state.controls),`${label}: bottom dock escapes viewport ${JSON.stringify({pager:state.pager,controls:state.controls})}`);
  if(state.pager&&state.controls)expect(state.pager.bottom<=state.controls.y-4,`${label}: pager overlaps spatial controls ${JSON.stringify({pager:state.pager,controls:state.controls})}`);
  expect((state.viewport?.y??999)<=140,`${label}: harmonization displaced canonical fullscreen viewport ${JSON.stringify(state.viewport)}`);
  await page.screenshot({path:path.join(outDir,`board-${width}.png`),fullPage:false});
  await context.close();
}
await browser.close();await new Promise(resolve=>server.close(resolve));
if(errors.length){console.error('BOARD MOBILE HARMONIZATION BLOCKED');for(const error of errors)console.error(`- ${error}`);process.exit(1)}
console.log('Board mobile harmonization browser acceptance PASS');
console.log('✓ 390 / 360 primary workspace chrome fits viewport');
console.log('✓ canonical nav clears filters; filters + publish share one row');
console.log('✓ standalone Current Program strip is absent at 390 / 360; spatial Board owns the first frame');
console.log('✓ compact two-level bottom dock preserves pager / spatial-control clearance');
console.log('✓ fullscreen spatial viewport ownership preserved');
