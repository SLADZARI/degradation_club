from pathlib import Path
import re

root=Path('dementor-lab')
app=root/'src/ui/app.mjs'
text=app.read_text()
pattern=r"function renderDelta\(trace\)\{.*?\}\nfunction makeController"
replacement="""function deltaNumber(v){const n=Number(v||0);return `${n>0?'+':''}${Number(n.toFixed?.(1)??n)}`}
function deltaHumanParts(delta={},subject='self'){const out=[];const self=subject==='self';if(delta.energy<0)out.push(self?'ПОТРАТИЛ СИЛЫ':'СОБЕСЕДНИК ПОТРАТИЛ СИЛЫ');if(delta.energy>0)out.push(self?'СИЛЫ ВЕРНУЛИСЬ':'СОБЕСЕДНИК ВОССТАНОВИЛСЯ');if(delta.brain>0)out.push(self?'ПЕРЕГРЕЛСЯ':'СОБЕСЕДНИК ПЕРЕГРЕЛСЯ');if(delta.brain<0)out.push(self?'ОСТЫЛ':'СОБЕСЕДНИК ОСТЫЛ');if(delta.tension>0)out.push(self?'НАПРЯГСЯ':'СОБЕСЕДНИК НАПРЯГСЯ');if(delta.tension<0)out.push(self?'ВЫДОХНУЛ':'СОБЕСЕДНИК ВЫДОХНУЛ');if(delta.contact>0)out.push(self?'СТАЛ БЛИЖЕ':'КОНТАКТ УКРЕПИЛСЯ');if(delta.contact<0)out.push(self?'ОТДАЛИЛСЯ':'КОНТАКТ ПРОСЕЛ');return out}
function deltaExactLine(delta={}){return Object.entries(delta).filter(([,v])=>v).map(([k,v])=>`${k.toUpperCase()} ${deltaNumber(v)}`).join(' · ')}
function renderDelta(trace){const host=$('#delta');if(!host)return;if(!trace){host.innerHTML='';return}const self=trace.metricDeltas?.self||{},target=trace.metricDeltas?.target||{},human=[...deltaHumanParts(self,'self'),...deltaHumanParts(target,'target')],selfExact=deltaExactLine(self),targetExact=deltaExactLine(target),memory=(trace.memoryChanges||[]).map(m=>`${title(m.key).toUpperCase()} ${m.before}→${m.after}`);const exact=[selfExact?`ГОВОРЯЩИЙ: ${selfExact}`:'',targetExact?`СОБЕСЕДНИК: ${targetExact}`:''].filter(Boolean).join(' / ');host.innerHTML=`<div class=\"delta-feedback\"><strong>${human.length?human.join(' · '):'БЕЗ ЗАМЕТНОГО СДВИГА'}</strong>${exact?`<small>${exact}</small>`:''}${memory.length?`<span class=\"delta-feedback__memory\">ПАМЯТЬ: ${memory.join(' · ')}</span>`:''}</div>`}
function makeController"""
new_text,n=re.subn(pattern,replacement,text,count=1,flags=re.S)
if n!=1: raise SystemExit(f'renderDelta replacement count={n}')
app.write_text(new_text)

index=root/'index.html'
idx=index.read_text()
needle='<link rel="stylesheet" href="./talk-causality.css">'
if needle not in idx: raise SystemExit('talk-causality stylesheet link not found')
idx=idx.replace(needle,needle+'<link rel="stylesheet" href="./delta-feedback.css">',1)
index.write_text(idx)

smoke=root/'tests/browser-smoke.mjs'
s=smoke.read_text()
needle="assert.ok((await page.locator('#talk-cause').textContent()).includes('СЛЕДУЮЩИЙ МОЗГ'),'TALK makes the next brain input visible');"
insert=needle+"assert.equal(await page.locator('#delta .delta-feedback').count(),1,'TALK renders human metric feedback from the real trace');assert.ok((await page.locator('#delta .delta-feedback strong').textContent()).trim().length>0,'human metric consequence is readable');assert.match(await page.locator('#delta .delta-feedback small').textContent(),/ГОВОРЯЩИЙ:|СОБЕСЕДНИК:/,'exact trace deltas remain available as second-level detail');"
if needle not in s: raise SystemExit('browser smoke talk causality assertion not found')
smoke.write_text(s.replace(needle,insert,1))
