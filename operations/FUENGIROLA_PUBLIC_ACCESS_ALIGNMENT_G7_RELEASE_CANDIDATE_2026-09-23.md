---
artifactId: dementor-club.operations.fuengirola-public-access-alignment-g7-release-candidate-2026-09-23
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: BUILD
gate: G7_RELEASE
status: APPROVED
version: 1.0
updated: 2026-09-23
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentIssue: 228
scope:
  - BQA-10
  - Fuengirola public access alignment
---

# Fuengirola Public Access Alignment · G7 release candidate

Exact candidate:

`a63768c391eabd102c1dac1e9c123fc5c7b5b260`

Exact production base:

`7827a4d5e8bee21c142390a9e9ea78e4542e1ee9`

PR:

`#242 · OPEN / DRAFT / UNMERGED / mergeable`

Validation:

`Site Integrity / Release Readiness #1258 / 35882072137 · SUCCESS`

Diff:

`6 files / behind 0`

No backend deployment is required.

Release boundary:

- production merge authorized by owner instruction to complete the remaining stabilization sequence;
- Supabase must not run;
- Pages must deploy only after exact merge verification;
- live public retest must follow exact Pages SHA.
