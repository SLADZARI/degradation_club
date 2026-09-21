---
artifactId: dementor-club.operations.artifact-share-social-preview-g7-release-candidate-2026-09-21
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
parentIssue: 228
---

# STAB-04 · Artifact Share Social Preview · G7 release candidate

## Exact production baseline

`dementor-club-production@692c87da4a15a986861c18d41fc9861aa1cb08f6`

Fresh compare after validation:

```text
production vs baseline = identical
ahead = 0
behind = 0
```

Production did not move during STAB-04 validation.

## Exact validated candidate

`e51d4bee5b5722bc419f8dd78e0012e8a5ab1907`

PR:

`#233 · OPEN / DRAFT / UNMERGED`

Base SHA:

`692c87da4a15a986861c18d41fc9861aa1cb08f6`

Candidate validation:

```text
Site Integrity / Release Readiness #1230
run id = 35648978456
status = COMPLETED
conclusion = SUCCESS
```

## Exact production → candidate diff

```text
ahead = 5 commits
behind = 0
changed files = 5
```

Exact files:

1. `assets/social/dementor-artifact-share-v1-20260921.png`
2. `scripts/social-head-v1.mjs`
3. `scripts/validate-board-deeplink-auth-return-browser.mjs`
4. `scripts/validate-board-deeplink-auth-return-contract.mjs`
5. `share/artifact/index.html`

All five files are owned by STAB-04: one static raster, the existing canonical social owner, the existing share source, and the two existing share/deeplink validators.

No DB/schema/RLS/private-media runtime files are present in the diff.

## Release boundary

```text
schema mutation = NO
semantic mutation = NO
backend production deploy required = NO
Supabase deploy required = NO
production merge authorized = NO
production deploy authorized = NO
```

Old Telegram URLs may continue to show cached historical previews after release. A stale cached Telegram card is not evidence that the fresh/versioned Artifact share asset failed if a fresh URL fetches the validated built head correctly.

## G7 verdict

`PASS · VALIDATED CANDIDATE / READY_FOR_RELEASE_DECISION`

STOP.

Do not mark PR ready, merge, deploy or start STAB-05 without a new owner instruction.
