# PRODUCT & MARKETING SEMANTIC STACK HARMONIZATION — 2026-09-16

Status: **IMPLEMENTATION EVIDENCE / semantic integration**

## Goal

Remove the split between accepted Product & Marketing authorities and the canonical `dementor-club` semantic branch without replaying the historical stacked PR chain onto a changed kernel.

## Baseline

Semantic source baseline:
`dementor-club@e2479a10d329f8da8b311f155d2ac62ca93246f8`

At baseline:
- 01–07 already existed on `dementor-club`;
- 08–15 remained in stacked PR branches;
- Phase 0 / Phase 1 authority remained in stacked PR branches;
- production had already released Current Program v1;
- `courses/dengi-na-veter.md` on semantic source still contained the superseded MVP wording.

## Existing-before-new inventory

Integrated from accepted stack:
- #188 Return Loops
- #189 Contribution
- #190 Dementor / Intervention
- #191 Marketing Positioning
- #193 Distribution
- #192 Monetization
- #194 Metrics
- #195 Product Principles
- #196 Product → Production / Phase 0
- #205 Phase 1 Thing Projection contract
- #207 Phase 1A Current Program composition + `Деньги на ветер` truth correction

## Integration method

Authority documents are copied by their existing Git blob identity wherever possible.

No semantic rewrite is performed during transfer.

Exceptions:
1. `concept/PRODUCT_MARKETING_PACKAGE_INDEX_V1.md` is updated as the canonical navigation/status layer because the old index still marked 08–15 as NEXT/TODO.
2. `courses/dengi-na-veter.md` takes the already accepted #207 current-truth version.
3. A new explicit local decision records the owner decision `Думай с опасностью = PUBLIC RELEASE + certificate`.
4. The stale `operations/PRODUCT_MARKETING_PACKAGE_STATUS_2026-09-15.md` from #192 is intentionally not promoted; #195 already identified it as stale.

## No silent promotion

Integration means the accepted product package is reachable from one canonical semantic branch.

It does not promote unrelated DRAFT / REFERENCE documents into approved project-wide PRODUCT / DOMAIN / ARCHITECTURE / DESIGN authority.

MP_DSL v0.1 remains DRAFT / REFERENCE.

## Drift resolved

- `08–15 in open stacked branches only` → resolved by canonical integration.
- `Phase 0/1 authority outside semantic source` → resolved by canonical integration.
- `Деньги на ветер = MVP in development` in canonical source → superseded by accepted READY truth.
- `Думай с опасностью approved-draft vs public production` → resolved by `DUMAI_S_OPASNOSTYU_PUBLIC_RELEASE_DECISION_V1.md`.

## Runtime boundary

No production runtime, database, Supabase, Membership, auth, payment or deploy changes belong to this harmonization.

`commit ≠ merge ≠ deploy`.

## Follow-up

After this Result is merged to `dementor-club`, historical stacked PRs #188–#196, #205 and #207 should be closed as superseded by canonical semantic integration, with links to the harmonization commit/PR.

Then create exactly one active Phase 2 Result:
`dementor-club.result.dumai-s-opasnostyu-release-loop-v1`.
