/* Admin training panel: visible from logo, but grants require a server-admin key and HTTPS. */
(function(){
const logo=document.querySelector('.brand-mark');if(!logo)return;
const modal=document.createElement('dialog');modal.id='qaAdminPanel';modal.className='qa-admin-panel';
modal.innerHTML='<header><h2>Казначейство · QA</h2><button type="button" id="qaAdminClose" aria-label="Закрыть">×</button></header><p id="qaAdminInfo"></p><label>Получатель<select id="qaGrantPlayer"></select></label><label>Перевод из казны, PAPER<input id="qaGrantAmount" type="number" min="1" max="500" value="100"></label><label>Секрет тестового казначея<input id="qaAdminSecret" type="password" autocomplete="off" placeholder="Серверный ключ"></label><button id="qaAdminSubmit" type="button">Выдать из казны</button><p id="qaAdminMessage" role="status"></p>';
document.body.append(modal);
const el=id=>modal.querySelector('#'+id);
logo.tabIndex=0;logo.setAttribute('role','button');logo.setAttribute('aria-label','Открыть тестовую панель казначея');
function show(){
 const allowed=!!state?.qaAdminAvailable;
 el('qaAdminInfo').textContent=allowed?'Деньги переводятся из существующей казны и записываются в аудит.':'Админ-переводы отключены. Для включения на сервере необходимы HTTPS и DEMENTOR_QA_ADMIN_KEY. В обычной игре эта операция запрещена.';
 const names=el('qaGrantPlayer');names.replaceChildren();for(const p of (state?.players||[]).filter(x=>x.online||x.id===me?.id)){const o=document.createElement('option');o.value=p.id;o.textContent=p.name+(p.id===me?.id?' · ты':'');names.append(o);}
 el('qaAdminSubmit').disabled=!allowed;el('qaAdminSecret').value='';el('qaAdminMessage').textContent='';
 if(!modal.open)modal.showModal();
}
logo.onclick=show;logo.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show();}};
el('qaAdminClose').onclick=()=>modal.close();
modal.addEventListener('close',()=>{el('qaAdminSecret').value='';});
el('qaAdminSubmit').onclick=async()=>{
 const key=el('qaAdminSecret').value,amount=Number(el('qaGrantAmount').value),targetPlayerId=el('qaGrantPlayer').value;
 if(!key||!Number.isInteger(amount)||amount<1||amount>500)return el('qaAdminMessage').textContent='Нужен ключ и сумма 1–500';
 el('qaAdminSecret').value='';
 try{
  const response=await fetch('/api/admin/treasury',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token,'X-Dementor-QA-Admin':key},body:JSON.stringify({targetPlayerId,amount})});
  const result=await response.json();el('qaAdminMessage').textContent=result.message||'Ошибка запроса';
 }catch{el('qaAdminMessage').textContent='Нет соединения с казначейством';}
};
// Large, accessible starvation hint accompanies the visual vignette.
const warning=document.createElement('div');warning.id='urgentHunger';warning.hidden=true;warning.setAttribute('role','status');document.querySelector('#game')?.append(warning);
const priorUpdate=updateUI;
updateUI=function(){priorUpdate();if(!me)return;const dying=me.spirit||me.hunger<state.config.slowBelow;
 warning.hidden=!dying;warning.textContent=me.spirit?'Ты потерял тело · найди ягоды, чтобы вернуться':me.bag.food||me.bag.carrot?'Ты умираешь с голоду! Нажми F или кнопку «ЕСТЬ»':'Ты умираешь с голоду! Срочно найди ягоды';
};
let vertical=false;const vitals=document.getElementById('vitals');
try{vertical=localStorage.getItem('dementor-vitals-column')==='true';}catch{}
vitals.classList.toggle('vitals-column',vertical);
vitals.title='Нажми, чтобы переключить горизонтальный и вертикальный вид';
vitals.addEventListener('click',e=>{if(e.target.closest('button,input'))return;vertical=!vertical;vitals.classList.toggle('vitals-column',vertical);try{localStorage.setItem('dementor-vitals-column',String(vertical));}catch{}});
})();