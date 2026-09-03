from pathlib import Path

root=Path('dementor-lab')

def req_replace(path, old, new):
    p=root/path
    s=p.read_text()
    if old not in s:
        raise SystemExit(f'missing pattern in {path}: {old[:80]}')
    p.write_text(s.replace(old,new,1))

# PERSON + SETUP + TALK shell
p=root/'index.html'; s=p.read_text()
s=s.replace('<div class="appearance-panel" aria-label="Категории внешности"><button data-part="hat" class="active">ГОЛОВНОЙ УБОР</button><button data-part="glasses" class="active">ОЧКИ</button><button data-part="beard" class="active">УСЫ / БОРОДА</button><button data-part="accessory" class="active">АКСЕССУАР</button><button data-part="outfit" class="active">ОДЕЖДА</button><button data-part="shoes" class="active">ОБУВЬ</button></div>','<div class="appearance-panel" aria-label="Категории внешности"><button data-part="hat" class="active">УБОР</button><button data-appearance-group="accessories" class="active">АКСЕССУАРЫ</button><button data-part="beard" class="active">БОРОДА</button><button data-part="outfit" class="active">ОДЕЖДА</button></div>')
s=s.replace('<div class="person-stage"><div class="character-slot big" id="person-preview" aria-label="Собранный Дементор"></div></div>','<div class="person-stage"><div class="character-slot big" id="person-preview" aria-label="Собранный Дементор"></div><div class="person-stage-tools"><button type="button" id="random-outfit" aria-label="Случайная одежда" title="Случайная одежда">↻</button><button type="button" id="appearance-reset" aria-label="Сбросить обвес" title="Сбросить обвес">×</button></div></div>')
s=s.replace('  <div class="appearance-ownership"><span>ОБЩИЕ: УБОР · ОЧКИ · УСЫ/БОРОДА · АКСЕССУАР</span><span>ПРИВЯЗАНЫ К ТЕЛУ: ОДЕЖДА · ОБУВЬ</span></div>\n  <button class="secondary-reset" id="appearance-reset">СБРОСИТЬ ОБВЕС</button><button class="primary" id="to-brain">СОБРАТЬ ЕМУ МОЗГ →</button>','  <button class="primary person-next" id="to-brain">СОБРАТЬ ЕМУ МОЗГ →</button>')
s=s.replace('<div id="brain-validation" class="brain-validation" aria-live="polite"></div>','<div id="brain-validation" class="brain-validation" aria-live="polite" hidden></div>')
s=s.replace('<div id="opponent-card" class="opponent-card"><div class="opponent-head">','<div id="opponent-card" class="opponent-card"><div id="opponent-preview" class="character-slot opponent-preview" aria-label="Соперник"></div><div class="opponent-head">')
s=s.replace('<div id="dialogue" class="dialogue"><p class="empty">Никто ещё ничего не сказал.</p></div><div id="talk-cause" class="talk-cause empty" aria-live="polite"><span>ПОСЛЕ РЕПЛИКИ ЗДЕСЬ БУДЕТ ВИДНО, ЧТО ОНА ЗАПУСТИЛА.</span></div><div id="delta" class="delta" aria-live="polite"></div>','<div id="dialogue" class="dialogue"><p class="empty">Никто ещё ничего не сказал.</p></div><button type="button" id="talk-tech-toggle" class="talk-tech-toggle" aria-expanded="false">ПОЧЕМУ ТАК? +</button><div id="talk-tech" class="talk-tech" hidden><div id="talk-cause" class="talk-cause empty" aria-live="polite"><span>ПОСЛЕ РЕПЛИКИ ЗДЕСЬ БУДЕТ ВИДНО, ЧТО ОНА ЗАПУСТИЛА.</span></div><div id="delta" class="delta" aria-live="polite"></div></div>')
p.write_text(s)

# BRAIN: order is presentation only; edges are truth.
p=root/'src/ui/app.mjs'; s=p.read_text()
s=s.replace("let baselineEncounter=null,replayMode=false,firstRunConfig=null,replayTargetNodeId=null,previewRenderer=null,talkRenderers=null;","let baselineEncounter=null,replayMode=false,firstRunConfig=null,replayTargetNodeId=null,previewRenderer=null,opponentPreviewRenderer=null,talkRenderers=null;")
s=s.replace("async function mountCharacterAssets(){previewRenderer=await mountAsset('person-preview',currentCharacterId);await mountAsset('actor-a',currentCharacterId);await mountAsset('actor-b',opponentProfile.baseCharacterId);syncAppearancePanel();renderPreview();renderOpponentCard()}","async function mountCharacterAssets(){previewRenderer=await mountAsset('person-preview',currentCharacterId);opponentPreviewRenderer=await mountAsset('opponent-preview',opponentProfile.baseCharacterId);await mountAsset('actor-a',currentCharacterId);await mountAsset('actor-b',opponentProfile.baseCharacterId);syncAppearancePanel();renderPreview();renderOpponentCard()}")
s=s.replace("async function remountOpponent(){await mountAsset('actor-b',opponentProfile.baseCharacterId);resetActors();renderOpponentCard()}","async function remountOpponent(){opponentPreviewRenderer=await mountAsset('opponent-preview',opponentProfile.baseCharacterId);await mountAsset('actor-b',opponentProfile.baseCharacterId);resetActors();renderOpponentCard()}")
s=s.replace("function renderOpponentCard(){const card=$('#opponent-card');if(!card)return;const direct=currentScenario.id==='direct-answer';card.dataset.preset=direct?'DIRECT_ANSWER':opponentProfile.presetId;card.dataset.character=opponentProfile.baseCharacterId;", "function renderOpponentCard(){const card=$('#opponent-card');if(!card)return;const direct=currentScenario.id==='direct-answer';card.dataset.preset=direct?'DIRECT_ANSWER':opponentProfile.presetId;card.dataset.character=opponentProfile.baseCharacterId;opponentPreviewRenderer?.render({state:actors.B.state,face:{},visual:{characterId:opponentProfile.baseCharacterId,appearance:opponentAppearance()}});")
# appearance group helpers
anchor="function renderVariantOptions(){const rack=$('#variant-options');if(!rack)return;"
if anchor not in s: raise SystemExit('renderVariantOptions anchor missing')
s=s.replace(anchor,"function renderAccessoryGroup(){const rack=$('#variant-options');if(!rack)return;const groups=['glasses','accessory'];rack.hidden=false;rack.dataset.category='accessories';rack.innerHTML=groups.map(category=>{const options=variantOptions(currentCharacterId,category),active=selectedVariant(category);return `<div class=\"variant-group\"><b>${category==='glasses'?'ОЧКИ':'АКСЕССУАР'}</b><div>${`<button data-group-category=\"${category}\" data-variant=\"\" class=\"${active==null?'active':''}\">НЕТ</button>`}${options.map((id,i)=>`<button data-group-category=\"${category}\" data-variant=\"${id}\" class=\"${id===active?'active':''}\">${String(i+1).padStart(2,'0')}</button>`).join('')}</div></div>`}).join('');rack.querySelectorAll('[data-group-category]').forEach(button=>button.addEventListener('click',()=>selectAppearanceVariant(button.dataset.groupCategory,button.dataset.variant||null)))}\nfunction renderVariantOptions(){const rack=$('#variant-options');if(!rack)return;if(activeAppearanceCategory==='accessories')return renderAccessoryGroup();")
# sync group active
needle="function syncAppearancePanel(){const appearance=playerAppearance();$$('[data-part]').forEach"
if needle not in s: raise SystemExit('sync appearance missing')
s=s.replace(needle,"function syncAppearancePanel(){const appearance=playerAppearance();const group=$('[data-appearance-group=\"accessories\"]');if(group){group.classList.toggle('active',activeAppearanceCategory==='accessories');group.setAttribute('aria-pressed',String(activeAppearanceCategory==='accessories'))}$$('[data-part]').forEach")
# render variants call is already at end; add group handler/random
s=s.replace("function resetAppearance(){sharedAppearance={hat:false,glasses:false,beard:false,accessory:false,...EMPTY_SHARED_VARIANTS()};ownedAppearance={...ownedAppearance,[currentCharacterId]:{outfit:true,shoes:true,...EMPTY_OWNED_VARIANTS()}};appearanceColors={...appearanceColors,[currentCharacterId]:EMPTY_COLORS()};commitAppearanceChange()}","function resetAppearance(){sharedAppearance={hat:false,glasses:false,beard:false,accessory:false,...EMPTY_SHARED_VARIANTS()};ownedAppearance={...ownedAppearance,[currentCharacterId]:{outfit:true,shoes:true,...EMPTY_OWNED_VARIANTS()}};appearanceColors={...appearanceColors,[currentCharacterId]:EMPTY_COLORS()};commitAppearanceChange()}\nfunction randomizeOutfit(){const options=variantOptions(currentCharacterId,'outfit');if(!options.length)return;const current=selectedVariant('outfit'),pool=options.filter(x=>x!==current),next=(pool.length?pool:options)[Math.floor(Math.random()*(pool.length||options.length))];selectAppearanceVariant('outfit',next)}")
# preserve connections on reorder
old="function reorderBrainNode(id,targetIndex){const node=currentBrainGraph.nodes.find(n=>n.id===id);if(!node||familyOf(node)==='TRIGGER')return;const triggers=currentBrainGraph.nodes.filter(n=>familyOf(n)==='TRIGGER'),body=currentBrainGraph.nodes.filter(n=>familyOf(n)!=='TRIGGER'),from=body.findIndex(n=>n.id===id);if(from<0||targetIndex===from)return;const [moved]=body.splice(from,1),bounded=Math.max(0,Math.min(body.length,targetIndex));body.splice(bounded,0,moved);currentBrainGraph.nodes=[...triggers,...body];rebuildBrainSequence();activeBrainPresetId='custom'}"
new="function reorderBrainNode(id,targetIndex){const node=currentBrainGraph.nodes.find(n=>n.id===id);if(!node||familyOf(node)==='TRIGGER')return;const triggers=currentBrainGraph.nodes.filter(n=>familyOf(n)==='TRIGGER'),body=currentBrainGraph.nodes.filter(n=>familyOf(n)!=='TRIGGER'),from=body.findIndex(n=>n.id===id);if(from<0||targetIndex===from)return;const [moved]=body.splice(from,1),bounded=Math.max(0,Math.min(body.length,targetIndex));body.splice(bounded,0,moved);currentBrainGraph.nodes=[...triggers,...body];normalizeBrainStack();activeBrainPresetId='custom'}"
if old not in s: raise SystemExit('reorder exact missing')
s=s.replace(old,new)
# do not autowire newly added nodes; explicit connect only
s=s.replace("activeBrainNodeId=node.id;activeBrainPresetId='custom';brainConnectFromId=null;rebuildBrainSequence();hideOverlay();renderBrain();","activeBrainNodeId=node.id;activeBrainPresetId='custom';brainConnectFromId=null;normalizeBrainStack();hideOverlay();renderBrain();")
# edge geometry relative to svg, not host
s=s.replace("const box=host.getBoundingClientRect(),byId=Object.fromEntries", "const box=svg.getBoundingClientRect(),byId=Object.fromEntries")
# chat interaction helper + tech toggle (inject before renderTalk)
needle="function renderTalk(){if(!controller?.encounter)return;"
if needle not in s: raise SystemExit('renderTalk missing')
helper="function bindTalkReading(){const dialogue=$('#dialogue');if(dialogue&&!dialogue.dataset.readBound){dialogue.dataset.readBound='1';dialogue.addEventListener('touchstart',()=>{if(autoTimer)stopAuto()},{passive:true});dialogue.addEventListener('wheel',()=>{if(autoTimer)stopAuto()},{passive:true})}const tech=$('#talk-tech-toggle');if(tech&&!tech.dataset.bound){tech.dataset.bound='1';tech.addEventListener('click',()=>{const panel=$('#talk-tech'),opening=panel.hidden;if(opening&&autoTimer)stopAuto();panel.hidden=!opening;tech.setAttribute('aria-expanded',String(opening));tech.textContent=opening?'ПОЧЕМУ ТАК? −':'ПОЧЕМУ ТАК? +'})}}\n"
s=s.replace(needle,helper+needle)
# call binder at end of renderTalk by replacing next-turn assignment tail
s=s.replace("$('#next-turn').textContent=mode==='auto'?(autoTimer?'PAUSE':'RESUME'):'NEXT TURN →'}","$('#next-turn').textContent=mode==='auto'?(autoTimer?'PAUSE':'RESUME'):'NEXT TURN →';bindTalkReading()}")
# show human result text fields if available
s=s.replace("$('#result-cause').textContent=r.stageB.cause;", "$('#result-cause').textContent=r.stageB.humanCause||r.stageB.cause;")
s=s.replace("$('#result-arc').textContent=r.stageB.arc?.summary||'—';", "$('#result-arc').textContent=r.stageB.humanArc||r.stageB.arc?.summary||'—';")
s=s.replace("$('#result-node').textContent=r.stageC.nodeType?title(r.stageC.nodeType).toUpperCase():'—';", "$('#result-node').textContent=r.stageC.humanSuspicion|| (r.stageC.nodeType?title(r.stageC.nodeType).toUpperCase():'—');")
# bind new person controls near existing reset binding via generic end append before mount
bind="\n$('[data-appearance-group=\"accessories\"]')?.addEventListener('click',()=>{activeAppearanceCategory='accessories';syncAppearancePanel()});\n$('#random-outfit')?.addEventListener('click',randomizeOutfit);\n"
# insert before final mountCharacterAssets occurrence
idx=s.rfind('mountCharacterAssets()')
if idx<0: raise SystemExit('mount call missing')
s=s[:idx]+bind+s[idx:]
p.write_text(s)

# RESULT human language
p=root/'src/encounter/result.mjs'; s=p.read_text()
insert="""
function humanCause(encounter,trace,terminal){
  if(!trace)return 'Разговор закончился раньше, чем мы успели понять, что ты творишь.';
  const types=(trace.visitedNodes||[]).map(id=>nodeType(encounter.actors.A,id));
  const bits=[];
  const event=trace.event?.type;
  if(event==='COUNTERPOINT')bits.push('Тебе возразили.');
  else if(event==='ACCEPTANCE')bits.push('С тобой уже почти согласились.');
  else if(event==='DEFLECTION')bits.push('Разговор попытался сбежать в сторону.');
  else if(event==='PRESSURE')bits.push('На тебя надавили.');
  if(types.includes('grudge'))bits.push('Ты сохранил обиду как важный документ.');
  if(types.includes('beright'))bits.push('Потом решил, что быть правым важнее, чем закончить разговор живым.');
  if(types.includes('explain'))bits.push('И снова начал объяснять.');
  if(types.includes('repeat'))bits.push('А потом объяснил ещё раз. Потому что вдруг с первого раза было недостаточно.');
  if(terminal.type==='BREAKDOWN'&&terminal.reason==='BRAIN')bits.push(`В итоге BRAIN дошёл до ${Math.round(terminal.value??encounter.actors[terminal.loser||'A'].state.brain)}. Мозг первым вышел из чата.`);
  if(terminal.type==='BREAKDOWN'&&terminal.reason==='ENERGY')bits.push('В итоге закончились силы. Аргументы остались, человека — почти нет.');
  if(terminal.type==='BREAKDOWN'&&terminal.reason==='CONTACT')bits.push('В итоге закончился контакт. Формально вы ещё разговаривали, фактически уже нет.');
  return bits.join(' ');
}
function humanArc(arc,traces){
  const count=traces.filter(t=>t.actorId==='A'&&t.selectedReaction).length;
  if(!arc?.segments?.length)return 'Особого плана не возникло.';
  if(arc.segments.length===1)return `${count} ходов подряд ты выбирал одно и то же: ${arc.segments[0].label}. Мозг решил, что новый план — это старый план ещё раз.`;
  const labels=arc.segments.slice(0,3).map(x=>x.label.toLowerCase()).join(' → ');
  return `По ходу разговора ты всё-таки менял тактику: ${labels}. Первый поворот случился примерно на ${arc.pivot?.turn||arc.segments[1].startTurn}-м ходу.`;
}
function humanSuspicion(actor,nodeId){
  const node=nodeId?nodeFor(actor,nodeId):null;if(!node)return 'Явного виновника нет. Придётся думать.';
  if(node.type==='repeat')return `ЗАЦИКЛИЛСЯ: REPEAT ×${node.p?.count||1}.`;
  if(node.type==='beright')return `СЛИШКОМ ХОТЕЛ БЫТЬ ПРАВЫМ: W${node.p?.weight||1}.`;
  if(familyOf(node)==='STATE')return `${(NODE_SPECS[node.type]?.title||node.type).toUpperCase()} ПОЕХАЛА С ТОБОЙ ДАЛЬШЕ.`;
  return `ПРОВЕРЬ УЗЕЛ «${(NODE_SPECS[node.type]?.title||node.type).toUpperCase()}».`;
}
"""
mark='export function buildResult(encounter){'
if mark not in s: raise SystemExit('buildResult missing')
s=s.replace(mark,insert+'\n'+mark)
old="return {terminal,punchline,stageB:{title:'ЧТО ПРОИЗОШЛО',cause,memory,arc,turn:trace?.turn||encounter.turn,actorId:'A'},stageC:{title:'ПОДОЗРИТЕЛЬНОЕ МЕСТО',actorId:'A',nodeId:suspicious,nodeType:suspicious?nodeType(actor,suspicious):null,patch,nextAction:'ИЗМЕНИТЬ ОДНУ ВЕЩЬ'},trace};"
new="return {terminal,punchline,stageB:{title:'ЧТО ПРОИЗОШЛО',cause,humanCause:humanCause(encounter,trace,terminal),humanArc:humanArc(arc,encounter.traces),memory,arc,turn:trace?.turn||encounter.turn,actorId:'A'},stageC:{title:'ПОДОЗРИТЕЛЬНОЕ МЕСТО',actorId:'A',nodeId:suspicious,nodeType:suspicious?nodeType(actor,suspicious):null,humanSuspicion:humanSuspicion(actor,suspicious),patch,nextAction:'ПОЧИНИТЬ МОЗГ'},trace};"
if old not in s: raise SystemExit('result return missing')
s=s.replace(old,new)
p.write_text(s)

# CSS: simplify PERSON, BRAIN rails, setup portrait, technical drawer
p=root/'character.css'; s=p.read_text(); s += r'''
/* Stabilization: appearance is one compact mobile control row. */
.person-stage{position:relative}
.person-stage-tools{position:absolute;right:10px;top:10px;z-index:8;display:grid;gap:6px}
.person-stage-tools button{width:46px;height:46px;min-height:46px;padding:0;background:var(--paper);font-size:24px}
.appearance-panel{grid-template-columns:repeat(4,1fr)}
.appearance-panel button{min-height:48px}
.appearance-panel [data-appearance-group="accessories"].active{background:var(--acid);opacity:1}
.variant-options[data-category="accessories"]{display:grid;gap:5px;overflow:visible}
.variant-group{display:grid;grid-template-columns:82px minmax(0,1fr);align-items:center;gap:6px}
.variant-group>b{font:900 8px/1 monospace}
.variant-group>div{display:flex;gap:5px;overflow-x:auto;scrollbar-width:none}
.person-next{margin-top:8px}
@media(max-width:430px){.appearance-panel{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}.appearance-panel button{font-size:8px;padding:0 3px}.person-stage-tools{right:7px;top:7px}.person-stage-tools button{width:44px;height:44px}.variant-group{grid-template-columns:70px minmax(0,1fr)}}
'''; p.write_text(s)

p=root/'brain-card-hierarchy.css'; s=p.read_text(); s += r'''
/* Stabilization: numbered rail removed; real connections carry causality. */
.brain-trigger-hub::before,.brain-readable-route::before,.brain-behavior-head::before{content:none!important;display:none!important}
.brain-screen .brain-graph.brain-constructor{background:none!important;padding-left:10px!important;padding-right:10px!important}
.brain-behavior-head{border-width:1.5px;padding:7px 9px}
.brain-behavior-head small{display:none}
.brain-readable-route>small::after{content:' · РЕЗУЛЬТАТ'}
@media(max-width:430px){.brain-screen .brain-graph.brain-constructor{padding-left:0!important;padding-right:0!important}.brain-behavior-head strong{font-size:13px}.brain-readable-route{margin-top:8px}}
'''; p.write_text(s)

p=root/'brain-stack.css'; s=p.read_text(); s += r'''
/* Edges are the primary causal affordance, not decorative rail fragments. */
.brain-stack-links{z-index:1;overflow:visible}
.brain-stack-edge{stroke-width:3.5}
.brain-stack-edge.extra{stroke-width:4.5}
.brain-stack-node{z-index:3}
.brain-add-node-bottom{width:100%;margin-left:0;margin-right:0}
@media(max-width:430px){.brain-add-node-bottom{width:100%;margin-left:0;margin-right:0}}
'''; p.write_text(s)

p=root/'opponent.css'; s=p.read_text(); s += r'''
.opponent-card{grid-template-columns:112px minmax(0,1fr);align-items:center}
.opponent-preview{grid-row:1/6;width:104px;height:150px;align-self:stretch}
.opponent-head,.opponent-card>strong,.opponent-card>b,.opponent-card>p,.opponent-card>.secondary-reset{grid-column:2}
@media(max-width:430px){.opponent-card{grid-template-columns:94px minmax(0,1fr);gap:6px 10px}.opponent-preview{width:90px;height:136px}.opponent-card>strong{font-size:20px}.opponent-card p{font-size:13px;line-height:1.25}}
'''; p.write_text(s)

p=root/'styles.css'; s=p.read_text(); s += r'''
/* TALK technical details are opt-in; reading pauses autoplay. */
.talk-tech-toggle{width:100%;min-height:42px;border-left:2px solid var(--ink);border-right:2px solid var(--ink);border-top:0;border-bottom:2px solid var(--ink);background:var(--paper);text-align:left;font:900 9px/1 monospace}
.talk-tech[hidden]{display:none}
.talk-tech{border-bottom:2px solid var(--ink)}
@media(max-width:430px){.talk-tech-toggle{min-height:38px;font-size:8px}.talk-tech .talk-cause{border-top:0}.talk-tech .delta-feedback small{display:block!important;font-size:7px!important}}
'''; p.write_text(s)

print('stabilization patch applied')
