---
artifactId: dementor-club.operations.artifact-collaboration-live-ux-corrective-r2-production-deploy-2026-09-29
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: PASS_DEPLOYED
version: 1.0
updated: 2026-09-29
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: RELEASE_EVIDENCE
result: dementor-club.result.artifact-collaboration-v1
productionCommit: a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
productionTree: c525d2467247253a48ac0b3dbe14d8f9382278c4
pagesRun: 137
pagesRunId: 36598659696
pagesArtifactId: 11047841976
pagesArtifactDigest: sha256:bdeca55650b9dcd1b6254b7d363433494cb8679cceb5fd8c7903c1f432cb5376
---

# Artifact Collaboration live UX corrective r2 — production deploy

## Verdict

```text
PRODUCTION MERGE    PASS
PAGES DEPLOY        PASS
BACKEND DEPLOY      NOT REQUIRED
SUPABASE DEPLOY     NOT REQUIRED
LIVE ACCEPTANCE     PENDING
G8                  NOT AUTHORIZED
```

## Exact production identity

```text
production SHA   a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
production tree  c525d2467247253a48ac0b3dbe14d8f9382278c4
```

The production tree is exactly the same tree as clean G7 RC
`49a545c68f63248c60b0591176a016f07e559e76`.

## Canonical Pages release

Workflow:

`Deploy Dementor Production`

```text
run         #137 / 36598659696
branch      dementor-club-production
head SHA    a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
build       SUCCESS
deploy      SUCCESS
conclusion  SUCCESS
```

The exact GitHub Pages artifact is:

```text
artifact id  11047841976
digest       sha256:bdeca55650b9dcd1b6254b7d363433494cb8679cceb5fd8c7903c1f432cb5376
head SHA     a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
```

The artifact was downloaded and contains the production
`community/board/board.js`,
`community/board/board-fullscreen-v2-1.css`,
`community/artifact/artifact.js`,
and `community/artifact/artifact.css` surfaces.

The browser validator itself is a CI-only script and is not shipped in the Pages artifact.
Its exact RC execution already passed in Site Integrity #1326 on the same validated tree.

## Live CJM / JTBD acceptance pending

Live acceptance remains limited to:

- BQA-24 invitation discoverability;
- BQA-25 invited detail action hierarchy / join;
- BQA-26 explicit LEFT / REMOVED destructive UX;
- BQA-28 canonical roster freshness.

Expected live jobs:

1. invited participant can see `ПРИГЛАШЕНИЯ · N`, recognize `ВАС ЗОВУТ`, and open the exact invited Idea;
2. invited participant sees `ПРИСОЕДИНИТЬСЯ` as the primary action and after join sees compact `ВЫ В ДЕЛЕ`;
3. participant leave requires `ВЫЙТИ ИЗ ИДЕИ` → confirmation, while author removal is explicitly `УБРАТЬ ИЗ ИДЕИ`;
4. participant/invitation roster changes are reflected from canonical state without manual reload.

Until owner live observation passes these jobs:

```text
gateReadiness = LIVE_ACCEPTANCE_PENDING
G8 = NOT AUTHORIZED
```
