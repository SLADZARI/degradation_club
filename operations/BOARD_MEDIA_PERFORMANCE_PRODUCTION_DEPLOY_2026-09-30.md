---
artifactId: dementor-club.operations.board-media-performance-production-deploy-2026-09-30
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: DEPLOYED_WAITING_LIVE_ACCEPTANCE
version: 1.0
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: RELEASE_EVIDENCE
result: dementor-club.result.board-media-performance-v1
productionCommit: cde332779ab0e256dd1e498660d6fa651e91846e
supabaseRun: 9
supabaseRunId: 36742339436
pagesRun: 138
pagesRunId: 36742651703
supabaseConclusion: SUCCESS
pagesConclusion: SUCCESS
---

# Board / Media Performance v1 — production deployment evidence

## Exact production

`cde332779ab0e256dd1e498660d6fa651e91846e`

Both manual production workflows ran against this exact SHA.

## Supabase production

Workflow:

`Deploy Dementor Supabase Production`

```text
run        #9
run id     36742339436
head SHA   cde332779ab0e256dd1e498660d6fa651e91846e
conclusion SUCCESS
```

Preflight found:

```text
aligned=59
remote_max=20260924002500
pending=20260929175000
```

Dry-run showed exactly:

`20260929175000_artifact_participants_batch_read_v1.sql`

The workflow then applied exactly that tracked migration.

Post-apply ledger:

```text
20260929175000 | 20260929175000
aligned=60
remote_max=20260929175000
pending=none
```

Telegram worker deployment was explicitly skipped and existing function remained untouched.

## Pages production

Workflow:

`Deploy Dementor Production`

```text
run        #138
run id     36742651703
head SHA   cde332779ab0e256dd1e498660d6fa651e91846e
conclusion SUCCESS
```

Build and deploy jobs both completed successfully.

Checkout log proves exact production SHA:

`cde332779ab0e256dd1e498660d6fa651e91846e`

Release validations in the production Pages workflow passed before deployment.

## Public live smoke

Fresh public fetch after deploy confirmed:

- `https://dementor.club/` responds with the Club home;
- `https://dementor.club/community/board/` resolves to canonical `/workspace/board/`;
- Guest Board gate renders instead of exposing member content;
- live `/community/board/board-media-v1.js` serves the new media normalization helper;
- live helper exposes `BOARD_IMAGE_LONG_EDGE=1800`;
- live helper exposes `BOARD_IMAGE_WEBP_QUALITY=0.82`;
- JPEG / PNG / WebP normalization code is present.

## Remaining live boundary

Authenticated production behavior cannot be fully proven through the guest public smoke.

Required owner live acceptance remains:

- authenticated Board first-render/perceived-load check;
- one real image publish through the canonical Board composer;
- card/detail render after publish;
- no collaboration/CIRCLE regression.

```text
production code deployed   YES
Supabase migration applied YES
public smoke               PASS
authenticated live retest  REQUIRED
G8                         WAITING LIVE ACCEPTANCE
```
