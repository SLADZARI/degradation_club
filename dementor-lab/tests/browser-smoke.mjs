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

// character-01 exact contract: optional variants start at null, authored owned base remains visible.
assert.equal(await page.locator('[data-part="hat"]').getAttribute('data-variant-count'),'7','male exposes seven authored hats');
assert.equal(await page.locator('[data-part="glasses"]').getAttribute('data-variant-count'),'4','male exposes four authored glasses');
assert.equal(await page.locator('[data-part="beard"]').getAttribute('data-variant-count'),'4','male exposes four authored facial-hair variants');
assert.equal(await page.locator('[data-part="outfit"]').getAttribute('data-variant-count'),'3','male exposes three authored outfits');
assert.equal(await page.locator('[data-part="shoes"]').getAttribute('data-variant-count'),'1','male exposes one authored shoes variant');
assert.equal(await page.locator('#person-preview #hat-01').isVisible(),false,'optional hat starts unselected on exact male');
await page.locator('[data-part="hat"]').click();
await page.locator('#variant-options [data-variant="hat-01"]').click();
assert.equal(await page.locator('#person-preview #hat-01').isVisible(),true,'exact male hat variant can be selected');
await page.locator('[data-part="beard"]').click();
await page.locator('#variant-options [data-variant="facial-hair-01"]').click();
assert.equal(await page.locator('#person-preview #facial-hair-01').isVisible(),true,'exact male facial-hair variant can be selected');

// character-02 exact contract: compatible shared hat survives; unsupported facial hair/outfit are not fabricated.
await page.locator('.character-switch [data-character="character-02"]').click();await page.waitForTimeout(80);
assert.equal(await page.locator('#person-preview').getAttribute('data-character'),'character-02','female exact body rig mounts');
assert.equal(await page.locator('[data-part="hat"]').getAttribute('data-variant-count'),'7','female exposes seven authored hats');
assert.equal(await page.locator('[data-part="glasses"]').getAttribute('data-variant-count'),'4','female exposes four authored glasses');
assert.equal(await page.locator('[data-part="beard"]').getAttribute('data-variant-count'),'0','female exact source intentionally exposes no facial-hair variants');
assert.equal(await page.locator('[data-part="outfit"]').getAttribute('data-variant-count'),'0','female exact source intentionally exposes no outfit variants');
assert.equal(await page.locator('[data-part="shoes"]').getAttribute('data-variant-count'),'1','female exposes authored shoes variant');
assert.equal(await page.locator('#person-preview #hat-01').isVisible(),true,'compatible shared exact hat survives body switch');
assert.equal(await page.locator('#person-preview [id^="facial-hair-"]').count(),0,'female SVG contains no fabricated facial-hair geometry');
assert.equal(await page.locator('#person-preview [id^="outfit-"]').count(),0,'female SVG contains no fabricated outfit variant geometry');
assert.equal(await page.locator('#person-preview #shoes-01').isVisible(),true,'female authored base shoes remain visible when no explicit shoes variant is selected');
await page.locator('[data-part="glasses"]').click();
await page.locator('#variant-options [data-variant="glasses-01"]').click();
assert.equal(await page.locator('#person-preview #glasses-01').isVisible(),true,'female exact glasses variant renders inside authored wrapper');
await page.locator('[data-part="hat"]').click();
await page.locator('#variant-options [data-variant=""]').click();
assert.equal(await page.locator('#person-preview #hat-01').isVisible(),false,'shared exact hat can be cleared on female rig');

// BRAIN is a graph editor, not a static stack: authored edges render and touch controls mutate the selected node.
await page.locator('#to-brain').click();assert.equal(await page.locator('#top-status').textContent(),'BRAIN');assert.ok(await page.locator('#brain-graph .brain-node').count()>=5);
await page.waitForTimeout(50);
assert.equal(await page.locator('#brain-graph .brain-link').count(),4,'current authored graph renders four real edges');
assert.equal(await page.locator('[data-editor-for="a-impulse"]').isVisible(),true,'first editable causal node is opened by default');
assert.equal((await page.locator('[data-editor-for="a-impulse"] output').textContent()).trim(),'W3','impulse starts at authored W3');
await page.locator('[data-brain-inc="a-impulse"]').click();assert.equal((await page.locator('[data-editor-for="a-impulse"] output').textContent()).trim(),'W4','touch plus changes selected graph node');
await page.locator('[data-brain-dec="a-impulse"]').click();assert.equal((await page.locator('[data-editor-for="a-impulse"] output').textContent()).trim(),'W3','touch minus restores selected graph node');
await page.locator('[data-brain-node="a-repeat"]').click();assert.equal(await page.locator('[data-editor-for="a-repeat"]').isVisible(),true,'tapping another editable node moves its editor into the graph');

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
await page.locator('#rerun').click();assert.equal(await page.locator('#top-status').textContent(),'BRAIN');assert.equal(await page.locator('#replay-note').isVisible(),true);assert.match(await page.locator('#replay-note').textContent(),/СОПЕРНИК ТОТ ЖЕ/);assert.equal(await page.locator('#actor-b').getAttribute('data-character'),opponentCharacter,'counterfactual replay keeps same opponent body');assert.ok(await page.locator('#brain-graph .brain-node.is-locked').count()>=1,'counterfactual replay visibly locks non-target editable causal nodes');
const viewport=page.viewportSize(),layout=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}));assert.ok(layout.scrollWidth<=layout.clientWidth+1,`no horizontal overflow: ${layout.scrollWidth}/${layout.clientWidth}`);assert.ok(viewport?.width<=430,'smoke test runs in small-phone viewport');
await browser.close();console.log('DEMENTOR LAB browser smoke: PASS — exact characters and touch-first BRAIN graph work in phone-sized flow');
