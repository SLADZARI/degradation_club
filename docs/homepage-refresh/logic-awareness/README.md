# HOME / PROJECT / LOGIC & AWARENESS

STATUS: DEPLOYMENT PREPARED / ASSETS BLOCKED
DATE: 2026-08-28
TARGET ROUTE: Home → `/projects/logic-awareness/`
PRODUCTION: NOT YET RELEASED

## Approved composition

The approved local prototype is the latest v2 variant reviewed in conversation on 2026-08-28.

Desktop:
- black full-width project block;
- left content zone with `PROJECT / 001 / ACTIVE`, title, Ministry lead, descriptive copy and acid CTA;
- right identity rail with project source label, portrait pair, statement and local identity footer;
- responsive guards at 1350px and 1050px prevent the title from colliding with or entering the right rail.

Mobile:
- one continuous vertical section rather than a shrunk desktop grid;
- title must remain fully inside viewport;
- identity rail follows the main copy in the same block;
- portrait pair scales down as a whole and is not cropped;
- approved narrow-phone correction applies at 390px.

## Copy

Title: `ЛОГИКА И ОСОЗНАННОСТЬ`
Lead: `Министерство профилактики здравого смысла предупреждает.`
CTA: `ОТКРЫТЬ ПРОЕКТ`
Statement: `НАЧАЛИ ПРОВЕРЯТЬ ФАКТЫ? НЕ ЗАПУСКАЙТЕ СОСТОЯНИЕ.`

The block does not introduce new product mechanics or claims. It is a Home entry point to the existing independent project.

## Approved visual assets

Two assets from the approved local package must be promoted into the repository during final deployment packaging:

1. portrait pair — source file `L_O_dementor(1).png`
   - approved production path: `/assets/projects/logic-awareness/home/identity-pair-v2.webp`
   - source SHA-256: `e0008229169170fe0425983f97abe41968f93e7e8343535a97941944ac6b631b`
2. SECRET stamp — source file `secret.png`
   - approved production path: `/assets/projects/logic-awareness/home/secret-stamp.png`
   - source SHA-256: `9d368effff256ffb96acf9bdc24bc994f77373a077a517c0c373336bb2a91d6e`

The production CSS in `home-v1.css` already points to these paths. Do not substitute an older portrait pair or a previous raster screenshot.

## Production staging

The approved block is staged as CSS overrides against the existing `.dc-project` markup in the Home page. No semantic rewrite of `index.html` is required.

The previous production Home CSS is preserved as `home-v1-base-20260828.css` and imported by the new `home-v1.css` so unrelated production behavior remains intact.

## Release rule

Do not merge while either approved binary path returns 404. The block ships only as part of `agent/homepage-refresh-deploy-2026-08-28` after whole-Home desktop/mobile QA.
