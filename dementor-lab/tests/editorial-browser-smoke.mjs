import { chromium, devices } from 'playwright';
import assert from 'node:assert/strict';

const root=process.env.DEMENTOR_LAB_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({...devices['iPhone 13']});
const page=await context.newPage();
await page.goto(`${root}/editorial.html?seed=editorial-smoke`,{waitUntil:'networkidle'});

assert.match(await page.locator('body').innerText(),/ТРЕТЬЕ ОБЪЯСНЕНИЕ/);
assert.doesNotMatch(await page.locator('body').innerText(),/СОХРАНИТЬ КОНТАКТ/);

await page.locator('#to-brain').click();
await page.locator('#to-setup').click();
assert.equal(await page.locator('#top-status').textContent(),'SETUP');
assert.match(await page.locator('.sheet-card').innerText(),/третий раз объясняете идею/i);
assert.match(await page.locator('.sheet-card').innerText(),/ОСТАНОВИТЬСЯ ВОВРЕМЯ/);

await page.locator('[data-mode="step"]').click();
await page.locator('#play').click();
assert.equal(await page.locator('#top-status').textContent(),'TALK');

let listenerAcknowledged=false;
let hotPatchSeen=false;
for(let i=0;i<18;i++){
  const text=await page.locator('#dialogue').innerText();
  if(/я (это )?понял|понял и первый раз/i.test(text))listenerAcknowledged=true;
  if(await page.locator('#overlay:not([hidden]) [data-patch="repeat"]').count()){
    hotPatchSeen=true;
    assert.match(await page.locator('#overlay').innerText(),/РАЗГОВОР ПРОДОЛЖАЕТСЯ САМ/);
    break;
  }
  await page.locator('#next-turn').click();
  await page.waitForTimeout(30);
}
assert.equal(listenerAcknowledged,true,'listener should visibly acknowledge understanding');
assert.equal(hotPatchSeen,true,'editorial version still reaches the authored HOT PATCH');

await page.locator('[data-patch="repeat"]').click();
let resultSeen=false;
for(let i=0;i<30;i++){
  if((await page.locator('#top-status').textContent())==='RESULT'){resultSeen=true;break}
  await page.locator('#next-turn').click();
  await page.waitForTimeout(30);
}
assert.equal(resultSeen,true,'editorial scenario reaches RESULT');
assert.doesNotMatch(await page.locator('#result-title').textContent(),/НЕ ВЫВЕЗ/);
assert.ok((await page.locator('#result-cause').textContent()).trim().length>20);

await page.locator('#rerun').click();
assert.equal(await page.locator('#top-status').textContent(),'BRAIN');
await page.waitForTimeout(30);
assert.match(await page.locator('#replay-note').textContent(),/ТОТ ЖЕ РАЗГОВОР/);
assert.match(await page.locator('#replay-note').textContent(),/СОБЕСЕДНИК ТОТ ЖЕ/);

const layout=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}));
assert.ok(layout.scrollWidth<=layout.clientWidth+1,`no horizontal overflow: ${layout.scrollWidth}/${layout.clientWidth}`);

await browser.close();
console.log('DEMENTOR LAB editorial browser smoke: PASS');
