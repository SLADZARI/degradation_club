from pathlib import Path
p=Path('dementor-lab/src/ui/app.mjs')
s=p.read_text()
old="requestAnimationFrame(()=>place(current));let dragging=false;"
new="place(current);let dragging=false;"
if old not in s: raise SystemExit('slider initialization pattern not found')
p.write_text(s.replace(old,new))
