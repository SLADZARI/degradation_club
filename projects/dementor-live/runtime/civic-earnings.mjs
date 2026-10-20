// Small finite treasury-funded discoveries to make early land ownership reachable.
// One real payout per resident per task; never mint currency or repeat on reconnect.
export const CIVIC_JOBS=Object.freeze([
  {id:'first-board',target:'board',name:'Узнать, как город зарабатывает',reward:25},
  {id:'first-monument',target:'monument',name:'Побывать у первого памятника',reward:35},
  {id:'first-tourist',target:'tourist-kiosk',name:'Найти туристический киоск',reward:35}
]);
export function civicView(g,p){return CIVIC_JOBS.map(x=>({...x,claimed:!!p.civicCompleted?.[x.id]}));}
export function civicAction(g,p,cmd){
 if(cmd?.type!=='civicClaim')return null;
 if((p.scene||'city')!=='city'||p.spirit||p.job||p.delivery?.picked)throw Error('Нужно быть свободным жителем в городе');
 const entry=CIVIC_JOBS.find(x=>x.target===cmd.target&&x.id===cmd.jobId);
 if(!entry)throw Error('Нет такого поручения');
 p.civicCompleted||={};
 if(p.civicCompleted[entry.id])throw Error('Ты уже получил эту награду');
 g.near(p,g.target(entry.target));
 if(g.cityFunds()<entry.reward)throw Error('Казне пока нечем оплатить поручение');
 g.transfer(p,entry.reward,'civic-one-time-'+entry.id);
 p.civicCompleted[entry.id]=g.now;
 return {message:'Поручение выполнено! +'+entry.reward+' PAPER',reward:entry.reward};
}
