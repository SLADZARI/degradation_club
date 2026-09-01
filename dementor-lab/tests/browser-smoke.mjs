import { chromium, devices } from 'playwright';
import assert from 'node:assert/strict';

const baseURL=process.env.DEMENTOR_LAB_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({...devices['iPhone 13']});
const page=await context.newPage();

await page.goto(baseURL,{waitUntil:'networkidle'});
assert.equal(await page.locator('#top-status').textContent(),'PERSON');
await page.locator('#to-brain').click();
assert.equal(await page.locator('#top-status').textContent(),'BRAIN');
assert.ok(await page.locator('#brain-graph .brain-node').count()>=5);

await page.locator('#to-setup').click();
assert.equal(await page.locator('#top-status').textContent(),'SETUP');
await page.locator('[data-mode="step"]').click();
await page.locator('#play').click();
assert.equal(await page.locator('#top-status').textContent(),'TALK');

let hotPatchSeen=false;
for(let i=0;i<16;i++){
  if(await page.locator('#overlay:not([hidden]) [data-patch="repeat"]').count()){
    hotPatchSeen=true;
    break;
  }
  await page.locator('#next-turn').click();
  await page.waitForTimeout(30);
}
assert.equal(hotPatchSeen,true,'predictive HOT PATCH should appear in authored scenario');
const turnBeforePatch=Number(await page.locator('#turn').textContent());
await page.locator('[data-patch="repeat"]').click();
assert.equal(Number(await page.locator('#turn').textContent()),turnBeforePatch,'HOT PATCH must not consume a turn');

let resultSeen=false;
for(let i=0;i<28;i++){
  if((await page.locator('#top-status').textContent())==='RESULT'){resultSeen=true;break}
  await page.locator('#next-turn').click();
  await page.waitForTimeout(30);
}
assert.equal(resultSeen,true,'authored scenario should reach RESULT');
assert.ok((await page.locator('#result-cause').textContent()).trim().length>0);
assert.ok((await page.locator('#result-node').textContent()).trim().length>0);

await page.locator('#rerun').click();
assert.equal(await page.locator('#top-status').textContent(),'BRAIN');
assert.equal(await page.locator('#replay-note').isVisible(),true);
assert.equal(await page.locator('#brain-editor input:disabled').count(),1,'counterfactual replay locks the non-target control');

const viewport=page.viewportSize();
const layout=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}));
assert.ok(layout.scrollWidth<=layout.clientWidth+1,`no horizontal overflow: ${layout.scrollWidth}/${layout.clientWidth}`);
assert.ok(viewport?.width<=430,'smoke test runs in small-phone viewport');

await browser.close();
console.log('DEMENTOR LAB browser smoke: PASS');
