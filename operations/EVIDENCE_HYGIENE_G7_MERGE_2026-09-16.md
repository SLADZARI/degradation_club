---
artifactId: dementor-club.evidence.evidence-hygiene-g7-merge-2026-09-16
project: dementor-club
documentType: QA_EVIDENCE
status: APPROVED_EVIDENCE
updated: 2026-09-16
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.evidence-hygiene-v1
issue: 201
pullRequest: 216
candidateCommit: 0a9687266aa27ea2bd40fa12099052e1308b6ae2
productionBaseCommit: 0e13e2d1bd2bc5e5245d73759ec0b4a7f61b3fd4
productionCommit: b68cd84bd284e599f3adcce46659e4654e23d05d
productionMergeAuthorized: true
backendDeployAuthorized: false
pagesDeployAuthorized: false
migrationApplied: false
---

# Evidence Hygiene v1 · G7 merge evidence

## Authorization

Project owner explicitly authorized the production merge of PR #216 on 2026-09-16.

Authorization covered **merge only**. Backend deploy and Pages deploy remain separately unauthorized.

## Exact candidate lock

Immediately before merge:

- PR: `#216`
- base: `dementor-club-production@0e13e2d1bd2bc5e5245d73759ec0b4a7f61b3fd4`
- exact head: `0a9687266aa27ea2bd40fa12099052e1308b6ae2`
- G6 Site Integrity: `#1197 / run 35141615180 / SUCCESS`
- mergeable: `true`
- production Supabase migration ledger ended at `20260914090000_board_public_activity_read_v1`
- `20260916213500_evidence_hygiene_v1.sql` was not applied.

The PR was moved from Draft to Ready solely to execute the authorized merge. Head and base did not change.

## Merge

PR #216 was merged with merge method `merge` and expected-head lock:

`expected_head_sha=0a9687266aa27ea2bd40fa12099052e1308b6ae2`

Production merge commit:

`b68cd84bd284e599f3adcce46659e4654e23d05d`

No squash or rebase was used.

## Ancestry verification

The production merge commit has exactly two parents:

1. previous production baseline: `0e13e2d1bd2bc5e5245d73759ec0b4a7f61b3fd4`
2. exact G6-validated candidate: `0a9687266aa27ea2bd40fa12099052e1308b6ae2`

Therefore the exact validated candidate is directly present in production ancestry and no unvalidated runtime commit was inserted between G6 and the merge.

## Deploy boundary

After merge:

- `dementor-club-production` head = `b68cd84bd284e599f3adcce46659e4654e23d05d`;
- PR #216 = merged;
- Evidence Hygiene migration remains unapplied in production Supabase;
- backend deploy was not executed;
- Pages deploy was not executed;
- live retest has not been performed;
- G8 remains open;
- issue #201 remains open.

`productionMergeAuthorized=true`

`backendDeployAuthorized=false`

`pagesDeployAuthorized=false`

**PRODUCTION MERGED / DEPLOY LOCKED.**

`MERGE ≠ BACKEND DEPLOY ≠ PAGES DEPLOY ≠ LIVE RETEST ≠ G8`
