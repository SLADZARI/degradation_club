import { VerticalSliceController } from '../app/vertical-slice-controller.mjs';
import { CRITICISM_IDEA_SCENARIO, createCriticismActors } from '../scenarios/criticism-idea.mjs';
import { compareRuns } from '../encounter/result.mjs';
import { NODE_SPECS } from '../core/model.mjs';
import { CharacterRenderer, APPEARANCE_LAYERS } from '../render/character-renderer.mjs';
import { graphLayers, graphEdgeIds } from './brain-layout.mjs';
import {
  CHARACTER_REGISTRY,
  characterSpec,
  characterAssetText,
  loadCharacterContract,
  SHARED_APPEARANCE_LAYERS,
  CHARACTER_OWNED_LAYERS,
  SHARED_APPEARANCE_CATEGORIES,
  CHARACTER_OWNED_CATEGORIES,
  appearanceForCharacter,
  variantOptions,
  variantKey,
  hasVariantContract
} from '../render/character-registry.mjs';
import { createOpponentProfile, freshOpponentSeed } from '../opponent/generator.mjs';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const app=$('#app'),overlay=$('#overlay'),topStatus=$('#top-status');
const VARIANT_PART_CATEGORY=Object.freeze({hat:'hat',glasses:'glasses',beard:'facialHair',accessory:'accessory',outfit:'outfit',shoes:'shoes'});
const EMPTY_SHARED_VARIANTS=()=>({hatVariant:null,glassesVariant:null,facialHairVariant:null,accessoryVariant:null});
const EMPTY_OWNED_VARIANTS=()=>({outfitVariant:null,shoesVariant:null});
const EMPTY_COLORS=()=>({outfitPrimary:null,outfitSecondary:null,shoesPrimary:null});

await Promise.allSettled(Object.keys(CHARACTER_REGISTRY).map(id=>loadCharacterContract(id)));

let currentCharacterId='character-01';
let sharedAppearance={hat:true,glasses:true,beard:true,accessory:true,...EMPTY_SHARED_VARIANTS()};
let ownedAppearance={
  'character-01':{outfit:true,shoes:true,...EMPTY_OWNED_VARIANTS()},
  'character-02':{outfit:true,shoes:true,...EMPTY_OWNED_VARIANTS()}
};
let appearanceColors={'character-01':EMPTY_COLORS(),'character-02':EMPTY_COLORS()};
let activeAppearanceCategory='hat';
const explicitSeed=new URLSearchParams(location.search).get('seed');
let opponentSeed=explicitSeed||freshOpponentSeed();
let opponentProfile=createOpponentProfile(opponentSeed);
let mode='auto',actors=createCriticismActors({opponentProfile}),controller=null,autoTimer=null;
let baselineEncounter=null,replayMode=false,firstRunConfig=null,replayTargetType=null,previewRenderer=null;
let activeBrainNodeId=null;

function playerAppearance(){return appearanceForCharacter(currentCharacterId,sharedAppearance,ownedAppearance[currentCharacterId],appearanceColors[currentCharacterId])}
function opponentAppearance(){return appearanceForCharacter(opponentProfile.baseCharacterId,opponentProfile.sharedAppearance,opponentProfile.ownedAppearance,opponentProfile.colors)}
async function fetchAsset(id){const cached=characterAssetText(id);if(cached)return cached;const spec=characterSpec(id);return fetch(spec.asset).then(r=>{if(!r.ok)throw new Error(`Character asset ${id} ${r.status}`);return r.text()})}
async function mountAsset(rootId,id){const root=$(`#${rootId}`),spec=characterSpec(id);root.innerHTML=await fetchAsset(id);root.dataset.character=id;root.querySelector('svg')?.setAttribute('aria-hidden','true');return new CharacterRenderer({side:rootId==='actor-b'?'B':'A',root,rigFallback:spec.rigFallback})}
async function mountCharacterAssets(){previewRenderer=await mountAsset('person-preview',currentCharacterId);await mountAsset('actor-a',currentCharacterId);await mountAsset('actor-b',opponentProfile.baseCharacterId);syncAppearancePanel();renderPreview();renderOpponentCard()}
async function remountPlayerCharacter(){previewRenderer=await mountAsset('person-preview',currentCharacterId);await mountAsset('actor-a',currentCharacterId);syncCharacterSwitch();syncAppearancePanel();resetActors();renderPreview()}
async function remountOpponent(){await mountAsset('actor-b',opponentProfile.baseCharacterId);resetActors();renderOpponentCard()}

function show(screen){app.dataset.screen=screen;topStatus.textContent=screen.toUpperCase();$$('.screen').forEach(el=>el.hidden=el.dataset.view!==screen);$$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.nav===screen));if(screen==='brain'){renderBrain();$('#replay-note').hidden=!replayMode}if(screen==='setup')renderOpponentCard();if(screen==='talk')renderTalk()}
function resetActors(){actors=createCriticismActors({opponentProfile});actors.A.visual={...(actors.A.visual||{}),characterId:currentCharacterId,appearance:playerAppearance()};actors.B.visual={...(actors.B.visual||{}),characterId:opponentProfile.baseCharacterId,appearance:opponentAppearance(),opponentPresetId:opponentProfile.presetId}}
function renderPreview(){previewRenderer?.render({state:actors.A.state,face:{},visual:{characterId:currentCharacterId,appearance:playerAppearance()}})}
function renderOpponentCard(){const card=$('#opponent-card');if(!card)return;card.dataset.preset=opponentProfile.presetId;card.dataset.character=opponentProfile.baseCharacterId;$('#opponent-name').textContent=opponentProfile.name.toUpperCase();$('#opponent-preset').textContent=opponentProfile.presetLabel;$('#opponent-description').textContent=opponentProfile.description;$('#opponent-seed').textContent=`ОПЫТ ${String(opponentSeed).slice(0,12)}`}
async function rerollOpponent(){if(replayMode||baselineEncounter)return;opponentSeed=freshOpponentSeed();opponentProfile=createOpponentProfile(opponentSeed);await remountOpponent()}
function syncCharacterSwitch(){$$('.character-switch [data-character]').forEach(b=>{const on=b.dataset.character===currentCharacterId;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))})}

function categoryForPart(part){return VARIANT_PART_CATEGORY[part]||part}
function selectionBucket(category){return SHARED_APPEARANCE_CATEGORIES.includes(category)?sharedAppearance:ownedAppearance[currentCharacterId]}
function selectedVariant(category){const key=variantKey(category);return key?selectionBucket(category)?.[key]??null:null}
function sanitizeVariantSelections(){
  if(!hasVariantContract(currentCharacterId))return;
  const normalized=playerAppearance();
  for(const category of SHARED_APPEARANCE_CATEGORIES){const key=variantKey(category);if(key)sharedAppearance[key]=normalized[key]??null}
  for(const category of CHARACTER_OWNED_CATEGORIES){const key=variantKey(category);if(key)ownedAppearance[currentCharacterId][key]=normalized[key]??null}
  appearanceColors[currentCharacterId]={...appearanceColors[currentCharacterId],...(normalized.colors||{})};
}
function renderVariantOptions(){
  const rack=$('#variant-options');if(!rack)return;
  const options=variantOptions(currentCharacterId,activeAppearanceCategory);
  if(!options.length){rack.hidden=true;rack.innerHTML='';return}
  const active=selectedVariant(activeAppearanceCategory);
  const baseLabel=CHARACTER_OWNED_CATEGORIES.includes(activeAppearanceCategory)?'БАЗА':'НЕТ';
  rack.hidden=false;
  rack.dataset.category=activeAppearanceCategory;
  rack.innerHTML=`<button data-variant="" class="${active==null?'active':''}">${baseLabel}</button>${options.map((id,i)=>`<button data-variant="${id}" class="${id===active?'active':''}">${String(i+1).padStart(2,'0')}</button>`).join('')}`;
  rack.querySelectorAll('[data-variant]').forEach(button=>button.addEventListener('click',()=>selectAppearanceVariant(activeAppearanceCategory,button.dataset.variant||null)));
}
function syncAppearancePanel(){
  const appearance=playerAppearance();
  $$('[data-part]').forEach(b=>{
    const part=b.dataset.part,category=categoryForPart(part),options=variantOptions(currentCharacterId,category);
    const usesVariants=options.length>0;
    const on=usesVariants?selectedVariant(category)!=null:appearance[part]!==false;
    b.classList.toggle('active',on);
    b.classList.toggle('has-variants',usesVariants);
    b.setAttribute('aria-pressed',String(on));
    b.dataset.scope=SHARED_APPEARANCE_CATEGORIES.includes(category)?'shared':'owned';
    b.dataset.variantCount=String(options.length);
    if(usesVariants)b.setAttribute('aria-expanded',String(activeAppearanceCategory===category&&!$('#variant-options')?.hidden));else b.removeAttribute('aria-expanded');
  });
  renderVariantOptions();
}
function commitAppearanceChange(){sanitizeVariantSelections();syncAppearancePanel();resetActors();renderPreview()}
function toggleAppearance(part){
  const category=categoryForPart(part),options=variantOptions(currentCharacterId,category);
  if(options.length){activeAppearanceCategory=category;syncAppearancePanel();return}
  if(!APPEARANCE_LAYERS.includes(part))return;
  if(SHARED_APPEARANCE_LAYERS.includes(part))sharedAppearance={...sharedAppearance,[part]:!sharedAppearance[part]};
  else if(CHARACTER_OWNED_LAYERS.includes(part))ownedAppearance={...ownedAppearance,[currentCharacterId]:{...ownedAppearance[currentCharacterId],[part]:!ownedAppearance[currentCharacterId][part]}};
  commitAppearanceChange();
}
function selectAppearanceVariant(category,value){
  const key=variantKey(category),options=variantOptions(currentCharacterId,category);if(!key||!options.length)return;
  const next=value&&options.includes(value)?value:null;
  if(SHARED_APPEARANCE_CATEGORIES.includes(category))sharedAppearance={...sharedAppearance,[key]:next};
  else ownedAppearance={...ownedAppearance,[currentCharacterId]:{...ownedAppearance[currentCharacterId],[key]:next}};
  commitAppearanceChange();
}
function resetAppearance(){
  sharedAppearance={hat:false,glasses:false,beard:false,accessory:false,...EMPTY_SHARED_VARIANTS()};
  ownedAppearance={...ownedAppearance,[currentCharacterId]:{outfit:true,shoes:true,...EMPTY_OWNED_VARIANTS()}};
  appearanceColors={...appearanceColors,[currentCharacterId]:EMPTY_COLORS()};
  commitAppearanceChange();
}
async function chooseCharacter(id){if(id===currentCharacterId)return;currentCharacterId=id;sanitizeVariantSelections();await remountPlayerCharacter()}

function familyLabel(type){return NODE_SPECS[type]?.family||'NODE'}
function title(type){return NODE_SPECS[type]?.title||type}
function nodeValue(n){const f=familyLabel(n.type);if(f==='IMPULSE')return `W${n.p?.weight||1}`;if(n.type==='repeat')return `×${n.p?.count||1}`;if(f==='STATE')return `+${n.p?.delta??1}`;return ''}
function nodeSubtitle(n){const map={criticism:'что произошло',resentment:'что накопилось',beright:'сила желания доказать',explain:'что он делает',repeat:'сколько раз повторит'};return map[n.type]||familyLabel(n.type)}
function brainControl(n){if(n?.type==='beright')return {key:'weight',min:1,max:5,label:'СИЛА ИМПУЛЬСА',format:v=>`W${v}`};if(n?.type==='repeat')return {key:'count',min:1,max:5,label:'КОЛИЧЕСТВО ПОВТОРОВ',format:v=>`×${v}`};return null}
function brainNodeLocked(n){return Boolean(replayMode&&replayTargetType&&brainControl(n)&&n.type!==replayTargetType)}
function brainNodeEditorHtml(n){
  const control=brainControl(n);if(!control||activeBrainNodeId!==n.id)return '';
  const value=Number(n.p?.[control.key]??control.min),locked=brainNodeLocked(n);
  return `<div class="brain-node-editor" data-editor-for="${n.id}"><div class="editor-head"><strong>${control.label}</strong><span>${locked?'ЗАБЛОКИРОВАНО В ЭТОМ ПОВТОРЕ':'МЕНЯЕТ ПОВЕДЕНИЕ'}</span></div><div class="brain-stepper"><button type="button" data-brain-dec="${n.id}" ${locked||value<=control.min?'disabled':''}>−</button><output>${control.format(value)}</output><button type="button" data-brain-inc="${n.id}" ${locked||value>=control.max?'disabled':''}>+</button></div></div>`;
}
function brainNodeHtml(n){
  const editable=Boolean(brainControl(n)),locked=brainNodeLocked(n),selected=activeBrainNodeId===n.id,target=replayMode&&replayTargetType&&n.type===replayTargetType;
  const cls=`brain-node${editable?' is-editable':''}${locked?' is-locked':''}${selected?' is-selected':''}${target?' replay-target':''}`;
  const inner=`<span class="family">${familyLabel(n.type)}</span><span class="copy"><strong>${title(n.type)}</strong><small>${nodeSubtitle(n)}</small></span><span class="value">${nodeValue(n)}</span>${editable?'<span class="edit-mark">МЕНЯЕТСЯ</span>':''}`;
  return `<div class="brain-node-wrap" data-brain-node-wrap="${n.id}">${editable?`<button type="button" class="${cls}" data-brain-node="${n.id}" aria-expanded="${selected}" ${locked?'aria-disabled="true"':''}>${inner}</button>`:`<div class="${cls}" data-brain-node-static="${n.id}">${inner}</div>`}${brainNodeEditorHtml(n)}</div>`;
}
function drawBrainEdges(){
  const host=$('#brain-graph'),canvas=host?.querySelector('.brain-canvas'),svg=host?.querySelector('.brain-links');if(!host||!canvas||!svg)return;
  const graph=actors.A.brainGraph,box=canvas.getBoundingClientRect(),width=Math.max(canvas.scrollWidth,canvas.clientWidth),height=Math.max(canvas.scrollHeight,canvas.clientHeight);
  svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.setAttribute('width',String(width));svg.setAttribute('height',String(height));
  svg.innerHTML=graphEdgeIds(graph).map(edge=>{
    const from=canvas.querySelector(`[data-brain-node-wrap="${CSS.escape(edge.from)}"]`),to=canvas.querySelector(`[data-brain-node-wrap="${CSS.escape(edge.to)}"]`);if(!from||!to)return '';
    const a=from.getBoundingClientRect(),b=to.getBoundingClientRect(),x1=a.left+a.width/2-box.left,y1=a.bottom-box.top,x2=b.left+b.width/2-box.left,y2=b.top-box.top,mid=y1+(y2-y1)/2;
    return `<polyline class="brain-link" points="${x1},${y1} ${x1},${mid} ${x2},${mid} ${x2},${y2}"></polyline>`;
  }).join('');
}
function readBrainConfig(){const g=actors.A.brainGraph;return {impulseWeight:g.nodes.find(n=>n.type==='beright')?.p?.weight??3,repeatCount:g.nodes.find(n=>n.type==='repeat')?.p?.count??4}}
function applyBrainConfig(config){if(!config)return;const g=actors.A.brainGraph,imp=g.nodes.find(n=>n.type==='beright'),rep=g.nodes.find(n=>n.type==='repeat');if(imp)imp.p.weight=config.impulseWeight;if(rep)rep.p.count=config.repeatCount}
function selectBrainNode(id){const node=actors.A.brainGraph.nodes.find(n=>n.id===id);if(!node||!brainControl(node)||brainNodeLocked(node))return;activeBrainNodeId=activeBrainNodeId===id?null:id;renderBrain()}
function nudgeBrainNode(id,delta){
  const node=actors.A.brainGraph.nodes.find(n=>n.id===id),control=brainControl(node);if(!node||!control||brainNodeLocked(node))return;
  const current=Number(node.p?.[control.key]??control.min),next=Math.max(control.min,Math.min(control.max,current+delta));node.p[control.key]=next;activeBrainNodeId=id;renderBrain();
}
function renderBrain(){
  const graph=actors.A.brainGraph,layers=graphLayers(graph),editable=graph.nodes.filter(brainControl);
  if(activeBrainNodeId&&!graph.nodes.some(n=>n.id===activeBrainNodeId&&brainControl(n)))activeBrainNodeId=null;
  if(!activeBrainNodeId){const replayTarget=editable.find(n=>replayMode&&n.type===replayTargetType&&!brainNodeLocked(n));activeBrainNodeId=(replayTarget||editable[0])?.id||null}
  const maxLanes=Math.max(1,...layers.map(layer=>layer.length));
  $('#brain-graph').innerHTML=`<div class="brain-canvas" style="--brain-max-lanes:${maxLanes}"><svg class="brain-links" aria-hidden="true"></svg><div class="brain-layers">${layers.map((layer,depth)=>`<div class="brain-layer" data-depth="${depth}" style="--lane-count:${Math.max(1,layer.length)}">${layer.map(brainNodeHtml).join('')}</div>`).join('')}</div></div>`;
  $$('[data-brain-node]').forEach(button=>button.addEventListener('click',()=>selectBrainNode(button.dataset.brainNode)));
  $$('[data-brain-dec]').forEach(button=>button.addEventListener('click',e=>{e.stopPropagation();nudgeBrainNode(button.dataset.brainDec,-1)}));
  $$('[data-brain-inc]').forEach(button=>button.addEventListener('click',e=>{e.stopPropagation();nudgeBrainNode(button.dataset.brainInc,1)}));
  const selected=graph.nodes.find(n=>n.id===activeBrainNodeId),control=brainControl(selected),note=$('#brain-editor');
  if(selected&&control){const value=selected.p?.[control.key]??control.min;note.textContent=brainNodeLocked(selected)?`«${title(selected.type)}» ЗАБЛОКИРОВАН В ЭТОМ ПОВТОРЕ.`:`СЕЙЧАС: «${title(selected.type)}» ${control.format(value)}. − / + МЕНЯЮТ ТОЛЬКО ЭТОТ УЗЕЛ.`;note.classList.toggle('changed',!brainNodeLocked(selected))}else{note.textContent='НАЖМИ НА ЖЁЛТЫЙ УЗЕЛ, ЧТОБЫ ИЗМЕНИТЬ ЕГО.';note.classList.remove('changed')}
  requestAnimationFrame(drawBrainEdges);
}
function metricRow(label,key){const a=controller?.encounter?.actors.A.state[key]??actors.A.state[key],b=controller?.encounter?.actors.B.state[key]??actors.B.state[key];const danger=(key==='brain'&&(a>=85||b>=85))||(key==='energy'&&(a<=25||b<=25))||(key==='contact'&&(a<=20||b<=20))||(key==='tension'&&(a>=85||b>=85));return `<div class="metric ${danger?'danger':''}"><label>${label}</label><span class="bar"><i style="width:${Math.max(0,Math.min(100,a))}%"></i></span><span class="n">${Math.round(a)}</span><span class="n">${Math.round(b)}</span><span class="bar"><i style="width:${Math.max(0,Math.min(100,b))}%"></i></span></div>`}
function renderTalk(){if(!controller?.encounter)return;const e=controller.encounter;$('#turn').textContent=e.turn;$('#actor-a-name').textContent=e.actors.A.name.toUpperCase();$('#actor-b-name').textContent=e.actors.B.name.toUpperCase();$('#metrics').innerHTML=metricRow('ENERGY','energy')+metricRow('BRAIN','brain')+metricRow('TENSION','tension')+metricRow('CONTACT','contact');const transcript=e.transcript.slice(-5);$('#dialogue').innerHTML=transcript.length?transcript.map(x=>`<div class="bubble ${x.actorId==='A'?'a':'b'}"><small>${e.actors[x.actorId].name.toUpperCase()}</small>${x.phrase||'…'}</div>`).join(''):'<p class="empty">Никто ещё ничего не сказал.</p>';$('#next-turn').textContent=mode==='auto'?(autoTimer?'PAUSE':'RESUME'):'NEXT TURN →'}
function renderDelta(trace){if(!trace)return $('#delta').textContent='';const d=trace.metricDeltas.self,m=trace.memoryChanges?.[0];const parts=Object.entries(d).filter(([,v])=>v).map(([k,v])=>`${k.toUpperCase()} ${v>0?'+':''}${Number(v.toFixed?.(1)??v)}`);if(m)parts.unshift(`${String(m.key).toUpperCase()} ${m.before}→${m.after}`);const line=parts.join(' · ');$('#delta').textContent=line;setTimeout(()=>{if($('#delta').textContent===line)$('#delta').textContent=''},1100)}
function makeController(){const specA=characterSpec(currentCharacterId),specB=characterSpec(opponentProfile.baseCharacterId);const rendererA=new CharacterRenderer({side:'A',root:$('#actor-a'),rigFallback:specA.rigFallback}),rendererB=new CharacterRenderer({side:'B',root:$('#actor-b'),rigFallback:specB.rigFallback});controller=new VerticalSliceController({scenario:CRITICISM_IDEA_SCENARIO,actors,renderers:{A:rendererA,B:rendererB},onEvent:handleEvent})}
function handleEvent(evt){if(evt.type==='TURN'){renderDelta(evt.trace);renderTalk()}if(evt.type==='HOT_PATCH'){stopAuto();showHotPatch(evt.breakpoint)}if(evt.type==='RESULT'){stopAuto();showResult(evt.result)}if(evt.type==='PATCH'){hideOverlay();renderTalk();if(mode==='auto')startAuto()}}
function doNext(){if(!controller?.encounter||controller.encounter.result)return;const out=controller.next();renderTalk();if(out?.result)showResult(controller.result())}
function startAuto(){stopAuto();autoTimer=setInterval(()=>{if(controller?.encounter?.status==='HOT_PATCH'||controller?.encounter?.result)return stopAuto();doNext()},850);renderTalk()}
function stopAuto(){if(autoTimer){clearInterval(autoTimer);autoTimer=null}if(controller?.encounter)renderTalk()}
function showHotPatch(bp){const actor=controller.encounter.actors[bp.actorId],ids=bp.nodeIds||[],chain=ids.map(id=>title(actor.brainGraph.nodes.find(n=>n.id===id)?.type)).join(' → ');const repeat=ids.map(id=>actor.brainGraph.nodes.find(n=>n.id===id)).find(n=>n?.type==='repeat'),impulse=ids.map(id=>actor.brainGraph.nodes.find(n=>n.id===id)).find(n=>familyLabel(n?.type)==='IMPULSE');overlay.innerHTML=`<div class="overlay-card"><p class="kicker">HOT PATCH</p><h3>МОЗГ НАГРЕВАЕТСЯ.</h3><p>Сейчас эта цепочка собирается сделать хуже.</p><div class="chain">${chain}</div><div class="patch-grid">${repeat?`<button data-patch="repeat">REPEAT ×${repeat.p.count} → ×${Math.max(1,repeat.p.count-1)}</button>`:''}${impulse?`<button data-patch="impulse">${title(impulse.type)} ${impulse.p.weight} → ${Math.max(1,impulse.p.weight-1)}</button>`:''}<button data-patch="skip">НИЧЕГО НЕ ТРОГАТЬ</button></div></div>`;overlay.hidden=false;$('[data-patch=repeat]')?.addEventListener('click',()=>controller.patch({kind:'reduce-repeat',actorId:bp.actorId,nodeId:repeat.id}));$('[data-patch=impulse]')?.addEventListener('click',()=>controller.patch({kind:'reduce-impulse',actorId:bp.actorId,nodeId:impulse.id}));$('[data-patch=skip]').addEventListener('click',()=>{controller.declinePatch();hideOverlay();if(mode==='auto')startAuto()})}
function showTrace(){const trace=controller?.encounter?.traces.at(-1);if(!trace)return;overlay.innerHTML=`<div class="overlay-card"><p class="kicker">TRACE</p><h3>ПОЧЕМУ ЭТО СЛУЧИЛОСЬ?</h3><div class="trace-list">TRIGGER: ${trace.trigger}\nPATH: ${trace.visitedNodes.join(' → ')}\nIMPULSE: ${trace.selectedImpulse}\nREACTION: ${trace.selectedReaction}\nLOOPS: ${trace.loops}\nMEMORY: ${(trace.memoryChanges||[]).map(m=>`${m.key} ${m.before}→${m.after}`).join(', ')||'—'}</div><button class="primary" id="close-overlay">ЗАКРЫТЬ</button></div>`;overlay.hidden=false;$('#close-overlay').onclick=hideOverlay}
function hideOverlay(){overlay.hidden=true;overlay.innerHTML=''}
function comparisonHtml(c){const fmt=v=>`${v>0?'+':''}${v}`;return `<small>БЫЛО / СТАЛО</small><strong>${c.sameScenario?'ТОТ ЖЕ СЦЕНАРИЙ':'СЦЕНАРИЙ ИЗМЕНИЛСЯ'}</strong><div class="compare-grid"><span>BRAIN ${fmt(c.metrics.brain)}</span><span>TENSION ${fmt(c.metrics.tension)}</span><span>CONTACT ${fmt(c.metrics.contact)}</span><span>ENERGY ${fmt(c.metrics.energy)}</span></div>`}
function showResult(result){show('result');$('#result-title').textContent=result.punchline;$('#result-cause').textContent=result.stageB.cause;$('#result-node').textContent=result.stageC.nodeType?title(result.stageC.nodeType):'—';if(!baselineEncounter){baselineEncounter=structuredClone(controller.encounter);replayTargetType=result.stageC.nodeType||'repeat';$('#comparison').hidden=true;$('#rerun').textContent='ИЗМЕНИТЬ ОДНУ ВЕЩЬ →'}else if(replayMode){const c=compareRuns(baselineEncounter,controller.encounter);$('#comparison').innerHTML=comparisonHtml(c);$('#comparison').hidden=false;$('#rerun').textContent='ЕЩЁ ОДИН ЭКСПЕРИМЕНТ →'}}
function prepareReplay(){replayMode=true;currentCharacterId=firstRunConfig?.characterId||currentCharacterId;sharedAppearance={...(firstRunConfig?.sharedAppearance||sharedAppearance)};ownedAppearance=structuredClone(firstRunConfig?.ownedAppearance||ownedAppearance);appearanceColors=structuredClone(firstRunConfig?.appearanceColors||appearanceColors);opponentSeed=firstRunConfig.opponentSeed;opponentProfile=structuredClone(firstRunConfig.opponentProfile);resetActors();applyBrainConfig(firstRunConfig);controller=null;activeBrainNodeId=null;$('#replay-note').textContent=`КОНТРФАКТ: МЕНЯЕМ ТОЛЬКО «${title(replayTargetType)}». СОПЕРНИК ТОТ ЖЕ.`;show('brain')}

$$('.character-switch [data-character]').forEach(b=>b.addEventListener('click',()=>chooseCharacter(b.dataset.character)));
$$('[data-part]').forEach(b=>b.addEventListener('click',()=>toggleAppearance(b.dataset.part)));$('#appearance-reset').onclick=resetAppearance;
$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;$$('[data-mode]').forEach(x=>x.classList.toggle('active',x===b))}));
$$('.bottom-nav button').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.nav==='talk'&&!controller?.encounter)return;show(b.dataset.nav)}));
$('#to-brain').onclick=()=>{resetActors();activeBrainNodeId=null;show('brain')};$('#to-setup').onclick=()=>show('setup');
$('#reroll-opponent').onclick=rerollOpponent;
$('#play').onclick=()=>{if(!replayMode&&!firstRunConfig)firstRunConfig={...readBrainConfig(),characterId:currentCharacterId,sharedAppearance:{...sharedAppearance},ownedAppearance:structuredClone(ownedAppearance),appearanceColors:structuredClone(appearanceColors),mode,opponentSeed,opponentProfile:structuredClone(opponentProfile)};resetActors();makeController();controller.start({mode});show('talk');if(mode==='auto')startAuto()};
$('#next-turn').onclick=()=>{if(mode==='auto'){autoTimer?stopAuto():startAuto()}else doNext()};$('#trace-btn').onclick=showTrace;
$('#rerun').onclick=async()=>{if(!baselineEncounter)return;if(replayMode){baselineEncounter=null;firstRunConfig=null;replayTargetType=null;replayMode=false;opponentSeed=explicitSeed||freshOpponentSeed();opponentProfile=createOpponentProfile(opponentSeed);await remountOpponent();resetActors();controller=null;activeBrainNodeId=null;show('brain')}else prepareReplay()};overlay.addEventListener('click',e=>{if(e.target===overlay)hideOverlay()});
window.addEventListener('resize',()=>{if(app.dataset.screen==='brain')requestAnimationFrame(drawBrainEdges)});

resetActors();syncCharacterSwitch();await mountCharacterAssets();show('person');