# DEMENTOR LIVE — Paper Cut Appliqué
**Style ID:** `DL-STYLE-PAPER-CUT-01`  
**Revision:** `1.0 / prompt specification`  
**Scope:** icons, inventory, pictograms, compact visual illustrations and paper details in the UI.  
**Status:** **STYLE CONTRACT LOCKED** (form, color and technical constraints); each newly generated image is a **CANDIDATE** until visual QA.  
**Approved silhouette references:** original Paper Cut Pack 01 + Pack 02 sheets. **DO NOT** use the damaged background-removed v1 sprites as templates; their clipped edges are a rejected extraction artefact. Standalone v2 clean icons are REVIEW candidates, not a wholesale replacement of approved icons.

## What this style means
A playful but restrained children's hand-scissored paper appliqué: an object recognisable from a few clean, flat pieces of colored cardstock. Hand-made confidence, elegant accidental asymmetry; **not** a low-poly mesh, not origami folding, not collage made of dozens of pieces. The icon must plausibly be cut with scissors in one minute.

### Absolute constraints
1. **2–4 primary visible paper layers** per icon. Each layer is one coherent cut silhouette. Details come from overlapping pieces, never micro-polygons. If a recognizable object requires more than four layers, simplify its details rather than increasing layer count.
2. **Scissor cuts:** deliberate and smooth, subtly irregular; no torn, gnawed, furry, jagged or frayed edges; no accidental spikes, edge halos, automatic cutout residues or clipping.
3. **Color:** strictly from the muted Dementor palette below, with subtle same-hue variations for internal layer differentiation. Low-to-medium saturation and soft contrast. No neon, saturated red/yellow/blue, black outlines, glossy or metallic highlights.
4. **Shading:** **no external cast/drop shadow whatsoever**. Depth only from darker inner paper layers or very slight inner shading constrained fully inside the opaque silhouette. A shadow halo outside the alpha edge is a failure.
5. **Canvas:** generate **each icon individually** on a *truly transparent RGBA canvas from the start*. Do not render a poster or paper background to later erase it; no background, checkerboard pattern, pedestal, vignette, border, caption, lettering, watermark or label.
6. **Composition:** one centered whole object, no crop, no touching borders. Preserve a clear transparent margin of **at least 10–12%** on each side. Silhouette remains readable at **32, 48 and 64 px**.
7. **Angle:** mostly frontal/flat graphic reading, slight artistic tilt allowed; no perspective foreshortening, ISO30 volume or photorealistic camera.
8. **Uniqueness:** preserve each intended object's recognizable silhouette and stable game ID. Do not invent consumables or world objects. Preserve existing hero and world graphics unchanged.
9. **Layer color blocks:** clean matte fills; restrained paper surface character permitted **inside shapes only**, never external paper fibers or artificial noise around the edge.
10. **One output = one icon.** Produce source 256×256 or 512×512 with alpha; export separately at 256 and 64 px. Assemble atlas **after** the individual assets pass QA, never derive individual icons by cropping a montage.

## Canonical color library
| Role | HEX |
|---|---|
| warm ochre / wood | `#C9965B` |
| terracotta / soft red | `#B8654D` |
| sage green | `#81936B` |
| deep olive green | `#526C4D` |
| warm stone gray | `#92938B` |
| muted water blue | `#8CAFB5` |
| muted carrot orange | `#D98146` |
| cream paper / light facets | `#E7D8BA` |

Allow a controlled lighter/darker variant of these values for the 2–4 internal layers, not entirely unrelated hues. Color hierarchy is stronger than detailed texture.

## Reusable image generation prompt (EN — COPY AS-IS)
> Create **ONE** standalone inventory icon depicting **{OBJECT}** for the 2D game Dementor Live, visual style ID **DL-STYLE-PAPER-CUT-01**.  
> An elegant, childlike handmade **scissor-cut paper appliqué**, deliberately primitive but confidently designed. Construct the entire recognizable object from **exactly 2 to 4 large flat matte colored cardstock shapes**. Visible slightly imperfect hand-cut curves and corners, but **clean continuous edges**, not torn or frayed. Distinct layers overlap simply; restrained inner color variation creates depth **within the silhouette only**.  
> Muted low-contrast palette only: ochre #C9965B, terracotta #B8654D, sage #81936B, dark olive #526C4D, warm gray #92938B, dusty blue #8CAFB5, soft orange #D98146, cream #E7D8BA. Use the smallest subset appropriate for **{OBJECT}**; colors should be dusty, warm and gentle, never bright.  
> **A single completely isolated full object on a truly transparent RGBA background**, centered with at least 12% empty transparent margin on every side. Flat front-on graphic, legible at 32 pixels, no unrelated objects. Output one separate square image, ideally 512×512, ready to export as transparent PNG.  
> **No background, no paper backdrop, no checkerboard painted into the image, no outside cast shadow, no glow, no drop shadow, no external edge halo, no furry fibers, no ragged or bitten edges, no outlines, no black border, no high-contrast polygon facets, no origami crease network, no 3D rendering, no gradient, no excessive texture, no letters, no labels, no icon sheet, no montage.**

### Fill in `{OBJECT}` carefully
Use physical features sufficient for recognition in 32px, not a complex photorealistic inventory item. Examples: "an old-fashioned key: cream ring, ochre shaft, one terracotta tooth" or "a simple oil lamp: muted gray base, ochre body, cream window, tiny terracotta inner flame".

## Negative prompt (where separately supported)
`opaque background, parchment background, contact sheet, montage, multiple assets, outside shadow, cast shadow, drop shadow, ground shadow, checkerboard, rough cutout, alpha fringe, grain outside silhouette, fraying, paper fuzz, shredded paper, torn outline, excessive folds, low poly, glossy bevel, gradient, 3D realistic, specular, photorealism, outlines, black strokes, detailed linework, text, labels, watermark, cropped silhouette`

## Two acceptance tests (run against same prompt)
**TEST A · SIMPLE SHAPE:** a vintage brass key (TEST_ONLY_KEY). Expected **2–3 big layers**, bold recognizable contour, transparent hole in handle optional. Tests silhouette purity, clean alpha, border safety and 32px readability.

**TEST B · COMPLEX SHAPE:** a simple old-fashioned oil lamp (TEST_ONLY_LAMP). Expected **3–4 big layers** (base, body, window, inner flame); reject generators that add handles, screws, cords, smoke, decorative etching or many facets. Tests restraint and inner-vs-outer shading.

**Neither test object is a new inventory item.** Do not add these to manifest until specifically approved.

## QA gates per independent icon
- [ ] Count **2–4** actual large contiguous paper shapes; no micro-facets.
- [ ] Transparent canvas with alpha=0 in the corners; no flattened checkerboard.
- [ ] At least 10% padding, full visible shape; no crop.
- [ ] Edge is clean at 400% inspection, no off-silhouette pigment, halo, teeth or fuzz.
- [ ] No external or ground shadow anywhere outside the object.
- [ ] Palette conforms, saturation restrained; no unexpected dark/bright contrasts.
- [ ] Thumbnail remains identifiable at **32/48/64px**.
- [ ] One object per asset. Filename and ID preserve mapping.
- [ ] At least one human visual approval before canonical integration.

**Final QA labels:** `PASS`, `REWORK`, `REJECT`. A valid PNG format or syntactically correct file is NOT evidence that visual QA passed.

## Relationship with existing style
- [Existing Paper Cut UI Icon Canon v1](../PAPER_CUT_UI_ICON_CANON_v1.md) locks the **20 already approved item IDs and assets**.
- This document locks the **generation method for new or replacement illustrations**, but does **not** auto-approve any of the v2 trial assets and does not change the in-game source of truth.
- Separate ISO30 paper world drawings, hero and terrain are outside this icon prompt's scope. Cross-game use requires an explicit style derivative and separate QA.
