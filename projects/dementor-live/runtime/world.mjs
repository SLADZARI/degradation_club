import { randomUUID } from 'node:crypto';
import {syncEquipment,addTool,equipmentAction} from './equipment.mjs';
import {initPlaza,plazaAction,plazaSnapshot,PLAZA} from './plaza.mjs';
import { CONFIG } from './config.mjs';
import {ITEMS,migrateLife,lifeAction,lifeSnapshot,scene} from './life.mjs';
import {CITY_BUILDINGS,newConstruction,initialiseCityExpansion,cityExpansionAction,cityMaterialReport,recordMaterial} from './city-expansion.mjs';
import {LANDSCAPE_SHOP,LANDSCAPE_PRODUCTS,ensureLandscape,landscapeSpeed,landscapeAction} from './landscape.mjs';
import {reconcileResourceClearance} from './resource-clearance.mjs';
import {initForestry,forestryAction,TREE_SPECIES} from './forestry.mjs';
import {initEstates,estateAction,tickEstateLeases} from './estate.mjs';
import {bagCapacity} from './losev-courses.mjs';
import {stoneSize} from './world-footprints.mjs';
import {initMayor,mayorAction} from './mayor-ideas.mjs';
import {MUNICIPAL_SITES,emptyMunicipalProject,municipalBuildingView,municipalBuilt} from './municipal-buildings.mjs';
import {WORLD_STRUCTURE_FOOTPRINTS} from './world-footprints.mjs';

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
export const loadWeight = (p,c=CONFIG) => Object.entries(p.bag).reduce((n,[k,v])=>n+v*c.weights[k],0)+(p.delivery?.picked?p.delivery.quantity*c.weights[p.delivery.kind]:0);
export const projectBudget = c => c.need.wood*c.pay.wood+c.need.stone*c.pay.stone+c.stages.reduce((n,s)=>n+s.works*c.pay.work,0);
export function createWorld(c=CONFIG, options={}) {
  const resource=(id,type,x,y,stock)=>({id,type,x,y,stock,initial:stock,regrowAt:0});
  return { version:1, worldId:randomUUID(), startingCity:options.startingCity===true, treasury:c.treasury, project:{stage:0,work:0,accepted:{wood:0,stone:0},stock:{wood:0,stone:0},consumed:{wood:0,stone:0},spent:0},
    players:{}, plots:[{id:'plot-1',x:4,y:15,w:6,h:6,owner:null},{id:'plot-2',x:4,y:23,w:6,h:6,owner:null},{id:'plot-3',x:14,y:23,w:6,h:6,owner:null}],
    resources:[resource('wood-1','wood',14,5,40),resource('wood-2','wood',21,5,40),resource('wood-3','wood',28,6,40),resource('wood-4','wood',30,20,40),resource('stone-1','stone',12,20,40),resource('stone-2','stone',27,11,40),resource('stone-3','stone',30,27,40),resource('stone-4','stone',2,27,40),resource('food-1','food',8,10,c.foodStock),resource('food-2','food',3,10,c.foodStock),resource('food-3','food',25,20,c.foodStock)],
    chat:[], transactions:[], revision:0 };
}
const supplyBridge=(project,kind,quantity)=>{project.accepted[kind]+=quantity;project.stock[kind]+=quantity;};
const newProject=()=>({stage:0,work:0,accepted:{wood:0,stone:0},stock:{wood:0,stone:0},consumed:{wood:0,stone:0},spent:0});
export class Game {
  constructor(state=createWorld(),c=CONFIG){ this.state=state;this.c=state?.startingCity?{...c,expedition:{...c.expedition,gate:{...c.expedition.gate,x:7,y:18}}}:c;this.online=new Set();this.inputs=new Map();this.now=Date.now(); this.onChange=()=>{};this.dirty=false;if(!state.worldId){state.worldId=randomUUID();this.dirty=true;}
    state.forge ||= newProject();state.bridge ||= newProject();state.technologies ||= {};state.phoneResearch ||= {startedAt:0,endsAt:0,completedAt:0};state.mayorLevel ||= state.startingCity&&state.project.stage>=(c.stages.length)?2:1;
    state.municipalBuildings ||= {};
    for(const site of Object.values(MUNICIPAL_SITES)){if(!state.municipalBuildings[site.id]){const p=emptyMunicipalProject();if(!state.startingCity)p.stage=site.stages.length;state.municipalBuildings[site.id]=p;}}
    for(const [id,type,x,y,stock]of [['east-wood-1','wood',41,7,48],['east-wood-2','wood',44,10,48],['east-wood-3','wood',42,23,48],['east-wood-4','wood',45,26,48],['east-stone-1','stone',42,16,48],['east-stone-2','stone',45,20,48],['east-food','food',41,12,c.foodStock]])if(!state.resources.some(r=>r.id===id))state.resources.push({id,type,x,y,stock,initial:stock,regrowAt:0});
    state.warehouse ||= {stock:{wood:0,stone:0},municipal:{wood:0,stone:0},spent:0};
    state.drops ||= [];
    migrateLife(this);initPlaza(this);initialiseCityExpansion(this);ensureLandscape(this);initForestry(this);initEstates(this);initMayor(this);reconcileResourceClearance(this);
    for(const p of Object.values(state.players)){p.job=null;p.results=p.results||[];p.lastMessage=0;p.toolInfo ||= {axe:{tier:'basic',max:c.toolDurability},pick:{tier:'basic',max:c.toolDurability}};syncEquipment(p,c);}
    this._solidIds=new Set(this.rects().map(o=>o.id));
  }
  evacuateNewFootprints(newFootprints){
    for(const p of Object.values(this.state.players)){
      if(scene(p)!=='city'||this.walkable(p.x,p.y,p))continue;
      const trapped=newFootprints.find(o=>p.x+.3>o.x&&p.x-.3<o.x+o.w&&p.y+.3>o.y&&p.y-.3<o.y+o.h);
      if(!trapped)continue;
      const from={x:p.x,y:p.y};let destination=null;
      for(let radius=.5;radius<=12&&!destination;radius+=.5){
        for(let n=0;n<32;n++){
          const theta=2*Math.PI*n/32;
          const x=Math.round((from.x+Math.cos(theta)*radius)*1000)/1000;
          const y=Math.round((from.y+Math.sin(theta)*radius)*1000)/1000;
          if(this.walkable(x,y,p)&&!Object.values(this.state.players).some(other=>other!==p&&scene(other)==='city'&&Math.hypot(x-other.x,y-other.y)<.65)){
            destination={x,y};break;
          }
        }
      }
      if(!destination)throw Error('No safe exit near newly constructed '+trapped.id);
      p.x=destination.x;p.y=destination.y;p.job=null;
      this.inputs.set(p.id,{dx:0,dy:0,sprint:false,at:this.now});
      this.state.constructionRescues ||= [];
      this.state.constructionRescues.push({id:p.id,building:trapped.id,from,to:destination,at:this.now});
      this.state.constructionRescues=this.state.constructionRescues.slice(-30);
    }
  }
  changed(){
    if(this._solidIds){
      const now=this.rects(),added=now.filter(o=>!this._solidIds.has(o.id));
      if(added.length)this.evacuateNewFootprints(added);
      this._solidIds=new Set(now.map(o=>o.id));
    }
    this.state.revision++;this.dirty=true;this.onChange();
  }

  join(name,gender='unspecified'){
    name=String(name||'').trim().replace(/[<>\x00-\x1f]/g,'').slice(0,20);
    if(!name)throw Error('Как тебя зовут?');if(!['male','female','unspecified'].includes(gender))throw Error('Выбери корректное обращение');
    const id=randomUUID(),token=randomUUID();const p={id,token,name,gender,x:8+(Object.keys(this.state.players).length%3)*0.8,y:8,color:Object.keys(this.state.players).length%3,wallet:0,bag:{wood:0,stone:0,food:0},tools:{axe:0,pick:0},equipped:'axe',hunger:100,health:100,stamina:100,spirit:false,job:null,results:[],lastMessage:0};
    p.toolInfo={axe:{tier:'basic',max:this.c.toolDurability},pick:{tier:'basic',max:this.c.toolDurability}};this.state.players[id]=p;migrateLife(this);ensureLandscape(this);initForestry(this);initMayor(this);this.changed();return p;
  }
  auth(token){return Object.values(this.state.players).find(p=>p.token===token);}
  connect(p){this.online.add(p.id);this.inputs.set(p.id,{dx:0,dy:0,sprint:false,at:this.now});this.changed();}
  disconnect(p){this.online.delete(p.id);this.inputs.delete(p.id);p.job=null;this.changed();}
  rects(){const s=this.state,footprints=[...WORLD_STRUCTURE_FOOTPRINTS,
 {x:4,y:4,w:4,h:3,id:'mayor-tent'},
 {x:22.7,y:1,w:2.6,h:2,id:'tool-shop'},
 {x:15.5,y:1.5,w:2.5,h:2.2,id:'landscape-shop'},
 {x:10.7,y:25,w:2.6,h:3,id:'warehouse'},
 {x:2.9,y:7.7,w:.6,h:.6,id:'work-board'},
 {x:18.7,y:5.7,w:.6,h:.6,id:'city-registry'},
 {x:16.4,y:11.4,w:1.2,h:1.2,id:'monument'},
 {x:20.7,y:11.7,w:.6,h:.6,id:'jukebox'},
 {x:18.7,y:10.5,w:.6,h:.6,id:'donation-board'},
 {x:22.7,y:10.5,w:.6,h:.6,id:'theft-board'}
 ];if(s.startingCity)for(const site of Object.values(MUNICIPAL_SITES))if(municipalBuilt(s,site.id)&&!footprints.some(f=>f.id===site.id))footprints.push({x:site.x,y:site.y,w:site.w,h:site.h,id:site.id});if(s.seedMarket?.stage>=this.c.seedMarket.stages.length)footprints.push({x:21.8,y:5.3,w:2.5,h:2,id:'seed-shop'});
 if(s.forge?.stage>=this.c.forge.stages.length)footprints.push({x:24,y:23,w:6,h:5,id:'forge'});
 if(s.gardenProject?.stage>=this.c.cityGarden.stages.length)footprints.push({x:25.5,y:8.4,w:5.6,h:2.5,id:'public-garden'});
 if(!s.startingCity)return footprints;return footprints.filter(o=>['mayor-tent','work-board'].includes(o.id)||municipalBuilt(s,o.id)||s.project.stage>=this.c.stages.length&&['monument','jukebox','donation-board','theft-board'].includes(o.id));}
  walkable(x,y,p=null){if(p&&scene(p)!=='city'){if(x<.5||y<.5||x>15.5||y>15.5)return false;const h=scene(p)==='expedition'?this.state.expedition.home:this.state.plots.find(l=>l.id===p.plotId)?.home;if(['plot','expedition'].includes(scene(p))&&h?.nodes.some(n=>n.left>0&&Math.hypot(x-n.x,y-n.y)<.58))return false;if(scene(p)==='plot'&&h?.plantedTrees?.some(t=>{if(!t.wateredAt||this.now-t.wateredAt<180000)return false;const candidate=Math.hypot(x-t.x,y-t.y),prior=Math.hypot(p.x-t.x,p.y-t.y);return candidate<.55&&!(prior<.55&&candidate>prior+1e-6);}))return false;return true;}const r=.3,c=this.c;if(x<r||y<r||x>c.width-r||y>c.height-r)return false;
    if(x+r>c.river.x&&x-r<c.river.x+c.river.w&&!(this.state.bridge.stage>=c.bridge.stages.length&&y-r>=c.bridge.y&&y+r<=c.bridge.y+c.bridge.h))return false;
    if(this.rects().some(o=>x+r>o.x&&x-r<o.x+o.w&&y+r>o.y&&y-r<o.y+o.h))return false;
    return !this.state.resources.some(o=>o.stock>0&&o.type!=='food'&&Math.hypot(x-o.x,y-o.y)<.58);
  }
  projectFor(target){const municipal=target?.match(/^municipal-(.+)-(?:drop|build)$/);return municipal?this.state.municipalBuildings[municipal[1]]:target?.startsWith('seed-shop-')?this.state.seedMarket:target?.startsWith('public-garden-')?this.state.gardenProject:target?.startsWith('bridge-')?this.state.bridge:target?.startsWith('forge-')?this.state.forge:this.state.project;}
  deliveries(){return Object.values(this.state.players).filter(p=>p.delivery).map(p=>p.delivery);}
  committed(kind,pickedOnly=false,destination=null){return this.deliveries().filter(d=>d.kind===kind&&(!pickedOnly||d.picked)&&(!destination||(d.destination||'mayor')===destination)).reduce((n,d)=>n+d.quantity,0);}
  warehouseFree(kind){return Math.max(0,this.c.warehouse.capacity-this.state.warehouse.stock[kind]-this.committed(kind,true));}
  cityFunds(){
    // Keep unfinished construction funded before offering optional purchases and courier work.
    let reserved=this.deliveries().reduce((n,d)=>n+d.reward,0);
    for(const [p,c]of [[this.state.project,this.c],[this.state.forge,{...this.c,...this.c.forge}],[this.state.bridge,{...this.c,...this.c.bridge}],[this.state.seedMarket,{...this.c,...this.c.seedMarket}],[this.state.gardenProject,{...this.c,...this.c.cityGarden}],...Object.values(MUNICIPAL_SITES).filter(site=>this.state.startingCity&&(!site.requiredTechnology||this.state.technologies?.[site.requiredTechnology])&&(this.state.municipalBuildings?.[site.id]?.stage||0)<site.stages.length).map(site=>[this.state.municipalBuildings[site.id],{...this.c,...site}])]){
      for(const k of ['wood','stone'])reserved+=Math.max(0,c.need[k]-p.accepted[k])*c.pay[k];
      reserved+=c.stages.slice(p.stage).reduce((n,s)=>n+s.works,0)*c.pay.work-p.work*c.pay.work;
    }
    return Math.max(0,this.state.treasury-reserved);
  }
  courierOffer(kind,destination='mayor'){
    if(!['wood','stone'].includes(kind)||!['mayor','bridge'].includes(destination))return null;
    if(destination==='bridge'&&this.state.forge.stage<this.c.forge.stages.length)return null;
    const c=this.c.warehouse,w=this.state.warehouse;
    const need=destination==='bridge'?this.c.bridge.need[kind]-this.state.bridge.accepted[kind]:c.mayorNeed[kind]-w.municipal[kind];
    const quantity=Math.min(c.courierBatch,w.stock[kind]-this.deliveries().filter(d=>d.kind===kind&&!d.picked).reduce((n,d)=>n+d.quantity,0),need-this.committed(kind,false,destination));
    return quantity>0&&this.cityFunds()>=c.courierPay?{kind,destination,quantity,reward:c.courierPay}:null;
  }
  cityAction(p,cmd){
    const {type,kind}=cmd,c=this.c,w=this.state.warehouse;
    if(!['drop','pickup','warehouseSell','courierAccept','courierPickup','courierDeliver','courierCancel'].includes(type))return null;
    if(p.spirit)throw Error('Сначала восстанови тело с помощью еды');
    if(p.job)throw Error('Сначала закончи или останови текущую работу');
    if(type==='drop'){
      if(!Object.hasOwn(ITEMS,kind))throw Error('Выбери личный ресурс');
      const n=cmd.quantity===undefined?p.bag[kind]:cmd.quantity;
      if(!Number.isInteger(n)||n<=0||n>p.bag[kind])throw Error('Нет такого количества в рюкзаке');
      let pile=this.state.drops.find(d=>d.kind===kind&&(d.scene||'city')===scene(p)&&d.plotId===(p.plotId||undefined)&&distance(d,p)<.7);
      if(!pile){pile={id:'pile-'+randomUUID(),type:'pickup',kind,scene:scene(p),plotId:p.plotId||undefined,x:p.x,y:p.y,quantity:0};this.state.drops.push(pile);}
      p.bag[kind]-=n;pile.quantity+=n;return {message:`Выложено на землю: ${n}. Любой житель может подобрать.`};
    }
    if(type==='pickup'){
      const pile=this.state.drops.find(d=>d.id===cmd.target&&(d.scene||'city')===scene(p)&&(scene(p)==='city'||d.plotId===p.plotId));this.near(p,pile);
      const n=Math.min(pile.quantity,Math.floor((bagCapacity(p,c,this.now)-loadWeight(p,c))/c.weights[pile.kind]));
      if(n<=0)throw Error('В рюкзаке нет места');p.bag[pile.kind]+=n;pile.quantity-=n;
      this.state.drops=this.state.drops.filter(d=>d.quantity>0);return {message:`Подобрано: ${n}`};
    }
    if(type==='warehouseSell'){
      this.near(p,this.target('warehouse'));if(!['wood','stone'].includes(kind))throw Error('Склад принимает древесину и камень');
      const price=c.warehouse.pay[kind],n=Math.min(p.bag[kind],this.warehouseFree(kind),Math.floor(this.cityFunds()/price));
      if(n<=0)throw Error(!p.bag[kind]?'В рюкзаке нет этого материала':!this.warehouseFree(kind)?'Склад заполнен этим материалом':'Свободный бюджет приёмки исчерпан');
      p.bag[kind]-=n;w.stock[kind]+=n;this.transfer(p,n*price,'warehouse');w.spent+=n*price;recordMaterial(this,'warehouse-accept',kind,n,'bag','warehouse',p.id);
      return {message:`Склад принял ${n} · +${n*price} PAPER`,reward:n*price};
    }
    if(type==='courierAccept'){
      this.near(p,this.target('board'));if(p.delivery)throw Error('Сначала заверши или отмени свой заказ');
      const offer=this.courierOffer(kind,cmd.destination||'mayor');if(!offer)throw Error('Этот заказ уже разобрали или он больше не нужен');
      p.delivery={...offer,id:randomUUID(),picked:false,expiresAt:this.now+c.warehouse.reservationMs};
      return {message:'Заказ взят. Забери городской груз на складе в течение 5 минут.'};
    }
    const d=p.delivery;if(!d)throw Error('У тебя нет курьерского заказа');
    if(type==='courierPickup'){
      this.near(p,this.target('warehouse'));if(d.picked)throw Error('Груз уже у тебя');
      if(loadWeight(p,c)+d.quantity*c.weights[d.kind]>bagCapacity(p,c,this.now))throw Error('Освободи место для городского груза');
      if(w.stock[d.kind]<d.quantity)throw Error('На складе нет зарезервированного груза');
      w.stock[d.kind]-=d.quantity;d.picked=true;recordMaterial(this,'courier-pickup',d.kind,d.quantity,'warehouse','transit',p.id);return {message:d.destination==='bridge'?'Груз получен. Отнеси его на стройку моста.':'Городской груз в рюкзаке. Отнеси его в мэрию.'};
    }
    if(type==='courierDeliver'){
      this.near(p,this.target(d.destination==='bridge'?'bridge-drop':'mayor'));if(!d.picked)throw Error('Сначала забери груз на складе');
      this.transfer(p,d.reward,'courier');if(d.destination==='bridge'){supplyBridge(this.state.bridge,d.kind,d.quantity);this.state.bridge.spent+=d.reward;}else w.municipal[d.kind]+=d.quantity;recordMaterial(this,'courier-deliver',d.kind,d.quantity,'transit',d.destination==='bridge'?'bridge':'municipal',p.id);w.spent+=d.reward;p.delivery=null;
      return {message:`Доставка принята · +${d.reward} PAPER`,reward:d.reward};
    }
    if(d.picked){this.near(p,this.target('warehouse'));w.stock[d.kind]+=d.quantity;recordMaterial(this,'courier-return',d.kind,d.quantity,'transit','warehouse',p.id);}
    p.delivery=null;return {message:'Заказ отменён. Городской груз остаётся на складе.'};
  }
  configFor(target){const municipal=target?.match(/^municipal-(.+)-(?:drop|build)$/);return municipal?{...this.c,...MUNICIPAL_SITES[municipal[1]]}:target?.startsWith('seed-shop-')?{...this.c,...this.c.seedMarket}:target?.startsWith('public-garden-')?{...this.c,...this.c.cityGarden}:target?.startsWith('bridge-')?{...this.c,...this.c.bridge}:target?.startsWith('forge-')?{...this.c,...this.c.forge}:this.c;}
  target(id){const municipal=Object.values(MUNICIPAL_SITES).find(site=>site.drop.id===id||site.build.id===id);if(municipal)return id===municipal.drop.id?municipal.drop:municipal.build;if(CITY_BUILDINGS[id])return CITY_BUILDINGS[id];if(id==='frontier-gate')return this.c.expedition.gate;if(id==='landscape-shop')return LANDSCAPE_SHOP;const po=PLAZA.objects.find(o=>o.id===id);if(po)return po;const s=this.state;if(id==='bridge-drop')return {id,x:32.5,y:12.3,type:'project'};if(id==='bridge-build')return {id,x:32,y:13.5,type:'build'};if(id==='east-bank')return {id,x:40,y:13.5,type:'explore'};if(id==='forge-drop')return {id,x:24.5,y:24,type:'project'};if(id==='forge-build')return {id,x:27,y:26,type:'build'};if(id==='tools')return {id,x:9,y:6,type:'tools'};if(id==='project')return {id,x:15,y:11,type:'project'};if(id==='build')return {id,x:18,y:14,type:'build'};
    if(id==='forge-use')return {id,type:'forge',x:27,y:29.5};if(id==='tool-shop')return {id,type:'shop',x:24,y:3};
    if(id==='warehouse')return {id,type:'warehouse',x:12,y:24};if(id==='board')return {id,type:'board',x:3.2,y:8};if(id==='mayor')return {id,type:'mayor',x:9,y:3};
    const pile=s.drops.find(d=>d.id===id);if(pile)return pile;
    const r=s.resources.find(x=>x.id===id);if(r)return r;const plot=s.plots.find(x=>x.id===id);if(plot)return {...plot,type:'plot',x:plot.x+plot.w/2,y:plot.y-1};return null;
  }
  near(p,target){
    if(!target)throw Error('Подойди ближе к объекту');
    const size=stoneSize(target);
    const near=size?Math.hypot(Math.max(0,Math.abs(p.x-target.x)-size/2),Math.max(0,Math.abs(p.y-target.y)-size/2)):distance(p,target);
    if(near>this.c.actionRange)throw Error('Подойди ближе к объекту');
  }
  transfer(p,amount,reason){if(!Number.isInteger(amount)||amount<0||this.state.treasury<amount)throw Error('Городской резерв исчерпан');this.state.treasury-=amount;p.wallet+=amount;this.state.transactions.push({id:randomUUID(),player:p.id,amount,reason,time:this.now});}
  input(p,{dx,dy,sprint}){if(!Number.isFinite(dx)||!Number.isFinite(dy))throw Error('Некорректное движение');const len=Math.hypot(dx,dy);this.inputs.set(p.id,{dx:len?dx/Math.max(1,len):0,dy:len?dy/Math.max(1,len):0,sprint:!!sprint,at:this.now});}
  command(p,cmd){
    if(!cmd||typeof cmd.requestId!=='string'||cmd.requestId.length<4||cmd.requestId.length>100)throw Error('Нет идентификатора действия');
    const done=p.results.find(r=>r.id===cmd.requestId);if(done)return done.result;
    let result;
    syncEquipment(p,this.c);try{result={ok:true,...this.action(p,cmd)};}catch(e){result={ok:false,message:e.message};}syncEquipment(p,this.c);
    if(result.ok&&!p.spirit)p.lastActiveGameplayAt=this.now;p.results.push({id:cmd.requestId,result});p.results=p.results.slice(-128);this.changed();return result;
  }
  action(p,cmd){const {type,target}=cmd,c=this.configFor(target),s=this.state,project=this.projectFor(target);
    const publicResult=plazaAction(this,p,cmd);if(publicResult)return publicResult;
    const discarded=cmd.type==='discardTool'?p.toolItems?.find(t=>t.id===target)?.ingredients:null;
    const equipmentResult=equipmentAction(p,cmd,this.c);if(equipmentResult){if(discarded){s.materialScrap||={wood:0,stone:0};for(const [kind,quantity]of Object.entries(discarded)){s.materialScrap[kind]+=quantity;recordMaterial(this,'tool-discard',kind,quantity,'tool','scrap',p.id);}}return equipmentResult;}
    const estateResult=estateAction(this,p,cmd);if(estateResult)return estateResult;const ideaResult=mayorAction(this,p,cmd);if(ideaResult)return ideaResult;const forestryResult=forestryAction(this,p,cmd);if(forestryResult)return forestryResult;const livingResult=lifeAction(this,p,cmd);if(livingResult)return livingResult;
    const municipalId=String(target||'').match(/^municipal-(.+)-(?:drop|build)$/)?.[1],municipalSite=MUNICIPAL_SITES[municipalId];if(municipalSite?.requiredTechnology&&!s.technologies?.[municipalSite.requiredTechnology])throw Error('Сначала изучите технологию в мэрии второго уровня');
    if(type==='researchPayphones'){if(scene(p)!=='city')throw Error('Исследование доступно только в городской мэрии');if(!s.startingCity||s.mayorLevel<2)throw Error('Сначала городская площадь должна открыть мэрию второго уровня');this.near(p,this.target('mayor'));if(s.technologies.payphones)throw Error('Технология уже изучена');if(s.phoneResearch.startedAt)throw Error('Исследование уже идёт');s.phoneResearch={startedAt:this.now,endsAt:this.now+this.c.phoneResearchMs,completedAt:0};return {message:'Исследование таксофонов началось · 240 секунд'};}
    const expansionResult=cityExpansionAction(this,p,cmd);if(expansionResult)return expansionResult;const landscapeResult=landscapeAction(this,p,cmd);if(landscapeResult)return landscapeResult;
    if(scene(p)!=='city'&&!['chat','eat','give','equip','tools','cancel','drop','pickup'].includes(type))throw Error('Это действие доступно в городе');
    const cityResult=this.cityAction(p,cmd);if(cityResult)return cityResult;
    if(type==='chat'){
      const text=String(cmd.text||'').trim().replace(/[<>\x00-\x1f]/g,'').slice(0,180);if(!text)throw Error('Напиши сообщение');if(this.now-p.lastMessage<600)throw Error('Небольшая пауза между сообщениями');p.lastMessage=this.now;
      s.chat.push({id:randomUUID(),player:p.id,name:p.name,text,x:p.x,y:p.y,scene:scene(p),plotId:p.plotId||null,at:this.now});s.chat=s.chat.slice(-50);return {message:'Сообщение отправлено'};
    }
    if(type==='eat'){
      if(p.bag.food<1)throw Error('Собери еду с куста');p.bag.food--;this.restore(p);return {message:'Ты снова полон сил'};
    }
    if(type==='give'){
      const other=s.players[target];if(!other||!this.online.has(other.id)||other.id===p.id||scene(other)!==scene(p)||(scene(p)!=='city'&&other.plotId!==p.plotId))throw Error('Рядом нет этого жителя');this.near(p,other);if(p.bag.food<1)throw Error('Нужна порция еды');if(p.spirit)throw Error('Сначала восстанови тело');p.bag.food--;this.restore(other);return {message:`Еда для ${other.name} — спасибо за помощь!`};
    }
    if(type==='equip'){if(!['axe','pick'].includes(target))throw Error('Нет такого инструмента');p.equipped=target;return {message:target==='axe'?'Топор в руках':'Кирка в руках'};}
    if(type==='cancel'){p.job=null;return {message:'Действие остановлено'};}
    const t=this.target(target);this.near(p,t);
    if(type==='gather'){
      if(t.type!=='food')throw Error('Здесь нет еды');if(t.stock<=0)throw Error('Ягоды скоро созреют');
      if(p.spirit){t.stock--;if(!t.regrowAt)t.regrowAt=this.now+c.berryRegrowMs;this.restore(p,'food',true);return {message:'Ягоды вернули тебе тело'};}
      if(loadWeight(p,c)+c.weights.food>bagCapacity(p,c,this.now))throw Error('Рюкзак полон — съешь еду или сдай материалы');
      return this.start(p,'gather',target,c.gatherMs);
    }
    if(p.spirit)throw Error('Дух может найти еду на кусте или принять её от жителя');
    if(type==='craftTool'||type==='buyTool'){
      const tool=cmd.tool;if(!['axe','pick'].includes(tool))throw Error('Выбери топор или кирку');if(p.job)throw Error('Сначала закончи текущую работу');
      const craft=type==='craftTool',spec=craft?c.toolMaking:c.toolShop;
      if(t.type!==(craft?'forge':'shop'))throw Error('Подойди к нужному зданию');
      if(craft&&s.forge.stage<c.forge.stages.length)throw Error('Сначала постройте и обустройте кузницу');
      syncEquipment(p,c);if(p.toolItems.length>=12)throw Error('Рюкзак вмещает до 12 инструментов. Удали лишний.');
      if(craft){for(const [k,n]of Object.entries(spec.recipe))if(p.bag[k]<n)throw Error('Принеси личные материалы для изготовления');for(const [k,n]of Object.entries(spec.recipe))p.bag[k]-=n;}
      else{if(p.wallet<spec.price)throw Error(`Нужно ${spec.price} PAPER`);p.wallet-=spec.price;s.treasury+=spec.price;s.transactions.push({id:randomUUID(),player:p.id,amount:-spec.price,reason:'premium-tool',time:this.now});}
      addTool(p,tool,spec.durability,craft?'crafted':'premium',c);if(craft){const item=p.toolItems.at(-1);if(item)item.ingredients={...spec.recipe};for(const [kind,quantity]of Object.entries(spec.recipe))recordMaterial(this,'craft-tool',kind,quantity,'bag','tool',p.id);}return {message:`${craft?'Изготовлен':'Куплен'} ${tool==='axe'?'топор':'кирка'} · прочность ${spec.durability}`};
    }
    if(type==='tools'){if(t.type!=='tools')throw Error('Инструменты выдаёт мэрия');syncEquipment(p,c);const missing=['axe','pick'].filter(k=>!p.tools[k]).length;if(p.toolItems.length+missing>12)throw Error('Освободи место для инструментов');for(const tool of ['axe','pick']){if(!p.tools[tool])addTool(p,tool,c.toolDurability,'basic',c);else if(p.toolInfo[tool].max<=c.toolDurability){p.tools[tool]=c.toolDurability;p.toolInfo[tool]={tier:'basic',max:c.toolDurability};}}return {message:'Стартовые инструменты выданы. Улучшенные сохранены без бесплатного ремонта.'};}
    if(type==='mine'){
      if(t.species==='spruce'&&p.toolInfo?.axe?.tier==='basic')throw Error('Для ели нужен улучшенный топор из кузницы');
      if(!['wood','stone'].includes(t.type))throw Error('Здесь нечего добывать');if(t.stock<=0)throw Error('Этот запас исчерпан');const tool=t.type==='wood'?'axe':'pick';if(p.equipped!==tool)throw Error(tool==='axe'?'Выбери топор — клавиша 1':'Выбери кирку — клавиша 2');if(p.tools[tool]<=0)throw Error('Инструмент сломан — возьми замену в мэрии');
      if(loadWeight(p,c)+c.weights[t.type]>bagCapacity(p,c,this.now))throw Error('Рюкзак полон — отнеси материалы на площадь');return this.start(p,'mine',target,c.mineMs);
    }
    if(target?.startsWith('forge-')&&s.project.stage<this.c.stages.length)throw Error('Сначала завершите городскую площадь');
    if(target?.startsWith('bridge-')&&s.forge.stage<this.c.forge.stages.length)throw Error('Сначала завершите общественную кузницу');
    if(type==='deliver'){
      if(t.type!=='project')throw Error('Материалы принимает площадка');let reward=0,count=0;
      for(const k of ['wood','stone']){let n=Math.min(p.bag[k],Math.max(0,c.need[k]-project.accepted[k]-(target==='bridge-drop'?this.committed(k,false,'bridge'):0)));if(n>0){reward+=n*c.pay[k];count+=n;}}
      if(!count)throw Error('Нет нужных материалов: проверь потребность площади');if(s.treasury<reward)throw Error('Нет обеспеченного городского резерва');
      for(const k of ['wood','stone']){const n=Math.min(p.bag[k],Math.max(0,c.need[k]-project.accepted[k]-(target==='bridge-drop'?this.committed(k,false,'bridge'):0)));p.bag[k]-=n;project.accepted[k]+=n;project.stock[k]+=n;if(n)recordMaterial(this,'construction-delivery',k,n,'bag',target,p.id);}
      this.transfer(p,reward,'materials');project.spent+=reward;return {message:`Принято ${count} · +${reward} PAPER`,reward};
    }
    if(type==='build'){
      if(t.type!=='build')throw Error('Подойди к месту строительных работ');this.canBuild(target);if(s.treasury<c.pay.work)throw Error('Нет резерва оплаты');return this.start(p,'build',target,c.buildMs);
    }
    if(type==='buy'){
      if(t.type!=='plot')throw Error('Это не участок');const plot=s.plots.find(x=>x.id===target);if(plot.locked)throw Error('Завершите миссию расчистки, чтобы открыть этот участок');if(plot.owner)throw Error('Участок уже куплен');if(p.wallet<c.plotPrice)throw Error(`Участок стоит ${c.plotPrice} PAPER`);
      p.wallet-=c.plotPrice;s.treasury+=c.plotPrice;plot.owner=p.id;s.transactions.push({id:randomUUID(),player:p.id,amount:-c.plotPrice,reason:'plot',time:this.now});return {message:'Твоё место в городе. Участок куплен!'};
    }
    throw Error('Неизвестное действие');
  }
  restore(p,kind='food',revive=false){const amount=kind==='carrot'?60:25;p.spirit=false;p.hunger=clamp(p.hunger+(revive?this.c.foodRestore:amount),0,100);p.health=clamp(p.health+(revive?100:amount),0,100);p.stamina=clamp(p.stamina+(revive?100:amount),0,100);}
  canBuild(target){const p=this.projectFor(target),stage=this.configFor(target).stages[p.stage];if(!stage)throw Error('Стройка завершена');if(p.stock.wood<stage.wood||p.stock.stone<stage.stone)throw Error('Сначала доставьте материалы для этого этапа');}
  start(p,kind,target,ms){if(p.job)throw Error('Дождись текущего действия');p.job={kind,target,started:this.now,ends:this.now+ms,stage:this.projectFor(target).stage};return {message:kind==='build'?'Работаем…':kind==='mine'?'Добываем…':'Собираем…',started:true};}
  finish(p){const job=p.job;p.job=null;const t=this.target(job.target);try{this.near(p,t);
    if(job.kind==='gather'){
      if(t.stock<=0||loadWeight(p,this.c)+1>bagCapacity(p,this.c,this.now))return;t.stock--;p.bag.food++;if(!t.regrowAt)t.regrowAt=this.now+this.c.berryRegrowMs;
    }else if(job.kind==='mine'){
      const tool=t.type==='wood'?'axe':'pick';if(p.spirit||t.stock<=0||p.tools[tool]<=0||p.equipped!==tool||loadWeight(p,this.c)+this.c.weights[t.type]>bagCapacity(p,this.c,this.now))return;
      t.stock--;p.bag[t.type]++;p.tools[tool]--;recordMaterial(this,'mine',t.type,1,'deposit','bag',p.id);
    }else if(job.kind==='build'){
      if(p.spirit||job.stage!==this.projectFor(job.target).stage)return;this.canBuild(job.target);const project=this.projectFor(job.target),stage=this.configFor(job.target).stages[project.stage];this.transfer(p,this.c.pay.work,'work');project.spent+=this.c.pay.work;project.work++;
      if(project.work>=stage.works){for(const k of ['wood','stone']){project.stock[k]-=stage[k];project.consumed[k]+=stage[k];if(stage[k])recordMaterial(this,'structure-built',k,stage[k],job.target,'structure',p.id);}project.stage++;project.work=0;if(project===this.state.project&&this.state.startingCity&&project.stage>=this.c.stages.length)this.state.mayorLevel=2;reconcileResourceClearance(this);}
    }
    this.changed();
    }catch{ /* Another player may complete the same final unit first; no payment is made. */ }
  }
  tick(ms){this.now+=ms;tickEstateLeases(this);if(this.state.phoneResearch?.startedAt&&!this.state.phoneResearch.completedAt&&this.now>=this.state.phoneResearch.endsAt){this.state.phoneResearch.completedAt=this.state.phoneResearch.endsAt;this.state.technologies.payphones=true;this.changed();}for(const t of this.state.trades)if(t.status==='offered'&&t.expires<=this.now){t.status='expired';this.changed();}const dt=ms/1000,c=this.c;
    for(const p of Object.values(this.state.players))if(p.delivery&&!p.delivery.picked&&p.delivery.expiresAt<=this.now){p.delivery=null;this.changed();}
    for(const r of this.state.resources)if(r.type==='food'&&r.regrowAt&&this.now>=r.regrowAt){r.stock=Math.min(c.foodStock,r.stock+1);r.regrowAt=r.stock<c.foodStock?this.now+c.berryRegrowMs:0;this.changed();}
    for(const id of this.online){const p=this.state.players[id];if(!p)continue;
      if(p.combatP0?.activeSessionId && this.state.combatP0?.sessions?.[p.combatP0.activeSessionId]?.status!=='CLOSED')continue; // Civil hunger / movement suspended during COMBAT-01 instance.
      this.dirty=true;
      if(!p.spirit){p.hunger=Math.max(0,p.hunger-c.hungerPerSecond*dt);if(p.hunger===0){p.spirit=true;p.health=0;p.job=null;p.x=8;p.y=8;p.scene='city';p.plotId=null;p.stamina=100;this.inputs.set(p.id,{dx:0,dy:0,sprint:false,at:this.now});this.changed();}}
      const input=this.inputs.get(id);let moving=input&&this.now-input.at<400&&Math.hypot(input.dx,input.dy)>0;
      if(!p.spirit&&(moving||p.lastActiveGameplayAt&&this.now-p.lastActiveGameplayAt<15000)){p.activeGameMs=Math.min(86400000,(p.activeGameMs||0)+Math.min(ms,250));}
      const sprint=moving&&input.sprint&&!p.spirit&&p.stamina>5&&p.hunger>=c.slowBelow;
      const biome=moving&&typeof this.movementBiome==='function'?this.movementBiome(p,input):null;
      p.stamina=clamp(p.stamina+(sprint?-c.staminaDrain:(biome?.staminaDelta??c.staminaRegen))*dt,0,100);
      if(biome?.hungerExtra&&!p.spirit)p.hunger=Math.max(0,p.hunger-biome.hungerExtra*dt);
      if(moving){const speed=(p.hunger<c.slowBelow&&!p.spirit?c.slowSpeed:c.speed)*(sprint?c.sprintMultiplier:1)*landscapeSpeed(this,p)*(biome?.speed??1);const nx=p.x+input.dx*speed*dt,ny=p.y+input.dy*speed*dt;
        if(this.walkable(nx,p.y,p))p.x=nx;if(this.walkable(p.x,ny,p))p.y=ny;p.job=null;this.dirty=true;
      }
      if(p.job&&this.now>=p.job.ends)this.finish(p);
    }
  }
  snapshot(p){syncEquipment(p,this.c);const s=this.state,c=this.c;return {plaza:plazaSnapshot(this,p),...lifeSnapshot(this,p),mayorLevel:s.mayorLevel||1,technologies:s.technologies||{},phoneResearch:s.phoneResearch||{startedAt:0,endsAt:0,completedAt:0},now:this.now,revision:s.revision,worldId:s.worldId,me:p.id,config:{...c,capacity:bagCapacity(p,c,this.now)},treasury:s.treasury,citySolids:this.rects(),landscape:s.landscape,landscapeShop:LANDSCAPE_SHOP,landscapeProducts:LANDSCAPE_PRODUCTS,treeSpecies:TREE_SPECIES,project:s.project,forge:s.forge,seedMarket:s.seedMarket,gardenProject:s.gardenProject,publicGarden:s.publicGarden,materials:cityMaterialReport(this),materialEvents:s.materialEvents.slice(-30),bridge:{...s.bridge,reserved:{wood:this.committed('wood',false,'bridge'),stone:this.committed('stone',false,'bridge')}},plots:s.plots.map(({home,...plot})=>({...plot,homeVisual:{tent:home?.tent||0,beds:home?.beds?.length||0,crops:home?.beds?.filter(b=>b.crop).length||0},publicAccess:!!plot.owner&&(!plot.lease||plot.lease.dueAt>this.now)&&(plot.landUse==='business'||!!home?.open)})),startingCity:!!s.startingCity,municipalBuildings:s.municipalBuildings,municipalSites:municipalBuildingView(s),mayorMail:s.mayorMail.filter(t=>t.player===p.id).slice(-10).map(t=>({id:t.id,text:t.text,at:t.at,reward:t.reward})),resources:s.resources,
    warehouse:{...s.warehouse,free:{wood:this.warehouseFree('wood'),stone:this.warehouseFree('stone')},funds:this.cityFunds()},courierOffers:['mayor','bridge'].flatMap(destination=>['wood','stone'].map(k=>this.courierOffer(k,destination))).filter(Boolean),drops:s.drops.filter(d=>(d.scene||'city')===scene(p)&&(scene(p)==='city'||d.plotId===p.plotId)),
    players:Object.values(s.players).filter(o=>o.id===p.id||this.online.has(o.id)||s.plots.some(x=>x.owner===o.id)).map(o=>({id:o.id,name:o.name,gender:o.gender||'unspecified',x:o.x,y:o.y,scene:scene(o),plotId:o.plotId||null,color:o.color,online:this.online.has(o.id),spirit:o.spirit,...(o.id===p.id?{wallet:o.wallet,bag:o.bag,toolItems:o.toolItems,activeTools:o.activeTools,tools:o.tools,toolInfo:o.toolInfo,equipped:o.equipped,hunger:o.hunger,health:o.health,stamina:o.stamina,job:o.job,gardenTools:o.gardenTools,terrainBag:o.terrainBag,activeGameMs:o.activeGameMs||0,mayorFeedback:{lastRewardAt:o.mayorFeedback?.lastRewardAt||0},delivery:o.delivery||null}: {})})),
    chat:s.chat.filter(m=>this.now-m.at<600000&&(m.scene||'city')===scene(p)&&(scene(p)==='city'||m.plotId===p.plotId)&&distance(p,m)<=c.chatRange).slice(-15)};
  }
}
