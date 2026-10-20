# Dementor Live · SVG-FIRST Paper Cut Icons v1.0
**Style ID:** `DL-STYLE-PAPER-CUT-01` · **Rendering contract:** `DL-SVG-FIRST-1.0` · **Date:** 2026-10-20

## Canonical production decision
The editable **independent SVG** is the source of truth. The PNG is a **derived export**, never an independently generated or background-stripped image. Generate/draw one SVG per item from 2–4 large, matte, confidently hand-cut paper forms. Native canvas is transparent: `<svg viewBox="0 0 256 256">`, *no paper backdrop, shadow, outline, filter, image, backdrop rectangle or raster embedded in the SVG*. Do not derive SVG by tracing/cropping a poster. The world, hero and gameplay do not change.

The reference SVG-first package was **restored from** `Dementor_Live_Paper_Icons_v2_CLEAN_REVIEW.zip` and then tested with additional test SVGs + reproducible generation scripts. Download source/build/QA [**Dementor_Live_SVG_First_Canon_v1.zip (Google Drive)**](https://drive.google.com/file/d/1UskpdEQvSBGz-poBvzqdwsvgxOZVzl5e/view). The archive contains 20 individual previous SVG candidates and two independently drawn strict-control SVGs; it is **not automatically the approved in-game asset release**.

## Workflow (exact order)
1. Create one `source/svg/<item-id>.svg`; preserve game ID. Helper `python3 scripts/new_icon.py <id>` creates only an editable **draft**, not an accepted image.
2. Edit SVG to a recognizable **2–4-shape** children's primitive paper appliqué; each primary shape has `data-layer="1"…` and a muted palette fill: ochre `#C9965B`, terracotta `#B8654D`, sage `#81936B`, olive `#526C4D`, warm gray `#92938B`, water `#8CAFB5`, carrot `#D98146`, cream `#E7D8BA`.
3. Build tool checks safe vector XML, visible shapes, pure solid fills, alpha and safe margins. It **normalizes SVG geometry** without erasing a raster background or clipping pixels.
4. Rasterize independently: `python3 scripts/build.py --sizes 32,48,64,128,256`; tool generates `build/svg_rendered/<id>.svg`, transparent `build/png_<size>/<id>.png`, and `build/paper_atlas_<size>.png` using stable 5×4 game-ID ordering.
5. Run `python3 scripts/test_pipeline.py`, visually inspect SVG and thumbnail at 32/48/64px, then approve before installation. **Atlas is derived after individual icons pass QA.**

### Mac setup
```bash
unzip Dementor_Live_SVG_First_Canon_v1.zip
cd Dementor_Live_SVG_First_Canon_v1
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 scripts/build.py --sizes 32,48,64,128,256
python3 scripts/test_pipeline.py
open preview.html
```
If required by CairoSVG on a local Mac, install native `cairo` with Homebrew. Asset tool dependencies are NOT runtime server dependencies.

## Generation master prompt (SVG, NOT PNG)
> Design ONE unique icon for Dementor Live, ID **{ID}**, subject **{OBJECT}**, style `DL-STYLE-PAPER-CUT-01`. **Output valid editable SVG markup only** with root `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">`. Draw the whole item using **exactly 2–4 large matte cut-paper polygons or paths**, each with `data-layer` and solid fill from the canonical muted palette. Primitive children's handmade appliqué, with bold recognizable silhouette and smooth but slightly imperfect scissors-cut edges; slight inner layer overlaps allowed. A complete object centered in transparent space with at least 12% margin on all sides, understandable at 32px. **Absolutely no opaque or parchment background, drop/cast shadow, furry/torn/cropped outline, blur, filter, text, embedded image, gradient, black stroke, low-poly fold details, infographic, sheet, or extra object.** Return one SVG for one object, not PNG or poster. All PNG resolutions are rendered from this SVG afterward.

## QA evidence (actual local execution)
- 20 existing v2 clean SVG sources recovered unchanged.
- 2 strict test SVGs authored as independent vector originals: `TEST_ONLY_KEY` (**3 shapes**) and `TEST_ONLY_LAMP` (**4 shapes**), both automated **PASS**.
- 22/22 normalized SVG and transparent PNG exports at 32,48,64,128,256; 5×4 atlases build correctly.
- Repeat build produced **identical SHA-256** for all PNG 256 outputs. Transparent corners, antialiased margins and no XML scripting verified.
- Existing 20 pieces: **7 CANDIDATE**, **13 REWORK** (>4 primitives), **0 render failures**. None promoted to approved game icons by this check; old v2 SVGs preserve original design without silent changes. Test key/lamp are NOT inventory objects.
- This test is **technical**; user must visually approve shapes before replacing approved v1 images.

## Scope and storage
Canonical GitHub destinations once approved:
```
projects/dementor-live/runtime/assets/paper-cut-svg/source/svg/*.svg
projects/dementor-live/runtime/tools/paper-cut/{build.py,test_pipeline.py,new_icon.py}
projects/dementor-live/runtime/public/assets/paper-icons/{id}.png
projects/dementor-live/runtime/public/assets/paper-icons/paper_atlas_64.png
```
Until the binary assets and source SVGs are actually imported and checked in each game branch, document status as **PACKAGE READY / REPOSITORY IMPORT PENDING**. Do not claim production or local server updated. Existing 20 ID gameplay contract is still controlled by [PAPER_CUT_UI_ICON_CANON_v1.md](../PAPER_CUT_UI_ICON_CANON_v1.md).

**Important:** the earlier image-generation prompt produced mistaken style posters in two tests and does not replace the successful SVG-based authoring pipeline. Future icons are vector-source-first.
