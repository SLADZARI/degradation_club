---
artifactId: dementor-club.operations.qa-reconciliation-2026-09-28
project: dementor-club
documentType: QA_PLAN
projectStage: BUILD
gate: G5_BUILD
status: APPROVED_TRIAGE
version: 1.0
updated: 2026-09-28
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
canonicalLedger: operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md
currentResult: dementor-club.result.artifact-collaboration-v1
---

# Dementor Club — QA reconciliation · 2026-09-28

## Purpose

Reconcile the canonical QA ledger into actual work instead of treating every still-open line as an implementation task.

Unique inventory:

```text
QA-MEM  42
BQA     29
TOTAL   71
```

Before this reconciliation, 51 items were not formally closed.

Use four buckets:

```text
CLOSE NOW          existing evidence is sufficient; no code work
RETEST ONLY        implementation exists; close after live/human retest
REAL WORK          implementation/runtime work remains
DECISION REQUIRED  product/semantic decision before implementation
```

## 1. CLOSE NOW — 7

Existing evidence is sufficient for administrative closure without new implementation:

```text
QA-MEM-005  Logout discoverability
QA-MEM-012  Global Header ownership drift
QA-MEM-016  JS-generated route validator
QA-MEM-025  Google auth post-login legacy 404
QA-MEM-027  Workspace public-site escape
QA-MEM-029  Join member-return stale destinations
QA-MEM-034  DC-9 immutable first-complete baseline
```

After this reconciliation:

```text
71 total
27 closed
44 remain open
```

## 2. RETEST ONLY — 31

No developer patch unless the retest reproduces a defect.

### QA-MEM — 23

```text
001  legacy /join/member/
002  reviewer decision visually final
003  ACCOUNT → CART
006  active Member /join/apply/ copy
007  application nav contrast
008  private Board discoverability
009  Membership Review Workspace shell
010  archived Artifact history
011  /join/apply/ mobile sizing
013  footer geometry
014  shared Workspace shell/controller
015  Owner Admin route layout
017  sitemap/indexability
019  footer duplicate utility/navigation
020  Workspace null-DOM
022  Admin shell dependency
024  browser integration coverage
026  Guest Workspace private nav
028  Board spatial/integration behavior
030  Join black strip
031  Join member-return CTA layout
032  browser smoke critical paths
033  child-surface Workspace controls
```

### Behavioral BQA — 8

```text
BQA-01  share → received Artifact
BQA-02  received Artifact → Board context
BQA-03  detail close/minimize/back
BQA-04  relation-create discoverability
BQA-05  relation consequence
BQA-06  another person's Thing
BQA-08  Guest / Applicant role/access
BQA-09  1–3 day return
```

These require human/unassisted evidence. `ASSISTED PASS != closure`.

## 3. REAL WORK — 9

```text
BQA-07  Contribution/raw idea/material runtime gap
BQA-15  relation selector scale
BQA-20  image normalization/media pipeline
BQA-23  Owner Admin Community/Artifact operations UI
BQA-24  invitation discoverability
BQA-25  Artifact detail action hierarchy
BQA-26  LEFT/REMOVED destructive-action UX
BQA-27  Board first-render performance
BQA-28  collaboration roster refresh without reload
```

### Immediate current-Result corrective

The live Artifact Collaboration acceptance exposed four defects that preserve approved semantics and belong inside the current Result corrective:

```text
BQA-24
BQA-25
BQA-26
BQA-28
```

They do not change membership, roles, participation semantics, CIRCLE ACL, Artifact ownership or relation ontology.

Fresh active integration branch:

`result/artifact-collaboration-v1-live-ux-corrective`

Base:

`260c5fe911fb0cad9902ad2db5d76060f47c18cc`

Do not blindly reuse the historical pre-release integration branch.

### Work after current Result G8

Keep separate:

- BQA-27 + BQA-20: Board/media performance Result after owner inventory;
- BQA-23: Owner Admin Community Ops Result extending existing `/workspace/admin/`;
- BQA-15: Relations selector UX Result using the existing relation owner;
- BQA-07: Contribution Receipt Runtime only after the stable behavioral boundary permits it.

## 4. DECISION REQUIRED — 4

```text
QA-MEM-004  historical course completion vs repeat-attempt state
BQA-17      relations hidden-by-default / preference behavior
BQA-22      Course/Project creation authority / two-Dementor-support conflict
BQA-29      richer Idea brief + multi-reference media contract
```

No developer should invent these decisions.

For BQA-29, presentation may reuse existing `dc_artifacts.body` and clamp/tease it on Board. Adding a new canonical text field, changing one media attachment to multiple attachments, or defining a new canonical 1400-character field requires explicit decision and migration planning.

## 5. Current implementation priority

```text
P0  BQA-24 invite discoverability
P0  BQA-28 immediate roster/projection refresh
P1  BQA-25 detail action hierarchy
P1  BQA-26 destructive/leave presentation
```

Current live acceptance:

```text
Artifact Collaboration = FAIL / CORRECTIVE REQUIRED
G8 = NOT AUTHORIZED
```

After corrective:

1. exact-branch CI;
2. G6 validation;
3. clean RC from then-current production baseline;
4. explicit release authorization;
5. deploy;
6. repeat live unassisted invite/join acceptance;
7. G8 only after PASS.

## 6. Developer lanes

### DEV1 — Board invitation / state freshness

Own:
- BQA-24;
- BQA-28.

Primary owner: canonical Board projection/runtime.

Do not change backend schema unless evidence proves the existing canonical read path cannot satisfy the contract.

### DEV2 — Artifact detail hierarchy

Own:
- BQA-25;
- BQA-26.

Primary owner: canonical Artifact detail + current collaboration controls.

Do not change participation-state semantics.

## 7. Stop boundaries

```text
new notification table          NO
new membership/role semantics   NO
new Artifact owner              NO
new relation owner              NO
production deploy               NO
live DB mutation                NO
BQA-20/23/27/29 implementation  NOT IN CURRENT RESULT
```
