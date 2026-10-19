import test from 'node:test';
import assert from 'node:assert/strict';
import {simulate,step,check,metrics,SETTINGS} from './shadow-model.mjs';
import {SESSION_CONTRACT,openSponsoredSession,serviceFeeEscrow,validateServices} from './sponsored-services.mjs';
const start=()=>simulate({policy:'sponsored-growth',environment:'normal',agents:3,days:1});
test('S01 service is citizen-funded: 15 to physically fulfill and 2 HELD until complete',()=>{
  const s=start(),p=s.players[0],oldWallet=p.wallet,oldCity=s.city;
  const ev=openSponsoredSession(s,{eventId:'intent:square:1',facility:'square',sponsorId:p.id});
  assert.ok(ev);assert.equal(p.wallet,oldWallet-17);
  assert.equal(s.city,oldCity,'cannot book speculative municipal revenue');
  assert.equal(ev.serviceFeeEscrow,2);assert.equal(serviceFeeEscrow(s),2);
  assert.equal(s.orders.length,2);
  assert.deepEqual(s.orders.map(x=>({asset:x.asset,escrow:x.escrow})),
    [{asset:'PAPER_SHEET',escrow:12},{asset:'CARROT',escrow:3}]);
  assert.equal(metrics(s).money.escrow,17);
  assert.equal(metrics(s).money.total,3600);check(s);
});
test('S02 duplicate service event cannot double-charge the citizen',()=>{
  const s=start(),p=s.players[0];
  const ev=openSponsoredSession(s,{eventId:'intent:square:2',facility:'square',sponsorId:p.id});
  const after=p.wallet;
  assert.equal(openSponsoredSession(s,{eventId:'intent:square:2',facility:'square',sponsorId:p.id}),ev);
  assert.equal(p.wallet,after);
  assert.equal(s.orders.length,2);
  assert.equal(s.services.length,1);check(s);
});
test('S03 insufficient balance rejects an optional service, with no credit/fee',()=>{
  const s=start(),p=s.players[0],before=metrics(s).money;
  p.wallet=10;s.city+=before.players-(s.players.reduce((n,q)=>n+q.wallet,0));
  check(s);
  assert.equal(openSponsoredSession(s,{eventId:'intent:poor:1',facility:'square',sponsorId:p.id}),null);
  assert.equal(s.services.length,0);assert.equal(s.orders.length,0);
  assert.equal(s.servicesRevenue,0);check(s);
});
test('S04 expired physically unfilled event refunds exactly 17 and cannot grant city fees',()=>{
  const s=start(),p=s.players[0],before=p.wallet,city=s.city;
  const ev=openSponsoredSession(s,{eventId:'intent:expire:1',facility:'square',sponsorId:p.id,expiresIn:1});
  assert.equal(ev.serviceFeeEscrow,2);
  step(s); // expires at beginning of day 32, before products or service delivery
  assert.equal(ev.status,'EXPIRED');assert.equal(ev.feePaid,0);
  assert.equal(ev.refunded,17);assert.equal(ev.delivered,0);
  assert.equal(p.wallet,before);
  assert.equal(s.city,city);assert.equal(serviceFeeEscrow(s),0);
  assert.equal(s.orders.every(o=>o.status==='EXPIRED'),true);check(s);
});
test('S05 manual overwriting of fee escrow is caught as counterfeit PAPER',()=>{
  const s=start(),p=s.players[0];
  const ev=openSponsoredSession(s,{eventId:'intent:tamper:1',facility:'square',sponsorId:p.id});
  ev.serviceFeeEscrow+=1;assert.throws(()=>check(s),/PAPER minted/);
});
test('S06 player cannot sponsor another identity with missing authorization',()=>{
  const s=start();
  assert.throws(()=>openSponsoredSession(s,{eventId:'intent:ghost:1',facility:'square',sponsorId:'missing'}),/not a registered player/);
  assert.throws(()=>openSponsoredSession(s,{eventId:'x',facility:'square',sponsorId:s.players[0].id}),/bad service event ID/);
  check(s);
});
test('S07 long horizon has no double service fees and all physical goods are accounted',()=>{
  const s=simulate({policy:'sponsored-growth',environment:'normal',agents:3,days:360}),m=metrics(s);
  assert.ok(s.services.length>0,'must have real citizen-backed meetings');
  assert.equal(m.money.total,3600);
  assert.equal(s.servicesRevenue,s.services.reduce((n,v)=>n+v.feePaid,0));
  assert.equal(s.services.filter(v=>v.status==='COMPLETE').length,m.sponsored.completed);
  assert.ok(s.services.every(v=>v.status!=='COMPLETE'||v.feePaid===2));
  assert.ok(s.services.every(v=>v.status==='COMPLETE'||v.feePaid===0));
  assert.ok(m.sponsored.feesEarned>0);
  assert.ok(s.services.every(v=>v.serviceFeeEscrow>=0&&v.serviceFeeEscrow<=2));
  assert.ok(m.sponsored.observedGoods>=m.sponsored.completed*2);
  validateServices(s);check(s);
});
test('S08 unmet venue capacity can cause demand-justified functional hall construction',()=>{
  const s=simulate({policy:'sponsored-growth',environment:'normal',agents:5,days:150}),m=metrics(s);
  assert.ok(m.sponsored.unserved>0,'venue-capacity pressure must be observed');
  assert.ok(m.buildings.new.includes('communityHall'),'built hall should add measurable civic capacity');
  assert.ok(m.buildings.new.every(n=>['pantry','irrigation','communityHall','readingRoom'].includes(n)));
  assert.ok(m.buildings.completed<=4);
  assert.equal(m.money.total,3600);check(s);
});
test('S09 no public funds are consumed by an unsupported session request',()=>{
  const s=start(),p=s.players[0],beforeCity=s.city;
  const a=openSponsoredSession(s,{eventId:'intent:square:book',facility:'square',sponsorId:p.id});
  assert.ok(a);
  assert.equal(s.city,beforeCity);
  assert.equal(s.orders.reduce((n,o)=>n+o.escrow,0)+serviceFeeEscrow(s),17);
  assert.equal(moneyTotal(s),3600);check(s);
});
function moneyTotal(s){return s.city+s.players.reduce((n,p)=>n+p.wallet,0)+s.orders.reduce((n,o)=>n+o.escrow,0)+serviceFeeEscrow(s);}
test('S10 weekly service is only created with willing ACTIVE users: weekends are not charged for offline days',()=>{
  const s=simulate({policy:'sponsored-growth',environment:'normal',agents:3,activity:'weekends',days:90});
  check(s);
  assert.equal(s.services.length,s.services.filter(v=>v.at%7===0).length);
  const m=metrics(s);
  assert.equal(m.food.mealNeeds,m.food.eaten+m.food.unmet);
  assert.ok(m.food.mealNeeds<270);
});
test('S11 municipal revenue is tied to fully delivered utility, not the act of charging citizens',()=>{
  const s=simulate({policy:'sponsored-growth',environment:'dry',agents:3,days:90});
  check(s);
  assert.equal(s.servicesRevenue,s.services.filter(v=>v.status==='COMPLETE').length*SESSION_CONTRACT.municipalFee);
  assert.equal(s.services.filter(v=>v.status==='PARTIAL'||v.status==='EXPIRED').reduce((n,v)=>n+v.feePaid,0),0);
});
