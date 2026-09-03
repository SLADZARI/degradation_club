from pathlib import Path

app=Path('dementor-lab/src/ui/app.mjs')
s=app.read_text()
repls={
"label:'СИЛА ИМПУЛЬСА'":"label:'НАСКОЛЬКО ТЯНЕТ'",
"label:'ИЗМЕНЕНИЕ ПАМЯТИ'":"label:'КАК СИЛЬНО ЗАПОМНИТСЯ'",
"stop:'ОСТАНАВЛИВАЮСЬ'":"stop:'НА ЭТОМ ЗАКАНЧИВАЮ'",
}
for old,new in repls.items():
    if old not in s: raise SystemExit(f'missing app marker: {old}')
    s=s.replace(old,new,1)
app.write_text(s)

test=Path('dementor-lab/tests/browser-smoke.mjs')
t=test.read_text()
old="filter({hasText:/ОСТАНАВЛИВАЮСЬ/})"
new="filter({hasText:/НА ЭТОМ ЗАКАНЧИВАЮ/})"
if old not in t: raise SystemExit('missing STOP readable assertion')
t=t.replace(old,new,1)
test.write_text(t)
