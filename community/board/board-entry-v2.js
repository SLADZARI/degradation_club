import {getClient,esc,formatDate,errorMessage,route} from '/community-runtime-v1.js';
import {resolveBoardUserState,isBoardMemberState,BOARD_USER_STATES} from './board-user-state-v2.js';

const entryHost=document.getElementById('entryHost');
const boardHost=document.getElementById('boardHost');
const boardStatus=document.getElementById('boardStatus');
const memberBadge=document.getElementById('memberBadge');
const artifactCount=document.getElementById('artifactCount');
const client=getClient();

function fail(error,target=boardHost){
  if(target)target.innerHTML=`<div class="dc-board-error">${esc(errorMessage(error))}</div>`;
}

function guestNextStep(state){
  const entry=state.entryStatus||{};
  if(state.key===BOARD_USER_STATES.APPLICANT){
    return `<div class="dc-first-gate"><div class="dc-first-gate__label">MEMBERSHIP / APPLICATION</div><div><h2>ЗАЯВКА<br>НА РАССМОТРЕНИИ.</h2><p>Доску уже можно смотреть. Членство появится только после принятого решения.</p><a class="dc-board-action primary" href="${route('/join/apply/')}">СТАТУС ЗАЯВКИ →</a></div></div>`;
  }
  const complete=state.key===BOARD_USER_STATES.AUTHENTICATED_GUEST_DC9_COMPLETE;
  if(complete){
    return `<div class="dc-first-gate"><div class="dc-first-gate__label">MEMBERSHIP / READY</div><div><h2>DC-9<br>9 / 9.</h2><p>Базовый квест уже завершён. Его первый полный результат остаётся каноническим baseline для заявки.</p><a class="dc-board-action primary" href="${route('/join/apply/')}">ПОДАТЬ ЗАЯВКУ →</a><a class="dc-board-action" href="${route('/join/')}">ПЕРЕПРОЙТИ DC-9</a></div></div>`;
  }
  const count=Number(entry.sphere_count||0);
  return `<div class="dc-first-gate"><div class="dc-first-gate__label">MEMBERSHIP / GUEST</div><div><h2>ВЫ ЕЩЁ<br>НЕ В КЛУБЕ.</h2><p>Доску можно смотреть уже сейчас. Для заявки нужен первый полный DC-9: сейчас ${Math.max(0,Math.min(9,count))} / 9.</p><a class="dc-board-action primary" href="${route('/join/')}">ПРОЙТИ / ПРОДОЛЖИТЬ DC-9 →</a></div></div>`;
}

function avatar(row){
  if(row.author_avatar_url)return `<img class="dc-notice__avatar" src="${esc(row.author_avatar_url)}" alt="">`;
  const letter=String(row.author_display_name||'?').trim().charAt(0).toUpperCase()||'?';
  return `<span class="dc-notice__avatar dc-notice__avatar--empty">${esc(letter)}</span>`;
}

function guestNotice(row,index){
  const reactions=Number(row.reaction_count||0);
  return `<article class="dc-notice dc-notice--guest" data-artifact="${esc(row.artifact_id)}" data-guest-read="1">
    <div class="dc-notice__meta"><span>ARTIFACT / ${String(index+1).padStart(3,'0')}</span><span>${formatDate(row.published_at)}</span></div>
    <div class="dc-notice__author">${avatar(row)}<div><strong>${esc(row.author_display_name||'MEMBER')}</strong>${row.author_nickname?`<div>@${esc(String(row.author_nickname).replace(/^@/,''))}</div>`:''}</div></div>
    ${row.title?`<h3>${esc(row.title)}</h3>`:''}
    <p class="dc-notice__body">${esc(row.body||'')}</p>
    ${row.external_url?`<p><a class="dc-notice__link" href="${esc(row.external_url)}" target="_blank" rel="noopener noreferrer">ССЫЛКА ↗</a></p>`:''}
    <div class="dc-notice__expiry">${row.expires_at?`ДЕЙСТВУЕТ ДО ${formatDate(row.expires_at)}`:'БЕЗ СРОКА'} · COMMUNITY</div>
    <div class="dc-notice__actions"><span class="dc-notice__activity">ИНТЕРЕСНО: ${reactions}</span><span class="dc-board-state">GUEST / READ ONLY</span></div>
  </article>`;
}

async function renderGuestBoard(state){
  boardStatus.textContent='GUEST / BOARD READ';
  memberBadge.textContent=state.session?.user?.email||'ACCOUNT';
  entryHost.innerHTML=guestNextStep(state);

  const {data,error}=await client.rpc('dc_guest_board_read_v1');
  if(error)throw error;
  const rows=data||[];
  artifactCount.textContent=String(rows.length).padStart(2,'0');
  boardHost.innerHTML=rows.length
    ?rows.map(guestNotice).join('')
    :'<div class="dc-board-empty"><h3>ЖИВЫХ ОБЪЯВЛЕНИЙ<br>ПОКА НЕТ.</h3><p>Вы видите настоящую доску, но сейчас на ней нет активных Member Artifacts.</p></div>';
  boardHost.dataset.guestRead='1';
  window.dispatchEvent(new CustomEvent('dc:board-guest-read-ready',{detail:{state:state.key,count:rows.length}}));
}

async function boot(){
  const state=await resolveBoardUserState(client);
  document.documentElement.dataset.dcBoardUserState=state.key;
  if(state.key===BOARD_USER_STATES.UNAUTHENTICATED){
    await import('./board.js');
    return;
  }
  if(isBoardMemberState(state.key)){
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
