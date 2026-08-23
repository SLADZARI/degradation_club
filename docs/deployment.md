# Dementor Club — production deployment contract

Status: approved architecture / deployment connection currently unverified
Updated: 2026-08-23

## Production source

The official public site is deployed only from branch `dementor-club-site`.

Branch responsibilities remain separate:

- `dementor-club` — source-of-truth for approved club meanings, rules, events, community mechanics and public copy before web implementation;
- `dementor-club-site` — production website implementation and the only branch allowed to deploy the official site;
- `logic-awareness` — independent project «Логика и осознанность»;
- `main` — shared technical/repository level, not a production website source.

## Vercel target contract

Expected project setting:

- Repository: `SLADZARI/degradation_club`
- Production Branch: `dementor-club-site`
- Root Directory: repository root
- Previous known alias: `dementor-club-sharecraftwideo-5699s-projects.vercel.app`

`vercel.json` explicitly disables Git deployments from `main`, `dementor-club` and `logic-awareness` and enables them for `dementor-club-site`.

## Current verified state — 2026-08-23

The connected Vercel account/team resolves successfully, but its project listing currently returns **zero projects**. A direct deployment attempt through the connector also cannot proceed because the deployment action currently exposes an inconsistent runtime schema.

Therefore earlier statements that the production project/branch connection is already active must be treated as **historical/unverified**, not current proof of publication.

Do not claim a production deployment until the project appears in the connected Vercel account and the deployed routes are fetched successfully.

## Release flow

`dementor-club` → approved content/decision → implementation in `dementor-club-site` → production deployment → public verification.

A successful Preview deployment is not considered publication. Publication is complete only when the stable production alias/domain serves the new route/content.

## Required smoke checks

After every production deployment verify:

1. `/` returns the current homepage.
2. `/about/` opens successfully.
3. `/events/` and `/events/fuengirola/` resolve.
4. `/projects/` and `/projects/logic-awareness/` resolve.
5. `/community/`, `/merch/`, `/join/` resolve.
6. onboarding can be completed and local progress persists.
7. main navigation has no legacy homepage-anchor routes.
8. no club source-of-truth or independent project branch is used as the production branch.
9. production asset requests return the expected raster files.
10. no claim of publication is made before these checks pass.
