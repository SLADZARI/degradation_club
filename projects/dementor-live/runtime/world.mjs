import { randomUUID } from 'node:crypto';
import {syncEquipment,addTool,equipmentAction} from './equipment.mjs';
import {initPlaza,plazaAction,plazaSnapshot,PLAZA} from './plaza.mjs';
import { CONFIG } from './config.mjs';
import {ITEMS,migrateLife,lifeAction,lifeSnapshot,scene} from './life.mjs';

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
export const loadWeight = (p,c=CONFIG) => Object.entries(p.bag).reduce((n,[k,v])=>n+v*c.weights[k],0)+(p.delivery?.picked?p.delivery.quantity*c.weights[p.delivery.kind]:0);
export const projectBudget = c => c.need.wood*c.pay.wood+c.need.stone*c.pay.stone+c.stages.reduce((n,s)=>n+s.works*c.pay.work,0);
export function createWorld(c=CONFIG) {
  const resource=(id,type,x,y,stock)=>({id,type,x,y,stock,initial:stock,regrowAt:0});
  return { version:1, treasury:c.treasury, project:{stage:0,work:0,accepted:{wood:0,stone:0},stock:{wood:0,stone:0},consumed:{wood:0,stone:0},spent:0},
    players:{}, plots:[{id:'plot-1',x:4,y:15,w:6,h:6,owner:null},{id:'plot-2',x:4,y:23,w:6,h:6,owner:null},{id:'plot-3',x:14,y:23,w:6,h:6,owner:null}],
    resources:[resource('wood-1','wood',14,5,40),resource('wood-2','wood',21,5,40),resource('wood-3','wood',28,6,40),resource('wood-4','wood',30,20,40),resource('stone-1','stone',12,20,40),resource('stone-2','stone',27,11,40),resource('stone-3','stone',30,27,40),resource('stone-4','stone',2,27,40),resource('food-1','food',8,10,c.foodStock),resource('food-2','food',3,10,c.foodStock),resource('food-3','food',25,20,c.foodStock)],
    chat:[], transactions:[], revision:0 };
}
const supplyBridge=(project,kind,quantity)=>{project.accepted[kind]+=quantity;project.stock[kind]+=quantity;};
const newProject=()=>({stage:0,work:0,accepted:{wood:0,stone:0},stock:{wood:0,stone:0},consumed:{wood:0,stone:0},spent:0});
export class Game {
  constructor(state=createWorld(),c=CONFIG){ this.state=state;this.c=c;this.online=new Set();this.inputs=new Map();this.now=Date.now(); this.onChange=()=>{};this.dirty=false;
    state.forge ||= newProject();state.bridge ||= newProject();
    for(const [id,type,x,y,stock]of [['east-wood-1','wood',41,7,48],['east-wood-2','wood',44,10,48],['east-wood-3','wood',42,23,48],['east-wood-4','wood',45,26,48],['east-stone-1','stone',42,16,48],['east-stone-2','stone',45,20,48],['east-food','food',41,12,c.foodStock]])if(!state.resources.some(r=>r.id===id))state.resources.push({id,type,x,y,stock,initial:stock,regrowAt:0});
    state.warehouse ||= {stock:{wood:0,stone:0},municipal:{wood:0,stone:0},spent:0};
    state.drops ||= [];
    migrateLife(this);initPlaza(this);
    for(const p of Object.values(state.players)){p.job=null;p.results=p.results||[];p.lastMessage=0;p.toolInfo ||= {axe:{tier:'basic',max:c.toolDurability},pick:{tier:'basic',max:c.toolDurability}};syncEquipment(p,c);}
  }
  changed(){this.state.revision++;this.dirty=true;this.onChange();}
  join(name){
    name=String(name||'').trim().replace(/[<>\x00-\x1f]/g,'').slice(0,20);
    if(!name)throw Error('Как тебя зовут?');
    const id=randomUUID(),token=randomUUID();const p={id,token,name,x:8+(Object.keys(this.state.players).length%3)*0.8,y:8,color:Object.keys(this.state.players).length%3,wallet:0,bag:{wood:0,stone:0,food:0},tools:{axe:0,pick:0},equipped:'axe',hunger:100,health:100,stamina:100,spirit:false,job:null,results:[],lastMessage:0};
    p.toolInfo={axe:{tier:'basic',max:this.c.toolDurability},pick:{tier:'basic',max:this.c.toolDurability}};this.state.players[id]=p;migrateLife(this);this.changed();return p;
  }
  auth(token){return Object.values(this.state.players).find(p=>p.token===token);}
  connect(p){this.online.add(p.id);this.inputs.set(p.id,{dx:0,dy:0,sprint:false,at:this.now});this.changed();}
  disconnect(p){this.online.delete(p.id);this.inputs.delete(p.id);p.job=null;this.changed();}
  rects(){return [{x:4,y:4,w:4,h:3}];}
  walkable(x,y,p=null){if(p&&scene(p)!=='city'){if(x<.5||y<.5||x>15.5||y>15.5)return false;const h=scene(p)==='expedition'?this.state.expedition.home:this.state.plots.find(l=>l.id===p.plotId)?.home;if(['plot','expedition'].includes(scene(p))&&h?.nodes.some(n=>n.left>0&&Math.hypot(x-n.x,y-n.y)<.58))return false;return true;}const r=.3,c=this.c;if(x<r||y<r||x>c.width-r||y>c.height-r)return false;
    if(x+r>c.river.x&&x-r<c.river.x+c.river.w&&!(this.state.bridge.stage>=c.bridge.stages.length&&y-r>=c.bridge.y&&y+r<=c.bridge.y+c.bridge.h))return false;
    if(this.rects().some(o=>x+r>o.x&&x-r<o.x+o.w&&y+r>o.y&&y-r<o.y+o.h))return false;
    return !this.state.resources.some(o=>o.stock>0&&o.type!=='food'&&Math.hypot(x-o.x,y-o.y)<.58);
  }
  projectFor(target){return target?.startsWith('bridge-')?this.state.bridge:target?.startsWith('forge-')?this.state.forge:this.state.project;}
  deliveries(){return Object.values(this.state.players).filter(p=>p.delivery).map(p=>p.delivery);}
  committed(kind,pickedOnly=false,destination=null){return this.deliveries().filter(d=>d.kind===kind&&(!pickedOnly||d.picked)&&(!destination||(d.destination||'mayor')===destination)).reduce((n,d)=>n+d.quantity,0);}
  warehouseFree(kind){return Math.max(0,this.c.warehouse.capacity-this.state.warehouse.stock[kind]-this.committed(kind,true));}
  cityFunds(){
    // Keep unfinished construction funded before offering optional purchases and courier work.
    let reserved=this.deliveries().reduce((n,d)=>n+d.reward,0);
    for(const [p,c]of [[this.state.project,this.c],[this.state.forge,{...this.c,...this.c.forge}],[this.state.bridge,{...this.c,...this.c.bridge}]]){
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
      const n=Math.min(pile.quantity,Math.floor((c.capacity-loadWeight(p,c))/c.weights[pile.kind]));
      if(n<=0)throw Error('В рюкзаке нет места');p.bag[pile.kind]+=n;pile.quantity-=n;
      this.state.drops=this.state.drops.filter(d=>d.quantity>0);return {message:`Подобрано: ${n}`};
    }
    if(type==='warehouseSell'){
      this.near(p,this.target('warehouse'));if(!['wood','stone'].includes(kind))throw Error('Склад принимает древесину и камень');
      const price=c.warehouse.pay[kind],n=Math.min(p.bag[kind],this.warehouseFree(kind),Math.floor(this.cityFunds()/price));
      if(n<=0)throw Error(!p.bag[kind]?'В рюкзаке нет этого материала':!this.warehouseFree(kind)?'Склад заполнен этим материалом':'Свободный бюджет приёмки исчерпан');
      p.bag[kind]-=n;w.stock[kind]+=n;this.transfer(p,n*price,'warehouse');w.spent+=n*price;
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
      if(loadWeight(p,c)+d.quantity*c.weights[d.kind]>c.capacity)throw Error('Освободи место для городского груза');
      if(w.stock[d.kind]<d.quantity)throw Error('На складе нет зарезервированного груза');
      w.stock[d.kind]-=d.quantity;d.picked=true;return {message:d.destination==='bridge'?'Груз получен. Отнеси его на стройку моста.':'Городской груз в рюкзаке. Отнеси его в мэрию.'};
    }
    if(type==='courierDeliver'){
      this.near(p,this.target(d.destination==='bridge'?'bridge-drop':'mayor'));if(!d.picked)throw Error('Сначала забери груз на складе');
      this.transfer(p,d.reward,'courier');if(d.destination==='bridge'){supplyBridge(this.state.bridge,d.kind,d.quantity);this.state.bridge.spent+=d.reward;}else w.municipal[d.kind]+=d.quantity;w.spent+=d.reward;p.delivery=null;
      return {message:`Доставка принята · +${d.reward} PAPER`,reward:d.reward};
    }
    if(d.picked){this.near(p,this.target('warehouse'));w.stock[d.kind]+=d.quantity;}
    p.delivery=null;return {message:'Заказ отменён. Городской груз остаётся на складе.'};
  }
  configFor(target){return target?.startsWith('bridge-')?{...this.c,...this.c.bridge}:target?.startsWith('forge-')?{...this.c,...this.c.forge}:this.c;}
  target(id){if(id==='frontier-gate')return this.c.expedition.gate;const po=PLAZA.objects.find(o=>o.id===id);if(po)return po;const s=this.state;if(id==='bridge-drop')return {id,x:32.5,y:12.3,type:'project'};if(id==='bridge-build')return {id,x:32,y:13.5,type:'build'};if(id==='east-bank')return {id,x:40,y:13.5,type:'explore'};if(id==='forge-drop')return {id,x:24.5,y:24,type:'project'};if(id==='forge-build')return {id,x:27,y:26,type:'build'};if(id==='tools')return {id,x:9,y:6,type:'tools'};if(id==='project')return {id,x:15,y:11,type:'project'};if(id==='build')return {id,x:18,y:14,type:'build'};
    if(id==='forge-use')return {id,type:'forge',x:27,y:29.5};if(id==='tool-shop')return {id,type:'shop',x:24,y:3};
    if(id==='warehouse')return {id,type:'warehouse',x:12,y:24};if(id==='board')return {id,type:'board',x:3.2,y:8};if(id==='mayor')return {id,type:'mayor',x:9,y:3};
    const pile=s.drops.find(d=>d.id===id);if(pile)return pile;
    const r=s.resources.find(x=>x.id===id);if(r)return r;const plot=s.plots.find(x=>x.id===id);if(plot)return {...plot,type:'plot',x:plot.x+plot.w/2,y:plot.y-1};return null;
  }
  near(p,target){if(!target||distance(p,target)>this.c.actionRange)throw Error('Подойди ближе к объекту');}
  transfer(p,amount,reason){if(!Number.isInteger(amount)||amount<0||this.state.treasury<amount)throw Error('Городской резерв исчерпан');this.state.treasury-=amount;p.wallet+=amount;this.state.transactions.push({id:randomUUID(),player:p.id,amount,reason,time:this.now});}
  input(p,{dx,dy,sprint}){if(!Number.isFinite(dx)||!Number.isFinite(dy))throw Error('Некорректное движение');const len=Math.hypot(dx,dy);this.inputs.set(p.id,{dx:len?dx/Math.max(1,len):0,dy:len?dy/Math.max(1,len):0,sprint:!!sprint,at:this.now});}
  command(p,cmd){
    if(!cmd||typeof cmd.requestId!=='string'||cmd.requestId.length<4||cmd.requestId.length>100)throw Error('Нет идентификатора действия');
    const done=p.results.find(r=>r.id===cmd.requestId);if(done)return done.result;
    let result;
    syncEquipment(p,this.c);try{result={ok:true,...this.action(p,cmd)};}catch(e){result={ok:false,message:e.message};}syncEquipment(p,this.c);
    p.results.push({id:cmd.requestId,result});p.results=p.results.slice(-128);this.changed();return result;
  }
  action(p,cmd){const {type,target}=cmd,c=this.configFor(target),s=this.state,project=this.projectFor(target);
    const publicResult=plazaAction(this,p,cmd);if(publicResult)return publicResult;
    const equipmentResult=equipmentAction(p,cmd,this.c);if(equipmentResult)return equipmentResult;
    const livingResult=lifeAction(this,p,cmd);if(livingResult)return livingResult;
    if(scene(p)!=='city'&&!['chat','eat','give','equip','cancel','drop','pickup'].includes(type))throw Error('Это действие доступно в городе');
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
      if(p.spirit){t.stock--;if(!t.regrowAt)t.regrowAt=this.now+c.berryRegrowMs;this.restore(p);return {message:'Ягоды вернули тебе тело'};}
      if(loadWeight(p,c)+c.weights.food>c.capacity)throw Error('Рюкзак полон — съешь еду или сдай материалы');
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
      addTool(p,tool,spec.durability,craft?'crafted':'premium',c);return {message:`${craft?'Изготовлен':'Куплен'} ${tool==='axe'?'топор':'кирка'} · прочность ${spec.durability}`};
    }
    if(type==='tools'){if(t.type!=='tools')throw Error('Инструменты выдаёт мэрия');syncEquipment(p,c);const missing=['axe','pick'].filter(k=>!p.tools[k]).length;if(p.toolItems.length+missing>12)throw Error('Освободи место для инструментов');for(const tool of ['axe','pick']){if(!p.tools[tool])addTool(p,tool,c.toolDurability,'basic',c);else if(p.toolInfo[tool].max<=c.toolDurability){p.tools[tool]=c.toolDurability;p.toolInfo[tool]={tier:'basic',max:c.toolDurability};}}return {message:'Стартовые инструменты выданы. Улучшенные сохранены без бесплатного ремонта.'};}
    if(type==='mine'){
      if(!['wood','stone'].includes(t.type))throw Error('Здесь нечего добывать');if(t.stock<=0)throw Error('Этот запас исчерпан');const tool=t.type==='wood'?'axe':'pick';if(p.equipped!==tool)throw Error(tool==='axe'?'Выбери топор — клавиша 1':'Выбери кирку — клавиша 2');if(p.tools[tool]<=0)throw Error('Инструмент сломан — возьми замену в мэрии');
      if(loadWeight(p,c)+c.weights[t.type]>c.capacity)throw Error('Рюкзак полон — отнеси материалы на площадь');return this.start(p,'mine',target,c.mineMs);
    }
    if(target?.startsWith('forge-')&&s.project.stage<this.c.stages.length)throw Error('Сначала завершите городскую площадь');
    if(target?.startsWith('bridge-')&&s.forge.stage<this.c.forge.stages.length)throw Error('Сначала завершите общественную кузницу');
    if(type==='deliver'){
      if(t.type!=='project')throw Error('Материалы принимает площадка');let reward=0,count=0;
      for(const k of ['wood','stone']){let n=Math.min(p.bag[k],Math.max(0,c.need[k]-project.accepted[k]-(target==='bridge-drop'?this.committed(k,false,'bridge'):0)));if(n>0){reward+=n*c.pay[k];count+=n;}}
      if(!count)throw Error('Нет нужных материалов: проверь потребность площади');if(s.treasury<reward)throw Error('Нет обеспеченного городского резерва');
      for(const k of ['wood','stone']){const n=Math.min(p.bag[k],Math.max(0,c.need[k]-project.accepted[k]-(target==='bridge-drop'?this.committed(k,false,'bridge'):0)));p.bag[k]-=n;project.accepted[k]+=n;project.stock[k]+=n;}
      this.transfer(p,reward,'materials');project.spent+=reward;return {message:`Принято ${count} · +${reward} PAPER`,reward};
    }
    if(type==='build'){
      if(t.type!=='build')throw Error('Подойди к месту строительных работ');this.canBuild(target);if(s.treasury<c.pay.work)throw Error('Нет резерва оплаты');return this.start(p,'build',target,c.buildMs);
    }
    if(type==='buy'){
      if(t.type!=='plot')throw Error('Это не участок');const plot=s.plots.find(x=>x.id===target);if(plot.locked)throw Error('Завершите миссию расчистки, чтобы открыть этот участок');if(plot.owner)throw Error('Участок уже куплен');if(s.plots.some(x=>x.owner===p.id))throw Error('В первой сцене можно купить один участок');if(p.wallet<c.plotPrice)throw Error(`Участок стоит ${c.plotPrice} PAPER`);
      p.wallet-=c.plotPrice;s.treasury+=c.plotPrice;plot.owner=p.id;s.transactions.push({id:randomUUID(),player:p.id,amount:-c.plotPrice,reason:'plot',time:this.now});return {message:'Твоё место в городе. Участок куплен!'};
    }
    throw Error('Неизвестное действие');
  }
  restore(p){p.spirit=false;p.hunger=clamp(p.hunger+this.c.foodRestore,0,100);p.health=100;p.stamina=100;}
  canBuild(target){const p=this.projectFor(target),stage=this.configFor(target).stages[p.stage];if(!stage)throw Error('Стройка завершена');if(p.stock.wood<stage.wood||p.stock.stone<stage.stone)throw Error('Сначала доставьте материалы для этого этапа');}
  start(p,kind,target,ms){if(p.job)throw Error('Дождись текущего действия');p.job={kind,target,started:this.now,ends:this.now+ms,stage:this.projectFor(target).stage};return {message:kind==='build'?'Работаем…':kind==='mine'?'Добываем…':'Собираем…',started:true};}
  finish(p){const job=p.job;p.job=null;const t=this.target(job.target);try{this.near(p,t);
    if(job.kind==='gather'){
      if(t.stock<=0||loadWeight(p,this.c)+1>this.c.capacity)return;t.stock--;p.bag.food++;if(!t.regrowAt)t.regrowAt=this.now+this.c.berryRegrowMs;
    }else if(job.kind==='mine'){
      const tool=t.type==='wood'?'axe':'pick';if(p.spirit||t.stock<=0||p.tools[tool]<=0||p.equipped!==tool||loadWeight(p,this.c)+this.c.weights[t.type]>this.c.capacity)return;
      t.stock--;p.bag[t.type]++;p.tools[tool]--;
    }else if(job.kind==='build'){
      if(p.spirit||job.stage!==this.projectFor(job.target).stage)return;this.canBuild(job.target);const project=this.projectFor(job.target),stage=this.configFor(job.target).stages[project.stage];this.transfer(p,this.c.pay.work,'work');project.spent+=this.c.pay.work;project.work++;
      if(project.work>=stage.works){for(const k of ['wood','stone']){project.stock[k]-=stage[k];project.consumed[k]+=stage[k];}project.stage++;project.work=0;}
    }
    this.changed();
    }catch{ /* Another player may complete the same final unit first; no payment is made. */ }
  }
  tick(ms){this.now+=ms;for(const t of this.state.trades)if(t.status==='offered'&&t.expires<=this.now){t.status='expired';this.changed();}const dt=ms/1000,c=this.c;
    for(const p of Object.values(this.state.players))if(p.delivery&&!p.delivery.picked&&p.delivery.expiresAt<=this.now){p.delivery=null;this.changed();}
    for(const r of this.state.resources)if(r.type==='food'&&r.regrowAt&&this.now>=r.regrowAt){r.stock=Math.min(c.foodStock,r.stock+1);r.regrowAt=r.stock<c.foodStock?this.now+c.berryRegrowMs:0;this.changed();}
    for(const id of this.online){const p=this.state.players[id];if(!p)continue;
      this.dirty=true;
      if(!p.spirit){p.hunger=Math.max(0,p.hunger-c.hungerPerSecond*dt);if(p.hunger===0){p.spirit=true;p.health=0;p.job=null;p.x=8;p.y=8;p.scene='city';p.plotId=null;p.stamina=100;this.inputs.set(p.id,{dx:0,dy:0,sprint:false,at:this.now});this.changed();}}
      const input=this.inputs.get(id);let moving=input&&this.now-input.at<400&&Math.hypot(input.dx,input.dy)>0;
      const sprint=moving&&input.sprint&&!p.spirit&&p.stamina>5&&p.hunger>=c.slowBelow;
      p.stamina=clamp(p.stamina+(sprint?-c.staminaDrain:c.staminaRegen)*dt,0,100);
      if(moving){const speed=(p.hunger<c.slowBelow&&!p.spirit?c.slowSpeed:c.speed)*(sprint?c.sprintMultiplier:1);const nx=p.x+input.dx*speed*dt,ny=p.y+input.dy*speed*dt;
        if(this.walkable(nx,p.y,p))p.x=nx;if(this.walkable(p.x,ny,p))p.y=ny;p.job=null;this.dirty=true;
      }
      if(p.job&&this.now>=p.job.ends)this.finish(p);
    }
  }
  snapshot(p){syncEquipment(p,this.c);const s=this.state,c=this.c;return {plaza:plazaSnapshot(this,p),...lifeSnapshot(this,p),now:this.now,revision:s.revision,me:p.id,config:c,treasury:s.treasury,project:s.project,forge:s.forge,bridge:{...s.bridge,reserved:{wood:this.committed('wood',false,'bridge'),stone:this.committed('stone',false,'bridge')}},plots:s.plots.map(({home,...plot})=>plot),resources:s.resources,
    warehouse:{...s.warehouse,free:{wood:this.warehouseFree('wood'),stone:this.warehouseFree('stone')},funds:this.cityFunds()},courierOffers:['mayor','bridge'].flatMap(destination=>['wood','stone'].map(k=>this.courierOffer(k,destination))).filter(Boolean),drops:s.drops.filter(d=>(d.scene||'city')===scene(p)&&(scene(p)==='city'||d.plotId===p.plotId)),
    players:Object.values(s.players).filter(o=>o.id===p.id||this.online.has(o.id)||s.plots.some(x=>x.owner===o.id)).map(o=>({id:o.id,name:o.name,x:o.x,y:o.y,scene:scene(o),plotId:o.plotId||null,color:o.color,online:this.online.has(o.id),spirit:o.spirit,...(o.id===p.id?{wallet:o.wallet,bag:o.bag,toolItems:o.toolItems,activeTools:o.activeTools,tools:o.tools,toolInfo:o.toolInfo,equipped:o.equipped,hunger:o.hunger,health:o.health,stamina:o.stamina,job:o.job,delivery:o.delivery||null}: {})})),
    chat:s.chat.filter(m=>this.now-m.at<600000&&(m.scene||'city')===scene(p)&&(scene(p)==='city'||m.plotId===p.plotId)&&distance(p,m)<=c.chatRange).slice(-15)};
  }
}
