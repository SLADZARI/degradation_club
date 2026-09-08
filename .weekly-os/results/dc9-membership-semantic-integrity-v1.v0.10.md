---
artifactId: dementor-club.result.dc9-membership-semantic-integrity-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G8_CLEANUP
status: DRAFT
version: 0.10
updated: 2026-09-08
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.9
---

# MP | Dementor Club | BUILD | DC-9 / Membership Semantic Integrity v1 | v0.10

## Goal
Complete G8 entropy reduction after the released and live-retested DC-9 / Membership integrity Result without changing:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

## Current status
**G8 CLEANUP MERGED TO PRODUCTION / DEPLOY EXPLICITLY AUTHORIZED / MANUAL WORKFLOW DISPATCH PENDING**

Original released production commit: `472882c95ffd1d9fae165edf4dcaf4e1865337a9`  
Original release G6: **#893** (`34256560528`) — SUCCESS  
Original deploy: **#48** (`34258541128`) — SUCCESS  
Original live retest: PASS

G8 cleanup branch: `agent/dc9-membership-semantic-integrity-g8`  
G8 PR: **#137** — MERGED  
G8 candidate: `ca84a64fdeb8579bb686e9e4e584d5ac4b648399`  
Fresh cleanup G6: **#894** (`34267025765`) — SUCCESS  
Cleanup production merge commit: `b1ed177564581c820e3739e70404957108157af1`

## Pre-merge evidence
Immediately before merge:
- `dementor-club-production` HEAD was exactly `472882c95ffd1d9fae165edf4dcaf4e1865337a9`;
- PR #137 base was `dementor-club-production` at that exact SHA;
- PR #137 head was `ca84a64fdeb8579bb686e9e4e584d5ac4b648399`;
- PR was mergeable;
- Site Integrity / Release Readiness #894 matched the exact head and concluded SUCCESS.

The PR was moved from draft to ready and merged with expected-head protection, producing production commit:

`b1ed177564581c820e3739e70404957108157af1`.

Post-merge branch read confirms `dementor-club-production` HEAD is exactly that merge commit.

## Cleanup diff released by merge
Exactly four files relative to the prior production baseline:
1. `dementor-account-sync-v8.js` — removed;
2. `dementor-account-sync-v9.js` — removed;
3. `join-storage-guard.js` — periodic dual alias writer replaced by one-shot `self-development → self_development` result migration;
4. `scripts/validate-dc9-sync-integrity.mjs` — G8 entropy assertions added.

Canonical owner remains:

`site-config.js → dementor-account-sync-v10.js → community-runtime-v1.js/getClient()`.

`join/apply/apply.js → syncLocalAssessmentRuns()` remains intentionally retained as the existing idempotent current-map compatibility guard because safe removal is not yet independently proven.

## Authorization
On 2026-09-08 the project owner explicitly instructed:

`мерж и деплой cleanup`

Therefore for this cleanup release:
- production merge authorization: **YES**;
- production deploy authorization: **YES**;
- live Supabase mutation authorization: **NO / NOT NEEDED**.

## Deploy state
Production deploy is **not yet claimed**.

The canonical workflow is `.github/workflows/deploy-pages.yml` (`Deploy Dementor Production`). It is `workflow_dispatch` only and requires input:

`release_confirmation = APPROVED`.

The currently available GitHub connector exposes PR/file/branch mutations and workflow read/re-run operations, but does not expose a new workflow-dispatch action. Re-running the previous deploy run is not used because GitHub reruns preserve the original run ref/SHA and would not be valid evidence for the new production commit.

Therefore this Result remains at G8 until the authorized manual dispatch runs against `dementor-club-production` at `b1ed1775...`, completes successfully, and a short live smoke is recorded.

## Required closure evidence
1. manual `Deploy Dementor Production` dispatch on `dementor-club-production` with `release_confirmation=APPROVED`;
2. deploy workflow SUCCESS and Pages artifact/deployment evidence;
3. live smoke confirming Join/DC-9 load, canonical v10 account sync path, application guard, Workspace/Board spot-check and no regression from one-shot alias migration;
4. canonical QA ledger reconciliation for QA-MEM-035…042;
5. final Result/kernel update and stale-branch cleanup where tooling permits.

## Gate
Current: **G8_CLEANUP**.

Merge is complete and deploy is authorized, but deployment and post-deploy live evidence are still pending.