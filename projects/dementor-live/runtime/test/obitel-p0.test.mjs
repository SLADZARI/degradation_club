import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,createWorld} from '../world-expansion-adapter.mjs';
import {OBITEL_ZEN_CARDS} from '../obitel-p0.mjs';

let n=0;
function run(g,p,type,target,extra={},id='obitel-test-'+(++n)){
  return g.command(p,{requestId:id,type,target,...extra});
}
test('seven original ZEN cards use distinct IDs and never claim finished content',()=>{
  assert.equal(OBITEL_ZEN_CARDS.length,7);
  assert.equal(new Set(OBITEL_ZEN_CARDS.map(c=>c.id)).size,7);
  for(const c of OBITEL_ZEN_CARDS){
    assert.ok(c.title&&c.question);assert.equal(c.sourceStatus,'ready');
  }
});
test('ZEN supports answer, skip, pending request, persistence and safe return without money changes',()=>{
  const g=new Game(createWorld()),p=g.join('Игрок ЗЕН');
  const entry=g.target('obitel-zen-entry');assert.ok(entry);
  p.x=entry.x;p.y=entry.y;
  const initialWallet=p.wallet,initialTreasury=g.state.treasury;
  assert.equal(run(g,p,'worldUse','obitel-zen-entry').ok,true);
  assert.equal(p.scene,'obitel-zen');
  assert.equal(g.snapshot(p).obitel.mountainUnlocked,false);
  const card=g.target('OB-C02');assert.ok(card);
  p.x=card.x;p.y=card.y;
  const open=run(g,p,'worldUse',card.id);
  assert.equal(open.ok,true);
  assert.match(open.obitel.question,/идеальный день/);
  assert.equal(open.obitel.completed,false);
  const skipped=run(g,p,'obitelSkip',card.id);
  assert.equal(skipped.ok,true);
  assert.equal(g.snapshot(p).obitel.cards[card.id].answerCount,0);
  assert.equal(run(g,p,'obitelAnswer',card.id,{answer:'   '}).ok,false);
  const request={requestId:'obitel-response-request-A',type:'obitelAnswer',target:card.id,answer:'Утро рядом с семьёй'};
  const result=g.command(p,request);
  assert.equal(result.ok,true);
  assert.deepEqual(g.command(p,request),result);
  assert.equal(g.snapshot(p).obitel.cards[card.id].answerCount,1);
  assert.ok(g.snapshot(p).obitel.cards[card.id].lastAnsweredAt);
  assert.equal(run(g,p,'obitelContinue',card.id).ok,true);
  assert.equal(run(g,p,'obitelContinue',card.id).ok,true);
  assert.equal(Object.keys(p.obitel.continuationRequests).length,1);
  assert.equal(p.obitel.continuationRequests[card.id].status,'pending');
  assert.equal(g.snapshot(p).obitel.completedQuests,0);
  assert.equal(p.wallet,initialWallet);assert.equal(g.state.treasury,initialTreasury);
  const restored=new Game(structuredClone(g.state));
  const same=restored.auth(p.token);
  assert.equal(restored.snapshot(same).obitel.cards[card.id].answerCount,1);
  assert.ok(restored.snapshot(same).obitel.cards[card.id].continuationRequestedAt);
  const exit=restored.target('obitel-zen-exit');
  same.x=exit.x;same.y=exit.y;
  assert.equal(run(restored,same,'worldUse',exit.id).ok,true);
  assert.equal(same.scene,'city');
  assert.equal(same.x,entry.x);assert.equal(same.y,entry.y);
});
test('cannot answer remotely from city or another card, and no completion shortcuts',()=>{
  const g=new Game(createWorld()),p=g.join('Защита');
  assert.equal(run(g,p,'obitelAnswer','OB-C01',{answer:'test'}).ok,false);
  const gate=g.target('obitel-zen-entry');p.x=gate.x;p.y=gate.y;
  assert.equal(run(g,p,'worldUse',gate.id).ok,true);
  assert.equal(run(g,p,'obitelAnswer','OB-C07',{answer:'test'}).ok,false);
  const target=g.target('OB-C01');p.x=target.x;p.y=target.y;
  assert.equal(run(g,p,'obitelAnswer','OB-C01',{answer:'тест'}).ok,true);
  assert.equal(g.snapshot(p).obitel.mountainUnlocked,false);
});
