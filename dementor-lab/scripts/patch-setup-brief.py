from pathlib import Path
root=Path(__file__).resolve().parents[1]

# INDEX: compact setup hierarchy + dedicated stylesheet.
p=root/'index.html'
s=p.read_text()
s=s.replace('<link rel="stylesheet" href="./styles.css"><link rel="stylesheet" href="./replay.css"><link rel="stylesheet" href="./mobile-readability.css"><link rel="stylesheet" href="./character.css"><link rel="stylesheet" href="./opponent.css">','<link rel="stylesheet" href="./styles.css"><link rel="stylesheet" href="./replay.css"><link rel="stylesheet" href="./mobile-readability.css"><link rel="stylesheet" href="./character.css"><link rel="stylesheet" href="./opponent.css"><link rel="stylesheet" href="./setup.css">')
old='<section class="screen" data-view="setup" hidden><div class="sheet-card"><p class="kicker">ЭКСПЕРИМЕНТ</p><div class="segmented scenario-switch" aria-label="Выбор эксперимента"><button data-scenario="contact" class="active">СОХРАНИТЬ КОНТАКТ</button><button data-scenario="direct-answer">ДОБИТЬСЯ ОТВЕТА</button></div><h2 id="scenario-title">—</h2><p class="lead" id="scenario-premise">—</p><dl><div><dt>ЦЕЛЬ</dt><dd id="scenario-objective">—</dd></div><div><dt>КОНЕЦ</dt><dd id="scenario-end">—</dd></div></dl><div id="opponent-card" class="opponent-card"><div id="opponent-preview" class="character-slot opponent-preview" aria-label="Соперник"></div><div class="opponent-head"><span class="kicker">СОПЕРНИК</span><small id="opponent-seed"></small></div><strong id="opponent-name">—</strong><b id="opponent-preset">—</b><p id="opponent-description">—</p><button id="reroll-opponent" class="secondary-reset">ДРУГОГО →</button></div><div class="segmented"><button data-mode="auto" class="active">AUTO</button><button data-mode="step">STEP</button></div><button class="primary" id="play">PLAY →</button></div></section>'
new='''<section class="screen setup-screen" data-view="setup" hidden><div class="sheet-card setup-card">
  <p class="kicker">ЭКСПЕРИМЕНТ</p>
  <div class="segmented scenario-switch" aria-label="Выбор эксперимента"><button data-scenario="contact" class="active">СОХРАНИТЬ КОНТАКТ</button><button data-scenario="direct-answer">ДОБИТЬСЯ ОТВЕТА</button></div>
  <div class="setup-situation"><small>СИТУАЦИЯ</small><h2 id="scenario-title">—</h2><p class="lead" id="scenario-premise">—</p></div>
  <div class="setup-stakes"><div class="setup-goal"><small>ТВОЯ ЗАДАЧА</small><strong id="scenario-objective">—</strong></div><div class="setup-loss"><small>ПРОИГРАЕШЬ, ЕСЛИ</small><strong id="scenario-end">—</strong></div></div>
  <div id="opponent-card" class="opponent-card"><div id="opponent-preview" class="character-slot opponent-preview" aria-label="Соперник"></div><div class="opponent-head"><span class="kicker">СОПЕРНИК</span><small id="opponent-seed"></small></div><strong id="opponent-name">—</strong><b id="opponent-preset">—</b><p id="opponent-description">—</p><button id="reroll-opponent" class="secondary-reset">ДРУГОГО →</button></div>
  <div class="setup-launch"><div><small>ТЕМП</small><div class="segmented setup-mode"><button data-mode="auto" class="active">AUTO</button><button data-mode="step">STEP</button></div></div><button class="primary" id="play">НАЧАТЬ ЭКСПЕРИМЕНТ →</button></div>
</div></section>'''
if old not in s: raise SystemExit('setup html target not found')
s=s.replace(old,new)
p.write_text(s)

# SETUP CSS
(root/'setup.css').write_text('''/* SETUP: three-second brief before PLAY. */
.setup-card{margin-top:0;padding:12px;background:transparent}
.setup-card>.kicker{margin-bottom:8px}
.setup-card .scenario-switch{margin:0 0 12px}
.setup-situation{border-top:2px solid var(--ink);padding:12px 0 10px}
.setup-situation>small,.setup-stakes small,.setup-launch small{display:block;font:900 8px/1 monospace;letter-spacing:.06em;opacity:.62;margin-bottom:6px}
.setup-situation h2{font-size:30px;line-height:.95;margin:0}
.setup-situation .lead{margin:8px 0 0;font-size:15px;line-height:1.28}
.setup-stakes{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 10px}
.setup-stakes>div{border:2px solid var(--ink);padding:10px;min-height:92px}
.setup-goal{background:var(--acid)}
.setup-stakes strong{display:block;font-size:14px;line-height:1.16}
.setup-loss strong{font-size:12px;line-height:1.25}
.setup-card .opponent-card{margin:10px 0 12px;background:#ead2a8}
.setup-card .opponent-head small{display:none}
.setup-card .opponent-preview{width:118px;height:166px}
.setup-card .opponent-card{grid-template-columns:126px minmax(0,1fr);padding:10px}
.setup-card .opponent-card>strong{font-size:26px}
.setup-card .opponent-card>p{font-size:13px;line-height:1.25}
.setup-launch{display:grid;grid-template-columns:132px minmax(0,1fr);gap:8px;align-items:end;border-top:2px solid var(--ink);padding-top:10px}
.setup-launch .segmented{margin:0}.setup-launch .segmented button{min-width:0;padding:0 8px}
.setup-launch .primary{min-height:52px}
@media(max-width:430px){
 .setup-screen{padding:8px 10px 10px}
 .setup-card{border:0;padding:0;background:transparent}
 .setup-card .scenario-switch button{min-height:42px;font-size:10px;padding:0 8px}
 .setup-situation{padding:10px 0 9px}
 .setup-situation h2{font-size:27px}
 .setup-situation .lead{font-size:14px}
 .setup-stakes{gap:6px}.setup-stakes>div{min-height:82px;padding:8px}
 .setup-stakes strong{font-size:13px}.setup-loss strong{font-size:11px}
 .setup-card .opponent-card{grid-template-columns:112px minmax(0,1fr);gap:5px 9px;padding:8px;margin:8px 0 10px}
 .setup-card .opponent-preview{width:106px;height:150px}
 .setup-card .opponent-card>strong{font-size:22px}
 .setup-card .opponent-card>b{font-size:12px}
 .setup-card .opponent-card>p{font-size:12px;line-height:1.2}
 .setup-card .opponent-card .secondary-reset{min-height:38px;font-size:10px;padding:0 10px}
 .setup-launch{grid-template-columns:112px minmax(0,1fr);gap:6px;padding-top:8px}
 .setup-launch small{font-size:7px;margin-bottom:4px}
 .setup-launch .segmented button{min-height:44px;font-size:9px}
 .setup-launch .primary{font-size:12px;min-height:48px}
}
''')

# APP: explicit player failure copy instead of vague "развал".
p=root/'src/ui/app.mjs'
s=p.read_text()
old="function renderScenarioCopy(){const s=currentScenario;$('#scenario-title')&&($('#scenario-title').textContent=s.title);$('#scenario-premise')&&($('#scenario-premise').textContent=s.premise);$('#scenario-objective')&&($('#scenario-objective').textContent=scenarioObjectiveCopy(s));$('#scenario-end')&&($('#scenario-end').textContent=`${s.turnLimit} РАУНДОВ ИЛИ РАЗВАЛ`);$('#talk-scenario-title')&&($('#talk-scenario-title').textContent=s.title)}"
new="function scenarioLossCopy(s){if(s.objective==='direct-answer')return `К ${s.turnLimit}-МУ ХОДУ НЕТ ${s.objectiveRules.requiredOpponentCounterpoints} ОТВЕТОВ ИЛИ CONTACT <${s.objectiveRules.minRelationshipContact}. BRAIN 100 / ENERGY 0 — СРАЗУ СТОП.`;return `BRAIN 100 · ENERGY 0 · CONTACT 0. НА ${s.turnLimit}-М ХОДУ CONTACT ДОЛЖЕН БЫТЬ ≥${s.objectiveRules.minRelationshipContact}.`}\nfunction renderScenarioCopy(){const s=currentScenario;$('#scenario-title')&&($('#scenario-title').textContent=s.title);$('#scenario-premise')&&($('#scenario-premise').textContent=s.premise);$('#scenario-objective')&&($('#scenario-objective').textContent=scenarioObjectiveCopy(s));$('#scenario-end')&&($('#scenario-end').textContent=scenarioLossCopy(s));$('#talk-scenario-title')&&($('#talk-scenario-title').textContent=s.title)}"
if old not in s: raise SystemExit('scenario copy target not found')
s=s.replace(old,new)
p.write_text(s)

# Browser smoke: current PERSON grouping + first-run overlay + setup hierarchy.
p=root/'tests/browser-smoke.mjs'
s=p.read_text()
s=s.replace("assert.equal(await page.locator('[data-part]').count(),6,'appearance panel exposes six semantic parts');", "assert.equal(await page.locator('.appearance-panel button').count(),4,'appearance panel exposes four compact categories');")
s=s.replace("assert.equal(await page.locator('[data-part=\"hat\"]').getAttribute('data-variant-count'),'7');assert.equal(await page.locator('[data-part=\"glasses\"]').getAttribute('data-variant-count'),'4');assert.equal(await page.locator('[data-part=\"beard\"]').getAttribute('data-variant-count'),'4');", "assert.equal(await page.locator('[data-part=\"hat\"]').getAttribute('data-variant-count'),'7');assert.equal(await page.locator('[data-part=\"beard\"]').getAttribute('data-variant-count'),'4');assert.equal(await page.locator('[data-appearance-group=\"accessories\"]').count(),1,'glasses and small accessories share one category');")
s=s.replace("await page.locator('[data-part=\"hat\"]').click();await page.locator('#variant-options [data-variant=\"hat-01\"]').click();assert.equal(await page.locator('#person-preview #hat-01').isVisible(),true);", "await page.locator('[data-part=\"hat\"]').click();await page.locator('#variant-options [data-variant=\"hat-01\"]').click();assert.equal(await page.locator('#person-preview #hat-01').isVisible(),true);await page.locator('[data-appearance-group=\"accessories\"]').click();assert.ok(await page.locator('#variant-options [data-group-category=\"glasses\"]').count()>=1,'accessories group still exposes glasses variants');")
s=s.replace("await page.locator('#to-brain').click();assert.equal(await page.locator('#top-status').textContent(),'BRAIN');", "await page.locator('#to-brain').click();assert.equal(await page.locator('#top-status').textContent(),'BRAIN');if(await page.locator('#brain-help-ok').count()){assert.match(await page.locator('.brain-first-run').textContent(),/ВХОДЫ[\\s\\S]*ЦЕПОЧКА[\\s\\S]*РЕЗУЛЬТАТ/,'first BRAIN visit explains the mental model once');await page.locator('#brain-help-ok').click();}")
s=s.replace("assert.equal(await page.locator('#scenario-title').textContent(),'КРИТИКА ИДЕИ');assert.match(await page.locator('#scenario-objective').textContent(),/СОХРАНИТЬ КОНТАКТ/);assert.match(await page.locator('#scenario-end').textContent(),/20 РАУНДОВ/);", "assert.equal(await page.locator('#scenario-title').textContent(),'КРИТИКА ИДЕИ');assert.match(await page.locator('#scenario-objective').textContent(),/СОХРАНИТЬ КОНТАКТ/);assert.match(await page.locator('#scenario-end').textContent(),/BRAIN 100/);assert.equal(await page.locator('.setup-stakes').count(),1,'SETUP presents goal and loss as one scanable stakes block');assert.equal(await page.locator('#opponent-preview svg').count(),1,'SETUP shows the actual opponent portrait before PLAY');")
p.write_text(s)
