import test from 'node:test';import assert from 'node:assert/strict';
import {Game,createWorld} from '../world-expansion-adapter.mjs';
import {CityNetwork} from '../city-network.mjs';
import {leaseActive,publiclyAccessible,tickEstateLeases,LEASE_DAY_MS} from '../estate.mjs';
import {cityMaterialReport} from '../city-expansion.mjs';
let sequence=0;
function action(g,p,type,target,extra={}){return g.command(p,{type,target,requestId:'land-test-'+(++sequence),...extra});}
function at(p,plot){p.scene='city';p.plotId=null;p.x=plot.x+plot.w/2;p.y=plot.y-1;}
test('multiple plots per resident and in two cities survive travel and restore',()=>{
 const network=new CityNetwork(createWorld()),g=network.origin,p=g.join('TestWoman','female');g.connect(p);p.wallet=900;
 at(p,g.state.plots[0]);assert.equal(action(g,p,'buy','plot-1').ok,true);
 at(p,g.state.plots[1]);assert.equal(action(g,p,'buy','plot-2').ok,true);
 assert.equal(g.state.plots.filter(t=>t.owner===p.id).length,2);
 assert.equal(g.state.plots[0].zoning,'residential');assert.equal(g.state.plots[1].landUse,'business');
 p.x=19;p.y=6;const created=network.command(p,{type:'createCity',name:'Второй город',requestId:'create-b'});assert.equal(created.ok,true);
 const cityId=created.id;assert.equal(network.command(p,{type:'travelCity',cityId,requestId:'go-city-b'}).ok,true);
 const other=network.gameFor(p);at(p,other.state.plots[2]);assert.equal(action(other,p,'buy','plot-3',{landUse:'universal'}).ok,true);
 let snap=network.snapshot(p);assert.equal(snap.cityNetwork.estates.length,3);assert.equal(snap.players.find(x=>x.id===p.id).gender,'female');
 p.x=19;p.y=6;assert.equal(network.command(p,{type:'travelCity',cityId:'origin',requestId:'return-home'}).ok,true);
 assert.equal(network.origin.state.plots[0].owner,p.id);assert.equal(network.origin.state.plots[1].owner,p.id);
 assert.equal(network.snapshot(p).cityNetwork.estates.length,3);
 const revived=new CityNetwork(JSON.parse(JSON.stringify(network.serialize())));
 const origin=revived.origin;assert.equal(origin.state.plots[1].owner,p.id);
 assert.equal(revived.data.cities[cityId].state.plots[2].owner,p.id);
});
test('public business lease, private residence, one PAPER/day, no silent seizure on expiry',()=>{
 const g=new Game(createWorld()),a=g.join('Renter','male'),b=g.join('Guest');g.connect(a);a.wallet=6;
 at(a,g.state.plots[1]);assert.equal(action(g,a,'plotRent','plot-2',{landUse:'business'}).ok,true);
 const plot=g.state.plots[1];assert.ok(plot.lease);assert.equal(a.wallet,5);assert.equal(publiclyAccessible(plot,g.now),true);
 at(b,plot);assert.equal(action(g,b,'enterPlot',plot.id).ok,true,'guest may enter business without invitation');
 const owned=g.state.plots[0];at(b,owned);assert.equal(action(g,b,'buy',owned.id).ok,false); // guest has no money
 g.now=plot.lease.dueAt+1;tickEstateLeases(g);assert.equal(a.wallet,4);assert.equal(leaseActive(plot,g.now),true);
 g.disconnect(a);g.now=plot.lease.dueAt+1;tickEstateLeases(g);assert.equal(leaseActive(plot,g.now),false);assert.equal(plot.owner,a.id,'expired lease retains owner belongings');
 at(b,plot);assert.equal(action(g,b,'enterPlot',plot.id).ok,false);
 at(a,plot);assert.equal(action(g,a,'plotRenew',plot.id).ok,true);assert.equal(a.wallet,3);assert.equal(leaseActive(plot,g.now),true);
});
test('sale through public stall conserves material, keeps proceeds in seller escrow and blocks duplicate charges',()=>{
 const g=new Game(createWorld()),a=g.join('Seller'),b=g.join('Buyer');g.connect(a);a.wallet=150;b.wallet=30;a.bag.wood=3;
 const plot=g.state.plots[1];at(a,plot);assert.equal(action(g,a,'buy',plot.id).ok,true);
 const before=cityMaterialReport(g).wood.total;
 assert.equal(action(g,a,'plotSign',plot.id,{text:'Дом деревянных вещей'}).ok,true);
 assert.equal(action(g,a,'shopPrice',plot.id,{kind:'wood',price:4}).ok,true);
 assert.equal(action(g,a,'shopStock',plot.id,{kind:'wood',quantity:3}).ok,true);
 assert.equal(a.bag.wood,0);assert.equal(cityMaterialReport(g).wood.total,before);
 at(b,plot);const purchase={type:'shopBuy',target:plot.id,requestId:'same-shop-purchase',kind:'wood',quantity:2};
 assert.equal(g.command(b,purchase).ok,true);assert.equal(g.command(b,purchase).ok,true);
 assert.equal(b.wallet,22);assert.equal(b.bag.wood,2);assert.equal(plot.shop.stock.wood,1);assert.equal(plot.shop.till,8);
 assert.equal(cityMaterialReport(g).wood.total,before);
 assert.equal(action(g,b,'shopBuy',plot.id,{kind:'wood',quantity:3}).ok,false);
 assert.equal(action(g,a,'shopCollect',plot.id).ok,true);assert.equal(a.wallet,38);assert.equal(plot.shop.till,0);
 const again=new Game(JSON.parse(JSON.stringify(g.state)));assert.equal(again.state.plots[1].shop.stock.wood,1);
 assert.equal(again.state.plots[1].shop.till,0);
});
test('mayor mail is persisted; 50 PAPER only once a day and exact repeated ideas do not pay twice',()=>{
 const g=new Game(createWorld()),a=g.join('Innovator','female');g.connect(a);at(a,{x:6,y:4,w:6,h:1});a.x=9;a.y=3;
 const text='Предлагаю создать новую пешеходную площадь и посадить там деревья';
 const treasury=g.state.treasury;
 const command={type:'mayorIdea',target:'mayor',requestId:'first-letter',text};
 assert.equal(g.command(a,command).ok,true);assert.equal(g.command(a,command).ok,true);
 assert.equal(a.wallet,50);assert.equal(g.state.treasury,treasury-50);assert.equal(g.state.mayorMail.length,1);
 assert.equal(action(g,a,'mayorIdea','mayor',{text}).ok,false);
 g.now+=300001;assert.equal(action(g,a,'mayorIdea','mayor',{text:'Добавить здесь городской рынок с продажей личных материалов'}).ok,true);
 assert.equal(a.wallet,50,'no second daily reward');
 a.activeGameMs=900000;a.x=15;a.y=15;g.now+=300001;
 assert.equal(action(g,a,'mayorIdea',null,{fromPrompt:true,text:'Хочу реализовать отдельную школу садоводства и городские теплицы'}).ok,true);
 assert.equal(g.state.mayorMail.length,3);
 const restored=new Game(JSON.parse(JSON.stringify(g.state)));assert.equal(restored.state.mayorMail.length,3);
 assert.equal(restored.auth(a.token).mayorFeedback.lastRewardAt>0,true);
});
