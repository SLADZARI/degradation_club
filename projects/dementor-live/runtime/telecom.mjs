// World-wide public numbers / city payphones / recipient-only pager inbox.
// Number is a public 6-digit routing ID, NEVER the authentication token.
import {randomUUID} from 'node:crypto';
export const PAGER_PRICE=180;
export const PAGE_FEE=1;
export const PHONE_BOOTHS=Object.freeze([
 {id:'phone-square',scene:'city',x:10,y:12,title:'Таксофон · городская площадь'},
 {id:'phone-tourist',scene:'city',x:25,y:42,title:'Таксофон · туристическая улица'},
 {id:'phone-forest',scene:'city',x:18,y:59,title:'Таксофон · у леса'},
 {id:'phone-mountain',scene:'city',x:52,y:57,title:'Таксофон · у перевала'},
 {id:'phone-museum-outside',scene:'city',x:94,y:59,title:'Таксофон · возле музея'},
 {id:'phone-farlands-outside',scene:'city',x:139,y:58,title:'Таксофон · дальние земли'},
 {id:'phone-museum',scene:'museum',x:3,y:11,title:'Таксофон · музей смеха'},
 {id:'phone-farlands',scene:'farlands',x:4,y:16,title:'Таксофон · дальние земли'},
 {id:'phone-home',scene:'plot',x:3,y:12,title:'Общий таксофон · участок'},
 {id:'phone-expedition',scene:'expedition',x:3,y:12,title:'Таксофон · экспедиция'}
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
  seen.add(p.pagerNumber);p.pagerInbox||=[];p.pagerOwns||=false;p.pagerReceipts||={};
 }
}
export function publicSubscriberList(network){
 ensureTelephoneDirectory(network);
 return [...network.values()].flatMap(g=>Object.values(g.state.players).map(p=>({id:p.id,name:p.name,number:p.pagerNumber,hasPager:!!p.pagerOwns})))
 .sort((a,b)=>a.name.localeCompare(b.name,'ru')).slice(0,500);
}
export function telecomSnapshot(network,p){
 return {number:p.pagerNumber,hasPager:!!p.pagerOwns,price:PAGER_PRICE,messageFee:PAGE_FEE,
  directory:publicSubscriberList(network),
  inbox:p.pagerOwns?p.pagerInbox.slice(-80):[],
  unread:p.pagerOwns?p.pagerInbox.filter(m=>!m.readAt).length:0,
  booths:boothsForScene(p.scene)};
}
export function telecomAction(network,p,cmd){
 if(!['pagerBuy','pagerSend','pagerRead'].includes(cmd?.type))return null;
 const r=network.findId(p.id),g=r?.g;if(!g)throw Error('Житель не найден');
 if(p.spirit||p.job||p.delivery?.picked)throw Error('Заверши работу перед звонком');
 const requestId=cmd.requestId;
 if(p.pagerReceipts?.[requestId])return p.pagerReceipts[requestId];
 let result;
 if(cmd.type==='pagerBuy'){
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
  const recipient=publicSubscriberList(network).find(x=>x.number===toNumber);
  if(!recipient)throw Error('Абонент не найден');
  const target=network.findId(recipient.id);
  if(!target)throw Error('Абонент недоступен');
  const message=cleanText(cmd.text);
  if(!message||message.length>100)throw Error('Сообщение должно содержать от 1 до 100 символов');
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
