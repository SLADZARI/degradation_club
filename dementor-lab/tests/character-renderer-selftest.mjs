import assert from 'node:assert/strict';
import { visualStateFromMetrics, resolveVisualState } from '../src/render/character-renderer.mjs';

const normal=visualStateFromMetrics({energy:72,brain:15,tension:10,contact:60});
assert.equal(normal.eyes,'neutral');
assert.equal(normal.brows,'neutral');
assert.equal(normal.mouth,'neutral');

const overheat=visualStateFromMetrics({energy:72,brain:92,tension:80,contact:20});
assert.equal(overheat.eyes,'overheat');
assert.equal(overheat.brows,'angry');
assert.equal(overheat.mouth,'open');
assert.ok(overheat.motion.headInstability>0);
assert.ok(overheat.motion.gestureSharpness>0);

const tired=visualStateFromMetrics({energy:20,brain:20,tension:20,contact:50});
assert.equal(tired.eyes,'sleepy');
assert.equal(tired.motion.headDrop,1);
assert.ok(tired.motion.amplitude<1);

const emptyFace=resolveVisualState({state:{energy:72,brain:90,tension:70,contact:50},face:{}});
assert.equal(emptyFace.eyes,'overheat','empty face object must not suppress metric-driven rendering');
assert.equal(emptyFace.brows,'tense');

const override=resolveVisualState({state:{energy:72,brain:90,tension:70,contact:50},face:{mouth:'soft',motion:{orientToPartner:0.9}}});
assert.equal(override.eyes,'overheat','partial face override preserves derived eyes');
assert.equal(override.mouth,'soft','explicit face override wins');
assert.equal(override.motion.orientToPartner,0.9,'explicit motion override wins');
assert.ok(override.motion.headInstability>0,'other derived motion survives partial override');

console.log('DEMENTOR LAB character renderer selftest: PASS');
