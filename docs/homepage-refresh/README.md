# Dementor Club — Homepage Refresh Deploy Pack

STATUS: DEPLOYMENT PREPARATION
DATE: 2026-08-28
BRANCH: `agent/homepage-refresh-deploy-2026-08-28`
BASE: current `dementor-club-site` at commit `48bdf22484cf96325d7395e03c41a71ef08fd9fb`
TARGET: one coordinated update of the Home page after final asset promotion and whole-Home QA

## Purpose

This branch is the deployment-safe continuation of the Homepage Refresh work. It was recreated from the latest `dementor-club-site` baseline because the earlier working batch had diverged from production.

Do not merge the older `agent/homepage-refresh-batch-2026-08-28` branch directly. Use this deploy branch for final QA and release.

## Included blocks

### HOME / COMMUNITY ENTRY

Status: DEPLOY READY
Route: Home → `/community/`
Asset: `/assets/ink/home-community-01.webp`
Surface: `#F1E9D8`
CTA: one HTML/CSS layer only — `COMMUNITY / PEOPLE / ACTIVITY →`
Desktop: large illustration-led block with CTA over the image.
Mobile: preserve the whole illustration; `object-fit: contain`; no crop.
Forbidden: dark overlay, `mix-blend-mode:multiply`, filters, opacity reduction, raster CTA / duplicate caption image.

### HOME / PROJECT / LOGIC & AWARENESS

Status: DEPLOYMENT PREPARED / ASSETS BLOCKED
Route: Home → `/projects/logic-awareness/`
Block contract: `docs/homepage-refresh/logic-awareness/README.md`

Approved behavior:
- desktop two-column project block with separate identity rail;
- responsive guards at 1350px and 1050px so the title never collides with the identity rail;
- mobile becomes one continuous vertical composition;
- title remains fully inside viewport;
- identity portrait pair is shown whole and scaled, not cropped;
- latest approved higher-resolution portrait pair replaces the earlier prototype asset;
- no new project claims or mechanics are introduced.

Production CSS is staged in `home-v1.css` against the existing Home markup.

Required production binaries:

- `/assets/projects/logic-awareness/home/identity-pair-v2.webp`
- `/assets/projects/logic-awareness/home/secret-stamp.png`

These two paths are the only remaining release blocker for the Logic & Awareness block.

## Deployment structure

- `home-v1-base-20260828.css` — exact Home CSS from the current production baseline.
- `home-v1.css` — imports that baseline and adds only the approved Community + Logic overrides.
- `index.html` — inherited unchanged from current `dementor-club-site`; existing markup already supports both block compositions.
- `docs/homepage-refresh/DEPLOYMENT_PREP.md` — final QA and release gate.

This layering keeps the release reversible and avoids overwriting unrelated production changes made after the first working batch was opened.

## Batch register

| Block | Status | Notes |
|---|---|---|
| Community / People / Activity | DEPLOY READY | Existing asset reused; CSS integrated; mobile contain |
| Logic & Awareness / Project 001 | PREPARED / BLOCKED | CSS integrated; approved portrait pair + stamp binaries still need promotion |

## Release rule

The deploy pack becomes `READY TO DEPLOY` only when:

1. both Logic & Awareness binary paths resolve;
2. desktop widths 1600 / 1440 / 1280 / 1024 are checked;
3. mobile widths 430 / 390 / 375 / 360 are checked;
4. Community artwork is never cropped on mobile;
5. Logic title never crosses the identity rail or viewport;
6. links resolve to `/community/` and `/projects/logic-awareness/`;
7. no duplicate raster CTA, dark overlay or old project composition remains visible;
8. the full Home rhythm is reviewed with neighbouring sections;
9. repository integrity checks pass;
10. this branch is merged to `dementor-club-site` as one coordinated release.
