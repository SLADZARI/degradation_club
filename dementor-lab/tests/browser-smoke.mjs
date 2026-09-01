import { chromium, devices } from 'playwright';
import assert from 'node:assert/strict';
const root=process.env.DEMENTOR_LAB_URL||'http://127.0.0.1:4173';
const baseURL=`${root}?seed=browser-smoke-opponent`;
const browser=await chromium.launch({headless:true});const context=await browser.newContext({...devices['iPhone 13']});const page=await context.newPage();
await page.goto(baseURL,{waitUntil:'networkidle'});
assert.equal(await page.locator('#top-status').textContent(),'PERSON');
assert.equal(await page.locator('#person-preview svg').count(),1,'semantic character asset is mounted');
assert.equal(await page.locator('.character-switch [data-character]').count(),2,'PERSON exposes exactly two body-rig controls');
assert.equal(await page.locator('[data-part]').count(),6,'appearance panel exposes six semantic parts');
assert.equal(await page.locator('#person-preview #hat').isVisible(),true,'shared hat starts visible');
await page.locator('[data-part="hat"]').click();assert.equal(await page.locator('#person-preview #hat').isVisible(),false,'shared accessory can be hidden');
await page.locator('.character-switch [data-character="character-02"]').click();await page.waitForTimeout(80);
assert.equal(await page.locator('#person-preview').getAttribute('data-character'),'character-02','female body rig mounts');
assert.equal(await page.locator('#person-preview #hat').isVisible(),false,'shared accessory state survives body switch');
assert.equal(await page.locator('#person-preview #outfit').isVisible(),true,'female character keeps own outfit');
assert.equal(await page.locator('#person-preview #shoes').isVisible(),true,'female character keeps own shoes');
await page.locator('[data-part="hat"]').click();assert.equal(await page.locator('#person-preview #hat').isVisible(),true,'shared hat restores on female rig');

await page.locator('#to-brain').click();assert.equal(await page.locator('#top-status').textContent(),'BRAIN');assert.ok(await page.locator('#brain-graph .brain-node').count()>=5);
await page.locator('#to-setup').click();assert.equal(await page.locator('#top-status').textContent(),'SETUP');
assert.ok((await page.locator('#opponent-name').textContent()).trim().length>0,'SETUP names the opponent');
assert.ok((await page.locator('#opponent-preset').textContent()).trim().length>0,'SETUP exposes authored opponent brain preset');
assert.ok((await page.locator('#opponent-description').textContent()).trim().length>20,'SETUP describes opponent behavior tendency');
const opponentCharacter=await page.locator('#opponent-card').getAttribute('data-character');const opponentPreset=await page.locator('#opponent-card').getAttribute('data-preset');assert.ok(['character-01','character-02'].includes(opponentCharacter));assert.ok(opponentPreset);
await page.locator('[data-mode="step"]').click();await page.locator('#play').click();assert.equal(await page.locator('#top-status').textContent(),'TALK');
assert.equal(await page.locator('#actor-a').getAttribute('data-character'),'character-02','selected player rig persists into TALK');assert.equal(await page.locator('#actor-b').getAttribute('data-character'),opponentCharacter,'generated opponent rig persists into TALK');
let hotPatchSeen=false;for(let i=0;i<16;i++){if(await page.locator('#overlay:not([hidden]) [data-patch="repeat"]').count()){hotPatchSeen=true;break}await page.locator('#next-turn').click();await page.waitForTimeout(30)}
assert.equal(hotPatchSeen,true,'predictive HOT PATCH should appear in authored scenario');const turnBeforePatch=Number(await page.locator('#turn').textContent());await page.locator('[data-patch="repeat"]').click();assert.equal(Number(await page.locator('#turn').textContent()),turnBeforePatch,'HOT PATCH must not consume a turn');
let resultSeen=false;for(let i=0;i<28;i++){if((await page.locator('#top-status').textContent())==='RESULT'){resultSeen=true;break}await page.locator('#next-turn').click();await page.waitForTimeout(30)}
assert.equal(resultSeen,true,'authored scenario should reach RESULT');assert.ok((await page.locator('#result-cause').textContent()).trim().length>0);assert.ok((await page.locator('#result-node').textContent()).trim().length>0);
await page.locator('#rerun').click();assert.equal(await page.locator('#top-status').textContent(),'BRAIN');assert.equal(await page.locator('#replay-note').isVisible(),true);assert.match(await page.locator('#replay-note').textContent(),/СОПЕРНИК ТОТ ЖЕ/);assert.equal(await page.locator('#actor-b').getAttribute('data-character'),opponentCharacter,'counterfactual replay keeps same opponent body');assert.equal(await page.locator('#brain-editor input:disabled').count(),1,'counterfactual replay locks the non-target control');
const viewport=page.viewportSize(),layout=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}));assert.ok(layout.scrollWidth<=layout.clientWidth+1,`no horizontal overflow: ${layout.scrollWidth}/${layout.clientWidth}`);assert.ok(viewport?.width<=430,'smoke test runs in small-phone viewport');
await browser.close();console.log('DEMENTOR LAB browser smoke: PASS');
