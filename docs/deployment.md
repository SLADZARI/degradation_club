# Dementor Club — production deployment contract

Status: approved

## Production source

The official public site is deployed only from branch `dementor-club-site`.

Branch responsibilities remain separate:

- `dementor-club` — source-of-truth for approved club meanings, rules, events, community mechanics and public copy before web implementation;
- `dementor-club-site` — production website implementation and the only branch allowed to deploy the official site;
- `logic-awareness` — independent project «Логика и осознанность»;
- `main` — shared technical/repository level, not a production website source.

## Vercel

Expected Vercel project setting:

- Repository: `SLADZARI/degradation_club`
- Production Branch: `dementor-club-site`
- Root Directory: repository root
- Production alias: `dementor-club-sharecraftwideo-5699s-projects.vercel.app`

`vercel.json` explicitly disables Git deployments from `main`, `dementor-club` and `logic-awareness` and enables them for `dementor-club-site`.

## Release flow

`dementor-club` → approved content/decision → implementation in `dementor-club-site` → push → Vercel production deployment → public verification.

A successful Preview deployment is not considered publication. Publication is complete only when the production alias serves the new route/content.

## Required smoke checks

After every production deployment verify:

1. `/` returns the current homepage.
2. `/about/` opens successfully.
3. `/join/` opens successfully and onboarding can be completed.
4. Main CTA «Вступить в клуб» leads to `/join/`.
5. No club source-of-truth or independent project branch is used as the production branch.
