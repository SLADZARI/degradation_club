# Dementor Live · World Art Coverage 139/139 · batch 02

**20.10.2026 · TECHNICAL SVG SOURCE COVERAGE, NOT ART/GAME-RELEASE APPROVAL.**

## Scope and parent
- Parent: `feature/dementor-live-visual-asset-gap-batch01-2026-10-20`, PR #301, with 35 world SVG candidates.
- This batch: **90 separately authored vector artworks**, mapped to the 49 historical missing, 22 former PNG-only, and 19 former unapproved SVG source entries.
- A strict crosswalk lists **139 audited registry records**: 90 candidates in this batch, 34 distinct IDs from batch 01 (35 assets, including two stone sizes for the same DL-054), and 15 logical records requiring no independent sprite.
- Additional **21 state illustrations** for seven legacy structures, 3 separate construction states each. These require mapping to authoritative server stages.
- Assets are vector-first, transparent SVG viewBox 512, paper cut ISO30 concept illustrations, 2–8 flat layers + useful details, no external drop shadows, no raster background subtraction.
- 180 raster previews from these 90 SVG sources (256/128) and 21 stage preview PNG; no approved UI icon or DL-TERRAIN-01 texture changed.

## What is not done
This is **not** a verified production world art pass. Each illustration must still be reviewed for silhouette/style, physical Cube Units footprint, visual anchor/depth at 30° projection, collision overlap and z-order. The 21 stage images need a real `stage → image` contract aligned to existing stage IDs. Isolated UNIVERSE/MentalHumor/CAVE/OBITEL sources remain separate from CIVIC RC4, and no gameplay feature is unlocked merely by drawing an icon.

No image swap on VM, player property, wallets, world.json, save schemas, 20 canonical UI icons or 17 approved terrain SVGs. All artwork remains `CANDIDATE_NOT_APPROVED`.

## Build and QA
`python3 -m pip install cairosvg pillow`
`python3 tools/build_from_svg.py`
`python3 test_batch02.py`
`GALLERY_125.html`: available when extracting the combined archive with both batch01 and batch02 directories adjacent.

## Release gates
1. Validate all original IDs, audit mapping, 90 standalone SVG and alpha-safe 128/256 PNG and 21 stage candidates.
2. Owner visual approval with per-image REWORK/APPROVED, do not blindly replace Canvas assets.
3. Measure per-object world anchors, footprints and axes in actual RC4 scene. Avoid false depth and blocked doors, walkable mountain trails, plot boundaries and interior furniture.
4. Test old 20 icon hashes, 17 terrain atlas hashes, save restore on a disposable copy, 2 players, browser zoom, iPhone Safari and full desktop/mobile smoke.
5. Release staging exact SHA with backup+dry-run and owner's explicit GO; never reset production world.

*STATUS: CANDIDATE SOURCES CREATED / ART REVIEW PENDING / RUNTIME MAPPING NOT RUN / PRODUCTION NOT DEPLOYED.*
