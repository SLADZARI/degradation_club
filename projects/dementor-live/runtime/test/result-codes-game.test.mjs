import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,createWorld} from '../world-expansion-adapter.mjs';
import {CityNetwork} from '../city-network.mjs';
import {withActionCode} from '../result-codes.mjs';

test('new server receipts include typed params, duplicate requestId never reruns drop or changes saved world',()=>{
  const game=new Game(createWorld()),player=game.join('I18N Test');
  player.bag.wood=5;
  const originalCommand={type:'drop',kind:'wood',quantity:3,requestId:'i18n-drop-once'};
  const first=game.command(player,originalCommand);
  assert.equal(first.ok,true);assert.equal(first.code,'action.inventory.drop');
  assert.deepEqual(first.params,{quantity:3});
  assert.equal(player.bag.wood,2);
  assert.equal(game.state.drops.reduce((n,p)=>n+p.quantity,0),3);
  const saved=JSON.stringify(game.state),seen=withActionCode(first);
  assert.equal(seen.message,first.message);
  const repeated=game.command(player,{type:'pickup',target:'unknown',requestId:'i18n-drop-once'});
  assert.deepEqual(repeated,first,'reusing requestId with different type must return original receipt');
  assert.deepEqual(withActionCode(repeated),seen,'wire code cannot be relabeled by incoming request type');
  assert.equal(JSON.stringify(game.state),saved,'no extra writes, depletion, reward or movement after duplicate');
  const restarted=new Game(JSON.parse(saved)),restored=restarted.auth(player.token);
  const cold=JSON.stringify(restarted.state);
  assert.deepEqual(restarted.command(restored,originalCommand),first);
  assert.equal(JSON.stringify(restarted.state),cold,'rebooted game must not rerun cached command');
  assert.equal(restored.bag.wood,2);
});

test('payout typed receipt preserves wallet, treasury and reward across retries and restart',()=>{
  const game=new Game(createWorld()),player=game.join('Казначей');
  player.bag.wood=3;
  const warehouse=game.target('warehouse');player.x=warehouse.x;player.y=warehouse.y;
  const beforeTreasury=game.state.treasury;
  const cmd={type:'warehouseSell',kind:'wood',requestId:'i18n-warehouse-once'};
  const first=game.command(player,cmd);
  assert.equal(first.ok,true,first.message);assert.equal(first.code,'action.warehouse.deposit');
  assert.equal(first.params.quantity,3);assert.equal(first.params.reward,first.reward);
  assert.equal(player.wallet,first.reward);
  assert.equal(game.state.treasury,beforeTreasury-first.reward);
  const saved=JSON.stringify(game.state);
  const replay=game.command(player,{type:'courierDeliver',requestId:cmd.requestId});
  assert.deepEqual(replay,first);assert.equal(JSON.stringify(game.state),saved);
  const rebooted=new Game(JSON.parse(saved)),back=rebooted.auth(player.token);
  const onDisk=JSON.stringify(rebooted.state);
  assert.deepEqual(rebooted.command(back,cmd),first);
  assert.equal(JSON.stringify(rebooted.state),onDisk);
  assert.equal(back.wallet,first.reward);assert.equal(rebooted.state.treasury,beforeTreasury-first.reward);
});

test('old Russian-only successful and failed receipts are enriched over wire, never rewritten',()=>{
  const game=new Game(createWorld()),player=game.join('Legacy');
  const legacySuccess={ok:true,message:'Склад принял 3 · +6 PAPER',reward:6};
  const legacyError={ok:false,message:'Участок уже куплен'};
  player.results.push({id:'legacy-sale',result:legacySuccess},{id:'legacy-error',result:legacyError});
  const original=JSON.stringify(game.state);
  const replay=game.command(player,{type:'drop',kind:'wood',quantity:99,requestId:'legacy-sale'});
  assert.deepEqual(replay,legacySuccess);
  assert.deepEqual(withActionCode(replay),{...legacySuccess,code:'action.warehouse.deposit',params:{quantity:3,reward:6}});
  assert.deepEqual(withActionCode(game.command(player,{type:'buy',target:'plot-1',requestId:'legacy-error'})),
    {...legacyError,code:'error.plot.owned',params:{}});
  assert.equal(JSON.stringify(game.state),original);
  assert.strictEqual(player.results.at(-2).result,legacySuccess);
  assert.strictEqual(player.results.at(-1).result,legacyError);
  assert.equal(player.wallet,0);
});

test('city network keeps typed creation and travel outcomes bound to original requestId',()=>{
  const net=new CityNetwork(createWorld()),p=net.origin.join('Resident');
  const reg=net.origin.target('city-registry');p.x=reg.x;p.y=reg.y;
  const created=net.command(p,{type:'createCity',name:'Тестовый город',requestId:'i18n-create-city-once'});
  assert.equal(created.ok,true,created.message);
  assert.equal(created.code,'world.city.created');
  assert.equal(created.params.cityName,'Тестовый город');
  const before=JSON.stringify(net.serialize());
  assert.deepEqual(net.command(p,{type:'pagerBuy',requestId:'i18n-create-city-once'}),created);
  assert.equal(JSON.stringify(net.serialize()),before);
  const moved=net.command(p,{type:'travelCity',cityId:created.id,requestId:'i18n-travel-city-once'});
  assert.equal(moved.ok,true,moved.message);assert.equal(moved.code,'world.city.arrived');
  assert.equal(net.findId(p.id)?.cityId,created.id);
  const saved=JSON.parse(JSON.stringify(net.serialize())),coldNet=new CityNetwork(saved),back=coldNet.findId(p.id).p;
  const prior=JSON.stringify(coldNet.serialize());
  assert.deepEqual(coldNet.command(back,{type:'createCity',name:'Fake',requestId:'i18n-create-city-once'}),created);
  assert.deepEqual(coldNet.command(back,{type:'travelCity',cityId:'origin',requestId:'i18n-travel-city-once'}),moved);
  assert.equal(JSON.stringify(coldNet.serialize()),prior);
  assert.equal(coldNet.findId(p.id)?.cityId,created.id);
});
