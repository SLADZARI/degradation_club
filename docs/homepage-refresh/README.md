# Dementor Club — Homepage Refresh Batch

STATUS: DEPLOYMENT PREPARATION
DATE: 2026-08-28
BRANCH: `agent/homepage-refresh-batch-2026-08-28`
BASE: `dementor-club-site`
TARGET: one coordinated update of the Home page after final asset promotion and whole-Home QA

## Purpose

All approved Home-page visual/layout corrections are accumulated in this branch before one coordinated update of `dementor-club-site`.

Do not scatter Home block experiments across unrelated branches or merge them piecemeal into production. Approved blocks live here first, are checked together with neighbouring Home sections, and then ship as one batch.

## Source-of-truth order

1. `dementor-club` — approved meanings, copy, entities and public claims.
2. This homepage refresh batch — approved Home composition and implementation changes waiting for coordinated release.
3. `dementor-club-site` — production web implementation after the batch is accepted.

Existing assets are reused wherever an approved visual already exists. New binaries are promoted only when a block has been visually approved.

## Included now

### HOME / COMMUNITY ENTRY

Status: DEPLOY READY
Route: Home → `/community/`
Asset: `/assets/ink/home-community-01.webp`
Surface: `#F1E9D8`
CTA: one HTML/CSS layer only — `COMMUNITY / PEOPLE / ACTIVITY →`
Desktop: large illustration-led block with CTA over the image.
Mobile: preserve the whole illustration; `object-fit: contain`; no crop.
Forbidden: dark overlay, `mix-blend-mode:multiply`, filters, opacity reduction, raster CTA / duplicate caption image.

Implementation is already present in this branch through `home-v1.css`; the previous Home CSS contract is preserved as `home-v1-base-20260828.css` so the batch remains reversible.

### HOME / PROJECT / LOGIC & AWARENESS

Status: DEPLOYMENT PREPARED / ASSETS BLOCKED
Route: Home → `/projects/logic-awareness/`
Block contract: `docs/homepage-refresh/logic-awareness/README.md`
Reference markup: `docs/homepage-refresh/logic-awareness/index.html`
Reference styles: `docs/homepage-refresh/logic-awareness/logic-awareness-home-block.css`

Approved behavior:
- desktop two-column project block with separate identity rail;
- responsive guards at 1350px and 1050px so the title never collides with the identity rail;
- mobile becomes one continuous vertical composition;
- title remains fully inside viewport;
- identity portrait pair is shown whole and scaled, not cropped;
- latest approved higher-resolution portrait pair replaces the previous prototype asset;
- no new project claims or mechanics are introduced.

The production CSS implementation has now been staged in `home-v1.css` against the existing Home markup. It expects the approved binaries at:

- `/assets/projects/logic-awareness/home/identity-pair-v2.webp`
- `/assets/projects/logic-awareness/home/secret-stamp.png`

These two files are the only remaining release blocker for this block. Do not merge the batch until both paths resolve to the approved assets and whole-Home QA passes.

## Deployment preparation

Detailed checklist: `docs/homepage-refresh/DEPLOYMENT_PREP.md`

## Batch register

| Block | Status | Notes |
|---|---|---|
| Community / People / Activity | DEPLOY READY | CSS integrated; existing asset reused; mobile contain |
| Logic & Awareness / Project 001 | PREPARED / BLOCKED | CSS integrated; two approved binary assets must be promoted |

## Release rule

The batch is release-authorized only when:

1. both Logic & Awareness binary asset paths resolve;
2. desktop widths 1600 / 1440 / 1280 / 1024 are checked;
3. mobile widths 430 / 390 / 375 / 360 are checked;
4. Community artwork is never cropped on mobile;
5. Logic title never crosses the identity rail or viewport;
6. links resolve to `/community/` and `/projects/logic-awareness/`;
7. no duplicate raster CTA, overlay or old project composition remains visible;
8. the full Home rhythm is reviewed with neighbouring sections;
9. repository integrity checks pass;
10. the batch is merged to `dementor-club-site` as one coordinated release.
