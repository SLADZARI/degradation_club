# Homepage Refresh — Deployment Preparation

STATUS: PRE-DEPLOY CHECKLIST
DATE: 2026-08-28
BRANCH: `agent/homepage-refresh-batch-2026-08-28`
BASE: `dementor-club-site`

## Scope

This release contains the approved Home-page recomposition work accumulated in the Homepage Refresh batch.

Included blocks:

1. Community / People / Activity
2. Logic & Awareness / Project 001

No unrelated Home content or entity semantics should be changed as part of this release.

## Files already staged

- `home-v1.css` — deployment staging layer containing both approved block implementations.
- `home-v1-base-20260828.css` — preserved previous Home contract imported by `home-v1.css`.
- `index.html` — existing Home markup; no semantic rewrite required for the approved blocks.
- `docs/homepage-refresh/README.md` — batch register and release rule.
- `docs/homepage-refresh/logic-awareness/*` — approved Logic & Awareness reference prototype and contract.

## Community / People / Activity

Release state: READY

Required production asset already exists:

`/assets/ink/home-community-01.webp`

Expected behavior:

- block surface `#F1E9D8`;
- no dark overlay;
- no filter or opacity reduction;
- exactly one HTML/CSS caption layer;
- desktop uses the large illustration composition;
- mobile uses `object-fit: contain` and preserves the full illustration;
- route target `/community/`.

## Logic & Awareness / Project 001

Release state: CSS READY / BINARY ASSETS PENDING

Production CSS is staged against the existing `.dc-project` markup in `index.html`.

Required approved production assets:

`/assets/projects/logic-awareness/home/identity-pair-v2.webp`

`/assets/projects/logic-awareness/home/secret-stamp.png`

Approved local source files:

- identity pair source: `L_O_dementor(1).png`
- stamp source: `secret.png`

Approved source fingerprints:

- `L_O_dementor(1).png` SHA-256: `e0008229169170fe0425983f97abe41968f93e7e8343535a97941944ac6b631b`
- `secret.png` SHA-256: `9d368effff256ffb96acf9bdc24bc994f77373a077a517c0c373336bb2a91d6e`

Do not substitute an older portrait pair or an old raster project screenshot during deployment.

Expected behavior:

- desktop: two-column layout;
- breakpoint guards at 1350px and 1050px;
- title never overlaps the right identity rail;
- mobile: single vertical flow;
- title remains within viewport;
- portrait pair scales as a whole and is not cropped;
- route target `/projects/logic-awareness/`.

## Required QA matrix

Desktop:

- 1600 × 900
- 1440 × 900
- 1280 × 800
- 1024 × 768

Mobile:

- 430 × 932
- 390 × 844
- 375 × 812
- 360 × 800

At every width verify:

- no horizontal scroll;
- no hidden title fragments;
- no duplicate CTA/caption raster;
- images load without 404;
- Community mobile artwork is fully visible;
- Logic portrait pair is fully visible;
- Logic stamp does not collide with viewport or identity rail;
- links are keyboard-focusable;
- `prefers-reduced-motion` does not introduce layout regressions.

## Repository checks before merge

Run or confirm:

- site integrity workflow;
- internal link validation;
- asset-path validation;
- visual contract validation where applicable;
- no unexpected change outside Homepage Refresh scope.

## Release gate

DO NOT MERGE to `dementor-club-site` while either Logic & Awareness binary path returns 404.

When both approved binaries are promoted and QA passes, change the batch status from `DEPLOYMENT PREPARATION` to `READY TO DEPLOY`, review the final diff against `dementor-club-site`, and merge as one release.
