import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,createWorld} from '../world.mjs';
import {localFootprints,intersectsLocalFootprint,blockedByLocalFootprints} from '../local-geometry.mjs';

function fixture(){
 const g=new Game(createWorld()),p=g.join('Geometry local');
 const plot=g.state.plots[0];plot.owner=p.id;
 p.scene='plot';p.plotId=plot.id;p.x=8;p.y=14;
 return {g,p,plot,h:plot.home};
}
test('authoritative tent walls have a real front entrance; well and crops occupy their projected footprint',()=>{
 const {g,p,h}=fixture();h.nodes.forEach(n=>n.left=0);
 h.tent=3;h.beds=[{id:'garden-test',x:8,y:10}];
 const f=localFootprints('plot',h,g.now);
 assert.ok(f.some(o=>o.id==='tent-visual'&&!o.solid));
 assert.equal(blockedByLocalFootprints(8,7.5,f),false,'front passage must remain open');
 assert.equal(blockedByLocalFootprints(6.2,7.3,f),true,'west tent wall');
 assert.equal(blockedByLocalFootprints(9.8,7.3,f),true,'east tent wall');
 assert.equal(blockedByLocalFootprints(8,5.2,f),true,'rear tent wall');
 assert.equal(blockedByLocalFootprints(14,3,f),true,'well rim');
 assert.equal(blockedByLocalFootprints(8,10,f),true,'garden bed');
 assert.equal(g.walkable(8,8.3,p),true,'walk up to tent entrance');
 assert.equal(g.walkable(6.1,7.2,p),false,'server uses same solid geometry');
 assert.equal(g.walkable(8,10,p),false,'server blocks crop bed');
 const snap=g.snapshot(p);
 assert.deepEqual(snap.homeFootprints,f,'published footprint and server physics match');
});
test('bed and chest share solid footprints with room; doorway and cutaway remain passable',()=>{
 const {g,p}=fixture();p.scene='interior';p.x=7;p.y=12;
 const objects=localFootprints('interior',g.state.plots[0].home,g.now);
 assert.equal(objects.filter(o=>o.kind==='room-wall').length,2);
 assert.equal(g.walkable(3.8,5.4,p),false,'cannot walk through chest');
 assert.equal(g.walkable(9.6,5.9,p),false,'cannot walk through bed');
 assert.equal(g.walkable(7,13,p),true,'leave near door freely');
 assert.equal(g.walkable(.4,8,p),false,'physical room wall');
 assert.equal(g.walkable(8,14,p),true,'front remains open in cutaway');
 assert.equal(g.snapshot(p).homeFootprints.find(o=>o.id==='chest').kind,'chest');
 const restored=new Game(JSON.parse(JSON.stringify(g.state)));
 const saved=restored.state.players[p.id];
 assert.equal(restored.walkable(9.6,5.9,saved),false,'collision survives save/load without migrating world data');
});
test('old saved characters trapped inside furniture can move outward but not through the object',()=>{
 const {g,p}=fixture();p.scene='interior';p.x=4;p.y=5.6;
 assert.equal(g.walkable(4,5.75,p),true,'escape moves toward outer edge');
 assert.equal(g.walkable(4,5.5,p),false,'move deeper into obstacle is rejected');
 p.x=7;p.y=12;
 assert.equal(g.walkable(4,5.75,p),false,'escape exception does not permit entering furniture');
});
test('resource trees, stone, garden and growing trees do not overlap server navigation',()=>{
 const {g,p,h}=fixture();h.nodes.forEach(n=>n.left=0);
 h.plantedTrees=[{id:'planted-a',kind:'oak',x:12,y:10,wateredAt:g.now-360001}];
 const tree=localFootprints('plot',h,g.now).find(o=>o.id==='planted-a');
 assert.ok(tree);assert.equal(intersectsLocalFootprint(12,10,tree),true);
 assert.equal(g.walkable(12,10,p),false);
 h.plantedTrees[0].wateredAt=g.now;
 assert.equal(localFootprints('plot',h,g.now).some(o=>o.id==='planted-a'),false,'seedling not a solid trunk yet');
 const expedition=localFootprints('expedition',g.state.expedition.home,g.now);
 assert.ok(expedition.length>0);
 assert.equal(expedition.some(o=>o.kind==='well'||o.kind==='tent'),false,'no home furniture in expedition');
});

test('garden construction rejects tree soil overlap before modifying saved beds',()=>{
 const {g,p,h}=fixture();h.nodes.forEach(n=>n.left=0);
 p.x=7;p.y=11;
 h.soil=[{id:'reserved-tree-spot',x:6,y:10}];
 const before=h.beds.length;
 assert.equal(g.command(p,{type:'homePrepare',target:'garden',requestId:'garden-overlap-block'}).ok,false);
 assert.equal(h.beds.length,before,'failed placement must not mutate the save');
 h.soil.length=0;
 assert.equal(g.command(p,{type:'homePrepare',target:'garden',requestId:'garden-clear-spot'}).ok,true);
 assert.equal(h.beds.length,before+1);
});
