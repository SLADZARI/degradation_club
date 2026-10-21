import {bagCapacity} from './losev-courses.mjs';
// CIVIC Forestry v1 — five seeds, reusable soil, shovel, water and three timed stages.
import {randomUUID} from 'node:crypto';
import {recordMaterial} from './city-expansion.mjs';
export const TREE_SPECIES=Object.freeze({
 seed_tree_broadleaf:{name:'Лиственное',variant:0},
 seed_tree_round:{name:'Круглокронное',variant:1},
 seed_tree_oak:{name:'Дуб',variant:2},
 seed_tree_spruce:{name:'Ель',variant:3},
 seed_tree_small:{name:'Маленькое дерево',variant:4}
});
export const FORESTRY={maxSoil:6,shovelPrice:5,shovelUses:24,water:2,firstStageMs:180000,matureMs:360000,wood:8};
const scene=p=>p.scene||'city';
export const growthStage=(now,t)=>!t.wateredAt?1:now-t.wateredAt>=FORESTRY.matureMs?3:now-t.wateredAt>=FORESTRY.firstStageMs?2:1;
export function initForestry(g){for(const p of Object.values(g.state.players))p.gardenTools||={shovel:0};for(const plot of g.state.plots||[]){if(!plot.home)continue;plot.home.soil||=[];plot.home.plantedTrees||=[];}}
function own(g,p){const plot=g.state.plots.find(t=>t.id===p.plotId);if(scene(p)!=='plot'||!plot||plot.owner!==p.id)throw Error('Посадка доступна хозяину личного участка');return plot;}
function available(h,x,y){if(x<1.6||x>14.3||y<1.6||y>13.6)return false;if(x>4.6&&x<11.4&&y>3.8&&y<8.9)return false;if(Math.hypot(x-14,y-3)<1.5||Math.hypot(x-7,y-11)<.65)return false;if(h.nodes.some(n=>(n.left>0||n.kind==='food')&&Math.hypot(x-n.x,y-n.y)<1.35))return false;if(h.beds.some(b=>Math.hypot(x-b.x,y-b.y)<1.4))return false;if(h.soil.some(t=>Math.hypot(x-t.x,y-t.y)<1.4))return false;return true;}
export function forestryAction(g,p,cmd){
 if(!['buyShovel','homeDig','homeSowTree','homeSowBerry','homeWaterTree','homeFellTree'].includes(cmd?.type))return null;
 if(cmd.type==='buyShovel'){
  if(scene(p)!=='city'||g.state.seedMarket.stage<g.c.seedMarket.stages.length)throw Error('Лопата продаётся в построенной семенной лавке');
  g.near(p,g.target('seed-shop'));if(p.spirit||p.job)throw Error('Заверши текущую работу');
  p.gardenTools||={shovel:0};if(p.gardenTools.shovel>0)throw Error('Исправная лопата уже есть');
  if(p.wallet<FORESTRY.shovelPrice)throw Error('Не хватает PAPER');
  p.wallet-=FORESTRY.shovelPrice;g.state.treasury+=FORESTRY.shovelPrice;p.gardenTools.shovel=FORESTRY.shovelUses;
  g.state.transactions.push({id:cmd.requestId,player:p.id,amount:-FORESTRY.shovelPrice,reason:'shovel',time:g.now});
  return {message:'Лопата куплена · 24 вскапывания'};
 }
 if(p.spirit||p.job||p.delivery?.picked)throw Error('Сначала закончи работу');
 const plot=own(g,p),h=plot.home;
 if(cmd.type==='homeDig'){
  g.near(p,{x:7,y:11});if(!p.gardenTools?.shovel)throw Error('Сначала купи лопату');
  if(h.soil.length>=FORESTRY.maxSoil)throw Error('Места для посадки закончились');
  const x=Math.round(p.x*2)/2,y=Math.round(p.y*2)/2;
  if(!available(h,x,y))throw Error('Рядом препятствие. Найди свободную землю у огорода');
  p.gardenTools.shovel--;h.soil.push({id:plot.id+'-soil-'+randomUUID().slice(0,8),x,y});
  return {message:'Земля вскопана. Теперь выбери семена'};
 }
 const soil=h.soil.find(t=>t.id===cmd.target),tree=h.plantedTrees.find(t=>t.id===cmd.target),target=soil||tree;
 if(!target)throw Error('Место посадки не найдено');g.near(p,target);
 if(cmd.type==='homeSowBerry'){
  if(!soil||h.plantedTrees.some(t=>t.soilId===soil.id))throw Error('Нужно свободное вскопанное место');
  if(!p.bag.food)throw Error('Нужна ягода для посадки куста');
  if(h.nodes.some(n=>Math.hypot(n.x-soil.x,n.y-soil.y)<1.2))throw Error('Рядом уже растёт куст');
  p.bag.food--;h.soil=h.soil.filter(t=>t.id!==soil.id);h.nodes.push({id:plot.id+'-berry-'+randomUUID().slice(0,8),kind:'food',x:soil.x,y:soil.y,left:6,initial:6,planted:true});
  return {message:'Ягодный куст посажен. Он будет отрастать снова'};
 }
 if(cmd.type==='homeSowTree'){
  if(!soil||h.plantedTrees.some(t=>t.soilId===soil.id))throw Error('Место уже занято');
  if(!Object.hasOwn(TREE_SPECIES,cmd.kind)||!p.bag[cmd.kind])throw Error('Нужны семена выбранного дерева');
  p.bag[cmd.kind]--;h.plantedTrees.push({id:plot.id+'-tree-'+randomUUID().slice(0,8),soilId:soil.id,x:soil.x,y:soil.y,kind:cmd.kind,plantedAt:g.now,wateredAt:0,stock:FORESTRY.wood});
  return {message:'Посажено. Полей саженец двумя литрами воды'};
 }
 if(cmd.type==='homeWaterTree'){
  if(!tree||tree.wateredAt)throw Error('Дерево уже полито');
  if(p.bag.water<FORESTRY.water)throw Error('Для дерева нужно 2 л воды');
  p.bag.water-=FORESTRY.water;tree.wateredAt=g.now;
  return {message:'Полито. Дерево растёт три стадии'};
 }
 if(!tree||growthStage(g.now,tree)<3||tree.stock<1)throw Error('Дерево ещё не выросло');
 if(p.equipped!=='axe'||!p.tools.axe)throw Error('Нужен исправный топор');
 const load=Object.entries(p.bag).reduce((n,[k,v])=>n+v*(g.c.weights[k]||0),0);
 if(load+1>bagCapacity(p,g.c,g.now))throw Error('Нет места в рюкзаке');
 tree.stock--;p.bag.wood++;p.tools.axe--;
 recordMaterial(g,'grown-tree-wood','wood',1,tree.id,'bag',p.id);
 if(!tree.stock)h.plantedTrees=h.plantedTrees.filter(t=>t.id!==tree.id);
 return {message:tree.stock?'Древесина +1 · осталось '+tree.stock:'Древесина +1. Дерево полностью исчезло'};
}
