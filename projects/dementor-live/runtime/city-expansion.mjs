import {randomUUID} from 'node:crypto';
import {LIFE} from './life.mjs';

export const CITY_BUILDINGS={
  'seed-shop-drop':{id:'seed-shop-drop',type:'project',x:22,y:9},
  'seed-shop-build':{id:'seed-shop-build',type:'build',x:23,y:7},
  'seed-shop':{id:'seed-shop',type:'seed-market',x:23,y:7},
  'public-garden-drop':{id:'public-garden-drop',type:'project',x:26,y:9},
  'public-garden-build':{id:'public-garden-build',type:'build',x:28,y:9},
  'public-garden':{id:'public-garden',type:'city-garden',x:28,y:9},
  'city-registry':{id:'city-registry',type:'city-registry',x:19,y:6}
};
export const newConstruction=()=>({stage:0,work:0,accepted:{wood:0,stone:0},stock:{wood:0,stone:0},consumed:{wood:0,stone:0},spent:0});
export function initialiseCityExpansion(g){
  const s=g.state;
  s.seedMarket ||=newConstruction();
  s.gardenProject ||=newConstruction();
  s.publicGarden ||= {beds:[0,1,2].map(i=>({id:'public-bed-'+i,crop:null,watered:false,readyAt:0})),harvests:0};
  s.publicGarden.waterSource ||= {left:20,at:g.now};
  s.materialEvents ||= [];
  s.materialEmbodied ||= {wood:0,stone:0};
}
export function recordMaterial(g,reason,kind,quantity,from,to,actor=null){
  if(!['wood','stone'].includes(kind)||!Number.isSafeInteger(quantity)||quantity<0)throw Error('Некорректная материальная операция');
  // Movement history is bounded for browser delivery. The authoritative balance is held in the source/target stocks.
  g.state.materialEvents.push({id:randomUUID(),time:g.now,reason,kind,quantity,from,to,actor});
  g.state.materialEvents=g.state.materialEvents.slice(-300);
}
const kinds=['wood','stone'];
const quantities=()=>({wood:0,stone:0});
function add(to,source){for(const k of kinds)to[k]+=source?.[k]||0;}
export function cityMaterialReport(g){
  const s=g.state,result={};
  for(const kind of kinds){
    const source=s.resources.filter(x=>x.type===kind).reduce((n,x)=>n+x.stock,0);
    const field=Object.values(s.plots).flatMap(p=>p.home?.nodes||[]).concat(s.expedition?.home?.nodes||[]).filter(n=>n.kind===kind).reduce((n,x)=>n+x.left,0)
      +(kind==='wood'?s.plots.flatMap(p=>p.home?.plantedTrees||[]).filter(t=>t.wateredAt&&g.now-t.wateredAt>=360000).reduce((n,t)=>n+t.stock,0):0);
    const inventory=Object.values(s.players).reduce((n,p)=>n+(p.bag?.[kind]||0),0);
    const chests=s.plots.reduce((n,p)=>n+(p.home?.chest?.[kind]||0),0);
    const ground=s.drops.filter(x=>x.kind===kind).reduce((n,x)=>n+x.quantity,0);
    const projects=[s.project,s.forge,s.bridge,s.seedMarket,s.gardenProject];
    const inBuildings=projects.reduce((n,p)=>n+(p?.consumed?.[kind]||0),0);
    const awaitingConstruction=projects.reduce((n,p)=>n+(p?.stock?.[kind]||0),0);
    const warehouse=s.warehouse.stock[kind],municipal=s.warehouse.municipal[kind];
    const transit=Object.values(s.players).reduce((n,p)=>n+(p.delivery?.picked&&p.delivery.kind===kind?p.delivery.quantity:0),0);
    const privateStructures=s.plots.reduce((n,p)=>n+(p.home?.materialEmbodied?.[kind]||0),0);
    const crafted=Object.values(s.players).flatMap(p=>p.toolItems||[]).reduce((n,t)=>n+(t.ingredients?.[kind]||0),0);
    const scrap=s.materialScrap?.[kind]||0;
    const covered=source+field+inventory+chests+ground+inBuildings+awaitingConstruction+warehouse+municipal+transit+privateStructures+crafted+scrap;
    result[kind]={inNature:source+field,inBags:inventory,inChests:chests,onGround:ground,onWarehouse:warehouse,inMunicipal:municipal,inTransit:transit,onConstruction:awaitingConstruction,inStructures:inBuildings+privateStructures,inTools:crafted,inScrap:scrap,total:covered};
  }
  return result;
}
export function cityExpansionAction(g,p,cmd){
  const s=g.state,c=g.c,market=s.seedMarket,garden=s.gardenProject;
  if(['publicSow','publicWater','publicHarvest','publicDrawWater'].includes(cmd.type)){
    if((p.scene||'city')!=='city')throw Error('Вернись в город');
    if(garden.stage<c.cityGarden.stages.length)throw Error('Городской огород ещё строится');
    if(p.spirit||p.job)throw Error('Сначала восстанови силы');
    g.near(p,CITY_BUILDINGS['public-garden']);
    if(cmd.type==='publicDrawWater'){
      const spring=s.publicGarden.waterSource,elapsed=Math.max(0,Math.floor((g.now-spring.at)/60000));
      if(elapsed){spring.left=Math.min(20,spring.left+elapsed);spring.at+=elapsed*60000;}
      if(p.bag.water>=4)throw Error('Можно носить не более 4 л воды');
      if(Object.entries(p.bag).reduce((sum,[k,v])=>sum+v*c.weights[k],0)+c.weights.water>c.capacity)throw Error('Нет места в рюкзаке');
      if(spring.left<1)throw Error('Городской источник пополняется: 1 л/мин');
      spring.left--;p.bag.water++;
      return {message:'Получен 1 л воды из городского источника'};
    }
    const bed=s.publicGarden.beds.find(b=>b.id===cmd.target);if(!bed)throw Error('Нет такой грядки');
    if(cmd.type==='publicSow'){
      if(bed.crop)throw Error('Грядка уже занята');
      const crop=LIFE.crops[cmd.crop];if(!crop)throw Error('Неизвестная культура');
      if(!p.bag[crop.seed])throw Error('Купи или собери семена');
      p.bag[crop.seed]--;Object.assign(bed,{crop:cmd.crop,watered:false,readyAt:0});
      return {message:'Семя посажено в городском огороде'};
    }
    if(cmd.type==='publicWater'){
      if(!bed.crop||bed.watered)throw Error('Грядка не нуждается в поливе');
      const count=LIFE.crops[bed.crop].water;if(p.bag.water<count)throw Error('Для полива нужна вода из колодца');
      p.bag.water-=count;bed.watered=true;bed.readyAt=g.now+LIFE.crops[bed.crop].duration;
      return {message:'Городская грядка полита'};
    }
    if(!bed.crop||!bed.watered||bed.readyAt>g.now)throw Error('Урожай ещё не созрел');
    const crop=LIFE.crops[bed.crop],kind=bed.crop,n=crop.yield;
    if(Object.entries(p.bag).reduce((sum,[k,v])=>sum+v*c.weights[k],0)+n*c.weights[kind]>c.capacity)throw Error('Рюкзак полон');
    p.bag[kind]+=n;s.publicGarden.harvests++;
    Object.assign(bed,{crop:null,watered:false,readyAt:0});
    return {message:'Урожай собран; городская грядка свободна'};
  }
  return null;
}
