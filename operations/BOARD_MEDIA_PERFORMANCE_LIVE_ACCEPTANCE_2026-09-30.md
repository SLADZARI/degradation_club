---
artifactId: dementor-club.operations.board-media-performance-live-acceptance-2026-09-30
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: PASS
version: 1.0
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: dementor-club.result.board-media-performance-v1
productionCommit: cde332779ab0e256dd1e498660d6fa651e91846e
supabaseRunId: 36742339436
pagesRunId: 36742651703
---

# Board / Media Performance v1 — live acceptance

## Verdict

**LIVE ACCEPTANCE PASS**

Exact production:

`cde332779ab0e256dd1e498660d6fa651e91846e`

## Owner flow

Owner completed the requested authenticated production flow on `/workspace/board/`:

1. open authenticated Board;
2. verify Board becomes usable without the former prolonged blank wait;
3. create temporary Idea `QA MEDIA 30-09` with an image;
4. publish;
5. verify image on the Board card;
6. open detail and verify image/content;
7. close/back and return to usable Board.

Owner reported the flow completed successfully.

## BQA-20 live media proof

Production row:

```text
title                 QA MEDIA 30-09
artifact_type         idea
status                active
visibility            community
media_type            image
storage_bucket        dc-community-artifacts
```

Canonical media metadata:

```text
original MIME         image/png
original bytes        3,446,542
original dimensions   4096 × 2560

normalized MIME       image/webp
normalized bytes      75,736
normalized dimensions 1800 × 1125
normalization_applied true
decoder               image-bitmap
```

The actual Storage object matches the normalized representation:

```text
stored MIME           image/webp
stored bytes          75,736
extension             .webp
```

Therefore the live canonical flow is:

`Board composer → normalize → canonical bucket → dc_artifact_media metadata → Board/detail render`

No second bucket/table/upload owner exists.

## BQA-27 live batch proof

During the same authenticated production session, Supabase production logs recorded:

```text
POST /rest/v1/rpc/dc_artifact_participants_batch_read_v1
status 200
role authenticated
```

The event occurred during the owner live QA flow.

This confirms that the deployed Board uses the production batch participant path rather than the retired per-Idea Board fallback.

Pre-release exact-head performance evidence remains:

```text
1 Idea   -> 1 batch RPC PASS
5 Ideas  -> 1 batch RPC PASS
20 Ideas -> 1 batch RPC PASS
structural first render before participant/media/signing work PASS
```

## Public smoke

After deployment:

- Club home responds;
- `/community/board/` resolves to canonical `/workspace/board/`;
- guest Board gate remains closed to non-members;
- deployed media normalization helper is live.

## Conclusion

```text
BQA-20 live acceptance PASS
BQA-27 live acceptance PASS
production batch RPC   PASS / HTTP 200
canonical media upload PASS
Board/detail owner flow PASS

LIVE ACCEPTANCE = PASS
G8 = AUTHORIZED
```
