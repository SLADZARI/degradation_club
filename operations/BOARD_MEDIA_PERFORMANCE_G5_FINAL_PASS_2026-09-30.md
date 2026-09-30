---
artifactId: dementor-club.operations.board-media-performance-g5-final-pass-2026-09-30
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: PASS
version: 1.0
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
result: dementor-club.result.board-media-performance-v1
candidateCommit: 91a05166a46ad108f7f2aed3b66c5c1464b2863d
siteIntegrityRun: 1331
siteIntegrityRunId: 36728660995
---

# Board / Media Performance v1 — G5 final PASS

## Exact candidate

`91a05166a46ad108f7f2aed3b66c5c1464b2863d`

Integration branch and PR #250 both point to this exact candidate.

## Exact-head CI

Site Integrity:

```text
#1331
run id: 36728660995
conclusion: SUCCESS
failed steps: 0
skipped steps: 0
```

Confirmed on the exact candidate:

- Board v2.1 fullscreen PASS;
- Board navigation/adaptive PASS;
- Board Relations PASS;
- Artifact Collaboration PASS;
- BQA-24 PASS on desktop / 390 / 360;
- BQA-28 freshness PASS;
- production artifact release gate PASS.

## Standalone Board / Media performance proof

Executed on the exact candidate with no code changes:

`node scripts/validate-board-media-performance-browser.mjs`

Validator exit code:

`0`

Validation blobs:

```text
validator
37465f8597338af0d4838a21a57c2b9a985fb6ee

board.js
90899f5f2747388f8f78d58e1052f833a9dc61bb
```

Request-count acceptance:

```text
1 Idea  -> 1 batch RPC  PASS
5 Ideas -> 1 batch RPC  PASS
20 Ideas -> 1 batch RPC PASS
ordinary performance scenario PASS
```

Observed optimized scenario:

```text
structuralMs                     88.5
interactiveMs                    88.5
participantRpcCountBeforeFirstRender 0
signedUrlCountBeforeFirstRender 0
participantRpcCount              1
signedUrlCount                   2
```

Media fixtures covered JPEG / PNG / WebP, landscape / portrait / transparent / near-4MB / small, plus Safari fallback.

Temporary localhost permission was used only in the sandbox Chromium policy to execute the local browser validator and was restored after the test. Repository/runtime were unchanged.

## G5 verdict

```text
frontend exact-head CI         PASS
backend local DB runtime       PASS
participant batch adapter      PASS
BQA-24 / BQA-28                PASS
media normalization            PASS
standalone performance proof   PASS
code changes during final proof NO

G5 = PASS / CLOSED
next gate = G6_VALIDATION
```

No live Supabase mutation, production merge or deploy is authorized by this evidence.
