// Valentin Losev's two backpack courses: first immediate; second 300 PAPER and real 48h.
export const UNIVERSITY={fastSlots:15,advancedSlots:15,advancedPrice:300,advancedDurationMs:172800000};
export function bagCapacity(p,c,now=Date.now()){
 const course=p?.losevCourses||{};
 return c.capacity+(course.fast?UNIVERSITY.fastSlots:0)+(course.advancedEndsAt&&now>=course.advancedEndsAt?UNIVERSITY.advancedSlots:0);
}
export function losevView(p,now=Date.now()){
 const c=p.losevCourses||{};
 return {fast:!!c.fast,advancedPurchased:!!c.advancedEndsAt,advancedEndsAt:c.advancedEndsAt||0,
   advancedCompleted:!!c.advancedEndsAt&&now>=c.advancedEndsAt,price:UNIVERSITY.advancedPrice,
   durationMs:UNIVERSITY.advancedDurationMs,quickSlots:UNIVERSITY.fastSlots,advancedSlots:UNIVERSITY.advancedSlots};
}
export function losevAction(g,p,cmd){
 if(!['losevFast','losevAdvanced'].includes(cmd?.type))return null;
 if((p.scene||'city')!=='city'||p.spirit||p.job||p.delivery?.picked)throw Error('Сначала закончи работу в городе');
 g.near(p,g.target('university-site'));
 p.losevCourses||={};
 if(cmd.type==='losevFast'){
  if(p.losevCourses.fast)throw Error('Ты уже прошёл вводный курс');
  p.losevCourses.fast=true;
  return {message:'Курс Валентина Лосева окончен · +15 мест в рюкзаке'};
 }
 if(!p.losevCourses.fast)throw Error('Сначала пройди быстрый курс');
 if(p.losevCourses.advancedEndsAt)throw Error('Продвинутый курс уже оплачен');
 if(p.wallet<UNIVERSITY.advancedPrice)throw Error('Продвинутый курс стоит 300 PAPER');
 p.wallet-=UNIVERSITY.advancedPrice;g.state.treasury+=UNIVERSITY.advancedPrice;
 p.losevCourses.advancedEndsAt=g.now+UNIVERSITY.advancedDurationMs;
 g.state.transactions.push({id:cmd.requestId,player:p.id,amount:-UNIVERSITY.advancedPrice,reason:'losev-backpack-advanced',time:g.now});
 return {message:'Начат продвинутый курс. Через 48 реальных часов откроется ещё +15 мест.'};
}
