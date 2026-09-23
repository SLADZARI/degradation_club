---
artifactId: dementor-club.result.fuengirola-public-access-alignment-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G7_RELEASE
status: REVIEW
workStatus: ACTIVE
version: 0.2
updated: 2026-09-23
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.1
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
gateReadiness: READY_FOR_RELEASE
---

# Fuengirola Public Access Alignment v1 · Result v0.2

**ACTIVE / G7_RELEASE — VALIDATED / READY FOR EXACT RELEASE**

Approved authority:

`operations/FUENGIROLA_ACCESS_POLICY_DECISION_V1.md`

Validated candidate:

`a63768c391eabd102c1dac1e9c123fc5c7b5b260`

Production base:

`7827a4d5e8bee21c142390a9e9ea78e4542e1ee9`

PR #242 is the only integration PR.

## Outcome in candidate

- legacy Membership/Join Event funnel removed;
- confirmed Event truth remains direct;
- PLANNED remains canonical;
- registration remains disabled;
- no replacement access vocabulary invented;
- no registration/booking/waitlist/payment flow invented;
- Current Program / Board / ThingProjection remain unchanged.

## Evidence

- G6: `operations/FUENGIROLA_PUBLIC_ACCESS_ALIGNMENT_G6_2026-09-23.md`
- G7: `operations/FUENGIROLA_PUBLIC_ACCESS_ALIGNMENT_G7_RELEASE_CANDIDATE_2026-09-23.md`
- Site Integrity #1258 / 35882072137 · SUCCESS.

No Supabase deploy is required.
