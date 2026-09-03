from pathlib import Path
import re

app=Path('dementor-lab/src/ui/app.mjs')
s=app.read_text()
old="function brainReadableRole(node){const family=familyOf(node);if(family==='TRIGGER')return 'КОГДА';if(family==='STATE')return 'Я ЧУВСТВУ';if(family==='IMPULSE')return 'Я ХОЧУ';if(family==='REACTION')return 'Я ДЕЛАЮ';if(family==='CONTROL')return 'ДАЛЬШЕ';if(family==='ABILITY')return 'Я МОГУ';return 'УЗЕЛ'}"
new="function brainReadablePhrase(node){const value=nodeValue(node),threshold=node.p?.threshold||70;const phrases={criticism:'КОГДА МЕНЯ КРИТИКУЮТ',ignore:'КОГДА МЕНЯ ИГНОРИРУЮТ',pushback:'КОГДА МНЕ ВОЗРАЖАЮТ',acceptance:'КОГДА СО МНОЙ СОГЛАШАЮТСЯ',deflection:'КОГДА УХОДЯТ В СТОРОНУ',underpressure:'КОГДА НА МЕНЯ ДАВЯТ',beright:'ХОЧУ БЫТЬ ПРАВЫМ',beliked:'ХОЧУ НРАВИТЬСЯ',understand:'ПЫТАЮСЬ ПОНЯТЬ',resentment:`ОБИЖАЮСЬ ${value}`.trim(),trust:`НАЧИНАЮ ДОВЕРЯТЬ ${value}`.trim(),explain:'НАЧИНАЮ ОБЪЯСНЯТЬ',agree:'СОГЛАШАЮСЬ',joke:'ОТШУЧИВАЮСЬ',silent:'ЗАМОЛКАЮ',pressure:'НАЧИНАЮ ДАВИТЬ',repeat:`ПОВТОРЯЮ ДО ${value}`.trim(),stop:'ОСТАНАВЛИВАЮСЬ',ifbrain:`ЕСЛИ BRAIN ВЫШЕ ${threshold}`,pause:'БЕРУ ПАУЗУ',interrupt:'ПЕРЕХВАТЫВАЮ'};return phrases[node.type]||title(node.type)}"
if old not in s: raise SystemExit('brainReadableRole marker not found')
s=s.replace(old,new,1)

# Replace role/title two-line readable step with one conversational phrase.
s=s.replace("<span>${brainReadableRole(node)}</span><strong>${title(node.type)}</strong>","<strong class=\"brain-readable-step__phrase\">${brainReadablePhrase(node)}</strong>")
s=s.replace(">${title(alt.type)}</button>`).join('')",">${brainReadablePhrase(alt)}</button>`).join('')")
if 'brainReadableRole(' in s: raise SystemExit('stale readable role reference remains')
app.write_text(s)

test=Path('dementor-lab/tests/browser-smoke.mjs')
t=test.read_text()
needle="assert.equal(await page.locator('#to-setup').isDisabled(),false,'opening trigger route makes the graph runnable');"
insert=needle+"assert.match(await page.locator('[data-brain-readable-route]').textContent(),/КОГДА МЕНЯ КРИТИКУЮТ/,'readable route speaks as a character sentence');assert.match(await page.locator('[data-brain-readable-route]').textContent(),/ХОЧУ БЫТЬ ПРАВЫМ/,'readable route translates impulse into natural language');"
if needle not in t: raise SystemExit('readable phrase assertion marker not found')
t=t.replace(needle,insert,1)
t=t.replace(".filter({hasText:/STOP/}).count()>=1,'readable route exposes real side branch as ИЛИ'", ".filter({hasText:/ОСТАНАВЛИВАЮСЬ/}).count()>=1,'readable route exposes real side branch as conversational ИЛИ'")
test.write_text(t)
