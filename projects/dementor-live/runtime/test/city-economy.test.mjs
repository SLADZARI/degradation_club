import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game,createWorld} from '../world.mjs';
import {CityNetwork} from '../city-network.mjs';
import {cityMaterialReport} from '../city-expansion.mjs';

let seq=0;
const cmd=(g,p,type,target=null,extra={})=>g.command(p,{type,target,requestId:'economy-'+(++seq),...extra});
const near=(g,p,id)=>{const t=g.target(id);assert.ok(t);p.x=t.x;p.y=t.y;};
const setup=()=>{const g=new Game(createWorld()),p=g.join('Первый');g.connect(p);return {g,p};};
function construct(g,p,drop,build,kind,quantity){
 p.bag[kind]=quantity;near(g,p,drop);
 const accepted=cmd(g,p,'deliver',drop);assert.ok(accepted.ok,JSON.stringify(accepted));
 assert.equal(p.bag[kind],0);
 near(g,p,build);
}
function finishConstruction(g,p,id,steps){
 near(g,p,id);
 for(let i=0;i<steps;i++){const result=cmd(g,p,'build',id);assert.ok(result.ok,JSON.stringify(result));g.tick(g.c.buildMs+1);}
}
function totals(g){return Object.fromEntries(Object.entries(cityMaterialReport(g)).map(([k,v])=>[k,v.total]));}
test('Warehouse wood and stone balances survive reload, courier pickup, delivery and retry',()=>{
 const {g,p}=setup();p.bag.stone=5;p.bag.wood=4;near(g,p,'warehouse');const initial=totals(g);
 const first=cmd(g,p,'warehouseSell','warehouse',{kind:'stone'});
 assert.equal(first.ok,true);assert.equal(g.state.warehouse.stock.stone,5);assert.equal(p.bag.stone,0);
 assert.equal(cmd(g,p,'warehouseSell','warehouse',{kind:'wood'}).ok,true);
 assert.equal(g.state.warehouse.stock.wood,4);
 assert.deepEqual(totals(g),initial,'Depositing must conserve both material totals');
 const repeat=g.command(p,{type:'warehouseSell',target:'warehouse',kind:'stone',requestId:'economy-'+seq});assert.equal(repeat.ok,true);
 assert.equal(g.state.warehouse.stock.stone,5);
 const saved=new Game(JSON.parse(JSON.stringify(g.state)));const returned=saved.auth(p.token);
 assert.equal(saved.state.warehouse.stock.stone,5);
 assert.equal(saved.snapshot(returned).materials.stone.onWarehouse,5);
 assert.equal(saved.snapshot(returned).materials.stone.total,initial.stone);
 near(saved,returned,'board');assert.equal(cmd(saved,returned,'courierAccept','board',{kind:'stone'}).ok,true);
 near(saved,returned,'warehouse');assert.equal(cmd(saved,returned,'courierPickup','warehouse').ok,true);
 assert.equal(saved.snapshot(returned).materials.stone.inTransit,5);
 assert.deepEqual(totals(saved),initial,'Courier loading must conserve physical stone');
 near(saved,returned,'mayor');assert.equal(cmd(saved,returned,'courierDeliver','mayor').ok,true);
 assert.equal(saved.state.warehouse.stock.stone,0);
 assert.equal(saved.state.warehouse.municipal.stone,5);
 assert.deepEqual(totals(saved),initial,'Delivery to town hall must conserve physical stone');
 const again=new Game(JSON.parse(JSON.stringify(saved.state)));
 assert.equal(again.snapshot(again.auth(p.token)).materials.stone.inMunicipal,5);
 assert.deepEqual(totals(again),initial);
});
test('Seed shop is independent city construction and public garden supports crops',()=>{
 const {g,p}=setup();near(g,p,'seed-shop');p.wallet=100;
 assert.equal(cmd(g,p,'buySeeds',null,{kind:'seed_carrot',quantity:1}).ok,false,'Unavailable until built');
 construct(g,p,'seed-shop-drop','seed-shop-build','wood',8);
 construct(g,p,'seed-shop-drop','seed-shop-build','stone',6);
 finishConstruction(g,p,'seed-shop-build',2);
 assert.equal(g.state.seedMarket.stage,1);
 near(g,p,'seed-shop');assert.equal(cmd(g,p,'buySeeds',null,{kind:'seed_carrot',quantity:2}).ok,true);
 assert.equal(p.bag.seed_carrot,2);
 construct(g,p,'public-garden-drop','public-garden-build','wood',6);
 construct(g,p,'public-garden-drop','public-garden-build','stone',4);
 finishConstruction(g,p,'public-garden-build',2);
 near(g,p,'public-garden');
 const before=totals(g);
 assert.equal(cmd(g,p,'publicSow','public-bed-0',{crop:'carrot'}).ok,true);
 p.bag.water=2;assert.equal(cmd(g,p,'publicWater','public-bed-0').ok,true);
 assert.equal(cmd(g,p,'publicHarvest','public-bed-0').ok,false);
 g.tick(120001);
 assert.equal(cmd(g,p,'publicHarvest','public-bed-0').ok,true);
 assert.equal(p.bag.carrot,3);
 assert.deepEqual(totals(g),before,'Growing crops must not magically remove building materials');
 const saved=new Game(JSON.parse(JSON.stringify(g.state)));
 assert.equal(saved.state.seedMarket.stage,1);
 assert.equal(saved.state.gardenProject.stage,1);
 assert.equal(saved.state.publicGarden.harvests,1);
});
test('Independent city worlds can be created, joined and revisited by separate players',()=>{
 const net=new CityNetwork(createWorld()),g=net.origin,p=g.join('Основатель'),friend=g.join('Друг');g.connect(p);g.connect(friend);
 near(g,p,'city-registry');near(g,friend,'city-registry');
 const req={type:'createCity',requestId:'create-idempotent',name:'Новая пристань'};
 let made=net.command(p,req);assert.equal(made.ok,true,JSON.stringify(made));assert.equal(net.command(p,req).id,made.id);
 assert.equal(net.list().length,2);
 const id=made.id;
 const savedBefore=JSON.stringify(net.serialize()),restored=new CityNetwork(JSON.parse(savedBefore));
 const p2=restored.findToken(p.token).p,friend2=restored.findToken(friend.token).p;
 assert.equal(restored.list()[0].online,0,'Restart must not preserve stale online connections');
 restored.gameFor(p2).connect(p2);restored.gameFor(friend2).connect(friend2);
 assert.equal(restored.list()[1].id,id);
 assert.equal(restored.command(p2,{type:'travelCity',requestId:'travel-1',cityId:id}).ok,true);
 assert.equal(restored.findToken(p.token).cityId,id);
 assert.equal(restored.findToken(friend.token).cityId,'origin');
 assert.notEqual(restored.gameFor(p2).state.warehouse,restored.gameFor(friend2).state.warehouse);
 assert.equal(restored.command(friend2,{type:'travelCity',requestId:'travel-2',cityId:id}).ok,true);
 assert.equal(restored.list().find(c=>c.id===id).online,2);
 p2.bag.stone=2;near(restored.gameFor(p2),p2,'warehouse');
 assert.equal(cmd(restored.gameFor(p2),p2,'warehouseSell','warehouse',{kind:'stone'}).ok,true);
 assert.equal(restored.origin.state.warehouse.stock.stone,0);
 assert.equal(restored.gameFor(p2).state.warehouse.stock.stone,2);
 const state=JSON.parse(JSON.stringify(restored.serialize())),again=new CityNetwork(state);
 const p3=again.findToken(p.token).p;
 assert.equal(again.findToken(friend.token).cityId,id);
 assert.equal(again.gameFor(p3).state.warehouse.stock.stone,2);
 near(again.gameFor(p3),p3,'city-registry');
 assert.equal(again.command(p3,{type:'travelCity',requestId:'return-home',cityId:'origin'}).ok,true);
 assert.equal(again.findToken(p.token).cityId,'origin');
 assert.equal(again.findToken(friend.token).cityId,id);
});
