---
artifactId: dementor-club.evidence.board-live-corrective-g2-2026-09-12
project: dementor-club
documentType: QA_EVIDENCE
status: ACTIVE_EVIDENCE
sourceSystem: GIT
authorityType: EVIDENCE
updated: 2026-09-12
---

# Board live corrective — G2 / root-cause evidence

Production baseline inspected before corrective: `638dd42d63d27bc43b524a1086b0904b6f9e671d`.

## Confirmed

1. Active filter cascade conflict: `board-filters-v2.css` made the active filter white-on-black while the fullscreen owner later changed the active background to lime without restoring black text. Live symptom: `ВСЁ` rendered lime + white.
2. `FIRST_ARTIFACT_REQUIRED` is presentation/onboarding in runtime, but `board-qa-fix-v1.css` applied `pointer-events:none` to `.dc-board-wall` under `.dc-board-first-entry-focus`. This contradicted the approved Member permissions and blocked normal Artifact interaction for `MEMBER_NOT_ACTIVATED`.
3. Existing Board CI did not exercise the mobile type drawer end-to-end and pre-dismissed the first-Artifact spotlight in its fixture, so both live regressions could pass CI.

## Asset freshness

The production builder copies CSS/JS under stable URLs and has no centralized release fingerprint/version owner. This is a real release-architecture gap. However the current execution environment cannot resolve `dementor.club`, so live CDN/browser response headers and contents could not be independently captured here. Therefore stale-cache mismatch remains **high probability, not HTTP-proven**.

Per owner instruction, no fingerprint/cache-busting implementation is introduced by this corrective until live network evidence proves stale asset delivery.

## Corrective scope

- restore black-on-lime active Board filters;
- keep first-Artifact onboarding presentation interactive;
- add real browser acceptance for `ТИПЫ`, rendered control geometry, active-filter colors, and undismissed `MEMBER_NOT_ACTIVATED` interaction;
- no DB/RLS/Membership/Artifact lifecycle/Telegram/scheduler/spatial-coordinate semantic changes;
- deep-link/share remains next Result and is not implemented here.
