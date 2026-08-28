# Homepage Refresh — Deployment Preparation

STATUS: ASSETS READY / QA PENDING
DATE: 2026-08-28
BRANCH: `agent/homepage-refresh-deploy-2026-08-28`
BASE: `dementor-club-site`

## Scope

This release contains only the approved Home-page recomposition work:

1. Community / People / Activity
2. Logic & Awareness / Project 001

No unrelated Home content or entity semantics should change in this release.

## Files staged

- `home-v1.css` — deployment staging layer containing both approved block implementations.
- `home-v1-base-20260828.css` — preserved previous Home contract imported by `home-v1.css`.
- current production `index.html` — existing Home markup; no semantic rewrite required.
- `docs/homepage-refresh/README.md` — batch register.
- `docs/homepage-refresh/logic-awareness/README.md` — approved Logic & Awareness block contract.

## Community / People / Activity

Release state: READY FOR QA

Asset:
`/assets/ink/home-community-01.webp`

Expected behavior:
- surface `#F1E9D8`;
- no dark overlay, filter, opacity reduction or multiply blend;
- exactly one HTML/CSS caption layer;
- desktop: large illustration composition;
- mobile: `object-fit: contain`, full illustration visible, no crop;
- route `/community/`.

## Logic & Awareness / Project 001

Release state: ASSETS READY / READY FOR QA

Production CSS is staged against the existing `.dc-project` markup in the Home `index.html`.

Promoted production assets:
- `/assets/projects/logic-awareness/home/identity-pair-v2.webp`
- `/assets/projects/logic-awareness/home/secret-stamp.png`

The portrait production asset is an optimized WebP derived from the approved higher-resolution source `L_O_dementor(1).png`; it keeps the approved composition and dimensions while reducing delivery weight. The approved PNG remains the source-of-truth visual, not the binary served by the site.

Approved source fingerprints:
- `L_O_dementor(1).png` SHA-256: `e0008229169170fe0425983f97abe41968f93e7e8343535a97941944ac6b631b`
- `secret.png` SHA-256: `9d368effff256ffb96acf9bdc24bc994f77373a077a517c0c373336bb2a91d6e`

Asset existence was verified on the deploy branch after promotion. Do not substitute the older portrait pair or a raster screenshot of the complete block.

Expected behavior:
- desktop: two-column layout;
- breakpoint guards at 1350px and 1050px;
- title never overlaps the right identity rail;
- mobile: one continuous vertical flow;
- title stays inside viewport;
- portrait pair scales as a whole and is not cropped;
- route `/projects/logic-awareness/`.

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

Confirm:
- site integrity workflow;
- internal link validation;
- asset-path validation;
- visual contract validation where applicable;
- no unexpected change outside Homepage Refresh scope.

## Release gate

Binary-asset blocker: CLEARED.

Remaining gate: whole-Home QA + CI/checks. Do not merge to `dementor-club-site` until those pass. After QA passes, change status to `READY TO DEPLOY`, review the final diff against `dementor-club-site`, and merge as one coordinated release.
