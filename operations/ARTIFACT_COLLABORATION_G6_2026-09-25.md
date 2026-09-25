---
artifactId: dementor-club.operations.artifact-collaboration-g6-2026-09-25
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: VALIDATION
gate: G6_VALIDATION
status: PASS
version: 1.0
updated: 2026-09-25
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: dementor-club.result.artifact-collaboration-v1
productionBaseline: df8a24eca2bcca25339f128c7da93982515cf442
candidateCommit: 5769fb10a19fbc2fe492d0b706f07d35df5e8be6
validationRun: 1306
validationRunId: 36183292073
validationConclusion: SUCCESS
exactDiffFileCount: 31
liveDatabaseMutation: false
productionMutation: false
---

# Artifact Collaboration v1 — G6 validation

## Verdict

**G6 PASS**

**READY FOR CLEAN G7 RELEASE CANDIDATE PREPARATION**

This validates the exact integration candidate. It does not authorize G7 execution, live Supabase mutation, production merge or deployment.

## Exact identities

```text
production baseline  df8a24eca2bcca25339f128c7da93982515cf442
integration branch   result/artifact-collaboration-v1
candidate            5769fb10a19fbc2fe492d0b706f07d35df5e8be6
Site Integrity       #1306 / 36183292073
conclusion           SUCCESS
```

Current `dementor-club-production` head still equals the Result production baseline. The candidate is 61 commits ahead, 0 behind, with the production baseline as merge base.

The candidate therefore has no inherited `dementor-club-site` divergence.

## Diff boundary

Production baseline → candidate contains exactly 31 reviewed changed paths:

1. `.github/workflows/site-integrity.yml`
2. `community/artifact/artifact.css`
3. `community/artifact/artifact.js`
4. `community/board/board-composer-sheet-v2.css`
5. `community/board/board-deeplink-auth-return-v1.js`
6. `community/board/board-entry-v2.js`
7. `community/board/board-fullscreen-v2-1.css`
8. `community/board/board-fullscreen-v2-1.js`
9. `community/board/board-mobile-air-v2-1.css`
10. `community/board/board-own-drag-livefix-v2-2.js`
11. `community/board/board-relations-v1.css`
12. `community/board/board-relations-v1.js`
13. `community/board/board-spatial-v1.js`
14. `community/board/board.js`
15. `operations/ARTIFACT_COLLABORATION_BACKEND_G4_CONTRACT_2026-09-24.md`
16. `operations/SUPABASE_OBSERVED_PRODUCTION_COMPATIBILITY_OVERLAY_V1.md`
17. `operations/SUPABASE_PREHISTORY_REPLAY_FIXTURE_V1.md`
18. `scripts/diagnose-supabase-production-baseline-diff-local.mjs`
19. `scripts/validate-artifact-collaboration-browser.mjs`
20. `scripts/validate-artifact-collaboration-relation-delete-capability-local.mjs`
21. `scripts/validate-artifact-collaboration-v1.mjs`
22. `scripts/validate-board-public-activity-browser.mjs`
23. `scripts/validate-board-relations-runtime-browser.mjs`
24. `scripts/validate-board-relations-runtime-v1.mjs`
25. `scripts/validate-supabase-prehistory-replay-local.mjs`
26. `supabase/bootstrap/prehistory/01_pre_dementor_edu_schema.sql`
27. `supabase/bootstrap/prehistory/02_minimal_synthetic_auth_identities.sql`
28. `supabase/bootstrap/prehistory/03_auth_trigger_binding.sql`
29. `supabase/bootstrap/production-compatibility/01_observed_production_functions.sql`
30. `supabase/bootstrap/production-compatibility/02_observed_production_policies.sql`
31. `supabase/migrations/20260924002500_artifact_collaboration_v1.sql`

The diff is limited to Artifact Collaboration implementation, existing-owner correctives required to make that capability work, CI/browser/static validators, and local production-compatible replay support.

No unrelated staging-only path is inherited.

G7 must still create a clean release candidate from the then-current production baseline and reproduce only the reviewed Result-owned release diff. G6 does not authorize a blind branch merge.

## G6 acceptance matrix

### Build / syntax / release-readiness

PASS on exact candidate through Site Integrity #1306:

- build candidate artifact;
- built JavaScript syntax;
- canonical shell;
- production route manifest;
- production artifact release gate.

### Migration execution / replay / repeatability

PASS against the observed-production-compatible local target.

Artifact Collaboration migration:

`supabase/migrations/20260924002500_artifact_collaboration_v1.sql`

Blob:

`b596500ed3145ec1f352464c8609c38e02efbc05`

Proven:

- clean migration replay;
- migration history entry;
- second clean reset/replay;
- production-compatible baseline guard;
- unrelated drift surfaces preserved.

The local post-reset `WARN_502` remains a service-restart warning; direct DB proof passed.

### RPC / RLS / no-oracle

PASS:

- positive CIRCLE Idea publish;
- outsider CIRCLE denial;
- generic no-oracle terminal state;
- participation invite/join/decline/leave/remove transitions;
- participant roster read;
- safe invite candidate projection without private email;
- relation read requires both endpoints readable;
- inaccessible CIRCLE relation omitted;
- relation delete capability aligned with server mutation authority.

### Relevant actor boundaries

PASS for the Result-relevant authority boundaries:

- Owner Admin operational authority preserved;
- active Member author/participant paths validated;
- scoped Dementor relation-manager authority preserved and does not become unlimited slot authority;
- Guest/Applicant do not gain Artifact publication, CIRCLE participation or participant relation write authority from this Result;
- membership lifecycle semantics remain unchanged.

The full Site Integrity membership and Board access contracts also passed on the exact candidate.

### COMMUNITY / CIRCLE

PASS:

- COMMUNITY regression preserved;
- CIRCLE author presentation;
- INVITED → JOINED;
- INVITED → DECLINED → generic unavailable;
- JOINED → LEFT → access ends;
- outsider no-oracle;
- independent Idea A / Idea B rosters.

### Storage / media

PASS:

- Artifact-aware Storage ACL composes the canonical Artifact read helper;
- broad Member-only storage read policy is retired for this surface;
- backend runtime `storage_privacy` matrix passed.

### Share / Auth return

PASS.

Share remains transport-only and does not create invitation/participation state.

Exact-head deeplink/auth-return browser acceptance passed, including mobile and WebKit coverage in Site Integrity.

### Relations

PASS:

- only `RELATED_TO` is available to the JOINED participant path;
- readable Artifact/Event/Program target composition preserved;
- create → canonical reread → server `can_delete` → delete;
- another participant relation is non-deletable;
- directional relation is non-deletable by participant;
- LEFT / REMOVED revoke participant delete capability;
- Owner Admin and canonical manager authority preserved;
- relation canvas/detail and SHOW/HIDE remain intact.

### Slot capacity

PASS:

- existing `dc_artifact_slot_grants` remains canonical;
- explicit Owner Admin grants;
- no Dementor unlimited bypass;
- COMMUNITY/CIRCLE consume capacity identically;
- slot ceiling blocks over-capacity publication;
- close/archive release path allows republish.

### Telegram / Public Activity

PASS fail-closed boundary:

- CIRCLE is not Telegram-eligible;
- pending ineligible distribution is suppressed;
- worker independently checks COMMUNITY;
- Artifact Collaboration does not reopen Public Activity eligibility;
- Board Public Activity browser regression passed.

### Desktop / mobile / ownership

PASS:

Desktop:

```text
spatial card → inline Relations
Enter/Space actual keydown target → current canonical summary
```

Mobile IDEA:

```text
spatial IDEA card → Artifact detail
inline spatial Relations hidden
existing Artifact-detail Relations owner reused
```

Fresh ownership acceptance:

```text
390 run 1 PASS
390 run 2 PASS
390 run 3 PASS
360 run 1 PASS
```

No horizontal overflow, Board pan, drag or position write was introduced.

### Sequential browser scenario

PASS for the non-production browser acceptance sequence:

- two Ideas with independent rosters;
- author invite selector / remove;
- invite acceptance;
- decline;
- leave;
- outsider no-oracle;
- participant RELATED_TO create/read/delete;
- desktop and mobile detail ownership.

The required real club scenario in production remains a later live-acceptance requirement before Result closure; G6 does not claim production/live proof.

### Duplicate / parallel owner check

PASS.

No second:

- Membership owner;
- slot owner;
- Board relation graph;
- auth/share owner;
- Artifact detail/modal owner;
- spatial/layout owner;
- mobile Relations mechanic.

The final mobile corrective explicitly reuses the existing Artifact-detail Relations owner.

## Migration collision preflight

Current production migrations end at:

`20260921134959_public_activity_truth_boundary_v1.sql`

Candidate migration:

`20260924002500_artifact_collaboration_v1.sql`

No production timestamp collision is present at G6.

This must be rechecked when the G7 release candidate is prepared.

## Release boundary

```text
G6 PASS
G7 = NOT ENTERED
LIVE SUPABASE APPLY = NO
PRODUCTION MERGE = NO
PRODUCTION DEPLOY = NO
```

G7, if separately authorized, must start from the current production baseline and validate a clean exact release diff with full CI again.
