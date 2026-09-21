---
artifactId: dementor-club.result.public-activity-truth-boundary-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: ACTIVE
version: 0.1
updated: 2026-09-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentIssue: 228
correctiveIssue: 229
scope:
  - BQA-11
  - BQA-12
  - BQA-13
integrationBranch: result/public-activity-truth-boundary-v1
productionBaseCommit: 2b17d54faaf3eb3eafb287cef1211554b28871b2
implementationStartAuthorized: true
technicalCorrectiveMigrationAuthorized: true
liveDatabaseMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
schemaExpansionAuthorized: false
---

# MP | Dementor Club | BUILD | Public Activity Truth Boundary v1 | Result v0.1

## Goal

Restore the released product boundary:

```text
BOARD COMMUNITY VISIBILITY
≠
ANONYMOUS EDITORIAL / PUBLIC ACTIVITY
```

No released generic public/editorial eligibility owner exists for arbitrary Board Artifacts. Therefore this stabilization corrective is fail-closed rather than a new product model.

## Status

**ACTIVE / G5_BUILD**

Parent: #228 — STABILIZATION.

Corrective: #229 — STAB-01 · Public Activity truth boundary · BQA-11/12/13.

## Production baseline

`dementor-club-production@2b17d54faaf3eb3eafb287cef1211554b28871b2`

Implementation branch must be created directly from this exact production commit because `dementor-club-site` contains unrelated reconciliation delta and is not the STAB-01 owner.

## Root corrective

Canonical public read owner:

`public.dc_public_activity_read_v1`

Until an explicit approved generic editorial eligibility owner exists:

```text
ordinary Member Artifact
club/publisher-scope Artifact
YouTube Board Artifact
private-image Board Artifact

+ Board publication

DOES NOT imply anonymous Home/Community Public Activity
```

Current Program v0 remains a separate reviewed composition and is not a generic Artifact whitelist.

## Scope boundaries

Allowed:
- one corrective migration replacing/restricting the existing public Activity read contract;
- narrow public Activity copy correction where existing wording becomes false;
- extension of existing public Activity / evidence-hygiene validators;
- targeted/browser/full CI evidence.

Not allowed:
- new table, field, enum, visibility level or generic editorial state;
- Current Program or ThingProjection semantic changes;
- Board publication owner changes;
- private Board media exposure;
- Membership/Auth/DC9/Application changes;
- Contribution, Project/Course creation, STAB-02+ work.

## Acceptance criteria

1. Board publication alone cannot make any generic Artifact anonymously readable through `dc_public_activity_read_v1`.
2. Publisher scope, media provider/type, YouTube capability and private image presence do not act as editorial eligibility.
3. Pagination cannot bypass the fail-closed boundary.
4. Anonymous Home/Community do not expose private Board storage paths or signed URLs.
5. Current Program v0 remains unchanged.
6. Authenticated Board publication/media lifecycle remains unchanged.
7. Existing YouTube media capability remains intact outside generic anonymous Artifact promotion.
8. Production→candidate diff contains only STAB-01-owned files.
9. Full Site Integrity passes exact candidate.
10. Stop at validated candidate; no live Supabase apply, production merge or deploy without separate owner authorization.

## Gate

`G5_BUILD`

Evidence will be attached after targeted validation, browser regression, full Site Integrity and exact production-baseline diff review.
