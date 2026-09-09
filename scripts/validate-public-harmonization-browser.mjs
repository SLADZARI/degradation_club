import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';

const artifact=path.join(process.cwd(),'_site');
const visualDir=path.join(process.cwd(),'.qa','public-harmonization');
const visualBaselinePath=path.join(process.cwd(),'scripts','visual-baselines','home-fuengirola.json');
fs.mkdirSync(visualDir,{recursive:true});
const visualBaselines=fs.existsSync(visualBaselinePath)?JSON.parse(fs.readFileSync(visualBaselinePath,'utf8')):null;
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

function visualHash(buffer,cols=32,rows=18){
  const png=PNG.sync.read(buffer);
  const cells=[];
  for(let gy=0;gy<rows;gy++){
    const y0=Math.floor(gy*png.height/rows),y1=Math.max(y0+1,Math.floor((gy+1)*png.height/rows));
    for(let gx=0;gx<cols;gx++){
      const x0=Math.floor(gx*png.width/cols),x1=Math.max(x0+1,Math.floor((gx+1)*png.width/cols));
      let sum=0,count=0;
      const sx=Math.max(1,Math.floor((x1-x0)/6)),sy=Math.max(1,Math.floor((y1-y0)/6));
      for(let y=y0;y<y1;y+=sy){
        for(let x=x0;x<x1;x+=sx){
          const i=(y*png.width+x)*4;
          const a=png.data[i+3]/255;
          const r=png.data[i]*a+255*(1-a),g=png.data[i+1]*a+255*(1-a),b=png.data[i+2]*a+255*(1-a);
          sum+=.2126*r+.7152*g+.0722*b;count++;
        }
      }
      cells.push(sum/Math.max(1,count));
    }
  }
  const avg=cells.reduce((a,b)=>a+b,0)/cells.length;
  const bits=cells.map(v=>v>=avg?1:0);
  let hex='';
  for(let i=0;i<bits.length;i+=4){
    let n=0;for(let j=0;j<4;j++)n=(n<<1)|(bits[i+j]||0);hex+=n.toString(16);
  }
  return hex;
}

function hammingHex(a,b){
  if(typeof a!=='string'||typeof b!=='string'||a.length!==b.length)return Infinity;
  const pop=[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4];
  let d=0;for(let i=0;i<a.length;i++)d+=pop[parseInt(a[i],16)^parseInt(b[i],16)];return d;
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
const visualWidths=new Set([1440,1024,390]);
const forbidden=[
  'source-of-truth','canonical source-of-truth','participant relation from entity record','sales_state','production spec','CHECKOUT / DISABLED','PRICE / TBD','MECHANICS PENDING',
  'Пустое состояние — тоже данные','канонической записи события','OBJECT / WEAR / DROP сущности','WORKING ASSETS','MERCH CONTRACT'
];

async function makeContext(width){
  const c=await browser.newContext({viewport:{width,height:1000}});
  await c.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({status:200,contentType:'text/javascript; charset=utf-8',body:supabaseStub}));
  return c;
}

async function rasterHealth(page){
  return page.evaluate(async()=>{
    const urls=new Set();
    const addUrl=value=>{
      if(!value)return;
      try{urls.add(new URL(value,location.href).href)}catch{}
    };
    document.querySelectorAll('img[src]').forEach(img=>addUrl(img.getAttribute('src')));
    const addStyleUrls=style=>{
      const bg=style?.backgroundImage||'';
      for(const match of bg.matchAll(/url\(["']?([^"')]+)["']?\)/g))addUrl(match[1]);
    };
    document.querySelectorAll('*').forEach(el=>{
      addStyleUrls(getComputedStyle(el));
      addStyleUrls(getComputedStyle(el,'::before'));
      addStyleUrls(getComputedStyle(el,'::after'));
    });
    const raster=[...urls].filter(url=>/\.(?:webp|png|jpe?g)(?:[?#].*)?$/i.test(url));
    const out=[];
    for(const url of raster){
      const img=new Image();
      img.src=url;
      let error=null;
      try{
        if(typeof img.decode==='function')await img.decode();
        else await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('load failed'))});
      }catch(err){error=String(err?.message||err)}
      out.push({url,ok:!error&&img.naturalWidth>0&&img.naturalHeight>0,width:img.naturalWidth,height:img.naturalHeight,error});
    }
    return out;
  });
}

for(const width of widths){
  const c=await makeContext(width);
  for(const route of routes){
    const p=await c.newPage();
    await p.goto(base+route,{waitUntil:'domcontentloaded'});
    await p.waitForTimeout(220);
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

    // Decode every raster referenced by target-route DOM/CSS once at desktop width.
    // Existence/content-length alone is insufficient: a truncated WebP can still pass static/build checks.
    if(width===1440){
      const health=await rasterHealth(p);
      for(const item of health)expect(item.ok,`${label}: raster failed browser decode ${JSON.stringify(item)}`);
    }

    if(route==='/'){
      expect(await p.locator('.dc-course-prototype__mentor').count()===1,`${label}: Home Valentin mentor-card count drifted`);
      expect(!(await p.locator('body').innerText()).includes('Дементор: Валентин Лосев.'),`${label}: Home duplicate Valentin attribution visible`);

      const homeEvent=p.locator('section.dc-event:has(a[href="/events/fuengirola/"])');
      expect(await homeEvent.count()===1,`${label}: Home Fuengirola feature missing/duplicated`);
      if(await homeEvent.count()){
        expect(await homeEvent.locator('.dc-dementor-link').count()===1,`${label}: Home Fuengirola must expose exactly one semantic Gabil relation after runtime`);
        const eventBox=await homeEvent.boundingBox();
        if(eventBox&&width>700){
          expect(eventBox.x>=-1&&eventBox.x<=1,`${label}: Home Fuengirola is not full-bleed from viewport left ${JSON.stringify(eventBox)}`);
          expect(eventBox.width>=width-1&&eventBox.width<=width+1,`${label}: Home Fuengirola is not viewport-wide ${JSON.stringify(eventBox)}`);
        }
        const shell=homeEvent.locator(':scope > .dc-shell');
        const shellBox=await shell.boundingBox();
        const layers=await homeEvent.evaluate(el=>{
          const after=getComputedStyle(el,'::after');
          const beforeVeil=getComputedStyle(el,'::before');
          const action=el.querySelector('.dc-event__action');
          const actionBefore=action?getComputedStyle(action,'::before'):null;
          const actionAfter=action?getComputedStyle(action,'::after'):null;
          const own=getComputedStyle(el);
          const shellEl=el.querySelector(':scope > .dc-shell');
          const shellStyle=shellEl?getComputedStyle(shellEl):null;
          const alphas=[...beforeVeil.backgroundImage.matchAll(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([0-9.]+)\s*\)/g)].map(m=>Number(m[1]));
          const stops=[...beforeVeil.backgroundImage.matchAll(/([0-9.]+)%/g)].map(m=>Number(m[1]));
          return {
            backgroundImage:own.backgroundImage,
            backgroundSize:own.backgroundSize,
            backgroundPosition:own.backgroundPosition,
            veilDisplay:beforeVeil.display,
            veilBackground:beforeVeil.backgroundImage,
            veilMaxAlpha:alphas.length?Math.max(...alphas):0,
            veilEndPct:stops.length?Math.max(...stops):0,
            shellBackground:shellStyle?.backgroundColor||null,
            overlayDisplay:after.display,
            overlayContent:after.content,
            overlayBackgroundImage:after.backgroundImage,
            actionBeforeDisplay:actionBefore?.display||null,
            actionBeforeContent:actionBefore?.content||null,
            actionBeforeBackgroundImage:actionBefore?.backgroundImage||null,
            actionAfterDisplay:actionAfter?.display||null,
            actionAfterContent:actionAfter?.content||null
          };
        });
        expect(layers.backgroundImage.includes('event-fuengirola-03.webp'),`${label}: Home Fuengirola canonical decodable event asset is not the active section background`);
        expect(!layers.backgroundImage.includes('fuengirola-banner.webp'),`${label}: retired/corrupted Fuengirola banner returned to active background`);
        if(width>700)expect(layers.backgroundSize==='cover',`${label}: Home Fuengirola desktop background must cover full feature; actual=${layers.backgroundSize}`);
        expect(layers.overlayDisplay==='none'&&layers.overlayBackgroundImage==='none',`${label}: duplicate Fuengirola pseudo-image layer survived ${JSON.stringify(layers)}`);
        expect(layers.actionBeforeDisplay==='none'&&layers.actionAfterDisplay==='none',`${label}: decorative duplicate Gabil CTA pseudo-treatment survived ${JSON.stringify(layers)}`);
        expect(layers.shellBackground==='rgba(0, 0, 0, 0)'||layers.shellBackground==='transparent',`${label}: Home Fuengirola copy shell became an opaque panel: ${layers.shellBackground}`);
        if(width>1100){
          expect(shellBox&&shellBox.width<=562&&shellBox.width>=500,`${label}: Home Fuengirola copy shell must stay in ~520–560px band ${JSON.stringify(shellBox)}`);
          expect(layers.veilMaxAlpha<=.79&&layers.veilEndPct<=42,`${label}: Home veil too opaque/wide; visual-card regression ${JSON.stringify(layers)}`);
        }else if(width>900){
          expect(shellBox&&shellBox.width<=522,`${label}: Home Fuengirola 1024 copy shell too wide ${JSON.stringify(shellBox)}`);
          expect(layers.veilMaxAlpha<=.81&&layers.veilEndPct<=49,`${label}: Home 1024 veil too opaque/wide ${JSON.stringify(layers)}`);
        }else if(width>700){
          expect(shellBox&&shellBox.width<=502,`${label}: Home Fuengirola tablet copy shell too wide ${JSON.stringify(shellBox)}`);
          expect(layers.veilMaxAlpha<=.85&&layers.veilEndPct<=55,`${label}: Home tablet veil too opaque/wide ${JSON.stringify(layers)}`);
        }else{
          expect(layers.veilDisplay==='none',`${label}: Home mobile must not use desktop veil`);
        }

        if(visualWidths.has(width)){
          // Reproduce the settled in-view state before capturing the visual reference.
          // Without this explicit scroll/wait the Home section can still be at the motion-reveal opacity:0 state,
          // producing a false baseline that contains only the background image.
          await homeEvent.scrollIntoViewIfNeeded();
          await p.waitForTimeout(850);
          const settled=await shell.evaluate(el=>({opacity:Number(getComputedStyle(el).opacity),visibleClass:el.classList.contains('is-visible')}));
          expect(settled.opacity>=.99,`${label}: Home Fuengirola visual reference captured before reveal settled ${JSON.stringify(settled)}`);
          expect(await homeEvent.locator('.dc-event__title').count()===1,`${label}: Home Fuengirola title missing before screenshot`);
          expect(await homeEvent.locator('.dc-event__desc').count()===1,`${label}: Home Fuengirola description missing before screenshot`);
          expect(await homeEvent.locator('.dc-event__action').count()===1,`${label}: Home Fuengirola CTA missing before screenshot`);
          // Header/skip-link geometry is validated separately above. Exclude sticky overlays from the event-only visual reference.
          await p.addStyleTag({content:'.dc-global-header,a[href="#main-content"]{visibility:hidden!important}'});
          const file=path.join(visualDir,`home-fuengirola-${width}.png`);
          const shot=await homeEvent.screenshot({path:file,animations:'disabled'});
          const hash=visualHash(shot);
          console.log(`VISUAL_REF home-fuengirola@${width} hash=${hash}`);
          const baseline=visualBaselines?.widths?.[String(width)];
          if(!baseline){
            errors.push(`${label}: visual baseline missing in ${path.relative(process.cwd(),visualBaselinePath)}; candidate hash=${hash}`);
          }else{
            const distance=hammingHex(hash,baseline.hash);
            const maxDistance=Number.isFinite(baseline.maxDistance)?baseline.maxDistance:36;
            expect(distance<=maxDistance,`${label}: visual screenshot drift ${distance}>${maxDistance}; hash=${hash}; baseline=${baseline.hash}`);
          }
        }
      }
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
      expect(await p.locator('.dc-programme__empty-state').count()===0,`${label}: Events lifecycle mechanics returned to public DOM`);
      expect(await p.locator('.dc-editorial-opening').count()===0,`${label}: Events process editorial block returned`);
      expect(await p.locator('.dc-programme-note').count()===0,`${label}: Events archive/process note returned`);
      expect(await p.locator('.dc-footnotes').count()===0,`${label}: Events implementation footnotes returned`);
      expect((await p.locator('.dc-programme-intro').innerText()).includes('БЛИЖАЙШЕЕ СОБЫТИЕ'),`${label}: Events visitor-facing current-event label drifted`);
    }

    if(route==='/merch/'){
      const lead=await p.locator('.dc-entity-hero__lead').innerText();
      expect(lead.includes('Актуальная цена и доступность указаны на карточках.'),`${label}: Merch live-catalog hero copy drifted`);
      expect(await p.locator('.dc-boundary').count()===0,`${label}: Merch sales-rule intent block returned`);
      const merchText=await p.locator('body').innerText();
      for(const marker of ['SALES NOT OPEN','WEAR / PREVIEW','MERCH / SALES RULE','Визуальные макеты существуют'])expect(!merchText.includes(marker),`${label}: Merch preview/intent framing visible: ${marker}`);
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
console.log('✓ target-route raster assets browser-decode successfully at 1440');
console.log('✓ no horizontal overflow; canonical Header geometry preserved');
console.log('✓ Home Fuengirola one-poster veil/copy geometry + screenshot visual baselines at 1440/1024/390');
console.log('✓ Home Fuengirola one decodable canonical image owner + one semantic Gabil relation; Home Valentin; Community one-source hero');
console.log('✓ Fuengirola detail relation ownership + Gabil density; Events current-event presentation; Merch live-catalog framing');
console.log('✓ exact public implementation-marker denylist; mobile Events path remains tap-accessible');