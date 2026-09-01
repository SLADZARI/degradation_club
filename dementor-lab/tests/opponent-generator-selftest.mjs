import assert from 'node:assert/strict';
import { createOpponentProfile } from '../src/opponent/generator.mjs';
import { OPPONENT_PRESET_IDS } from '../src/opponent/presets.mjs';
import { createCriticismActors } from '../src/scenarios/criticism-idea.mjs';
import { validateGraph } from '../src/core/graph.mjs';

const a=createOpponentProfile('qa-seed-01');
const b=createOpponentProfile('qa-seed-01');
assert.deepEqual(a,b,'same seed reproduces the same opponent baseline');
assert.ok(['character-01','character-02'].includes(a.baseCharacterId),'opponent uses one of two approved base characters');
assert.ok(OPPONENT_PRESET_IDS.includes(a.presetId),'opponent uses an authored brain preset');
assert.equal(typeof a.description,'string');assert.ok(a.description.length>20,'opponent has human-readable setup description');
assert.equal(validateGraph(a.graph).runnable,true,'generated opponent preset is a runnable BehaviorGraph');
const actors=createCriticismActors({opponentProfile:a});
assert.equal(actors.B.name,a.name);assert.equal(actors.B.visual.characterId,a.baseCharacterId);assert.equal(actors.B.visual.opponentPresetId,a.presetId);
console.log('DEMENTOR LAB opponent generator selftest: PASS');
