(()=>{
'use strict';
const parts=(window.DC9_SPHERE_DATA||[]).slice().sort((a,b)=>a.index-b.index);
if(parts.length!==9)throw new Error('DC9_DATA_INCOMPLETE');
const DATA={spheres:parts.map(x=>x.sphere),questions:parts.flatMap(x=>x.questions),reactions:parts.flatMap(x=>x.reactions),scoring:parts.map(x=>x.scoring),...window.DC9_CORE};
const STORAGE='dementorClubOnboardingV3';
const QUIZ_VERSION='dc9-immersive-v1';
const SCORING_VERSION='v0.9';
const SPHERE_IDS=['personality','work','consumption','relationships','control','information','self_development','meaning','technology'];
const reactionSet=new Set(DATA.reactionQuestions);
const $=id=>document.getElementById(id);
let db=readDb(),currentSphere=0,currentQ=0,chosen=null;

function canonicalSphere(value){return String(value||'')==='self-development'?'self_development':String(value||'')}
function safeObject(value){return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}
function readDb(){try{const raw=JSON.parse(localStorage.getItem(STORAGE)||'null');return normalizeDb(raw)}catch{return normalizeDb(null)}}
function normalizeDb(raw){
 const next=safeObject(raw);next.results=safeObject(next.results);next.drafts=safeObject(next.drafts);
 if(next.results['self-development']){const old=next.results['self-development'];const cur=next.results.self_development;if(!cur||Date.parse(old.date||0)>Date.parse(cur.date||0))next.results.self_development=old;delete next.results['self-development']}
 if(next.quizVersion!==QUIZ_VERSION){if(next.active)next.legacyActive={quizVersion:next.quizVersion||'legacy',active:next.active,archivedAt:new Date().toISOString()};next.active=null;next.drafts={};next.quizVersion=QUIZ_VERSION}
 return next;
}
function saveDb(){db.quizVersion=QUIZ_VERSION;localStorage.setItem(STORAGE,JSON.stringify(db))}
function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]))}
function inline(value){return esc(value).replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>')}
function sceneHtml(text){let out='',quote=[];const flush=()=>{if(quote.length){out+='<blockquote>'+quote.map(x=>inline(x.replace(/^>\s?/,''))).join('<br>')+'</blockquote>';quote=[]}};for(const raw of String(text).split('\n')){const line=raw.trimEnd();if(line.startsWith('>')){quote.push(line);continue}flush();if(!line.trim())continue;out+='<p>'+inline(line)+'</p>'}flush();return out}
function shuffle(input){const a=[...input];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function show(id){['dc9Intro','dc9Picker','dc9Play','dc9Finalizing'].forEach(view=>$(view).hidden=view!==id);window.scrollTo(0,0)}
function sphereQuestions(si){return DATA.questions.filter(q=>q.sphere===si)}
function resultFor(si){return db.results?.[SPHERE_IDS[si]]||null}
function completed(si){return Boolean(resultFor(si))}
function completeCount(){return SPHERE_IDS.filter(id=>db.results?.[id]).length}
function draftFor(si){const id=SPHERE_IDS[si],draft=db.drafts?.[id];return draft&&draft.quizVersion===QUIZ_VERSION?draft:null}
function writeDraft(si,q,score){const id=SPHERE_IDS[si],existing=draftFor(si)||{quizVersion:QUIZ_VERSION,sphere:id,answers:[null,null,null,null,null,null],startedAt:new Date().toISOString()};existing.answers[q]=Number(score);existing.updatedAt=new Date().toISOString();db.drafts[id]=existing;db.active={quizVersion:QUIZ_VERSION,sphere:id,index:q,updatedAt:existing.updatedAt};saveDb()}
function clearDraft(si){const id=SPHERE_IDS[si];delete db.drafts[id];db.active=null;saveDb()}
function firstOpen(si){const d=draftFor(si);if(!d)return 0;const idx=d.answers.findIndex(v=>v===null||v===undefined);return idx<0?0:idx}
function pickerPool(done){return DATA.pickerCopy[String(done)]||DATA.pickerCopy['0']}
function renderIntro(){show('dc9Intro');const done=completeCount(),hasDraft=Object.keys(db.drafts||{}).some(id=>db.drafts[id]?.quizVersion===QUIZ_VERSION);$('dc9Start').hidden=done>0||hasDraft;$('dc9Resume').hidden=!(done>0||hasDraft);$('dc9ResetIntro').hidden=!(done>0||hasDraft);$('dc9Resume').textContent=done===9?'ОТКРЫТЬ КАРТУ →':'ПРОДОЛЖИТЬ →'}
function resume(){if(completeCount()===9){location.assign('/join/result/');return}const active=canonicalSphere(db.active?.sphere);const si=SPHERE_IDS.indexOf(active);if(si>=0&&draftFor(si)){currentSphere=si;currentQ=firstOpen(si);renderQuestion();return}renderPicker()}
function renderPicker(){show('dc9Picker');const done=completeCount();if(done===9){showFinalizing();return}const pool=pickerPool(done),seed=Object.values(db.results||{}).reduce((sum,r)=>sum+Number(r?.level||0),0),copy=pool[(seed+done)%pool.length];$('dc9PickerKicker').textContent=done===0?'DC-9 / ВЫБОР СФЕРЫ':`DC-9 / ${done} ИЗ 9 ГОТОВО`;$('dc9PickerTitle').innerHTML=copy.title;$('dc9PickerLead').innerHTML=copy.lead;$('dc9JourneyBar').style.width=`${done/9*100}%`;$('dc9JourneyText').textContent=`${done} / 9`;$('dc9SphereGrid').innerHTML=DATA.spheres.map((s,i)=>`<button class="dc9-sphere${completed(i)?' is-done':''}" data-sphere="${i}" type="button"><span class="dc9-sphere-num">${s.n}</span><strong>${esc(s.title)}</strong><p>${esc(s.rule)}</p></button>`).join('');document.querySelectorAll('.dc9-sphere').forEach(button=>button.onclick=()=>startSphere(Number(button.dataset.sphere)))}
function startSphere(si){currentSphere=si;if(completed(si)&&!draftFor(si)){db.drafts[SPHERE_IDS[si]]={quizVersion:QUIZ_VERSION,sphere:SPHERE_IDS[si],answers:[null,null,null,null,null,null],startedAt:new Date().toISOString()};saveDb()}currentQ=firstOpen(si);renderQuestion()}
function callback(qi){if(qi===36&&Number(db.drafts?.work?.answers?.[0]??db.results?.work?.tagScores?.[0])>=2)return 'Свободное время уже встречалось.\nВ прошлый раз удалось не выдавать ему новую задачу.';if(qi===44&&Number(db.results?.consumption?.tagScores?.[0]??db.drafts?.consumption?.answers?.[0])>=2)return 'Старая повседневность уже однажды пережила отсутствие обновления.\nДень, похоже, тоже справится.';if(qi===51&&Number(db.results?.work?.tagScores?.[1]??db.drafts?.work?.answers?.[1])>=2)return 'Делегирование уже проверяли на людях.\nТеперь очередь машин.';return null}
function renderQuestion(){show('dc9Play');chosen=null;const item=sphereQuestions(currentSphere)[currentQ],qi=currentSphere*6+currentQ,s=DATA.spheres[currentSphere];$('dc9PlaySphere').textContent=`${s.n} / ${s.title}`;$('dc9PlayCount').textContent=`${String(currentQ+1).padStart(2,'0')} / 06`;$('dc9ProgressBar').style.width=`${currentQ/6*100}%`;$('dc9SceneText').innerHTML=sceneHtml(item.scene);$('dc9Reaction').hidden=true;$('dc9Reaction').classList.remove('is-quiet');const options=shuffle(item.answers).map((o,i)=>({...o,label:'ABCD'[i]}));$('dc9Answers').innerHTML=options.map(o=>`<button class="dc9-answer" data-score="${o.score}" type="button"><span class="dc9-answer-letter">${o.label}</span><span class="dc9-answer-text">${esc(o.text)}</span></button>`).join('');document.querySelectorAll('.dc9-answer').forEach(button=>button.onclick=()=>{chosen=Number(button.dataset.score);writeDraft(currentSphere,currentQ,chosen);document.querySelectorAll('.dc9-answer').forEach(x=>x.classList.toggle('is-chosen',x===button));showReaction(qi,chosen,true)})}
function showReaction(qi,score,delay){const rx=callback(qi)||(reactionSet.has(qi)?DATA.reactions[qi][score]:null);$('dc9Next').textContent=DATA.nextLabels[qi%DATA.nextLabels.length];if(rx){$('dc9ReactionText').textContent=rx;$('dc9Reaction').classList.remove('is-quiet')}else{$('dc9ReactionText').textContent='';$('dc9Reaction').classList.add('is-quiet')}setTimeout(()=>{$('dc9Reaction').hidden=false},delay?(rx?170:90):0)}
function baseLevel(avg){const t=[.35,.95,1.30,1.70,2.15];if(avg<t[0])return 0;if(avg<t[1])return 1;if(avg<t[2])return 2;if(avg<t[3])return 3;if(avg<t[4])return 4;return 5}
function computeSphere(si){const draft=draftFor(si);if(!draft||draft.answers.some(v=>v===null||v===undefined))throw new Error('INCOMPLETE_SPHERE');const scores=draft.answers.slice(0,4).map(Number),intent=Number(draft.answers[4]),responsibility=Number(draft.answers[5]),cfg=DATA.scoring[si],total=cfg.weights.reduce((a,b)=>a+b,0),avg=scores.reduce((sum,v,i)=>sum+v*cfg.weights[i],0)/total;let base=baseLevel(avg);if(base===5&&cfg.core.some(i=>scores[i]<2))base=4;let cap=5;if(responsibility===0)cap=2;else if(intent===0)cap=3;else if(responsibility===1||intent===1)cap=4;const level=Math.min(base,cap);return{tagScores:scores,tagLevels:scores.map(v=>Math.round((v/3)*5)),base,level,intent,responsibility,date:new Date().toISOString(),quizVersion:QUIZ_VERSION,scoringVersion:SCORING_VERSION}}
function finishSphere(){const id=SPHERE_IDS[currentSphere];db.results[id]=computeSphere(currentSphere);clearDraft(currentSphere);if(completeCount()===9)showFinalizing();else renderPicker()}
function showFinalizing(){show('dc9Finalizing');$('dc9FinalizingStatus').textContent='Собираем последствия.';$('dc9FinalizingBar').style.width='28%';setTimeout(()=>{$('dc9FinalizingStatus').textContent='Геометрия согласована.';$('dc9FinalizingBar').style.width='100%'},620);setTimeout(()=>location.assign('/join/result/'),1180)}
function resetAll(){if(!confirm('Удалить локальный прогресс DC-9 и начать заново?'))return;db={results:{},active:null,drafts:{},quizVersion:QUIZ_VERSION};saveDb();renderIntro()}
$('dc9Start').onclick=renderPicker;$('dc9Resume').onclick=resume;$('dc9ResetIntro').onclick=resetAll;$('dc9Back').onclick=renderPicker;$('dc9Next').onclick=()=>{if(chosen===null)return;if(currentQ<5){currentQ++;renderQuestion()}else finishSphere()};
const requested=canonicalSphere(new URLSearchParams(location.search).get('sphere'));const requestedIndex=SPHERE_IDS.indexOf(requested);if(requestedIndex>=0)startSphere(requestedIndex);else renderIntro();
})();
