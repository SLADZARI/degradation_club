---
artifactId: dementor-club.result.board-media-performance-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
workStatus: LIVE_RETEST
version: 0.13
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.12
parentQa: BQA-20,BQA-27
productionCommit: cde332779ab0e256dd1e498660d6fa651e91846e
supabaseRun: 9
supabaseRunId: 36742339436
pagesRun: 138
pagesRunId: 36742651703
productionDeployExecuted: true
liveDatabaseMutationExecuted: true
deploymentEvidence: operations/BOARD_MEDIA_PERFORMANCE_PRODUCTION_DEPLOY_2026-09-30.md
publicLiveSmoke: PASS
authenticatedLiveAcceptance: REQUIRED
gateReadiness: LIVE_OWNER_ACCEPTANCE_REQUIRED
---

# Board / Media Performance v1 · Result v0.13

## Production state

```text
production merge       DONE
Supabase migration     SUCCESS
Pages deployment       SUCCESS
public live smoke      PASS
authenticated retest   REQUIRED
```

Exact production:

`cde332779ab0e256dd1e498660d6fa651e91846e`

## Verified deployment

Supabase:

`#9 / 36742339436 = SUCCESS`

Migration `20260929175000_artifact_participants_batch_read_v1.sql` is now aligned in the production migration ledger.

Pages:

`#138 / 36742651703 = SUCCESS`

The deployed site was built from the exact production SHA.

## Public live smoke

Home is reachable.

Legacy Board URL resolves to canonical Workspace Board URL.

Guest gate remains intact.

The deployed media-normalization helper is live.

## Remaining live acceptance

One authenticated owner session must exercise the real member Board.

Required visible flow:

1. open Board while authenticated;
2. confirm cards become usable without the former long blank wait;
3. publish one test Artifact/Idea with an image;
4. confirm publish succeeds and image renders on Board;
5. open detail and confirm image/content resolves;
6. close/back and confirm Board remains usable.

No new code should be changed unless this live flow exposes a concrete defect.

G8 is not authorized until this live acceptance passes.
