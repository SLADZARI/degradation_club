import {getClient,currentSession} from '/community-runtime-v1.js';
import {resolveBoardUserState,isBoardGuestState,isBoardMemberState,BOARD_USER_STATES} from './board-user-state-v2.js';

const client=getClient();
let state=null;
let session=null;
let viewport=null;
let controls=null;
let overlay=null;
let currentStep=0;
let currentTarget=null;
let mode='guest';
let autoAttempted=false;
let restoreFocus=null;

const MEMBER_STATES=new Set([
  BOARD_USER_STATES.MEMBER_NOT_ACTIVATED,
  BOARD_USER_STATES.MEMBER_ACTIVATED,
  BOARD_USER_STATES.DEMENTOR,
  BOARD_USER_STATES.OWNER_ADMIN
]);

function storageKey(){
  const uid=session?.user?.id||'anonymous';
  return `dc:board:tutorial:v2:${uid}:${mode}`;
}

function isDone(){
  try{return JSON.parse(localStorage.getItem(storageKey())||'{}').done===true}catch{return false}
}

function markDone(reason='complete'){
  try{localStorage.setItem(storageKey(),JSON.stringify({done:true,reason,at:new Date().toISOString()}))}catch{}
}

function clearHighlight(){
  if(currentTarget){currentTarget.classList.remove('dc-tutorial-target');currentTarget=null}
}

function ensureHelpButton(){
  viewport=document.querySelector('.dc-spatial-viewport');
  controls=viewport?.querySelector('.dc-spatial-controls');
  if(!controls)return false;
  let button=controls.querySelector('[data-tutorial-help]');
  if(!button){
    button=document.createElement('button');
    button.type='button';
    button.className='dc-spatial-control';
    button.setAttribute('data-tutorial-help','1');
    button.setAttribute('aria-label','Показать инструкцию по доске');
    button.textContent='?';
    controls.appendChild(button);
  }
  button.onclick=()=>openTutorial({replay:true});
  return true;
}

function targetFor(step){
  if(!viewport)return null;
  if(step===0)return viewport;
  if(step===1)return viewport.querySelector('.dc-notice[data-artifact], [data-board-source="platform"]')||viewport.querySelector('[data-board-personal-host]');
  if(step===2)return viewport.querySelector('[data-mine]');
  if(step===3){
    if(mode==='guest')return viewport.querySelector('[data-board-personal-host]');
    return viewport.querySelector('[data-slot]')||viewport.querySelector('[data-board-personal-host]');
  }
  return null;
}

function steps(){
  if(mode==='guest')return [
    {eyebrow:'01 / ДВИЖЕНИЕ',title:'ЭТО ЖИВАЯ ДОСКА.',text:'Тяните свободное поле одним пальцем или мышью. Двумя пальцами меняйте масштаб. Двойное касание приближает.'},
    {eyebrow:'02 / СМОТРЕТЬ',title:'СМОТРИТЕ, ЧТО ПРОИСХОДИТ.',text:'Карточки — реальные предложения и объекты клуба. Здесь видно, чем сейчас живут участники и сам клуб.'},
    {eyebrow:'03 / ОРИЕНТАЦИЯ',title:'«МОЁ» ВОЗВРАЩАЕТ К ВАМ.',text:'Если потерялись в пространстве, «МОЁ» находит ваш личный объект или следующий шаг.'},
    {eyebrow:'04 / ВСТУПЛЕНИЕ',title:'ХОТИТЕ ВНУТРЬ — ПУТЬ ЗДЕСЬ.',text:'Личная карточка показывает ваш статус: DC-9, заявка или следующий шаг. Смотреть доску можно и без вступления.'}
  ];
  const needsActivation=state?.key===BOARD_USER_STATES.MEMBER_NOT_ACTIVATED;
  return [
    {eyebrow:'01 / ДВИЖЕНИЕ',title:'ДОСКА — ЭТО ПРОСТРАНСТВО.',text:'Тяните свободное поле. Двумя пальцами меняйте масштаб. «К ЖИЗНИ» показывает всю текущую активность.'},
    {eyebrow:'02 / СМОТРЕТЬ',title:'СНАЧАЛА ОСМОТРИТЕСЬ.',text:'Карточки на поле — реальные предложения, проекты и другие объекты клуба. Посмотрите, что уже происходит вокруг.'},
    {eyebrow:'03 / ВАШЕ МЕСТО',title:'«МОЁ» НАХОДИТ ВАС.',text:'Если у вас уже есть Artifact — камера вернётся к нему. Если нет — к вашей личной карте.'},
    needsActivation
      ?{eyebrow:'04 / АКТИВАЦИЯ',title:'НЕ ОСТАВАЙТЕСЬ ЗРИТЕЛЕМ.',text:'Чтобы включиться полностью, приколите одну свою вещь на доску. После первой публикации открывается полное участие.'}
      :{eyebrow:'04 / ПУБЛИКАЦИЯ',title:'ПРИКАЛЫВАЙТЕ СВОЁ.',text:'Через действие публикации можно оставить на доске своё предложение. Текущие slot-правила при этом сохраняются.'}
  ];
}

function focusables(){
  if(!overlay)return[];
  return [...overlay.querySelectorAll('button,a[href],[tabindex]:not([tabindex="-1"])')].filter(el=>!el.disabled&&!el.hidden);
}

function ensureOverlay(){
  if(overlay)return overlay;
  overlay=document.createElement('div');
  overlay.className='dc-board-tutorial';
  overlay.hidden=true;
  overlay.innerHTML=`<div class="dc-board-tutorial__shade" data-tutorial-close></div><section class="dc-board-tutorial__panel" role="dialog" aria-modal="true" aria-labelledby="dcTutorialTitle"><div class="dc-board-tutorial__top"><span data-tutorial-progress></span><button type="button" data-tutorial-skip>ПРОПУСТИТЬ</button></div><div class="dc-board-tutorial__eyebrow" data-tutorial-eyebrow></div><h2 id="dcTutorialTitle" data-tutorial-title></h2><p data-tutorial-text></p><div class="dc-board-tutorial__actions"><button type="button" data-tutorial-prev>← НАЗАД</button><button type="button" data-tutorial-next>ДАЛЬШЕ →</button></div></section>`;
  document.body.appendChild(overlay);
  overlay.querySelector('[data-tutorial-skip]').onclick=()=>closeTutorial('skip');
  overlay.querySelector('[data-tutorial-close]').onclick=()=>closeTutorial('skip');
  overlay.querySelector('[data-tutorial-prev]').onclick=()=>showStep(currentStep-1);
  overlay.querySelector('[data-tutorial-next]').onclick=()=>{
    if(currentStep>=steps().length-1)closeTutorial('complete');
    else showStep(currentStep+1);
  };
  document.addEventListener('keydown',event=>{
    if(!overlay||overlay.hidden)return;
    if(event.key==='Escape'){event.preventDefault();closeTutorial('skip');return}
    if(event.key==='ArrowRight'){event.preventDefault();overlay.querySelector('[data-tutorial-next]')?.click();return}
    if(event.key==='ArrowLeft'){event.preventDefault();overlay.querySelector('[data-tutorial-prev]')?.click();return}
    if(event.key==='Tab'){
      const items=focusables();if(!items.length)return;
      const first=items[0],last=items[items.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    }
  });
  return overlay;
}

function showStep(index){
  const list=steps();
  currentStep=Math.max(0,Math.min(list.length-1,index));
  const item=list[currentStep];
  clearHighlight();
  const target=targetFor(currentStep);
  if(target){currentTarget=target;target.classList.add('dc-tutorial-target')}
  overlay.querySelector('[data-tutorial-progress]').textContent=`${String(currentStep+1).padStart(2,'0')} / ${String(list.length).padStart(2,'0')}`;
  overlay.querySelector('[data-tutorial-eyebrow]').textContent=item.eyebrow;
  overlay.querySelector('[data-tutorial-title]').textContent=item.title;
  overlay.querySelector('[data-tutorial-text]').textContent=item.text;
  overlay.querySelector('[data-tutorial-prev]').disabled=currentStep===0;
  overlay.querySelector('[data-tutorial-next]').textContent=currentStep===list.length-1?'ПОНЯТНО ✓':'ДАЛЬШЕ →';
}

function openTutorial({replay=false}={}){
  if(!viewport&&!ensureHelpButton())return;
  if(!replay&&isDone())return;
  ensureOverlay();
  restoreFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
  overlay.hidden=false;
  document.documentElement.classList.add('dc-tutorial-open');
  showStep(0);
  overlay.querySelector('[data-tutorial-next]')?.focus({preventScroll:true});
}

function closeTutorial(reason){
  if(!overlay)return;
  markDone(reason);
  overlay.hidden=true;
  document.documentElement.classList.remove('dc-tutorial-open');
  clearHighlight();
  const fallback=viewport?.querySelector('[data-tutorial-help]');
  const target=restoreFocus&&document.contains(restoreFocus)?restoreFocus:fallback;
  if(target){try{target.focus({preventScroll:true})}catch{target.focus()}}
  restoreFocus=null;
}

async function boot(){
  session=await currentSession(client);
  if(!session?.user)return;
  state=await resolveBoardUserState(client);
  if(isBoardGuestState(state.key))mode='guest';
  else if(isBoardMemberState(state.key)||MEMBER_STATES.has(state.key))mode='member';
  else return;

  let attempts=0;
  const ready=()=>{
    attempts+=1;
    if(!ensureHelpButton()){
      if(attempts<50)setTimeout(ready,100);
      return;
    }
    if(!autoAttempted){
      autoAttempted=true;
      setTimeout(()=>openTutorial({replay:false}),650);
    }
  };
  ready();
}

window.addEventListener('dc:board-spatial-ready',()=>ensureHelpButton());
window.addEventListener('dc:board-tutorial-open',()=>openTutorial({replay:true}));
boot().catch(error=>console.warn('[DC Board Tutorial]',error));
