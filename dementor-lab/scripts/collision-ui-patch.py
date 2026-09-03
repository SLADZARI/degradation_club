from pathlib import Path

app=Path('dementor-lab/src/ui/app.mjs')
s=app.read_text()
old="familyNodes(f).filter(n=>n.availableInSlice!==false).filter(n=>n.family!=='TRIGGER'||n.type===CRITICISM_IDEA_SCENARIO.openingTrigger).map"
new="familyNodes(f).filter(n=>n.availableInSlice!==false).map"
if old not in s: raise SystemExit('app trigger library pattern not found')
s=s.replace(old,new)
old="const d=trace.metricDeltas.self,m=trace.memoryChanges?.[0];const parts=Object.entries(d).filter(([,v])=>v).map(([k,v])=>`${k.toUpperCase()} ${v>0?'+':''}${Number(v.toFixed?.(1)??v)}`);if(m)parts.unshift(`${String(m.key).toUpperCase()} ${m.before}→${m.after}`);"
new="const d=trace.metricDeltas.self,memory=trace.memoryChanges||[];const parts=Object.entries(d).filter(([,v])=>v).map(([k,v])=>`${k.toUpperCase()} ${v>0?'+':''}${Number(v.toFixed?.(1)??v)}`);for(const m of [...memory].reverse())parts.unshift(`${String(m.key).toUpperCase()} ${m.before}→${m.after}`);"
if old not in s: raise SystemExit('app memory delta pattern not found')
app.write_text(s.replace(old,new))

browser=Path('dementor-lab/tests/browser-smoke.mjs')
s=browser.read_text()
old="assert.equal(await page.locator('[data-add-brain-node=\"ignore\"]').count(),0,'trigger that cannot fire in this scenario is not offered');"
new="assert.equal(await page.locator('[data-add-brain-node=\"ignore\"]').count(),1,'IGNORE response trigger is available');assert.equal(await page.locator('[data-add-brain-node=\"pushback\"]').count(),1,'PUSHBACK response trigger is available');assert.equal(await page.locator('[data-add-brain-node=\"acceptance\"]').count(),1,'ACCEPTANCE response trigger is available');assert.equal(await page.locator('[data-add-brain-node=\"deflection\"]').count(),1,'DEFLECTION response trigger is available');assert.equal(await page.locator('[data-add-brain-node=\"underpressure\"]').count(),1,'PRESSURE response trigger is available');"
if old not in s: raise SystemExit('browser trigger assertion pattern not found')
s=s.replace(old,new)
old="assert.equal(await page.locator('#brain-graph .brain-stack-node').count(),6,'preset plus extra repeat renders as vertical cards');"
new="assert.equal(await page.locator('#brain-graph .brain-stack-node').count(),11,'collision-ready preset plus extra repeat renders all real graph nodes');"
if old not in s: raise SystemExit('browser preset count pattern not found')
browser.write_text(s.replace(old,new))

runtime=Path('dementor-lab/src/encounter/runtime.mjs')
s=runtime.read_text()
old="const relationshipContact=Math.min(encounter.actors.A.state.contact,encounter.actors.B.state.contact);return relationshipContact>=25?"
new="const relationshipContact=Math.min(encounter.actors.A.state.contact,encounter.actors.B.state.contact);const minContact=Number(encounter.scenario.objectiveRules?.minRelationshipContact??25);return relationshipContact>=minContact?"
if old not in s: raise SystemExit('runtime contact threshold pattern not found')
runtime.write_text(s.replace(old,new))

workflow=Path('.github/workflows/dementor-lab-vertical-slice-qa.yml')
workflow.write_text("""name: Dementor Lab Vertical Slice QA

on:
  push:
    branches:
      - agent/dementor-lab-vertical-slice-v0.3
    paths:
      - 'dementor-lab/**'
      - '.github/workflows/dementor-lab-vertical-slice-qa.yml'
  workflow_dispatch:

permissions:
  contents: read

jobs:
  deterministic-qa:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: dementor-lab
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
      - name: Run zero-dependency QA suite
        run: npm test

  browser-smoke:
    runs-on: ubuntu-latest
    needs: deterministic-qa
    defaults:
      run:
        working-directory: dementor-lab
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
      - name: Install Playwright for QA only
        run: npm install --no-save playwright@1.55.0
      - name: Install Chromium
        run: npx playwright install --with-deps chromium
      - name: Start static server
        run: python3 -m http.server 4173 --bind 127.0.0.1 > /tmp/dementor-lab-http.log 2>&1 &
      - name: Wait for static server
        run: |
          for i in {1..20}; do
            curl -fsS http://127.0.0.1:4173/ >/dev/null && exit 0
            sleep 1
          done
          cat /tmp/dementor-lab-http.log
          exit 1
      - name: Run iPhone-sized browser smoke
        run: DEMENTOR_LAB_URL=http://127.0.0.1:4173 node tests/browser-smoke.mjs
""")
