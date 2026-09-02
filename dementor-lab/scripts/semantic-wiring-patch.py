from pathlib import Path


def replace(path, old, new, count=1):
    p=Path(path); s=p.read_text()
    if old not in s:
        raise SystemExit(f'missing patch target in {path}: {old[:120]}')
    s=s.replace(old,new,count)
    p.write_text(s)

# index.html — only visible fields backed by real semantic owners.
replace('dementor-lab/index.html',
'''  <div class="segmented character-switch" aria-label="Выбор тела персонажа"><button data-character="character-01" class="active">ПЕРСОНАЖ 01</button><button data-character="character-02">ПЕРСОНАЖ 02</button></div>''',
'''  <label class="person-name-field"><span>ИМЯ ПЕРСОНАЖА</span><input id="player-name" type="text" maxlength="24" autocomplete="name" placeholder="КАК ТЕБЯ ЗОВУТ?" aria-label="Имя персонажа"></label>\n  <div class="segmented character-switch" aria-label="Выбор тела персонажа"><button data-character="character-01" class="active">ПЕРСОНАЖ 01</button><button data-character="character-02">ПЕРСОНАЖ 02</button></div>''')
replace('dementor-lab/index.html',
'''  <div class="appearance-ownership"><span>ОБЩИЕ: ГОЛОВА · ОЧКИ · УСЫ · АКСЕССУАР</span><span>СВОИ: ОДЕЖДА · ОБУВЬ · СКЕЛЕТ</span></div>''',
'''  <div class="appearance-ownership"><span>ОБЩИЕ: ГОЛОВА · ОЧКИ · УСЫ · АКСЕССУАР</span><span>ПРИВЯЗАНЫ К ТЕЛУ: ОДЕЖДА · ОБУВЬ</span></div>''')
replace('dementor-lab/index.html',
'''  <div id="brain-inspector" class="brain-inspector" hidden></div>\n  <div id="brain-editor" class="brain-editor-note" aria-live="polite"></div>\n''','')
replace('dementor-lab/index.html',
'''<section class="screen" data-view="setup" hidden><div class="sheet-card"><p class="kicker">СИТУАЦИЯ</p><h2>КРИТИКА ИДЕИ</h2><p class="lead">Собеседник считает идею Гены плохой.</p><dl><div><dt>ЦЕЛЬ</dt><dd>СОХРАНИТЬ КОНТАКТ</dd></div><div><dt>КОНЕЦ</dt><dd>20 РАУНДОВ ИЛИ РАЗВАЛ</dd></div></dl>''',
'''<section class="screen" data-view="setup" hidden><div class="sheet-card"><p class="kicker">СИТУАЦИЯ</p><h2 id="scenario-title">—</h2><p class="lead" id="scenario-premise">—</p><dl><div><dt>ЦЕЛЬ</dt><dd id="scenario-objective">—</dd></div><div><dt>КОНЕЦ</dt><dd id="scenario-end">—</dd></div></dl>''')
replace('dementor-lab/index.html',
'''<section class="screen talk" data-view="talk" hidden><div class="talk-record"><b>КРИТИКА ИДЕИ</b><span>ЦЕЛЬ: СОХРАНИТЬ КОНТАКТ</span></div>''',
'''<section class="screen talk" data-view="talk" hidden><div class="talk-record"><b id="talk-scenario-title">—</b><span id="talk-objective">—</span></div>''')
replace('dementor-lab/index.html','''<strong id="actor-a-name">ГЕНА</strong>''','''<strong id="actor-a-name">—</strong>''')

# app.mjs — wire Character.name, scenario copy, semantic node descriptions and availability.
replace('dementor-lab/src/ui/app.mjs',
'''let activeAppearanceCategory='hat';\nconst explicitSeed=new URLSearchParams(location.search).get('seed');\nlet opponentSeed=explicitSeed||freshOpponentSeed();\nlet opponentProfile=createOpponentProfile(opponentSeed);\nlet mode='auto',actors=createCriticismActors({opponentProfile}),controller=null,autoTimer=null;''',
'''let activeAppearanceCategory='hat';\nconst PLAYER_NAME_KEY='dementor-lab.playerName';\nlet playerName=(localStorage.getItem(PLAYER_NAME_KEY)||'').trim().slice(0,24);\nconst explicitSeed=new URLSearchParams(location.search).get('seed');\nlet opponentSeed=explicitSeed||freshOpponentSeed();\nlet opponentProfile=createOpponentProfile(opponentSeed);\nlet mode='auto',actors=createCriticismActors({opponentProfile,playerName:playerName||'Гена'}),controller=null,autoTimer=null;''')
replace('dementor-lab/src/ui/app.mjs',
'''function show(screen){app.dataset.screen=screen;topStatus.textContent=screen.toUpperCase();$$('.screen').forEach(el=>el.hidden=el.dataset.view!==screen);$$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.nav===screen));if(screen==='brain'){renderBrain();$('#replay-note').hidden=!replayMode}if(screen==='setup')renderOpponentCard();if(screen==='talk')renderTalk()}\nfunction resetActors(){actors=createCriticismActors({opponentProfile});''',
'''function show(screen){app.dataset.screen=screen;topStatus.textContent=screen.toUpperCase();$$('.screen').forEach(el=>el.hidden=el.dataset.view!==screen);$$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.nav===screen));if(screen==='brain'){renderBrain();$('#replay-note').hidden=!replayMode}if(screen==='setup'){renderScenarioCopy();renderOpponentCard()}if(screen==='talk'){renderScenarioCopy();renderTalk()}}\nfunction playerDisplayName(){return playerName.trim()||'Гена'}\nfunction resetActors(){actors=createCriticismActors({opponentProfile,playerName:playerDisplayName()});''')
replace('dementor-lab/src/ui/app.mjs',
'''function renderOpponentCard(){const card=$('#opponent-card');if(!card)return;card.dataset.preset=opponentProfile.presetId;card.dataset.character=opponentProfile.baseCharacterId;$('#opponent-name').textContent=opponentProfile.name.toUpperCase();$('#opponent-preset').textContent=opponentProfile.presetLabel;$('#opponent-description').textContent=opponentProfile.description;$('#opponent-seed').textContent=`ОПЫТ ${String(opponentSeed).slice(0,12)}`}''',
'''function renderScenarioCopy(){const s=CRITICISM_IDEA_SCENARIO;$('#scenario-title')&&($('#scenario-title').textContent=s.title);$('#scenario-premise')&&($('#scenario-premise').textContent=s.premise);$('#scenario-objective')&&($('#scenario-objective').textContent=s.objectiveLabel);$('#scenario-end')&&($('#scenario-end').textContent=`${s.turnLimit} РАУНДОВ ИЛИ РАЗВАЛ`);$('#talk-scenario-title')&&($('#talk-scenario-title').textContent=s.title);$('#talk-objective')&&($('#talk-objective').textContent=`ЦЕЛЬ: ${s.objectiveLabel}`)}\nfunction syncPlayerName(){const input=$('#player-name');if(input&&input.value!==playerName)input.value=playerName;const next=$('#to-brain');if(next)next.disabled=!playerName.trim()}\nfunction setPlayerName(value){playerName=String(value||'').slice(0,24);const stored=playerName.trim();if(stored)localStorage.setItem(PLAYER_NAME_KEY,stored);else localStorage.removeItem(PLAYER_NAME_KEY);resetActors();syncPlayerName()}\nfunction renderOpponentCard(){const card=$('#opponent-card');if(!card)return;card.dataset.preset=opponentProfile.presetId;card.dataset.character=opponentProfile.baseCharacterId;$('#opponent-name').textContent=opponentProfile.name.toUpperCase();$('#opponent-preset').textContent=opponentProfile.presetLabel;$('#opponent-description').textContent=opponentProfile.description;$('#opponent-seed').textContent=`SEED ${String(opponentSeed).slice(0,12)}`}''')
replace('dementor-lab/src/ui/app.mjs',
'''function nodeSubtitle(n){const map={criticism:'что произошло',ignore:'что не заметил',resentment:'что накопилось',trust:'что сохранилось',beright:'доказать своё',beliked:'сохранить одобрение',understand:'разобраться',explain:'объяснить',agree:'согласиться',joke:'пошутить',silent:'промолчать',pressure:'давить',repeat:'снова выполняет реакцию, если ответ не принят',stop:'останавливает цепочку',ifbrain:'если мозг нагрет',pause:'пауза',interrupt:'перехват'};return map[n.type]||familyLabel(n.type)}''',
'''function nodeSubtitle(n){return NODE_SPECS[n.type]?.description||familyLabel(n.type)}''')
replace('dementor-lab/src/ui/app.mjs',
'''${familyNodes(f).filter(n=>n.type!=='interrupt').map(n=>`<button type="button" data-add-brain-node="${n.type}">''',
'''${familyNodes(f).filter(n=>n.availableInSlice!==false).filter(n=>n.family!=='TRIGGER'||n.type===CRITICISM_IDEA_SCENARIO.openingTrigger).map(n=>`<button type="button" data-add-brain-node="${n.type}">''')
replace('dementor-lab/src/ui/app.mjs',
'''function prepareReplay(){replayMode=true;currentCharacterId=firstRunConfig?.characterId||currentCharacterId;sharedAppearance={...(firstRunConfig?.sharedAppearance||sharedAppearance)};ownedAppearance=structuredClone(firstRunConfig?.ownedAppearance||ownedAppearance);appearanceColors=structuredClone(firstRunConfig?.appearanceColors||appearanceColors);opponentSeed=firstRunConfig.opponentSeed;opponentProfile=structuredClone(firstRunConfig.opponentProfile);restoreBrainSnapshot(firstRunConfig.brainGraph);controller=null;const targetNode=currentBrainGraph.nodes.find(n=>n.id===replayTargetNodeId);''',
'''function prepareReplay(){replayMode=true;playerName=firstRunConfig?.playerName||playerName;syncPlayerName();currentCharacterId=firstRunConfig?.characterId||currentCharacterId;sharedAppearance={...(firstRunConfig?.sharedAppearance||sharedAppearance)};ownedAppearance=structuredClone(firstRunConfig?.ownedAppearance||ownedAppearance);appearanceColors=structuredClone(firstRunConfig?.appearanceColors||appearanceColors);opponentSeed=firstRunConfig.opponentSeed;opponentProfile=structuredClone(firstRunConfig.opponentProfile);restoreBrainSnapshot(firstRunConfig.brainGraph);controller=null;const targetNode=currentBrainGraph.nodes.find(n=>n.id===replayTargetNodeId);''')
replace('dementor-lab/src/ui/app.mjs',
'''$('#play').onclick=()=>{if(!replayMode&&!firstRunConfig)firstRunConfig={brainGraph:brainSnapshot(),characterId:currentCharacterId,''',
'''$('#play').onclick=()=>{if(!replayMode&&!firstRunConfig)firstRunConfig={brainGraph:brainSnapshot(),playerName:playerDisplayName(),characterId:currentCharacterId,''')
replace('dementor-lab/src/ui/app.mjs',
'''$$('.character-switch [data-character]').forEach(b=>b.addEventListener('click',()=>chooseCharacter(b.dataset.character)));$$('[data-part]').forEach''',
'''$('#player-name')?.addEventListener('input',e=>setPlayerName(e.target.value));$$('.character-switch [data-character]').forEach(b=>b.addEventListener('click',()=>chooseCharacter(b.dataset.character)));$$('[data-part]').forEach''')
replace('dementor-lab/src/ui/app.mjs',
'''resetActors();syncCharacterSwitch();await mountCharacterAssets();show('person');''',
'''resetActors();syncPlayerName();syncCharacterSwitch();await mountCharacterAssets();renderScenarioCopy();show('person');''')

# Browser regression: identity storage, model-derived scenario copy, current-scenario node availability.
replace('dementor-lab/tests/browser-smoke.mjs',
'''assert.equal(await page.locator('[data-part]').count(),6,'appearance panel exposes six semantic parts');''',
'''assert.equal(await page.locator('[data-part]').count(),6,'appearance panel exposes six semantic parts');\nassert.equal(await page.locator('#to-brain').isDisabled(),true,'player name is a required Character field');await page.locator('#player-name').fill('Женя');assert.equal(await page.locator('#to-brain').isDisabled(),false,'name input wires the Character before BRAIN');''')
replace('dementor-lab/tests/browser-smoke.mjs',
'''await page.locator('[data-brain-preset="custom"]').click();assert.equal(await page.locator('#to-setup').isDisabled(),true,'blank custom brain is not runnable');''',
'''await page.locator('[data-brain-preset="custom"]').click();assert.equal(await page.locator('#to-setup').isDisabled(),true,'blank custom brain is not runnable');await page.locator('#brain-add-node').click();assert.equal(await page.locator('[data-add-brain-node="criticism"]').count(),1,'current scenario trigger is available');assert.equal(await page.locator('[data-add-brain-node="ignore"]').count(),0,'trigger that cannot fire in this scenario is not offered');assert.equal(await page.locator('[data-add-brain-node="interrupt"]').count(),0,'unsupported ability is not offered');await page.locator('#close-overlay').click();''')
replace('dementor-lab/tests/browser-smoke.mjs',
'''await page.locator('#to-setup').click();assert.equal(await page.locator('#top-status').textContent(),'SETUP');assert.ok((await page.locator('#opponent-name').textContent()).trim().length>0);''',
'''await page.locator('#to-setup').click();assert.equal(await page.locator('#top-status').textContent(),'SETUP');assert.equal(await page.locator('#scenario-title').textContent(),'КРИТИКА ИДЕИ');assert.equal(await page.locator('#scenario-objective').textContent(),'СОХРАНИТЬ КОНТАКТ');assert.match(await page.locator('#scenario-end').textContent(),/20 РАУНДОВ/);assert.ok((await page.locator('#opponent-name').textContent()).trim().length>0);''')
replace('dementor-lab/tests/browser-smoke.mjs',
'''assert.equal(await page.locator('#actor-a').getAttribute('data-character'),'character-02');assert.equal(await page.locator('#actor-b').getAttribute('data-character'),opponentCharacter);''',
'''assert.equal(await page.locator('#actor-a').getAttribute('data-character'),'character-02');assert.equal(await page.locator('#actor-a-name').textContent(),'ЖЕНЯ','player-entered Character.name reaches TALK');assert.equal(await page.locator('#actor-b').getAttribute('data-character'),opponentCharacter);''')
