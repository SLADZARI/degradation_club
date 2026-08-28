# HOME / PROJECT / LOGIC & AWARENESS

STATUS: ASSETS READY / QA PENDING
DATE: 2026-08-28
TARGET ROUTE: Home → `/projects/logic-awareness/`
PRODUCTION: NOT YET RELEASED

## Approved composition

The approved local prototype is the latest v2 variant reviewed on 2026-08-28.

Desktop:
- black full-width project block;
- left content zone with `PROJECT / 001 / ACTIVE`, title, Ministry lead, descriptive copy and acid CTA;
- right identity rail with project source label, portrait pair, statement and local identity footer;
- responsive guards at 1350px and 1050px prevent the title from colliding with the identity rail.

Mobile:
- one continuous vertical section rather than a shrunk desktop grid;
- title remains fully inside viewport;
- identity rail follows the main copy in the same block;
- portrait pair scales down as a whole and is not cropped;
- narrow-phone correction applies at 390px.

## Copy

Title: `ЛОГИКА И ОСОЗНАННОСТЬ`
Lead: `Министерство профилактики здравого смысла предупреждает.`
CTA: `ОТКРЫТЬ ПРОЕКТ`
Statement: `НАЧАЛИ ПРОВЕРЯТЬ ФАКТЫ? НЕ ЗАПУСКАЙТЕ СОСТОЯНИЕ.`

The block does not introduce new product mechanics or claims. It is a Home entry point to the existing independent project.

## Approved visual assets

Both deployment assets are now promoted on `agent/homepage-refresh-deploy-2026-08-28`:

1. portrait pair
   - approved source: `L_O_dementor(1).png`
   - production path: `/assets/projects/logic-awareness/home/identity-pair-v2.webp`
   - source SHA-256: `e0008229169170fe0425983f97abe41968f93e7e8343535a97941944ac6b631b`
   - production delivery format: optimized WebP derived from that approved source, preserving the approved dimensions/composition
2. SECRET stamp
   - approved source: `secret.png`
   - production path: `/assets/projects/logic-awareness/home/secret-stamp.png`
   - source SHA-256: `9d368effff256ffb96acf9bdc24bc994f77373a077a517c0c373336bb2a91d6e`

Both production paths were verified on the deploy branch after promotion. Do not substitute an older portrait pair or a raster screenshot of the complete project block.

## Production staging

The approved block is staged as CSS overrides against the existing `.dc-project` markup on Home. No semantic rewrite of `index.html` is required.

The previous production Home CSS is preserved as `home-v1-base-20260828.css` and imported by the new `home-v1.css` so unrelated production behavior remains intact.

## Release rule

The binary asset blocker is cleared. The remaining gate is whole-Home desktop/mobile QA and repository checks. The block ships only as part of `agent/homepage-refresh-deploy-2026-08-28`.
