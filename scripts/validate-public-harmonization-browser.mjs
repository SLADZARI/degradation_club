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
    const addUrl=value=>{if(!value)return;try{urls.add(new URL(value,location.href).href)}catch{}};
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
      const img=new Image();img.src=url;let error=null;
      try{if(typeof img.decode==='function')await img.decode();else await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('load failed'))})}catch(err){error=String(err?.message||err)}
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
    await p.waitForTimeout(250);
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

    const publicText=await p.locator('body').innerText();
    const publicTextLower=publicText.toLowerCase();
    for(const marker of forbidden)expect(!publicTextLower.includes(marker.toLowerCase()),`${label}: forbidden public marker visible: ${marker}`);

    if(width===1440){
      const health=await rasterHealth(p);
      for(const item of health)expect(item.ok,`${label}: raster failed browser decode ${JSON.stringify(item)}`);
    }

    if(route==='/'){
      await p.waitForFunction(()=>document.querySelectorAll('#currentProgramHost [data-thing-ref]').length===3,{timeout:2500}).catch(()=>{});
      expect(await p.locator('#current-program').count()===1,`${label}: Home Current Program section missing/duplicated`);
      const cards=p.locator('#currentProgramHost [data-thing-ref]');
      expect(await cards.count()===3,`${label}: Home Current Program must render exactly 3 Things`);
      const refs=await cards.evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-thing-ref')));
      expect(JSON.stringify(refs)===JSON.stringify(['program:dengi-na-veter','project:dementor-lab','event:fuengirola']),`${label}: Home Current Program order/truth drifted ${JSON.stringify(refs)}`);
      const hrefs=await cards.locator('a[data-current-program-action]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')));
      expect(JSON.stringify(hrefs)===JSON.stringify(['/courses/dengi-na-veter/','/projects/dementor-lab/','/events/fuengirola/']),`${label}: Home Current Program actions drifted ${JSON.stringify(hrefs)}`);
      const labels=await cards.locator('a[data-current-program-action]').evaluateAll(nodes=>nodes.map(node=>(node.textContent||'').trim().replace(/\s*→$/,'')));
      expect(JSON.stringify(labels)===JSON.stringify(['ПРОЙТИ КУРС','ПОСМОТРЕТЬ LAB','ПОСМОТРЕТЬ СОБЫТИЕ']),`${label}: Home Current Program labels drifted ${JSON.stringify(labels)}`);
      expect(await p.locator('.dc-course-prototype').count()===0,`${label}: legacy Home course prototype survived`);
      expect(await p.locator('section.dc-event').count()===0,`${label}: legacy page-owned Home event feature survived`);
      expect(!publicText.includes('ACCESS AFTER JOIN'),`${label}: legacy Fuengirola Join gate visible`);
      expect(!publicText.includes('Подробности и возможность записаться доступны после вступления в клуб.'),`${label}: legacy Fuengirola membership promise visible`);
      expect(!publicText.includes('Думай с опасностью'),`${label}: non-selected course still dominates Home Current Program surface`);
      const programBox=await p.locator('#current-program').boundingBox();
      if(programBox)expect(programBox.x>=-1&&programBox.x+programBox.width<=width+1,`${label}: Current Program escapes viewport ${JSON.stringify(programBox)}`);
    }

    if(route==='/events/fuengirola/'){
      expect(await p.locator('.dc-event-hero__relation').count()===1,`${label}: Fuengirola static relation count drifted`);
      expect(await p.locator('.dc-event-detail__intro > .dc-dementor-link').count()===0,`${label}: Fuengirola runtime duplicate relation injected`);
      expect(await p.locator('.dc-dementor-feature--gabil').count()===0,`${label}: second dominant Gabil feature survived`);
      expect(await p.locator('.dc-event-hero__media img[src="/assets/ink/event-fuengirola-03.webp"]').count()===1,`${label}: Fuengirola detail canonical hero owner missing/duplicated`);
      expect(await p.locator('img[src="/assets/ink/event-fuengirola-03.webp"]').count()===1,`${label}: Fuengirola detail has multiple canonical event raster owners`);
      expect(await p.locator('.dc-event-hero__relation img[src*="/assets/people/dementors/gabil/"]').count()===1,`${label}: Fuengirola detail must expose exactly one Gabil portrait relation`);
      const detailTitle=p.locator('#fuengirola-title');
      expect(await detailTitle.count()===1,`${label}: Fuengirola H1 missing/duplicated`);
      if(await detailTitle.count()){
        const detailTitleBox=await detailTitle.boundingBox();
        const detailHeroBox=await p.locator('.dc-fuengirola-page .dc-entity-hero').boundingBox();
        const detailTitleState=await detailTitle.evaluate(el=>{const s=getComputedStyle(el);return {display:s.display,visibility:s.visibility,opacity:Number(s.opacity),text:el.textContent?.trim()||''}});
        expect(detailTitleState.text==='ФУЭНХИРОЛА'&&detailTitleState.display!=='none'&&detailTitleState.visibility!=='hidden'&&detailTitleState.opacity>.01&&detailTitleBox&&detailTitleBox.width>80&&detailTitleBox.height>30,`${label}: Fuengirola H1 is not visibly rendered ${JSON.stringify({detailTitleState,detailTitleBox})}`);
        if(detailTitleBox&&detailHeroBox)expect(detailTitleBox.y+detailTitleBox.height>detailHeroBox.y&&detailTitleBox.y<detailHeroBox.y+detailHeroBox.height,`${label}: Fuengirola H1 escaped the hero ${JSON.stringify({detailTitleBox,detailHeroBox})}`);
      }
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
      const eventRow=p.locator('.dc-catalog-row[href="/events/fuengirola/"]');
      expect(await eventRow.count()===1,`${label}: Events Fuengirola row missing/duplicated`);
      if(await eventRow.count())expect(await eventRow.getAttribute('data-preview-src')==='/assets/ink/event-fuengirola-03.webp',`${label}: Events preview source is not canonical`);
      expect(await p.locator('.dc-programme-intro .dc-ink-trace-media').count()===0,`${label}: persistent INK programme media owner survived`);
      const eventsInkState=await p.evaluate(()=>{
        const intro=document.querySelector('.dc-programme-intro');
        const after=intro?getComputedStyle(intro,'::after'):null;
        return {bodyLevel:document.body.dataset.inkLevel||null,bodyRole:document.body.dataset.inkRole||null,introTrace:intro?.classList.contains('dc-ink-trace')||false,afterDisplay:after?.display||null,afterContent:after?.content||null};
      });
      expect(eventsInkState.bodyLevel==='0'&&eventsInkState.bodyRole==='silence',`${label}: Events must not claim an Ink trace presentation role ${JSON.stringify(eventsInkState)}`);
      expect(!eventsInkState.introTrace,`${label}: orphan PROGRAMME TRACE class survived ${JSON.stringify(eventsInkState)}`);
      expect(eventsInkState.afterDisplay==='none'||eventsInkState.afterContent==='none'||eventsInkState.afterContent==='normal',`${label}: orphan PROGRAMME TRACE label is visible ${JSON.stringify(eventsInkState)}`);
      const eventsHero=p.locator('.dc-events-hero');
      const eventsTitle=p.locator('#events-title');
      expect(await eventsTitle.count()===1,`${label}: Events page title missing/duplicated`);
      const eventsHeroBox=await eventsHero.boundingBox();
      if(await eventsTitle.count()){
        const eventsTitleBox=await eventsTitle.boundingBox();
        const eventsTitleState=await eventsTitle.evaluate(el=>{const s=getComputedStyle(el);return {display:s.display,visibility:s.visibility,opacity:Number(s.opacity),text:el.textContent?.trim()||''}});
        expect(eventsTitleState.text==='СОБЫТИЯ'&&eventsTitleState.display!=='none'&&eventsTitleState.visibility!=='hidden'&&eventsTitleState.opacity>.01&&eventsTitleBox&&eventsTitleBox.width>40&&eventsTitleBox.height>20,`${label}: Events page title is not visibly owned by the compact header ${JSON.stringify({eventsTitleState,eventsTitleBox})}`);
      }
      if(eventsHeroBox){
        expect(eventsHeroBox.height<650,`${label}: Events header regressed to a full-screen/empty hero ${JSON.stringify(eventsHeroBox)}`);
        if(width<=700)expect(eventsHeroBox.height<500,`${label}: Events mobile header leaves excessive empty space ${JSON.stringify(eventsHeroBox)}`);
      }
      expect(await p.locator('.dc-programme__body > .dc-dementor-link').count()===0,`${label}: runtime Gabil card survived in Events listing`);
      expect(await p.locator('.dc-programme__body img[src*="/assets/people/dementors/gabil/"]').count()===0,`${label}: Gabil portrait must not be a listing presentation owner`);
      const persistentOwners=await p.evaluate(()=>{
        const canonical='event-fuengirola-03.webp';
        const visible=el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)>0&&r.width>0&&r.height>0};
        const owners=[];
        for(const el of document.querySelectorAll('body *')){
          if(el.closest('.dc-catalog-preview,.dc-catalog-mobile-preview'))continue;
          if(el instanceof HTMLImageElement&&(el.currentSrc||el.src||'').includes(canonical)&&visible(el))owners.push(`img:${el.className||el.parentElement?.className||'unclassified'}`);
          if(!visible(el))continue;
          for(const pseudo of [null,'::before','::after']){
            const style=getComputedStyle(el,pseudo);if(!(style.backgroundImage||'').includes(canonical))continue;
            if(pseudo&&style.display==='none')continue;
            owners.push(`${el.className||el.tagName}${pseudo||':background'}`);
          }
        }
        return owners;
      });
      expect(persistentOwners.length===0,`${label}: Events listing has persistent Fuengirola media owner(s) ${JSON.stringify(persistentOwners)}`);
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

{
  const c=await makeContext(390),p=await c.newPage();
  await p.goto(base+'/events/',{waitUntil:'domcontentloaded'});await p.waitForTimeout(180);
  const row=p.locator('.dc-catalog-row[href="/events/fuengirola/"]');
  expect(await row.count()===1,'/events/@390: Fuengirola row missing');
  if(await row.count()){
    await row.click();
    expect(await p.locator('.dc-catalog-mobile-preview').count()===1,'/events/@390: first tap did not expose mobile preview');
    expect(await p.locator('.dc-catalog-mobile-preview img[src="/assets/ink/event-fuengirola-03.webp"]').count()===1,'/events/@390: mobile preview is not using canonical Fuengirola asset');
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
console.log('✓ Home Current Program renders exactly 3 reviewed Things with exact actions and no legacy course/event funnel blocks');
console.log('✓ Community one-source hero remains intact');
console.log('✓ Events listing has no persistent Fuengirola/Gabil presentation owners or orphan trace; compact Events header stays visible');
console.log('✓ Fuengirola detail owns exactly one canonical hero raster + one Gabil portrait relation + visible H1; Merch live-catalog framing');
console.log('✓ exact public implementation-marker denylist; mobile Events path remains tap-accessible');
