---
artifactId: dementor-club.operations.board-mobile-information-hierarchy-g7-production-pages-2026-09-22
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: BUILD
gate: G7_RELEASE
status: APPROVED
version: 1.0
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentIssue: 228
---

# STAB-06 · Board Mobile Information Hierarchy · G7 production + Pages evidence

## Exact release identity

Validated candidate:

`fbc891126532939a0a7350d18d19dbae807fb76f`

Previous production:

`287b485293d68098dfd3c9302785369a735d42e2`

PR:

`#238 · MERGED`

New production:

`d4d1e2f45883beff973a5cd5827e6f71065c0575`

Validation:

`Site Integrity / Release Readiness #1238 / 35740224085 · SUCCESS`

## Merge identity

Merge parents:

1. `287b485293d68098dfd3c9302785369a735d42e2`
2. `fbc891126532939a0a7350d18d19dbae807fb76f`

Candidate → production content diff:

`0 files`

Old production → new production content delta remains exactly eight files:

1. `community/board/board-entity-model-v1.js`
2. `community/board/board-integrations-v1.js`
3. `community/board/board-mobile-harmonization-v1.css`
4. `community/board/board-program-v1.css`
5. `scripts/validate-board-batch-b-contract.mjs`
6. `scripts/validate-board-mobile-harmonization-browser.mjs`
7. `scripts/validate-board-navigation-adaptive-cards-browser.mjs`
8. `scripts/validate-board-v21-contract.mjs`

## Pages deployment

Canonical workflow:

`Deploy Dementor Production`

Exact run:

```text
run number = 130
run id = 35754639231
head SHA = d4d1e2f45883beff973a5cd5827e6f71065c0575
status = COMPLETED
conclusion = SUCCESS
build = SUCCESS
deploy = SUCCESS
```

Therefore GitHub Pages deployment is proven against the exact STAB-06 production SHA.

## Supabase boundary

No Supabase deploy was started for STAB-06.

Latest visible Supabase production workflow remains on historical SHA `0852d260...`.

`Supabase = NOT REQUIRED / NOT RUN`

## Live acceptance status

Authenticated owner/human Board retest is still required.

Attempted browser access to the authenticated Board surface required user login/approval and could not be completed in the current tool session.

No live PASS is claimed.

Required owner live acceptance remains:

### Mobile 390 / 360

- standalone Current Program strip absent;
- Board owns first frame;
- Current Program available in filters;
- exact affiliation filtering;
- ВСЁ restores Board;
- type + Program affiliation composition;
- canonical Artifact badges;
- canonical platform badges;
- В ПРОГРАММЕ exact-only;
- same-title false-positive absent;
- МОЁ;
- pager;
- zoom;
- relations;
- no horizontal overflow.

### Desktop

- existing standalone Current Program remains unchanged.

## Gate consequence

```text
projectStage = BUILD
artifact status = REVIEW
workStatus = ACTIVE
gate = G7_RELEASE
gateReadiness = PAGES_DEPLOYED_AWAITING_OWNER_LIVE_RETEST
integrationBranch = result/board-mobile-information-hierarchy-v1
liveRetestStatus = PENDING
```

Do not move to G8_CLEANUP until owner human live PASS is recorded.
Do not start STAB-07 automatically.
