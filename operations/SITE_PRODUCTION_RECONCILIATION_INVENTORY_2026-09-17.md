# Site / Production Reconciliation — Exact Inventory

Date: 2026-09-17
Production: `23d4266a4009d34042b29ec1fb73fb0cbad6b62e`
Staging: `7a036ba4cd7ccd635ba273931c2087227d0f4c94`
Merge base: `8194f580b7fd26bc748e0c0a8514119d7764a7e5`

Net differing paths: **315**

## Preliminary classes

- `DECISION_REQUIRED`: 5
- `OBSOLETE_REVIEW`: 20
- `PRESERVE_REVIEW`: 9
- `PRODUCTION_BASELINE_ONLY`: 202
- `SUPERSEDED_REVIEW`: 79

These are **inventory classes, not semantic decisions**. `*_REVIEW` items require evidence before retention/removal.

## Difference by top-level area

- `supabase`: 59
- `scripts`: 47
- `community`: 45
- `(root)`: 40
- `docs`: 24
- `operations`: 20
- `assets`: 17
- `join`: 17
- `workspace`: 7
- `courses`: 6
- `content`: 5
- `merch`: 5
- `.github`: 4
- `design-system`: 4
- `projects`: 4
- `.weekly-os`: 3
- `events`: 2
- `about`: 1
- `auth`: 1
- `catalog`: 1
- `integrations`: 1
- `objects`: 1
- `share`: 1

## Detailed inventory

| Path | Tree | Prod last | Site last | Semantic ref | Preliminary |
|---|---|---|---|---|---|
| `.github/production-release.txt` | prod-only | 2026-08-29T12:08:41+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `.github/workflows/deploy-pages.yml` | both | 2026-09-17T01:20:03+02:00 | 2026-09-03T14:31:49+02:00 | yes | `SUPERSEDED_REVIEW` |
| `.github/workflows/deploy-supabase-production.yml` | prod-only | 2026-09-14T00:41:12+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `.github/workflows/site-integrity.yml` | both | 2026-09-16T21:35:51+02:00 | 2026-09-05T12:21:38+02:00 | yes | `SUPERSEDED_REVIEW` |
| `.weekly-os/results/board-mobile-harmonization-v1.v0.1.md` | prod-only | 2026-09-15T21:19:25+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `.weekly-os/results/current-program-projection-v1.v0.1.md` | prod-only | 2026-09-15T19:35:55+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `.weekly-os/results/projects-hub-v2.v0.1.md` | prod-only | 2026-09-14T23:46:20+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `404.html` | both | 2026-08-30T01:44:02+02:00 | 2026-08-29T00:12:57+02:00 | no | `SUPERSEDED_REVIEW` |
| `README.md` | both | 2026-08-29T11:51:04+02:00 | 2026-08-31T17:10:43+02:00 | yes | `DECISION_REQUIRED` |
| `about-definition-v1.css` | both | 2026-08-29T15:12:13+02:00 | 2026-08-29T14:51:42+02:00 | no | `SUPERSEDED_REVIEW` |
| `about-v1.css` | both | 2026-08-29T19:59:23+02:00 | 2026-08-29T18:46:40+02:00 | no | `SUPERSEDED_REVIEW` |
| `about-v10-responsive.css` | prod-only | 2026-08-29T20:10:26+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `about-v10-scenes.css` | prod-only | 2026-08-29T20:10:26+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `about/index.html` | both | 2026-08-29T19:59:23+02:00 | 2026-08-29T18:46:40+02:00 | no | `SUPERSEDED_REVIEW` |
| `assets/home-interruption-03.webp` | prod-only | 2026-08-29T19:59:23+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `assets/home/events/fuengirola-banner.webp` | site-only | — | 2026-08-28T21:49:10+02:00 | yes | `PRESERVE_REVIEW` |
| `assets/projects/dementor-lab/v19/01-hero-desktop.avif` | prod-only | 2026-09-14T17:55:03Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `assets/projects/dementor-lab/v19/02-hero-mobile.avif` | prod-only | 2026-09-14T17:55:03Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `assets/projects/dementor-lab/v19/03-episode-mobile.avif` | prod-only | 2026-09-14T17:55:03Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `assets/projects/dementor-lab/v19/04-episode-desktop.avif` | prod-only | 2026-09-14T17:55:03Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `assets/projects/dementor-lab/v19/05-character-choice-mobile.avif` | prod-only | 2026-09-14T17:55:03Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `assets/projects/dementor-lab/v19/06-character-choice-desktop.avif` | prod-only | 2026-09-14T17:55:03Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `assets/projects/dementor-lab/v19/07-causality-mobile.avif` | prod-only | 2026-09-14T17:55:03Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `assets/projects/dementor-lab/v19/08-hot-patch-mobile.avif` | prod-only | 2026-09-14T17:55:03Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `assets/projects/dementor-lab/v19/09-word-action-result-desktop.avif` | prod-only | 2026-09-14T17:55:03Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `assets/projects/dementor-lab/v19/10-result-mobile.avif` | prod-only | 2026-09-14T17:55:03Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `assets/projects/dementor-lab/v19/11-result-desktop.avif` | prod-only | 2026-09-14T17:55:03Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `assets/projects/dementor-lab/v19/12-hot-patch-desktop.avif` | prod-only | 2026-09-14T17:55:03Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `assets/projects/dementor-lab/v19/13-before-after-desktop.avif` | prod-only | 2026-09-14T17:55:03Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `assets/social/dementor-artifact-share-postcard.webp` | prod-only | 2026-09-13T14:48:59+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `assets/social/dementor-social-default.jpg` | prod-only | 2026-09-13T18:26:54+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `auth/callback/index.html` | both | 2026-09-13T01:59:03+03:00 | 2026-09-03T16:55:04+02:00 | yes | `SUPERSEDED_REVIEW` |
| `catalog/index.html` | both | 2026-08-29T15:18:18+02:00 | 2026-08-29T13:53:32+02:00 | no | `SUPERSEDED_REVIEW` |
| `community-v2.css` | both | 2026-09-09T01:55:10+02:00 | 2026-08-30T00:52:25+02:00 | yes | `SUPERSEDED_REVIEW` |
| `community/artifact/artifact-club-publisher-v1.js` | prod-only | 2026-09-13T21:27:59+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/artifact/artifact.js` | both | 2026-09-14T11:26:55Z | 2026-09-05T18:29:43+02:00 | yes | `SUPERSEDED_REVIEW` |
| `community/artifact/index.html` | both | 2026-09-13T19:09:46+03:00 | 2026-09-05T18:29:51+02:00 | yes | `SUPERSEDED_REVIEW` |
| `community/board/board-activation-gate-v1.js` | both | 2026-09-08T00:06:20+02:00 | 2026-09-04T15:38:32+02:00 | no | `SUPERSEDED_REVIEW` |
| `community/board/board-admin-telegram-optin-v1.css` | prod-only | 2026-09-14T13:10:25+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-admin-telegram-optin-v1.js` | prod-only | 2026-09-14T13:21:53+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-artifact-media-v1.css` | prod-only | 2026-09-14T10:25:50+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-artifact-media-v1.js` | prod-only | 2026-09-14T10:45:48+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-canonical-header-v2-2.css` | prod-only | 2026-09-07T11:29:14+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-centered-controls-v2-2.css` | prod-only | 2026-09-07T00:48:26+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-club-publisher-v1.css` | prod-only | 2026-09-13T19:08:49+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-club-publisher-v1.js` | prod-only | 2026-09-13T21:21:33+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-composer-sheet-v2.css` | prod-only | 2026-09-06T18:10:57+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-composer-sheet-v2.js` | prod-only | 2026-09-06T18:10:37+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-deeplink-auth-return-v1.css` | prod-only | 2026-09-13T16:37:46+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-deeplink-auth-return-v1.js` | prod-only | 2026-09-13T16:34:41+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-entity-model-v1.js` | both | 2026-09-12T17:14:28+02:00 | 2026-09-03T16:57:44+02:00 | no | `SUPERSEDED_REVIEW` |
| `community/board/board-entry-v2.js` | prod-only | 2026-09-12T17:14:28+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-filters-only-v2-1.js` | prod-only | 2026-09-06T22:55:07+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-filters-v2.css` | prod-only | 2026-09-12T21:47:42+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-fullscreen-v2-1.css` | prod-only | 2026-09-08T12:59:59+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-fullscreen-v2-1.js` | prod-only | 2026-09-13T01:59:03+03:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-guest-actions-v1.js` | prod-only | 2026-09-07T23:18:29+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-integrations-v1.js` | both | 2026-09-12T23:04:31+02:00 | 2026-09-03T16:57:44+02:00 | yes | `SUPERSEDED_REVIEW` |
| `community/board/board-layout-v2.js` | prod-only | 2026-09-06T22:56:04+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-mobile-air-v2-1.css` | prod-only | 2026-09-13T00:46:19+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-mobile-harmonization-v1.css` | prod-only | 2026-09-15T21:18:43+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-own-drag-livefix-v2-1.js` | prod-only | 2026-09-13T02:35:34+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-own-drag-livefix-v2-2.js` | prod-only | 2026-09-13T03:37:23+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-personal-card-v2.css` | prod-only | 2026-09-06T17:52:36+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-personal-card-v2.js` | prod-only | 2026-09-06T17:09:56+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-program-v1.css` | prod-only | 2026-09-15T19:04:50+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-program-v1.js` | prod-only | 2026-09-15T18:16:49+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-qa-fix-v1.css` | both | 2026-09-12T21:47:42+02:00 | 2026-09-04T15:38:57+02:00 | no | `SUPERSEDED_REVIEW` |
| `community/board/board-share-live-diagnostic-v1.js` | prod-only | 2026-09-13T12:49:29+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-spatial-v1.css` | both | 2026-09-12T20:23:03+02:00 | 2026-09-03T16:57:44+02:00 | yes | `SUPERSEDED_REVIEW` |
| `community/board/board-spatial-v1.js` | both | 2026-09-08T00:06:20+02:00 | 2026-09-05T15:21:50+02:00 | yes | `SUPERSEDED_REVIEW` |
| `community/board/board-tutorial-v2.css` | prod-only | 2026-09-06T18:02:31+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-tutorial-v2.js` | prod-only | 2026-09-06T20:34:44+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board-user-state-v2.js` | prod-only | 2026-09-08T14:50:48+03:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `community/board/board.js` | both | 2026-09-14T11:06:00Z | 2026-09-04T19:18:22+02:00 | yes | `SUPERSEDED_REVIEW` |
| `community/board/telegram-worker-trigger-v3.js` | site-only | — | 2026-09-03T16:57:44+02:00 | yes | `PRESERVE_REVIEW` |
| `community/community-member-entry-link-v1.js` | site-only | — | 2026-08-30T01:42:08+02:00 | no | `OBSOLETE_REVIEW` |
| `community/gabil/index.html` | both | 2026-09-09T01:57:21+02:00 | 2026-08-27T13:18:07Z | yes | `SUPERSEDED_REVIEW` |
| `community/index.html` | both | 2026-09-09T01:53:24+02:00 | 2026-08-30T00:51:54+02:00 | yes | `SUPERSEDED_REVIEW` |
| `content-series-v1.js` | both | 2026-09-14T19:11:28+02:00 | 2026-08-30T00:52:42+02:00 | no | `SUPERSEDED_REVIEW` |
| `content/page-readiness.json` | both | 2026-09-14T23:38:55+02:00 | 2026-08-26T15:36:05+02:00 | no | `SUPERSEDED_REVIEW` |
| `content/projects/dementor-battle.json` | prod-only | 2026-09-14T17:26:04+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `content/projects/dementor-lab.json` | prod-only | 2026-09-14T19:12:45+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `content/projects/dementor-robo-games.json` | prod-only | 2026-09-14T17:26:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `content/registry.json` | both | 2026-09-14T17:26:43+02:00 | 2026-08-26T15:35:02+02:00 | yes | `SUPERSEDED_REVIEW` |
| `course-account-identity-v1.js` | prod-only | 2026-08-30T10:00:42+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `courses/dumai-s-opasnostyu/bind.js` | both | 2026-09-16T10:33:41+02:00 | 2026-08-25T20:00:40+02:00 | no | `SUPERSEDED_REVIEW` |
| `courses/dumai-s-opasnostyu/core.js` | both | 2026-09-16T10:31:55+02:00 | 2026-08-25T19:57:55+02:00 | no | `SUPERSEDED_REVIEW` |
| `courses/dumai-s-opasnostyu/data.js` | both | 2026-09-17T18:04:19Z | 2026-08-25T19:57:27+02:00 | yes | `SUPERSEDED_REVIEW` |
| `courses/dumai-s-opasnostyu/index.html` | both | 2026-09-17T18:04:19Z | 2026-08-28T12:47:35+02:00 | yes | `SUPERSEDED_REVIEW` |
| `courses/dumai-s-opasnostyu/screens-1.js` | both | 2026-09-16T10:32:29+02:00 | 2026-08-25T19:58:45+02:00 | no | `SUPERSEDED_REVIEW` |
| `courses/dumai-s-opasnostyu/screens-3b.js` | both | 2026-09-16T10:32:54+02:00 | 2026-08-25T20:00:04+02:00 | no | `SUPERSEDED_REVIEW` |
| `current-program-v1.css` | prod-only | 2026-09-15T18:11:47+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `current-program-v1.js` | prod-only | 2026-09-17T18:04:19Z | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `dementor-account-sync-v10.js` | prod-only | 2026-09-08T14:52:44+03:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `dementor-account-sync-v8.js` | site-only | — | 2026-09-05T22:04:30+02:00 | yes | `PRESERVE_REVIEW` |
| `dementor-relations-v1.js` | both | 2026-09-10T00:11:49+02:00 | 2026-08-27T22:36:36Z | yes | `SUPERSEDED_REVIEW` |
| `design-system/dc9-entry-state-test/index.html` | site-only | — | 2026-09-02T12:28:05+02:00 | yes | `PRESERVE_REVIEW` |
| `design-system/dc9-mobile-qa/index.html` | site-only | — | 2026-09-02T13:26:43+02:00 | yes | `PRESERVE_REVIEW` |
| `design-system/dc9-mobile-result-qa/index.html` | site-only | — | 2026-09-02T13:31:42+02:00 | yes | `PRESERVE_REVIEW` |
| `design-system/motion-lab/index.html` | site-only | — | 2026-08-31T23:44:43+02:00 | no | `OBSOLETE_REVIEW` |
| `docs/BOARD-ACCESS-MATRIX-v1.md` | prod-only | 2026-09-07T23:18:29+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `docs/BOARD-UX-V2.1-FULLSCREEN.md` | prod-only | 2026-09-06T20:37:53+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `docs/COMMUNITY_MEMBER_ARTIFACT_RUNTIME_v1.md` | site-only | — | 2026-08-30T01:15:44+02:00 | no | `OBSOLETE_REVIEW` |
| `docs/COMMUNITY_MEMBER_ENTRY_ARTIFACT_QA_2026-08-30.md` | site-only | — | 2026-08-30T01:39:23+02:00 | no | `OBSOLETE_REVIEW` |
| `docs/COMMUNITY_SPATIAL_BOARD_V2_INTEGRATION_PLAN.md` | site-only | — | 2026-08-30T18:16:14+02:00 | no | `OBSOLETE_REVIEW` |
| `docs/COMMUNITY_V1_IMPLEMENTATION_STATUS_2026-08-30.md` | site-only | — | 2026-08-30T01:40:25+02:00 | no | `OBSOLETE_REVIEW` |
| `docs/COMMUNITY_V1_QA_FIX_BATCH_2026-08-30.md` | prod-only | 2026-08-30T12:06:51+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `docs/COMMUNITY_V1_RELEASE_QA_2026-08-30.md` | prod-only | 2026-08-30T12:17:05+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `docs/COMMUNITY_V1_RELEASE_READINESS.json` | prod-only | 2026-08-30T08:51:43+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `docs/COMMUNITY_V1_SECURITY_QA_2026-08-30.md` | site-only | — | 2026-08-30T01:42:59+02:00 | no | `OBSOLETE_REVIEW` |
| `docs/COMMUNITY_V3_QA_2026-08-30.md` | site-only | — | 2026-08-30T00:57:45+02:00 | no | `OBSOLETE_REVIEW` |
| `docs/ENTITY_PRESENTATION_ARTIFACT_EXTENSION_v1.md` | site-only | — | 2026-08-30T01:39:28+02:00 | no | `OBSOLETE_REVIEW` |
| `docs/FEATURE_ACTIVATION_MATRIX_v1.md` | both | 2026-08-24T16:31:43+02:00 | 2026-08-30T01:39:08+02:00 | no | `DECISION_REQUIRED` |
| `docs/FINAL_PRODUCTION_PREPARATION.md` | site-only | — | 2026-08-29T15:09:12+02:00 | no | `OBSOLETE_REVIEW` |
| `docs/GLOBAL_HEADER_v1.md` | both | 2026-09-10T12:21:03+02:00 | 2026-08-25T20:26:34+02:00 | yes | `SUPERSEDED_REVIEW` |
| `docs/HOTFIX_COMMUNITY_PROGRESS_OBSERVER_2026-08-30.md` | prod-only | 2026-08-30T09:35:05+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `docs/PRE_PRODUCTION_RELEASE_GATE.md` | site-only | — | 2026-08-29T14:41:52+02:00 | no | `OBSOLETE_REVIEW` |
| `docs/PROJECTS_V2_EDITORIAL_DESIGN_HANDOFF_2026-09-14.md` | prod-only | 2026-09-14T15:21:14+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `docs/PROJECTS_V2_LAB_V19_INTEGRATION_EVIDENCE_2026-09-14.md` | prod-only | 2026-09-14T22:09:34+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `docs/PROJECTS_V2_SOURCE_AUDIT_GATE_2026-09-14.md` | prod-only | 2026-09-14T18:46:24+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `docs/analytics/ANALYTICS_EVENT_MAP_V1.md` | prod-only | 2026-08-29T18:45:53+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `docs/analytics/ANALYTICS_HANDOFF_V1.md` | prod-only | 2026-08-29T18:45:53+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `docs/analytics/GA4_CLARITY_SETUP_V1.md` | prod-only | 2026-08-29T18:45:53+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `docs/release/supabase-production.md` | prod-only | 2026-09-13T23:17:32+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `entity-recommendations-v1.js` | both | 2026-09-09T08:25:43+02:00 | 2026-08-29T13:55:24+02:00 | yes | `SUPERSEDED_REVIEW` |
| `event-system.css` | both | 2026-09-10T11:37:23+02:00 | 2026-08-27T23:12:33Z | yes | `SUPERSEDED_REVIEW` |
| `events/fuengirola/index.html` | both | 2026-09-09T01:42:58+02:00 | 2026-08-27T20:15:49Z | yes | `SUPERSEDED_REVIEW` |
| `events/index.html` | both | 2026-09-10T00:10:55+02:00 | 2026-08-27T13:18:07Z | yes | `SUPERSEDED_REVIEW` |
| `favicon.svg` | prod-only | 2026-09-13T18:22:48+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `global-header.js` | both | 2026-09-08T14:53:30+03:00 | 2026-09-05T12:19:45+02:00 | yes | `SUPERSEDED_REVIEW` |
| `home-current-program-v1.js` | prod-only | 2026-09-15T18:16:33+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `home-event-fuengirola-20260828.css` | both | 2026-09-09T23:06:32+02:00 | 2026-08-29T00:30:20+02:00 | yes | `SUPERSEDED_REVIEW` |
| `home-v1.css` | both | 2026-09-09T21:26:53+02:00 | 2026-08-29T00:30:31+02:00 | yes | `SUPERSEDED_REVIEW` |
| `index.html` | both | 2026-09-15T18:21:17+02:00 | 2026-08-29T11:45:41+02:00 | yes | `SUPERSEDED_REVIEW` |
| `ink-layout-v2.js` | both | 2026-09-12T23:37:28+02:00 | 2026-08-25T00:41:55+02:00 | yes | `SUPERSEDED_REVIEW` |
| `integrations/telegram-worker/README.md` | prod-only | 2026-08-30T16:45:08+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `join-storage-guard.js` | both | 2026-09-08T21:05:19+02:00 | 2026-09-05T22:02:25+02:00 | yes | `SUPERSEDED_REVIEW` |
| `join/apply/apply.js` | both | 2026-09-08T15:02:57+03:00 | 2026-09-04T14:23:23+02:00 | yes | `SUPERSEDED_REVIEW` |
| `join/apply/dc9-baseline-sync-v1.js` | both | 2026-09-08T14:50:04+03:00 | 2026-09-04T17:27:16+02:00 | yes | `SUPERSEDED_REVIEW` |
| `join/community-entry-bridge-v1.js` | both | 2026-08-30T09:34:36+02:00 | 2026-08-30T01:33:51+02:00 | no | `SUPERSEDED_REVIEW` |
| `join/dc9-sphere-compat-v1.js` | prod-only | 2026-08-30T10:45:47+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `join/dc9-sync-state-v1.js` | prod-only | 2026-09-08T14:47:17+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `join/join-hotfix-v1.js` | prod-only | 2026-08-30T09:05:50+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `join/join-progress-map-v2.js` | both | 2026-08-29T00:47:54+02:00 | 2026-08-31T16:39:24+02:00 | no | `DECISION_REQUIRED` |
| `join/member/member.js` | both | 2026-08-30T12:03:36+02:00 | 2026-08-30T01:31:09+02:00 | no | `SUPERSEDED_REVIEW` |
| `join/result/GRAPH_LINKED_CARDS_V5.md` | site-only | — | 2026-09-01T22:49:53+02:00 | yes | `PRESERVE_REVIEW` |
| `join/result/GRAPH_LINKED_CARDS_V6.md` | site-only | — | 2026-09-01T22:48:08+02:00 | no | `OBSOLETE_REVIEW` |
| `join/result/index.html` | both | 2026-09-02T13:44:09+02:00 | 2026-09-02T01:06:39+02:00 | yes | `SUPERSEDED_REVIEW` |
| `join/result/result-mobile-legend-v1.css` | site-only | — | 2026-08-31T17:08:44+02:00 | no | `OBSOLETE_REVIEW` |
| `join/result/result-mobile-legend-v1.js` | site-only | — | 2026-08-31T17:10:05+02:00 | no | `OBSOLETE_REVIEW` |
| `join/result/result-mobile-v5.css` | prod-only | 2026-09-02T13:43:47+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `join/result/result-model-v1.js` | site-only | — | 2026-08-31T17:29:52+02:00 | no | `OBSOLETE_REVIEW` |
| `join/result/result-refinements-v2.css` | site-only | — | 2026-08-31T17:31:26+02:00 | no | `OBSOLETE_REVIEW` |
| `join/result/result.js` | both | 2026-08-30T01:41:51+02:00 | 2026-08-31T17:45:04+02:00 | no | `DECISION_REQUIRED` |
| `merch-runtime-v1.js` | both | 2026-09-16T13:23:29+02:00 | 2026-08-28T22:46:19+02:00 | yes | `SUPERSEDED_REVIEW` |
| `merch/drop-001/overthinking-is-my-cardio/index.html` | both | 2026-09-12T23:37:28+02:00 | 2026-08-28T22:38:55+02:00 | no | `SUPERSEDED_REVIEW` |
| `merch/drop-001/personal-growth-cancelled/index.html` | both | 2026-09-12T23:37:28+02:00 | 2026-08-28T22:39:06+02:00 | no | `SUPERSEDED_REVIEW` |
| `merch/drop-001/potential-too-long-revealed/index.html` | both | 2026-09-12T23:37:28+02:00 | 2026-08-29T13:53:07+02:00 | no | `SUPERSEDED_REVIEW` |
| `merch/drop-001/success-is-boring/index.html` | both | 2026-09-12T23:37:28+02:00 | 2026-08-28T22:39:20+02:00 | no | `SUPERSEDED_REVIEW` |
| `merch/index.html` | both | 2026-09-09T21:27:43+02:00 | 2026-08-29T14:11:19+02:00 | yes | `SUPERSEDED_REVIEW` |
| `motion-v1.js` | both | 2026-09-10T12:18:18+02:00 | 2026-08-26T11:18:01+02:00 | yes | `SUPERSEDED_REVIEW` |
| `objects/001-ne-nado/index.html` | both | 2026-09-16T13:52:49+02:00 | 2026-08-28T22:38:25+02:00 | no | `SUPERSEDED_REVIEW` |
| `operations/BOARD_DEEPLINK_AUTH_RETURN_G2_2026-09-12.md` | prod-only | 2026-09-13T01:59:03+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `operations/BOARD_INFORMATION_ARCHITECTURE_BATCH_A_G6_EVIDENCE_2026-09-12.md` | prod-only | 2026-09-12T17:14:28+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `operations/BOARD_INFORMATION_ARCHITECTURE_BATCH_A_PLAN_2026-09-12.md` | prod-only | 2026-09-12T17:14:28+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `operations/BOARD_INFORMATION_ARCHITECTURE_BATCH_A_PRODUCTION_DB_VALIDATION_2026-09-12.md` | prod-only | 2026-09-12T17:14:28+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `operations/BOARD_INFORMATION_ARCHITECTURE_BATCH_A_ROLLBACK_2026-09-12.md` | prod-only | 2026-09-12T17:14:28+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `operations/BOARD_INFORMATION_ARCHITECTURE_BATCH_A_VALIDATION_FREE_PATH_2026-09-12.md` | prod-only | 2026-09-12T17:14:28+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `operations/BOARD_INFORMATION_ARCHITECTURE_BATCH_B_INVENTORY_2026-09-12.md` | prod-only | 2026-09-12T17:14:28+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `operations/BOARD_INFORMATION_ARCHITECTURE_BATCH_B_PRODUCTION_DB_VALIDATION_2026-09-12.md` | prod-only | 2026-09-12T17:14:28+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `operations/BOARD_INFORMATION_ARCHITECTURE_G2_CLOSURE_2026-09-12.md` | prod-only | 2026-09-12T17:14:28+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `operations/BOARD_INFORMATION_ARCHITECTURE_G2_INVENTORY_2026-09-12.md` | prod-only | 2026-09-12T17:14:28+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `operations/BOARD_INFORMATION_ARCHITECTURE_G8_SCHEDULER_VALIDATION_SCOPE_2026-09-12.md` | prod-only | 2026-09-12T19:38:56+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `operations/BOARD_LIVE_CORRECTIVE_G2_2026-09-12.md` | prod-only | 2026-09-12T21:47:42+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `operations/BOARD_TELEGRAM_PROMOTION_G2_INVENTORY_2026-09-12.md` | prod-only | 2026-09-12T17:14:28+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `operations/BOARD_TELEGRAM_PROMOTION_PRODUCTION_DB_VALIDATION_2026-09-12.md` | prod-only | 2026-09-12T17:14:28+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `operations/BOARD_TELEGRAM_PROMOTION_WORKER_DEPLOY_2026-09-12.md` | prod-only | 2026-09-12T17:14:28+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `operations/BOARD_TELEGRAM_PROMOTION_WORKER_RELEASE_DELTA_2026-09-12.md` | prod-only | 2026-09-12T17:14:28+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `operations/BOARD_TELEGRAM_WORKER_SCHEDULER_G8_PLAN_2026-09-12.md` | prod-only | 2026-09-12T19:38:56+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `operations/BOARD_TELEGRAM_WORKER_SCHEDULER_G8_ROLLBACK_2026-09-12.md` | prod-only | 2026-09-12T19:38:56+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `operations/COMMERCE_TRUTH_GUARD_G6_PREP_2026-09-16.md` | prod-only | 2026-09-16T13:53:42+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `operations/PUBLIC_SITE_VISUAL_TECH_DEBT_CLEANUP_REFRESH_2026-09-12.md` | prod-only | 2026-09-12T23:37:28+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `production-analytics-v1.js` | both | 2026-09-16T21:33:02+02:00 | 2026-09-03T17:05:35+02:00 | yes | `SUPERSEDED_REVIEW` |
| `production-route-manifest.json` | both | 2026-09-14T17:28:06+02:00 | 2026-09-03T13:52:48+02:00 | no | `SUPERSEDED_REVIEW` |
| `projects-hub-v2.css` | prod-only | 2026-09-14T16:54:06+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `projects/dementor-battle/index.html` | prod-only | 2026-09-14T17:25:29+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `projects/dementor-lab/index.html` | prod-only | 2026-09-14T17:55:03Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `projects/dementor-robo-games/index.html` | prod-only | 2026-09-14T17:25:49+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `projects/index.html` | both | 2026-09-14T23:43:02+02:00 | 2026-08-27T13:18:07Z | no | `SUPERSEDED_REVIEW` |
| `public-activity-v1.css` | prod-only | 2026-09-14T10:25:50+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `public-activity-v1.js` | prod-only | 2026-09-14T10:25:50+03:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `script.js` | both | 2026-08-30T10:03:22+02:00 | 2026-08-24T16:30:36+02:00 | yes | `SUPERSEDED_REVIEW` |
| `scripts/build-pages.mjs` | both | 2026-09-14T18:45:48+02:00 | 2026-09-04T15:36:26+02:00 | yes | `SUPERSEDED_REVIEW` |
| `scripts/diagnose-home-fuengirola-media.mjs` | prod-only | 2026-09-09T23:02:15+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/social-head-v1.mjs` | prod-only | 2026-09-13T18:27:40+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-board-admin-telegram-optin-browser.mjs` | prod-only | 2026-09-14T14:07:50+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-board-admin-telegram-optin-contract.mjs` | prod-only | 2026-09-14T14:07:20+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-board-batch-a-contract.mjs` | prod-only | 2026-09-14T00:40:09+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-board-batch-b-contract.mjs` | prod-only | 2026-09-14T00:40:18+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-board-club-publisher-contract.mjs` | prod-only | 2026-09-14T00:40:53+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-board-deeplink-auth-return-browser.mjs` | prod-only | 2026-09-13T16:37:13+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-board-deeplink-auth-return-contract.mjs` | prod-only | 2026-09-13T16:36:22+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-board-g8-cleanup-contract.mjs` | prod-only | 2026-09-14T00:40:42+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-board-live-corrective-browser.mjs` | prod-only | 2026-09-12T23:04:31+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-board-mobile-harmonization-browser.mjs` | prod-only | 2026-09-15T21:19:11+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-board-navigation-adaptive-cards-browser.mjs` | prod-only | 2026-09-13T00:46:19+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-board-public-activity-browser.mjs` | prod-only | 2026-09-14T11:07:49+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-board-public-activity-contract.mjs` | prod-only | 2026-09-16T21:36:35+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-board-share-own-card-browser.mjs` | prod-only | 2026-09-13T16:43:48+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-board-telegram-promotion-contract.mjs` | prod-only | 2026-09-14T14:21:24+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-board-v2-browser.mjs` | prod-only | 2026-09-06T19:15:04+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-board-v2-contract.mjs` | prod-only | 2026-09-14T00:39:58+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-board-v21-browser.mjs` | prod-only | 2026-09-12T19:38:56+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-board-v21-contract.mjs` | prod-only | 2026-09-15T19:05:08+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-browser-shell-v21-compat.mjs` | prod-only | 2026-09-12T17:14:28+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-browser-shell.mjs` | both | 2026-09-17T00:49:20+02:00 | 2026-09-04T19:25:40+02:00 | yes | `SUPERSEDED_REVIEW` |
| `scripts/validate-club-publisher-stability-browser.mjs` | prod-only | 2026-09-13T21:28:23+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-commerce-truth-guard-browser.mjs` | prod-only | 2026-09-16T14:00:57+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-current-program-browser.mjs` | prod-only | 2026-09-15T19:06:16+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-current-program-v1.mjs` | prod-only | 2026-09-17T18:04:19Z | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-dc9-baseline-contract.mjs` | both | 2026-09-08T14:56:07+03:00 | 2026-09-05T22:05:04+02:00 | yes | `SUPERSEDED_REVIEW` |
| `scripts/validate-dc9-result-model.mjs` | site-only | — | 2026-08-31T17:33:11+02:00 | yes | `PRESERVE_REVIEW` |
| `scripts/validate-dc9-result.mjs` | site-only | — | 2026-08-31T16:26:48+02:00 | no | `OBSOLETE_REVIEW` |
| `scripts/validate-dc9-sync-browser.mjs` | prod-only | 2026-09-08T15:05:09+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-dc9-sync-integrity.mjs` | prod-only | 2026-09-08T21:06:01+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-dumai-release-loop-browser.mjs` | prod-only | 2026-09-16T10:46:19+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-dumai-release-loop-v1.mjs` | prod-only | 2026-09-17T18:04:19Z | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-evidence-hygiene-browser.mjs` | prod-only | 2026-09-16T21:35:32+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-google-oauth-handoff.mjs` | both | 2026-09-12T17:14:28+02:00 | 2026-09-05T16:34:02+02:00 | yes | `SUPERSEDED_REVIEW` |
| `scripts/validate-interactive-runtime.mjs` | prod-only | 2026-09-03T12:31:30+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-membership-semantic-authority.mjs` | prod-only | 2026-09-08T15:53:10+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-production-analytics.mjs` | both | 2026-09-16T21:33:58+02:00 | 2026-09-03T17:05:35+02:00 | yes | `SUPERSEDED_REVIEW` |
| `scripts/validate-production-release.mjs` | both | 2026-09-16T13:24:50+02:00 | 2026-09-03T11:48:47+02:00 | no | `SUPERSEDED_REVIEW` |
| `scripts/validate-projects-v2-browser.mjs` | prod-only | 2026-09-14T23:34:45+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-public-harmonization-browser.mjs` | prod-only | 2026-09-15T18:18:07+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-shell-contract.mjs` | both | 2026-09-12T19:38:56+02:00 | 2026-09-05T18:30:31+02:00 | yes | `SUPERSEDED_REVIEW` |
| `scripts/validate-supabase-release-contract.mjs` | prod-only | 2026-09-14T00:42:00+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `scripts/validate-visual-contract.mjs` | both | 2026-09-17T18:04:19Z | 2026-08-28T09:47:52+02:00 | yes | `SUPERSEDED_REVIEW` |
| `scripts/visual-baselines/home-fuengirola.json` | prod-only | 2026-09-09T23:26:26+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `seo-runtime.js` | both | 2026-09-10T12:17:19+02:00 | 2026-08-25T00:25:57+02:00 | yes | `SUPERSEDED_REVIEW` |
| `share/artifact/index.html` | prod-only | 2026-09-13T15:07:46+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `site-config.js` | both | 2026-09-16T10:42:24+02:00 | 2026-09-04T15:35:51+02:00 | yes | `SUPERSEDED_REVIEW` |
| `site.webmanifest` | both | 2026-09-13T18:23:02+03:00 | 2026-08-23T16:23:45+02:00 | no | `SUPERSEDED_REVIEW` |
| `sitemap.xml` | both | 2026-09-14T17:28:27+02:00 | 2026-09-03T11:41:01+02:00 | yes | `SUPERSEDED_REVIEW` |
| `supabase/config.toml` | prod-only | 2026-09-13T23:17:32+03:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `supabase/cutover/MEMBERSHIP_V2_CUTOVER.sql` | site-only | — | 2026-09-02T15:19:16+02:00 | no | `OBSOLETE_REVIEW` |
| `supabase/deferred/20260830224500_community_member_activated_gate_v1.sql` | prod-only | 2026-08-31T01:22:59+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/functions/telegram-outbox-worker/index.ts` | prod-only | 2026-09-13T19:10:24+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260827212520_archive_edu_and_create_dementor_core.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260827212614_secure_legacy_edu_archive.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260827213550_add_dementor_assessment_sync.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260827214433_add_dementor_commerce_state.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260828002841_grant_authenticated_profiles_read_update.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260828170411_dc_workspace_readonly_v01.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260828203152_dc_merch_certificates_progress_v01.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260828204145_course_enrollment_account_progress_v01.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260828205228_mp_weekly_runtime_v1.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260828205746_mp_weekly_runtime_rls_v1_1.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260828205825_mp_weekly_runtime_grants_v1_2.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260828211140_mp_project_access_profiles_v1.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260828212349_mp_client_team_artifact_access_v1.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260828213850_mp_spore_person_credits_v1.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260828221529_join_application_authenticated_only_v1.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260828222141_mp_project_access_profile_unassigned_v1.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260828223528_dc_owner_admin_system_checks_v1.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260829061020_mp_publishing_runtime_v1.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260829074301_mp_spore_tool_leverage_v1.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260829080909_mp_weekly_snapshot_v1.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260829232745_community_member_artifact_v1.sql` | prod-only | 2026-09-13T22:34:35Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260829232924_community_member_artifact_v1_hardening.sql` | prod-only | 2026-09-14T00:34:18+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260829234107_community_membership_state_guard_v1.sql` | prod-only | 2026-09-14T09:42:47Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260829_fix_merch_public_read.sql` | site-only | — | 2026-08-29T14:27:50+02:00 | no | `OBSOLETE_REVIEW` |
| `supabase/migrations/20260830094110_canonicalize_self_development_sphere.sql` | prod-only | 2026-09-13T23:17:32+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260830135150_community_artifact_qa_hardening.sql` | prod-only | 2026-09-13T23:17:32+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260830203911_grant_mp_project_refs_select_to_service_role.sql` | prod-only | 2026-09-14T09:42:47Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260830232436_community_board_positions_v1.sql` | prod-only | 2026-08-31T01:26:23+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260831080627_community_distribution_outbox_service_role_permissions.sql` | prod-only | 2026-09-14T09:42:47Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260831081426_community_telegram_worker_service_role_reads.sql` | prod-only | 2026-09-14T09:42:47Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260831130116_mp_client_project_visibility_v1.sql` | prod-only | 2026-09-14T09:42:47Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260902130850_dc_membership_dementor_review_v2.sql` | both | 2026-09-14T09:42:47Z | 2026-09-02T15:15:10+02:00 | no | `SUPERSEDED_REVIEW` |
| `supabase/migrations/20260902131415_dc_membership_review_v2_hardening.sql` | both | 2026-09-14T09:42:47Z | 2026-09-02T15:15:17+02:00 | no | `SUPERSEDED_REVIEW` |
| `supabase/migrations/20260906143710_guest_board_read_v1.sql` | prod-only | 2026-09-13T23:17:32+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260906173725_guest_board_interest_v1.sql` | prod-only | 2026-09-13T23:17:32+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260907210040_guest_board_responses_v1.sql` | prod-only | 2026-09-07T23:18:29+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260907210333_guest_board_response_rpc_v1.sql` | prod-only | 2026-09-07T23:18:29+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260907215547_board_access_owner_admin_v2.sql` | prod-only | 2026-09-08T00:06:20+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260907215922_board_owner_admin_storage_v2.sql` | prod-only | 2026-09-08T00:06:20+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260908132816_dc9_membership_semantic_integrity_v1.sql` | prod-only | 2026-09-08T15:51:36+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260908202747_mp_project_requests_v1.sql` | prod-only | 2026-09-14T09:42:47Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260909061242_mp_project_owner_provisioning_v1.sql` | prod-only | 2026-09-14T09:42:47Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260909214529_mp_client_team_access_v1.sql` | prod-only | 2026-09-14T09:42:47Z | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260912121109_board_information_architecture_batch_a.sql` | prod-only | 2026-09-13T23:17:32+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260912121255_board_information_architecture_batch_a_security_hardening.sql` | prod-only | 2026-09-13T23:17:32+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260912123011_board_information_architecture_batch_b_subtypes.sql` | prod-only | 2026-09-13T23:17:32+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260912135107_board_information_architecture_batch_b_default_hardening.sql` | prod-only | 2026-09-13T23:17:32+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260912144034_board_telegram_promotion_v1.sql` | prod-only | 2026-09-13T23:17:32+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260912144055_board_telegram_promotion_v1_worker_hardening.sql` | prod-only | 2026-09-13T23:17:32+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260912173340_board_telegram_worker_scheduler_v1.sql` | prod-only | 2026-09-13T23:17:32+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260913171431_board_club_publisher_v1.sql` | prod-only | 2026-09-13T23:17:32+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260913171437_board_club_publisher_worker_grant_v1.sql` | prod-only | 2026-09-13T23:17:32+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260914090000_board_public_activity_read_v1.sql` | prod-only | 2026-09-14T10:25:50+03:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `supabase/migrations/20260916213500_evidence_hygiene_v1.sql` | prod-only | 2026-09-16T21:32:23+02:00 | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `supabase/qa/SHARECRAFT_MEMBERSHIP_V2_RESET.sql` | site-only | — | 2026-09-02T15:19:26+02:00 | no | `OBSOLETE_REVIEW` |
| `thing-projection-v1.js` | prod-only | 2026-09-17T18:04:19Z | — | yes | `PRODUCTION_BASELINE_ONLY` |
| `ui-redesign-drive-v1.css` | site-only | — | 2026-08-26T14:35:52+02:00 | yes | `PRESERVE_REVIEW` |
| `vercel.json` | both | 2026-08-26T17:59:21+02:00 | 2026-08-30T01:34:23+02:00 | no | `DECISION_REQUIRED` |
| `visual-standard-v2.css` | both | 2026-09-10T11:38:59+02:00 | 2026-08-27T22:36:36Z | yes | `SUPERSEDED_REVIEW` |
| `workspace/artifacts/index.html` | both | 2026-09-12T18:41:46+02:00 | 2026-09-03T11:36:52+02:00 | no | `SUPERSEDED_REVIEW` |
| `workspace/board/index.html` | both | 2026-09-15T21:07:46+02:00 | 2026-09-05T23:54:40+02:00 | yes | `SUPERSEDED_REVIEW` |
| `workspace/index.html` | both | 2026-09-03T12:28:49+02:00 | 2026-09-03T11:36:42+02:00 | no | `SUPERSEDED_REVIEW` |
| `workspace/review/index.html` | both | 2026-09-03T12:28:49+02:00 | 2026-09-03T11:37:03+02:00 | no | `SUPERSEDED_REVIEW` |
| `workspace/workspace-analytics-hook-v1.js` | prod-only | 2026-08-29T18:45:53+02:00 | — | no | `PRODUCTION_BASELINE_ONLY` |
| `workspace/workspace-review-nav-v2.js` | both | 2026-09-02T20:33:44+02:00 | 2026-09-02T15:12:09+02:00 | no | `SUPERSEDED_REVIEW` |
| `workspace/workspace-shell-v1.js` | both | 2026-09-06T16:40:48+02:00 | 2026-09-04T15:37:01+02:00 | yes | `SUPERSEDED_REVIEW` |

## Guardrails

- Production is the runtime baseline; this inventory does not authorize overwriting production.
- A semantic reference is evidence to inspect, not automatic permission to preserve an old implementation.
- `SUPERSEDED_REVIEW` must still be checked for staging-only developer purpose before discard.
- No branch realignment is authorized by this inventory alone.
