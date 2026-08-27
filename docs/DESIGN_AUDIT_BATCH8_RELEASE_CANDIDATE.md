# Batch 8 — Release Candidate Audit

Status: RUNNING
Branch: `design-audit-batch-2026-08-27`

## Purpose

Batch 8 is the final pre-release audit. It is intentionally not another refactor cycle.

The release decision is based on user-impacting blockers only.

## Stop rule

- P0 = release blocker: route cannot load, HTTP failure, broken critical image/asset, broken internal navigation target.
- P1 = release blocker: runtime page error, real document horizontal overflow affecting text/control/image, fixed-header overlap, missing mobile viewport contract, missing primary document structure, legacy Dementor portrait asset on a public route, duplicate Fuengirola relation injection.
- P2 = record for post-release backlog unless human review explicitly promotes it.

Batch 8 permits at most ONE consolidated fix-pack after the first RC run. No architecture cleanup, no speculative CSS refactor, no new design system work.

## Coverage

1. Discover every public `index.html` route automatically.
2. Exclude internal `/design-system/` and pages explicitly marked `noindex` from release blocking.
3. Run every public route at 390px mobile and 1440px desktop.
4. Add 768px tablet evidence for the key public journey: Home, About, Community, Dementor profiles, Events/Fuengirola, Courses, Projects/Logic Awareness, Merch, Join and Support when present.
5. Check route loading, HTTP status, page errors, broken images, real overflow, fixed-header overlap, viewport metadata, H1/main presence, legacy Dementor assets and the known Fuengirola relation duplication regression.
6. Crawl same-origin links found on public pages and fail broken internal targets.
7. Run all permanent design architecture gates once before the RC audit.
8. Upload screenshots + JSON + Markdown report as release evidence.

## Release interpretation

`GO` means P0=0 and P1=0. P2 does not block release by itself.

If the first run is `NO-GO`, all P0/P1 issues are repaired in one consolidated package, then Batch 8 is run one final time. After that the branch is frozen and Batch 9 begins.

## Human visual sign-off

The screenshot set is for one human review pass only. Review composition, readability, image crop/contain, duplicated UI, hierarchy and CTA clarity. Cosmetic deviations with no user impact are documented, not endlessly corrected.

## Exit

On GO:

`Batch 8 → freeze → Batch 9 Release Package → merge → production smoke test`.
