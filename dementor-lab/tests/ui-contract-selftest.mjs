import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const html=await readFile(new URL('index.html',root),'utf8');
const app=await readFile(new URL('src/ui/app.mjs',root),'utf8');
const replayCss=await readFile(new URL('replay.css',root),'utf8');

for(const id of ['app','person-preview','variant-options','to-brain','brain-presets','brain-add-node','brain-validation','brain-graph','brain-inspector','brain-editor','replay-note','to-setup','play','actor-a','actor-b','turn','metrics','dialogue','delta','next-turn','trace-btn','result-title','result-cause','result-node','comparison','rerun','overlay']){
  assert.match(html,new RegExp(`id=["']${id}["']`),`index exposes #${id}`);
}
for(const view of ['person','brain','setup','talk','result'])assert.match(html,new RegExp(`data-view=["']${view}["']`),`index exposes ${view} workspace`);
assert.match(html,/viewport-fit=cover/,'safe-area viewport contract present');
assert.match(html,/brain\.css/,'brain constructor styles loaded');
assert.match(app,/VerticalSliceController/,'UI delegates encounter semantics to controller');
assert.match(app,/compareRuns/,'UI uses engine replay comparison');
assert.match(app,/variantOptions/,'PERSON reads authored variant availability from the character registry');
assert.match(app,/selectAppearanceVariant/,'PERSON has explicit variant selection rather than appearance-derived behavior');
assert.match(app,/BRAIN_PRESETS/,'BRAIN exposes approved behavioral presets');
assert.match(app,/addBrainNode/,'BRAIN can add real graph nodes');
assert.match(app,/removeBrainNode/,'BRAIN can remove real graph nodes');
assert.match(app,/moveBrainNode/,'BRAIN can drag graph nodes');
assert.match(app,/connectBrainNodes/,'BRAIN creates real graph edges');
assert.match(app,/compatibleBrainTargets/,'BRAIN exposes only compatible connection targets');
assert.match(app,/brainValidation/,'BRAIN surfaces engine graph validation');
assert.match(app,/currentBrainGraph/,'BRAIN edits a persistent player graph rather than a visual copy');
assert.match(app,/actors\.A\.brainGraph=cloneBrainGraph\(currentBrainGraph\)/,'Encounter receives the edited graph');
assert.match(app,/brainGraph:brainSnapshot\(\)/,'replay freezes the full first-run graph');
assert.match(app,/restoreBrainSnapshot\(firstRunConfig\.brainGraph\)/,'counterfactual replay restores the exact graph baseline');
assert.match(app,/appearanceColors/,'appearance colors remain separate from behavior');
assert.match(app,/opponentProfile:structuredClone\(opponentProfile\)/,'replay freezes the exact opponent profile including visual state');
assert.match(replayCss,/replay-target|locked/,'counterfactual lock styling remains available');
console.log('DEMENTOR LAB UI contract selftest: PASS');
