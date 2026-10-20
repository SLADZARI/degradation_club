# Dementor Live — dual-track architecture index

**Version:** 1.0 · 20 October 2026
**Status:** architecture accepted; runtime merge NOT DONE.

| File | Role | Change discipline |
| --- | --- | --- |
| [PROJECT_MASTER_v1.0.md](PROJECT_MASTER_v1.0.md) | Stable project architecture and two gameplay directions | Versioned decision |
| [ENGINE_CONTRACT_v1.0.md](ENGINE_CONTRACT_v1.0.md) | Common engine invariants, compatibility and QA gates | Versioned, implementation pending |
| [WORLD_REGISTRY_v1.0.md](WORLD_REGISTRY_v1.0.md) | World and scene catalog, non-duplication and travel | Versioned structure, entries update through review |
| [DECISION_REGISTER_v1.0.md](DECISION_REGISTER_v1.0.md) | Adopted product decisions vs unresolved technical choices | Append-only decisions |
| [RELEASE_MATRIX_2026-10-20.md](RELEASE_MATRIX_2026-10-20.md) | Snapshot of Git refs/SHA and reported production state | Mutable, time-stamped |
| [INTEGRATION_PLAN_2026-10-20.md](INTEGRATION_PLAN_2026-10-20.md) | Safe path from v0.4 to common engine with Universe modules | Working plan, not QA PASS |

## Authority

1. Current explicit user decisions.
2. Actual code pinned by SHA and execution/test evidence.
3. Active approved canon/specs.
4. Candidate designs, experiments and proposed interfaces.
5. Historical archives.

A tested Node model is not a tested browser or production deployment. The version in package.json is not evidence of the live VM build. A document saying APPROVED is not proof of binary assets being installed.

## Current implementation candidates (NOT production)

- [CIVIC UI / World Polish P1](../design/CIVIC_UI_WORLD_POLISH_P1_2026-10-20.md) — new quests, collisions, terrain/paving. Draft PR #282.
- [COMBAT Touch v2 + CIVIC Forestry v1](../design/COMBAT_TOUCH_V2_CIVIC_FORESTRY_V1_2026-10-20.md) — iPhone 14 combat gestures and five plantable tree variants. Draft PR #284, follows Polish P1.
- CIVIC and COMBAT additions remain proposals under QA; UNIVERSE port, exact production VM provenance, and production save migration remain separate gates.

## CIVIC development contracts since v0.4

- [CIVIC P2: land, business space, mayor feedback, forest & mountain checks](../design/CIVIC_LAND_MAYOR_REGIONS_P2_2026-10-20.md) — multi-city estate ownership, public business rentals, municipal mail and non-idle prompts; separate Draft PR.
- [CIVIC UI Polish P1](../design/CIVIC_UI_WORLD_POLISH_P1_2026-10-20.md) — quests, collision, paving, visual refresh.
- [COMBAT Touch v2 + Forestry v1](../design/COMBAT_TOUCH_V2_CIVIC_FORESTRY_V1_2026-10-20.md) — iPhone combat and plantable trees.
- These are cumulative implementation candidates, not proof that the production VM runs the newest code; no UNIVERSE port is implied.

## Relevant existing sources

- [Core first stage](../CORE_AND_FIRST_LEVEL_v0.1.md) — design source, not a runtime claim.
- [CIVIC release 0.3 candidate](../runtime/docs/RELEASE_0.3.0_RC1.md) — schema migration and city economy.
- [World-runtime QA](../runtime/docs/WORLD_RUNTIME_CONTRACT_QA_2026-10-20.md) — scope and evidence boundaries.
- [Ideas Forest](https://github.com/SLADZARI/degradation_club/blob/feature/dementor-universe-world-01-forest-2026-10-20/projects/dementor-live/universe/WORLD_01_IDEAS_FOREST_SCOPE.md).
- [MentalHumor](https://github.com/SLADZARI/degradation_club/blob/feature/dementor-universe-mentalhumor-museum-2026-10-20/projects/dementor-live/universe/MENTALHUMOR_MUSEUM_WORLD_02.md).
- [Paper-cut icon canon](https://github.com/SLADZARI/degradation_club/blob/fix/dementor-live-paper-cut-icons-v1-2026-10-20/projects/dementor-live/design/PAPER_CUT_UI_ICON_CANON_v1.md).

## Project attachments recommendation

Add three small, stable reference files to ChatGPT Project knowledge if convenient: PROJECT_MASTER_v1.0, ENGINE_CONTRACT_v1.0, WORLD_REGISTRY_v1.0. Keep RELEASE_MATRIX, CI results, current state and large asset archives in live GitHub/connected sources, not duplicated frozen attachments. User's Project instructions remain the top-level working policy.
