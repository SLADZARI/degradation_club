import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const html=await readFile(new URL('index.html',root),'utf8');
const app=await readFile(new URL('src/ui/app.mjs',root),'utf8');
const replayCss=await readFile(new URL('replay.css',root),'utf8');

for(const id of ['app','person-preview','variant-options','to-brain','brain-graph','brain-editor','replay-note','to-setup','play','actor-a','actor-b','turn','metrics','dialogue','delta','next-turn','trace-btn','result-title','result-cause','result-node','comparison','rerun','overlay']){
  assert.match(html,new RegExp(`id=["']${id}["']`),`index exposes #${id}`);
}
for(const view of ['person','brain','setup','talk','result'])assert.match(html,new RegExp(`data-view=["']${view}["']`),`index exposes ${view} workspace`);
assert.match(html,/viewport-fit=cover/,'safe-area viewport contract present');
assert.match(html,/replay\.css/,'replay contract styles loaded');
assert.match(app,/VerticalSliceController/,'UI delegates encounter semantics to controller');
assert.match(app,/compareRuns/,'UI uses engine replay comparison');
assert.match(app,/variantOptions/,'PERSON reads authored variant availability from the character registry');
assert.match(app,/selectAppearanceVariant/,'PERSON has explicit variant selection rather than appearance-derived behavior');
assert.match(app,/appearanceColors/,'appearance colors are visual state and are preserved separately from the brain');
assert.match(app,/firstRunConfig/,'replay preserves first-run graph baseline');
assert.match(app,/replayTargetType/,'replay limits editing to one causal target');
assert.match(app,/disabled/,'non-target replay controls are disabled');
assert.match(app,/structuredClone\(controller\.encounter\)/,'first result snapshots baseline encounter');
assert.match(app,/opponentProfile:structuredClone\(opponentProfile\)/,'replay freezes the exact opponent profile including visual state');
assert.match(replayCss,/replay-target/,'counterfactual target is visually explicit');
assert.match(replayCss,/locked/,'counterfactual non-target controls have locked state');
console.log('DEMENTOR LAB UI contract selftest: PASS');
