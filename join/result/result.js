import {DC_SPHERES,esc,formatDate,getClient,currentSession,loginWithGoogle,syncLocalAssessmentRuns,readSphereResults,getEntryStatus,errorMessage,route} from '/community-runtime-v1.js';

const register=document.getElementById('sphereRegister');
const countEl=document.getElementById('resultCount');
const lead=document.getElementById('heroLead');
const nextTitle=document.getElementById('nextTitle');
const nextCopy=document.getElementById('nextCopy');
const nextActions=document.getElementById('nextActions');

function action(label,href,{primary=false,id=''}={}){return `<a ${id?`id="${id}"`:''} class="dc-result-action${primary?' primary':''}" href="${esc(href)}">${esc(label)}</a>`}
function renderError(error){register.innerHTML=`<div class="dc-error"><strong>НЕ УДАЛОСЬ ПРОЧИТАТЬ КАРТУ</strong><code>${esc(errorMessage(error))}</code></div>`}

async function boot(){
  const client=getClient();
  const session=await currentSession(client);
  if(session)await syncLocalAssessmentRuns(client,session.user.id);
  const results=await readSphereResults(client,session?.user?.id||null);
  const completed=DC_SPHERES.filter(([id])=>results[id]);
  countEl.textContent=`${completed.length} / 9`;
  lead.textContent=completed.length===9?'Все девять сфер существуют отдельно. Теперь можно перейти из диагностики в жизнь клуба.':'Карта собирается постепенно. Community v1 откроется после всех девяти сфер.';
  register.innerHTML=DC_SPHERES.map(([id,title],index)=>{
    const result=results[id];
    return `<div class="dc-sphere-row${result?'':' is-missing'}"><span class="dc-sphere-row__num">${String(index+1).padStart(2,'0')}</span><strong class="dc-sphere-row__name">${esc(title)}</strong><span class="dc-sphere-row__level">${result?`${Number(result.level??0)}/5`:'—'}</span><span class="dc-sphere-row__date">${result?formatDate(result.date):'НЕ ОБСЛЕДОВАНО'}</span></div>`;
  }).join('');

  if(completed.length<9){
    nextTitle.innerHTML='КАРТА<br>ЕЩЁ НЕ ГОТОВА.';
    nextCopy.textContent=`Завершено ${completed.length} из 9 сфер. Вступление в закрытый Community пока не открывается.`;
    nextActions.innerHTML=action('ПРОДОЛЖИТЬ DC-9',route('/join/'),{primary:true});
    return;
  }

  if(!session){
    nextTitle.innerHTML='СНАЧАЛА<br>ЗАКРЕПИТЕ РЕЗУЛЬТАТ.';
    nextCopy.textContent='Войдите через Google. Локальная карта будет синхронизирована с вашим профилем, после чего откроется оформление участия.';
    nextActions.innerHTML='<button class="dc-result-action primary" type="button" id="resultLogin">ВОЙТИ ЧЕРЕЗ GOOGLE →</button>';
    document.getElementById('resultLogin').onclick=async event=>{const button=event.currentTarget;button.disabled=true;button.textContent='ПЕРЕХОД К GOOGLE…';try{await loginWithGoogle('/join/result/',client)}catch(error){button.disabled=false;button.textContent='ВОЙТИ ЧЕРЕЗ GOOGLE →';nextCopy.textContent=errorMessage(error)}};
    return;
  }

  const status=await getEntryStatus(client);
  if(status.membership_active){
    nextTitle.innerHTML=status.community_activation_state==='MEMBER_ACTIVATED'?'ВЫ УЖЕ<br>ВНУТРИ.':'ДОПУСК<br>УЖЕ ЕСТЬ.';
    nextCopy.textContent=status.community_activation_state==='MEMBER_ACTIVATED'?'Community уже активирован. Возвращайтесь к общей доске.':'Членство активно. Следующий шаг — оставить первый Artifact на общей доске.';
    nextActions.innerHTML=action('ОТКРЫТЬ COMMUNITY BOARD',route('/community/board/'),{primary:true});
  }else{
    nextTitle.innerHTML='МОЖНО<br>ВСТУПАТЬ.';
    nextCopy.textContent='Диагностическая часть закончена. Осталось определить, как вы будете представлены внутри закрытого Community.';
    nextActions.innerHTML=action('ОФОРМИТЬ УЧАСТИЕ',route('/join/member/'),{primary:true});
  }
}

boot().catch(renderError);
