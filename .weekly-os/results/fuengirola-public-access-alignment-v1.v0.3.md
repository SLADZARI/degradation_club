---
artifactId: dementor-club.result.fuengirola-public-access-alignment-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G7_RELEASE
status: REVIEW
workStatus: ACTIVE
version: 0.3
updated: 2026-09-23
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.2
parentIssue: 228
sourceDecisionIssue: 204
scope:
  - BQA-10
  - Fuengirola public access alignment
integrationBranch: result/fuengirola-public-access-alignment-v1
integrationBaseRef: dementor-club-production
integrationBaseCommit: 7827a4d5e8bee21c142390a9e9ea78e4542e1ee9
productionBaseCommit: 7827a4d5e8bee21c142390a9e9ea78e4542e1ee9
candidateCommit: a63768c391eabd102c1dac1e9c123fc5c7b5b260
releaseCandidateCommit: a63768c391eabd102c1dac1e9c123fc5c7b5b260
productionCommit: df8a24eca2bcca25339f128c7da93982515cf442
productionMergeCommit: df8a24eca2bcca25339f128c7da93982515cf442
integrationPullRequest: 242
validationRunNumber: 1258
validationRunId: 35882072137
validationConclusion: SUCCESS
exactDiffFileCount: 6
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: true
productionDeployAuthorized: true
gateReadiness: MERGED_AWAITING_PAGES_DEPLOY
liveRetestStatus: MERGED_AWAITING_DEPLOY
---

# Fuengirola Public Access Alignment v1 · Result v0.3

**ACTIVE / G7_RELEASE — MERGED / AWAITING PAGES DEPLOY**

Validated candidate `a63768c391eabd102c1dac1e9c123fc5c7b5b260` was merged via PR #242 to exact production `df8a24eca2bcca25339f128c7da93982515cf442`.

Production content equals the validated candidate; candidate → production content diff is zero.

Supabase/backend deploy is not required.

Merge evidence:

`operations/FUENGIROLA_PUBLIC_ACCESS_ALIGNMENT_G7_MERGE_2026-09-23.md`

Next:

`Deploy Dementor Production` on `dementor-club-production`, then exact-SHA public live retest and G8.
