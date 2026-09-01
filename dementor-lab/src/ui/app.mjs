import { VerticalSliceController } from '../app/vertical-slice-controller.mjs';
import { CRITICISM_IDEA_SCENARIO, createCriticismActors } from '../scenarios/criticism-idea.mjs';
import { compareRuns } from '../encounter/result.mjs';
import { NODE_SPECS } from '../core/model.mjs';
import { CharacterRenderer, APPEARANCE_LAYERS } from '../render/character-renderer.mjs';
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
function nodeSubtitle(n){const map={criticism:'что произошло',resentment:'что накопилось',beright:'чего он хочет',explain:'что он делает',repeat:'сколько раз'};return map[n.type]||familyLabel(n.type)}
function readBrainConfig(){const g=actors.A.brainGraph;return {impulseWeight:g.nodes.find(n=>n.type==='beright')?.p?.weight??3,repeatCount:g.nodes.find(n=>n.type==='repeat')?.p?.count??4}}
function applyBrainConfig(config){if(!config)return;const g=actors.A.brainGraph,imp=g.nodes.find(n=>n.type==='beright'),rep=g.nodes.find(n=>n.type==='repeat');if(imp)imp.p.weight=config.impulseWeight;if(rep)rep.p.count=config.repeatCount}
function renderBrain(){const graph=actors.A.brainGraph;$('#brain-graph').innerHTML=graph.nodes.map(n=>`<div class="brain-node ${replayMode&&replayTargetType&&n.type===replayTargetType?'replay-target':''}" data-node="${n.id}"><span class="family">${familyLabel(n.type)}</span><span class="copy"><strong>${title(n.type)}</strong><small>${nodeSubtitle(n)}</small></span><span class="value">${nodeValue(n)}</span></div>`).join('');const impulse=graph.nodes.find(n=>n.type==='beright'),repeat=graph.nodes.find(n=>n.type==='repeat');const lockImpulse=replayMode&&replayTargetType&&replayTargetType!=='beright',lockRepeat=replayMode&&replayTargetType&&replayTargetType!=='repeat';$('#brain-editor').innerHTML=`<label class="${lockImpulse?'locked':''}">БЫТЬ ПРАВЫМ <span>WEIGHT ${impulse.p.weight}</span><input id="impulse-range" type="range" min="1" max="5" value="${impulse.p.weight}" ${lockImpulse?'disabled':''}></label><label class="${lockRepeat?'locked':''}">ПОВТОРИТЬ <span>×${repeat.p.count}</span><input id="repeat-range" type="range" min="1" max="5" value="${repeat.p.count}" ${lockRepeat?'disabled':''}></label>`;$('#impulse-range').oninput=e=>{impulse.p.weight=+e.target.value;renderBrain()};$('#repeat-range').oninput=e=>{repeat.p.count=+e.target.value;renderBrain()}}
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
function prepareReplay(){replayMode=true;currentCharacterId=firstRunConfig?.characterId||currentCharacterId;sharedAppearance={...(firstRunConfig?.sharedAppearance||sharedAppearance)};ownedAppearance=structuredClone(firstRunConfig?.ownedAppearance||ownedAppearance);appearanceColors=structuredClone(firstRunConfig?.appearanceColors||appearanceColors);opponentSeed=firstRunConfig.opponentSeed;opponentProfile=structuredClone(firstRunConfig.opponentProfile);resetActors();applyBrainConfig(firstRunConfig);controller=null;$('#replay-note').textContent=`КОНТРФАКТ: МЕНЯЕМ ТОЛЬКО «${title(replayTargetType)}». СОПЕРНИК ТОТ ЖЕ.`;show('brain')}

$$('.character-switch [data-character]').forEach(b=>b.addEventListener('click',()=>chooseCharacter(b.dataset.character)));
$$('[data-part]').forEach(b=>b.addEventListener('click',()=>toggleAppearance(b.dataset.part)));$('#appearance-reset').onclick=resetAppearance;
$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;$$('[data-mode]').forEach(x=>x.classList.toggle('active',x===b))}));
$$('.bottom-nav button').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.nav==='talk'&&!controller?.encounter)return;show(b.dataset.nav)}));
$('#to-brain').onclick=()=>{resetActors();show('brain')};$('#to-setup').onclick=()=>show('setup');
$('#reroll-opponent').onclick=rerollOpponent;
$('#play').onclick=()=>{if(!replayMode&&!firstRunConfig)firstRunConfig={...readBrainConfig(),characterId:currentCharacterId,sharedAppearance:{...sharedAppearance},ownedAppearance:structuredClone(ownedAppearance),appearanceColors:structuredClone(appearanceColors),mode,opponentSeed,opponentProfile:structuredClone(opponentProfile)};resetActors();makeController();controller.start({mode});show('talk');if(mode==='auto')startAuto()};
$('#next-turn').onclick=()=>{if(mode==='auto'){autoTimer?stopAuto():startAuto()}else doNext()};$('#trace-btn').onclick=showTrace;
$('#rerun').onclick=async()=>{if(!baselineEncounter)return;if(replayMode){baselineEncounter=null;firstRunConfig=null;replayTargetType=null;replayMode=false;opponentSeed=explicitSeed||freshOpponentSeed();opponentProfile=createOpponentProfile(opponentSeed);await remountOpponent();resetActors();controller=null;show('brain')}else prepareReplay()};overlay.addEventListener('click',e=>{if(e.target===overlay)hideOverlay()});

resetActors();syncCharacterSwitch();await mountCharacterAssets();show('person');
