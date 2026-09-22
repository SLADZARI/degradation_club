---
artifactId: dementor-club.operations.board-view-model-corrective-g6-2026-09-22
project: dementor-club
documentType: QA_EVIDENCE
projectStage: BUILD
gate: G6_VALIDATION
status: APPROVED
version: 1.1
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
supersedes: 1.0
parentIssue: 228
scope:
  - STAB-06
  - BQA-18
---

# STAB-06 · Board View Model corrective · G6 validation

Approved authority:
`operations/BOARD_VIEW_MODEL_DECISION_V1.md`

Owner live-QA corrective evidence:
`operations/BOARD_VIEW_LIVE_QA_CORRECTIVE_2026-09-22.md`

Production baseline:
`d4d1e2f45883beff973a5cd5827e6f71065c0575`

Integration branch:
`result/board-mobile-information-hierarchy-v1`

Final validated corrective candidate:
`8180b4a7b7caf37738604321fe5a34c344455b60`

Draft PR:
`#239`

Canonical validation:
`Site Integrity / Release Readiness #1243 / 35777088217 · SUCCESS`

The intermediate candidate `155565786ac969c63a692006c145e4f4e266090d` / #1241 was superseded after a real camera-fit blocker was found on the required full visible set.

## Validated behavior

- one user-facing state: `activeView`;
- no `activeFilter + currentProgramOnly` compound UI state;
- Views replace one another;
- Current Program membership remains exact-only through unchanged `getCurrentProgram()` composition + canonical thingRef/source-type+slug identity;
- no title matching;
- no Relations-derived affiliation;
- `МОЁ` remains locator/focus, not a persistent View;
- Relations show/hide does not alter visible Things;
- every explicit View change fits the camera to the visible set;
- persisted card coordinates are unchanged by View fit;
- pager reflects the visible set;
- pan/zoom remain usable after auto-fit.

Required sequence PASS on 390 / 360 / desktop:

```text
ВСЁ
→ ТЕКУЩАЯ ПРОГРАММА
→ КУРСЫ / ПРОГРАММЫ
→ ПРОЕКТЫ / ПРОДУКТЫ
→ ВСЁ
```

PASS includes:
- exactly one active View;
- expected visible set at every step;
- no stale Current Program condition;
- non-affiliated Course visible in Programs View;
- non-affiliated same-title Project visible in Projects View;
- camera fit + pager correctness;
- coordinate invariance;
- canonical Artifact badges ОБЪЯВЛЕНИЕ / ПОСТ / ИДЕЯ / ЗАПРОС;
- canonical platform badges;
- `В ПРОГРАММЕ` exact-match only;
- mobile standalone Program strip absent;
- desktop standalone Program presentation unchanged;
- focus return from View drawer;
- no horizontal overflow.

Additional PASS in #1243:
- Board mobile harmonization;
- Board Relations runtime;
- Board v2.1 fullscreen composition;
- Board Information Architecture Batch B;
- Current Program v1 contract;
- built JavaScript syntax;
- production route manifest;
- production release guard.

Exact changed files remain limited to seven existing Board owners/validators:
1. `community/board/board-entity-model-v1.js`
2. `community/board/board-fullscreen-v2-1.js`
3. `community/board/board-integrations-v1.js`
4. `community/board/board-spatial-v1.js`
5. `scripts/validate-board-batch-b-contract.mjs`
6. `scripts/validate-board-navigation-adaptive-cards-browser.mjs`
7. `scripts/validate-board-v21-contract.mjs`

`current-program-v1.js` remains unchanged.

Schema mutation = NO.
Semantic domain mutation = NO.
Change Proposal = NO.
Supabase = NOT REQUIRED.

G6 validation: APPROVED.
