import test from 'node:test';import assert from 'node:assert/strict';
import {createFederation,federationRun,dayStep,checkFederation,federationMetrics} from './federation-model.mjs';
const opts={agents:20,cityCount:3,environment:'normal',logistics:'trade'};
test('B01 zero-wallet residents can eat only a physical carrot, paid by the existing city',()=>{
 const w=createFederation({...opts,foodMarket:'cooperative-basic'}),p=w.players[0],city=w.cities[0];
 const transfer=p.wallet;p.wallet=0;city.treasury+=transfer;
 city.carrots=[{at:w.day,qty:1,ownerId:w.players[3].id}];city.stock.CARROT=1;
 w.grown.CARROT=1;checkFederation(w);
 const start=city.treasury;dayStep(w);
 assert.ok(city.subsidizedZeroWallet>=1,'zero wallet basic meal not provided');
 assert.ok(city.subsidySpent>=3);
 assert.ok(city.treasury<=start-3);
 assert.equal(federationMetrics(w).economy.moneyTotal,3600);checkFederation(w);
});
test('B02 zero-wallet full meal never creates PAPER if treasury depleted',()=>{
 const w=createFederation({...opts,foodMarket:'cooperative-basic'}),city=w.cities[0],person=w.players[0];
 person.wallet=0;city.treasury=0;
 // Allocate preserved fixture difference (original city 600 + initial person 90) to another player.
 w.players[1].wallet+=690;
 city.carrots=[{at:w.day,qty:1,ownerId:w.players[3].id}];city.stock.CARROT=1;w.grown.CARROT=1;
 checkFederation(w);dayStep(w);checkFederation(w);
 assert.equal(city.subsidizedZeroWallet,0);
});
test('B03 only one full zero-wallet city meal per day, not infinite welfare faucet',()=>{
 const w=createFederation({...opts,foodMarket:'cooperative-basic'}),city=w.cities[0];
 const citizens=w.players.filter(p=>p.cityId===city.id);
 let sum=0;for(const p of citizens){sum+=p.wallet;p.wallet=0;}
 city.treasury+=sum;
 city.carrots=[{at:w.day,qty:8,ownerId:w.players[3].id}];city.stock.CARROT=8;w.grown.CARROT=8;
 checkFederation(w);dayStep(w);checkFederation(w);
 assert.ok(city.subsidizedZeroWallet<=1);
});
test('B04 matched normal, dry and wet extended scenarios conserve 3600 PAPER',()=>{
 for(const environment of ['normal','dry','wet'])
 for(const agents of [10,15,20]){
 const w=federationRun({agents,cityCount:3,environment,logistics:'trade',foodMarket:'cooperative-basic',days:360});
 checkFederation(w);assert.equal(federationMetrics(w).economy.moneyTotal,3600);
 }
});
test('B05 food accessibility compared with previously tested cooperative policy',()=>{
 for(const environment of ['normal','dry']){
 const base=federationMetrics(federationRun({agents:20,cityCount:3,environment,foodMarket:'cooperative',days:360}));
 const basic=federationMetrics(federationRun({agents:20,cityCount:3,environment,foodMarket:'cooperative-basic',days:360}));
 assert.equal(basic.economy.moneyTotal,base.economy.moneyTotal);
 console.log('BASIC_FOOD_POLICY_COMPARISON',JSON.stringify({environment,cooperative:base.food,basic:basic.food,cityPAPER:{cooperative:base.economy.cityMoney,basic:basic.economy.cityMoney}}));
 }
});