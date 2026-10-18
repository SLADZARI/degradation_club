import test from 'node:test';
import assert from 'node:assert/strict';
import {simulate,check,metrics,SETTINGS} from './shadow-model.mjs';

// These are forward projections from synthetic D30 holdings, NOT a 365-day replay of the original game.
for(const policy of ['upkeep','needs-growth'])
 for(const environment of ['normal','dry','treasury'])
  for(const agents of [3,5])
   for(const days of [180,360]){
    test('LONG '+policy+' / '+environment+' / '+agents+' agents / +'+days+' days',()=>{
      const s=simulate({policy,environment,agents,days,activity:'daily'}),m=metrics(s);
      check(s);
      assert.equal(m.money.total,3600,'PAPER inflation/deflation');
      assert.equal(m.money.escrow,s.orders.reduce((n,o)=>n+o.escrow,0));
      assert.equal(m.accounting.WOOD,0);
      assert.equal(m.accounting.STONE,0);
      assert.equal(m.accounting.CARROT,0);
      assert.ok(m.buildings.completed<=2,'unbounded auto construction');
      assert.ok(m.demand.filled<=m.demand.posted);
      assert.ok(m.money.city>=0,'municipality has taken unbacked debt');
    });
   }
test('yearly policy stress: city's 90-day financing cannot be extrapolated indefinitely',()=>{
  const q=metrics(simulate({policy:'needs-growth',environment:'normal',agents:3,days:360}));
  const early=metrics(simulate({policy:'needs-growth',environment:'normal',agents:3,days:90}));
  assert.ok(q.money.city<early.money.city,'finite municipal treasury should trend downward with paid recurring events');
  assert.ok(q.demand.unfunded>=early.demand.unfunded,'loss of funding must not be hidden by minting');
  assert.ok(q.buildings.new.length<=2,'the framework must not invent endless functions');
  assert.equal(q.money.total,SETTINGS.initialPAPER);
});
test('yearly weekend profile: no off-session hunger or asset duplication',()=>{
 const state=simulate({policy:'needs-growth',environment:'normal',agents:3,days:360,activity:'weekends'});
 const result=metrics(state);
 check(state);
 assert.equal(result.food.mealNeeds,result.food.eaten+result.food.unmet);
 assert.ok(result.food.mealNeeds<360*3);
 assert.equal(result.money.total,3600);
});
