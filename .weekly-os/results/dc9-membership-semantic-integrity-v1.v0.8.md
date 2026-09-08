---
artifactId: dementor-club.result.dc9-membership-semantic-integrity-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G8_CLEANUP
status: DRAFT
version: 0.8
updated: 2026-09-08
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.7
---

# MP | Dementor Club | BUILD | DC-9 / Membership Semantic Integrity v1 | v0.8

## Goal
Complete G8 entropy reduction after the released and live-retested DC-9 / Membership integrity Result without changing the protected lifecycle:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

## Status
**RELEASED / G7 LIVE RETEST PASS / G8 CLEANUP IMPLEMENTATION + FRESH G6 IN PROGRESS**

Released production commit: `472882c95ffd1d9fae165edf4dcaf4e1865337a9`  
G8 cleanup branch: `agent/dc9-membership-semantic-integrity-g8`  
G8 PR: `#137` — draft  
Current cleanup head: `ca84a64fdeb8579bb686e9e4e584d5ac4b648399`  
Fresh Site Integrity run: **#894** (`34267025765`) — **IN PROGRESS**

## G7 evidence retained
The release chain is complete and remains authoritative:

`DB migration PASS → G6 #893 PASS → production merge PASS → deploy #48 PASS → live functional retest PASS`

Live user validation includes Guest draft persistence/resume, authentication and Workspace recovery, active-member Application guard, strict phone/browser DC-9 synchronization, Board desktop/mobile regression spot-check and phone-to-desktop Board position persistence.

## G8 implementation
Cleanup is isolated on a new branch created from the exact released production baseline `472882c...`; `dementor-club-site` is not used.

Current diff intentionally contains only four files:

1. remove `dementor-account-sync-v8.js`;
2. remove `dementor-account-sync-v9.js`;
3. replace the 1200 ms `self-development` dual local writer in `join-storage-guard.js` with a one-shot migration to canonical `self_development`;
4. extend `scripts/validate-dc9-sync-integrity.mjs` with executable G8 entropy checks.

Canonical active account-sync owner remains:

`site-config.js → dementor-account-sync-v10.js → community-runtime-v1.js/getClient()`.

The one-shot legacy migration preserves the newer logical result when both old and canonical keys exist, writes only `self_development`, deletes `self-development`, and does not keep a periodic compatibility loop alive.

## Retained compatibility by evidence
`join/apply/apply.js → syncLocalAssessmentRuns()` is currently retained.

Reason: the Application entry path first syncs complete baseline/repeat history through `dc9-baseline-sync-v1.js`, while `apply.js` keeps an idempotent current-map attachment guard using canonical sphere IDs. It is redundant-looking but currently explicit in the shell/release contract and does not create a second semantic authority. Removing it without a dedicated proof would exceed safe G8 cleanup.

## G8 validator additions
The existing DC-9 sync-integrity validator now proves:
- v8/v9 sources are absent;
- v10 remains the only selected account-sync owner;
- historical `self-development` results migrate once to `self_development` and the legacy key is deleted;
- no periodic alias synchronization remains;
- canonical migration file `20260908132816_...` exists and superseded `20260908135500_...` does not;
- temporary Board projection-only CSS workarounds are absent;
- prior draft merge, immutable baseline, source-key and single-client assertions still run.

## Boundaries
This cleanup does not:
- mutate production database state;
- change Membership/Application/DC-9 semantics;
- change Board product behavior;
- close the separate Board Result;
- authorize production merge or deploy.

## Gate
Current: **G8_CLEANUP**.

PR #137 stays draft until fresh full G6 succeeds on the cleanup head. Production merge/deploy require separate explicit user authorization after validation evidence.
