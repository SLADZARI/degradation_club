---
artifactId: dementor-club.operations.public-activity-truth-boundary-g6-2026-09-21
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: VALIDATION
gate: G6_VALIDATION
status: PASS
version: 1.0
updated: 2026-09-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: dementor-club.result.public-activity-truth-boundary-v1
parentIssue: 228
correctiveIssue: 229
productionBaseline: 2b17d54faaf3eb3eafb287cef1211554b28871b2
candidateCommit: 40ba7ecea44206ded37ceb714d2becb6f2698c12
pullRequest: 230
validationRunId: 35608787457
validationRunNumber: 1224
validationConclusion: SUCCESS
---

# STAB-01 · Public Activity Truth Boundary · G6 validation

## Verdict

```text
G6 VALIDATION PASS
READY FOR CLEAN RELEASE DECISION
```

No production release action is implied or authorized by this evidence.

## Governance handoff

Board Relations remains released but no longer owns active implementation:

```text
board-relations-v1
status = WAITING
gate = G8_CLEANUP
integrationBranch = null
```

Current Result:

```text
public-activity-truth-boundary-v1
status = ACTIVE
gate = G6_VALIDATION
branch = result/public-activity-truth-boundary-v1
```

One active Result / one active integration branch invariant: PASS.

`dementor-club-site` was not reset, merged, rebased or otherwise mutated.

## Clean implementation base

Production baseline:

`2b17d54faaf3eb3eafb287cef1211554b28871b2`

Candidate:

`40ba7ecea44206ded37ceb714d2becb6f2698c12`

Branch was created directly from the exact production baseline because staging carried unrelated reconciliation delta.

Production → candidate:

```text
status = ahead
ahead_by = 5
behind_by = 0
changed files = 5
```

Exact Result-owned delta:

1. `public-activity-v1.js`
2. `scripts/validate-board-public-activity-browser.mjs`
3. `scripts/validate-board-public-activity-contract.mjs`
4. `scripts/validate-evidence-hygiene-browser.mjs`
5. `supabase/migrations/20260921134959_public_activity_truth_boundary_v1.sql`

No README reconciliation delta, reconciliation evidence files or Board Relations implementation files are present.

## Corrective contract

No released generic editorial/public eligibility owner exists for arbitrary Board Artifacts.

Therefore the corrective is fail-closed:

```text
Board publication
!=
anonymous editorial/public Activity
```

The corrective migration preserves the existing `dc_public_activity_read_v1` signature, return schema and execute surface but returns zero generic rows and does not read `dc_artifacts` or `dc_artifact_media`.

No new table, field, enum, visibility level, generic editorial state, media owner or Programming state was introduced.

Historical migrations remain unchanged.

Current Program and ThingProjection remain unchanged.

## Browser / regression validation

Site Integrity / Release Readiness:

```text
run #1224
run id 35608787457
exact head 40ba7ecea44206ded37ceb714d2becb6f2698c12
conclusion SUCCESS
```

Relevant PASS evidence:

- Board public activity contract: OK.
- Board public activity browser acceptance:
  `fail-closed anonymous Home/Community + no private media leakage + desktop/mobile/direct-refresh + authenticated Board media + Board/Artifact YouTube`.
- Evidence Hygiene:
  public Activity fails closed for QA and ordinary Board Artifacts; Current Program remains intact.
- Current Program browser acceptance PASS.
- Board Relations v1 browser acceptance PASS.
- Browser shell / Workspace recovery PASS.
- WebKit auth regression PASS.
- Production route manifest PASS: 34 indexable · 17 private/compat · 1 disabled.
- Production artifact release gate PASS.

The STAB-01 browser validator covers:
- ordinary Member Artifact source fixture;
- institutional/club Artifact source fixture;
- YouTube Board Artifact source fixture;
- private-image Board Artifact source fixture;
- QA Artifact source fixture;
- anonymous Home desktop + 390/360 mobile;
- anonymous Community desktop + mobile;
- direct refresh;
- no anonymous private storage/signed transport;
- authenticated Board synthetic session preserving ordinary Artifact, YouTube and private signed-image behavior;
- Artifact detail YouTube presentation.

STAB-01-specific Safari/WebKit public Activity behavior was not separately exercised; WebKit auth regression passed as part of full Site Integrity.

## Pagination boundary

Anonymous Community receives zero generic rows.

The browser regression proves:
- initial read returns no generic Artifact;
- no public Activity grid is created;
- no load-more control is created;
- no second cursor read can reveal historical Board Artifacts.

Result: PASS.

## Private media boundary

Anonymous Home/Community validation rejects any appearance of:
- private Board storage path;
- `dc-community-artifacts`;
- `/storage/v1/object/`;
- `token=`;
- signed private transport.

Authenticated Board regression still uses the existing signed-media path.

Result: PASS.

## Live production remains unchanged

Read-only Supabase verification after candidate validation:

```text
live migration ledger = 57
latest live migration = 20260918094000 board_relations_v1
20260921134959_public_activity_truth_boundary_v1 = NOT LIVE
live dc_public_activity_read_v1 count = 6
```

This is expected:

```text
migration committed in candidate
!=
migration applied live
```

No live database mutation was performed.

## PR state

Draft PR #230:

```text
OPEN
DRAFT
UNMERGED
base = dementor-club-production@2b17d54f...
head = 40ba7ece...
changed_files = 5
commits = 5
```

## Release boundary

Not authorized / not performed:

```text
live Supabase apply
production merge
backend production deploy
Pages production deploy
STAB-02
```

## Gate

```text
READY FOR CLEAN RELEASE DECISION
STOP
```
