---
artifactId: dementor-club.operations.board-mobile-information-hierarchy-g6-2026-09-22
project: dementor-club
documentType: QA_EVIDENCE
projectStage: BUILD
gate: G6_VALIDATION
status: APPROVED
version: 1.0
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentIssue: 228
---

# STAB-06 · Board Mobile Information Hierarchy · G6 validation

## Result

`board-mobile-information-hierarchy-v1`

Scope:

`STAB-06 / BQA-18`

Approved design authority:

`operations/BOARD_MOBILE_CURRENT_PROGRAM_FILTER_DECISION_V1.md`

## Exact identity

Production baseline:

`287b485293d68098dfd3c9302785369a735d42e2`

Integration branch:

`result/board-mobile-information-hierarchy-v1`

Validated candidate:

`fbc891126532939a0a7350d18d19dbae807fb76f`

Draft PR:

`#238`

Canonical validation:

```text
Site Integrity / Release Readiness #1238
run id = 35740224085
head SHA = fbc891126532939a0a7350d18d19dbae807fb76f
conclusion = SUCCESS
```

## Implemented boundary

Mobile only:

- standalone Current Program strip is hidden;
- spatial Board owns the first viewport after existing filters;
- Current Program remains composed/read by unchanged `current-program-v1.js`;
- existing Board filter drawer gains one orthogonal `ТЕКУЩАЯ ПРОГРАММА` affiliation control;
- object-type filters remain a separate dimension;
- default `ВСЁ` remains the default state and resets affiliation;
- `МОЁ` resets Program affiliation before focusing Member Artifacts;
- no filter persistence was added.

Card identity badges:

- Member Artifact badge comes from existing `artifactSubtypeLabel()` truth;
- platform badge comes from existing projection source type;
- `В ПРОГРАММЕ` is secondary and only appears for exact canonical Current Program matches.

Exact Program identity bridge:

```text
event + slug                -> event:<slug>
program/course/practice     -> program:<slug>
project/product             -> project:<slug>
```

Membership is then tested against `getCurrentProgram().thingRef`.

No title matching.
No visual matching.
No Relations-derived affiliation.

A same-title non-program fixture `project:outside-lab` / `DEMENTOR LAB` is explicitly tested as a false-positive guard.

## Targeted browser acceptance

Built candidate evidence:

```text
Board mobile harmonization browser acceptance PASS
✓ 390 / 360 primary workspace chrome fits viewport
✓ canonical nav clears filters; filters + publish share one row
✓ standalone Current Program strip is absent at 390 / 360; spatial Board owns the first frame
✓ compact two-level bottom dock preserves pager / spatial-control clearance
✓ fullscreen spatial viewport ownership preserved
```

Navigation / affiliation / badges:

```text
Board navigation/adaptive cards browser acceptance passed:
390/360 pager
Current Program affiliation/type composition
canonical badges
МОЁ
adaptive cards
desktop invariant retained
```

Additional regressions:

```text
Current Program browser acceptance PASS
Board v2.1 fullscreen browser state matrix PASS
Board Relations v1 browser acceptance PASS
Production route manifest PASS
production artifact/release gate PASS
```

The Current Program source file remains byte-identical to production:

`current-program-v1.js@e4b470653b664e9e2232f5a7a990e076aaa457b9`

## Validation history

Earlier candidate runs exposed only validator assumptions that were stale relative to the approved BQA-18 change:

- #1234: legacy own-card bridge string in Board v2.1 contract;
- #1235: same legacy bridge assumption in Batch B;
- #1236/#1237: mobile hidden-ancestor visibility helper and pager fixture assumptions.

Those were corrected inside existing validators only. The final exact runtime candidate is validated by #1238.

## Scope guard

No changes to:

- Current Program composition/order/content;
- relation ontology / BQA-15 / BQA-17;
- BQA-22 Project creation;
- Contribution;
- Membership / DC-9;
- auth;
- schema / RPC / RLS;
- STAB-05 runtime;
- generic media pipeline.

Schema mutation = NO.
Semantic mutation = NO.
Change Proposal = NO.

## G6 verdict

`PASS`

Eligible for G7 release-candidate precheck.
