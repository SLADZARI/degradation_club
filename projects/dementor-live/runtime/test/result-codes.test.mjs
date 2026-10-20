import test from 'node:test';
import assert from 'node:assert/strict';
import {withActionCode,withHttpCode} from '../result-codes.mjs';

test('legacy warehouse receipt yields structured data on wire without modifying receipt',()=>{
  const saved=Object.freeze({ok:true,message:'Склад принял 3 · +6 PAPER',reward:6});
  const before=JSON.stringify(saved);
  const wire=withActionCode(saved);
  assert.deepEqual(wire,{ok:true,message:saved.message,reward:6,code:'action.warehouse.deposit',params:{quantity:3,reward:6}});
  assert.equal(JSON.stringify(saved),before);
  assert.notStrictEqual(wire,saved);
  assert.deepEqual(withActionCode(saved),wire);
});

test('old project delivery, dropped cargo and pickup derive only from saved authoritative messages',()=>{
  assert.deepEqual(withActionCode({ok:true,message:'Принято 2 · +4 PAPER',reward:4}).params,{quantity:2,reward:4});
  assert.equal(withActionCode({ok:true,message:'Принято 2 · +4 PAPER',reward:9}).code,'action.completed');
  assert.deepEqual(withActionCode({ok:true,message:'Выложено на землю: 7. Любой житель может подобрать.'}).params,{quantity:7});
  assert.deepEqual(withActionCode({ok:true,message:'Подобрано: 2'}).params,{quantity:2});
  assert.deepEqual(withActionCode({ok:true,message:'Доставка принята · +2 PAPER',reward:2}).params,{reward:2});
});

test('new typed result is preserved and unknown/untrusted params cannot enter translations',()=>{
  const saved=Object.freeze({ok:true,message:'Принято 1 · +2 PAPER',code:'action.project.deliver',reward:2,params:Object.freeze({quantity:1,reward:2,rawChat:'<img onerror=x>',nested:{sensitive:true}})});
  const wire=withActionCode(saved);
  assert.equal(wire.code,'action.project.deliver');
  assert.deepEqual(wire.params,{quantity:1,reward:2});
  assert.equal(saved.params.rawChat,'<img onerror=x>');
  assert.notStrictEqual(wire.params,saved.params);
});

test('known action errors are stable, missing errors safe, old message unchanged',()=>{
  assert.deepEqual(withActionCode({ok:false,message:'Недостаточно PAPER'}),{ok:false,message:'Недостаточно PAPER',code:'error.economy.insufficientPaper',params:{}});
  assert.equal(withActionCode({ok:false,message:'Участок уже куплен'}).code,'error.plot.owned');
  assert.equal(withActionCode({ok:false,message:'В рюкзаке нет места'}).code,'error.inventory.full');
  const unknown=withActionCode({ok:false,message:'Необработанная внутренняя ошибка'});
  assert.equal(unknown.code,'error.generic');
  assert.equal(unknown.message,'Необработанная внутренняя ошибка');
  assert.deepEqual(unknown.params,{});
});

test('unrecognized success and missing fields use stable neutral fallback',()=>{
  assert.equal(withActionCode({ok:true,message:'Новая сюжетная реплика'}).code,'action.completed');
  assert.equal(withActionCode({ok:true,started:true}).code,'action.completed');
  assert.deepEqual(withActionCode({ok:true,started:true}).params,{});
  const object={x:10};assert.strictEqual(withActionCode(object),object); // untouched non-action payload
});

test('action type is not an argument: client replay cannot relabel a saved receipt',()=>{
  const receipt={ok:true,message:'Склад принял 4 · +8 PAPER',reward:8};
  assert.equal(withActionCode(receipt).code,'action.warehouse.deposit');
  assert.equal(withActionCode(receipt).params.quantity,4);
  assert.equal(withActionCode(receipt).message,receipt.message);
});

test('combat saved create/join/ammo responses do not rely on untrusted incoming type',()=>{
  assert.equal(withActionCode({ok:true,sessionId:'session-old'}).code,'combat.session.ready');
  assert.equal(withActionCode({ok:true,ammo:12,shopRemaining:120}).code,'combat.ammo.purchased');
  assert.deepEqual(withActionCode({ok:true,sessionId:'session-old'}).params,{});
});

test('safety: no unknown code injection, no overflow amounts, no phone or chat in params',()=>{
  const bad=withActionCode({ok:true,code:'<script>evil</script>',params:{quantity:Number.MAX_VALUE+1},message:'Привет'});
  assert.equal(bad.code,'action.completed');assert.deepEqual(bad.params,{});
  const safe=withActionCode({ok:true,message:'Пейджер куплен. Номер: 123456'});
  assert.equal(safe.code,'action.pager.purchased');assert.deepEqual(safe.params,{});
  const city=withActionCode({ok:true,code:'world.city.arrived',message:'Добро пожаловать в Новый город',params:{cityName:'Новый город',privateToken:'should-not-leak'}});
  assert.deepEqual(city.params,{cityName:'Новый город'});
});

test('HTTP enrichment preserves existing clients and does not decorate health or state',()=>{
  const health={ok:true,version:'0.5.0-rc.4'};assert.strictEqual(withHttpCode(health,200),health);
  const state={ok:true,players:[]};assert.strictEqual(withHttpCode(state,200),state);
  const login=withHttpCode({ok:false,message:'Войди в мир заново'},401);
  assert.equal(login.code,'error.auth.rejoin');assert.equal(login.message,'Войди в мир заново');
  assert.equal(withHttpCode({ok:false,message:'arbitrary'},403).code,'error.http.forbidden');
  assert.equal(withHttpCode({ok:false,message:'arbitrary'},404).code,'error.http.notFound');
});

test('legacy action result fields survive transparent JSON round trip',()=>{
  const prior={ok:true,message:'Склад принял 5 · +10 PAPER',reward:10,extra:{receipt:{id:'legacy'}}};
  const newer=withActionCode(prior);
  assert.deepEqual(JSON.parse(JSON.stringify(newer)).extra,prior.extra);
  assert.equal(newer.reward,prior.reward);assert.deepEqual(prior,{ok:true,message:'Склад принял 5 · +10 PAPER',reward:10,extra:{receipt:{id:'legacy'}}});
});
