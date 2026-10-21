# Dementor Live · G6 isolated unique-house rendering · 2026-10-21
**State:** BUILD / QA-DRAFT. **Source:** legacy PR #307 exact initial SHA `50bfaed3c270597fb53189650f6570237309df17`. **This branch:** `qa/dementor-live-iso30-g6-render-preview-20261021`. **Target:** existing source→target mapping in `SLADZARI/dementor_live` PR #27; do not cut over until verified import.

## Implemented in the G6 preview branch
- Strictly read-only, allowlisted routes `/__art-g6/{asset-id}.svg`, available **only** when the game is started with `--test` **AND** `DEMENTOR_ART_G6=1`. No route or JS injection in ordinary/prod launch.
- Source is one of **54 existing individual ISO30 SVG candidates** from `assets-source/world-art-unique-houses/source/svg/`. Not a cutout from a sheet; no changes to files, hero, economy, CharacterId or world save schema.
- Browser `world-art-g6.js` loads a whitelisted subset of 10 city structures. It computes actual nontransparent alpha bounds once per file and draws only for **QA**, with procedural fallback if loading is incomplete/blocked.
- `?artG6=compare`: draw annotated candidate adjacent to existing procedural building without replacing its gameplay representation.
- `?artG6=replace`: temporarily draw the candidate in the **existing shared entity depth queue**; only this test browser sees substitution.
- Current mappings: tool shop, garden shop, completed seed shop, warehouse, tourist kiosk, museum gate, university preview, Robo stadium preview, industry preview, farlands gate. No art conversion into new world objects. For seed shop, only a **completed** construction can be swapped; incomplete builds continue displaying the existing stage.
- **No** newly created houses, construction stages, plot ownership changes, collision changes, rights changes, inventory or paper payments. Approved 20 v2 UI icons and 17 terrain tiles untouched.

## Reproducible temporary QA launch (Mac/operator ONLY, no live world)
```bash
cd /path/to/your/check-out/projects/dementor-live/runtime
npm run test:art-g6
# DO NOT point the state variable at the real production or local world.json:
tmp_dir="$(mktemp -d)"
DEMENTOR_PORT=4184 DEMENTOR_STATE="$tmp_dir/g6-world.json" DEMENTOR_ART_G6=1 node server.mjs --test
```
Open `http://127.0.0.1:4184/?artG6=compare`, then `?artG6=replace` in a separate tab/browser. A normal non-test launch must not enable G6. The test server saves only in the temporary directory. The SVG URL must be 404 when not started in test+flag mode. These are preview-only images; temporary appearance does not approve 54 assets.

## Acceptance measures — distinguish intended from performed
| Gate | Evidence required | Status |
|---|---|---|
| Source manifest 54/54 / SHA-256 / untrusted SVG markup blocked | `npm run test:art-g6` | TEST IMPLEMENTED; workflow outcome pending |
| Default release unaffected | `--test` plus opt-in env gate, no save/geometry changes | CODE INSPECTION PASS; full regression pending |
| 10 mapped existing world structures, seed-stage gate | Static mapping and snapshot reference | CODE INSPECTION PASS; real visual screenshots pending |
| Exact artwork anchor/footprint in Cube Units | Compare 3 reference zooms against authoritative scene; doors/hitboxes anchored | NOT RUN |
| Shared ISO30 z-sort and overlap | Test 2 clients with occluded character and props, camera pan | NOT RUN |
| Grid local plots, eight tent variants | Real `homeVisual.tent=0..3`; no variant as new entity | NOT IMPLEMENTED in preview (deliberate) |
| Beds/bench/chair crops and construction stages | Connect only to actual stages `forge.stage`, `seedMarket.stage`, `gardenProject.stage`, `home.tent` | NOT IMPLEMENTED; do not invent stages |
| Chrome and physical iPhone Safari, FPS | Real screenshots at 32/64/128, scale + DPR, 2 independent players | NOT RUN |
| Production switch | Art approval + exact SHA CI + safe backup/rehearsal + explicit owner GO | BLOCKED; NOT DEPLOYED |

## Known blockers
The source PNGs have differing transparent margins and shape proportions. Alpha cropping is QA convenience, not proof of correct `footprint_CU` or depth. The preview width is provisional; **do not merge the QA renderer into release without visual/CU measurements**. Interior/plot movement currently uses a different projection in portions of RC4; ISO30 parity requires its own code and player QA rather than hiding the defect by changing icons.

The existing stage images for tool shop, warehouse and mayor tent remain concepts: these structures do not implement construction stages that can be safely inferred. Different styling for the 8 private tent plots is determined by `visual-variants.mjs`, without storing new fields, but these files are still candidate assets, not a new residential house feature.

## Next
Run `npm run test:art-g6` and full model regression on the **exact G6 PR SHA**; verify the QA routes through real HTTP on a disposable state; collect two-player and physical iPhone screenshots; measure exact sprite anchors/entry footprints; review all 54 drawings individually; extend only authentic stage/bed/furniture mapping; record G6 result in existing dedicated `dementor_live` handover PR #27. Do not merge source batch #307, #303, or RC4 based on source-only tests.

## G6 continuation — exact projected foot anchor, benches, authentic states (2026-10-21)

**Build / QA ONLY** on existing [Draft PR #312](https://github.com/SLADZARI/degradation_club/pull/312). No separate approved release, no merge, no production activity. Preserve source PR #307 and RC4.

Changes beyond the initial 10-building comparison:
- `DLWorldArtG6.footprintLayout` derives the **projected ground diamond from four existing world corners** and uses the southern (+X,+Y) vertex as visual foot anchor. The width follows projected CU, never a sprite's alpha-defined collision. This is a deterministic **candidate placement**, not a confirmed artistic/collision calibration.
- Forge has **real server stages 0/1/2/3** and corresponding three stage candidate SVG plus finished `city-forge`; seed-market has **only real stage 0/1** and does not display unused concept stages 1/2. Unknown stages return null and fall back to procedural Canvas.
- In the city square, two existing benches use `drawGroundProp` inside the **shared entity z-sort** with players, only when QA art is enabled. The ordinary renderer remains intact.
- For plot scenes, bed previews follow **actual `bed.crop, bed.watered, bed.readyAt`**. Because plot/interior screen projection currently differs from city ISO30, bed art is shown **comparison-only**, not substituted. The owner/permissions, crop stage, harvest and map are unchanged.
- Eight completed personal tents use the exact deterministic algorithm from `visual-variants.mjs` based on existing cityId/plotId. **Only stage 3 completed** appears in `?artG6=compare`. Tent construction stages 0–2 continue procedural and do not become new buildings.
- Geometry test `npm run test:art-g6:geometry` measures ISO30 footprint extent against `tan 30°`, anchor under multiple zooms, valid forge/seed transitions, bed crop variants and eight city-stable plot designs. In addition `test:art-g6`, `test:art-g6:http`, baseline `check`, `test` are required.

**Still NOT RUN:** pixel-perfect sprite/door/footprint calibration from actual browser screenshots, interactive two-client player occlusion, Safari physical iPhone, performance/fps and plot/interior ISO30 parity. Ground and personal plot figures must not be marked APPROVED from mathematical tests alone. Full release remains blocked until owner art signoff and independent G7 evidence. The real world save and 20/17 protected approved image sets are untouched.

## G6 continuation — rectangular footprints and real interior chest (2026-10-21)

**Important correction to the earlier provisional anchor above:** The +X,+Y projected vertex is **not** the horizontal center for rectangular ISO30 footprints. For a `w×h` CU diamond, the x-difference between the diamond center and the south vertex is `(h−w)·unit·cos(30°)/2`. Test-only `footprintLayout` now preserves the southern vertex for diagnostics, and positions the candidate **horizontally at the projected diamond centroid**, vertically at the south vertex's y. The compare overlay shows a red southern vertex, a blue visual anchor and their connection. **This corrects a mathematical offset but does NOT certify a hand-measured pixel/door anchor.** Dedicated 4×3, 2.6×2, 6×5, zoom×2, and square-CU assertions added to `test/world-art-g6-geometry.test.mjs`.

**Real interior object coverage:** The current interior contains a procedural chest and bed but **does not contain game-world chair entities**. Added `interior-chest` to the QA allowlist and a compare-only chest preview alongside the existing chest in `public/life-ui.js`. The orthographic plot/interior projection remains unchanged; no replacement is permitted, and no chairs, furniture purchases, hitboxes or room schema are invented. The project therefore still needs a separate architecture-approved ISO30 parity fix before interior sprite substitution.

**Test status:** Automatic G6 SVG, geometry and disposable-world HTTP tests plus baseline game checks run via the exact-SHA CI workflow. Pixel alignment, art review, two actual user/browser clients, physical iPhone and realistic FPS still require operator/browser QA. The 20 locked UI icons and 17 terrain tiles were not modified.

**Next gate:** browser G6 `compare` screenshot for asymmetric houses/forge/benches/interior chest at 0.65×, 1×, 2×, and desktop+mobile DPR, collect footprint/door and actor occlusion discrepancies, fix derived anchors without touching server geometry, and only then consider additional real furniture connections.
