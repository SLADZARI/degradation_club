from pathlib import Path

app=Path('dementor-lab/src/ui/app.mjs')
s=app.read_text()
s=s.replace('<small>КАК ЭТО СРАБОТАЕТ</small>','<small>КАК Я СЕБЯ ВЕДУ</small>')
old='host.innerHTML=`${triggerHubHtml()}<section class="brain-behavior-block" data-behavior-block><div class="brain-behavior-head"><small>ВНУТРИ МОЗГА</small><strong>ЧТО Я ДЕЛАЮ, КОГДА ЭТО СЛУЧИЛОСЬ</strong><p>Читается сверху вниз: что я чувствую → чего хочу → что делаю → что происходит дальше.</p></div>${brainReadableRouteHtml()}<svg class="brain-stack-links" aria-hidden="true"></svg><div class="brain-stack-list">${body.map(n=>projectedBrainNodeHtml(n,route)).join(\'\')}</div></section>`;'
new='host.innerHTML=`${triggerHubHtml()}<section class="brain-behavior-block" data-behavior-block>${brainReadableRouteHtml()}<div class="brain-behavior-head"><small>РЕДАКТОР</small><strong>ИЗ ЧЕГО ЭТО СОБРАНО</strong><p>Нажми на узел, чтобы изменить параметр, связь или порядок.</p></div><svg class="brain-stack-links" aria-hidden="true"></svg><div class="brain-stack-list">${body.map(n=>projectedBrainNodeHtml(n,route)).join(\'\')}</div></section>`;'
if old not in s:
    raise SystemExit('render hierarchy marker not found')
s=s.replace(old,new,1)
app.write_text(s)

test=Path('dementor-lab/tests/browser-smoke.mjs')
t=test.read_text()
t=t.replace("assert.ok((await page.locator('[data-brain-readable-route]').textContent()).includes('КРИТИКА'),'readable route starts from the real configured trigger');","assert.ok((await page.locator('[data-brain-readable-route]').textContent()).includes('КОГДА МЕНЯ КРИТИКУЮТ'),'readable route starts from the real configured trigger');",1)
marker="assert.match(await page.locator('[data-brain-readable-route]').textContent(),/ХОЧУ БЫТЬ ПРАВЫМ/,'readable route translates impulse into natural language');"
insert=marker+"assert.equal(await page.locator('[data-brain-readable-route]>small').textContent(),'КАК Я СЕБЯ ВЕДУ','readable layer has one human-facing purpose');assert.equal(await page.locator('.brain-behavior-head strong').textContent(),'ИЗ ЧЕГО ЭТО СОБРАНО','editor layer is explicitly separated from readable behavior');"
if marker not in t:
    raise SystemExit('smoke hierarchy marker not found')
t=t.replace(marker,insert,1)
test.write_text(t)
