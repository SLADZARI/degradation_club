---
artifactId: dementor-club.operations.qa-reconciliation-2026-09-30
project: dementor-club
documentType: QA_PLAN
projectStage: BUILD
gate: G5_BUILD
status: APPROVED_TRIAGE
version: 1.1
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
canonicalLedger: operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md
currentResult: dementor-club.result.owner-admin-community-ops-v1
supersedes: dementor-club.operations.qa-reconciliation-2026-09-28
---

# Dementor Club — QA reconciliation · 2026-09-30

## Current inventory

```text
QA-MEM  42
BQA     29
TOTAL   71
```

Artifact Collaboration live closure on 2026-09-30 closes:

```text
BQA-24
BQA-25
BQA-26
BQA-28
```

Current formal totals:

```text
33 CLOSED
38 OPEN
```

Open work remains classified as:

```text
RETEST ONLY        31
REAL WORK           3
DECISION REQUIRED   4
TOTAL OPEN          38
```

## RETEST ONLY — 31

No implementation unless human/live retest reproduces a defect.

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

## REAL WORK — 5

```text
BQA-07  Contribution/raw idea/material runtime
BQA-15  relation selector scale
BQA-23  Owner Admin Community/Artifact operations UI
```

### Current Result

```text
BQA-23
→ Owner Admin Community Ops v1
```

Reason for activation:

- BQA-20 and BQA-27 are CLOSED / LIVE PASS;
- BQA-23 is the next approved REAL WORK item in the existing sequence;
- the canonical /workspace/admin/ shell already exists;
- required mutations already exist in approved backend contracts;
- no semantic Change Proposal is required for the bounded operations UI.

Current integration rule:

```text
production baseline cde332779ab0e256dd1e498660d6fa651e91846e
→ existing-owner inventory
→ bounded Owner Admin read projection only where necessary
→ Community Ops UI inside canonical admin shell
→ exact browser/full CI
→ G6
```

### Work after current Result

Preferred sequence, subject to fresh authority check:

1. BQA-15 relation selector scale;
2. BQA-07 Contribution/raw idea/material runtime.

## DECISION REQUIRED — 4

```text
QA-MEM-004  historical course completion vs repeat-attempt state
BQA-17      relations hidden-by-default / preference behavior
BQA-22      Course/Project creation authority / two-Dementor-support conflict
BQA-29      richer Idea brief + multi-reference media contract
```

No implementation without explicit semantic/product decision.

## CJM / JTBD rule

Every remaining item closes only against the user's job, not merely technical execution.

Current Board/media jobs:

```text
enter Board
→ understand useful content immediately
→ interact before enrichment finishes
→ media appears progressively
→ uploaded image is automatically bounded/optimized
→ privacy and collaboration behavior remain unchanged
```

Technical PASS without this user-visible path is insufficient for G8.
