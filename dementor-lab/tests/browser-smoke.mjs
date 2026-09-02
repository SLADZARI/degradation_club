import { chromium, devices } from 'playwright';
import assert from 'node:assert/strict';
const root=process.env.DEMENTOR_LAB_URL||'http://127.0.0.1:4173';
const baseURL=`${root}?seed=browser-smoke-opponent`;
const browser=await chromium.launch({headless:true});const context=await browser.newContext({...devices['iPhone 13']});const page=await context.newPage();
await page.goto(baseURL,{waitUntil:'networkidle'});
assert.equal(await page.locator('#top-status').textContent(),'PERSON');
assert.equal(await page.locator('#person-preview svg').count(),1,'exact character asset is mounted');
assert.equal(await page.locator('.character-switch [data-character]').count(),2,'PERSON exposes exactly two body-rig controls');
assert.equal(await page.locator('[data-part]').count(),6,'appearance panel exposes six semantic parts');

assert.equal(await page.locator('[data-part="hat"]').getAttribute('data-variant-count'),'7');
assert.equal(await page.locator('[data-part="glasses"]').getAttribute('data-variant-count'),'4');
assert.equal(await page.locator('[data-part="beard"]').getAttribute('data-variant-count'),'4');
await page.locator('[data-part="hat"]').click();await page.locator('#variant-options [data-variant="hat-01"]').click();assert.equal(await page.locator('#person-preview #hat-01').isVisible(),true);
await page.locator('.character-switch [data-character="character-02"]').click();await page.waitForTimeout(80);
assert.equal(await page.locator('[data-part="beard"]').getAttribute('data-variant-count'),'0','female keeps authored asymmetry');
assert.equal(await page.locator('#person-preview #shoes-01').isVisible(),true,'female shoes wrapper remains visible');

await page.locator('#to-brain').click();assert.equal(await page.locator('#top-status').textContent(),'BRAIN');
assert.ok(await page.locator('#brain-presets [data-brain-preset]').count()>=7,'behavioral preset rail is restored');
await page.locator('[data-brain-preset="custom"]').click();
assert.equal(await page.locator('#to-setup').isDisabled(),true,'blank custom brain is not runnable');
assert.equal(await page.locator('#brain-validation').getAttribute('data-code'),'NO_TRIGGER','blank brain reports the engine validation code while copy stays human');

async function addNode(type){await page.locator('#brain-add-node').click();await page.locator(`[data-add-brain-node="${type}"]`).click();await page.waitForTimeout(20)}
await addNode('criticism');await addNode('explain');
const triggerWrap=page.locator('#brain-graph .brain-canvas-node').filter({hasText:'КРИТИКА'}).first();
const reactionWrap=page.locator('#brain-graph .brain-canvas-node').filter({hasText:'ОБЪЯСНИТЬ'}).first();
const triggerId=await triggerWrap.getAttribute('data-brain-node-wrap'),reactionId=await reactionWrap.getAttribute('data-brain-node-wrap');
await page.locator(`[data-brain-out="${triggerId}"]`).click();assert.ok(await page.locator('#brain-graph .connection-target').count()>=1,'compatible targets highlight during connection');await page.locator(`[data-brain-in="${reactionId}"]`).click();
assert.equal(await page.locator('#brain-graph .brain-link').count(),1,'port-to-port tap creates a real edge');assert.equal(await page.locator('#to-setup').isDisabled(),false,'connected trigger to reaction makes graph runnable');

await addNode('beright');const impulseWrap=page.locator('#brain-graph .brain-canvas-node').filter({hasText:'БЫТЬ ПРАВЫМ'}).first();const impulseId=await impulseWrap.getAttribute('data-brain-node-wrap');
await page.locator(`[data-brain-out="${triggerId}"]`).click();await page.locator(`[data-brain-in="${impulseId}"]`).click();await page.locator(`[data-brain-out="${impulseId}"]`).click();await page.locator(`[data-brain-in="${reactionId}"]`).click();
assert.equal(await page.locator('#brain-graph .brain-link').count(),3,'one source can create a second real branch and rejoin');
await page.locator(`[data-brain-node="${impulseId}"]`).click();assert.equal(await page.locator('#brain-inspector').isVisible(),true,'node tap opens inspector');const before=await page.locator('#brain-inspector output').textContent();await page.locator('#brain-inspector [data-brain-inc]').click();assert.notEqual(await page.locator('#brain-inspector output').textContent(),before,'inspector mutates selected node parameter');

await page.locator('[data-brain-preset="always-right"]').click();assert.equal(await page.locator('#to-setup').isDisabled(),false,'authored preset is a runnable real graph');
await page.locator('#to-setup').click();assert.equal(await page.locator('#top-status').textContent(),'SETUP');assert.ok((await page.locator('#opponent-name').textContent()).trim().length>0);const opponentCharacter=await page.locator('#opponent-card').getAttribute('data-character');
await page.locator('[data-mode="step"]').click();await page.locator('#play').click();assert.equal(await page.locator('#top-status').textContent(),'TALK');assert.equal(await page.locator('#actor-a').getAttribute('data-character'),'character-02');assert.equal(await page.locator('#actor-b').getAttribute('data-character'),opponentCharacter);
let hotPatchSeen=false;for(let i=0;i<18;i++){if(await page.locator('#overlay:not([hidden]) [data-patch="repeat"]').count()){hotPatchSeen=true;break}await page.locator('#next-turn').click();await page.waitForTimeout(30)}
assert.equal(hotPatchSeen,true,'predictive HOT PATCH appears from the selected preset graph');const turnBeforePatch=Number(await page.locator('#turn').textContent());await page.locator('[data-patch="repeat"]').click();assert.equal(Number(await page.locator('#turn').textContent()),turnBeforePatch);
let resultSeen=false;for(let i=0;i<30;i++){if((await page.locator('#top-status').textContent())==='RESULT'){resultSeen=true;break}await page.locator('#next-turn').click();await page.waitForTimeout(30)}
assert.equal(resultSeen,true);assert.ok((await page.locator('#result-cause').textContent()).trim().length>0);
await page.locator('#rerun').click();assert.equal(await page.locator('#top-status').textContent(),'BRAIN');assert.equal(await page.locator('#replay-note').isVisible(),true);assert.match(await page.locator('#replay-note').textContent(),/СОПЕРНИК ТОТ ЖЕ/);assert.equal(await page.locator('#brain-add-node').isVisible(),false,'counterfactual replay hides graph expansion');assert.ok(await page.locator('#brain-graph .brain-canvas-node.locked').count()>=1,'non-target nodes are locked during one-cause replay');
const viewport=page.viewportSize(),layout=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}));assert.ok(layout.scrollWidth<=layout.clientWidth+1,`no page-level horizontal overflow: ${layout.scrollWidth}/${layout.clientWidth}`);assert.ok(viewport?.width<=430);
await browser.close();console.log('DEMENTOR LAB browser smoke: PASS — exact characters and real BRAIN constructor work in phone-sized flow');
