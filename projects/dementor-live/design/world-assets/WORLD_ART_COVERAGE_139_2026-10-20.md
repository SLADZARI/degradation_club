# Dementor Live — World Art Catalog Coverage · 139/139
**Date:** 2026-10-20  
**Source:** legacy `SLADZARI/degradation_club`, PR #301 Batch 01 + descendant Batch 02  
**Target after verified import:** `SLADZARI/dementor_live/runtime/assets-source/world-art-batch02/` and `docs/legacy/design/world-assets/`  
**Status:** **G5 technical SVG candidates / G6 artistic and game/browser QA pending / G7 no production deploy**

## Honest coverage
Existing world-physical audit contains **139 entries**. Classification is now:
- **15** purely logical / geospatial records; no independent sprite required.
- **34** unique physical object IDs represented by **35** original ISO30 SVG candidates in PR #301 Batch 01 (stone DL-054 has two size variants).
- **90** further physical IDs represented by **90 independently authored ISO30 SVG candidates** in Batch 02: **49 previously missing**, **22 PNG-only**, **19 unapproved legacy SVG**.
- **21 separate state image candidates** for 7 buildings, stages 0, 1, 2. No stage mapping/approval implied.
- **125 individual base SVG** + **21 stage SVG** = **146 vector candidate files**, **124 physical IDs** + 15 logical entries.

All 90 Batch02 SVG have native transparent 512×512, no background extraction, no external cast shadow, flat muted cut-paper shapes and ISO30 graphic construction. Export 128/256 PNG by `runtime/tools/world-art-batch02/build_from_svg.py`.

### Machine-readable evidence
- [Batch 02 manifest](../../runtime/assets-source/world-art-batch02/manifest.json) · [full 139-entry crosswalk](../../runtime/assets-source/world-art-batch02/COVERAGE_139.json) · [21 state candidates](../../runtime/assets-source/world-art-batch02/STAGE_VARIANTS.json) · [QA summary](../../runtime/assets-source/world-art-batch02/QA.json).
- [Source folder with **90 SVG + 21 stage SVG**](../../runtime/assets-source/world-art-batch02/).
- [Full archive: 125 base SVG, 21 stages, PNG, local search gallery and QA (Google Drive)](https://drive.google.com/file/d/1LAJcIqOt-Mo1-brgCKOo7LcAISLnqF-O/view).
- [Contact sheet of 90 new images](https://drive.google.com/file/d/1NhAcbJE97KaFg1GRjpkVn5vD7D3AlzL8/view).

## Actual execution
- **PASS**: Batch02 90 safe standalone SVG XML; 180 RGBA transparent PNG 128/256; safe margins 90/90; 90 unique pixel images; 21 stage SVG and PNG; 139/139 audit rows accounted for.
- **PASS**: source SVG sha256 and PNG sha256 in manifest; no inline scripts/images/remote dependencies; documented asset IDs immutable.
- **PASS**: repeat local raster export by CairoSVG and Pillow, local `test_batch02.py` as available in toolchain.
- **NOT RUN**: real RC4 browser rendering, 2 simultaneous clients, occlusion/height/CU anchors, stable scroll/camera/zoom FPS, terrain seams with these props, iPhone Safari.
- **NOT RUN**: stage mapping to server authoritative `stage` values and actual plots/house interiors, runtime sprite loader/atlas selection, scene-specific collision and interaction.
- **PENDING**: human artistic review and distinction between conceptual/world art and exact deployed game image.

**This closes the known source-art inventory gap only. It DOES NOT prove that world graphics are fully implemented, approved or live.** Preserve original procedural Canvas until measured migration; do not mark missing textures as fixed in production prematurely.

## Integration gates before promotion
1. Take approved 20 Paper Cut UI icons and 17 DL-TERRAIN-01 SVG/atlas hashes as immutable baselines; forbid accidental replacement.
2. For every physical ID, derive screenshot anchor, ISO30 projection and authoritative footprint from real `world-footprints.mjs`/`local-geometry.mjs`; object z-order from the shared entity queue. Fix any blocked paths and user spawn traps.
3. Bind each building state to actual construction stages without modifying the save schema or player resources.
4. Test a disposable copy of city/plot/interior/exploration/Combat/UNIVERSE (isolated branches separately), scale and rendering at Chrome desktop and actual iPhone Safari, at least two players; verify 100/500/1200 terrain tiles and no hidden sprites.
5. Only merge/import after reviewed PR + exact SHA QA; VM cutover requires backup+restore copy, dry-run, no players, explicit owner GO and safe rollback of image and world volume.

**Never:** rewrite live `world.json`, reset volume, merge UNIVERSE drafts as production, mint new PAPER or change `DL-xxx` IDs because of image files.

## Follow-up: unique city houses, gardens and furniture · 2026-10-20

[Separate G6 acceptance, 46 new unique/staged SVG](UNIQUE_HOUSES_ISO30_G6_ACCEPTANCE_2026-10-20.md), [source and gallery](../../runtime/assets-source/world-art-unique-houses/README.md). This is a **supplementary 46-image candidate batch**, not a change to the **139/139 source coverage** accounting (the same physical objects, additional visual variants). New drawings do not add game entities, saves or completed-house state. Actual Cube Unit/occlusion tests and human art approval remain NOT RUN/PENDING. The 14 city structures do not yet replace the general `paperHouse()` renderer. Existing 20 v2 UI icons and 17 terrain SVG immutable.

### Уточнение v1.1 — 8 личных участков (20.10.2026)

Помимо 14 индивидуальных городских зданий, 11 грядок/скамеек/стульев/мебели и 21 рисунка строительных стадий, подготовлены **8 стабильных фасадов личной палатки** на `plot-1…plot-8`. Полный комплект: **54 SVG / 108 PNG**; [архив v1.1](https://drive.google.com/file/d/1-N4bkRh9JyxGI3o9jjWGUUroCmoqO-ZA/view) · [G6 критерии](UNIQUE_HOUSES_ISO30_G6_ACCEPTANCE_2026-10-20.md). Детерминированная функция в `../../runtime/assets-source/world-art-unique-houses/visual-variants.mjs` выбирает стиль по существующим `cityId` и `plotId`; **не вводить дополнительное поле в world.json**. PNG и SVG не подменяют действующий Canvas до art/CU/browser QA, не добавляют игрокам новые дома вместо палатки.
