---
artifactId: dementor-club.operations.catalog-release-truth-live-retest-2026-09-17
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: RELEASE
gate: G8_CLEANUP
status: PASS_LIVE_CATALOG_RELEASE_TRUTH
version: 1.0
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: dementor-club.result.catalog-release-truth-v1
---

# Catalog / Release Truth v1 — live retest

Read-only live retest performed after successful Pages run `35278971579` for exact production `2dae3b6ece79652c81af780c049521fda7262726`.

## Catalog truth boundary

Live `/catalog/` resolves and renders the released Catalog. It explicitly states that Catalog is a secondary navigation surface, is not owner of current status/price/availability/lifecycle, and leaves current facts with source owners. Rows expose `SOURCE / ...` provenance rather than lifecycle/readiness truth. No hard volatile category/global counts are exposed.

The released Catalog also states that each Project keeps its own project source and does not need to exist in `dc_entities`. `DEMENTOR LAB` is present as a Project link and its public route resolves successfully.

## Canonical Catalog routes

All twelve public entity routes linked from the released Catalog resolved and returned their expected public surfaces during the live retest:

- `/courses/dumai-s-opasnostyu/`
- `/courses/dengi-na-veter/`
- `/courses/ne-komanda/`
- `/courses/slaboumie-i-otvaga/`
- `/events/fuengirola/`
- `/projects/logic-awareness/`
- `/projects/dementor-lab/`
- `/objects/001-ne-nado/`
- `/merch/drop-001/overthinking-is-my-cardio/`
- `/merch/drop-001/personal-growth-cancelled/`
- `/merch/drop-001/success-is-boring/`
- `/merch/drop-001/potential-too-long-revealed/`

## Public navigation regression

Read-only live checks also resolved the canonical public navigation surfaces `/`, `/about/`, `/events/`, `/projects/`, `/community/`, `/merch/`, and `/join/` with expected page content/canonical metadata. No #202 route/navigation regression was observed.

## Deployment truth

Deployment truth is traceable to successful GitHub Actions run #121 / `35278971579` for exact SHA `2dae3b6ece79652c81af780c049521fda7262726`, plus Pages artifact `10521498813` / `sha256:4952c20758f58244ce8c0fe0da1506e1d07f155202f9e4a3aa8c1806eea095d4`. `.github/production-release.txt` remains intentionally non-authoritative and points current deploy truth to the latest successful `Deploy Dementor Production` GitHub Actions evidence rather than claiming current state itself.

Result: `PASS_LIVE_CATALOG_RELEASE_TRUTH`.
