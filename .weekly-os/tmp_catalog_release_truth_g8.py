import json
import textwrap
from pathlib import Path

PROD='2dae3b6ece79652c81af780c049521fda7262726'
CAND='e24c3811803b4bf6443f54a30bd9c15495cd54d1'
RUN_ID=35278971579
RUN_NO=121
ART_ID=10521498813
ART_DIGEST='sha256:4952c20758f58244ce8c0fe0da1506e1d07f155202f9e4a3aa8c1806eea095d4'
RESULT_ID='dementor-club.result.catalog-release-truth-v1'

P=Path('.weekly-os/PROJECT.json')
I=Path('.weekly-os/ARTIFACT_INDEX.json')
p=json.loads(P.read_text())
i=json.loads(I.read_text())

assert p['_artifact']['version']=='2.03', p['_artifact']['version']
assert i['_artifact']['version']=='2.00', i['_artifact']['version']
assert p.get('currentResult',{}).get('artifactId')==RESULT_ID
assert p['currentResult']['version']=='0.3'
assert p['currentResult']['productionCommit']==PROD
assert p['currentResult']['candidateCommit']==CAND
assert p['currentResult']['productionMergeAuthorized'] is True
assert p['currentResult']['productionDeployAuthorized'] is False
assert p.get('activeIntegrationBranch')=='result/catalog-release-truth-v1'
assert p.get('activeReleaseBranch')=='release/catalog-release-truth-v1'

# Guard against residue from earlier semantic helpers.
for residue in [
    '.github/workflows/semantic-post-merge-202.yml',
    '.github/workflows/semantic-post-merge-202-r2.yml',
    '.github/workflows/semantic-post-merge-202-r3.yml',
    '.weekly-os/tmp_post_merge_202.py',
]:
    assert not Path(residue).exists(), f'unexpected residue: {residue}'

pages_path='operations/CATALOG_RELEASE_TRUTH_PAGES_RELEASE_2026-09-17.md'
live_path='operations/CATALOG_RELEASE_TRUTH_LIVE_RETEST_2026-09-17.md'
g8_path='operations/CATALOG_RELEASE_TRUTH_G8_2026-09-17.md'
result_path='.weekly-os/results/catalog-release-truth-v1.v1.0.md'
for path in [pages_path, live_path, g8_path, result_path]:
    assert not Path(path).exists(), f'already exists: {path}'

Path(pages_path).write_text(textwrap.dedent(f'''\
---
artifactId: dementor-club.operations.catalog-release-truth-pages-release-2026-09-17
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G8_CLEANUP
status: PASS
version: 1.0
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: RELEASE_EVIDENCE
result: {RESULT_ID}
---

# Catalog / Release Truth v1 — production Pages release

Authorized production deploy executed through canonical workflow `Deploy Dementor Production`.

- production commit: `{PROD}`
- workflow run: #{RUN_NO} / `{RUN_ID}`
- event: `workflow_dispatch`
- branch: `dementor-club-production`
- run conclusion: `SUCCESS`
- build job: `SUCCESS`
- deploy job: `SUCCESS`
- Pages artifact: `{ART_ID}`
- artifact digest: `{ART_DIGEST}`

The workflow checkout/build/deploy evidence records the exact deployed SHA as `{PROD}`.
'''), encoding='utf-8')

Path(live_path).write_text(textwrap.dedent(f'''\
---
artifactId: dementor-club.operations.catalog-release-truth-live-retest-2026-09-17
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: RELEASE
gate: G8_CLEANUP
status: PASS_LIVE_CATALOG_RELEASE_TRUTH
version: 1.0
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: {RESULT_ID}
---

# Catalog / Release Truth v1 — live retest

Read-only live retest performed after successful Pages run `{RUN_ID}` for exact production `{PROD}`.

## Catalog truth boundary

Live `/catalog/` resolves and renders the released Catalog. It explicitly states that Catalog is a secondary navigation surface, is not owner of current status/price/availability/lifecycle, and leaves current facts with source owners. Rows expose `SOURCE / ...` provenance rather than lifecycle/readiness truth. No hard volatile category/global counts are exposed.

The released Catalog also states that each Project keeps its own project source and does not need to exist in `dc_entities`. `DEMENTOR LAB` is present as a Project link and its public route resolves successfully.

## Canonical Catalog routes

All twelve public entity routes linked from the released Catalog resolved and returned their expected public surfaces during the live retest:

- `/courses/dumai-s-opasnostyu/`
- `/courses/dengi-na-veter/`
- `/courses/ne-komanda/`
- `/courses/slaboumie-i-otvaga/`
- `/events/fuengirola/`
- `/projects/logic-awareness/`
- `/projects/dementor-lab/`
- `/objects/001-ne-nado/`
- `/merch/drop-001/overthinking-is-my-cardio/`
- `/merch/drop-001/personal-growth-cancelled/`
- `/merch/drop-001/success-is-boring/`
- `/merch/drop-001/potential-too-long-revealed/`

## Public navigation regression

Read-only live checks also resolved the canonical public navigation surfaces `/`, `/about/`, `/events/`, `/projects/`, `/community/`, `/merch/`, and `/join/` with expected page content/canonical metadata. No #202 route/navigation regression was observed.

## Deployment truth

Deployment truth is traceable to successful GitHub Actions run #{RUN_NO} / `{RUN_ID}` for exact SHA `{PROD}`, plus Pages artifact `{ART_ID}` / `{ART_DIGEST}`. `.github/production-release.txt` remains intentionally non-authoritative and points current deploy truth to the latest successful `Deploy Dementor Production` GitHub Actions evidence rather than claiming current state itself.

Result: `PASS_LIVE_CATALOG_RELEASE_TRUTH`.
'''), encoding='utf-8')

Path(g8_path).write_text(textwrap.dedent(f'''\
---
artifactId: dementor-club.operations.catalog-release-truth-g8-2026-09-17
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: RELEASE
gate: G8_CLEANUP
status: PASS_G8_CLEANUP
version: 1.0
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: {RESULT_ID}
---

# Catalog / Release Truth v1 — G8 cleanup

## Closure evidence

- exact G6 candidate: `{CAND}`
- production commit: `{PROD}`
- production deploy: #{RUN_NO} / `{RUN_ID}` — `SUCCESS`
- Pages artifact: `{ART_ID}` / `{ART_DIGEST}`
- live retest: `PASS_LIVE_CATALOG_RELEASE_TRUTH`
- live evidence: `{live_path}`
- production release evidence: `{pages_path}`

## Cleanup

This closure commit is created only after the workflow successfully deletes the no-longer-needed `result/catalog-release-truth-v1` and `release/catalog-release-truth-v1` branches. Temporary #202 semantic helper scripts/workflows are absent; the self-cleaning G8 script/workflow are removed from the closure commit itself. No compatibility runtime layer was introduced by #202.

The three historical WAITING Board Results remain WAITING and are not treated as blockers or silently closed. Member Activation Semantics v2 / #214 remains semantic authority only and is not runtime implementation authorization.

## Final state

`#202 Catalog / Release Truth v1 = CLOSED / G8 PASS`.

No next runtime Result is opened by this closure. The next runtime stage, when explicitly activated, begins with Board IA current-owner forensic inventory, then Board ↔ ThingProjection identity/projection compatibility, then governance decision for the existing WAITING Board IA.
'''), encoding='utf-8')

Path(result_path).write_text(textwrap.dedent(f'''\
---
artifactId: {RESULT_ID}
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G8_CLEANUP
status: APPROVED
version: 1.0
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
issue: 202
integrationBranch: result/catalog-release-truth-v1
releaseBranch: release/catalog-release-truth-v1
productionBaseCommit: 23d4266a4009d34042b29ec1fb73fb0cbad6b62e
candidateCommit: {CAND}
integrationPullRequest: 222
stagingMergeCommit: 61d85d95bd95dfb536acdd363b45d2773a4b2ca5
releasePullRequest: 223
validationRunId: 35274121432
releaseValidationRunId: 35275186704
validationConclusion: SUCCESS
productionCommit: {PROD}
productionDeployRun: {RUN_NO}
productionDeployRunId: {RUN_ID}
pagesArtifactId: {ART_ID}
pagesArtifactDigest: {ART_DIGEST}
productionDeployStatus: SUCCESS
liveRetest: PASS_LIVE_CATALOG_RELEASE_TRUTH
activationAuthorized: true
implementationStartAuthorized: true
productionMergeAuthorized: true
productionDeployAuthorized: true
liveDatabaseMutationAuthorized: false
---

# Catalog / Release Truth v1

**STATUS: APPROVED / RELEASED / LIVE RETEST PASS / G8 CLOSED**

## Goal

Remove stale-truth behavior from the public Catalog and production release-status documentation without creating a universal registry, second Product authority, or new deployment-status owner.

## Released boundary

- Catalog no longer exposes hard volatile global/category counts as current truth.
- Catalog rows identify source/provenance rather than reasserting lifecycle/readiness.
- Projects retain project-specific source ownership; `DEMENTOR LAB` navigation does not depend on a `dc_entities` row.
- `.github/production-release.txt` is explicitly non-authoritative and points to successful GitHub Actions deployment evidence.
- CI guards these boundaries against regression.

## Evidence

- G6: `operations/CATALOG_RELEASE_TRUTH_G6_2026-09-17.md`
- G7 RC: `operations/CATALOG_RELEASE_TRUTH_G7_RELEASE_CANDIDATE_2026-09-17.md`
- G7 merge: `operations/CATALOG_RELEASE_TRUTH_G7_MERGE_2026-09-17.md`
- Pages release: `{pages_path}`
- live retest: `{live_path}`
- G8 cleanup: `{g8_path}`

## Final boundary

#202 is closed. No next runtime Result is activated by this document. #214 remains semantic authority without runtime implementation authorization.
'''), encoding='utf-8')

# PROJECT kernel
p['_artifact']['version']='2.04'
p['_artifact']['supersedes']='2.03'
p['_artifact']['projectStage']='RELEASE'
p['_artifact']['gate']='G8_CLEANUP'
p['projectStage']='RELEASE'
p['gate']='G8_CLEANUP'
old_result='.weekly-os/results/catalog-release-truth-v1.v0.3.md'
if old_result in p['readFirst']:
    p['readFirst'][p['readFirst'].index(old_result)] = result_path
else:
    assert result_path in p['readFirst'], 'catalog result pointer missing'
for item in [g8_path, live_path, pages_path]:
    if item in p['readFirst']:
        p['readFirst'].remove(item)
insert_at=p['readFirst'].index(result_path)+1
for item in [g8_path, live_path, pages_path]:
    p['readFirst'].insert(insert_at, item)
    insert_at += 1

completed={x['artifactId']:x for x in p.get('completedResults',[])}
assert RESULT_ID not in completed
p['completedResults'].insert(0,{
    'artifactId': RESULT_ID,
    'version':'1.0',
    'status':'APPROVED',
    'path':result_path,
    'gate':'G8_CLEANUP',
    'issue':202,
    'productionBaseCommit':'23d4266a4009d34042b29ec1fb73fb0cbad6b62e',
    'candidateCommit':CAND,
    'integrationPullRequest':222,
    'stagingMergeCommit':'61d85d95bd95dfb536acdd363b45d2773a4b2ca5',
    'releasePullRequest':223,
    'validationRunId':35274121432,
    'releaseValidationRunId':35275186704,
    'validationConclusion':'SUCCESS',
    'productionCommit':PROD,
    'productionDeployRun':RUN_NO,
    'productionDeployRunId':RUN_ID,
    'pagesArtifactId':ART_ID,
    'pagesArtifactDigest':ART_DIGEST,
    'productionDeployStatus':'SUCCESS',
    'liveRetest':'PASS_LIVE_CATALOG_RELEASE_TRUTH',
    'liveEvidence':live_path,
    'g8Evidence':g8_path,
    'note':'Released exact production 2dae3b6e... via canonical Pages run #121; Catalog/live route truth retest PASS; G8 closed. No next runtime Result activated.'
})
p['currentResult']=None
p['activeIntegrationBranch']=None
p['activeReleaseBranch']=None

# ARTIFACT INDEX
i['_artifact']['version']='2.01'
i['_artifact']['supersedes']='2.00'
i['_artifact']['projectStage']='RELEASE'
i['_artifact']['gate']='G8_CLEANUP'
entries=i['currentArtifacts']
by={e['artifactId']:e for e in entries}
assert by['dementor-club.kernel.project']['currentVersion']=='2.03'
assert by['dementor-club.kernel.artifact-index']['currentVersion']=='2.00'
by['dementor-club.kernel.project']['currentVersion']='2.04'
by['dementor-club.kernel.artifact-index']['currentVersion']='2.01'
r=by[RESULT_ID]
assert r['currentVersion']=='0.3'
r.update({
    'currentVersion':'1.0',
    'status':'APPROVED',
    'location':result_path,
    'canonicalLocation':result_path,
    'relation':'COMPLETED_RESULT',
    'gate':'G8_CLEANUP',
    'candidateCommit':CAND,
    'productionCommit':PROD,
    'productionMergeAuthorized':True,
    'productionDeployAuthorized':True,
    'productionDeployRun':RUN_NO,
    'productionDeployRunId':RUN_ID,
    'productionDeployStatus':'SUCCESS',
    'pagesArtifactId':ART_ID,
    'pagesArtifactDigest':ART_DIGEST,
    'liveRetest':'PASS_LIVE_CATALOG_RELEASE_TRUTH',
    'liveEvidence':live_path,
    'g8Evidence':g8_path,
    'note':'Released and G8 closed after exact-SHA Pages deploy and live Catalog/routes truth retest.'
})

def add_artifact(artifact_id, document_type, status, location, authority_type, relation, extra):
    assert artifact_id not in {e['artifactId'] for e in entries}
    obj={
        'artifactId':artifact_id,
        'documentType':document_type,
        'currentVersion':'1.0',
        'status':status,
        'location':location,
        'sourceSystem':'GIT',
        'authorityType':authority_type,
        'updated':'2026-09-17',
        'canonicalProject':'dementor-club',
        'canonicalLocation':location,
        'relation':relation,
        'result':RESULT_ID,
        'referencedBy':[]
    }
    obj.update(extra)
    entries.append(obj)

add_artifact('dementor-club.operations.catalog-release-truth-pages-release-2026-09-17','RELEASE_EVIDENCE','PASS',pages_path,'RELEASE_EVIDENCE','PRODUCTION_DEPLOY_EVIDENCE',{
    'productionCommit':PROD,'productionDeployRun':RUN_NO,'productionDeployRunId':RUN_ID,'pagesArtifactId':ART_ID,'pagesArtifactDigest':ART_DIGEST
})
add_artifact('dementor-club.operations.catalog-release-truth-live-retest-2026-09-17','VALIDATION_EVIDENCE','PASS_LIVE_CATALOG_RELEASE_TRUTH',live_path,'VALIDATION_EVIDENCE','LIVE_RETEST_EVIDENCE',{
    'productionCommit':PROD,'productionDeployRunId':RUN_ID
})
add_artifact('dementor-club.operations.catalog-release-truth-g8-2026-09-17','VALIDATION_EVIDENCE','PASS_G8_CLEANUP',g8_path,'VALIDATION_EVIDENCE','G8_EVIDENCE',{
    'productionCommit':PROD,'productionDeployRunId':RUN_ID
})

P.write_text(json.dumps(p,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
I.write_text(json.dumps(i,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')

# Self-cleaning: these files must not survive the closure commit.
Path('.github/workflows/catalog-release-truth-g8-close.yml').unlink(missing_ok=True)
Path('.weekly-os/tmp_catalog_release_truth_g8.py').unlink(missing_ok=True)

# Final local invariants.
p2=json.loads(P.read_text()); i2=json.loads(I.read_text())
assert p2['_artifact']['version']=='2.04'
assert p2['gate']=='G8_CLEANUP'
assert p2['currentResult'] is None
assert p2['activeIntegrationBranch'] is None and p2['activeReleaseBranch'] is None
assert i2['_artifact']['version']=='2.01'
assert {x['artifactId'] for x in p2['completedResults']}.__contains__(RESULT_ID)
assert Path(result_path).exists() and Path(pages_path).exists() and Path(live_path).exists() and Path(g8_path).exists()
