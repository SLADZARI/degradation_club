import assert from 'node:assert/strict';
import { BRAIN_PRESETS, BLANK_BRAIN, cloneBrainGraph } from '../src/ui/brain-presets.mjs';
import { addBrainNode, removeBrainNode, moveBrainNode, connectBrainNodes, compatibleBrainTargets, brainValidation } from '../src/ui/brain-constructor.mjs';

assert.ok(BRAIN_PRESETS.length>=6,'approved behavioral preset entry exists');
for(const preset of BRAIN_PRESETS){assert.equal(brainValidation(cloneBrainGraph(preset.graph)).runnable,true,`${preset.label} is a real runnable graph`)}

const graph=cloneBrainGraph(BLANK_BRAIN);
assert.equal(brainValidation(graph).code,'NO_TRIGGER');
const trigger=addBrainNode(graph,'criticism',{x:20,y:20});
const reaction=addBrainNode(graph,'explain',{x:220,y:300});
assert.ok(connectBrainNodes(graph,trigger.id,reaction.id),'trigger can connect to reaction');
assert.equal(brainValidation(graph).runnable,true,'minimal custom graph becomes runnable');
const impulse=addBrainNode(graph,'beright',{x:320,y:160});
assert.ok(connectBrainNodes(graph,trigger.id,impulse.id),'source can create another branch');
assert.ok(connectBrainNodes(graph,impulse.id,reaction.id),'branch can rejoin reaction');
assert.equal(graph.edges.filter(e=>e.from===trigger.id).length,2,'one source owns two real outgoing branches');
assert.ok(!compatibleBrainTargets(graph,trigger.id).includes(trigger.id),'self links are not offered');
assert.ok(!compatibleBrainTargets(graph,impulse.id).includes(trigger.id),'trigger is never a target');
moveBrainNode(graph,impulse.id,410,420);assert.equal(impulse.ui.x,410);assert.equal(impulse.ui.y,420);
removeBrainNode(graph,impulse.id);assert.equal(graph.nodes.some(n=>n.id===impulse.id),false);assert.equal(graph.edges.some(e=>e.from===impulse.id||e.to===impulse.id),false,'deleting a node removes attached edges');
console.log('DEMENTOR LAB brain constructor selftest: PASS');
