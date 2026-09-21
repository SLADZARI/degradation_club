---
artifactId: dementor-club.operations.public-activity-truth-boundary-pages-live-smoke-2026-09-21
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: PASS
version: 1.0
updated: 2026-09-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
---

# Public Activity Truth Boundary v1 — Pages production deploy + anonymous live smoke

## Pages production workflow

```text
workflow = Deploy Dementor Production
runNumber = 123
runId = 35622547055
conclusion = SUCCESS
branch = dementor-club-production
productionCommit = 0852d2602df5593deead797b20c50daa36fe1c1c
```

Build and deploy jobs both passed.

Pages artifact:

```text
artifactId = 10650177738
name = github-pages
digest = sha256:9f3062f3cb0177b0b5319fdc17a7912e95fd973559c55773ef9dca91de573e9b
headBranch = dementor-club-production
headSha = 0852d2602df5593deead797b20c50daa36fe1c1c
```

Deployment log confirms:

```text
pages_build_version = 0852d2602df5593deead797b20c50daa36fe1c1c
Created deployment for 0852d2602df5593deead797b20c50daa36fe1c1c
```

## Anonymous live smoke

Read-only live smoke on `https://dementor.club/` and `https://dementor.club/community/` passed.

Home:
- loads normally;
- ordinary Board artifacts `Сайт за Еду` and `Новые связи - новая борда` are absent;
- Current Program remains present: `ДЕНЬГИ НА ВЕТЕР`, `DEMENTOR LAB`, `ФУЭНХИРОЛА`;
- no obvious private Board media strings were found: `dc-community-artifacts`, `/storage/v1/object/`, `token=`, `storage_path`.

Community:
- loads normally;
- the same ordinary Board artifacts are absent;
- public editorial `СЕЙЧАС В КЛУБЕ` surface is empty;
- no obvious private Board media exposure detected.

## Release state

```text
productionMergeCompleted = true
backendProductionDeployCompleted = true
pagesProductionDeployCompleted = true
anonymousLiveSmoke = PASS
authenticatedBoardLiveRetest = PENDING
releaseStatus = LIVE_PARTIAL_VALIDATION
```

STAB-01 is not yet closed until authenticated Board smoke confirms the Board publication/media path remains intact in live production.
