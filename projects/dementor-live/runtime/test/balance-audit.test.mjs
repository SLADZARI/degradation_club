import test from 'node:test';
import assert from 'node:assert/strict';
import {CONFIG} from '../config.mjs';
import {Game,createWorld,projectBudget} from '../world.mjs';
import {CityNetwork} from '../city-network.mjs';
import {cityMaterialReport} from '../city-expansion.mjs';

// QA diagnostics on *temporary* worlds only. No production save or endpoint is used.
// Balance policy (resource renewability, city budget issuance) is reported, not silently assumed.
const projects = [
  ['square', CONFIG],
  ['forge', {...CONFIG,...CONFIG.forge}],
  ['bridge', {...CONFIG,...CONFIG.bridge}],
  ['seedShop', {...CONFIG,...CONFIG.seedMarket}],
  ['publicGarden', {...CONFIG,...CONFIG.cityGarden}]
];
const budgets = Object.fromEntries(projects.map(([name,c])=>[name,projectBudget(c)]));
const grandTotal = Object.values(budgets).reduce((n,v)=>n+v,0);
const totals=g=>Object.fromEntries(Object.entries(cityMaterialReport(g)).map(([k,v])=>[k,v.total]));
const globalTotals=net=>net.values().map(totals).reduce((s,t)=>({
  wood:s.wood+t.wood, stone:s.stone+t.stone
}),{wood:0,stone:0});
const wealth=net=>net.values().reduce((n,g)=>n+g.state.treasury+Object.values(g.state.players).reduce((v,p)=>v+p.wallet,0),0);
const issue=(g,p,type,target,extra={},id=type+Math.random().toString(16).slice(2))=>
  g.command(p,{type,target,requestId:'balance-'+id,...extra});
const at=(g,p,id)=>{const t=g.target(id);assert.ok(t,'missing target '+id);p.x=t.x;p.y=t.y;};

test('P0: all five construction budgets fit initial treasury with protected operating reserve',()=>{
  assert.deepEqual(budgets,{square:280,forge:190,bridge:166,seedShop:54,publicGarden:44});
  assert.equal(grandTotal,734);
  assert.ok(CONFIG.treasury>=grandTotal,'Buildings need more PAPER than initial funding');
  const g=new Game(createWorld());
  assert.equal(g.cityFunds(),CONFIG.treasury-grandTotal);
  assert.equal(g.cityFunds(),266);
  assert.ok(projectBudget(CONFIG)>=CONFIG.plotPrice,'A full solo city-square contribution must allow purchase of one plot');
  console.log('BUILDING_BUDGET_REPORT',JSON.stringify({
    budgets,allFive:grandTotal,initialTreasury:CONFIG.treasury,
    freeOperatingReserve:g.cityFunds(),plotPrice:CONFIG.plotPrice,
    note:'Assumes full original funding and delivery without other expenditures.'
  }));
});

test('P0: warehouse acceptance and replay conserve wood, stone, and PAPER',()=>{
  const g=new Game(createWorld()),p=g.join('Склад');
  g.connect(p);p.bag.wood=4;p.bag.stone=5;at(g,p,'warehouse');
  const beforeMaterial=totals(g),beforeWealth=g.state.treasury+p.wallet;
  const stone=issue(g,p,'warehouseSell','warehouse',{kind:'stone'},'warehouse-stone');
  assert.equal(stone.ok,true,JSON.stringify(stone));
  const wood=issue(g,p,'warehouseSell','warehouse',{kind:'wood'},'warehouse-wood');
  assert.equal(wood.ok,true,JSON.stringify(wood));
  assert.equal(g.state.warehouse.stock.stone,5);
  assert.equal(g.state.warehouse.stock.wood,4);
  assert.equal(g.state.treasury+p.wallet,beforeWealth,'PAPER must be a transfer, not created by sales');
  assert.deepEqual(totals(g),beforeMaterial);
  const repeat=issue(g,p,'warehouseSell','warehouse',{kind:'stone'},'warehouse-stone');
  assert.equal(repeat.ok,true);
  assert.equal(g.state.warehouse.stock.stone,5,'Repeated request must not add stones');
  assert.equal(g.state.treasury+p.wallet,beforeWealth);
  const copy=new Game(JSON.parse(JSON.stringify(g.state))),player=copy.auth(p.token);
  assert.ok(player);
  assert.deepEqual(totals(copy),beforeMaterial,'Real JSON migration must not duplicate or lose materials');
  assert.equal(copy.state.warehouse.stock.stone,5);
});

test('P0: travelling to another city does not duplicate or lose player resources and wallet',()=>{
  const net=new CityNetwork(createWorld()),first=net.origin,p=first.join('Основатель'),second=first.join('Гость');
  first.connect(p);first.connect(second);
  p.bag.wood=3;p.bag.stone=2;p.wallet=17;
  at(first,p,'city-registry');
  const city=net.command(p,{type:'createCity',name:'Аудит берег',requestId:'audit-create'});
  assert.equal(city.ok,true,JSON.stringify(city));
  const before=globalTotals(net),money=wealth(net),wallet=p.wallet;
  const travel=net.command(p,{type:'travelCity',cityId:city.id,requestId:'audit-travel'});
  assert.equal(travel.ok,true,JSON.stringify(travel));
  assert.equal(net.findToken(p.token)?.cityId,city.id);
  assert.equal(net.findToken(p.token)?.p.bag.wood,3);
  assert.equal(net.findToken(p.token)?.p.bag.stone,2);
  assert.equal(net.findToken(p.token)?.p.wallet,wallet);
  assert.deepEqual(globalTotals(net),before,'Intercity travel must conserve global raw materials');
  assert.equal(wealth(net),money,'Intercity travel must preserve global PAPER total');
  const restored=new CityNetwork(JSON.parse(JSON.stringify(net.serialize())));
  assert.deepEqual(globalTotals(restored),before,'Restored cities must conserve raw materials');
  assert.equal(wealth(restored),money,'Restored cities must conserve total PAPER');
});

test('Balance diagnostic: free-founded cities introduce additional city treasuries',()=>{
  const net=new CityNetwork(createWorld()),origin=net.origin,a=origin.join('Город 1'),b=origin.join('Город 2');
  origin.connect(a);origin.connect(b);
  at(origin,a,'city-registry');at(origin,b,'city-registry');
  const prior=wealth(net);
  const first=net.command(a,{type:'createCity',name:'Первый берег',requestId:'new-city-1'});
  const second=net.command(b,{type:'createCity',name:'Второй берег',requestId:'new-city-2'});
  assert.equal(first.ok,true);assert.equal(second.ok,true);
  const delta=wealth(net)-prior;
  assert.equal(delta,2*CONFIG.treasury);
  console.log('BALANCE_RISK',JSON.stringify({
    mechanism:'new city initialization',citiesCreated:2,newPAPER:delta,
    source:'createWorld treasury for each city',
    classification:'policy review required: issuer of PAPER is currently the free city creation mechanism',
    recommendation:'Define monetary issuance and city-founding costs before scaling to 12 cities.'
  }));
});

test('Balance diagnostic: limited mineral deposits and seed-stock are not replenished by idle time',()=>{
  const g=new Game(createWorld()),before=totals(g),seeds={...g.state.seedShop};
  g.tick(5*60*1000);
  assert.deepEqual(totals(g),before,'Idle time must not silently mint wood or stone');
  assert.deepEqual(g.state.seedShop,seeds);
  const counts=Object.fromEntries(['wood','stone'].map(kind=>[
    kind,g.state.resources.filter(r=>r.type===kind).reduce((n,r)=>n+r.stock,0)
  ]));
  console.log('BALANCE_RISK',JSON.stringify({
    mechanism:'finite world resources and shop stock',
    naturalDeposits:counts,seedShop:seeds,
    classification:'long-session progression review',
    recommendation:'Add explicit replenishment/regrowth/supply policies and tests before perpetual construction.',
  }));
});
