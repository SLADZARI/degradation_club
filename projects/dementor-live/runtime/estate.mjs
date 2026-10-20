import {bagCapacity} from './losev-courses.mjs';
// CITY estate v1: zoning, multi-plot ownership, daily public commercial leases and stocked stalls.
export const ZONING=Object.freeze({residential:'Для жизни',business:'Для бизнеса',universal:'Универсальный'});
export const LEASE_DAY_MS=86400000;
const zoned=id=>({'plot-1':'residential','plot-2':'business','plot-3':'universal','plot-4':'residential','plot-5':'business','plot-6':'universal','plot-7':'business','plot-8':'universal'})[id]||'universal';
const tradable=new Set(['wood','stone','food','hemp','carrot']);
export const leaseActive=(plot,now)=>!plot.lease||plot.lease.dueAt>now;
export const publiclyAccessible=(plot,now)=>!!plot.owner&&leaseActive(plot,now)&&(plot.landUse==='business'||!!plot.home?.open);
export function initEstates(g){
 for(const plot of g.state.plots){plot.zoning||=zoned(plot.id);plot.landUse||=(plot.owner?'residential':plot.zoning);plot.shop||={sign:'',stock:{},prices:{},till:0};plot.shop.stock||={};plot.shop.prices||={};plot.shop.till||=0;if(plot.owner&&plot.home&&plot.landUse==='business')plot.home.open=true;}
}
function eligible(g,p,plot){if((p.scene||'city')!=='city')throw Error('Участки оформляются в городе');g.near(p,g.target(plot.id));if(p.spirit||p.job||p.delivery?.picked)throw Error('Сначала заверши работу или доставку');}
const landChoice=(plot,requested)=>{const use=requested||plot.zoning;if(!Object.hasOwn(ZONING,use)||plot.zoning!=='universal'&&plot.zoning!==use)throw Error('Назначение этого участка закреплено планом города');return use;};
export function tickEstateLeases(g){
 for(const plot of g.state.plots){if(!plot.lease||plot.lease.dueAt>g.now)continue;
  const p=g.state.players[plot.owner];if(!p||!g.online.has(p.id)||p.wallet<1)continue;
  const nextPeriods=Math.floor((g.now-plot.lease.dueAt)/LEASE_DAY_MS)+1;
  // No back billing for days when the player was absent. Charge one day on reconnection.
  if(nextPeriods>1){plot.lease.dueAt=g.now+LEASE_DAY_MS;p.wallet--;g.state.treasury++;g.state.transactions.push({id:'lease-'+plot.id+'-'+g.now,player:p.id,amount:-1,reason:'rent-renew',time:g.now});g.changed();continue;}
  p.wallet--;g.state.treasury++;plot.lease.dueAt+=LEASE_DAY_MS;g.state.transactions.push({id:'lease-'+plot.id+'-'+g.now,player:p.id,amount:-1,reason:'rent-renew',time:g.now});g.changed();
 }
}
export function estateAction(g,p,cmd){
 if(!['buy','plotRent','plotRenew','plotUse','plotSign','shopStock','shopPrice','shopBuy','shopCollect','shopUnstock'].includes(cmd?.type))return null;
 const plot=g.state.plots.find(t=>t.id===cmd.target);if(!plot)throw Error('Участок не найден');
 if(['buy','plotRent'].includes(cmd.type)){
  eligible(g,p,plot);if(plot.locked)throw Error('Сначала открой территорию');if(plot.owner)throw Error('Участок занят');
  const use=landChoice(plot,cmd.landUse);
  if(cmd.type==='plotRent'&&use==='residential')throw Error('Аренда доступна коммерческим и универсальным участкам');
  const price=cmd.type==='buy'?g.c.plotPrice:1;
  if(p.wallet<price)throw Error('Недостаточно PAPER');
  p.wallet-=price;g.state.treasury+=price;plot.owner=p.id;plot.ownerName=p.name;plot.ownerGender=p.gender||'unspecified';plot.landUse=use;
  plot.lease=cmd.type==='plotRent'?{dueAt:g.now+LEASE_DAY_MS,pricePerDay:1}:null;
  if(use==='business')plot.home.open=true;g.state.transactions.push({id:cmd.requestId,player:p.id,amount:-price,reason:cmd.type==='buy'?'land-buy':'land-rent',time:g.now,plot:plot.id});
  return {message:cmd.type==='buy'?'Участок куплен и сохранён за тобой':'Участок арендован на сутки · 1 PAPER'};
 }
 const owner=p.id===plot.owner,atHome=(p.scene||'city')==='plot'&&p.plotId===plot.id;
 if(!atHome)eligible(g,p,plot);
 if(cmd.type==='plotRenew'){
  if(!owner||!plot.lease)throw Error('Это не твоя аренда');
  if(p.wallet<1)throw Error('Для продления аренды нужна 1 PAPER');
  p.wallet--;g.state.treasury++;plot.lease.dueAt=Math.max(g.now,plot.lease.dueAt)+LEASE_DAY_MS;
  g.state.transactions.push({id:cmd.requestId,player:p.id,amount:-1,reason:'rent-prepay',plot:plot.id,time:g.now});
  return {message:'Аренда продлена на сутки'};
 }
 if(cmd.type==='plotUse'){
  if(!owner||plot.zoning!=='universal')throw Error('Поменять назначение можно только на своём универсальном участке');
  plot.landUse=landChoice(plot,cmd.landUse);
  plot.home.open=plot.landUse==='business'?true:!!cmd.open;
  return {message:'Назначение участка обновлено'};
 }
 if(cmd.type==='plotSign'){
  if(!owner)throw Error('Это чужая вывеска');
  if(!['business','universal'].includes(plot.landUse))throw Error('Вывеска доступна для бизнеса и универсального участка');
  const sign=String(cmd.text||'').trim().replace(/[<>\x00-\x1f]/g,'').slice(0,80);
  if(sign.length<3)throw Error('На вывеске нужно хотя бы 3 символа');
  plot.shop.sign=sign;return {message:'Вывеска обновлена — видна всем'};
 }
 if(!['business','universal'].includes(plot.landUse)||!leaseActive(plot,g.now))throw Error('Магазин закрыт или срок аренды истёк');
 const shop=plot.shop,kind=String(cmd.kind||''),n=Number(cmd.quantity||1);
 if(cmd.type==='shopCollect'){
  if(!owner)throw Error('Выручку забирает владелец');const sum=shop.till||0;if(!sum)throw Error('Пока нет продаж');
  p.wallet+=sum;shop.till=0;return {message:'Выручка получена · '+sum+' PAPER'};
 }
 if(!tradable.has(kind))throw Error('Этот товар пока нельзя продавать');
 if(cmd.type==='shopPrice'){
  if(!owner)throw Error('Цену назначает владелец');
  const price=Number(cmd.price);if(!Number.isSafeInteger(price)||price<1||price>999)throw Error('Цена 1–999 PAPER');
  shop.prices[kind]=price;return {message:'Цена установлена · '+price+' PAPER'};
 }
 if(!Number.isSafeInteger(n)||n<1||n>20)throw Error('Количество от 1 до 20');
 if(cmd.type==='shopStock'){
  if(!owner)throw Error('Выкладывать товар может только владелец');
  if((p.bag[kind]||0)<n)throw Error('Не хватает товара');p.bag[kind]-=n;shop.stock[kind]=(shop.stock[kind]||0)+n;
  return {message:'Товар выставлен · '+n};
 }
 if(cmd.type==='shopUnstock'){
  if(!owner)throw Error('Товар принадлежит другому владельцу');
  if((shop.stock[kind]||0)<n)throw Error('В витрине меньше товара');
  if(Object.entries(p.bag).reduce((a,[k,v])=>a+v*(g.c.weights[k]||0),0)+n*(g.c.weights[kind]||0)>bagCapacity(p,g.c,g.now))throw Error('Нет места в рюкзаке');
  shop.stock[kind]-=n;p.bag[kind]=(p.bag[kind]||0)+n;return {message:'Товар снят с продажи'};
 }
 if(owner)throw Error('Нельзя купить товар у самого себя');
 const price=shop.prices[kind]||0,cost=price*n;
 if(!price||shop.stock[kind]<n||p.wallet<cost)throw Error('Товар закончился или недостаточно PAPER');
 if(Object.entries(p.bag).reduce((a,[k,v])=>a+v*(g.c.weights[k]||0),0)+n*(g.c.weights[kind]||0)>bagCapacity(p,g.c,g.now))throw Error('Рюкзак полон');
 p.wallet-=cost;shop.stock[kind]-=n;shop.till=(shop.till||0)+cost;p.bag[kind]=(p.bag[kind]||0)+n;
 g.state.transactions.push({id:cmd.requestId,player:p.id,amount:-cost,reason:'private-stall',plot:plot.id,kind,quantity:n,time:g.now});
 return {message:'Куплено '+n+' · '+cost+' PAPER'};
}
