# Dementor Live · Уникальные городские здания и мебель · ISO30 / QA Batch 03

**Source base:** legacy `degradation_club` PR #303 (stacks on #301), independently from locked RC4. **Status:** G5 SVG/PNG TESTED; G6 ART/GEOMETRY NOT APPROVED; G7 NOT DEPLOYED.

## Contents

- **14** visually differentiated architectural structures and site-gate candidates, including shop/tool/seed/garden, warehouse, forge, visitor kiosk, museum entrance, future university/arena/industry site, farlands gate, two distinct temporary/personal tents and garden pavilion.
- **8** distinct personal-plot tent variants, one stable design per plot-1..8 in the existing city; for another city the 8 designs rotate deterministically according to cityId; no extra saved field.
- **11** detailed 2D ISO30 assets: five garden-bed growth states, two benches, two chairs, table, chest.
- **21** staged drawings across seven referenced object types: conceptual foundation/frame/partially enclosed, with distinct silhouettes. **Not all seven objects have server-side construction stages; these images MUST NOT be bound to runtime stages until the actual state machine is mapped.** For forge/garden/seed shop the state must be inspected at exact RC4 SHA; for tool shop, warehouse, mayor tent conceptual variants are documentation only.
- **54** independent transparent 512×512 SVG, **108** PNG at 256/128, browsable `GALLERY.html`, SHA manifest, visual review export, QA gates.

## Existing canon kept

`DL-ISO30-PAPER-WORLD-01`: matte cut-paper faces, paper-flat distinct planes, muted tone, no cast shadows, editable standalone SVG; horizontal ground axes ±30°. `DL-GRID-01 / GRID-02`: one movement/footprint/depth contract across city/plots/interiors. `DL-STYLE-PAPER-CUT-01`: UI inventory icon-only style kept separate. The 20 approved Paper Cut v2 CLEAN icons and 17 DL-TERRAIN-01 tiles remain immutable.

**No new houses or money:** Personal plot currently builds a three-step tent, not a separate finished private house. No new residential entity, plot variant, save field, currency, collision shape or room footprint is introduced by SVG candidates.

## Exact QA method

`python3 build_unique_world_house_set.py` (local generator source) then `python3 finalize_unique_houses.py` to check deterministic raster, alpha-safe 8-pixel margins, identity and 30 degree base projection. In `GALLERY.html`, review each 54 source images, mark APPROVED/REWORK and export JSON. `qa/ACCEPTANCE_GATES.json` records explicit gate criteria and NOT RUNs. Do not treat this technical pass as a visual or game release pass.

## Correct in-game future wiring

Authoritative game IDs are in `manifest.json`; never replace a unique ID with a random style at runtime. For a multi-city system, derive any design variation deterministically from existing `{cityId}:{objectId}` and its construction state. Use actual `world-footprints.mjs`, `local-geometry.mjs` and game state for footprints & depth; **a PNG's bounding box never defines collision**. Put ground tiles and beds below structures, furniture in shared z-sort with residents. Verify real 64/128/256px render, entry/exit doors and no edge clipping. Preserve prior approved house render as fallback until QA and explicit implementation decision.

**Do not publish from this pack or deploy to VM by itself.**
