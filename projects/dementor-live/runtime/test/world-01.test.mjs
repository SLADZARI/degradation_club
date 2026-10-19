import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,createWorld} from '../world.mjs';
import {WORLD01,FOREST_TREES,FOREST_OBJECTS,forestWalkable} from '../world-01.mjs';

let seq=0;
function setup(){
 const g=new Game(createWorld()),p=g.join('Исследователь'),other=g.join('Сосед');
 g.connect(p);g.connect(other);
 return {g,p,other,act:(actor,type,target)=>g.command(actor,{type,target,requestId:'w01-test-'+(++seq)})};
}
function at(p,o){p.x=o.x;p.y=o.y;}
function enter({g,p,act}){at(p,WORLD01.cityGate);const r=act(p,'world01Enter',WORLD01.cityGate.id);assert.equal(r.ok,true,r.message);return r;}
const summary=p=>({id:p.id,wallet:p.wallet,bag:structuredClone(p.bag),tools:structuredClone(p.tools),token:p.token});
test('forest is a large separate region, deterministically generated and with clear walkable paths',()=>{
 assert.equal(WORLD01.width,64);assert.equal(WORLD01.height,48);assert.ok(FOREST_TREES.length>80);
 assert.equal(FOREST_OBJECTS.filter(o=>o.type==='world01-billboard').length,3);
 for(let y=10;y<=46;y++)assert.equal(forestWalkable(31,y),true,'public footpath '+y);
 assert.equal(forestWalkable(FOREST_TREES[0].x,FOREST_TREES[0].y),false);
});
test('player must travel to the city gate, not teleport from arbitrary coordinates',()=>{
 const v=setup();const before=summary(v.p);
 assert.equal(v.act(v.p,'world01Enter',WORLD01.cityGate.id).ok,false);
 assert.equal(v.p.scene,'city');assert.deepEqual(summary(v.p),before);
});
test('city to forest preserves ID, money, stock and tools, and returns to the same city',()=>{
 const v=setup();v.p.wallet=273;v.p.bag.wood=3;v.p.bag.stone=1;const before=summary(v.p);
 enter(v);assert.equal(v.p.scene,'forest');assert.deepEqual(summary(v.p),before);
 at(v.p,WORLD01.forestExit);assert.equal(v.act(v.p,'world01Return',WORLD01.forestExit.id).ok,true);
 assert.equal(v.p.scene,'city');assert.deepEqual(summary(v.p),before);
});
test('forest snapshot protects token and other inventory, and renders only residents of same scene',()=>{
 const v=setup();enter(v);const snap=v.g.snapshot(v.p);
 assert.equal(snap.scene,'forest');assert.equal(snap.world01.region.id,'ideas-forest');
 assert.equal(snap.world01.region.objects.length,7);assert.equal(snap.world01.region.trees.length,FOREST_TREES.length);
 assert.equal(JSON.stringify(snap).includes(v.other.token),false);
 assert.ok(snap.players.some(o=>o.id===v.p.id&&o.scene==='forest'));
});
test('forest billboard returns original public club entity, without inventing Board relationships',()=>{
 const v=setup();enter(v);const billboard=FOREST_OBJECTS.find(o=>o.sourceRef==='project:dementor-lab');
 assert.equal(v.act(v.p,'world01Inspect',billboard.id).ok,false);
 at(v.p,billboard);const r=v.act(v.p,'world01Inspect',billboard.id);
 assert.equal(r.ok,true);assert.equal(r.card.sourceRef,'project:dementor-lab');
 assert.equal(r.card.mode,'DEMO_PUBLIC_STATIC');assert.equal(r.card.href,'https://dementor.club/projects/dementor-lab/');
 assert.equal(r.card.relations,undefined);
});
test('second player can enter same region with shared presence and no new character',()=>{
 const v=setup();enter(v);at(v.other,WORLD01.cityGate);
 const entered=v.act(v.other,'world01Enter',WORLD01.cityGate.id);
 assert.equal(entered.ok,true);assert.equal(Object.keys(v.g.state.players).length,2);
 assert.equal(v.g.snapshot(v.other).players.filter(p=>p.online&&p.scene==='forest').length,2);
});
test('scooter is opt-in and modifies movement speed without minting resources',()=>{
 const v=setup();enter(v);at(v.p,WORLD01.scooter);const before=summary(v.p);
 assert.equal(v.act(v.p,'world01Scooter',WORLD01.scooter.id).transport,'scooter');
 v.p.x=31;v.p.y=31;v.g.input(v.p,{dx:0,dy:1,sprint:false});v.g.tick(100);
 const moved=v.p.y-31;assert.ok(moved>.58 && moved<.75,'scooter movement '+moved);
 assert.deepEqual(summary(v.p),before);
});
test('forest collision rejects trees, blocks and out of bounds',()=>{
 const v=setup();enter(v);const tree=FOREST_TREES[5];
 assert.equal(v.g.walkable(tree.x,tree.y,v.p),false);
 assert.equal(v.g.walkable(-1,5,v.p),false);
 assert.equal(v.g.walkable(31,35,v.p),true);
});
test('portal needs physical discovery, then fast city↔forest return becomes available',()=>{
 const v=setup();enter(v);assert.equal(v.act(v.p,'world01Portal',WORLD01.portal.id).ok,false);
 at(v.p,WORLD01.portal);assert.equal(v.act(v.p,'world01Portal',WORLD01.portal.id).unlocked,true);
 assert.equal(v.p.scene,'forest');assert.equal(v.act(v.p,'world01Portal',WORLD01.portal.id).region,'origin');
 at(v.p,WORLD01.cityGate);assert.equal(v.act(v.p,'world01FastTravel',WORLD01.cityGate.id).region,'ideas-forest');
 assert.equal(v.p.world01.portalUnlocked,true);
});
test('repeating a travel requestId has no duplicate side effect',()=>{
 const v=setup();at(v.p,WORLD01.cityGate);const cmd={type:'world01Enter',target:WORLD01.cityGate.id,requestId:'w01-one'};
 const first=v.g.command(v.p,cmd);const second=v.g.command(v.p,cmd);
 assert.deepEqual(first,second);assert.equal(v.p.scene,'forest');
});
test('save reload preserves region/transport/teleport without changing city ledger',()=>{
 const v=setup();v.p.wallet=184;v.p.bag.wood=4;enter(v);
 at(v.p,WORLD01.portal);v.act(v.p,'world01Portal',WORLD01.portal.id);
 at(v.p,WORLD01.scooter);v.act(v.p,'world01Scooter',WORLD01.scooter.id);
 const before=JSON.stringify(v.g.state);const g2=new Game(JSON.parse(before)),p2=g2.auth(v.p.token);
 assert.equal(p2.id,v.p.id);assert.equal(p2.scene,'forest');assert.equal(p2.world01.scooter,true);
 assert.equal(p2.world01.portalUnlocked,true);assert.equal(p2.wallet,184);assert.equal(p2.bag.wood,4);
 assert.equal(g2.snapshot(p2).world01.transport,'scooter');
});
test('forest does not permit city materials production, land purchase or remote interactions',()=>{
 const v=setup();enter(v);
 assert.equal(v.act(v.p,'mine','wood-1').ok,false);
 assert.equal(v.act(v.p,'buy','plot-1').ok,false);
 assert.equal(v.act(v.p,'world01Inspect','malicious-unknown').ok,false);
 assert.equal(v.p.bag.wood,0);
});
