# DEMENTOR LIVE — GLOBAL AUDIT ROUND 01 / START HERE
2026-10-17 | Status: ROUND 01 DOCUMENTED + CALCULATED, P0 ISSUES OPEN
Parent first GDD: v0.1 frozen baseline; new audit branch docs/dementor-live-global-audit-01 does not overwrite it.
Project separation: DEMENTOR LIVE != DEMENTOR BATTLE != DEMENTOR ROBO GAMES.
GitHub home: https://github.com/SLADZARI/degradation_club/tree/docs/dementor-live-global-audit-01/projects/dementor-live/audit/round-01
Drive folder: https://drive.google.com/drive/folders/15OUFa_5idB2DmBCDFbkeSiYLpNCS5GFS

## Recommended reading order
1. GLOBAL_AUDIT_EXECUTION_PLAN_v0.1.md — eleven audit waves R0..R10 and closure.
2. DOCUMENT_COMPLETENESS_AND_DELIVERY.md — 27 chapter spec inventory and missing work.
3. SYSTEM_QA_MATRIX_27.md — per-system tests/dependencies/evidence status.
4. NUMERIC_BALANCE_AUDIT_01.md — source TEST formulas and 24h calculation bounds.
5. ECONOMY_STRESS_1_7_30_DAYS.md — hypothetical city liquidity/demand vs auto-farms.
6. DATA_CONTRACTS_AND_INVARIANTS.md — unified IDs, ledgers, states, auth boundaries.
7. ISSUE_REGISTER_EXTENDED_01.md — CC-028..040 adds to previously preserved CC-001..027.
8. PROPOSED_GDD_V0_2_PATCHES.md — alternatives for user decisions, none approved.
9. arithmetic_smoke_test.js + arithmetic_results.json — 40/40 correct arithmetic calculations on TEST values.
10. synthetic_event_replay_test.js + synthetic_event_replay_results.json — 21/21 synthetic expected-behavior checks; not real game runtime.

## Drive readable links
Execution plan: https://docs.google.com/document/d/1omht6_nr1EEheu3irYGyC_4CIfmaZvYUmYHCDQn2kTY/edit
Completeness: https://docs.google.com/document/d/1h60_I4JJUAPnrIcQ-yqNzCXVfSlLnNF1qhje85TRk70/edit
27 QA matrix: https://docs.google.com/document/d/1QpfqzBFXUJNmhJ4PsdwIgf7A0dSk0nlykBgvKlXui08/edit
Numeric: https://docs.google.com/document/d/1x1PN2wYpGP7jRzfEulB_HmhKckPorQpvjuTXs8Z49LM/edit
1/7/30 day stress: https://docs.google.com/document/d/1pfkSYnp6omy578HMZmXGYXAFqXsXQ3-fd2UETyjWmAE/edit
Contracts: https://docs.google.com/document/d/14gIfJPPA8NToZLV8VqTBR22OQlcXzpxooeL8tH5RmwE/edit
Issues: https://docs.google.com/document/d/1qxNlfa2EfUi9QCDData7Gp0qTfvzZmGJ0Hwz10O-8SU/edit
Proposed patches: https://docs.google.com/document/d/17bkdnOMO9KBq6VALTBBgeRWZ2A4pGGcCGV4sJWk9EQE/edit
Arithmetic run: https://docs.google.com/document/d/1sPJXqkPbx-pWkxpXyyJzPDBM-EVKY0RkgPUiCOZ21cY/edit
Synthetic replay: https://docs.google.com/document/d/1cX2ZXzCsouCJV1dH_VYXBtdiBV45oKD9BuEmyiAww5E/edit

## Findings and progress summary
Existing CC-001..027 still tracked +13 newly described CC-028..040 (not all confirmed defects).
Arithmetic smoke executed in isolated JS: 40/40 passing numerical expectations.
Synthetic replay model: 21/21 expected outcomes matching: 4-plant HEMP and FLAX online/offline/chunked, once-only replay, single tank contention, parcel race, escrow settling/refund.
Neither test suite executes actual game runtime nor validates production security, database transactions, current SVG assets or final user experience.
Calculated trouble:
- First home requires 18 more PAPER if all specified materials bought from city instead of tutorial grant.
- Generic PLANT_FIBER allows use of incompatible HEMP/FLAX paper recipes (water saving14L for 24 papers).
- HEMP full 4-plant pipeline53.33L/h exceeds basic river pump30L/h.
- Four HEMP auto plants, in unbounded idealized day, 768 sheets and 1280L/day; hypothetical city buyback2304 PAPER/day, forcing finite treasury/demand rules.
- Accepted character style != approved editable8-direction rig; current Drive NPC assets only one extracted direction each, v0.3 scale correction authoritative for board placement.

## Open gates — what is NOT done
0 of 27 full per-domain v0.2 reconciled specifications completed/approved; v0.1 exists as consolidated synopsis of chat, not verbatim archive.
No actual game-world runtime or Supabase DB migration tests executed in GA-01.
No user approval of revised monetary/fiber/onboarding/character rules.
No one complete final SVG hero rig with8 passed directions and animation.
No 7/30-day *actual* economic simulation using finite buyers and full game resources; published report is theoretical sensitivity/exposure.
No public moderation age rules finalized.

## Next actionable round GA-02
Step1 user decide PATCH currency + fiber + onboarding; record as APPROVED or alternatives.
Step2 reconcile character 4 authoring vs8 runtime and spatial anchor/camera; visual gate.
Step3 build executable 24h/7d/30d finite event economy sim, not only idealized formula; run demand/treasury/warehouses.
Step4 normalize 27 full domain specs, source archive references and inter-module test evidence.
Step5 only after gate checks: release GDD v0.2 candidate for explicit review, no silent canon overrides.

Progress is durable in GitHub and Drive; nothing executes in background unless a separate scheduled or Work workflow is explicitly established.
