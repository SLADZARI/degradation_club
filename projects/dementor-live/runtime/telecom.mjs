// World-wide public numbers / city payphones / recipient-only pager inbox.
// Number is a public 6-digit routing ID, NEVER the authentication token.
import {randomUUID} from 'node:crypto';
import {municipalBuilt} from './municipal-buildings.mjs';
export const PAGER_PRICE=180;
export const PAGE_FEE=1;
export const PHONE_BOOTHS=Object.freeze([
 {id:'phone-square',type:'payphone',scene:'city',x:10,y:12,title:'Таксофон · городская площадь'},
 {id:'phone-tourist',type:'payphone',scene:'city',x:25,y:42,title:'Таксофон · туристическая улица'},
 {id:'phone-forest',type:'payphone',scene:'city',x:18,y:59,title:'Таксофон · у леса'},
 {id:'phone-mountain',type:'payphone',scene:'city',x:52,y:57,title:'Таксофон · у перевала'},
 {id:'phone-museum-outside',type:'payphone',scene:'city',x:94,y:59,title:'Таксофон · возле музея'},
 {id:'phone-farlands-outside',type:'payphone',scene:'city',x:139,y:58,title:'Таксофон · дальние земли'},
 {id:'phone-museum',type:'payphone',scene:'museum',x:3,y:11,title:'Таксофон · музей смеха'},
 {id:'phone-farlands',type:'payphone',scene:'farlands',x:4,y:16,title:'Таксофон · дальние земли'},
 {id:'phone-home',type:'payphone',scene:'plot',x:3,y:12,title:'Общий таксофон · участок'},
 {id:'phone-expedition',type:'payphone',scene:'expedition',x:3,y:12,title:'Таксофон · экспедиция'},
 {id:'phone-interior',type:'payphone',scene:'interior',x:3,y:6,title:'Таксофон · помещение'}
]);
export const boothsForScene=scene=>PHONE_BOOTHS.filter(b=>b.scene===(scene||'city'));
const NUMBER_START=410000;
const cleanText=text=>String(text||'').trim().replace(/[<>\x00-\x1f]/g,'').slice(0,100);
export function ensureTelephoneDirectory(network){
 network.data.telecom||={nextNumber:NUMBER_START};
 const seen=new Set();
 for(const g of network.values())for(const p of Object.values(g.state.players)){
  if(!/^\d{6}$/.test(String(p.pagerNumber||''))||seen.has(p.pagerNumber)){
   p.pagerNumber=String(network.data.telecom.nextNumber++);
   network.directoryDirty=true;g.changed();
  }
  seen.add(p.pagerNumber);p.pagerInbox||=[];p.pagerOwns||=false;p.pagerReceipts||={};p.pagerBlocked||=[];p.pagerListed??=false;
 }
}
export const NPC_NUMBERS=Object.freeze({museum:'500001',mayor:'500002'});
export function publicSubscriberList(network,viewer=null){
 ensureTelephoneDirectory(network);
 const people=[...network.values()].flatMap(g=>Object.values(g.state.players).filter(p=>p.pagerListed||p.id===viewer?.id).map(p=>({id:p.id,name:p.name,number:p.pagerNumber,hasPager:!!p.pagerOwns,kind:'resident'})));
const services=[{id:'npc-mayor',name:'Мэрия · поручения',number:NPC_NUMBERS.mayor,kind:'npc'},
 ...((viewer?.worldTravel?.visited||[]).includes('museum')?[{id:'npc-museum',name:'Музей смеха',number:NPC_NUMBERS.museum,kind:'npc'}]:[])];
return [...services,...people].sort((a,b)=>a.name.localeCompare(b.name,'ru')).slice(0,500);
}
export function telecomSnapshot(network,p){
 const game=network.findId(p.id)?.g;let booths=boothsForScene(p.scene);
 if(game?.state.startingCity)booths=game.state.expedition?.completedAt&&municipalBuilt(game.state,'phone-square')?booths.filter(b=>b.id==='phone-square'):[];
 return {number:p.pagerNumber,hasPager:!!p.pagerOwns,price:PAGER_PRICE,messageFee:PAGE_FEE,
  directory:publicSubscriberList(network,p),listed:!!p.pagerListed,blocked:p.pagerBlocked||[],
  inbox:p.pagerOwns?p.pagerInbox.slice(-80):[],
  unread:p.pagerOwns?p.pagerInbox.filter(m=>!m.readAt).length:0,
  booths};
}
export function telecomAction(network,p,cmd){
 if(!['pagerBuy','pagerSend','pagerRead','pagerBlock','pagerList','pagerDial'].includes(cmd?.type))return null;
 const r=network.findId(p.id),g=r?.g;if(!g)throw Error('Житель не найден');
 if(p.spirit||p.job||p.delivery?.picked)throw Error('Заверши работу перед звонком');
 const requestId=cmd.requestId;
 if(p.pagerReceipts?.[requestId])return p.pagerReceipts[requestId];
 let result;
 if(cmd.type==='pagerList'){
  p.pagerListed=!!cmd.listed;
  result={message:p.pagerListed?'Номер добавлен в общий справочник':'Номер скрыт из общего справочника'};
 }else if(cmd.type==='pagerBlock'){
  const number=String(cmd.number||'').trim();
  if(!/^\d{6}$/.test(number)||number===p.pagerNumber)throw Error('Выбери другой номер');
  const blocked=new Set(p.pagerBlocked||[]);
  if(cmd.blocked){if(blocked.size>=200)throw Error('Список блокировок заполнен');blocked.add(number);}
  else blocked.delete(number);
  p.pagerBlocked=[...blocked];
  result={message:cmd.blocked?'Номер заблокирован':'Номер разблокирован'};
 }else if(cmd.type==='pagerDial'){
  const booth=PHONE_BOOTHS.find(b=>b.id===cmd.target);
  if(!booth||booth.scene!==(p.scene||'city'))throw Error('Нужен таксофон');
  if(g.state.startingCity&&(booth.id!=='phone-square'||!municipalBuilt(g.state,'phone-square')))throw Error('Сначала построй городской таксофон.');
  g.near(p,booth);
  const number=String(cmd.number||'').trim();
  if(number===NPC_NUMBERS.museum&&(p.worldTravel?.visited||[]).includes('museum'))
   result={message:'Музей смеха отвечает',npc:'museum',sound:'laughter'};
  else if(number===NPC_NUMBERS.mayor)
   result={message:'Мэрия на линии. Посмотри поручения на доске работ.',npc:'mayor',sound:'dial-tone'};
  else if(publicSubscriberList(network,p).some(x=>x.number===number))
   result={message:'Абонент выбран. Напиши сообщение.',recipient:number};
  else throw Error('Номер не найден или ещё не открыт');
 }else if(cmd.type==='pagerBuy'){
  if((p.scene||'city')!=='city')throw Error('Пейджеры продают в городском магазине инструментов');
  g.near(p,g.target('tool-shop'));
  if(p.pagerOwns)throw Error('У тебя уже есть пейджер');
  if(p.wallet<PAGER_PRICE)throw Error('Не хватает PAPER');
  p.wallet-=PAGER_PRICE;g.state.treasury+=PAGER_PRICE;p.pagerOwns=true;
  g.state.transactions.push({id:requestId,player:p.id,amount:-PAGER_PRICE,reason:'pager-buy',time:g.now});
  result={message:'Пейджер куплен. Номер: '+p.pagerNumber};
 }else if(cmd.type==='pagerRead'){
  if(!p.pagerOwns)throw Error('Сначала купи пейджер');
  const m=p.pagerInbox.find(x=>x.id===cmd.messageId);
  if(!m)throw Error('Сообщение не найдено');
  m.readAt||=g.now;result={message:'Сообщение прочитано'};
 }else{
  const booth=PHONE_BOOTHS.find(b=>b.id===cmd.target);
  if(!booth||booth.scene!==(p.scene||'city'))throw Error('Сначала найди таксофон в этой локации');
  g.near(p,booth);
  const toNumber=String(cmd.number||'').trim();
  if(!/^\d{6}$/.test(toNumber))throw Error('Введите шестизначный номер абонента');
  const recipient=publicSubscriberList(network,p).find(x=>x.number===toNumber&&x.kind==='resident');
  if(!recipient)throw Error('Абонент не найден');
  const target=network.findId(recipient.id);
  if(!target||target.p.pagerBlocked?.includes(p.pagerNumber))throw Error('Абонент недоступен');
  const raw=String(cmd.text||'').trim();
  if(!raw||raw.length>100)throw Error('Сообщение должно содержать от 1 до 100 символов');
  const message=cleanText(raw);if(!message)throw Error('Напиши сообщение');
  if(p.wallet<PAGE_FEE)throw Error('Нужна 1 PAPER');
  p.wallet-=PAGE_FEE;g.state.treasury+=PAGE_FEE;
  const letter={id:randomUUID(),from:p.pagerNumber,fromName:p.name,to:toNumber,text:message,at:g.now,readAt:null};
  target.p.pagerInbox||=[];
  target.p.pagerInbox.push(letter);
  // Archive older content instead of keeping it in browser-visible snapshots.
  target.p.pagerInbox=target.p.pagerInbox.slice(-300);
  target.g.changed();g.state.transactions.push({id:requestId,player:p.id,amount:-PAGE_FEE,reason:'pager-message',time:g.now});
  result={message:'Пейджерное сообщение отправлено · −1 PAPER',id:letter.id};
 }
 p.pagerReceipts||={};p.pagerReceipts[requestId]=result;
 const ids=Object.keys(p.pagerReceipts);if(ids.length>512)for(const id of ids.slice(0,ids.length-512))delete p.pagerReceipts[id];
 g.changed();network.directoryDirty=true;
 return result;
}
