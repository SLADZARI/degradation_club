import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const errors=[];
const expect=(ok,msg)=>{if(!ok)errors.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
const KEY='dementor_dumai_course_stage1';

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

const supabaseStub=`
export function createClient(){
 const chain={select(){return chain},eq(){return chain},order(){return chain},limit(){return chain},maybeSingle:async()=>({data:null,error:null}),then(resolve,reject){return Promise.resolve({data:[],error:null}).then(resolve,reject)}};
 return {auth:{getSession:async()=>({data:{session:null},error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),signInWithOAuth:async()=>({data:null,error:null})},from:()=>chain,rpc:async()=>({data:[],error:null})};
}
`;

const stateOf=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'{}'),KEY);
const eventKeys=state=>(state.events||[]).map(item=>typeof item==='string'?item:item?.key).filter(Boolean);

async function run(width){
 const context=await browser.newContext({viewport:{width,height:1000}});
 await context.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',body:supabaseStub}));
 const page=await context.newPage();
 const label=`dso@${width}`;
 await page.goto(base+'/courses/dumai-s-opasnostyu/',{waitUntil:'domcontentloaded'});
 expect((await page.locator('body').innerText()).includes('PUBLIC RELEASE'),`${label}: route does not literally present PUBLIC RELEASE`);

 // Fresh → start.
 await page.locator('#startBtn').click();
 await page.locator('#email').fill('phase2@example.test');
 await page.locator('#emailNext').click();
 await page.locator('#ruleYes').click();
 await page.locator('[data-domain="business"]').click();
 await page.locator('#domainNext').click();
 await page.locator('[data-single-key="decisionPreset"]').first().click();
 await page.locator('#decisionNext').click();
 await page.locator('#decisionConfirmBtn').click();
 await page.locator('#confidenceNext').click();
 await page.locator('#openCase').click();
 let state=await stateOf(page);
 expect(eventKeys(state).filter(x=>x==='experience-start').length===1,`${label}: experience_start not recorded exactly once`);

 // Meaningful Day 1 block.
 await page.locator('[data-go="d1intro"]').click();
 await page.locator('[data-go="d1expect"]').click();
 await page.locator('[data-single-key="expectedPreset"]').first().click();
 await page.locator('#expectedNext').click();
 for(let i=0;i<7;i++)await page.locator('[data-multi-key="assumptions"]').nth(i).click();
 await page.locator('#assumptionNext').click();
 for(let i=0;i<7;i++)await page.locator(`[data-type-index="${i}"]`).first().click();
 await page.locator('#classNext').click();
 await page.locator('[data-single-key="control1Preset"]').first().click();
 await page.locator('#controlNext').click();
 state=await stateOf(page);
 expect(state.screen==='d1summary',`${label}: meaningful block did not reach d1summary`);
 expect(eventKeys(state).filter(x=>x==='meaningful-progress:day1').length===1,`${label}: meaningful_progress not recorded exactly once`);

 // Persistence.
 await page.reload({waitUntil:'domcontentloaded'});
 state=await stateOf(page);
 expect(state.screen==='d1summary',`${label}: progress did not persist across reload`);
 expect(eventKeys(state).filter(x=>x==='experience-start').length===1,`${label}: reload duplicated experience_start`);
 expect(eventKeys(state).filter(x=>x==='meaningful-progress:day1').length===1,`${label}: reload duplicated meaningful_progress`);

 // Seed the already-validated course body at exam result, then test the real completion transition.
 await page.evaluate(key=>{
   const s=JSON.parse(localStorage.getItem(key)||'{}');
   s.screen='examResult';s.examPassed=true;s.finalDecision='change';s.status='active';
   localStorage.setItem(key,JSON.stringify(s));
 },KEY);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.locator('[data-go="completed"]').click();
 state=await stateOf(page);
 expect(state.status==='completed'&&Boolean(state.completedAt),`${label}: completion state not persisted`);
 expect(eventKeys(state).filter(x=>x==='experience-complete').length===1,`${label}: completion event not recorded exactly once`);

 // Completion → Danger Map → certificate → one continuation.
 await page.locator('[data-go="dangerMap"]').click();
 await page.locator('[data-go="certificate"]').click();
 const cert=page.locator('.cert');
 const continuation=page.locator('[data-course-continuation]');
 expect(await cert.count()===1,`${label}: certificate missing`);
 expect((await cert.innerText()).includes('Сертификат повышенной подозрительности'),`${label}: wrong certificate semantics`);
 expect(await continuation.count()===1,`${label}: expected exactly one continuation`);
 expect(await continuation.getAttribute('data-thing-ref')==='program:dengi-na-veter',`${label}: continuation Thing ref drifted`);
 expect(await page.locator('[data-course-continuation-action]').count()===1,`${label}: continuation primary action count drifted`);
 expect(await page.locator('[data-course-continuation-action]').getAttribute('href')==='/courses/dengi-na-veter/',`${label}: continuation route drifted`);
 expect((await continuation.innerText()).includes('ДАЛЬШЕ'),`${label}: first continuation exposure incorrectly marked as return`);
 const box=await continuation.boundingBox();
 if(box)expect(box.x>=-1&&box.x+box.width<=width+1,`${label}: continuation escapes viewport ${JSON.stringify(box)}`);
 state=await stateOf(page);
 expect(state.lastSeenContinuationVersion==='v1',`${label}: first continuation version not recorded`);
 expect(eventKeys(state).filter(x=>x==='completion-artifact').length===1,`${label}: certificate evidence event missing/duplicated`);
 expect(eventKeys(state).filter(x=>x.startsWith('return-payoff:')).length===0,`${label}: first continuation exposure created fake return payoff`);

 // Open the real next Thing and verify the causal continuation event.
 await Promise.all([
   page.waitForURL('**/courses/dengi-na-veter/'),
   page.locator('[data-course-continuation-action]').click()
 ]);
 state=await stateOf(page);
 expect(eventKeys(state).filter(x=>x==='continuation-open:v1').length===1,`${label}: continuation_open missing/duplicated`);

 // Completed-user revisit with same version: no payoff.
 await page.goto(base+'/courses/dumai-s-opasnostyu/',{waitUntil:'domcontentloaded'});
 state=await stateOf(page);
 expect(eventKeys(state).filter(x=>x.startsWith('return-payoff:')).length===0,`${label}: same continuation created return payoff`);

 // Synthetic future editorial delta: seen legacy-v0, current approved v1.
 await page.evaluate(key=>{
   const s=JSON.parse(localStorage.getItem(key)||'{}');
   s.screen='certificate';
   s.lastSeenContinuationVersion='legacy-v0';
   s.events=(s.events||[]).filter(item=>!String(typeof item==='string'?item:item?.key||'').startsWith('return-payoff:'));
   localStorage.setItem(key,JSON.stringify(s));
 },KEY);
 await page.reload({waitUntil:'domcontentloaded'});
 expect((await page.locator('[data-course-continuation]').innerText()).includes('НОВОЕ ПРОДОЛЖЕНИЕ'),`${label}: version delta not presented as new continuation`);
 state=await stateOf(page);
 expect(eventKeys(state).filter(x=>x==='return-payoff:v1').length===1,`${label}: meaningful continuation delta did not create exactly one return_payoff`);
 expect(state.lastSeenContinuationVersion==='v1',`${label}: delta exposure did not advance seen version`);

 // Same current version again: no duplicate payoff.
 await page.reload({waitUntil:'domcontentloaded'});
 state=await stateOf(page);
 expect(eventKeys(state).filter(x=>x==='return-payoff:v1').length===1,`${label}: same continuation version duplicated return_payoff`);
 expect(!(await page.locator('[data-course-continuation]').innerText()).includes('НОВОЕ ПРОДОЛЖЕНИЕ'),`${label}: same continuation still shown as new after exposure`);

 await context.close();
}

for(const width of [1440,390])await run(width);
await browser.close();
await new Promise(resolve=>server.close(resolve));

if(errors.length){
 console.error('DUMAI RELEASE LOOP BROWSER ACCEPTANCE BLOCKED');
 errors.forEach(e=>console.error(`- ${e}`));
 process.exit(1);
}
console.log('Dumai s opasnostyu Release Loop browser acceptance PASS');
console.log('✓ fresh → start → meaningful progress → reload persistence');
console.log('✓ completion → Danger Map → certificate → exactly one continuation');
console.log('✓ first continuation exposure and same-version revisit do not create Return');
console.log('✓ synthetic continuation-version delta creates return_payoff exactly once');
console.log('✓ desktop 1440 + mobile 390');
