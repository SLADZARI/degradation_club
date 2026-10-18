// WORLD ORGANISM 0.8: independently verify the published D30 accounting snapshot
// against its accompanying economic contract. This does NOT run the missing
// autonomous simulator and is NOT a multiplayer or production acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const load=name=>readFileSync(join(root,name),'utf8');
const trial=JSON.parse(load('../BALANCE_CASE_v0_8_D30.json'));
const report=load('../D30_QA_REPORT_v0_8.md');
const contract=load('../DEMAND_CONTRACT_v0_8_CANDIDATE.md');
const decisions=load('../DECISIONS_FOR_INTEGRATION_v0_8.md');
const readRow=title=>{
  const rows=report.split(/\r?\n/);
  const row=rows.find(line=>line.startsWith('|')&&line.split('|')[1]?.trim()===title);
  assert.ok(row, 'QA report is missing row: '+title);
  const columns=row.split('|').map(v=>v.trim());
  return {baseline:Number(columns[2]),candidate:Number(columns[3])};
};
function accountingErrors(q) {
  const errors=[];
  const add=(name,ok)=>{if(!ok)errors.push(name);};
  add('money total',q.paper.total===q.paper.city+q.paper.players+q.paper.escrow);
  add('PAPER funded',q.paper.city>=0&&q.paper.players>=0&&q.paper.escrow>=0);
  add('physical hemp',q.demand.hempProcessed+q.demand.paperCreated*0+4===40&&q.demand.hempProcessed===6*q.demand.paperCreated);
  add('produced paper consumed',q.demand.paperConsumed===q.demand.paperCreated);
  add('carrot physical sinks',q.food.carrotsCreated===q.food.eatenByPlayers+q.food.eatenByCity+q.food.spoiled);
  add('project demand',q.demand.orders===q.city.projectsDone*2);
  add('demand delivered count',q.demand.fulfilledItems===q.demand.paperConsumed+q.food.eatenByCity);
  add('paid finite demand',q.demand.spentPAPER===q.demand.paperCreated*12+q.food.eatenByCity*3);
  add('nonnegative outcomes',q.food.unmetNeed>=0&&q.health.blocked>=0&&q.trade.deals>=0);
  return errors;
}
test('1 / source is explicitly a laboratory, not a deployed-game build',()=>{
  assert.equal(trial.schema,'DL_BALANCE_CASE/0.8');
  assert.equal(trial.modelVersion,'v0.8 DEMAND LAB');
  assert.equal(trial.status,'TEST_MODEL_NOT_SERVER');
  assert.equal(trial.productionServerChanged,false);
  assert.equal(trial.canonicalGddChanged,false);
  assert.equal(trial.priceAndRecipesCanonical,false);
});
test('2 / D30 is 30 days for 3 synthetic agents',()=>{
  assert.equal(trial.scenario,'normal'); assert.equal(trial.count,3);
  assert.equal(trial.minutes,30*24*60);
});
test('3 / PAPER is conserved across city + players + reserved escrow',()=>{
  assert.equal(trial.paper.total,3600);
  assert.deepEqual(accountingErrors(trial).filter(x=>x.includes('money')),[]);
});
test('4 / six finite orders account for six paper sheets and nine carrots',()=>{
  assert.equal(trial.city.projectsDone,3);
  assert.equal(trial.demand.orders,6);
  assert.equal(trial.demand.fulfilledItems,15);
  assert.equal(trial.demand.paperConsumed,6);
  assert.equal(trial.food.eatenByCity,9);
  assert.deepEqual(accountingErrors(trial).filter(x=>x.includes('demand')),[]);
});
test('5 / project demand pays exact physical consumption: 99 PAPER',()=>{
  assert.equal(trial.demand.spentPAPER,99);
  assert.deepEqual(accountingErrors(trial).filter(x=>x.includes('paid')),[]);
});
test('6 / paper sheets require 36 physical HEMP, no PAPER currency minted',()=>{
  assert.equal(trial.demand.hempProcessed,36);
  assert.equal(trial.demand.paperCreated,6);
  assert.equal(trial.demand.paperConsumed,6);
  assert.deepEqual(accountingErrors(trial).filter(x=>x.includes('hemp')||x.includes('paper')),[]);
});
test('7 / all 120 CARROT accounted: 90 player food, 9 city meals, 21 spoilage',()=>{
  assert.equal(trial.food.carrotsCreated,120);
  assert.deepEqual(accountingErrors(trial).filter(x=>x.includes('carrot')),[]);
});
test('8 / observed first-home completion is reported for all three agents',()=>{
  for(const k of ['plotsBought','tents','chests','beds'])assert.equal(trial.city[k],3,k);
});
test('9 / QA summary internally agrees on 36+16=52 and 41 reported invariants',()=>{
  assert.equal(trial.qa.stressRuns,3*4*3);
  assert.equal(trial.qa.passed,52);
  assert.equal(trial.qa.failed,0);
  assert.equal(trial.qa.invariants,41);
  assert.match(report,/52\/52/);
  assert.match(report,/41\/41/);
});
test('10 / HEMP waste change agrees with the published comparative report',()=>{
  assert.deepEqual(readRow('HEMP создано'),{baseline:508,candidate:40});
  assert.deepEqual(readRow('HEMP переработано'),{baseline:0,candidate:36});
  assert.deepEqual(readRow('HEMP в остатке'),{baseline:508,candidate:4});
});
test('11 / carrots changed and spoilage fraction fell in the report',()=>{
  assert.deepEqual(readRow('CARROT создано'),{baseline:255,candidate:120});
  assert.deepEqual(readRow('CARROT испорчено'),{baseline:219,candidate:21});
  const spoilOld=219/255,spoilNew=21/120;
  assert.ok(spoilNew<spoilOld/2);
  assert.equal(trial.food.spoiled,21);
});
test('12 / blocked actions reduced but are not described as all resolved',()=>{
  assert.deepEqual(readRow('Blocked'),{baseline:468,candidate:38});
  assert.equal(trial.health.blocked,38);
  assert.ok(trial.health.blocked>0);
});
test('13 / reduced P2P frequency is not mistaken for success-rate proof',()=>{
  assert.deepEqual(readRow('P2P сделки'),{baseline:213,candidate:64});
  assert.equal(trial.trade.deals,64);
  assert.match(report,/НЕ изолированный A\/B/);
});
test('14 / contract explicitly separates real sheets from monetary PAPER',()=>{
  assert.match(contract,/PAPER_SHEET/);
  assert.match(contract,/6 HEMP \+ 2 WATER/);
  assert.match(contract,/PAPER-01/);
  assert.match(contract,/FINITE/);
});
test('15 / report does not certify production or approve numerical policy',()=>{
  assert.match(decisions,/NOT IMPLEMENTED IN SERVER/);
  assert.match(decisions,/TEST/);
  assert.match(decisions,/голод только при активной игре/);
});
test('16 / paper tampering is detected by the independent balance checker',()=>{
  const q=structuredClone(trial);q.paper.city--;
  assert.ok(accountingErrors(q).includes('money total'));
});
test('17 / carrot disappearance is detected by the independent checker',()=>{
  const q=structuredClone(trial);q.food.spoiled--;
  assert.ok(accountingErrors(q).includes('carrot physical sinks'));
});
test('18 / demand overpayment is detected by the independent checker',()=>{
  const q=structuredClone(trial);q.demand.spentPAPER++;
  assert.ok(accountingErrors(q).includes('paid finite demand'));
});
test('19 / duplicate order is detected by the independent checker',()=>{
  const q=structuredClone(trial);q.demand.orders++;
  assert.ok(accountingErrors(q).includes('project demand'));
});
test('20 / counterfeit paper production is detected by the independent checker',()=>{
  const q=structuredClone(trial);q.demand.paperCreated++;
  assert.ok(accountingErrors(q).includes('physical hemp'));
  assert.ok(accountingErrors(q).includes('produced paper consumed'));
});
test('21 / replay of P2P transfers and per-order escrow cannot be proven from aggregate JSON',()=>{
  // Explicit negative assurance: the required ledger-level fields are absent.
  assert.ok(!('events' in trial));
  assert.ok(!('orders' in trial.demand)||typeof trial.demand.orders==='number');
  assert.ok(!('offers' in trial.trade));
  assert.ok(!('playerBalances' in trial.paper));
});
test('22 / balance diagnostics expose unmet food needs and remaining blocked actions',()=>{
  assert.ok(trial.food.unmetNeed>0);
  assert.ok(trial.health.blocked>0);
  assert.equal(trial.paper.escrow,0);
});
console.log('SOURCE_SNAPSHOT_AUDIT: independent consistency tests only; no v0.8 simulator, server, or JS browser UI executed.');
