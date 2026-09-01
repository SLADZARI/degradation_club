import { VerticalSliceController } from '../app/vertical-slice-controller.mjs';
import { CRITICISM_IDEA_SCENARIO, createCriticismActors } from '../scenarios/criticism-idea.mjs';
import { compareRuns } from '../encounter/result.mjs';
import { NODE_SPECS } from '../core/model.mjs';
import { CharacterRenderer, APPEARANCE_LAYERS } from '../render/character-renderer.mjs';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const app=$('#app'),overlay=$('#overlay'),topStatus=$('#top-status');
const CHARACTER_ASSET='./assets/characters/character-01/character-01-layered.svg';
const DEFAULT_APPEARANCE={hat:true,glasses:true,beard:true,accessory:true,outfit:true,shoes:true};
const MARTA_APPEARANCE={hat:false,glasses:false,beard:false,accessory:false,outfit:true,shoes:true};
let playerAppearance={...DEFAULT_APPEARANCE};
let mode='auto',actors=createCriticismActors(),controller=null,autoTimer=null;
let baselineEncounter=null,replayMode=false,firstRunConfig=null,replayTargetType=null;
let previewRenderer=null;

async function mountCharacterAssets(){
  const svg=await fetch(CHARACTER_ASSET).then(r=>{if(!r.ok)throw new Error(`Character asset ${r.status}`);return r.text()});
  for(const id of ['person-preview','actor-a','actor-b']){
    const root=$(`#${id}`);root.innerHTML=svg;
    const node=root.querySelector('svg');node?.setAttribute('aria-hidden','true');
  }
  previewRenderer=new CharacterRenderer({side:'A',root:$('#person-preview')});
  syncAppearancePanel();renderPreview();
}

function show(screen){
  app.dataset.screen=screen;topStatus.textContent=screen.toUpperCase();
  $$('.screen').forEach(el=>el.hidden=el.dataset.view!==screen);
  $$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.nav===screen));
  if(screen==='brain'){renderBrain();$('#replay-note').hidden=!replayMode}
  if(screen==='talk')renderTalk();
}
function resetActors(){
  actors=createCriticismActors();
  actors.A.visual={...(actors.A.visual||{}),appearance:{...playerAppearance}};
  actors.B.visual={...(actors.B.visual||{}),appearance:{...MARTA_APPEARANCE}};
}
function renderPreview(){
  previewRenderer?.render({state:actors.A.state,face:{},visual:{appearance:playerAppearance}});
}
function syncAppearancePanel(){
  $$('[data-part]').forEach(b=>{const on=playerAppearance[b.dataset.part]!==false;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
}
function toggleAppearance(part){
  if(!APPEARANCE_LAYERS.includes(part))return;
  playerAppearance={...playerAppearance,[part]:!playerAppearance[part]};
  syncAppearancePanel();renderPreview();
}
function resetAppearance(){
  playerAppearance={hat:false,glasses:false,beard:false,accessory:false,outfit:true,shoes:true};
  syncAppearancePanel();renderPreview();
}

function familyLabel(type){return NODE_SPECS[type]?.family||'NODE'}
function title(type){return NODE_SPECS[type]?.title||type}
function nodeValue(n){const f=familyLabel(n.type);if(f==='IMPULSE')return `W${n.p?.weight||1}`;if(n.type==='repeat')return `×${n.p?.count||1}`;if(f==='STATE')return `+${n.p?.delta??1}`;return ''}
function nodeSubtitle(n){const map={criticism:'что произошло',resentment:'что накопилось',beright:'чего он хочет',explain:'что он делает',repeat:'сколько раз'};return map[n.type]||familyLabel(n.type)}
function readBrainConfig(){const g=actors.A.brainGraph;return {impulseWeight:g.nodes.find(n=>n.type==='beright')?.p?.weight??3,repeatCount:g.nodes.find(n=>n.type==='repeat')?.p?.count??4}}
function applyBrainConfig(config){if(!config)return;const g=actors.A.brainGraph,imp=g.nodes.find(n=>n.type==='beright'),rep=g.nodes.find(n=>n.type==='repeat');if(imp)imp.p.weight=config.impulseWeight;if(rep)rep.p.count=config.repeatCount}

function renderBrain(){
  const graph=actors.A.brainGraph;
  $('#brain-graph').innerHTML=graph.nodes.map(n=>`<div class="brain-node ${replayMode&&replayTargetType&&n.type===replayTargetType?'replay-target':''}" data-node="${n.id}"><span class="family">${familyLabel(n.type)}</span><span class="copy"><strong>${title(n.type)}</strong><small>${nodeSubtitle(n)}</small></span><span class="value">${nodeValue(n)}</span></div>`).join('');
  const impulse=graph.nodes.find(n=>n.type==='beright'),repeat=graph.nodes.find(n=>n.type==='repeat');
  const lockImpulse=replayMode&&replayTargetType&&replayTargetType!=='beright',lockRepeat=replayMode&&replayTargetType&&replayTargetType!=='repeat';
  $('#brain-editor').innerHTML=`<label class="${lockImpulse?'locked':''}">БЫТЬ ПРАВЫМ <span>WEIGHT ${impulse.p.weight}</span><input id="impulse-range" type="range" min="1" max="5" value="${impulse.p.weight}" ${lockImpulse?'disabled':''}></label><label class="${lockRepeat?'locked':''}">ПОВТОРИТЬ <span>×${repeat.p.count}</span><input id="repeat-range" type="range" min="1" max="5" value="${repeat.p.count}" ${lockRepeat?'disabled':''}></label>`;
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
function makeController(){
  const rendererA=new CharacterRenderer({side:'A',root:$('#actor-a')}),rendererB=new CharacterRenderer({side:'B',root:$('#actor-b')});
  controller=new VerticalSliceController({scenario:CRITICISM_IDEA_SCENARIO,actors,renderers:{A:rendererA,B:rendererB},onEvent:handleEvent});
}
function handleEvent(evt){if(evt.type==='TURN'){renderDelta(evt.trace);renderTalk()}if(evt.type==='HOT_PATCH'){stopAuto();showHotPatch(evt.breakpoint)}if(evt.type==='RESULT'){stopAuto();showResult(evt.result)}if(evt.type==='PATCH'){hideOverlay();renderTalk();if(mode==='auto')startAuto()}}
function doNext(){if(!controller?.encounter||controller.encounter.result)return;const out=controller.next();renderTalk();if(out?.result)showResult(controller.result())}
function startAuto(){stopAuto();autoTimer=setInterval(()=>{if(controller?.encounter?.status==='HOT_PATCH'||controller?.encounter?.result)return stopAuto();doNext()},850);renderTalk()}
function stopAuto(){if(autoTimer){clearInterval(autoTimer);autoTimer=null}if(controller?.encounter)renderTalk()}

function showHotPatch(bp){
  const actor=controller.encounter.actors[bp.actorId],ids=bp.nodeIds||[],chain=ids.map(id=>title(actor.brainGraph.nodes.find(n=>n.id===id)?.type)).join(' → ');
  const repeat=ids.map(id=>actor.brainGraph.nodes.find(n=>n.id===id)).find(n=>n?.type==='repeat'),impulse=ids.map(id=>actor.brainGraph.nodes.find(n=>n.id===id)).find(n=>familyLabel(n?.type)==='IMPULSE');
  overlay.innerHTML=`<div class="overlay-card"><p class="kicker">HOT PATCH</p><h3>МОЗГ НАГРЕВАЕТСЯ.</h3><p>Сейчас эта цепочка собирается сделать хуже.</p><div class="chain">${chain}</div><div class="patch-grid">${repeat?`<button data-patch="repeat">REPEAT ×${repeat.p.count} → ×${Math.max(1,repeat.p.count-1)}</button>`:''}${impulse?`<button data-patch="impulse">${title(impulse.type)} ${impulse.p.weight} → ${Math.max(1,impulse.p.weight-1)}</button>`:''}<button data-patch="skip">НИЧЕГО НЕ ТРОГАТЬ</button></div></div>`;overlay.hidden=false;
  $('[data-patch=repeat]')?.addEventListener('click',()=>controller.patch({kind:'reduce-repeat',actorId:bp.actorId,nodeId:repeat.id}));$('[data-patch=impulse]')?.addEventListener('click',()=>controller.patch({kind:'reduce-impulse',actorId:bp.actorId,nodeId:impulse.id}));$('[data-patch=skip]').addEventListener('click',()=>{controller.declinePatch();hideOverlay();if(mode==='auto')startAuto()});
}
function showTrace(){const trace=controller?.encounter?.traces.at(-1);if(!trace)return;overlay.innerHTML=`<div class="overlay-card"><p class="kicker">TRACE</p><h3>ПОЧЕМУ ЭТО СЛУЧИЛОСЬ?</h3><div class="trace-list">TRIGGER: ${trace.trigger}\nPATH: ${trace.visitedNodes.join(' → ')}\nIMPULSE: ${trace.selectedImpulse}\nREACTION: ${trace.selectedReaction}\nLOOPS: ${trace.loops}\nMEMORY: ${(trace.memoryChanges||[]).map(m=>`${m.key} ${m.before}→${m.after}`).join(', ')||'—'}</div><button class="primary" id="close-overlay">ЗАКРЫТЬ</button></div>`;overlay.hidden=false;$('#close-overlay').onclick=hideOverlay}
function hideOverlay(){overlay.hidden=true;overlay.innerHTML=''}
function comparisonHtml(c){const fmt=v=>`${v>0?'+':''}${v}`;return `<small>БЫЛО / СТАЛО</small><strong>${c.sameScenario?'ТОТ ЖЕ СЦЕНАРИЙ':'СЦЕНАРИЙ ИЗМЕНИЛСЯ'}</strong><div class="compare-grid"><span>BRAIN ${fmt(c.metrics.brain)}</span><span>TENSION ${fmt(c.metrics.tension)}</span><span>CONTACT ${fmt(c.metrics.contact)}</span><span>ENERGY ${fmt(c.metrics.energy)}</span></div>`}
function showResult(result){
  show('result');$('#result-title').textContent=result.punchline;$('#result-cause').textContent=result.stageB.cause;$('#result-node').textContent=result.stageC.nodeType?title(result.stageC.nodeType):'—';
  if(!baselineEncounter){baselineEncounter=structuredClone(controller.encounter);replayTargetType=result.stageC.nodeType||'repeat';$('#comparison').hidden=true;$('#rerun').textContent='ИЗМЕНИТЬ ОДНУ ВЕЩЬ →'}
  else if(replayMode){const c=compareRuns(baselineEncounter,controller.encounter);$('#comparison').innerHTML=comparisonHtml(c);$('#comparison').hidden=false;$('#rerun').textContent='ЕЩЁ ОДИН ЭКСПЕРИМЕНТ →'}
}
function prepareReplay(){
  replayMode=true;playerAppearance={...(firstRunConfig?.appearance||playerAppearance)};resetActors();applyBrainConfig(firstRunConfig);controller=null;
  $('#replay-note').textContent=`КОНТРФАКТ: МЕНЯЕМ ТОЛЬКО «${title(replayTargetType)}». ОСТАЛЬНОЕ ЗАФИКСИРОВАНО.`;show('brain');
}

$$('[data-part]').forEach(b=>b.addEventListener('click',()=>toggleAppearance(b.dataset.part)));
$('#appearance-reset').onclick=resetAppearance;
$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;$$('[data-mode]').forEach(x=>x.classList.toggle('active',x===b))}));
$$('.bottom-nav button').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.nav==='talk'&&!controller?.encounter)return;show(b.dataset.nav)}));
$('#to-brain').onclick=()=>{resetActors();show('brain')};$('#to-setup').onclick=()=>show('setup');
$('#play').onclick=()=>{if(!replayMode&&!firstRunConfig)firstRunConfig={...readBrainConfig(),appearance:{...playerAppearance},mode};makeController();controller.start({mode});show('talk');if(mode==='auto')startAuto()};
$('#next-turn').onclick=()=>{if(mode==='auto'){autoTimer?stopAuto():startAuto()}else doNext()};$('#trace-btn').onclick=showTrace;
$('#rerun').onclick=()=>{if(!baselineEncounter)return;if(replayMode){baselineEncounter=null;firstRunConfig=null;replayTargetType=null;replayMode=false;resetActors();controller=null;show('brain')}else prepareReplay()};
overlay.addEventListener('click',e=>{if(e.target===overlay)hideOverlay()});

resetActors();
await mountCharacterAssets();
show('person');
