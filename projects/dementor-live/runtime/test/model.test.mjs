import test from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../config.mjs';
import { Game, createWorld, loadWeight, projectBudget } from '../world.mjs';

let seq=0;
function setup(){const game=new Game(createWorld());const a=game.join('Лист'),b=game.join('Крафт');game.connect(a);game.connect(b);return {game,a,b};}
function command(game,p,type,target,extra={}){return game.command(p,{type,target,requestId:'test-'+(++seq),...extra});}
function at(game,p,target){const t=game.target(target);p.x=t.x;p.y=t.y+1;}
function tools(game,p){at(game,p,'tools');assert.equal(command(game,p,'tools','tools').ok,true);}
function harvest(game,p,target,count){at(game,p,target);const resource=game.target(target);command(game,p,'equip',resource.type==='wood'?'axe':'pick');for(let i=0;i<count;i++){const r=command(game,p,'mine',target);assert.equal(r.ok,true,r.message);game.tick(CONFIG.mineMs+1);}}
function deliver(game,p){at(game,p,'project');return command(game,p,'deliver','project');}
function build(game,p,count){at(game,p,'build');for(let i=0;i<count;i++){const r=command(game,p,'build','build');assert.equal(r.ok,true,r.message);game.tick(CONFIG.buildMs+1);}}

test('prototype budget and cargo units agree',()=>{assert.equal(projectBudget(CONFIG),280);assert.equal(1000-projectBudget(CONFIG)+2*CONFIG.plotPrice,960);assert.equal(loadWeight({bag:{wood:4,stone:3,food:2}}),12);});
test('tool is required, wrong tool fails, durability falls, replacement is free',()=>{
  const {game,a}=setup();at(game,a,'wood-1');assert.equal(command(game,a,'mine','wood-1').ok,false);tools(game,a);harvest(game,a,'wood-1',1);assert.equal(a.tools.axe,15);at(game,a,'stone-1');assert.equal(command(game,a,'mine','stone-1').ok,false);a.tools.axe=1;harvest(game,a,'wood-1',1);assert.equal(a.tools.axe,0);assert.equal(command(game,a,'mine','wood-1').ok,false);tools(game,a);assert.equal(a.tools.axe,CONFIG.toolDurability);assert.equal(a.wallet,0);
});
test('capacity caps physical extraction, harvesting never pays money',()=>{
  const{game,a}=setup();tools(game,a);harvest(game,a,'wood-1',12);const stock=game.target('wood-1').stock;assert.equal(command(game,a,'mine','wood-1').ok,false);assert.equal(game.target('wood-1').stock,stock);assert.equal(a.wallet,0);assert.equal(loadWeight(a),12);
});
test('accepted delivery pays immediately once; a repeated request cannot pay twice',()=>{
  const{game,a}=setup();tools(game,a);harvest(game,a,'wood-1',3);at(game,a,'project');const cmd={type:'deliver',target:'project',requestId:'delivery-once'};assert.equal(game.command(a,cmd).reward,6);game.command(a,cmd);assert.equal(a.wallet,6);assert.equal(game.state.treasury,994);assert.equal(game.state.project.accepted.wood,3);assert.equal(game.state.project.stock.wood,3);assert.equal(a.bag.wood,0);assert.equal(game.state.project.stage,0);
});
test('acceptance is capped by remaining need and keeps excess in the bag',()=>{
  const{game,a}=setup();game.state.project.accepted.wood=39;game.state.project.stock.wood=39;a.bag.wood=5;assert.equal(deliver(game,a).reward,2);assert.equal(a.bag.wood,4);assert.equal(game.state.project.accepted.wood,40);assert.equal(deliver(game,a).ok,false);
});
test('two real player states compete for the last resource; only one receives it',()=>{
  const{game,a,b}=setup();tools(game,a);tools(game,b);game.target('wood-1').stock=1;at(game,a,'wood-1');at(game,b,'wood-1');assert.equal(command(game,a,'mine','wood-1').ok,true);assert.equal(command(game,b,'mine','wood-1').ok,true);game.tick(CONFIG.mineMs+1);assert.equal(a.bag.wood+b.bag.wood,1);assert.equal(game.target('wood-1').stock,0);
});
test('competing final construction work cannot duplicate reward or stage progress',()=>{
  const{game,a,b}=setup();game.state.project.work=1;at(game,a,'build');at(game,b,'build');command(game,a,'build','build');command(game,b,'build','build');game.tick(CONFIG.buildMs+1);assert.equal(a.wallet+b.wallet,10);assert.equal(game.state.project.stage,1);assert.equal(game.state.project.work,0);assert.equal(command(game,a,'build','build').ok,false);
});
test('a solo player completes the physical project, consumes stock and buys one plot',()=>{
  const{game,a,b}=setup();game.disconnect(b);tools(game,a);
  for(const kind of ['wood','stone']){let remaining=40;while(remaining){tools(game,a);const n=Math.min(kind==='wood'?12:6,remaining);harvest(game,a,kind+'-1',n);const before=a.wallet;const result=deliver(game,a);assert.equal(result.ok,true);assert.equal(a.wallet-before,n*CONFIG.pay[kind]);remaining-=n;}}
  assert.equal(a.wallet,200);assert.deepEqual(game.state.project.stock,{wood:40,stone:40});build(game,a,2);assert.equal(game.state.project.stage,1);build(game,a,4);assert.equal(game.state.project.stage,2);assert.deepEqual(game.state.project.stock,{wood:40,stone:0});build(game,a,2);assert.equal(game.state.project.stage,3);assert.deepEqual(game.state.project.stock,{wood:0,stone:0});assert.deepEqual(game.state.project.consumed,{wood:40,stone:40});assert.equal(a.wallet,280);assert.equal(game.state.treasury,720);assert.equal(command(game,a,'build','build').ok,false);at(game,a,'plot-1');assert.equal(command(game,a,'buy','plot-1').ok,true);assert.equal(a.wallet,160);assert.equal(game.state.plots[0].owner,a.id);assert.equal(game.state.treasury,840);at(game,a,'plot-2');assert.equal(command(game,a,'buy','plot-2').ok,false);
});
test('concurrent plot purchase has one owner, one payment and no duplicate debit',()=>{
  const{game,a,b}=setup();a.wallet=120;b.wallet=120;at(game,a,'plot-1');at(game,b,'plot-1');const x=command(game,a,'buy','plot-1'),y=command(game,b,'buy','plot-1');assert.equal(Number(x.ok)+Number(y.ok),1);assert.equal(a.wallet+b.wallet,120);assert.equal(game.state.treasury,1120);
});
test('construction jobs require physical proximity; movement cancels work',()=>{
  const{game,a}=setup();assert.equal(command(game,a,'build','build').ok,false);at(game,a,'build');command(game,a,'build','build');game.input(a,{dx:1,dy:0});game.tick(50);assert.equal(a.job,null);assert.equal(a.wallet,0);
});
test('river is continuous and does not become walkable at bridge marker',()=>{
  const{game,a}=setup();for(let y=.4;y<32;y+=.5)assert.equal(game.walkable(35,y),false);a.x=33.6;a.y=13;for(let i=0;i<60;i++){game.input(a,{dx:1,dy:0});game.tick(50);}assert.ok(a.x<=33.7);assert.ok(a.x<34);
});
test('hunger advances only online, slows movement, then makes a non-working spirit',()=>{
  const{game,a,b}=setup();game.disconnect(b);const hunger=b.hunger;a.hunger=20;a.x=10;a.y=8;game.input(a,{dx:1,dy:0});game.tick(100);assert.ok(Math.abs(a.x-10-.28)<.001);assert.equal(b.hunger,hunger);a.hunger=.001;game.tick(50);assert.equal(a.spirit,true);assert.equal(a.health,0);assert.equal(a.x,8);at(game,a,'tools');assert.equal(command(game,a,'tools','tools').ok,false);at(game,a,'build');assert.equal(command(game,a,'build','build').ok,false);
});
test('a spirit can self-recover for free even with a full bag; berries replenish',()=>{
  const{game,a,b}=setup();game.disconnect(b);a.spirit=true;a.hunger=0;a.health=0;a.bag.wood=12;at(game,a,'food-1');const before=game.target('food-1').stock;assert.equal(command(game,a,'gather','food-1').ok,true);assert.equal(a.spirit,false);assert.equal(a.hunger,65);assert.equal(a.bag.wood,12);assert.equal(a.wallet,0);game.tick(CONFIG.berryRegrowMs+1);assert.equal(game.target('food-1').stock,before);
});
test('another player can feed a spirit and pays one physical food portion',()=>{
  const{game,a,b}=setup();a.bag.food=1;b.spirit=true;b.hunger=0;b.health=0;a.x=b.x=8;a.y=b.y=8;assert.equal(command(game,a,'give',b.id).ok,true);assert.equal(b.spirit,false);assert.equal(a.bag.food,0);assert.equal(command(game,a,'give',b.id).ok,false);
});
test('reload preserves player identity, wallet, purchased land, resources and project',()=>{
  const{game,a}=setup();a.wallet=120;at(game,a,'plot-1');command(game,a,'buy','plot-1');a.bag.wood=3;deliver(game,a);const before=JSON.stringify(game.state);const restarted=new Game(JSON.parse(before));const again=restarted.auth(a.token);assert.equal(again.id,a.id);assert.equal(again.wallet,6);assert.equal(restarted.state.plots[0].owner,a.id);assert.equal(restarted.state.project.accepted.wood,3);assert.equal(restarted.online.size,0);const hunger=again.hunger;restarted.tick(100000);assert.equal(again.hunger,hunger);
});
test('snapshots hide other tokens, inventories and wallets; nearby chat is shared',()=>{
  const{game,a,b}=setup();command(game,a,'chat',null,{text:'Привет, сосед!'});const snap=game.snapshot(b);assert.equal(snap.chat[0].text,'Привет, сосед!');assert.equal(snap.players.find(p=>p.id===a.id).token,undefined);assert.equal(snap.players.find(p=>p.id===a.id).wallet,undefined);assert.equal(JSON.stringify(snap).includes(a.token),false);b.x=45;b.y=30;assert.equal(game.snapshot(b).chat.length,0);
});

test('forge unlocks after square, consumes own stock, settles competing finish once and persists',()=>{
 const {game,a,b}=setup();at(game,a,'forge-build');assert.equal(command(game,a,'build','forge-build').ok,false);
 game.state.project.stage=3;
 for(const p of [a,b]){p.bag={wood:12,stone:12,food:0};at(game,p,'forge-drop');assert.equal(command(game,p,'deliver','forge-drop').ok,true);}
 assert.deepEqual(game.state.project.accepted,{wood:0,stone:0});
 for(const n of [2,3])for(let i=0;i<n;i++){at(game,a,'forge-build');assert.equal(command(game,a,'build','forge-build').ok,true);game.tick(CONFIG.buildMs+1);}
 at(game,a,'forge-build');assert.equal(command(game,a,'build','forge-build').ok,true);game.tick(CONFIG.buildMs+1);
 for(const p of [a,b]){at(game,p,'forge-build');assert.equal(command(game,p,'build','forge-build').ok,true);}
 const before=a.wallet+b.wallet;game.tick(CONFIG.buildMs+1);assert.equal(a.wallet+b.wallet,before+10);
 assert.equal(game.state.forge.stage,3);assert.deepEqual(game.state.forge.consumed,{wood:24,stone:24});assert.equal(game.state.forge.spent,190);
 assert.equal(new Game(JSON.parse(JSON.stringify(game.state))).state.forge.stage,3);
});

test('dropping and competing pickup conserve resources, capacity and idempotency',()=>{
 const {game,a,b}=setup();a.bag.wood=12;a.x=b.x=12;a.y=b.y=12;
 const cmd={type:'drop',kind:'wood',quantity:12,requestId:'drop-once'};
 assert.equal(game.command(a,cmd).ok,true);assert.equal(game.command(a,cmd).ok,true);
 assert.equal(a.bag.wood,0);const pile=game.state.drops[0];assert.equal(pile.quantity,12);
 b.bag.stone=5;assert.equal(command(game,b,'pickup',pile.id).ok,true);assert.equal(b.bag.wood,2);assert.equal(loadWeight(b),12);
 assert.equal(command(game,a,'pickup',pile.id).ok,true);assert.equal(a.bag.wood,10);assert.equal(game.state.drops.length,0);
 assert.equal(command(game,b,'pickup',pile.id).ok,false);
 assert.equal(command(game,a,'drop',null,{kind:'wood',quantity:-1}).ok,false);assert.equal(a.bag.wood,10);
});
test('warehouse buys excess after construction, has capacity and protects construction budget',()=>{
 const {game,a}=setup();a.bag.wood=12;at(game,a,'warehouse');const before=game.state.treasury;
 const cmd={type:'warehouseSell',target:'warehouse',kind:'wood',requestId:'warehouse-once'};
 assert.equal(game.command(a,cmd).reward,12);assert.equal(game.command(a,cmd).reward,12);
 assert.equal(a.wallet,12);assert.equal(game.state.treasury,before-12);assert.equal(game.state.warehouse.stock.wood,12);
 game.state.treasury=470;a.bag.wood=12;assert.equal(command(game,a,'warehouseSell','warehouse',{kind:'wood'}).ok,false);assert.equal(a.bag.wood,12);
 game.state.treasury=1000;game.state.project.stage=3;game.state.project.accepted={wood:40,stone:40};game.state.forge.stage=3;game.state.forge.accepted={wood:24,stone:24};game.state.warehouse.stock.wood=79;
 assert.equal(command(game,a,'warehouseSell','warehouse',{kind:'wood'}).reward,1);assert.equal(a.bag.wood,11);
 assert.equal(command(game,a,'warehouseSell','warehouse',{kind:'wood'}).ok,false);
 a.x=30;assert.equal(command(game,a,'warehouseSell','warehouse',{kind:'stone'}).ok,false);
});
test('courier reservation races, real cargo, protected return space and exactly-once payment',()=>{
 const {game,a,b}=setup();game.state.warehouse.stock.wood=6;
 for(const p of [a,b])at(game,p,'board');
 assert.equal(command(game,a,'courierAccept','board',{kind:'wood'}).ok,true);
 assert.equal(command(game,b,'courierAccept','board',{kind:'wood'}).ok,false);
 assert.equal(command(game,a,'courierPickup','warehouse').ok,false);
 at(game,a,'warehouse');a.bag.stone=4;assert.equal(command(game,a,'courierPickup','warehouse').ok,false);a.bag.stone=0;
 assert.equal(command(game,a,'courierPickup','warehouse').ok,true);assert.equal(loadWeight(a),6);assert.equal(game.state.warehouse.stock.wood,0);
 assert.equal(command(game,a,'drop',null,{kind:'wood'}).ok,false);assert.equal(command(game,a,'warehouseSell','warehouse',{kind:'wood'}).ok,false);
 const copy=new Game(JSON.parse(JSON.stringify(game.state)));assert.equal(copy.state.players[a.id].delivery.picked,true);assert.equal(loadWeight(copy.state.players[a.id]),6);
 game.state.warehouse.stock.wood=74;assert.equal(game.warehouseFree('wood'),0);
 assert.equal(command(game,a,'courierCancel','warehouse').ok,true);assert.equal(game.state.warehouse.stock.wood,80);assert.equal(a.wallet,0);
 game.state.warehouse.stock.wood=6;at(game,b,'board');assert.equal(command(game,b,'courierAccept','board',{kind:'wood'}).ok,true);at(game,b,'warehouse');assert.equal(command(game,b,'courierPickup','warehouse').ok,true);
 at(game,b,'mayor');const cmd={type:'courierDeliver',target:'mayor',requestId:'courier-once'};assert.equal(game.command(b,cmd).reward,2);assert.equal(game.command(b,cmd).reward,2);
 assert.equal(b.wallet,2);assert.equal(game.state.warehouse.municipal.wood,6);assert.equal(loadWeight(b),0);assert.equal(game.state.treasury,998);
 assert.equal(command(game,b,'courierDeliver','mayor').ok,false);
});
test('uncollected courier reservations expire; picked cargo survives offline and cannot be sold as personal stock',()=>{
 const {game,a,b}=setup();game.state.warehouse.stock.stone=12;at(game,a,'board');at(game,b,'board');
 assert.equal(command(game,a,'courierAccept','board',{kind:'stone'}).ok,true);
 game.disconnect(a);game.tick(CONFIG.warehouse.reservationMs+1);assert.equal(a.delivery,null);assert.equal(game.state.warehouse.stock.stone,12);
 assert.equal(command(game,b,'courierAccept','board',{kind:'stone'}).ok,true);at(game,b,'warehouse');assert.equal(command(game,b,'courierPickup','warehouse').ok,true);assert.equal(loadWeight(b),12);
 game.disconnect(b);game.tick(CONFIG.warehouse.reservationMs+1);assert.equal(b.delivery.picked,true);assert.equal(game.state.warehouse.stock.stone,6);
 assert.equal(command(game,b,'courierCancel','warehouse').ok,true);assert.equal(game.state.warehouse.stock.stone,12);assert.equal(b.wallet,0);
});

test('forge manufacturing needs completed building and personal materials; repeats do not duplicate',()=>{
 const {game,a}=setup();at(game,a,'forge-use');a.bag={wood:6,stone:6,food:0};
 assert.equal(command(game,a,'craftTool','forge-use',{tool:'axe'}).ok,false);
 game.state.project.stage=3;game.state.forge.stage=3;
 const cmd={type:'craftTool',target:'forge-use',tool:'axe',requestId:'craft-once'};
 assert.equal(game.command(a,cmd).ok,true);assert.equal(game.command(a,cmd).ok,true);assert.equal(a.tools.axe,48);assert.equal(a.toolInfo.axe.max,48);assert.equal(a.bag.wood,4);assert.equal(a.bag.stone,4);
 assert.equal(command(game,a,'craftTool','forge-use',{tool:'axe'}).ok,true);assert.equal(a.toolItems.filter(t=>t.kind==='axe').length,2);
 assert.equal(command(game,a,'craftTool','forge-use',{tool:'pick'}).ok,true);assert.equal(a.bag.wood,0);assert.equal(a.bag.stone,0);
 at(game,a,'tools');command(game,a,'tools','tools');assert.equal(a.tools.axe,48);assert.equal(a.tools.pick,48);
});
test('premium tools pay city once, wear normally, survive save and cannot get free repair or downgrade',()=>{
 const {game,a}=setup();at(game,a,'tool-shop');a.wallet=179;
 assert.equal(command(game,a,'buyTool','tool-shop',{tool:'axe'}).ok,false);a.wallet=180;const treasury=game.state.treasury;
 const cmd={type:'buyTool',target:'tool-shop',tool:'axe',requestId:'premium-once'};assert.equal(game.command(a,cmd).ok,true);assert.equal(game.command(a,cmd).ok,true);
 assert.equal(a.wallet,0);assert.equal(game.state.treasury,treasury+180);assert.equal(a.tools.axe,160);
 at(game,a,'wood-1');command(game,a,'mine','wood-1');game.tick(CONFIG.mineMs+1);assert.equal(a.tools.axe,159);
 at(game,a,'tools');command(game,a,'tools','tools');assert.equal(a.tools.axe,159);assert.equal(a.tools.pick,16);
 game.state.project.stage=game.state.forge.stage=3;a.bag={wood:2,stone:2,food:0};at(game,a,'forge-use');assert.equal(command(game,a,'craftTool','forge-use',{tool:'axe'}).ok,true);assert.equal(a.tools.axe,159);assert.equal(a.toolItems.filter(t=>t.kind==='axe').length,2);
 const restored=new Game(JSON.parse(JSON.stringify(game.state)));assert.equal(restored.state.players[a.id].tools.axe,159);assert.equal(restored.state.players[a.id].toolInfo.axe.max,160);
 a.tools.axe=0;at(game,a,'tools');command(game,a,'tools','tools');assert.equal(a.tools.axe,16);assert.equal(a.toolInfo.axe.tier,'basic');
});

test('bridge unlocks after forge and opens only its completed river corridor',()=>{
 const {game,a,b}=setup();at(game,a,'bridge-build');assert.equal(command(game,a,'build','bridge-build').ok,false);assert.equal(game.walkable(36,13.5),false);
 game.state.project.stage=game.state.forge.stage=3;a.bag={wood:24,stone:16,food:0};at(game,a,'bridge-drop');assert.equal(command(game,a,'deliver','bridge-drop').reward,96);
 for(const n of [2,3])for(let i=0;i<n;i++){at(game,a,'bridge-build');assert.equal(command(game,a,'build','bridge-build').ok,true);game.tick(CONFIG.buildMs+1);assert.equal(game.walkable(36,13.5),false);}
 at(game,a,'bridge-build');command(game,a,'build','bridge-build');game.tick(CONFIG.buildMs+1);
 for(const p of [a,b]){at(game,p,'bridge-build');assert.equal(command(game,p,'build','bridge-build').ok,true);}
 const before=a.wallet+b.wallet;game.tick(CONFIG.buildMs+1);assert.equal(a.wallet+b.wallet,before+10);assert.equal(game.state.bridge.stage,3);
 assert.deepEqual(game.state.bridge.consumed,{wood:24,stone:16});assert.deepEqual(game.state.bridge.stock,{wood:0,stone:0});assert.equal(game.state.bridge.spent,166);
 assert.equal(game.walkable(36,13.5),true);assert.equal(game.walkable(36,11.9),false);assert.equal(game.walkable(36,15.1),false);
 const restored=new Game(JSON.parse(JSON.stringify(game.state)));assert.equal(restored.walkable(36,13.5),true);
});
test('bridge courier reserves remaining demand, prevents direct overfill and pays only transport',()=>{
 const {game,a,b}=setup();game.state.project.stage=game.state.forge.stage=3;game.state.warehouse.stock.wood=6;
 at(game,a,'board');assert.equal(command(game,a,'courierAccept','board',{kind:'wood',destination:'bridge'}).ok,true);
 at(game,b,'board');assert.equal(command(game,b,'courierAccept','board',{kind:'wood',destination:'bridge'}).ok,false);
 b.bag.wood=24;at(game,b,'bridge-drop');assert.equal(command(game,b,'deliver','bridge-drop').reward,36);assert.equal(b.bag.wood,6);assert.equal(game.state.bridge.accepted.wood,18);
 assert.equal(command(game,b,'deliver','bridge-drop').ok,false);at(game,a,'warehouse');assert.equal(command(game,a,'courierPickup','warehouse').ok,true);
 at(game,a,'mayor');assert.equal(command(game,a,'courierDeliver','mayor').ok,false);
 at(game,a,'bridge-drop');const cmd={type:'courierDeliver',target:'bridge-drop',requestId:'bridge-courier-once'};assert.equal(game.command(a,cmd).reward,2);assert.equal(game.command(a,cmd).reward,2);
 assert.equal(a.wallet,2);assert.equal(game.state.bridge.accepted.wood,24);assert.equal(game.state.bridge.stock.wood,24);assert.equal(game.state.warehouse.municipal.wood,0);assert.equal(game.courierOffer('wood','bridge'),null);
});
test('new bank migration preserves depletion and existing players, and canceled bridge cargo releases demand',()=>{
 const {game,a}=setup();const count=game.state.resources.length;game.state.resources.find(r=>r.id==='east-wood-1').stock=3;
 a.wallet=42;const migrated=new Game(JSON.parse(JSON.stringify(game.state)));assert.equal(migrated.state.resources.length,count);assert.equal(migrated.state.resources.find(r=>r.id==='east-wood-1').stock,3);assert.equal(migrated.state.players[a.id].wallet,42);
 game.state.project.stage=game.state.forge.stage=3;game.state.warehouse.stock.stone=6;at(game,a,'board');command(game,a,'courierAccept','board',{kind:'stone',destination:'bridge'});at(game,a,'warehouse');command(game,a,'courierPickup','warehouse');assert.equal(game.committed('stone',false,'bridge'),6);
 command(game,a,'courierCancel','warehouse');assert.equal(game.committed('stone',false,'bridge'),0);assert.equal(game.state.warehouse.stock.stone,6);assert.equal(game.state.bridge.accepted.stone,0);
});
