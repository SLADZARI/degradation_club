from pathlib import Path
p=Path('dementor-lab/src/ui/app.mjs')
s=p.read_text()
old="memory=(trace.memoryChanges||[]).map(m=>`${title(m.key).toUpperCase()} ${m.before}→${m.after}`);"
new="memory=(trace.memoryChanges||[]).flatMap(m=>[`${title(m.key).toUpperCase()} ${m.before}→${m.after}`,...(m.counter?[`${title(m.counter.key).toUpperCase()} ${m.counter.before}→${m.counter.after}`]:[])]);"
if old not in s: raise SystemExit('memory feedback target not found')
s=s.replace(old,new,1)
p.write_text(s)
