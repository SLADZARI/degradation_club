import json
import textwrap
from pathlib import Path

P = Path('.weekly-os/PROJECT.json')
I = Path('.weekly-os/ARTIFACT_INDEX.json')
p = json.loads(P.read_text())
i = json.loads(I.read_text())
c = p['currentResult']

# Preserve any concurrently approved semantic authorities. Only #202 current Result may be mutated here.
assert c['artifactId'] == 'dementor-club.result.catalog-release-truth-v1'
assert c['version'] == '0.2'
assert c['gate'] == 'G7_RELEASE'
assert c['candidateCommit'] == 'e24c3811803b4bf6443f54a30bd9c15495cd54d1'
assert c['releasePullRequest'] == 223
assert c['productionMergeAuthorized'] is False
assert c['productionDeployAuthorized'] is False


def bump_version(value: str) -> str:
    major, minor = value.split('.')
    m, n = int(major), int(minor) + 1
    if n >= 100:
        m += 1
        n = 0
    return f'{m}.{n:02d}'

project_old = p['_artifact']['version']
index_old = i['_artifact']['version']
project_new = bump_version(project_old)
index_new = bump_version(index_old)

old = Path('.weekly-os/results/catalog-release-truth-v1.v0.2.md')
new = Path('.weekly-os/results/catalog-release-truth-v1.v0.3.md')
assert old.exists() and not new.exists()
t = old.read_text()
t = t.replace('version: 0.2', 'version: 0.3', 1)
t = t.replace('validationConclusion: SUCCESS\n', 'validationConclusion: SUCCESS\nproductionCommit: 2dae3b6ece79652c81af780c049521fda7262726\n', 1)
t = t.replace('productionMergeAuthorized: false', 'productionMergeAuthorized: true', 1)
t = t.replace('**STATUS: G7 RELEASE / CLEAN RC VALIDATED / PRODUCTION MERGE LOCKED**', '**STATUS: G7 RELEASE / PRODUCTION MERGED / DEPLOY LOCKED**', 1)
t = t.replace('- Production-target PR #223 full CI run `35275186704` / #1204: SUCCESS.', '- Production-target PR #223 full CI run `35275186704` / #1204: SUCCESS.\n- Production merge evidence: `operations/CATALOG_RELEASE_TRUTH_G7_MERGE_2026-09-17.md`.\n- Production commit: `2dae3b6ece79652c81af780c049521fda7262726`; post-merge compare contains only the four approved #202 files.', 1)
old_boundary = '''`productionMergeAuthorized = false`  
`productionDeployAuthorized = false`

Next action requires an explicit production merge decision. Deployment remains a separate later authorization even after merge.'''
new_boundary = '''`productionMergeAuthorized = true`  
`productionDeployAuthorized = false`

Production code is merged but not deployed. No live retest or G8 cleanup is claimed. No next runtime Result may start before the separate deploy gate, deploy, live retest and G8 closure of #202.'''
assert old_boundary in t
t = t.replace(old_boundary, new_boundary, 1)
new.write_text(t, encoding='utf-8')

ev = Path('operations/CATALOG_RELEASE_TRUTH_G7_MERGE_2026-09-17.md')
assert not ev.exists()
ev.write_text(textwrap.dedent('''\
---
artifactId: dementor-club.operations.catalog-release-truth-g7-merge-2026-09-17
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: PASS_PRODUCTION_MERGED_DEPLOY_LOCKED
version: 1.0
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: RELEASE_EVIDENCE
result: dementor-club.result.catalog-release-truth-v1
---

# Catalog / Release Truth v1 — G7 production merge evidence

Owner explicitly authorized only production merge of PR #223 at unchanged head `e24c3811803b4bf6443f54a30bd9c15495cd54d1`. Production deploy remained unauthorized.

## Validated RC
- baseline: `23d4266a4009d34042b29ec1fb73fb0cbad6b62e`
- RC: `e24c3811803b4bf6443f54a30bd9c15495cd54d1`
- PR: #223
- production-target Site Integrity: run `35275186704` / #1204 — SUCCESS

## Production merge
- resulting production commit: `2dae3b6ece79652c81af780c049521fda7262726`
- parent 1: `23d4266a4009d34042b29ec1fb73fb0cbad6b62e`
- parent 2: `e24c3811803b4bf6443f54a30bd9c15495cd54d1`
- compare from prior production: `behind_by=0`
- changed files exactly four:
  - `.github/production-release.txt`
  - `.github/workflows/site-integrity.yml`
  - `catalog/index.html`
  - `scripts/validate-catalog-release-truth-v1.mjs`

## Deploy guard
No `Deploy Dementor Production` run exists for `2dae3b6ece79652c81af780c049521fda7262726`. Latest deploy remains manual `workflow_dispatch` run `35259685738` on `23d4266a4009d34042b29ec1fb73fb0cbad6b62e`.

- production merge: COMPLETE
- production deploy authorization: FALSE
- production deploy: NOT RUN
- live retest: NOT RUN
- G8 cleanup: NOT STARTED
- next runtime Result: NOT STARTED

`MERGE ≠ DEPLOY AUTHORIZATION ≠ DEPLOY ≠ LIVE RETEST ≠ G8`
'''), encoding='utf-8')

p['_artifact']['version'] = project_new
p['_artifact']['supersedes'] = project_old
p['_artifact']['projectStage'] = 'RELEASE'
p['_artifact']['gate'] = 'G7_RELEASE'
p['projectStage'] = 'RELEASE'
p['gate'] = 'G7_RELEASE'
oldp = '.weekly-os/results/catalog-release-truth-v1.v0.2.md'
newp = '.weekly-os/results/catalog-release-truth-v1.v0.3.md'
assert oldp in p['readFirst']
p['readFirst'][p['readFirst'].index(oldp)] = newp
me = 'operations/CATALOG_RELEASE_TRUTH_G7_MERGE_2026-09-17.md'
if me not in p['readFirst']:
    p['readFirst'].insert(p['readFirst'].index(newp) + 1, me)
c.update({
    'version': '0.3',
    'path': newp,
    'productionCommit': '2dae3b6ece79652c81af780c049521fda7262726',
    'productionMergeAuthorized': True,
    'productionDeployAuthorized': False,
    'mergeEvidence': me,
    'note': 'Production merged exact validated #202 RC as 2dae3b6e...; deploy remains explicitly locked. No live retest/G8 closure and no next runtime Result until separate deploy authorization.'
})

i['_artifact']['version'] = index_new
i['_artifact']['supersedes'] = index_old
i['_artifact']['projectStage'] = 'RELEASE'
i['_artifact']['gate'] = 'G7_RELEASE'
entries = i['currentArtifacts']
by = {e['artifactId']: e for e in entries}
assert by['dementor-club.kernel.project']['currentVersion'] == project_old
assert by['dementor-club.kernel.artifact-index']['currentVersion'] == index_old
by['dementor-club.kernel.project']['currentVersion'] = project_new
by['dementor-club.kernel.artifact-index']['currentVersion'] = index_new
r = by['dementor-club.result.catalog-release-truth-v1']
assert r['currentVersion'] == '0.2'
r.update({
    'currentVersion': '0.3',
    'location': newp,
    'canonicalLocation': newp,
    'gate': 'G7_RELEASE',
    'candidateCommit': 'e24c3811803b4bf6443f54a30bd9c15495cd54d1',
    'releasePullRequest': 223,
    'productionCommit': '2dae3b6ece79652c81af780c049521fda7262726',
    'productionMergeAuthorized': True,
    'productionDeployAuthorized': False,
    'mergeEvidence': me,
    'note': 'Production merged exact validated RC; deploy locked pending separate authorization.'
})
eid = 'dementor-club.operations.catalog-release-truth-g7-merge-2026-09-17'
assert eid not in by
entries.append({
    'artifactId': eid,
    'documentType': 'RELEASE_EVIDENCE',
    'currentVersion': '1.0',
    'status': 'PASS_PRODUCTION_MERGED_DEPLOY_LOCKED',
    'location': me,
    'sourceSystem': 'GIT',
    'authorityType': 'RELEASE_EVIDENCE',
    'updated': '2026-09-17',
    'canonicalProject': 'dementor-club',
    'canonicalLocation': me,
    'relation': 'G7_MERGE_EVIDENCE',
    'result': 'dementor-club.result.catalog-release-truth-v1',
    'releaseCandidateCommit': 'e24c3811803b4bf6443f54a30bd9c15495cd54d1',
    'pullRequest': 223,
    'productionCommit': '2dae3b6ece79652c81af780c049521fda7262726',
    'productionDeployAuthorized': False,
    'referencedBy': []
})

P.write_text(json.dumps(p, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
I.write_text(json.dumps(i, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')

for path in [
    '.github/workflows/semantic-post-merge-202.yml',
    '.github/workflows/semantic-post-merge-202-r2.yml',
    '.github/workflows/semantic-post-merge-202-r3.yml',
    '.github/workflows/semantic-post-merge-202-r4.yml',
    '.weekly-os/tmp_post_merge_202.py',
]:
    Path(path).unlink(missing_ok=True)

# final invariants before commit
p2 = json.loads(P.read_text())
i2 = json.loads(I.read_text())
c2 = p2['currentResult']
assert p2['_artifact']['version'] == project_new
assert i2['_artifact']['version'] == index_new
assert c2['version'] == '0.3'
assert c2['productionCommit'] == '2dae3b6ece79652c81af780c049521fda7262726'
assert c2['productionMergeAuthorized'] is True
assert c2['productionDeployAuthorized'] is False
assert ev.exists() and new.exists()
