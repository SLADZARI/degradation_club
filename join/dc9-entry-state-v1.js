import {getClient,currentSession,getEntryStatus,route} from '/community-runtime-v1.js';

const host=document.getElementById('dc9MemberReturn');
const views=[...document.querySelectorAll('.dc9-view')];

function showMemberReturn(status){
  if(!host)return;
  views.forEach(view=>{view.hidden=true});
  const activated=status.community_activation_state==='MEMBER_ACTIVATED';
  host.innerHTML=`
    <div class="dc9-kicker">DEMENTOR CLUB / MEMBER</div>
    <h1>ЛЮДИ ЕСТЬ.<br><span>ВЫ ТОЖЕ.</span></h1>
    <div class="dc9-member-return__lead">Клуб уже происходит. Вы в нём уже есть.</div>
    <p class="dc9-member-return__copy">Основной маршрут — Community. Карта DC-9 остаётся в аккаунте как отдельный артефакт, а не как повторный вступительный экзамен.</p>
    <div class="dc9-actions">
      <a class="dc9-button primary" href="${route('/community/board/')}">ВОЙТИ В COMMUNITY →</a>
      <a class="dc9-button" href="${route('/join/result/')}">МОЯ КАРТА DC-9</a>
      <a class="dc9-text-button" href="${route('/account/')}">МОЙ АККАУНТ</a>
    </div>
    <div class="dc9-member-return__state">MEMBER ACTIVE · ${activated?'COMMUNITY ДОСТУПНА':'ПЕРВЫЙ АРТЕФАКТ ЕЩЁ НЕ ОСТАВЛЕН'}</div>`;
  host.hidden=false;
  document.title='Dementor Club — Community';
}

async function boot(){
  if(!host)return;
  try{
    const client=getClient();
    const session=await currentSession(client);
    if(!session)return;
    const status=await getEntryStatus(client);
    if(status?.membership_active)showMemberReturn(status);
  }catch(error){
    console.warn('[DC9 entry resolver] account state unavailable; keeping local DC-9 flow',error);
  }
}

boot();
