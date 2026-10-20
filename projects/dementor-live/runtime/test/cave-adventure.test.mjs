import test from 'node:test';
import assert from 'node:assert/strict';
import {
 CAVE_LAYOUT,CAVE_ENTRANCE,CAVE_VIDEO_ID,CAVE_ARTIFACT,
 generateCave,shortestCavePath,newCaveExplorer,isCaveOpen,caveCommand,caveVisibleCells,
 newFishingKit,fishingCommand,BAT_DAMAGE
} from '../cave-adventure.mjs';
const command=(p,type,other={})=>caveCommand(CAVE_LAYOUT,p,{type,requestId:'p-'+Object.keys(p.receipts).length+'-'+type,...other});
function advance(p,path,prefix){
 for(let i=1;i<path.length;i++){
  const next=path[i];caveCommand(CAVE_LAYOUT,p,{type:'step',x:next.x,y:next.y,requestId:prefix+'-'+i});
 }
}
test('deterministic generated 1-tile corridors contain no unreachable key/secret door',()=>{
 const same=generateCave(20261020);
 assert.deepEqual(CAVE_LAYOUT,same);
 const first=shortestCavePath(CAVE_LAYOUT,CAVE_ENTRANCE,CAVE_LAYOUT.keyAt);
 const second=shortestCavePath(CAVE_LAYOUT,CAVE_LAYOUT.keyAt,CAVE_LAYOUT.secretDoor);
 assert.ok(first.length>3&&second.length>3);
 assert.equal(first.length+second.length-2,CAVE_LAYOUT.routeLength);
 assert.notDeepEqual(CAVE_LAYOUT.keyAt,CAVE_LAYOUT.secretDoor);
 for(const c of [...first,...second])assert.equal(isCaveOpen(CAVE_LAYOUT,c.x,c.y),true);
});
test('single standard lamp is insufficient for correct optimal key-and-door route; two cover it',()=>{
 assert.ok(CAVE_LAYOUT.lanternCharge<CAVE_LAYOUT.routeLength);
 assert.ok(2*CAVE_LAYOUT.lanternCharge>=CAVE_LAYOUT.routeLength);
});
test('walls and teleports are rejected and do not change position',()=>{
 const p=newCaveExplorer('runner');
 assert.throws(()=>caveCommand(CAVE_LAYOUT,p,{type:'step',x:40,y:28,requestId:'teleport'}),/невозможный шаг/);
 assert.throws(()=>caveCommand(CAVE_LAYOUT,p,{type:'step',x:0,y:1,requestId:'wall'}),/Стена/);
 assert.equal(p.x,1);assert.equal(p.y,1);
});
test('flashlight toggles only with remaining oil; light ray never reveals beyond rock wall',()=>{
 const p=newCaveExplorer('runner',{oil:3});
 const on=caveCommand(CAVE_LAYOUT,p,{type:'toggleLantern',requestId:'l1'});
 assert.equal(on.lit,true);
 const visible=caveVisibleCells(CAVE_LAYOUT,[p]);
 assert.equal(visible.has('1,1'),true);assert.equal(visible.has('0,1'),false);
 const path=shortestCavePath(CAVE_LAYOUT,CAVE_ENTRANCE,CAVE_LAYOUT.keyAt);
 advance(p,path.slice(0,4),'move');
 assert.equal(p.oil,0);assert.equal(p.lanternOn,false);
 assert.throws(()=>caveCommand(CAVE_LAYOUT,p,{type:'toggleLantern',requestId:'l2'}),/масло/);
});
test('turning lantern off conserves oil; two players have separate supplies',()=>{
 const p=newCaveExplorer('a',{oil:8});
 const q=newCaveExplorer('b',{oil:8});
 caveCommand(CAVE_LAYOUT,p,{type:'toggleLantern',requestId:'on'});
 const next=shortestCavePath(CAVE_LAYOUT,CAVE_ENTRANCE,CAVE_LAYOUT.keyAt)[1];
 caveCommand(CAVE_LAYOUT,p,{type:'step',x:next.x,y:next.y,requestId:'step'});
 assert.equal(p.oil,7);assert.equal(q.oil,8);
 caveCommand(CAVE_LAYOUT,p,{type:'toggleLantern',requestId:'off'});
 const following=shortestCavePath(CAVE_LAYOUT,CAVE_ENTRANCE,CAVE_LAYOUT.keyAt)[2];
 caveCommand(CAVE_LAYOUT,p,{type:'step',x:following.x,y:following.y,requestId:'step2'});
 assert.equal(p.oil,7);
 caveCommand(CAVE_LAYOUT,q,{type:'toggleLantern',requestId:'on2'});
 assert.equal(caveVisibleCells(CAVE_LAYOUT,[p,q]).has('1,1'),true);
 assert.equal(q.oil,8);
});
test('key, locked door and first visit YouTube trigger obey state and request idempotency',()=>{
 const p=newCaveExplorer('hero',{oil:100000});
 assert.throws(()=>command(p,'openSecretDoor'),/ключ/);
 caveCommand(CAVE_LAYOUT,p,{type:'toggleLantern',requestId:'lamp'});
 const first=shortestCavePath(CAVE_LAYOUT,CAVE_ENTRANCE,CAVE_LAYOUT.keyAt);
 const second=shortestCavePath(CAVE_LAYOUT,CAVE_LAYOUT.keyAt,CAVE_LAYOUT.secretDoor);
 advance(p,first,'keypath');
 assert.equal(p.keyFound,true);
 advance(p,second,'doorpath');
 const result=caveCommand(CAVE_LAYOUT,p,{type:'openSecretDoor',requestId:'door1'});
 assert.equal(result.playYouTube,CAVE_VIDEO_ID);
 assert.equal(result.artifact,CAVE_ARTIFACT);
 assert.equal(result.altarMessage,'Принеси рыбу');
 const again=caveCommand(CAVE_LAYOUT,p,{type:'openSecretDoor',requestId:'door1'});
 assert.deepEqual(result,again);
 assert.throws(()=>command(p,'offerFish'),/рыбу/);
 const fishing=newFishingKit();fishing.rod=true;fishing.rodDurability=40;fishing.bait.worm=1;
 const caught=fishingCommand(p,fishing,{type:'fish',atRiver:true,bait:'worm',requestId:'catch-for-altar'});
 assert.ok(caught.species);assert.equal(p.fish.length,1,'Fish caught in the river is carried to the altar');
 const altar=caveCommand(CAVE_LAYOUT,p,{type:'offerFish',requestId:'altar'});
 assert.equal(altar.complete,true);assert.equal(p.fish.length,0);
 const replay=caveCommand(CAVE_LAYOUT,p,{type:'offerFish',requestId:'altar'});
 assert.deepEqual(replay,altar);assert.equal(p.fish.length,0);
});
test('bat damage is finite with once-only attack; food pickups are finite',()=>{
 const p=newCaveExplorer('runner',{oil:100000});
 caveCommand(CAVE_LAYOUT,p,{type:'toggleLantern',requestId:'on'});
 const bat=CAVE_LAYOUT.batTiles[0];
 assert.ok(bat);const [bx,by]=bat.split(',').map(Number);
 const path=shortestCavePath(CAVE_LAYOUT,CAVE_ENTRANCE,{x:bx,y:by});
 advance(p,path,'bat');
 assert.equal(p.health,100-BAT_DAMAGE);
 assert.equal(p.batVisited.length,1);
 assert.ok(p.blackoutSteps>0);
 const food=CAVE_LAYOUT.foodTiles[0];
 assert.ok(food);const [fx,fy]=food.split(',').map(Number);
 const foodPath=shortestCavePath(CAVE_LAYOUT,{x:bx,y:by},{x:fx,y:fy});
 advance(p,foodPath,'food');
 assert.equal(p.collectedFood.includes(food),true);
});
test('buy rod, two baits and fish catches: authorization, finite stocks and exact-once consumption',()=>{
 const p={id:'person',wallet:30};
 const kit=newFishingKit();
 assert.throws(()=>fishingCommand(p,kit,{type:'fish',atRiver:true,bait:'worm',requestId:'no-rod'}),/удочка/);
 assert.throws(()=>fishingCommand(p,kit,{type:'buyRod',atToolShop:false,requestId:'wrong-shop'}),/магазине/);
 const sale=fishingCommand(p,kit,{type:'buyRod',atToolShop:true,requestId:'rod1'});
 assert.equal(sale.price,8);assert.equal(p.wallet,22);
 assert.deepEqual(fishingCommand(p,kit,{type:'buyRod',atToolShop:true,requestId:'rod1'}),sale);
 assert.equal(p.wallet,22);
 assert.throws(()=>fishingCommand(p,kit,{type:'fish',atRiver:false,bait:'worm',requestId:'away'}),/реки/);
 kit.bait.worm=1;kit.bait.larva=1;
 const fish=fishingCommand(p,kit,{type:'fish',atRiver:true,bait:'worm',requestId:'cast1'});
 assert.ok(['roach','perch','carp'].includes(fish.species));
 assert.equal(kit.bait.worm,0);assert.equal(kit.fish.length,1);
 assert.deepEqual(fishingCommand(p,kit,{type:'fish',atRiver:true,bait:'worm',requestId:'cast1'}),fish);
 assert.equal(kit.fish.length,1);
 const fish2=fishingCommand(p,kit,{type:'fish',atRiver:true,bait:'larva',requestId:'cast2'});
 assert.ok(['roach','perch','carp'].includes(fish2.species));assert.equal(kit.fish.length,2);
});
test('bait digging is uncommon across many digs and requires a shovel and soil',()=>{
 const p={id:'fisher',wallet:40},kit=newFishingKit();
 assert.throws(()=>fishingCommand(p,kit,{type:'digBait',hasShovel:false,onSoil:true,digSite:1,requestId:'invalid'}),/лопатка/);
 let found=0;
 for(let n=0;n<1000;n++){
  const r=fishingCommand(p,kit,{type:'digBait',hasShovel:true,onSoil:true,digSite:n,requestId:'dig-'+n});
  if(r.bait)found++;
 }
 assert.ok(found>5&&found<60,'rare bait distribution, actual='+found);
 assert.equal(found,kit.bait.worm+kit.bait.larva);
 assert.throws(()=>fishingCommand(p,kit,{type:'digBait',hasShovel:true,onSoil:true,digSite:0,requestId:'duplicate-site'}),/уже вскопано/);
});
