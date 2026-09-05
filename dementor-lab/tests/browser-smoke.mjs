import { chromium, devices } from 'playwright';
import assert from 'node:assert/strict';

const root=process.env.DEMENTOR_LAB_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({...devices['iPhone 13']});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
await page.goto(`${root}?v=11`,{waitUntil:'networkidle'});

assert.equal(await page.locator('#status').textContent(),'ПЕРСОНАЖ');
assert.equal(await page.locator('#person-live svg').count(),1,'PERSON mounts a real production SVG');
assert.equal(await page.locator('[data-base]').count(),2,'PERSON exposes both approved bases');
assert.equal(await page.locator('[data-cat]').count(),4,'PERSON returns to the compact four-part wardrobe taxonomy');
assert.match(await page.locator('[data-cat="hat"]').textContent(),/7/,'male base exposes seven authored hats');
assert.match(await page.locator('[data-cat="accessories"]').textContent(),/7/,'glasses and small accessories are one product-facing category');
assert.match(await page.locator('[data-cat="facialHair"]').textContent(),/4/,'male moustache/facial-hair category exposes four authored variants');
assert.equal(await page.locator('[data-cat="outfit"]').count(),1,'clothing remains a top-level category');
assert.equal(await page.locator('[data-cat="shoes"]').count(),0,'shoes are not exposed as a product-facing category');
assert.equal(await page.locator('.person-rule').count(),0,'implementation note is removed from PERSON');
assert.equal(await page.locator('.person-fact').count(),0,'QA evidence block is removed from PERSON');
assert.equal(await page.locator('[data-reset]').count(),1,'second PERSON tool is reset, not a face-debug control');
assert.equal(await page.locator('[data-face]').count(),0,'face debug control is absent from player-facing PERSON');

await page.locator('[data-cat="hat"]').click();
await page.locator('[data-variant="hat-01"]').click();
assert.equal(await page.locator('#person-live #hat-01').isVisible(),true,'hat-01 really becomes visible inside the SVG');
await page.locator('[data-reset]').click();
assert.equal(await page.locator('#person-live #hat-01').isVisible(),false,'reset clears authored wardrobe selections');

const faceState=await page.evaluate(async()=>{
  const {CharacterRenderer}=await import('./src/render/character-renderer.mjs');
  const root=document.querySelector('#person-live');
  const renderer=new CharacterRenderer({side:'A',root});
  renderer.render({state:{energy:72,brain:95,tension:82,contact:20,memory:{}},face:{},visual:{characterId:'character-01',appearance:{variantContract:true}}});
  const display=id=>getComputedStyle(root.querySelector(`#${id}`)).display;
  return {open:display('mouth-open'),neutral:display('mouth-neutral'),eyes:display('eyes-overheat')};
});
assert.notEqual(faceState.open,'none','authored mouth-open can now be revealed from runtime state');
assert.equal(faceState.neutral,'none','inactive authored mouth is really hidden');
assert.notEqual(faceState.eyes,'none','authored overheat eyes can now be revealed from runtime state');

await page.locator('[data-base="character-02"]').click();await page.waitForTimeout(60);
assert.equal(await page.locator('#person-live svg').count(),1,'female production SVG remounts');
assert.equal(await page.locator('[data-cat="facialHair"]').isDisabled(),true,'female authored asymmetry is preserved without explanatory debug copy');
assert.equal(await page.locator('[data-cat="outfit"]').isDisabled(),true,'female baked torso is not fabricated into clothing variants');

await page.locator('[data-go="situation"]').click();
assert.equal(await page.locator('#status').textContent(),'СИТУАЦИЯ');
assert.equal(await page.locator('[data-situation]').count(),3,'three distinct situation/opponent pairs are exposed');
assert.match(await page.locator('[data-situation="third"]').textContent(),/ЛИШЬ БЫ НЕ РУГАЛИСЬ/,'third explanation uses KEEP_PEACE');
assert.match(await page.locator('[data-situation="criticism"]').textContent(),/НЕТ, ЭТО Я СЕЙЧАС ОБЪЯСНЮ/,'criticism uses RIGHT_BACK');
assert.match(await page.locator('[data-situation="direct"]').textContent(),/УКЛОНИСТ/,'direct-answer uses its separate opponent graph');
await page.locator('[data-situation="criticism"]').click();
assert.equal(await page.locator('#scene-title').textContent(),'ТВОЯ ИДЕЯ — ПЛОХАЯ');
await page.locator('[data-go="trigger"]').click();
await page.locator('[data-group="trigger"] [data-value="unheard"]').click();
await page.locator('[data-go="goal"]').click();
await page.locator('[data-group="goal"] [data-value="beright"]').click();
await page.locator('[data-go="action"]').click();
await page.locator('[data-group="action"] [data-value="explain"]').click();
await page.locator('[data-go="fallback"]').click();
await page.locator('[data-group="fallback"] [data-value="repeat2"]').click();
await page.locator('[data-go="reveal"]').click();
assert.equal(await page.locator('#status').textContent(),'МОЗГ');
assert.match(await page.locator('#r-trigger').textContent(),/НЕ СЛЫШАТ/);
assert.match(await page.locator('#r-goal').textContent(),/ПРАВ/);
assert.equal(await page.locator('#r-action').textContent(),'ОБЪЯСНЯЮ');
assert.match(await page.locator('#r-fallback').textContent(),/ЕЩЁ ОДИН/);
await page.locator('[data-go="opponent"]').click();await page.waitForTimeout(80);
assert.equal(await page.locator('#status').textContent(),'СОПЕРНИК');
assert.equal(await page.locator('#opponent-preview svg').count(),1,'actual opponent SVG is shown before collision');
assert.equal(await page.locator('#opponent-preset').textContent(),'НЕТ, ЭТО Я СЕЙЧАС ОБЪЯСНЮ');
await page.locator('#start-talk').click();await page.waitForTimeout(80);
assert.equal(await page.locator('#status').textContent(),'РАЗГОВОР');
assert.equal(await page.locator('#talk-a svg').count(),1,'player appearance persists into TALK');
assert.equal(await page.locator('#talk-b svg').count(),1,'opponent appearance persists into TALK');
assert.equal(await page.locator('#meters .meter').count(),3,'TALK exposes compact consequence metrics');
for(let i=0;i<24&&await page.locator('[data-screen="result"]').isHidden();i++){const next=page.locator('#next-turn');if(await next.isVisible())await next.click();await page.waitForTimeout(25);}
assert.equal(await page.locator('[data-screen="result"]').isVisible(),true,'real runtime reaches RESULT');
assert.ok((await page.locator('#result-title').textContent()).trim().length>0,'RESULT has a runtime-derived verdict');
assert.equal(await page.locator('#result-facts .fact').count(),3,'RESULT reports real run facts');
await page.locator('[data-go="change"]').click();
assert.equal(await page.locator('#status').textContent(),'ПРАВКА');
assert.ok(await page.locator('#repair-choices [data-repair]').count()>=1,'one-change repair options are generated');
await page.locator('#repair-choices [data-repair]').first().click();
await page.locator('#start-replay').click();await page.waitForTimeout(40);
assert.equal(await page.locator('#status').textContent(),'ПОВТОР');
for(let i=0;i<24&&await page.locator('[data-screen="compare"]').isHidden();i++){const next=page.locator('#replay-next');if(await next.isVisible())await next.click();await page.waitForTimeout(25);}
assert.equal(await page.locator('[data-screen="compare"]').isVisible(),true,'same-situation replay reaches BEFORE / AFTER');
assert.ok((await page.locator('#before-summary').textContent()).trim().length>0);
assert.ok((await page.locator('#after-summary').textContent()).trim().length>0);
assert.ok((await page.locator('#compare-story').textContent()).trim().length>0);
assert.deepEqual(errors,[],'no uncaught browser errors during the full mobile flow');
await browser.close();
console.log('DEMENTOR LAB v1.1 iPhone browser smoke: PASS — compact PERSON, face states, worlds, TALK and replay complete');
