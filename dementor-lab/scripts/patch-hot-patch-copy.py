from pathlib import Path
p=Path('dementor-lab/src/ui/app.mjs')
s=p.read_text()
old='ОБОРОТЬ REPEAT ×${repeat.p.count} → ×1'
new='ОБОРВАТЬ REPEAT ×${repeat.p.count} → ×1'
if old not in s: raise SystemExit('hot patch copy marker not found')
p.write_text(s.replace(old,new))
