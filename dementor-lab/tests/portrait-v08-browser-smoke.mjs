import { chromium, devices } from 'playwright';
import assert from 'node:assert/strict';

const root=process.env.DEMENTOR_LAB_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({...devices['iPhone 13']});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
await page.goto(`${root}/prototypes/portrait-flow-v0.8.html?v=1`,{waitUntil:'networkidle'});

assert.equal(await page.locator('#status').textContent(),'INTRO');
await page.locator('[data-go="name"]').first().click();
await page.locator('#playerName').fill('Тестер');
await page.locator('#name [data-go="portrait"]').click();
assert.equal((await page.locator('#editName').textContent()).trim(),'ТЕСТЕР');
assert.equal(await page.locator('#portraitEdit svg').count(),1,'portrait SVG mounts');
await page.locator('#portrait [data-go="setup"]').click();
await page.locator('[data-objective="contact"]').click();
await page.locator('#setup [data-go="brain"]').click();
assert.equal(await page.locator('#brains .choice').count(),3,'three real brain presets are visible');
await page.locator('#brains .choice').first().click();
await page.locator('#start').click();
assert.equal(await page.locator('#talk').isVisible(),true);
assert.equal(await page.locator('#pa svg').count(),1,'player portrait persists into TALK');
assert.equal(await page.locator('#pb svg').count(),1,'opponent portrait mounts in TALK');

let patched=false;
for(let i=0;i<40;i++){
  if(await page.locator('#result').isVisible())break;
  if(await page.locator('#hot').isVisible()){
    assert.ok((await page.locator('#hotChain').textContent()).trim().length>1,'HOT PATCH has runtime recommendation');
    await page.locator('#patch').click();patched=true;continue;
  }
  if(await page.locator('#next').isVisible())await page.locator('#next').click();
  await page.waitForTimeout(15);
}
assert.equal(await page.locator('#result').isVisible(),true,'runtime reaches RESULT');
assert.ok((await page.locator('#punch').textContent()).trim().length>1,'RESULT verdict rendered');
assert.ok((await page.locator('#cause').textContent()).trim().length>1,'RESULT cause rendered from trace');
assert.ok((await page.locator('#dialogue .bubble').count())>0,'real dialogue transcript rendered');
assert.equal(errors.length,0,`browser errors: ${errors.join(' | ')}`);

await page.locator('#rerun').click();
assert.equal(await page.locator('#compare').isVisible(),true,'counterfactual reaches BEFORE/AFTER');
assert.ok((await page.locator('#before').textContent()).trim().length>1);
assert.ok((await page.locator('#after').textContent()).trim().length>1);
await page.locator('#saveCompare').click();
assert.equal(await page.locator('#archive').isVisible(),true,'run persists into archive');
assert.ok(await page.locator('#archiveList .archive-card').count()>=1,'archive has saved run');
await page.locator('#archiveList .archive-card').first().click();
assert.equal(await page.locator('#archiveDetail').isVisible(),true,'archive detail opens');
assert.ok((await page.locator('#detailChain').textContent()).trim().length>1,'archive detail keeps causal chain');

console.log(`portrait v0.8 iPhone smoke: PASS; hot patch encountered=${patched}`);
await browser.close();
