import test from 'node:test';
import assert from 'node:assert/strict';
import {federationRun,federationMetrics,checkFederation,createFederation,dayStep} from './federation-model.mjs';
const sweep=[];
for(const climate of ['normal','dry'])
 for(const reserve of [0,30,90,180,360])
  for(const weekly of [0,12,24,48,96]){
   test('EQUITY '+climate+' reserve='+reserve+' cap='+weekly,()=>{
    const w=federationRun({agents:20,cityCount:3,environment:climate,logistics:'trade',foodMarket:'cooperative-guarded',days:360,welfareMinTreasury:reserve,welfareWeeklyLimit:weekly});
    checkFederation(w);const m=federationMetrics(w);
    const denied=m.residentFood.reduce((n,p)=>n+p.denied,0);
    const eligible=m.residentFood.reduce((n,p)=>n+p.eligible,0);
    assert.equal(m.economy.moneyTotal,3600);
    assert.ok(denied<=eligible);
    assert.equal(denied,m.cityRows.reduce((n,c)=>n+c.welfareDeniedBudget,0));
    for(const c of m.cityRows)assert.ok(Object.values(c.weeklyWelfare).every(v=>v<=weekly));
    sweep.push({climate,reserve,weekly,unmet:m.food.unmet,noCash:m.food.noCash,noFood:m.food.noFood,treasury:m.economy.cityMoney,subsidy:m.food.subsidiesSpent,helped:m.food.subsidized,eligible,denied,worst:Math.max(...m.residentFood.map(p=>p.unmet)),worstDenialStreak:Math.max(...m.residentFood.map(p=>p.longestDenialStreak)),neverHelpedEligible:m.residentFood.filter(p=>p.eligible>0&&p.helped===0).length});
   });
  }
test('EQUITY contract: no citizen has more subsidy refusals than qualifying requests',()=>{
 const w=federationRun({agents:20,cityCount:3,foodMarket:'cooperative-guarded',days:360});
 for(const p of w.players)assert.ok(p.deniedHelp<=p.eligibleHelp);
 checkFederation(w);
});
test('EQUITY counter sanity: fully closed weekly subsidy budget blocks an eligible request',()=>{
 const w=federationRun({agents:20,cityCount:3,foodMarket:'cooperative-guarded',days:80,welfareWeeklyLimit:0});
 assert.equal(w.cities.reduce((n,c)=>n+c.subsidySpent,0),0);
 assert.ok(w.players.some(p=>p.deniedHelp>0));
 checkFederation(w);
});
test('EQUITY original guardrail retains its previous food counts',()=>{
 const w=federationRun({agents:20,cityCount:3,foodMarket:'cooperative-guarded',days:360,welfareMinTreasury:90,welfareWeeklyLimit:24});
 const m=federationMetrics(w);
 assert.equal(m.food.unmet,1004);
 assert.equal(m.economy.cityMoney,925);
});
test('EQUITY summarize Pareto points without declaring one optimum',()=>{
 const nondominated=sweep.filter((a)=>!sweep.some(b=>b!==a&&a.climate===b.climate&&b.unmet<=a.unmet&&b.treasury>=a.treasury&&(b.unmet<a.unmet||b.treasury>a.treasury)));
 console.log('EQUITY_SWEEP',JSON.stringify({all:sweep,pareto:nondominated}));
 assert.equal(sweep.length,50);
 assert.ok(nondominated.length>0);
});
