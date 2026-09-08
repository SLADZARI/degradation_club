---
artifactId: dementor-club.result.dc9-membership-semantic-integrity-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G8_CLEANUP
status: DRAFT
version: 0.9
updated: 2026-09-08
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.8
---

# MP | Dementor Club | BUILD | DC-9 / Membership Semantic Integrity v1 | v0.9

## Goal
Complete G8 entropy reduction after the released and live-retested DC-9 / Membership integrity Result without changing the protected lifecycle:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

## Status
**RELEASED / G7 LIVE RETEST PASS / G8 CLEANUP CANDIDATE G6 PASS / PRODUCTION CLEANUP MERGE+DEPLOY NOT AUTHORIZED**

Released production commit: `472882c95ffd1d9fae165edf4dcaf4e1865337a9`  
Original release G6: **#893** (`34256560528`) — SUCCESS  
Original production deploy: **#48** (`34258541128`) — SUCCESS  
G8 cleanup branch: `agent/dc9-membership-semantic-integrity-g8`  
G8 PR: **#137** — DRAFT / OPEN / MERGEABLE  
Cleanup candidate: `ca84a64fdeb8579bb686e9e4e584d5ac4b648399`  
Fresh cleanup G6: **#894** (`34267025765`) — **SUCCESS**

## Original release evidence retained
Release chain is complete:

`DB migration PASS → G6 #893 PASS → production merge PASS → deploy #48 PASS → live functional retest PASS`

Live browser evidence includes:
- Guest DC-9 partial draft persistence / reload / resume;
- login and Workspace recovery;
- active-member Application guard;
- strict phone/browser DC-9 synchronization;
- Board desktop/mobile spot-check;
- phone-to-desktop Board card-position persistence.

Production Supabase remains on migration:

`20260908132816_dc9_membership_semantic_integrity_v1`

No new database mutation is part of G8 cleanup.

## G8 cleanup diff
The cleanup branch starts from exact released production baseline `472882c...`; no `dementor-club-site` merge is used.

Exactly four files differ from current production:

1. `dementor-account-sync-v8.js` — removed;
2. `dementor-account-sync-v9.js` — removed;
3. `join-storage-guard.js` — permanent 1200 ms dual alias writer replaced by one-shot `self-development → self_development` result migration;
4. `scripts/validate-dc9-sync-integrity.mjs` — existing validator extended with G8 entropy assertions.

Canonical account-sync ownership remains:

`site-config.js → dementor-account-sync-v10.js → community-runtime-v1.js/getClient()`.

The one-shot migration keeps the newer logical result when both historical and canonical keys exist, writes only the canonical key and deletes the legacy result key. It does not maintain a parallel state owner after migration.

## Compatibility retained by evidence
`join/apply/apply.js → syncLocalAssessmentRuns()` remains in place.

It is currently an idempotent current-map compatibility guard using canonical sphere IDs and existing append-only run persistence. It looks partly redundant next to `dc9-baseline-sync-v1.js`, but removing it without a dedicated behavioral proof would exceed safe cleanup and could alter a current Application handoff contract.

## Fresh G6 #894 — PASS
All release-readiness steps passed on `ca84a64...`, including:
- registry/routes/features;
- content and visual contract;
- DC-9 immutable baseline;
- extended account-sync / G8 integrity validator;
- Membership semantic authority;
- Board v2/v2.1 static contracts;
- production build + analytics/consent;
- canonical shell + built JS syntax;
- Google OAuth handoff;
- DC-9 browser login/cross-device recovery;
- Board fullscreen browser state matrix;
- Workspace recovery;
- My Artifacts;
- WebKit auth;
- production route manifest;
- final production artifact release gate.

New G8 validator evidence proves:
- v8/v9 account-sync sources are absent;
- v10 remains the only selected sync owner;
- legacy result alias migrates once and is deleted;
- no periodic alias `setInterval` survives;
- canonical migration filename `20260908132816_...` exists and superseded `20260908135500_...` is absent;
- temporary Board projection-only CSS workarounds do not survive.

## Branch audit
- `agent/dc9-membership-semantic-integrity-v1` is fully contained in production (`0 ahead / 1 behind`) and is a stale-branch deletion candidate after Result closure.
- `agent/dc9-membership-semantic-integrity-release-evidence` is historically divergent and is not safe for blind deletion.
- `agent/qa-dc9-membership-handoff-20260908` is historically divergent and is not safe for blind deletion.
- the current G8 cleanup branch is the one active integration branch for this Result.

The currently available GitHub connector does not expose a branch-delete action, therefore no branch deletion is claimed.

## Canonical QA ledger reconciliation
The historical ledger `operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md` remains the canonical QA ledger. Its old batch text is historical evidence and must not be truncated or silently rewritten.

Final QA-MEM-035…042 reconciliation is reserved for the cleanup release/closure write so it can record one final state: original release + live retest + G8 cleanup outcome. Until PR #137 is actually released, no `DONE` claim is made.

## Release boundary
G8 cleanup code is validated but **not merged and not deployed**.

The authorization used for the original DC-9 release does not carry forward automatically to this cleanup release.

Required before production cleanup release:
1. recheck `dementor-club-production` head is still the cleanup base;
2. recheck PR #137 head and #894 evidence;
3. explicit user authorization to merge cleanup;
4. separate explicit deploy authorization;
5. short live smoke after deployment;
6. final canonical ledger reconciliation and Result closure.

## Gate
Current: **G8_CLEANUP**.

Cleanup candidate is full-G6 green. Production remains unchanged until separately authorized.
