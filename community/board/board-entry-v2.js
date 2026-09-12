import {getClient,esc,formatDate,errorMessage,route} from '/community-runtime-v1.js';
import {resolveBoardUserState,isBoardMemberState,BOARD_USER_STATES} from './board-user-state-v2.js';
import {artifactSubtypeLabel} from './board-entity-model-v1.js';

const entryHost=document.getElementById('entryHost');
const entrySection=document.getElementById('entrySection');
const boardHost=document.getElementById('boardHost');
const boardStatus=document.getElementById('boardStatus');
const memberBadge=document.getElementById('memberBadge');
const artifactCount=document.getElementById('artifactCount');
const client=getClient();
let guestInterestBusy=false;

function fail(error,target=boardHost){
  if(target)target.innerHTML=`<div class="dc-board-error">${esc(errorMessage(error))}</div>`;
}

function clampSphereCount(value){return Math.max(0,Math.min(9,Number(value||0)))}
function isHistoricalStatus(status){return ['expired','archived'].includes(String(status||'').toLowerCase())}
function artifactStatusLabel(row){
  const status=String(row.status||'active').toLowerCase();
  if(status==='expired')return 'ПРОШЛО / EXPIRED';
  if(status==='archived')return 'АРХИВ / CLOSED';
  return 'СЕЙЧАС / ACTIVE';
}

function personalCardMarkup(state){
  const entry=state.entryStatus||{};
  const count=clampSphereCount(entry.sphere_count);
  if(state.key===BOARD_USER_STATES.AUTHENTICATED_GUEST_DC9_INCOMPLETE){
    return `<article class="dc-personal-card" data-personal-state="guest-dc9-incomplete" tabindex="-1">
      <div class="dc-personal-card__meta"><span>МОЙ СТАТУС / GUEST</span><span>DC-9 ${count} / 9</span></div>
      <h3>ВСТУПИТЬ<br>В КЛУБ.</h3>
      <p>Доску можно смотреть уже сейчас. Для заявки нужен первый полный проход DC-9.</p>
      <a class="dc-personal-card__action" href="${route('/join/')}">ПРОЙТИ / ПРОДОЛЖИТЬ DC-9 →</a>
    </article>`;
  }
  if(state.key===BOARD_USER_STATES.AUTHENTICATED_GUEST_DC9_COMPLETE){
    return `<article class="dc-personal-card" data-personal-state="guest-dc9-complete" tabindex="-1">
      <div class="dc-personal-card__meta"><span>МОЙ СТАТУС / READY</span><span>DC-9 9 / 9</span></div>
      <h3>МОЖНО<br>ПОДАВАТЬ.</h3>
      <p>Первый полный DC-9 сохранён как membership baseline. Повторный проход его не заменит.</p>
      <div class="dc-personal-card__actions"><a class="dc-personal-card__action" href="${route('/join/apply/')}">ПОДАТЬ ЗАЯВКУ →</a><a class="dc-personal-card__secondary" href="${route('/join/')}">ПЕРЕПРОЙТИ DC-9</a></div>
    </article>`;
  }
  if(state.key===BOARD_USER_STATES.APPLICANT){
    const status=String(state.application?.status||'reviewing').toUpperCase();
    return `<article class="dc-personal-card" data-personal-state="applicant" tabindex="-1">
      <div class="dc-personal-card__meta"><span>МОЙ СТАТУС / APPLICATION</span><span>${esc(status)}</span></div>
      <h3>ЗАЯВКА<br>В РАБОТЕ.</h3>
      <p>Вы уже сделали следующий шаг. Членство появится только после канонического review.</p>
      <a class="dc-personal-card__action" href="${route('/join/apply/')}">СТАТУС ЗАЯВКИ →</a>
    </article>`;
  }
  if(isBoardMemberState(state.key)){
    const role=state.key===BOARD_USER_STATES.OWNER_ADMIN?'OWNER':state.key===BOARD_USER_STATES.DEMENTOR?'DEMENTOR':'MEMBER';
    const activation=state.key===BOARD_USER_STATES.MEMBER_NOT_ACTIVATED?'FIRST ARTIFACT':'ACTIVE';
    return `<article class="dc-personal-card is-member" data-personal-state="member" tabindex="-1">
      <div class="dc-personal-card__meta"><span>МОЯ КАРТА / ${role}</span><span>${activation}</span></div>
      <h3>МОЯ<br>КАРТА.</h3>
      <p>${state.key===BOARD_USER_STATES.MEMBER_NOT_ACTIVATED?'Членство активно. Осмотритесь и приколите первую свою вещь, чтобы открыть полное участие на доске.':'Членство активно. Ваши Board-действия определяются текущей ролью и activation state.'}</p>
      <a class="dc-personal-card__action" href="${route('/workspace/#club')}">УЧАСТИЕ →</a>
    </article>`;
  }
  return '';
}

function publishPersonalCard(state){
  const html=personalCardMarkup(state);
  const payload={state:state.key,html};
  window.DEMENTOR_BOARD_PERSONAL_CARD=payload;
  window.dispatchEvent(new CustomEvent('dc:board-personal-state',{detail:payload}));
}

function avatar(row){
  if(row.author_avatar_url)return `<img class="dc-notice__avatar" src="${esc(row.author_avatar_url)}" alt="">`;
  const letter=String(row.author_display_name||'?').trim().charAt(0).toUpperCase()||'?';
  return `<span class="dc-notice__avatar dc-notice__avatar--empty">${esc(letter)}</span>`;
}

function guestInterestTotal(row){return Math.max(0,Number(row.reaction_count||0))+Math.max(0,Number(row.guest_interest_count||0))}
function guestInterestButton(active,total){return `<button class="dc-board-action small${active?' active':''}" type="button" data-guest-interest aria-pressed="${active?'true':'false'}"><span data-guest-interest-label>${active?'✓':'☆'} ИНТЕРЕСНО ·</span> <span data-guest-interest-count>${total}</span></button>`}
function guestNotice(row,index){
  const active=row.my_guest_interest===true;
  const total=guestInterestTotal(row);
  const historical=isHistoricalStatus(row.status);
  const subtype=String(row.artifact_type||'announcement').toLowerCase();
  return `<article class="dc-notice dc-notice--guest${historical?' is-history':''}" data-artifact="${esc(row.artifact_id)}" data-artifact-status="${esc(row.status||'active')}" data-artifact-subtype="${esc(subtype)}" data-source-type="artifact" data-guest-read="1" data-member-reaction-count="${Math.max(0,Number(row.reaction_count||0))}">
    <div class="dc-notice__meta"><span>${esc(artifactSubtypeLabel(subtype))} / ${String(index+1).padStart(3,'0')}</span><span>${formatDate(row.published_at)}</span></div>
    <div class="dc-notice__author">${avatar(row)}<div><strong>${esc(row.author_display_name||'MEMBER')}</strong>${row.author_nickname?`<div>@${esc(String(row.author_nickname).replace(/^@/,''))}</div>`:''}</div></div>
    ${row.title?`<h3>${esc(row.title)}</h3>`:''}
    <p class="dc-notice__body">${esc(row.body||'')}</p>
    ${row.external_url?`<p><a class="dc-notice__link" href="${esc(row.external_url)}" target="_blank" rel="noopener noreferrer">ССЫЛКА ↗</a></p>`:''}
    <div class="dc-notice__expiry">${historical?artifactStatusLabel(row):(row.expires_at?`ДЕЙСТВУЕТ ДО ${formatDate(row.expires_at)}`:'БЕЗ СРОКА')} · COMMUNITY</div>
    <div class="dc-notice__actions">${guestInterestButton(active,total)}<span class="dc-board-state">${historical?'HISTORY / REACTIONS OPEN':'GUEST / LIGHT INTERACTION'}</span></div>
  </article>`;
}

async function toggleGuestInterest(button){
  if(guestInterestBusy||!button)return;
  const card=button.closest('[data-artifact]');
  const artifactId=card?.dataset.artifact;
  if(!artifactId)return;
  guestInterestBusy=true;
  button.disabled=true;
  try{
    const {data,error}=await client.rpc('dc_guest_board_interest_toggle_v1',{p_artifact_id:artifactId});
    if(error)throw error;
    const result=Array.isArray(data)?data[0]:data;
    const active=result?.active===true;
    const guestCount=Math.max(0,Number(result?.count||0));
    const base=Math.max(0,Number(card.dataset.memberReactionCount||0));
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',active?'true':'false');
    const label=button.querySelector('[data-guest-interest-label]');
    if(label)label.textContent=`${active?'✓':'☆'} ИНТЕРЕСНО ·`;
    const countEl=button.querySelector('[data-guest-interest-count]');
    if(countEl)countEl.textContent=String(base+guestCount);
  }catch(error){
    const message=document.createElement('div');
    message.className='dc-board-error';
    message.setAttribute('role','status');
    message.textContent=errorMessage(error);
    card?.appendChild(message);
    setTimeout(()=>message.remove(),5000);
  }finally{
    button.disabled=false;
    guestInterestBusy=false;
  }
}

async function renderGuestBoard(state){
  boardStatus.textContent='GUEST / BOARD HISTORY READ';
  memberBadge.textContent=state.session?.user?.email||'ACCOUNT';
  if(entrySection)entrySection.hidden=true;
  if(entryHost)entryHost.replaceChildren();
  publishPersonalCard(state);

  const {data,error}=await client.rpc('dc_guest_board_read_v1');
  if(error)throw error;
  const rows=data||[];
  artifactCount.textContent=String(rows.length).padStart(2,'0');
  boardHost.innerHTML=rows.length
    ?rows.map(guestNotice).join('')
    :'<div class="dc-board-empty"><h3>НА ДОСКЕ<br>ПОКА НЕТ ИСТОРИИ.</h3><p>Здесь появятся текущие и прошедшие Community Artifacts.</p></div>';
  boardHost.dataset.guestRead='1';
  window.dispatchEvent(new CustomEvent('dc:board-guest-read-ready',{detail:{state:state.key,count:rows.length}}));
}

boardHost?.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-guest-interest]');
  if(!button)return;
  event.preventDefault();
  toggleGuestInterest(button);
});

async function boot(){
  const state=await resolveBoardUserState(client);
  document.documentElement.dataset.dcBoardUserState=state.key;
  if(state.key===BOARD_USER_STATES.UNAUTHENTICATED){
    await import('./board.js');
    return;
  }
  publishPersonalCard(state);
  if(isBoardMemberState(state.key)){
    if(entrySection)entrySection.hidden=false;
    await import('./board.js');
    return;
  }
  await renderGuestBoard(state);
}

boot().catch(error=>{
  boardStatus.textContent='ERROR';
  fail(error,entryHost);
  fail(error,boardHost);
});
