# Home Refresh — 2026-08-28

Status: WORKING STAGING PACKAGE
Target branch for final integration: `dementor-club-site`
Working branch: `home-refresh-2026-08-28`

## Release rule
All homepage block changes are developed and approved here first. Nothing from this package is considered production-ready until the whole homepage refresh is reviewed and merged in one release.

## Workflow
1. Build standalone HTML mockup.
2. Review locally / visually.
3. User approves the composition.
4. Convert the approved mockup into Dementor Club production classes/tokens/assets.
5. Add the block to this staging package.
6. When all homepage blocks are approved, merge/publish them together to PROD.

## Asset rule
Reuse existing repository assets whenever possible. Do not regenerate or duplicate existing images simply to rebuild a block.

## Blocks

### 01 — Community / People / Activity
Status: APPROVED / STAGED
Route: `/community/`
Asset: `/assets/ink/home-community-01.webp`
Surface: `#F1E9D8`
Mobile: full illustration visible (`contain`), no crop.
CTA: one HTML/CSS overlay only.

### 02 — Logic & Awareness
Status: MOCKUP IN DEVELOPMENT
Route: `/projects/logic-awareness/`
Primary existing asset: `/assets/projects/logic-awareness/cover.webp`
Project source remains `logic-awareness`; this homepage block only references the approved project.

## Production gate
Do not move individual visual changes from this package to PROD one-by-one. Publish only after the homepage block set is approved as a whole.
