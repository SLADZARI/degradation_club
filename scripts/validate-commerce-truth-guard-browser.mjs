import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const errors=[];
const expect=(ok,msg)=>{if(!ok)errors.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg'};

function resolveFile(urlPath){
  let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);
  if(pathname.endsWith('/'))pathname+='index.html';
  const full=path.resolve(artifact,pathname.replace(/^\/+/,''));
  return full.startsWith(path.resolve(artifact)+path.sep)?full:null;
}

const server=http.createServer((req,res)=>{
  const file=resolveFile(req.url||'/');
  if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('Not found');return}
  res.setHeader('content-type',mime[path.extname(file).toLowerCase()]||'application/octet-stream');
  res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});

const rows=[
  {sku:'DC-OBJECT-001',title:'НЕ НАДО',item_type:'object',base_price_eur:520,sales_state:'preorder',public_visible:true,updated_at:'2026-08-30T11:14:26.287Z'},
  {sku:'SH-DEM-01',title:'OVERTHINKING IS MY CARDIO',item_type:'wear',base_price_eur:89,sales_state:'sold_out',public_visible:true,updated_at:'2026-08-30T11:14:26.287Z'},
  {sku:'SH-DEM-02',title:'PERSONAL GROWTH CANCELLED',item_type:'wear',base_price_eur:79,sales_state:'not_open',public_visible:true,updated_at:'2026-08-30T11:14:26.287Z'},
  {sku:'SH-DEM-03',title:'SUCCESS IS BORING',item_type:'wear',base_price_eur:79,sales_state:'not_open',public_visible:true,updated_at:'2026-08-30T11:14:26.287Z'}
];

function supabaseModule(data){
  return `
export function createClient(){
  const response=${JSON.stringify(data)};
  const chain={select(){return chain},eq(){return chain},then(resolve,reject){return Promise.resolve({data:response,error:null}).then(resolve,reject)}};
  return {from(){return chain}};
}
`;
}

async function installSupabaseStub(context,data=rows){
  await context.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',body:supabaseModule(data)}));
}

async function waitForState(page,selector,expected){
  await page.waitForFunction(({selector,expected})=>document.querySelector(selector)?.textContent?.includes(expected),{selector,expected},{timeout:4000}).catch(()=>{});
}

for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:1000}});
  await installSupabaseStub(context);

  const merch=await context.newPage();
  await merch.goto(base+'/merch/',{waitUntil:'domcontentloaded'});
  await waitForState(merch,'.dc-entity-row__status','€520');
  const objectIndexState=(await merch.locator('.dc-entity-row__status').innerText()).trim();
  expect(objectIndexState==='€520 / NOT OPEN',`merch@${width}: Object 001 preorder escaped readiness gate: ${objectIndexState}`);
  const firstCard=merch.locator('.dc-drop-card').filter({hasText:'SH-DEM-01'});
  const shirtState=(await firstCard.locator('.dc-drop-card__state span').nth(1).innerText()).trim();
  expect(shirtState==='NOT OPEN',`merch@${width}: raw SOLD OUT escaped readiness gate: ${shirtState}`);
  const heroFacts=await merch.locator('.dc-entity-hero__facts p').allInnerTexts();
  expect(heroFacts.some(text=>text.trim()==='SALES / NOT OPEN'),`merch@${width}: catalog implies open commerce ${JSON.stringify(heroFacts)}`);
  const merchGeometry=await merch.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth,objectRowVisible:!!document.querySelector('.dc-entity-row')?.getClientRects().length}));
  expect(merchGeometry.scrollWidth<=merchGeometry.innerWidth+1,`merch@${width}: public Merch overflows viewport ${JSON.stringify(merchGeometry)}`);
  expect(merchGeometry.objectRowVisible,`merch@${width}: Object 001 catalog row is not accessible in existing responsive composition`);
  await merch.close();

  const object=await context.newPage();
  await object.goto(base+'/objects/001-ne-nado/',{waitUntil:'domcontentloaded'});
  await waitForState(object,'.dc-object-hero__price','€520');
  const objectState=await object.evaluate(()=>({
    heroPrice:document.querySelector('.dc-object-hero__price')?.textContent?.trim(),
    heroState:document.querySelector('.dc-object-hero__state')?.textContent?.replace(/\s+/g,' ').trim(),
    priceFact:[...document.querySelectorAll('.dc-object-fact')].find(row=>row.querySelector('span')?.textContent?.trim()==='Price')?.querySelector('strong')?.textContent?.trim(),
    availability:[...document.querySelectorAll('.dc-object-fact')].find(row=>row.querySelector('span')?.textContent?.trim()==='Availability')?.querySelector('strong')?.textContent?.trim(),
    dataset:document.documentElement.dataset.dcMerchState,
    commerceActions:[...document.querySelectorAll('[data-dc-commerce-action]')].map(el=>({hidden:el.hidden,disabled:el.getAttribute('aria-disabled')})),
    text:document.body.innerText,
    scrollWidth:document.documentElement.scrollWidth,
    innerWidth
  }));
  expect(objectState.heroPrice==='€520',`object@${width}: canonical Object 001 price missing ${JSON.stringify(objectState)}`);
  expect(objectState.priceFact==='€520',`object@${width}: canonical price fact missing ${JSON.stringify(objectState)}`);
  expect(objectState.heroState?.startsWith('SALES / NOT OPEN'),`object@${width}: source PREORDER escaped as public state ${JSON.stringify(objectState)}`);
  expect(objectState.availability==='NOT OPEN'&&objectState.dataset==='not_open',`object@${width}: public availability drifted ${JSON.stringify(objectState)}`);
  expect(!/€\s*220\b|EUR\s*220\b/i.test(objectState.text||''),`object@${width}: stale EUR 220 remains client-visible`);
  expect(objectState.commerceActions.every(x=>x.hidden&&x.disabled==='true'),`object@${width}: actionable commerce control visible while checkout disabled ${JSON.stringify(objectState.commerceActions)}`);
  expect(objectState.scrollWidth<=objectState.innerWidth+1,`object@${width}: Object 001 overflows viewport ${JSON.stringify(objectState)}`);
  await object.close();

  const shirt=await context.newPage();
  await shirt.goto(base+'/merch/drop-001/overthinking-is-my-cardio/',{waitUntil:'domcontentloaded'});
  await waitForState(shirt,'.dc-product__fact:nth-child(3) strong','NOT OPEN');
  const soldOutProjection=await shirt.evaluate(()=>({
    availability:[...document.querySelectorAll('.dc-product__fact')].find(row=>row.querySelector('span')?.textContent?.trim()==='Availability')?.querySelector('strong')?.textContent?.trim(),
    dataset:document.documentElement.dataset.dcMerchState,
    commerceActions:[...document.querySelectorAll('[data-dc-commerce-action]')].map(el=>({hidden:el.hidden,disabled:el.getAttribute('aria-disabled')}))
  }));
  expect(soldOutProjection.availability==='NOT OPEN'&&soldOutProjection.dataset==='not_open',`shirt@${width}: raw SOLD OUT projected as historical public commerce truth ${JSON.stringify(soldOutProjection)}`);
  expect(soldOutProjection.commerceActions.every(x=>x.hidden&&x.disabled==='true'),`shirt@${width}: commerce action visible while checkout disabled`);
  await shirt.close();
  await context.close();
}

// Runtime/CDN failure must leave safe pre-runtime HTML rather than stale price or actionable state.
{
  const context=await browser.newContext({viewport:{width:390,height:1000}});
  await context.route('https://cdn.jsdelivr.net/**',route=>route.abort());
  const page=await context.newPage();
  await page.goto(base+'/objects/001-ne-nado/',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(250);
  const fallback=await page.evaluate(()=>({
    heroPrice:document.querySelector('.dc-object-hero__price')?.textContent?.trim(),
    availability:[...document.querySelectorAll('.dc-object-fact')].find(row=>row.querySelector('span')?.textContent?.trim()==='Availability')?.querySelector('strong')?.textContent?.trim(),
    text:document.body.innerText,
    commerceActions:[...document.querySelectorAll('[data-dc-commerce-action]')].map(el=>({hidden:el.hidden,disabled:el.getAttribute('aria-disabled')}))
  }));
  expect(fallback.heroPrice==='PRICE UNAVAILABLE',`runtime-failure: static price does not fail closed ${JSON.stringify(fallback)}`);
  expect(fallback.availability==='NOT OPEN',`runtime-failure: static commerce state is stronger than readiness ${JSON.stringify(fallback)}`);
  expect(!/€\s*220\b|EUR\s*220\b/i.test(fallback.text||''),`runtime-failure: stale EUR 220 exposed`);
  expect(fallback.commerceActions.every(x=>x.hidden||x.disabled==='true'),`runtime-failure: actionable commerce control survived without runtime`);
  await page.close();
  await context.close();
}

await browser.close();
await new Promise(resolve=>server.close(resolve));

if(errors.length){
  console.error('COMMERCE TRUTH GUARD BROWSER ACCEPTANCE BLOCKED');
  for(const error of errors)console.error(`- ${error}`);
  process.exit(1);
}
console.log('Commerce Truth Guard browser acceptance PASS');
console.log('✓ public Merch + Object 001 at 1440 / 390');
console.log('✓ source PREORDER + checkout disabled => NOT OPEN');
console.log('✓ source SOLD OUT without canonical proof => NOT OPEN');
console.log('✓ Object 001 runtime price => €520');
console.log('✓ runtime failure => PRICE UNAVAILABLE / NOT OPEN');
console.log('✓ no stale EUR 220 and no actionable commerce control while checkout is disabled');
