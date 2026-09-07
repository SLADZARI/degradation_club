import assert from 'node:assert/strict';
import { roleFor,storyBeatsFor,unlocksFor } from '../src/story/cafe-prep.mjs';
import { createBrainFor,applyBrainNode,resolveCafeDialogue } from '../src/progression/brain-progression.mjs';

const gena=roleFor('character-01');
const marta=roleFor('character-02');
assert.equal(gena.name,'ГЕНА');
assert.equal(marta.name,'МАРТА');
assert.equal(gena.role,'already-ready');
assert.equal(marta.role,'still-getting-ready');

const maleStory=storyBeatsFor('character-01');
const femaleStory=storyBeatsFor('character-02');
assert.equal(maleStory[0][0],'ГЕНА');
assert.match(maleStory[0][1],/собрался/i);
assert.equal(femaleStory[0][0],'МАРТА');
assert.match(femaleStory[0][1],/собираюсь/i);

const genaUnlocks=unlocksFor('character-01');
const martaUnlocks=unlocksFor('character-02');
assert.ok(genaUnlocks.some(n=>n.id==='ask-soft'));
assert.ok(martaUnlocks.some(n=>n.id==='give-time'));
assert.ok(genaUnlocks.some(n=>n.id==='joke'));
assert.ok(martaUnlocks.some(n=>n.id==='joke'));

const gBrain=createBrainFor('character-01');
const baseline=resolveCafeDialogue('character-01',gBrain);
applyBrainNode(gBrain,genaUnlocks.find(n=>n.id==='ask-soft'));
const softened=resolveCafeDialogue('character-01',gBrain);
assert.notDeepEqual(softened,baseline);
assert.match(softened[0][1],/примерно нужно/i);

const mBrain=createBrainFor('character-02');
applyBrainNode(mBrain,martaUnlocks.find(n=>n.id==='give-time'));
const concrete=resolveCafeDialogue('character-02',mBrain);
assert.match(concrete[0][1],/семь минут/i);

console.log('cafe-story-progression-selftest: OK');
