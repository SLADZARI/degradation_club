import test from 'node:test';import assert from 'node:assert/strict';
import {Game,createWorld} from '../world-expansion-adapter.mjs';
import {WORLD_OBSTACLES} from '../world-expansion.mjs';
import {CIVIC_JOBS} from '../civic-earnings.mjs';
let serial=0;
const act=(g,p,type,target,extra={})=>g.command(p,{type,target,requestId:'p4playtest-'+(++serial),...extra});
test('Southern forest trees are real mineable stocks and disappear from shared collision when exhausted',()=>{
 const g=new Game(createWorld()),p=g.join('Лесоруб'),o=WORLD_OBSTACLES.find(o=>o.biome==='forest'&&(o.x+o.y)%3!==0);
 const node=g.state.resources.find(x=>x.id==='forest-wood-'+o.x+'-'+o.y);
 assert.ok(node);assert.equal(node.type,'wood');assert.equal(node.stock,18);
 const target=g.target(node.id);assert.equal(target.x,node.x);
 assert.equal(g.walkable(node.x,node.y,p),false);
 p.x=o.x-.5;p.y=node.y;p.equipped='axe';p.tools.axe=16;p.bag.wood=0;
 assert.equal(g.walkable(p.x,p.y,p),true);
 assert.equal(act(g,p,'mine',node.id).ok,true);
 node.stock=0;
 assert.equal(g.walkable(node.x,node.y,p),true);
 const after=new Game(structuredClone(g.state));
 assert.equal(after.state.resources.find(x=>x.id===node.id).stock,0);
 assert.equal(after.walkable(node.x,node.y,p),true);
});
test('Exactly-once civic starter tasks debit city treasury and do not mint or repeat after restart',()=>{
 const g=new Game(createWorld()),p=g.join('Житель');g.connect(p);const total=g.state.treasury+p.wallet;
 for(const job of CIVIC_JOBS){
  p.x=g.target(job.target).x;p.y=g.target(job.target).y;
  const result=act(g,p,'civicClaim',job.target,{jobId:job.id});
  assert.equal(result.ok,true,job.id+': '+result.message);
  assert.equal(act(g,p,'civicClaim',job.target,{jobId:job.id}).ok,false);
 }
 assert.equal(g.state.treasury+p.wallet,total);
 const again=new Game(structuredClone(g.state)),old=again.auth(p.token);
 for(const job of CIVIC_JOBS)assert.equal(act(again,old,'civicClaim',job.target,{jobId:job.id}).ok,false);
});
test('Plot can be purchased near entrance with sufficient funds; poor or distant clients get no mutation',()=>{
 const g=new Game(createWorld()),p=g.join('Будущий хозяин'),plot=g.state.plots[0];
 p.x=plot.x+plot.w/2;p.y=plot.y-1;
 let a=act(g,p,'buy',plot.id,{landUse:'residential'});assert.equal(a.ok,false);assert.equal(plot.owner,null);
 p.wallet=120;p.x=20;p.y=40;
 a=act(g,p,'buy',plot.id,{landUse:'residential'});assert.equal(a.ok,false);assert.equal(plot.owner,null);
 p.x=plot.x+plot.w/2;p.y=plot.y-1;
 a=act(g,p,'buy',plot.id,{landUse:'residential'});assert.equal(a.ok,true,a.message);
 assert.equal(plot.owner,p.id);assert.equal(p.wallet,0);
});

test('Spruce is a high-value forest resource locked behind a crafted/premium axe',()=>{
 const g=new Game(createWorld()),p=g.join('Молодой лесоруб');
 const o=WORLD_OBSTACLES.find(x=>x.biome==='forest'&&(x.x+x.y)%3===0);
 assert.ok(o);const resource=g.state.resources.find(x=>x.id==='forest-wood-'+o.x+'-'+o.y);
 assert.equal(resource.species,'spruce');assert.equal(resource.visualVariant,3);
 p.x=o.x-.5;p.y=resource.y;p.equipped='axe';p.tools.axe=16;
 assert.equal(act(g,p,'mine',resource.id).ok,false,'starter axe must refuse spruce');
 p.toolInfo.axe={tier:'crafted',max:48};p.tools.axe=48;
 const item=p.toolItems.find(x=>x.id===p.activeTools.axe);
 if(item){item.tier='crafted';item.max=48;item.durability=48;}
 assert.equal(act(g,p,'mine',resource.id).ok,true);
});
