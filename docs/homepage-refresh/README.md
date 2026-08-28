# Dementor Club — Homepage Refresh Batch

STATUS: working integration batch
DATE: 2026-08-28
BRANCH: `agent/homepage-refresh-batch-2026-08-28`
BASE: current `dementor-club-site` state at the moment the batch was opened
TARGET: one coordinated update of the Home page after all blocks are reviewed and approved

## Purpose

All current Home-page visual/layout corrections are accumulated in this branch and this folder before the next coordinated update of `dementor-club-site`.

Do not scatter new Home block experiments across unrelated branches or merge them piecemeal into production. Each approved block should be added here first, checked together with neighbouring Home sections, then merged as one batch.

## Source-of-truth order

1. `dementor-club` — approved meanings, copy, entities and public claims.
2. This homepage refresh batch — approved Home composition and implementation changes waiting for coordinated release.
3. `dementor-club-site` — production web implementation after the batch is accepted.

Existing assets should be reused wherever the approved visual already exists. Do not regenerate artwork merely because a block is being recomposed.

## Included now

### HOME / COMMUNITY ENTRY

Status: APPROVED FOR BATCH
Route: Home → `/community/`
Asset: `/assets/ink/home-community-01.webp`
Surface: `#F1E9D8`
CTA: one HTML/CSS layer only — `COMMUNITY / PEOPLE / ACTIVITY →`
Desktop: large illustration-led block with CTA over the image.
Mobile: preserve the whole illustration; `object-fit: contain`; no crop.
Forbidden: dark overlay, `mix-blend-mode:multiply`, filters, opacity reduction, raster CTA / duplicate caption image.

Implementation already present in this branch through `home-v1.css`; the previous Home CSS contract is preserved as `home-v1-base-20260828.css` so the batch remains reversible while other blocks are added.

## Batch workflow

For every next Home block:

1. inspect current production block and existing assets;
2. confirm approved content from `dementor-club`;
3. reuse existing image/assets where possible;
4. assemble desktop + mobile composition in this branch;
5. record the decision in this file or a block-specific file under `docs/homepage-refresh/`;
6. test the whole Home page, not the block in isolation;
7. only after the batch is complete, merge/update `dementor-club-site` in one coordinated release.

## Planned batch register

| Block | Status | Notes |
|---|---|---|
| Community / People / Activity | APPROVED | Implemented in batch; existing asset reused |
| Other Home blocks | PENDING REVIEW | Add here as they are approved |

## Release rule

The batch is complete only when desktop/mobile composition, neighbouring block rhythm, links, existing assets, accessibility and visual regressions are checked together. Individual block approval does not by itself authorize a piecemeal Home release.
