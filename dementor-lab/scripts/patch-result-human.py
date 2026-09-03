from pathlib import Path
root=Path(__file__).resolve().parents[1]

# Humanize RESULT source copy and keep it gender-neutral.
p=root/'src/encounter/result.mjs'
s=p.read_text()
s=s.replace("const REACTION_ARC_LABEL=Object.freeze({explain:'ОБЪЯСНЯЛ',agree:'СОГЛАШАЛСЯ',joke:'ШУТИЛ',silent:'МОЛЧАЛ',pressure:'ДАВИЛ'});", "const REACTION_ARC_LABEL=Object.freeze({explain:'ОБЪЯСНЕНИЕ',agree:'СОГЛАСИЕ',joke:'ШУТКА',silent:'МОЛЧАНИЕ',pressure:'ДАВЛЕНИЕ'});\nconst REACTION_ARC_ACTION=Object.freeze({explain:'объяснять',agree:'соглашаться',joke:'шутить',silent:'молчать',pressure:'давить'});")
s=s.replace("if(types.includes('grudge'))bits.push('Ты сохранил обиду как важный документ.');", "if(types.includes('resentment'))bits.push('Обида осталась в памяти как важный документ.');")
s=s.replace("if(types.includes('beright'))bits.push('Потом решил, что быть правым важнее, чем закончить разговор живым.');", "if(types.includes('beright'))bits.push('Дальше сработало «быть правым» — важнее, чем закончить разговор живым.');")
s=s.replace("if(types.includes('explain'))bits.push('И снова начал объяснять.');", "if(types.includes('explain'))bits.push('Следом — ещё одно объяснение.');")
s=s.replace("if(types.includes('repeat'))bits.push('А потом объяснил ещё раз. Потому что вдруг с первого раза было недостаточно.');", "if(types.includes('repeat'))bits.push('Потом то же объяснение пошло на повтор. Видимо, с первого раза реальность недостаточно внимательно слушала.');")
s=s.replace("if(arc.segments.length===1)return `${count} ходов подряд ты выбирал одно и то же: ${arc.segments[0].label}. Мозг решил, что новый план — это старый план ещё раз.`;", "if(arc.segments.length===1)return `${count} ходов подряд — одна тактика: ${REACTION_ARC_ACTION[arc.segments[0].reaction]||arc.segments[0].label.toLowerCase()}. Мозг решил, что новый план — это старый план ещё раз.`;")
s=s.replace("const labels=arc.segments.slice(0,3).map(x=>x.label.toLowerCase()).join(' → ');\n  return `По ходу разговора ты всё-таки менял тактику: ${labels}. Первый поворот случился примерно на ${arc.pivot?.turn||arc.segments[1].startTurn}-м ходу.`;", "const labels=arc.segments.slice(0,3).map(x=>REACTION_ARC_ACTION[x.reaction]||x.label.toLowerCase()).join(' → ');\n  return `Тактика по ходу разговора менялась: ${labels}. Первый поворот — примерно на ${arc.pivot?.turn||arc.segments[1].startTurn}-м ходу.`;")
s=s.replace("if(node.type==='beright')return `СЛИШКОМ ХОТЕЛ БЫТЬ ПРАВЫМ: W${node.p?.weight||1}.`;", "if(node.type==='beright')return `ИМПУЛЬС «БЫТЬ ПРАВЫМ» СЛИШКОМ СИЛЬНЫЙ: W${node.p?.weight||1}.`;")
p.write_text(s)

# UI consumes human RESULT layer and makes repair a real editor pass.
p=root/'src/ui/app.mjs'
s=p.read_text()
s=s.replace("function showResult(result){show('result');$('#result-title').textContent=result.punchline;$('#result-cause').textContent=result.stageB.cause;$('#result-arc').textContent=result.stageB.arc?.summary||'—';$('#result-node').textContent=result.stageC.nodeType?title(result.stageC.nodeType):'—';if(!baselineEncounter){baselineEncounter=structuredClone(controller.encounter);replayTargetNodeId=result.stageC.nodeId||null;$('#comparison').hidden=true;$('#rerun').textContent='ИЗМЕНИТЬ ОДНУ ВЕЩЬ →'}else if(replayMode){const c=compareRuns(baselineEncounter,controller.encounter);$('#comparison').innerHTML=comparisonHtml(c);$('#comparison').hidden=false;$('#rerun').textContent='ЕЩЁ ОДИН ЭКСПЕРИМЕНТ →'}}", "function showResult(result){show('result');$('#result-title').textContent=result.punchline;$('#result-cause').textContent=result.stageB.humanCause||result.stageB.cause;$('#result-arc').textContent=result.stageB.humanArc||result.stageB.arc?.summary||'—';$('#result-node').textContent=result.stageC.humanSuspicion|| (result.stageC.nodeType?title(result.stageC.nodeType):'—');if(!baselineEncounter){baselineEncounter=structuredClone(controller.encounter);replayTargetNodeId=result.stageC.nodeId||null;$('#comparison').hidden=true;$('#rerun').textContent='ПОЧИНИТЬ МОЗГ →'}else if(replayMode){const c=compareRuns(baselineEncounter,controller.encounter);$('#comparison').innerHTML=comparisonHtml(c);$('#comparison').hidden=false;$('#rerun').textContent='ЕЩЁ ОДИН ЭКСПЕРИМЕНТ →'}}")
s=s.replace("function prepareReplay(){replayMode=true;playerName=firstRunConfig?.playerName||playerName;syncPlayerName();currentCharacterId=firstRunConfig?.characterId||currentCharacterId;sharedAppearance={...(firstRunConfig?.sharedAppearance||sharedAppearance)};ownedAppearance=structuredClone(firstRunConfig?.ownedAppearance||ownedAppearance);appearanceColors=structuredClone(firstRunConfig?.appearanceColors||appearanceColors);opponentSeed=firstRunConfig.opponentSeed;opponentProfile=structuredClone(firstRunConfig.opponentProfile);restoreBrainSnapshot(firstRunConfig.brainGraph);controller=null;const targetNode=currentBrainGraph.nodes.find(n=>n.id===replayTargetNodeId);$('#replay-note').textContent=`КОНТРФАКТ: МЕНЯЕМ ТОЛЬКО «${title(targetNode?.type||'repeat')}». СОПЕРНИК ТОТ ЖЕ.`;show('brain')}", "function prepareReplay(){replayMode=true;playerName=firstRunConfig?.playerName||playerName;syncPlayerName();currentCharacterId=firstRunConfig?.characterId||currentCharacterId;sharedAppearance={...(firstRunConfig?.sharedAppearance||sharedAppearance)};ownedAppearance=structuredClone(firstRunConfig?.ownedAppearance||ownedAppearance);appearanceColors=structuredClone(firstRunConfig?.appearanceColors||appearanceColors);opponentSeed=firstRunConfig.opponentSeed;opponentProfile=structuredClone(firstRunConfig.opponentProfile);restoreBrainSnapshot(firstRunConfig.brainGraph);controller=null;const targetNode=currentBrainGraph.nodes.find(n=>n.id===replayTargetNodeId);$('#replay-note').textContent=`ПОЧИНИ МОЗГ И ПРОВЕРЬ ЕЩЁ РАЗ. ПОДСКАЗКА: «${title(targetNode?.type||'repeat')}». СОПЕРНИК ТОТ ЖЕ.`;show('brain')}")
s=s.replace("function bindBrainStackDrag(){$$('#brain-graph [data-brain-drag]').forEach(handle=>{let start=null;handle.addEventListener('pointerdown',e=>{const id=handle.dataset.brainDrag,node=currentBrainGraph.nodes.find(n=>n.id===id);if(replayMode||brainNodeLocked(node))return;", "function bindBrainStackDrag(){$$('#brain-graph [data-brain-drag]').forEach(handle=>{let start=null;handle.addEventListener('pointerdown',e=>{const id=handle.dataset.brainDrag,node=currentBrainGraph.nodes.find(n=>n.id===id);if(brainNodeLocked(node))return;")
s=s.replace("function beginBrainConnection(id){if(replayMode)return;", "function beginBrainConnection(id){")
s=s.replace("function finishBrainConnection(id){if(replayMode||!brainConnectFromId)return;", "function finishBrainConnection(id){if(!brainConnectFromId)return;")
s=s.replace("function deleteBrainNode(id){if(replayMode)return;", "function deleteBrainNode(id){")
s=s.replace("function showNodeLibrary(){if(replayMode)return;", "function showNodeLibrary(){")
s=s.replace("function renderBrain(){closeBrainControlSheet();normalizeBrainStack();renderBrainPresets();renderBrainCanvas();renderBrainStatus();const add=$('#brain-add-node');if(add)add.hidden=replayMode}", "function renderBrain(){closeBrainControlSheet();normalizeBrainStack();renderBrainPresets();renderBrainCanvas();renderBrainStatus();const add=$('#brain-add-node');if(add)add.hidden=false}")
p.write_text(s)

# RESULT labels and stylesheet.
p=root/'index.html'
s=p.read_text()
s=s.replace('<link rel="stylesheet" href="./opponent.css"><link rel="stylesheet" href="./setup.css">','<link rel="stylesheet" href="./opponent.css"><link rel="stylesheet" href="./setup.css"><link rel="stylesheet" href="./result.css">')
s=s.replace('<div class="result-block"><small>КАК МЕНЯЛОСЬ</small><strong id="result-arc"></strong></div><div class="result-block"><small>ПОДОЗРИТЕЛЬНОЕ МЕСТО</small><strong id="result-node"></strong></div>', '<div class="result-block"><small>ЧТО ТЫ ДЕЛАЛ</small><strong id="result-arc"></strong></div><div class="result-block result-repair"><small>ЧТО ПОПРОБОВАТЬ ПОЧИНИТЬ</small><strong id="result-node"></strong></div>')
p.write_text(s)

(root/'result.css').write_text('''/* RESULT: diagnosis first, engine notation second. */
.result-card{background:transparent;padding:16px;margin-top:12px}
.result-card h2{max-width:18ch}
.result-block{padding:14px 0;margin-top:14px}
.result-block small{font-size:9px;letter-spacing:.04em;opacity:.7}
.result-block strong{display:block;font-size:18px;line-height:1.28;font-weight:800;text-transform:none}
.result-repair{background:rgba(231,255,24,.16);margin-left:-10px;margin-right:-10px;padding:12px 10px;border-top:2px solid var(--ink);border-bottom:2px solid var(--ink)}
.result-repair strong{font-family:monospace;font-size:15px;line-height:1.25}
.result-card .primary{margin-top:14px}
@media(max-width:430px){
 .result-card{padding:14px 12px;margin-top:8px}
 .result-card h2{font-size:30px;line-height:.95}
 .result-block{padding:12px 0;margin-top:10px}
 .result-block strong{font-size:17px;line-height:1.27}
 .result-repair strong{font-size:14px}
}
''')

# Browser smoke: human RESULT + whole BRAIN editable on repair.
p=root/'tests/browser-smoke.mjs'
s=p.read_text()
s=s.replace("assert.ok((await page.locator('#result-cause').textContent()).trim().length>0);assert.ok((await page.locator('#result-arc').textContent()).trim().length>0,'RESULT exposes the trace-derived behavior arc');", "assert.ok((await page.locator('#result-cause').textContent()).trim().length>0);assert.doesNotMatch(await page.locator('#result-cause').textContent(),/W\\d|→.*→.*→/,'RESULT defaults to human diagnosis instead of graph notation');assert.ok((await page.locator('#result-arc').textContent()).trim().length>0,'RESULT exposes a human behavior arc');")
s=s.replace("assert.equal(await page.locator('#brain-add-node').isVisible(),false,'counterfactual replay hides graph expansion');assert.ok(await page.locator('#brain-graph .brain-stack-node.locked').count()>=1,'non-target cards are locked during one-cause replay');const replayRepeats=page.locator('#brain-graph .brain-stack-node').filter({has:page.locator('.brain-stack-title',{hasText:/^REPEAT$/})});assert.equal(await replayRepeats.count(),1,'replay keeps the authored terminal repeat node');assert.equal(await page.locator('#brain-graph .brain-stack-node.locked').filter({has:page.locator('.brain-stack-title',{hasText:/^REPEAT$/})}).count(),0,'the exact suspicious repeat node remains editable in replay');", "assert.equal(await page.locator('#brain-add-node').isVisible(),true,'repair pass keeps the full BRAIN editor available');assert.equal(await page.locator('#brain-graph .brain-stack-node.locked').count(),0,'repair pass does not lock the player to one suspicious node');const replayRepeats=page.locator('#brain-graph .brain-stack-node').filter({has:page.locator('.brain-stack-title',{hasText:/^REPEAT$/})});assert.equal(await replayRepeats.count(),1,'repair pass keeps the authored repeat while allowing broader edits');")
p.write_text(s)
