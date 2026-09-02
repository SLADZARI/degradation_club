import assert from 'node:assert/strict';
import { graphLayers, graphEdgeIds } from '../src/ui/brain-layout.mjs';

const linear={
  nodes:[{id:'a'},{id:'b'},{id:'c'}],
  edges:[{from:'a',to:'b'},{from:'b',to:'c'}]
};
assert.deepEqual(graphLayers(linear).map(layer=>layer.map(node=>node.id)),[['a'],['b'],['c']],'linear graph stays vertical');

const branch={
  nodes:[{id:'trigger'},{id:'left'},{id:'right'},{id:'merge'}],
  edges:[
    {from:'trigger',to:'left'},
    {from:'trigger',to:'right'},
    {from:'left',to:'merge'},
    {from:'right',to:'merge'}
  ]
};
assert.deepEqual(graphLayers(branch).map(layer=>layer.map(node=>node.id)),[['trigger'],['left','right'],['merge']],'branching nodes share a vertical depth row');
assert.equal(graphEdgeIds(branch).length,4,'all valid authored edges survive layout');
assert.deepEqual(graphEdgeIds({nodes:[{id:'a'}],edges:[{from:'a',to:'missing'}]}),[],'dangling edges are not rendered');

console.log('DEMENTOR LAB brain layout selftest: PASS');
