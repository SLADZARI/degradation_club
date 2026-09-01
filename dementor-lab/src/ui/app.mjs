import { VerticalSliceController } from '../app/vertical-slice-controller.mjs';
import { CRITICISM_IDEA_SCENARIO, createCriticismActors } from '../scenarios/criticism-idea.mjs';
import { compareRuns } from '../encounter/result.mjs';
import { NODE_SPECS } from '../core/model.mjs';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const app=$('#app'),overlay=$('#overlay'),topStatus=$('#top-status');
let look='plain',mode='auto',actors=createCriticismActors(),controller=null,autoTimer=null;
let baselineEncounter=null,replayMode=false;

function show(screen){
  app.dataset.screen=screen;topStatus.textContent=screen.toUpperCase();
  $$('.screen').forEach(el=>el.hidden=el.dataset.view!==screen);
  $$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.nav===screen));
  if(screen==='brain'){renderBrain();$('#replay-note').hidden=!replayMode}
  if(screen==='talk')renderTalk();
}
function resetActors(){actors=createCriticismActors();actors.A.visual.look=look}
function familyLabel(type){return NODE_SPECS[type]?.family||'NODE'}
function title(type){return NODE_SPECS[type]?.title||type}
function nodeValue(n){const f=familyLabel(n.type);if(f==='IMPULSE')return `W${n.p?.weight||1}`;if(n.type==='repeat')return `×${n.p?.count||1}`;if(f==='STATE')return `+${n.p?.delta??1}`;return ''}
function nodeSubtitle(n){const map={criticism:'что произошло',resentment:'что накопилось',beright:'чего он хочет',explain:'что он делает',repeat:'сколько раз'};return map[n.type]||familyLabel(n.type)}

function renderBrain(){
  const graph=actors.A.brainGraph;
  $('#brain-graph').innerHTML=graph.nodes.map(n=>`<div class="brain-node" data-node="${n.id}"><span class="family">${familyLabel(n.type)}</span><span class="copy"><strong>${title(n.type)}</strong><small>${nodeSubtitle(n)}</small></span><span class="value">${nodeValue(n)}</span></div>`).join('');
  const impulse=graph.nodes.find(n=>n.type==='beright'),repeat=graph.nodes.find(n=>n.type==='repeat');
  $('#brain-editor').innerHTML=`<label>БЫТЬ ПРАВЫМ <span>WEIGHT ${impulse.p.weight}</span><input id="impulse-range" type="range" min="1" max="5" value="${impulse.p.weight}"></label><label>ПОВТОРИТЬ <span>×${repeat.p.count}</span><input id="repeat-range" type="range" min="1" max="5" value="${repeat.p.count}"></label>`;
  $('#impulse-range').oninput=e=>{impulse.p.weight=+e.target.value;renderBrain()};
  $('#repeat-range').oninput=e=>{repeat.p.count=+e.target.value;renderBrain()};
}
function metricRow(label,key){
  const a=controller?.encounter?.actors.A.state[key]??actors.A.state[key],b=controller?.encounter?.actors.B.state[key]??actors.B.state[key];
  const danger=(key==='brain'&&(a>=85||b>=85))||(key==='energy'&&(a<=25||b<=25))||(key==='contact'&&(a<=20||b<=20))||(key==='tension'&&(a>=85||b>=85));
  return `<div class="metric ${danger?'danger':''}"><label>${label}</label><span class="bar"><i style="width:${Math.max(0,Math.min(100,a))}%"></i></span><span class="n">${Math.round(a)}</span><span class="n">${Math.round(b)}</span><span class="bar"><i style="width:${Math.max(0,Math.min(100,b))}%"></i></span></div>`
}
function renderTalk(){
  if(!controller?.encounter)return;const e=controller.encounter;
  $('#turn').textContent=e.turn;$('#metrics').innerHTML=metricRow('ENERGY','energy')+metricRow('BRAIN','brain')+metricRow('TENSION','tension')+metricRow('CONTACT','contact');
  const transcript=e.transcript.slice(-5);$('#dialogue').innerHTML=transcript.length?transcript.map(x=>`<div class="bubble ${x.actorId==='A'?'a':'b'}"><small>${x.actorId==='A'?'ГЕНА':'МАРТА'}</small>${x.phrase||'…'}</div>`).join(''):'<p class="empty">Никто ещё ничего не сказал.</p>';
  $('#next-turn').textContent=mode==='auto'?(autoTimer?'PAUSE':'RESUME'):'NEXT TURN →';
}
function renderDelta(trace){
  if(!trace)return $('#delta').textContent='';const d=trace.metricDeltas.self,m=trace.memoryChanges?.[0];
  const parts=Object.entries(d).filter(([,v])=>v).map(([k,v])=>`${k.toUpperCase()} ${v>0?'+':''}${Number(v.toFixed?.(1)??v)}`);if(m)parts.unshift(`${String(m.key).toUpperCase()} ${m.before}→${m.after}`);
  const line=parts.join(' · ');$('#delta').textContent=line;setTimeout(()=>{if($('#delta').textContent===line)$('#delta').textContent=''},1100)
}
function portraitRenderer(side,selector){return {render(character){const root=$(selector),s=character.state;root.dataset.look=side==='A'?look:'plain';root.classList.toggle('lost',s.brain>=100||s.energy<=0||s.contact<=0);root.classList.toggle('brain',s.brain>=85);root.classList.toggle('energy',s.energy<=25);root.classList.toggle('contact',s.contact<=20)},breakdown(character,reason){this.render(character);$(selector).classList.add('lost',String(reason||'').toLowerCase())}}}
function makeController(){controller=new VerticalSliceController({scenario:CRITICISM_IDEA_SCENARIO,actors,renderers:{A:portraitRenderer('A','#actor-a'),B:portraitRenderer('B','#actor-b')},onEvent:handleEvent})}
function handleEvent(evt){if(evt.type==='TURN'){renderDelta(evt.trace);renderTalk()}if(evt.type==='HOT_PATCH'){stopAuto();showHotPatch(evt.breakpoint)}if(evt.type==='RESULT'){stopAuto();showResult(evt.result)}if(evt.type==='PATCH'){hideOverlay();renderTalk();if(mode==='auto')startAuto()}}
function doNext(){if(!controller?.encounter||controller.encounter.result)return;const out=controller.next();renderTalk();if(out?.result)showResult(controller.result())}
function startAuto(){stopAuto();autoTimer=setInterval(()=>{if(controller?.encounter?.status==='HOT_PATCH'||controller?.encounter?.result)return stopAuto();doNext()},850);renderTalk()}
function stopAuto(){if(autoTimer){clearInterval(autoTimer);autoTimer=null}renderTalk()}

function showHotPatch(bp){
  const actor=controller.encounter.actors[bp.actorId],ids=bp.nodeIds||[];const chain=ids.map(id=>title(actor.brainGraph.nodes.find(n=>n.id===id)?.type)).join(' → ');
  const repeat=ids.map(id=>actor.brainGraph.nodes.find(n=>n.id===id)).find(n=>n?.type==='repeat');const impulse=ids.map(id=>actor.brainGraph.nodes.find(n=>n.id===id)).find(n=>familyLabel(n?.type)==='IMPULSE');
  overlay.innerHTML=`<div class="overlay-card"><p class="kicker">HOT PATCH</p><h3>МОЗГ НАГРЕВАЕТСЯ.</h3><p>Сейчас эта цепочка собирается сделать хуже.</p><div class="chain">${chain}</div><div class="patch-grid">${repeat?`<button data-patch="repeat">REPEAT ×${repeat.p.count} → ×${Math.max(1,repeat.p.count-1)}</button>`:''}${impulse?`<button data-patch="impulse">${title(impulse.type)} ${impulse.p.weight} → ${Math.max(1,impulse.p.weight-1)}</button>`:''}<button data-patch="skip">НИЧЕГО НЕ ТРОГАТЬ</button></div></div>`;overlay.hidden=false;
  $('[data-patch=repeat]')?.addEventListener('click',()=>controller.patch({kind:'reduce-repeat',actorId:bp.actorId,nodeId:repeat.id}));$('[data-patch=impulse]')?.addEventListener('click',()=>controller.patch({kind:'reduce-impulse',actorId:bp.actorId,nodeId:impulse.id}));$('[data-patch=skip]').addEventListener('click',()=>{controller.declinePatch();hideOverlay();if(mode==='auto')startAuto()});
}
function showTrace(){const trace=controller?.encounter?.traces.at(-1);if(!trace)return;overlay.innerHTML=`<div class="overlay-card"><p class="kicker">TRACE</p><h3>ПОЧЕМУ ЭТО СЛУЧИЛОСЬ?</h3><div class="trace-list">TRIGGER: ${trace.trigger}\nPATH: ${trace.visitedNodes.join(' → ')}\nIMPULSE: ${trace.selectedImpulse}\nREACTION: ${trace.selectedReaction}\nLOOPS: ${trace.loops}\nMEMORY: ${(trace.memoryChanges||[]).map(m=>`${m.key} ${m.before}→${m.after}`).join(', ')||'—'}</div><button class="primary" id="close-overlay">ЗАКРЫТЬ</button></div>`;overlay.hidden=false;$('#close-overlay').onclick=hideOverlay}
function hideOverlay(){overlay.hidden=true;overlay.innerHTML=''}
function comparisonHtml(c){const fmt=v=>`${v>0?'+':''}${v}`;return `<small>БЫЛО / СТАЛО</small><strong>${c.sameScenario?'ТОТ ЖЕ СЦЕНАРИЙ':'СЦЕНАРИЙ ИЗМЕНИЛСЯ'}</strong><div class="compare-grid"><span>BRAIN ${fmt(c.metrics.brain)}</span><span>TENSION ${fmt(c.metrics.tension)}</span><span>CONTACT ${fmt(c.metrics.contact)}</span><span>ENERGY ${fmt(c.metrics.energy)}</span></div>`}
function showResult(result){
  show('result');$('#result-title').textContent=result.punchline;$('#result-cause').textContent=result.stageB.cause;$('#result-node').textContent=result.stageC.nodeType?title(result.stageC.nodeType):'—';
  if(!baselineEncounter){baselineEncounter=structuredClone(controller.encounter);$('#comparison').hidden=true;$('#rerun').textContent='ИЗМЕНИТЬ ОДНУ ВЕЩЬ →'}
  else if(replayMode){const c=compareRuns(baselineEncounter,controller.encounter);$('#comparison').innerHTML=comparisonHtml(c);$('#comparison').hidden=false;$('#rerun').textContent='ЕЩЁ ОДИН ЭКСПЕРИМЕНТ →'}
}

$$('[data-look]').forEach(b=>b.addEventListener('click',()=>{look=b.dataset.look;$('#person-preview').dataset.look=look;$$('[data-look]').forEach(x=>x.classList.toggle('active',x===b))}));
$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;$$('[data-mode]').forEach(x=>x.classList.toggle('active',x===b))}));
$$('.bottom-nav button').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.nav==='talk'&&!controller?.encounter)return;show(b.dataset.nav)}));
$('#to-brain').onclick=()=>{resetActors();show('brain')};$('#to-setup').onclick=()=>show('setup');
$('#play').onclick=()=>{makeController();controller.start({mode});show('talk');if(mode==='auto')startAuto()};
$('#next-turn').onclick=()=>{if(mode==='auto'){autoTimer?stopAuto():startAuto()}else doNext()};$('#trace-btn').onclick=showTrace;
$('#rerun').onclick=()=>{replayMode=true;resetActors();controller=null;show('brain')};overlay.addEventListener('click',e=>{if(e.target===overlay)hideOverlay()});
show('person');
