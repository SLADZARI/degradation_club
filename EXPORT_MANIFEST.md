# DEMENTOR CLUB — PRODUCT & MARKETING PACKAGE EXPORT

Snapshot date: **2026-09-15**

Repository: `SLADZARI/degradation_club`

This export is a **portable snapshot**, not a new authority layer. Primary authority remains in the source files and their branches / PRs.

## Executive status

The semantic Product & Marketing Package `01–15` is complete enough for v1. The next phase is implementation, production truth alignment, instrumentation and empirical validation — not additional ontology.

Important distinction:

- **semantic status** — what the model says;
- **merge status** — whether that authority has landed into `dementor-club`;
- **runtime status** — whether production expresses it;
- **evidence status** — whether real usage has validated it.

These states are not interchangeable.

## Source map — 01–15

| Layer | File | Source ref | PR | Status |
|---|---|---|---:|---|
| 01 | `concept/DEMENTOR_CLUB_JTBD_PRODUCT_THESIS_V2.md` | `dementor-club` | merged/base | CANON |
| 02 | `concept/CJM_CLUB_V1.md` | `dementor-club` | merged/base | CANON |
| 02B | `concept/CJM_BOARD_PARTICIPATION_V1.md` | `dementor-club` | merged/base | CANON |
| 03 | `concept/AUDIENCE_ENTRY_MAP_V1.md` | `dementor-club` | merged/base | CANON |
| 04 | `concept/VALUE_ARCHITECTURE_V1.md` | `dementor-club` | merged/base | WORKING CANON |
| 05 | `concept/PRODUCT_MODEL_V1.md` | `dementor-club` | merged/base | WORKING CANON |
| 06 | `concept/BOARD_PRODUCT_MODEL_V1.md` | `dementor-club` | merged/base | WORKING CANON |
| 07 | `concept/CONTENT_PROGRAMMING_MODEL_V1.md` | `dementor-club` | merged/base | WORKING CANON |
| 08 | `concept/RETURN_LOOPS_V1.md` | `dementor/return-loops-v1` | #188 | WORKING CANON |
| 09 | `concept/CONTRIBUTION_MODEL_V1.md` | `dementor/contribution-model-v1` | #189 | WORKING CANON |
| 10 | `concept/DEMENTOR_INTERVENTION_MODEL_V1.md` | `dementor/dementor-intervention-model-v1` | #190 | WORKING CANON |
| 11 | `concept/MARKETING_POSITIONING_MESSAGING_V1.md` | `dementor/marketing-positioning-messaging-v1` | #191 | WORKING CANON |
| 12 | `concept/DISTRIBUTION_MODEL_V1.md` | `dementor/distribution-model-v1` | #193 | WORKING CANON |
| 13A | `concept/MONETIZATION_MAP_V1.md` | `dementor/monetization-map-v1` | #192 | WORKING CANON |
| 13B | `concept/MONETIZATION_DISTRIBUTION_ECONOMICS_V1.md` | `dementor/monetization-map-v1` | #192 | WORKING CANON |
| 14 | `concept/METRICS_SIGNALS_V1.md` | `dementor/metrics-signals-v1` | #194 | WORKING CANON / open stack; PR still Draft |
| 15 | `concept/PRODUCT_PRINCIPLES_ANTIPATTERNS_V1.md` | `dementor/product-principles-antipatterns-v1` | #195 | WORKING CANON / open stack |

## Brand companion

- `concept/DEGRADATION_AS_A_SERVICE.md` — existing brand / conceptual frame. `11` does not replace it.

## Operational truth / implementation documents

- `operations/PRODUCT_TO_PRODUCTION_AUDIT_2026-09-15.md` — PR #196. Treat as **current-state / truth audit**: what exists, where LIVE / production / runtime truth diverge, and which surfaces need KEEP / REFRAME / MOVE / REMOVE / BUILD.
- `operations/PRODUCT_RUNTIME_HARMONIZATION_AUDIT_AND_IMPLEMENTATION_PLAN_2026-09-15.md` — PR #197. Treat as **implementation plan candidate**, not a second source-of-truth audit. It requires the corrections recorded in `CURRENT_IMPLEMENTATION_STATE_2026-09-15.md` before being used as the main execution map.

## Authority stack

Current intended semantic stack:

```text
#188 Return Loops
→ #189 Contribution
→ #190 Dementor / Intervention
→ #191 Marketing Positioning & Messaging
→ #193 Distribution
→ #192 Monetization 13A + 13B
→ #194 Metrics & Signals
→ #195 Product Principles / Anti-patterns
```

`PRODUCT_MARKETING_PACKAGE_INDEX_V1.md` on the base branch is historically useful but stale relative to the open stack. Update it once, after the authority chain lands; do not patch it inside each stacked PR.

## Export contents

The ZIP generated from this branch contains:

- the complete authority set `01–15`;
- `DEGRADATION_AS_A_SERVICE` brand companion;
- current package index as a stale reference;
- PR #196 current-state audit;
- PR #197 harmonization / implementation plan;
- `CURRENT_IMPLEMENTATION_STATE_2026-09-15.md` — consolidated implementation verdict and risk register.

## Governance reminder

`15` is the cross-authority constitution, not a replacement for 01–14.

When implementation and optimization conflict, use:

**TRUTH → VALUE → MEANING → SEMANTICS → AUTONOMY → OPTIMIZATION**
