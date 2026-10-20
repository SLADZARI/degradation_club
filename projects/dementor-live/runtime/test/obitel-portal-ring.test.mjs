import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,createWorld} from '../world-expansion-adapter.mjs';
import {OBITEL_RING_PATH,OBITEL_PORTAL_RECIPE} from '../world-expansion.mjs';

let n=0;
const act=(g,p,type,target,id='obitel-ring-'+(++n))=>g.command(p,{type,target,requestId:id});
const at=(p,target)=>{p.x=target.x;p.y=target.y;};
function steps(g,p,start,goal){
  const k=(x,y)=>x+','+y,seen=new Set([k(start.x,start.y)]);
  const q=[{...start,d:0}];
  for(let i=0;i<q.length;i++){
    const {x,y,d}=q[i];if(x===goal.x&&y===goal.y)return d;
    for(const [dx,dy] of [[0,1],[1,0],[0,-1],[-1,0]]){
      const nx=x+dx,ny=y+dy,key=k(nx,ny);
      if(!seen.has(key)&&g.walkable(nx,ny,p)){seen.add(key);q.push({x:nx,y:ny,d:d+1});}
    }
  }
  return null;
}
test('portal requires own resources and city funds: exact-once structure, preserved material ledger',()=>{
  const g=new Game(createWorld()),p=g.join('Архитектор'),gate=g.target('obitel-zen-entry');
  assert.equal(gate.type,'world-portal');
  at(p,gate);
  const startingMoney=p.wallet,treasury=g.state.treasury;
  assert.equal(act(g,p,'worldUse',gate.id).ok,false);
  assert.equal(g.state.treasury,treasury);
  p.bag.wood=OBITEL_PORTAL_RECIPE.wood;p.bag.stone=OBITEL_PORTAL_RECIPE.stone;
  const woodBefore=g.snapshot(p).materials.wood.total,stoneBefore=g.snapshot(p).materials.stone.total;
  const id='obitel-arch-once-id';
  const first=act(g,p,'worldUse',gate.id,id);
  assert.equal(first.ok,true);assert.ok(g.state.obitelPortal.builtAt);
  assert.equal(g.state.obitelPortal.builtBy,p.id);
  assert.equal(g.state.obitelPortal.consumed.wood,4);assert.equal(g.state.obitelPortal.consumed.stone,3);
  assert.equal(p.bag.wood,0);assert.equal(p.bag.stone,0);
  assert.equal(g.state.treasury,treasury-30);assert.equal(p.wallet,startingMoney);
  assert.equal(g.snapshot(p).materials.wood.total,woodBefore);
  assert.equal(g.snapshot(p).materials.stone.total,stoneBefore);
  assert.deepEqual(act(g,p,'worldUse',gate.id,id),first);
  assert.equal(g.state.transactions.filter(t=>t.reason==='municipal-obitel-portal').length,1);
  const restarted=new Game(structuredClone(g.state)),same=restarted.auth(p.token);
  assert.ok(restarted.state.obitelPortal.builtAt);
  assert.equal(restarted.state.treasury,treasury-30);
  at(same,restarted.target('obitel-zen-entry'));
  assert.equal(act(restarted,same,'worldUse',gate.id).ok,true);
  assert.equal(same.scene,'obitel-zen');
  assert.equal(same.x,4);assert.equal(same.y,17);
  assert.equal(restarted.state.treasury,treasury-30);
});
test('unfunded city cannot silently spend treasury or consume private materials',()=>{
  const g=new Game(createWorld()),p=g.join('Без бюджета');
  at(p,g.target('obitel-zen-entry'));p.bag.wood=4;p.bag.stone=3;g.state.treasury=0;
  assert.equal(act(g,p,'worldUse','obitel-zen-entry').ok,false);
  assert.equal(p.bag.wood,4);assert.equal(p.bag.stone,3);
  assert.equal(g.state.obitelPortal.builtAt,null);
  assert.equal(g.state.transactions.filter(t=>t.reason==='municipal-obitel-portal').length,0);
});
test('ring trail is physical: all seven ZEN nodes reachable, central cut forbidden, distant exit is a long walk',()=>{
  const g=new Game(createWorld()),p=g.join('Путешественник');
  p.scene='obitel-zen';p.x=4;p.y=17;
  assert.ok(OBITEL_RING_PATH.length>=9);
  assert.equal(g.walkable(18,13,p),false);
  assert.equal(g.walkable(4,17,p),true);
  for(let i=1;i<=7;i++){
    const node=g.target('OB-C'+String(i).padStart(2,'0'));
    assert.equal(g.walkable(node.x,node.y,p),true,node.id+' is traversable');
    assert.ok(steps(g,p,{x:4,y:17},{x:node.x,y:node.y})!==null,node.id+' reachable');
  }
  const exit=g.target('obitel-zen-exit');
  const length=steps(g,p,{x:4,y:17},{x:exit.x,y:exit.y});
  assert.ok(length>35,'ring must not offer a short backdoor: '+length);
  assert.equal(g.walkable(exit.x,exit.y,p),true);
  assert.equal(act(g,p,'worldUse','obitel-guru-gate').ok,false,'mountain gate cannot be activated remotely');
});
test('far door is exit-only from inside, and another player uses paid public portal for free',()=>{
  const g=new Game(createWorld()),owner=g.join('Строитель'),guest=g.join('Гость');
  owner.bag.wood=4;owner.bag.stone=3;
  at(owner,g.target('obitel-zen-entry'));
  assert.equal(act(g,owner,'worldUse','obitel-zen-entry').ok,true);
  const afterBuild=g.state.treasury;
  assert.equal(act(g,guest,'worldUse','obitel-zen-exit').ok,false);
  at(guest,g.target('obitel-zen-entry'));
  assert.equal(act(g,guest,'worldUse','obitel-zen-entry').ok,true);
  assert.equal(guest.scene,'obitel-zen');
  assert.equal(g.state.treasury,afterBuild);
  const exit=g.target('obitel-zen-exit');at(guest,exit);
  assert.equal(act(g,guest,'worldUse',exit.id).ok,true);
  assert.equal(guest.scene,'city');
  assert.equal(guest.x,138);assert.equal(guest.y,72);
  assert.equal(act(g,guest,'worldUse','obitel-zen-exit').ok,false);
  assert.equal(g.snapshot(guest).obitel.mountainUnlocked,false);
});
