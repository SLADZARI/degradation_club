---
artifactId: dementor-club.operations.board-view-live-qa-corrective-2026-09-22
project: dementor-club
documentType: EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: APPROVED
version: 1.0
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
parentIssue: 228
scope:
  - STAB-06
  - BQA-18
---

# STAB-06 — owner live QA corrective evidence

Production under test:

`d4d1e2f45883beff973a5cd5827e6f71065c0575`

Pages:

`Deploy Dementor Production #130 / 35754639231 · SUCCESS`

## Owner live observations

PASS:

- mobile first frame has no standalone Current Program strip;
- spatial Board owns substantially more first-frame area;
- Current Program control is present;
- Current Program cards appear/disappear through the control;
- МОЁ;
- pager;
- zoom +/-;
- relations;
- drag/pan;
- no horizontal overflow.

FAIL / unclear:

- selecting `ВСЁ` after other interaction can leave the user seeing the previously focused/recent card rather than an obvious full-Board result;
- selecting object types while Current Program affiliation remains active creates hidden compound filtering;
- the UI does not clearly expose that two independent conditions are simultaneously active;
- desktop does not expose the same canonical View capability as mobile.

## Classification

This is not a data-model failure.

Root issue is presentation state:

```text
activeFilter
+
currentProgramOnly
```

plus camera state not being normalized to the new visible set after View changes.

Owner approved replacing this user-facing compound model with one canonical Board View model.

Authority:

`operations/BOARD_VIEW_MODEL_DECISION_V1.md`

STAB-06 live acceptance remains NOT PASS until the corrective is validated, released and human-retested.
