---
artifactId: dementor-club.evidence.commerce-truth-guard-g7-merge-2026-09-16
project: dementor-club
documentType: QA_EVIDENCE
status: APPROVED_EVIDENCE
updated: 2026-09-16
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.commerce-truth-guard-v1
issue: 198
pullRequest: 215
candidateCommit: c8bb64c2045caee634a9c5600e2d9355b2756129
productionBaseCommit: 88a5efdb92a7a30678c5fcc74f02de7886c46d65
productionCommit: 0e13e2d1bd2bc5e5245d73759ec0b4a7f61b3fd4
productionDeployAuthorized: false
---

# Commerce Truth Guard v1 · G7 merge evidence

## Authorization

Project owner explicitly authorized the production merge of PR #215 on 2026-09-16.

This authorization covered **merge only**. It did not authorize production deploy.

## Exact candidate lock

Before merge:

- PR: `#215`
- base: `dementor-club-production@88a5efdb92a7a30678c5fcc74f02de7886c46d65`
- exact head: `c8bb64c2045caee634a9c5600e2d9355b2756129`
- G6 Site Integrity: `#1196 / run 35093437784 / SUCCESS`
- mergeable: true

The PR was moved from draft to ready-for-review only to execute the already authorized merge. No runtime code changed during that transition.

## Merge

PR #215 was merged with `expected_head_sha=c8bb64c2045caee634a9c5600e2d9355b2756129`.

Production merge commit:

`0e13e2d1bd2bc5e5245d73759ec0b4a7f61b3fd4`

## Ancestry verification

The production merge commit has exactly two parents:

1. previous production baseline: `88a5efdb92a7a30678c5fcc74f02de7886c46d65`
2. validated candidate: `c8bb64c2045caee634a9c5600e2d9355b2756129`

Therefore no unvalidated runtime mutation was inserted between the G6 candidate and the production merge.

## Deploy boundary

No pull-request-triggered workflow run was observed for production commit `0e13e2d1...` immediately after merge.

`productionMergeAuthorized=true`

`productionDeployAuthorized=false`

**MERGE ≠ DEPLOY.**

The Result remains open until separately authorized deploy, production artifact verification, live public Merch retest and G8 cleanup.