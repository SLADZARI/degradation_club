import test from 'node:test';
import assert from 'node:assert/strict';
import {simulate,step,check,metrics,SETTINGS} from './shadow-model.mjs';
import {assertRegistry,pendingProjects,REGISTRY} from './project-registry.mjs';
test('R01 every construction has an identified need, funded cost and functional result',()=>{
  assert.equal(assertRegistry(SETTINGS),true);
  assert.deepEqual(REGISTRY.map(r=>r.id),['pantry','irrigation','communityHall','readingRoom']);
  for(const item of REGISTRY){
    assert.ok(item.description.length>15);
    assert.ok(item.policies.includes('sponsored-growth'));
    assert.ok(SETTINGS[item.setting].WOOD>0);
    assert.ok(SETTINGS[item.setting].STONE>0);
    assert.ok(SETTINGS[item.setting].payout>0);
  }
});
test('R02 no building without accumulated verified need',()=>{
  const s=simulate({policy:'sponsored-growth',environment:'normal',agents:5,days:1});
  const ps=pendingProjects(s,SETTINGS);
  assert.equal(ps.filter(p=>p.eligible).length,0);
  assert.equal(s.projects.length,0);check(s);
});
test('R03 real sponsorship venue pressure unlocks hall but no replay',()=>{
  const s=simulate({policy:'sponsored-growth',environment:'normal',agents:5,days:150});
  const m=metrics(s);
  assert.ok(m.buildings.new.includes('communityHall'));
  assert.ok(m.sponsored.unserved>=SETTINGS.communityHall.minUnserved);
  assert.equal(new Set(m.buildings.new).size,m.buildings.new.length);
  for(let i=0;i<20;i++)step(s);
  assert.ok(s.projects.includes('communityHall'));
  assert.equal(new Set(s.projects).size,s.projects.length);check(s);
});
test('R04 material exhaustion leaves projects unbuilt despite the existence of a need',()=>{
  const s=simulate({policy:'sponsored-growth',environment:'normal',agents:5,days:5});
  s.serviceRequestsUnserved=100;s.day=100;
  s.wood=0;s.embodied.WOOD=s.woodInitial; // test setup reallocates actual material to embodied account
  const projects=pendingProjects(s,SETTINGS);
  assert.ok(projects.filter(p=>p.id==='communityHall').every(p=>p.needed&&!p.materials&&!p.eligible));
  check(s);
});
test('R05 insufficient municipal treasury leaves requested venue unbuilt',()=>{
  const s=simulate({policy:'sponsored-growth',environment:'normal',agents:5,days:5});
  s.serviceRequestsUnserved=100;s.day=100;
  const transfer=s.city-2;s.city=2;s.players[0].wallet+=transfer; // conserving global PAPER
  const project=pendingProjects(s,SETTINGS).find(x=>x.id==='communityHall');
  assert.equal(project.needed,true);assert.equal(project.financed,false);assert.equal(project.eligible,false);
  check(s);
});
test('R06 scheduled construction is not an infinite time-based building faucet',()=>{
 const s=simulate({policy:'sponsored-growth',environment:'normal',agents:5,days:360});
 assert.ok(s.projects.length<=REGISTRY.length);
 assert.equal(s.city+s.players.reduce((n,p)=>n+p.wallet,0)+s.orders.reduce((n,o)=>n+o.escrow,0)+s.services.reduce((n,v)=>n+v.serviceFeeEscrow,0),3600);
 check(s);
});
test('R07 normal sponsored economy has positive actual municipal services and retained spending capacity',()=>{
 const a=metrics(simulate({policy:'sponsored-growth',environment:'normal',agents:3,days:360}));
 const baseline=metrics(simulate({policy:'needs-growth',environment:'normal',agents:3,days:360}));
 assert.ok(a.sponsored.completed>=50);
 assert.equal(a.sponsored.feesEarned,a.sponsored.completed*2);
 assert.ok(a.money.city>baseline.money.city);
 assert.equal(a.demand.unfunded,0);
 assert.ok(a.buildings.completed>=3);
 assert.equal(a.money.total,baseline.money.total);
});
test('R08 nonparticipation cannot fabricate revenue or construction',()=>{
 const s=simulate({policy:'sponsored-growth',environment:'normal',agents:3,days:1});
 s.players.forEach(p=>p.wallet=0);
 // Conserved test fixture reassigns those holdings to the city. It is not a taxation policy.
 s.city=3600;
 s.wood=0;s.embodied.WOOD=s.woodInitial; // prevent any wage-funded project from changing voluntary participation
 check(s);
 for(let i=0;i<35;i++)step(s);
 assert.equal(s.services.length,0);
 assert.equal(s.servicesRevenue,0);
 assert.equal(s.serviceRequestsUnserved,0);
 check(s);
});

test('R09 city treasury is exactly starting funds minus real construction wages plus completed fees',()=>{
 for(const scenario of ['normal','dry','treasury']){
  const s=simulate({policy:'sponsored-growth',environment:scenario,agents:3,days:360});
  const starting=scenario==='treasury'?35:2301;
  assert.equal(s.city,starting-s.buildPaid+s.servicesRevenue,
    'city spent unfunded PAPER or created fee without delivery in '+scenario);
  assert.equal(s.servicesRevenue,s.services.filter(x=>x.status==='COMPLETE').length*2);
  check(s);
 }
});
test('R10 meeting hall investment is justified by prior unserved willing visitor requests',()=>{
 const s=simulate({policy:'sponsored-growth',environment:'normal',agents:5,days:180});
 assert.ok(s.serviceRequestsUnserved>=SETTINGS.communityHall.minUnserved);
 assert.ok(s.projects.includes('communityHall'));
 assert.ok(s.projects.includes('readingRoom'));
 assert.equal(new Set(s.projects).size,s.projects.length);
 assert.ok(s.players.every(p=>p.wallet>=0));
 check(s);
});
