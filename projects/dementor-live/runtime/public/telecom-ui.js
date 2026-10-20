/* Physical PAYPHONE: take receiver -> directory or dial -> connect -> compose 100 chars -> pay.
   PAGER is a private recipient-only inbox. Inherits shared paper-city UI. */
(function(){
const formerTargets=allTargets,formerInteraction=interaction,formerContext=doContext,formerPanels=updateCityPanels,formerUpdate=updateUI;
let activeBooth=null,telephoneStep=0;
const dialog=document.createElement('dialog');dialog.id='payphoneDialog';dialog.className='payphone-dialog';
dialog.innerHTML='<header><h2>Таксофон</h2><button id="payphoneClose" aria-label="Положить трубку">×</button></header><div class="phone-cabinet"><div class="phone-receiver">☎ <span id="receiverState">Трубка на рычаге</span></div><div id="phoneBody"></div></div>';
document.body.append(dialog);
const body=dialog.querySelector('#phoneBody');
dialog.querySelector('#payphoneClose').onclick=()=>dialog.close();
function element(tag,text,cls){const e=document.createElement(tag);if(text!=null)e.textContent=text;if(cls)e.className=cls;return e;}
function ctl(label,fn,disabled=false){const b=element('button',label,'phone-control');b.type='button';b.onclick=fn;b.disabled=disabled;return b;}
function openPayphone(id){
 activeBooth=id;telephoneStep=0;buildPhone();
 if(!dialog.open)dialog.showModal();
}
function buildPhone(){
 body.replaceChildren();
 const header=dialog.querySelector('#receiverState');
 header.textContent=telephoneStep===0?'Трубка на рычаге':telephoneStep===1?'Введите шестизначный номер':'Абонент на линии';
 const subscribers=state?.telecom?.directory||[];
 if(telephoneStep===0){body.append(element('p','Найди абонента на табличке и сними трубку.'),ctl('☎ Снять трубку',()=>{telephoneStep=1;buildPhone();}));return;}
 let number=null;
 if(telephoneStep===1){
   number=element('input');number.id='phoneNumber';number.type='tel';number.inputMode='numeric';number.maxLength=6;number.placeholder='Номер абонента · 6 цифр';number.autocomplete='off';number.setAttribute('aria-label','Шестизначный номер');
   const search=element('input');search.type='search';search.placeholder='Поиск жителя по имени или номеру';search.setAttribute('aria-label','Найти абонента');
   const list=element('div',null,'subscriber-list');
   const refresh=()=>{list.replaceChildren();for(const person of subscribers.filter(p=>(p.name+' '+p.number).toLowerCase().includes(search.value.toLowerCase())).slice(0,60)){
     const b=ctl(person.name+' · '+person.number+(person.hasPager?' · пейджер':''),()=>{number.value=person.number;search.value=person.name;refresh();});
     list.append(b);
   }};
   search.oninput=refresh;refresh();
   body.append(number,search,list,ctl('Позвонить →',()=>{const recipient=subscribers.find(x=>x.number===number.value.trim());if(!recipient){toast('Введите номер из справочника жителей');return;}telephoneStep=2;dialog.dataset.to=recipient.number;buildPhone();},me?.spirit));
   return;
 }
 const to=subscribers.find(x=>x.number===dialog.dataset.to);
 body.append(element('p','Абонент: '+(to?.name||'неизвестный')+' · '+(to?.number||'—')));
 const textarea=element('textarea');textarea.id='pageText';textarea.maxLength=100;textarea.rows=4;textarea.placeholder='Сообщение на пейджер · максимум 100 символов';textarea.setAttribute('aria-label','Сообщение до 100 символов');
 const counter=element('small','0 / 100');textarea.oninput=()=>counter.textContent=textarea.value.length+' / 100';
 body.append(textarea,counter,ctl('Отправить · 1 PAPER',async()=>{
   const text=textarea.value.trim();if(!text){toast('Напиши сообщение');return;}
   const result=await act('pagerSend',activeBooth,{number:dialog.dataset.to,text});
   if(result?.ok){dialog.close();toast('Отправлено · −1 PAPER');}
 },!me||me.wallet<1||me.spirit),
 ctl('Назад к номерам',()=>{telephoneStep=1;buildPhone();}));
}
allTargets=function(){
 const value=formerTargets();
 if(!state||['city','museum','farlands'].includes(state.scene))return value;
 return [...value,...(state.telecom?.booths||[]).map(x=>({...x,type:'payphone'}))];
};
interaction=function(t){
 if(t?.type==='payphone')return {type:'payphone',title:t.title,hint:'☎ Снять трубку · номер абонента · сообщение до 100 знаков / 1 PAPER',enabled:!me.spirit};
 if(t?.type==='world-bridge')return {type:'secondBridge',title:'Строительство второго моста',hint:state.secondBridgeProject?.stage===2?'Мост открыт':state.secondBridgeProject?.stage===0?'Нужны материалы · 12 древесины и 8 камня':'Остались работы · вместе достроим мост',enabled:!me.spirit};
 return formerInteraction(t);
};
doContext=function(){
 if(context?.type==='payphone'){openPayphone(context.id);return;}
 if(context?.type==='secondBridge'){openCityPanel('secondBridge');return;}
 return formerContext();
};
const pagerButton=ctl('▣ Пейджер',()=>openCityPanel('pager'));pagerButton.id='openPager';pagerButton.title='Личный пейджер и входящие сообщения';
document.querySelector('.map-tools')?.append(pagerButton);
let markerCount=0;
const markButton=ctl('● Метка видео',async()=>{
 const label='VIDEO-'+String(++markerCount).padStart(3,'0');
 const result=await api('qa-marker',{label});
 if(result?.ok)toast('Запись '+label+' · '+result.marker.offsetMs+' мс. Произнесите метку на видео.');
 else toast('Метка не записана');
});
markButton.id='qaVideoMarker';markButton.title='Синхронизировать видео и серверный журнал';
document.querySelector('.map-tools')?.append(markButton);
const exportButton=ctl('⇩ QA-лог',async()=>{
 try{const response=await fetch('/api/qa-export',{headers:{Authorization:'Bearer '+token}});if(!response.ok)throw Error('not allowed');const blob=await response.blob(),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='dementor-qa-'+new Date().toISOString().slice(0,10)+'.ndjson';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch{toast('Выгрузка доступна только в тестовой сборке');}
});
exportButton.id='qaExport';document.querySelector('.map-tools')?.append(exportButton);
updateUI=function(){formerUpdate();pagerButton.textContent='▣ Пейджер'+(state?.telecom?.unread?' · '+state.telecom.unread:'');exportButton.hidden=!state?.qaMode;};
updateCityPanels=function(force=false){
 if(!['secondBridge','pager'].includes(cityPanelMode))return formerPanels(force);
 const rows=$('cityPanelRows');rows.replaceChildren();const canAct=!me?.spirit&&!me?.job;
 function row(title,desc){const node=element('section',null,'city-row');node.append(element('h3',title),element('p',desc));const actions=element('div',null,'city-actions');node.append(actions);rows.append(node);return actions;}
 if(cityPanelMode==='secondBridge'){
   const bridge=state.secondBridgeProject||{stage:0,accepted:{wood:0,stone:0},work:0};
   $('cityPanelTitle').textContent='Вторая переправа';
   $('cityPanelIntro').textContent=bridge.stage===2?'Мост открыт. Иди в горный регион.':'Горожане строят отдельный деревянно-каменный мост. Первый мост от этой стройки не зависит.';
   $('cityPanelNote').textContent='Мост нельзя пересечь, пока все материалы и работы не приняты сервером.';
   if(bridge.stage===0){
    for(const [kind,total] of [['wood',12],['stone',8]]){
     const actions=row(kind==='wood'?'Древесина':'Камень',(bridge.accepted?.[kind]||0)+' / '+total+' · в твоём рюкзаке '+(me.bag[kind]||0));
     actions.append(ctl('Сдать материалы',()=>act('secondBridgeDeliver','second-bridge-site',{kind}).then(()=>{cityPanelSignature='';updateCityPanels(true);}),!canAct||!nearby('second-bridge-site')||!me.bag[kind]));
    }
   }else if(bridge.stage===1)row('Строительные работы',bridge.work+' / 4 · платят 2 PAPER за работу')
     .append(ctl('Работать · +2 PAPER',()=>act('secondBridgeWork','second-bridge-site').then(()=>{cityPanelSignature='';updateCityPanels(true);}),!canAct||!nearby('second-bridge-site')));
   else row('Переправа готова','Вторая переправа отличается от первой силуэтом, но выполняет то же назначение.');
   return;
 }
 const tel=state.telecom;
 $('cityPanelTitle').textContent='Мой пейджер';
 $('cityPanelIntro').textContent='Номер '+(tel?.number||'—')+' · доставленные сообщения можно читать в любом регионе, после покупки аппарата.';
 $('cityPanelNote').textContent='Отправлять сообщения нужно через таксофоны. Разговоров нет — только короткие сообщения.';
 if(!tel?.hasPager){
   row('Аппарат · 180 PAPER','Дорогой персональный пейджер. Все входящие сообщения сохраняются на сервере.')
   .append(ctl('Купить · 180 PAPER',()=>act('pagerBuy','tool-shop').then(()=>{cityPanelSignature='';updateCityPanels(true);}),!canAct||!nearby('tool-shop')||me.wallet<180));
   return;
 }
 if(!tel.inbox?.length){row('Сообщений нет','Найди таксофон и попроси соседа отправить сообщение.');return;}
 for(const msg of [...tel.inbox].reverse()){
   const actions=row((msg.readAt?'✉':'●')+' '+msg.fromName+' · '+msg.from,new Date(msg.at).toLocaleString('ru-RU')+' · '+msg.text);
   if(!msg.readAt)actions.append(ctl('Прочитано',()=>act('pagerRead',null,{messageId:msg.id}).then(()=>{cityPanelSignature='';updateCityPanels(true);})));
 }
};
window.__openPayphone=openPayphone;
})();
