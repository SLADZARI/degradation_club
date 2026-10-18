import {randomUUID} from 'node:crypto';
export function syncEquipment(p,c){
 p.toolItems ||= [];p.activeTools ||= {};
 for(const kind of ['axe','pick']){
  let item=p.toolItems.find(t=>t.id===p.activeTools[kind]&&t.kind===kind);
  if(!item&&p.tools[kind]>0){item={id:randomUUID(),kind,durability:p.tools[kind],...p.toolInfo[kind]};p.toolItems.push(item);p.activeTools[kind]=item.id;}
  if(item){item.durability=p.tools[kind];Object.assign(item,p.toolInfo[kind]);}
 }
}
export function addTool(p,kind,durability,tier,c){
 syncEquipment(p,c);if(p.toolItems.length>=12)throw Error('В рюкзаке уже 12 инструментов. Удали сломанный или лишний.');
 const item={id:randomUUID(),kind,durability,max:durability,tier};p.toolItems.push(item);
 if(p.tools[kind]<=0||p.toolInfo[kind].max<=durability){p.activeTools[kind]=item.id;p.tools[kind]=durability;p.toolInfo[kind]={max:durability,tier};}
 return item;
}
export function equipmentAction(p,cmd,c){
 if(!['equipItem','discardTool'].includes(cmd.type))return null;syncEquipment(p,c);const item=p.toolItems.find(t=>t.id===cmd.target);if(!item)throw Error('Инструмента уже нет');if(p.job)throw Error('Сначала закончи работу');
 if(cmd.type==='equipItem'){if(item.durability<=0)throw Error('Этот инструмент сломан');p.activeTools[item.kind]=item.id;p.tools[item.kind]=item.durability;p.toolInfo[item.kind]={max:item.max,tier:item.tier};p.equipped=item.kind;return {message:'Инструмент выбран'};}
 p.toolItems=p.toolItems.filter(t=>t.id!==item.id);if(p.activeTools[item.kind]===item.id){delete p.activeTools[item.kind];p.tools[item.kind]=0;p.toolInfo[item.kind]={max:c.toolDurability,tier:'basic'};}return {message:'Инструмент удалён из рюкзака'};
}
