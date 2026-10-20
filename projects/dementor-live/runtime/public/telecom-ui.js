/* Payphone P4: four cut-paper planes, tangible keypad, lifted handset, private phonebook. */
(function(){
const olderTargets=allTargets,olderInteraction=interaction,olderContext=doContext,olderPanels=updateCityPanels,olderUpdate=updateUI;
let activeBooth='',phase=0,dialed='',contact='',music=null;
const dialog=document.createElement('dialog');dialog.id='payphoneDialog';dialog.className='paper-telephone-screen';
dialog.innerHTML='<div class="phone-sheet"><header class="phone-top"><strong>ТАКСОФОН · DEMENTOR</strong><button id="payphoneClose" aria-label="Положить трубку">×</button></header><div class="phone-stage"><div class="phone-machine"><svg class="phone-svg" viewBox="0 0 360 465" role="img" aria-label="Бумажный таксофон: корпус, трубка и кнопки"><rect x="47" y="22" width="263" height="411" rx="24" fill="#9daea0" stroke="#647a6d" stroke-width="5"/><rect x="70" y="48" width="216" height="68" rx="7" fill="#f5e9cd" stroke="#778475" stroke-width="3"/><text x="180" y="88" font-family="sans-serif" font-size="23" text-anchor="middle" fill="#526a60">ТАКСОФОН</text><rect x="94" y="171" width="172" height="70" rx="7" fill="#e7ddc1" stroke="#687d72" stroke-width="3"/><rect x="115" y="264" width="128" height="132" rx="9" fill="#cdd3b6" stroke="#697b6f" stroke-width="2"/><rect x="62" y="415" width="232" height="23" rx="3" fill="#798e81"/><rect x="40" y="106" width="56" height="118" rx="12" fill="#758c7d"/><path d="M 42 117 Q 28 92 44 82 L 82 79 Q 101 91 81 114 L 77 193 Q 92 208 84 231 L 42 229 Q 24 214 42 193 Z" fill="#e4d5b5" stroke="#647b6d" stroke-width="5"/></svg><span id="phoneHand" class="paper-hand" aria-hidden="true">✋</span><output id="phoneDisplay" aria-live="polite">Трубка на месте</output><div id="phoneKeys" class="phone-keys" aria-label="Кнопки таксофона"></div><button id="phoneLift" class="phone-lift">СНЯТЬ ТРУБКУ</button></div><section class="phone-notice"><h2>ТЕЛЕФОННАЯ КНИГА</h2><p id="phoneInstruction">Открой книгу номеров и возьми трубку</p><input id="phoneSearch" type="search" placeholder="Поиск имени или номера" aria-label="Поиск абонента"><div id="phoneDirectory" class="phone-directory"></div><div id="phoneCompose" class="phone-compose"></div></section></div></div>';
document.body.append(dialog);
const $ph=id=>dialog.querySelector('#'+id);
const main=$ph('phoneCompose'),display=$ph('phoneDisplay'),directory=$ph('phoneDirectory');
function stopAudio(){try{music?.stop();}catch{}music=null;if('speechSynthesis' in window)window.speechSynthesis.cancel();}
function tone(){stopAudio();try{const audio=new (window.AudioContext||window.webkitAudioContext)(),osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.value=425;gain.gain.value=.055;osc.connect(gain);gain.connect(audio.destination);osc.start();music={stop(){osc.stop();audio.close();}};}catch{}}
function laugh(){stopAudio();if('speechSynthesis' in window){const u=new SpeechSynthesisUtterance('Ха ха ха! Ха ха ха! Добро пожаловать в Музей смеха!');u.lang='ru-RU';u.rate=1.1;window.speechSynthesis.speak(u);}}
function el(tag,text,cls){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;}
function btn(text,fn,disabled=false){const node=el('button',text,'phone-action');node.type='button';node.disabled=disabled;node.onclick=fn;return node;}
function closePhone(){stopAudio();if(dialog.open)dialog.close();}
$ph('payphoneClose').onclick=closePhone;
dialog.addEventListener('close',stopAudio);
function subscribers(){return state?.telecom?.directory||[];}
function buildDirectory(){directory.replaceChildren();const value=$ph('phoneSearch').value.toLowerCase();for(const p of subscribers().filter(x=>(x.name+' '+x.number).toLowerCase().includes(value)).slice(0,100)){
 const item=btn(p.name+' · '+p.number,()=>{if(phase!==1)return;dialed=p.number;render();});
 item.className='phone-contact';item.disabled=phase!==1;directory.append(item);
}if(!directory.children.length)directory.append(el('p','Номер пока не открыт или не опубликован'));}
$ph('phoneSearch').oninput=buildDirectory;
function render(){
 const lifted=phase>0;dialog.classList.toggle('phone-lifted',lifted);
 $ph('phoneLift').textContent=lifted?'ПОЛОЖИТЬ ТРУБКУ':'СНЯТЬ ТРУБКУ';
 $ph('phoneLift').onclick=()=>{if(!lifted){phase=1;dialed='';tone();}else{phase=0;dialed='';contact='';stopAudio();}render();};
 display.textContent=!lifted?'Трубка на месте':phase===1?dialed.padEnd(6,'_'):contact||dialed;
 $ph('phoneInstruction').textContent=!lifted?'Сними трубку: после гудка набери 6 цифр':phase===1?'Выбери номер справа или набери кнопками':'Линия установлена';
 const keys=$ph('phoneKeys');keys.replaceChildren();
 for(const key of ['1','2','3','4','5','6','7','8','9','*','0','#']){
   const k=el('button',key,'phone-digit');k.type='button';k.disabled=phase!==1;
   k.onclick=()=>{if(/[0-9]/.test(key)&&dialed.length<6)dialed+=key;else if(key==='*')dialed=dialed.slice(0,-1);display.textContent=dialed.padEnd(6,'_');};
   keys.append(k);
 }
 main.replaceChildren();buildDirectory();
 if(phase===1){main.append(btn('ПОЗВОНИТЬ →',async()=>{
   const number=dialed;if(number.length!==6){toast('Набери шесть цифр');return;}
   const res=await act('pagerDial',activeBooth,{number});
   if(!res?.ok)return;stopAudio();phase=2;contact=subscribers().find(p=>p.number===number)?.name||number;render();
   if(res.npc==='museum')laugh();
 },!me||me.spirit));}
 if(phase===2){
  const npc=subscribers().find(x=>x.number===dialed&&x.kind==='npc');
  if(npc){main.append(el('p',npc.id==='npc-museum'?'Из трубки раздаётся смех. Музей открыт в твоей телефонной книге.':'Мэрия на линии: свободные поручения размещены на городской доске.'));main.append(btn('← НАЗАД',()=>{phase=1;tone();render();}));return;}
  const box=el('textarea');box.id='phoneText';box.maxLength=100;box.rows=4;box.placeholder='Сообщение до 100 знаков';
  const count=el('small','0 / 100');box.oninput=()=>count.textContent=box.value.length+' / 100';
  main.append(box,count,btn('ОТПРАВИТЬ · 1 PAPER',async()=>{const text=box.value.trim();if(!text)return toast('Напиши сообщение');const res=await act('pagerSend',activeBooth,{number:dialed,text});if(res?.ok){closePhone();toast('Сообщение отправлено · −1 PAPER');}},!me||me.wallet<1));
 }
}
function openPayphone(id){activeBooth=id;phase=0;dialed='';contact='';$ph('phoneSearch').value='';render();if(!dialog.open)dialog.showModal();}
allTargets=function(){const value=olderTargets();if(!state||['city','museum','farlands'].includes(state.scene))return value;return [...value,...(state.telecom?.booths||[]).map(x=>({...x,type:'payphone'}))];};
interaction=function(t){if(t?.type==='payphone')return {type:'payphone',title:t.title,hint:'Полноэкранный таксофон · снимай трубку и набирай номер',enabled:!me.spirit};if(t?.type==='world-bridge')return {type:'secondBridge',title:'Строительство второго моста',hint:state.secondBridgeProject?.stage===2?'Мост открыт':'Сдай 12 древесины, 8 камня и выполни 4 работы',enabled:!me.spirit};return olderInteraction(t);};
doContext=function(){if(context?.type==='payphone')return openPayphone(context.id);if(context?.type==='secondBridge')return openCityPanel('secondBridge');return olderContext();};
const pagerButton=btn('▣ Пейджер',()=>openCityPanel('pager'));pagerButton.id='openPager';document.querySelector('.map-tools')?.append(pagerButton);
let marks=0;const markButton=btn('● Метка',async()=>{const label='VIDEO-'+String(++marks).padStart(3,'0');const result=await api('qa-marker',{label});if(result?.ok)toast('Метка видео: '+label);});markButton.id='qaVideoMarker';document.querySelector('.map-tools')?.append(markButton);
const exportButton=btn('⇩ QA',async()=>{const response=await fetch('/api/qa-export',{headers:{Authorization:'Bearer '+token}});if(!response.ok)return toast('Только на тестовом сервере');const blob=await response.blob(),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='dementor-qa.ndjson';a.click();});exportButton.id='qaExport';document.querySelector('.map-tools')?.append(exportButton);
updateUI=function(){olderUpdate();pagerButton.textContent='▣ Пейджер'+(state?.telecom?.unread?' · '+state.telecom.unread:'');markButton.hidden=!state?.qaRecording;exportButton.hidden=!state?.qaMode;};
updateCityPanels=function(force=false){
 if(!['secondBridge','pager'].includes(cityPanelMode))return olderPanels(force);
 const rows=$('cityPanelRows');rows.replaceChildren();const canAct=!me?.spirit&&!me?.job;
 function row(title,desc){const part=el('section',undefined,'city-row');part.append(el('h3',title),el('p',desc));const actions=el('div',undefined,'city-actions');part.append(actions);rows.append(part);return actions;}
 if(cityPanelMode==='secondBridge'){
  const br=state.secondBridgeProject||{stage:0,accepted:{wood:0,stone:0},work:0};
  $('cityPanelTitle').textContent='Вторая переправа';
  $('cityPanelIntro').textContent='Материалы из рюкзака переходят в общую стройку. Все изменения сохраняются.';
  $('cityPanelNote').textContent='Первый мост не зависит от этой стройки.';
  if(br.stage===0){for(const [kind,total]of[['wood',12],['stone',8]])row(kind==='wood'?'Древесина':'Камень',(br.accepted?.[kind]||0)+' / '+total).append(btn('Сдать материалы',()=>act('secondBridgeDeliver','second-bridge-site',{kind}),!canAct||!nearby('second-bridge-site')||!me.bag[kind]));}
  else if(br.stage===1)row('Работы',br.work+' / 4').append(btn('Строить · +2 PAPER',()=>act('secondBridgeWork','second-bridge-site'),!canAct||!nearby('second-bridge-site')));
  else row('Мост готов','Теперь его можно перейти.');return;
 }
 const tel=state.telecom||{};
 $('cityPanelTitle').textContent='Личный пейджер';$('cityPanelIntro').textContent='Твой номер: '+(tel.number||'—');
 $('cityPanelNote').textContent='Номера в справочнике видны только по согласию владельца. Заблокированному отправителю доставка запрещена.';
 row('Мой номер',tel.listed?'Опубликован в справочнике':'Скрыт из справочника').append(btn(tel.listed?'Скрыть номер':'Опубликовать номер',()=>act('pagerList',null,{listed:!tel.listed}),!canAct));
 if(!tel.hasPager){row('Пейджер · 180 PAPER','Сообщения хранятся, пока аппарат не куплен').append(btn('Купить',()=>act('pagerBuy','tool-shop'),!canAct||!nearby('tool-shop')||me.wallet<180));}
 else{for(const msg of [...(tel.inbox||[])].reverse()){const blocked=tel.blocked?.includes(msg.from);const actions=row((msg.readAt?'✉':'●')+' '+msg.fromName+' · '+msg.from,msg.text);
 if(!msg.readAt)actions.append(btn('Прочитано',()=>act('pagerRead',null,{messageId:msg.id})));
 actions.append(btn(blocked?'Разблокировать':'Заблокировать',()=>act('pagerBlock',null,{number:msg.from,blocked:!blocked}),!canAct));}
 if(!tel.inbox?.length)row('Входящие','Сообщений ещё нет');}
 if(tel.blocked?.length)for(const number of tel.blocked)row('🔒 '+number,'Отправитель не может присылать сообщения').append(btn('Разблокировать',()=>act('pagerBlock',null,{number,blocked:false}),!canAct));
};
window.__openPayphone=openPayphone;
})();