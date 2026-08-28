# HOME / PROJECT / LOGIC & AWARENESS

STATUS: APPROVED FOR HOMEPAGE REFRESH BATCH
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

Two assets from the approved local package must be promoted into the repository during final batch packaging:

1. portrait pair — source file `L_O_dementor(1).png`
   - approved target path: `/assets/projects/logic-awareness/home/identity-pair-v2.png`
   - SHA-256: `e0008229169170fe0425983f97abe41968f93e7e8343535a97941944ac6b631b`
   - bytes: `147864`
2. SECRET stamp — source file `secret.png`
   - approved target path: `/assets/projects/logic-awareness/home/secret-stamp.png`
   - SHA-256: `9d368effff256ffb96acf9bdc24bc994f77373a077a517c0c373336bb2a91d6e`
   - bytes: `10876`

The staged HTML currently keeps relative prototype paths. Before release, replace those paths with the approved production asset paths above.

## Staged implementation

- `index.html` — approved prototype markup
- `logic-awareness-home-block.css` — approved responsive geometry

These files are retained as the batch reference implementation. They are not a separate public page.

## Release rule

Do not publish this block independently. It must ship together with the rest of `agent/homepage-refresh-batch-2026-08-28` after the complete Home page is reviewed on desktop and mobile.
