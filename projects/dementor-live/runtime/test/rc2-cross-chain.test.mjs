import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,createWorld} from '../world-expansion-adapter.mjs';
import {CityNetwork} from '../city-network.mjs';
import {SECOND_BRIDGE_PRICE} from '../second-bridge.mjs';

const act=(game,player,requestId,type,target,extra={})=>game.command(player,{requestId,type,target,...extra});

test('RC2-LINK-01 mayor idea -> earned PAPER -> real payphone -> inbox -> save/replay, one payment only',()=>{
 const network=new CityNetwork(createWorld());
 const a=network.origin.join('Мастер'),b=network.origin.join('Курьер');
 network.snapshot(a);network.snapshot(b);
 a.x=9;a.y=3;
 const funds=network.origin.state.treasury;
 const idea={requestId:'qa-idea-cross-01',type:'mayorIdea',target:'mayor',text:'Пожалуйста добавьте более понятную дорогу к библиотеке и складу'};
 assert.equal(network.origin.command(a,idea).ok,true);
 assert.equal(a.wallet,50);
 assert.equal(network.origin.state.treasury,funds-50);
 assert.equal(network.origin.command(a,idea).ok,true);
 assert.equal(a.wallet,50);
 a.x=10;a.y=12;
 const message={requestId:'qa-pager-cross-01',type:'pagerSend',target:'phone-square',number:b.pagerNumber,text:'Материалы ждут у склада'};
 assert.equal(network.command(a,message).ok,true);
 assert.equal(network.command(a,message).ok,true);
 assert.equal(a.wallet,49);
 assert.equal(b.pagerInbox.length,1);
 const restored=new CityNetwork(JSON.parse(JSON.stringify(network.serialize())));
 const sender=restored.findId(a.id).p,receiver=restored.findId(b.id).p;
 assert.equal(sender.wallet,49);
 assert.equal(receiver.pagerInbox.length,1);
 assert.equal(restored.command(sender,message).ok,true);
 assert.equal(receiver.pagerInbox.length,1,'retry must not add second message');
 assert.equal(sender.wallet,49,'retry must not take second PAPER');
});

test('RC2-LINK-02 materials -> bridge foundation -> paid construction -> safe traversal after restart',()=>{
 const g=new Game(createWorld()),a=g.join('Лесоруб'),b=g.join('Каменщик');
 g.connect(a);g.connect(b);
 a.x=32.5;a.y=55;b.x=32.5;b.y=55;
 a.bag.wood=SECOND_BRIDGE_PRICE.wood;b.bag.stone=SECOND_BRIDGE_PRICE.stone;
 const treasury=g.state.treasury;
 assert.equal(g.walkable(35.5,56.5,a),false);
 assert.equal(act(g,a,'qa-wood-delivery','secondBridgeDeliver','second-bridge-site',{kind:'wood'}).ok,true);
 assert.equal(act(g,b,'qa-stone-delivery','secondBridgeDeliver','second-bridge-site',{kind:'stone'}).ok,true);
 assert.equal(a.bag.wood,0);assert.equal(b.bag.stone,0);
 assert.equal(g.walkable(35.5,56.5,a),false);
 for(let i=0;i<4;i++)assert.equal(act(g,a,'qa-build-'+i,'secondBridgeWork','second-bridge-site').ok,true);
 assert.equal(g.walkable(35.5,56.5,a),true);
 assert.equal(g.state.treasury,treasury-8);
 const saved=new Game(JSON.parse(JSON.stringify(g.state)));
 assert.equal(saved.walkable(35.5,56.5,saved.auth(a.token)),true);
 assert.equal(act(saved,saved.auth(a.token),'qa-build-3','secondBridgeWork','second-bridge-site').ok,true);
 assert.equal(saved.state.treasury,treasury-8,'replay must not pay a fifth wage');
});

test('RC2-LINK-03 simultaneous cross-city owners retain identity and assets after serialization',()=>{
 const n=new CityNetwork(createWorld()),a=n.origin.join('Хозяин'),b=n.origin.join('Гость');
 n.snapshot(a);n.snapshot(b);
 a.wallet=500;
 b.x=19;b.y=6;
 const city=n.createCity(b,'Город B');
 const initialA={id:a.id,token:a.token,wallet:a.wallet};
 assert.equal(n.command(b,{requestId:'qa-ride-city-b',type:'travelCity',cityId:city.id}).ok,true);
 const saved=new CityNetwork(JSON.parse(JSON.stringify(n.serialize())));
 assert.equal(saved.findId(a.id).cityId,'origin');
 assert.equal(saved.findId(b.id).cityId,city.id);
 assert.equal(saved.findId(a.id).p.wallet,initialA.wallet);
 assert.equal(saved.findId(a.id).p.token,initialA.token);
});
