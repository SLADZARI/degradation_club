import {test} from 'node:test';import assert from 'node:assert/strict';
import {Game,createWorld} from '../world-expansion-adapter.mjs';
import {FORESTRY,TREE_SPECIES,growthStage} from '../forestry.mjs';
let sequence=0;const command=(g,p,type,target=null,extra={})=>g.command(p,{type,target,requestId:'forest-'+(++sequence),...extra});
test('five species, seeds and shovel purchase are persisted, no duplicate purchase',()=>{
 const g=new Game(createWorld()),p=g.join('A');p.x=23;p.y=7;p.wallet=40;g.state.seedMarket.stage=g.c.seedMarket.stages.length;
 assert.equal(Object.keys(TREE_SPECIES).length,5);
 for(const kind of Object.keys(TREE_SPECIES))assert.equal(command(g,p,'buySeeds',null,{kind,quantity:1}).ok,true,kind);
 const treasury=g.state.treasury;assert.equal(command(g,p,'buyShovel','seed-shop').ok,true);
 assert.equal(p.wallet,25);assert.equal(g.state.treasury,treasury+5);assert.equal(p.gardenTools.shovel,24);
 assert.equal(command(g,p,'buyShovel','seed-shop').ok,false);
 const clone=new Game(JSON.parse(JSON.stringify(g.state)));
 assert.equal(clone.auth(p.token).bag.seed_tree_spruce,1);
 assert.equal(clone.auth(p.token).gardenTools.shovel,24);
});
test('dig, sow, water, three growth stages, finite axe harvest and reload',()=>{
 const g=new Game(createWorld()),p=g.join('B'),plot=g.state.plots[0];plot.owner=p.id;p.scene='plot';p.plotId=plot.id;p.x=6.5;p.y=10.5;
 p.gardenTools.shovel=2;p.bag.seed_tree_spruce=1;p.bag.water=2;p.tools.axe=8;p.equipped='axe';
 assert.equal(command(g,p,'homeDig','garden').ok,true);
 const soil=plot.home.soil[0];assert.equal(soil.x,6.5);
 assert.equal(command(g,p,'homeSowTree',soil.id,{kind:'seed_tree_spruce'}).ok,true);
 assert.equal(command(g,p,'homeSowTree',soil.id,{kind:'seed_tree_spruce'}).ok,false);
 const t=plot.home.plantedTrees[0];assert.equal(growthStage(g.now,t),1);
 assert.equal(command(g,p,'homeFellTree',t.id).ok,false);
 assert.equal(command(g,p,'homeWaterTree',t.id).ok,true);assert.equal(p.bag.water,0);
 g.tick(FORESTRY.firstStageMs+1);assert.equal(growthStage(g.now,t),2);assert.equal(g.walkable(t.x,t.y,p),false);
 const copy=new Game(JSON.parse(JSON.stringify(g.state))),q=copy.auth(p.token),tree=copy.state.plots[0].home.plantedTrees[0];copy.now=g.now; // Simulated test clock must survive an accelerated-time restart.
 assert.equal(growthStage(copy.now,tree),2);
 copy.tick(FORESTRY.matureMs-FORESTRY.firstStageMs+1);assert.equal(growthStage(copy.now,tree),3);
 const before=copy.snapshot(q).materials.wood.total;
 for(let i=0;i<8;i++)assert.equal(command(copy,q,'homeFellTree',tree.id).ok,true);
 assert.equal(q.bag.wood,8);
 assert.equal(copy.snapshot(q).materials.wood.total,before);
 assert.equal(copy.state.plots[0].home.plantedTrees.length,0);
 assert.equal(command(copy,q,'homeFellTree',tree.id).ok,false);
 const reload=new Game(JSON.parse(JSON.stringify(copy.state)));
 assert.equal(reload.auth(p.token).bag.wood,8);
});
test('ownership and tool checks reject tree edits without loss',()=>{
 const g=new Game(createWorld()),a=g.join('C'),b=g.join('D'),plot=g.state.plots[0];plot.owner=a.id;a.scene='plot';a.plotId=plot.id;a.x=6.5;a.y=10.5;a.bag.seed_tree_oak=1;
 assert.equal(command(g,a,'homeDig','garden').ok,false);
 a.gardenTools.shovel=1;assert.equal(command(g,a,'homeDig','garden').ok,true);
 const s=plot.home.soil[0];assert.equal(command(g,a,'homeSowTree',s.id,{kind:'seed_tree_oak'}).ok,true);
 assert.equal(command(g,a,'homeWaterTree',plot.home.plantedTrees[0].id).ok,false);
 b.scene='plot';b.plotId=plot.id;b.x=s.x;b.y=s.y;b.bag.seed_tree_oak=1;
 assert.equal(command(g,b,'homeSowTree',s.id,{kind:'seed_tree_oak'}).ok,false);
 assert.equal(b.bag.seed_tree_oak,1);
});
