import { chromium, devices } from 'playwright';
import assert from 'node:assert/strict';

const root=process.env.DEMENTOR_LAB_URL||'http://127.0.0.1:4173';
const combos=[
  {preset:'EXPLAIN_LOOP',index:0,objective:'contact'},
  {preset:'EXPLAIN_LOOP',index:0,objective:'direct-answer'},
  {preset:'KEEP_PEACE',index:1,objective:'contact'},
  {preset:'KEEP_PEACE',index:1,objective:'direct-answer'},
  {preset:'PRESS_FOR_ANSWER',index:2,objective:'contact'},
  {preset:'PRESS_FOR_ANSWER',index:2,objective:'direct-answer'}
];
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({...devices['iPhone 13']});
const results=[];let hotPatchCount=0;

for(const combo of combos){
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(`${root}/prototypes/portrait-flow-v0.8.html?combo=${combo.preset}-${combo.objective}`,{waitUntil:'networkidle'});
  await page.locator('[data-go="name"]').first().click();
  await page.locator('#playerName').fill(`${combo.preset.slice(0,8)}-${combo.objective==='contact'?'C':'A'}`);
  await page.locator('#name [data-go="portrait"]').click();
  await page.locator('#portrait [data-go="setup"]').click();
  await page.locator(`[data-objective="${combo.objective}"]`).click();
  const expectedCase=combo.objective==='contact'?'КРИТИКА ИДЕИ':'НЕУДОБНЫЙ ВОПРОС';
  assert.equal((await page.locator('#caseTitle').textContent()).trim(),expectedCase,'visible case must match selected runtime scenario');
  await page.locator('#setup [data-go="brain"]').click();
  assert.equal(await page.locator('#brains .choice').count(),3,'three exposed BRAIN presets required');
  await page.locator('#brains .choice').nth(combo.index).click();
  await page.locator('#start').click();
  assert.equal(await page.locator('#vs').isVisible(),true,'preflight required');
  assert.equal((await page.locator('#vsCase').textContent()).trim(),expectedCase);
  await page.locator('#launch').click();
  let localHot=0;
  for(let i=0;i<60;i++){
    if(await page.locator('#result').isVisible())break;
    if(await page.locator('#hot').isVisible()){
      assert.ok((await page.locator('#hotChain').textContent()).trim().length>2,'HOT PATCH must explain its one-cause repair');
      await page.locator('#patch').click();localHot++;hotPatchCount++;continue;
    }
    if(await page.locator('#next').isVisible())await page.locator('#next').click();
    await page.waitForTimeout(8);
  }
  assert.equal(await page.locator('#result').isVisible(),true,`${combo.preset}/${combo.objective} must reach result in browser`);
  const punch=(await page.locator('#punch').textContent()).trim();
  assert.ok(punch.length>2,'result punchline required');
  assert.ok(await page.locator('#dialogue .bubble').count()>0,'real dialogue required');
  assert.equal(await page.locator('#talk .metric').count(),2,'portrait TALK keeps only BRAIN + CONTACT persistent');
  assert.deepEqual(errors,[],`uncaught browser errors for ${combo.preset}/${combo.objective}`);
  await page.locator('#save').click();
  assert.equal(await page.locator('#archive').isVisible(),true,'completed run saves to Archive');
  results.push({key:`${combo.preset}/${combo.objective}`,punch,won:/СОХРАНЁН|ДОБЫТЫ/.test(punch),hotPatch:localHot});
  await page.close();
}

for(const objective of ['contact','direct-answer'])assert.ok(results.some(r=>r.key.endsWith(`/${objective}`)&&r.won),`${objective} needs a visibly winning exposed BRAIN`);
const archive=await context.newPage();
await archive.goto(`${root}/prototypes/portrait-flow-v0.8.html?archive=1`,{waitUntil:'networkidle'});
await archive.locator('#intro [data-go="archive"]').click();
assert.equal(await archive.locator('#archiveList .archive-card').count(),6,'all six experiments must coexist in localStorage archive');
await archive.reload({waitUntil:'networkidle'});
await archive.locator('#intro [data-go="archive"]').click();
assert.equal(await archive.locator('#archiveList .archive-card').count(),6,'archive must survive a full page reload');
assert.ok(hotPatchCount>=1,'six-way browser pass must exercise at least one real HOT PATCH UI path');
console.table(results);
console.log(`portrait v0.8 six-way browser: PASS; both goals viable; hot patches exercised=${hotPatchCount}; archive persisted=6`);
await browser.close();
