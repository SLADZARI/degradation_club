# Dementor Live · Unique houses, garden beds, benches and interior furniture — G6 acceptance gate

**Date**: 2026-10-20 · **Status**: G5 SOURCE TESTED / G6 ART AND RUNTIME NOT APPROVED / G7 NOT DEPLOYED.

## What is covered in addition to PR #301 + PR #303

14 independently authored architecture and scene-entrance SVG candidates: `tool-shop`, `garden-shop`, `seed-market`, `warehouse`, `forge`, `tourist-kiosk`, `museum-entry`, `university-site` (preview), `robo-stadium-site` (preview), `industry-site` (preview), `farlands-entry`, temporary city mayor tent, individual private tent, public-garden pavilion. Each has its own roof, silhouette, distinctive facades and selected details; a common paper geometry system alone does not imply the same graphic design.

8 additional unique plot-tent SVG facades (`plot-1..8`): deterministic for `origin`, rotated per-city from a stable hash of `cityId` while preserving distinct styles for all eight local plots; no randomness on restart. Tested by `node --test test-visual-variants.mjs`.

11 furniture/landscape SVG candidates: five different garden-bed states (empty, seeded, hemp, carrot, ready), two benches (park, garden), two chairs (wood, sage), table and chest. The `garden-bed`/`chest` footprint is based on GRID-02 local geometry; other furniture must be measured before gameplay binding. Five bed graphics are illustrative: actual gameplay has watered and ripe state which the renderer must read from the authoritative server state, not a sprite's decorative appearance.

21 additional **candidate** construction-state SVG for 7 site types: 0=floor markings, 1=framing, 2=partial structure. Some structures have NO build-state machine in RC4 (e.g. warehouse, tool shop, mayor tent); those pictures are **concept-only**, not to be displayed by inventing a `stage`. Correct final shape is separate base SVG. The actual `state.forge.stage`, `state.seedMarket.stage`, `state.gardenProject.stage` and `home.tent` need individual mapping tests.

## Canon

1. ISO30 world style `DL-ISO30-PAPER-WORLD-01`: matte hand-cut large layered paper forms; the projection helper's ground axes use `tan 30°` exactly; color palette inherited from paper world; no faked outside drop shadows, no text or background inside the SVG.
2. Existing 20 approved Paper Cut v2 UI icons and 17 `DL-TERRAIN-01` SVG are immutable.
3. Object identity stays stable: `game_id` and `cityId/plotId` are persistent, roof/facade variant must be derived deterministically and never rerolled after restart; art cannot change character ID, wallet, land, save schema or server authority.
4. Distinguish 3 bounds per object: physical footprint, visible sprite and screen depth/anchor. **NO** collision derives from PNG opacity; `world-footprints.mjs` and `local-geometry.mjs` prevail.
5. City, plot and interior use the same ISO30 camera and movement contract; entrance/exit and 45° screen-relative movement remain compatible.
6. Do not introduce residential houses not yet supported in gameplay. A personal plot supports `home.tent` 0–3; `plot-personal-tent.svg` is a candidate appearance for that existing object, not a new building purchase.

## Concrete acceptance matrix

| Test | Threshold/evidence | Current state |
| --- | --- | --- |
| Source completeness | 54 independently editable SVG / 14 structure types / 8 stable plot facades / 11 props / 21 stage candidates | **PASS** |
| Asset format & safety | 54 valid XML `viewBox 512` and 0 external resource / script / filter | **PASS** |
| PNG renderer | 54 × 2 RGBA outputs, 256px and 128px | **PASS** |
| Transparency & crop | Four transparent corners, >= 8px margin at 256px | **PASS** |
| Determinism | Raster regeneration hashes identical from same SVG and version | **PASS** |
| Distinctness | No byte-identical RGBA candidate images across 54 asset IDs | **PASS** |
| 30° base projection | `atan(d/w) = 30.000°` for common ISO30 building base function | **PASS FOR BASE GENERATOR**, complex silhouettes need manual perspective review |
| Visual signoff | All 54 visually approved per-owner in gallery, shapes/details checked at 64/128 px | **PENDING** |
| Full physical geometry | Each existing `objectId` mapped to authoritative W,D,H Cube Units + foot anchor + ordered depth, including obstacles, doors | **NOT RUN** |
| Runtime mapping and staging | Actual 0/1/2/finished state mapping for staged structures only; no built house on unbuilt plot | **NOT RUN** |
| Rendering layering | Tile beneath bed/furniture; player occluded according to shared Z; no sprites inside structure | **NOT RUN** |
| Two-player/stress/mobile | Two browsers, 100/500/1200 terrain tiles, 60 Desktop FPS and >=30 mobile FPS targets, physical iPhone Safari | **NOT RUN** |
| Safe production migration | exact SHA CI PASS + backup/restore copy + owner GO + rollback, no live world reset | **NOT RUN** |

## Known blockers to FINAL ACCEPTANCE

- 22 architecture variants (14 types + 8 plot facades) are not yet approved per-image by owner. Drawing a separate vector is not an acceptance event.
- Neither 54 new PNG nor SVG are currently bound to RC4 runtime Canvas. Existing generic `paperHouse()` still renders the city.
- Visual anchor, overlap, occlusion and CU height are not measured from the actual game/camera on real clients.
- Client should show procedural Canvas fallback until dedicated feature PR passes all validations.
- Isolated MentalHumor, Obitel, CAVE and GRID-02 scenes have independent PRs; this source set does not imply their game feature deployment.

## Change policy

Store this as a separate Draft asset candidate stacked on PR #303. Existing RC4 `970882dee4bf55fe2ab143c0c9e791e79c353e43` remains frozen and not deployed by this task. No changes to `world.json`, backup, economy, hero, terrain atlas or v2 CLEAN icons.

## Source, links, and release decisions

- **54 SVG editable sources**: [source folder](../../runtime/assets-source/world-art-unique-houses/) · [machine manifest](../../runtime/assets-source/world-art-unique-houses/manifest.json) · [stable visual plot IDs test](../../runtime/assets-source/world-art-unique-houses/test-visual-variants.mjs).
- [ZIP, 54 SVG / 108 PNG, GALLERY.html and QA](https://drive.google.com/file/d/1-N4bkRh9JyxGI3o9jjWGUUroCmoqO-ZA/view) · SHA-256 `b1ba875bf5046e0286463abf2002723d72a39c416263f1944e3a7fe2fd47ffa7`.
- This remains a stacked Draft PR on #303 (base initial SHA `5eb058d3a9a7471e8ef804be2954eb0603ed9c5c`), *not* an import into RC4. The exact JS plot variant test **PASS**: origin plot-1..plot-8 distinct, other cities stable 8-per-city, and deterministic after restart.
- Chromium local gallery smoke **BLOCKED** by `ERR_BLOCKED_BY_ADMINISTRATOR`; don't claim browser PASS. Final art approval and Cube Unit anchor/depth QA NOT RUN.
