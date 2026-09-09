import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const errors=[];
const expect=(ok,msg)=>{if(!ok)errors.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};

function resolveFile(urlPath){
  let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);
  if(pathname.endsWith('/'))pathname+='index.html';
  const full=path.resolve(artifact,pathname.replace(/^\/+/,''));
  if(!full.startsWith(path.resolve(artifact)+path.sep)&&full!==path.resolve(artifact))return null;
  return full;
}

const server=http.createServer((req,res)=>{
  const file=resolveFile(req.url||'/');
  if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){
    const fallback=path.join(artifact,'404.html');
    res.statusCode=404;res.setHeader('content-type','text/html; charset=utf-8');res.end(fs.existsSync(fallback)?fs.readFileSync(fallback):'Not found');return;
  }
  res.statusCode=200;res.setHeader('content-type',mime[path.extname(file).toLowerCase()]||'application/octet-stream');res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});

const supabaseStub=`
  export function createClient(){
    const chain={select(){return chain},eq(){return chain},maybeSingle:async()=>({data:null,error:null}),then(resolve,reject){return Promise.resolve({data:[],error:null}).then(resolve,reject)}};
    return {auth:{getSession:async()=>({data:{session:null},error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:()=>chain};
  }
`;

const routes=['/','/events/','/events/fuengirola/','/community/','/community/gabil/','/merch/'];
const widths=[1440,1024,768,390,360];
const forbidden=['source-of-truth','canonical source-of-truth','participant relation from entity record','sales_state','production spec','CHECKOUT / DISABLED','PRICE / TBD','MECHANICS PENDING'];

async function makeContext(width){
  const c=await browser.newContext({viewport:{width,height:1000}});
  await c.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({status:200,contentType:'text/javascript; charset=utf-8',body:supabaseStub}));
  return c;
}

for(const width of widths){
  const c=await makeContext(width);
  for(const route of routes){
    const p=await c.newPage();
    await p.goto(base+route,{waitUntil:'domcontentloaded'});
    await p.waitForTimeout(180);
    const label=`${route}@${width}`;

    const geometry=await p.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}));
    expect(geometry.scrollWidth<=geometry.clientWidth+1,`${label}: horizontal overflow ${JSON.stringify(geometry)}`);

    expect(await p.locator('.dc-global-header').count()===1,`${label}: canonical Header missing/duplicated`);
    expect(await p.locator('header.topbar').count()===0,`${label}: legacy page-owned Header survived build`);
    const headerBox=await p.locator('.dc-global-header').boundingBox();
    if(headerBox){
      const expectedHeight=width>900?72:64;
      expect(Math.abs(headerBox.height-expectedHeight)<=2,`${label}: Header height drifted ${headerBox.height}, expected ~${expectedHeight}`);
      expect(Math.abs(headerBox.x)<=1,`${label}: Header x-position drifted ${headerBox.x}`);
      expect(headerBox.width<=width+1&&headerBox.width>=width-1,`${label}: Header width drifted ${headerBox.width}`);
    }

    const publicText=(await p.locator('body').innerText()).toLowerCase();
    for(const marker of forbidden)expect(!publicText.includes(marker.toLowerCase()),`${label}: forbidden public marker visible: ${marker}`);

    if(route==='/'){
      expect(await p.locator('.dc-course-prototype__mentor').count()===1,`${label}: Home Valentin mentor-card count drifted`);
      expect(!(await p.locator('body').innerText()).includes('Дементор: Валентин Лосев.'),`${label}: Home duplicate Valentin attribution visible`);
    }

    if(route==='/events/fuengirola/'){
      expect(await p.locator('.dc-event-hero__relation').count()===1,`${label}: Fuengirola static relation count drifted`);
      expect(await p.locator('.dc-event-detail__intro > .dc-dementor-link').count()===0,`${label}: Fuengirola runtime duplicate relation injected`);
      expect(await p.locator('.dc-dementor-feature--gabil').count()===0,`${label}: second dominant Gabil feature survived`);
    }

    if(route==='/community/'){
      expect(await p.locator('main h1').count()===1,`${label}: Community h1 count drifted`);
      expect(await p.locator('.hero-ref__media img').count()===1,`${label}: Community hero image source count drifted`);
      expect(await p.locator('.hero-ref__lead').count()===1,`${label}: Community hero lead source count drifted`);
      expect(await p.locator('.hero-ref__copy').count()===1,`${label}: Community hero body source count drifted`);
      const heroBox=await p.locator('.hero-ref').boundingBox();
      if(heroBox)expect(heroBox.x>=-1&&heroBox.x+heroBox.width<=width+1,`${label}: Community hero escapes viewport ${JSON.stringify(heroBox)}`);
    }

    if(route==='/events/'){
      expect(await p.locator('.dc-programme__lane').count()===1,`${label}: Events real-lane count drifted`);
      expect(await p.locator('.dc-programme__empty-state').count()===5,`${label}: Events compact empty-state count drifted`);
      expect(await p.locator('.dc-programme__empty').count()===0,`${label}: legacy full empty lanes survived`);
    }

    await p.close();
  }
  await c.close();
}

// Touch/mobile critical path: Events preview is tap-accessible and the second tap opens the event.
{
  const c=await makeContext(390),p=await c.newPage();
  await p.goto(base+'/events/',{waitUntil:'domcontentloaded'});await p.waitForTimeout(180);
  const row=p.locator('.dc-catalog-row[href="/events/fuengirola/"]');
  expect(await row.count()===1,'/events/@390: Fuengirola row missing');
  if(await row.count()){
    await row.click();
    expect(await p.locator('.dc-catalog-mobile-preview').count()===1,'/events/@390: first tap did not expose mobile preview');
    await row.click();
    try{await p.waitForURL(u=>new URL(u).pathname==='/events/fuengirola/',{timeout:2500})}catch{errors.push(`/events/@390: second tap did not open event; actual=${p.url()}`)}
  }
  await c.close();
}

await browser.close();await new Promise(resolve=>server.close(resolve));
if(errors.length){console.error('PUBLIC HARMONIZATION BROWSER MATRIX BLOCKED');for(const e of errors)console.error(`- ${e}`);process.exit(1)}
console.log('Public harmonization browser matrix PASS');
console.log('✓ routes: /, /events/, /events/fuengirola/, /community/, /community/gabil/, /merch/');
console.log('✓ widths: 1440 / 1024 / 768 / 390 / 360');
console.log('✓ no horizontal overflow; canonical Header geometry preserved');
console.log('✓ Fuengirola relation ownership + Gabil density; Home Valentin; Community one-source hero; Events compact lifecycle');
console.log('✓ exact public implementation-marker denylist; mobile Events path remains tap-accessible');
