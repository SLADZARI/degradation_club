---
artifactId: dementor-club.result.board-media-performance-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G8_CLEANUP
status: APPROVED
workStatus: CLOSED
version: 1.0
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.13
parentQa: BQA-20,BQA-27
integrationBranch: null
productionCommit: cde332779ab0e256dd1e498660d6fa651e91846e
productionMergeStatus: COMPLETE
supabaseDeployStatus: PASS
supabaseDeployRun: 9
supabaseDeployRunId: 36742339436
pagesDeployStatus: PASS
pagesDeployRun: 138
pagesDeployRunId: 36742651703
liveAcceptanceStatus: PASS
liveAcceptanceEvidence: operations/BOARD_MEDIA_PERFORMANCE_LIVE_ACCEPTANCE_2026-09-30.md
g8Status: CLOSED
g8Evidence: operations/BOARD_MEDIA_PERFORMANCE_G8_2026-09-30.md
gateReadiness: CLOSED
---

# Board / Media Performance v1 · Result v1.0

**APPROVED / G8_CLEANUP CLOSED**

Exact production:

`cde332779ab0e256dd1e498660d6fa651e91846e`

Production releases:

```text
Supabase #9 / 36742339436  SUCCESS
Pages #138 / 36742651703   SUCCESS
```

## Delivered

BQA-20:

- canonical Board composer normalizes JPEG / PNG / WebP before upload;
- long edge bounded at 1800 px;
- WebP quality 0.82;
- normalized file used only when smaller;
- original + normalized metadata preserved;
- no second media owner.

Live proof:

`QA MEDIA 30-09`

```text
PNG 3,446,542 bytes / 4096×2560
→
WebP 75,736 bytes / 1800×1125
```

Storage MIME/size match the normalized metadata exactly.

BQA-27:

- structural Board renders before secondary participant/media/signing enrichment;
- participant N+1 Board reads replaced with one bounded canonical batch RPC;
- lazy/async media path preserved;
- authenticated production batch RPC returned HTTP 200 during owner live acceptance.

## Validation

```text
G5                    PASS
G6                    PASS
G7 clean RC           PASS
production merge      PASS
Supabase deploy       PASS
Pages deploy          PASS
public smoke          PASS
owner live acceptance PASS
G8 cleanup            CLOSED
```

Canonical evidence:

- `operations/BOARD_MEDIA_PERFORMANCE_G5_FINAL_PASS_2026-09-30.md`
- `operations/BOARD_MEDIA_PERFORMANCE_G6_2026-09-30.md`
- `operations/BOARD_MEDIA_PERFORMANCE_G7_RELEASE_CANDIDATE_2026-09-30.md`
- `operations/BOARD_MEDIA_PERFORMANCE_PRODUCTION_DEPLOY_2026-09-30.md`
- `operations/BOARD_MEDIA_PERFORMANCE_LIVE_ACCEPTANCE_2026-09-30.md`
- `operations/BOARD_MEDIA_PERFORMANCE_G8_2026-09-30.md`

No active implementation ownership remains for this Result.
