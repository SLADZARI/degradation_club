# Dementor Live — Paper Cut Appliqué · TEST REPORT
**Date:** 2026-10-20  
**Style:** `DL-STYLE-PAPER-CUT-01`  
**Prompt:** [PAPER_CUT_APPLIQUE_STYLE_V1.md](PAPER_CUT_APPLIQUE_STYLE_V1.md)  
**Game integration:** NOT RUN / no game code, assets or live player state changed.

## Visual QA — two negative tests
| Test | Target | Result | Objective evidence | Next action |
|---|---|---|---|---|
| A `TEST_ONLY_KEY` | A single simple key, 2–3 layers, no text/background | **REJECT** | Generated response instead contained a broad style-guide poster with multiple objects, text, palettes and a background. No standalone key with native transparent alpha to export. | Use a one-object prompt with native transparent background setting and inspect output independently |
| B `TEST_ONLY_LAMP` | A single oil lamp, 3–4 layers, no external shadow | **REJECT** | Generated response was another multisection style infographic with text and multiple unrelated icons. No standalone lamp. | Do not crop or remove background from the poster; regenerate one object from scratch |

**These two tests are not successful samples and not valid UI assets.** A pretty infographic is not proof that an individual isolated icon follows the style.

## Alternate native-alpha generation
Tried explicit text-to-image service `openai/gpt-image-2.5/flare/text-to-image` with `background:transparent`, `image_size:square` and a one-object key prompt. Submission was **BLOCKED** with `balance_exhausted` on the connected fal account. This test is **NOT RUN** (no generated output), not a visual REJECT. Do not retry or switch accounts automatically; only resume after credits are added by user.

## Documentation/contract verification
- **PASS** — reusable prompt and mandatory negative prompt saved in versioned design document.
- **PASS** — canonical palette, layer count, alpha, outer-shadow and crop criteria explicitly recorded.
- **PASS** — style document added to existing QA, Combat, and World Expansion Git branches.
- **PASS** — the former permissive emoji rule in `runtime/AGENTS.md` was replaced with the current strict requirement.
- **PASS** — both visual outputs are correctly marked REJECT, and not promoted as a replacement to the existing icon atlas.
- **NOT RUN** — pixel-level alpha analysis on an independently generated key/lamp PNG (no compliant raster file produced).
- **NOT RUN** — mobile UI 32/48px visual integration for key/lamp; they are TEST_ONLY and not game objects.

## Required next acceptance pass
For each of `TEST_ONLY_KEY` and `TEST_ONLY_LAMP`, generate **a separate single isolated transparent RGBA image** with the saved prompt. Then assert source dimensions, full silhouette inside >=10% padding, alpha=0 in all four corners, no external drop shadow or color fringes, 2–4 large colored paper layers, muted palette, recognizable 32/48/64px. Human approves before using it as a style reference. Document the generator, exact prompt, images/links, and PASS/REWORK/REJECT. **Do not commit test images as playable inventory items.**

## Status
**Style rules documented / visual-generation validation NOT PASSED.** Existing 20-item icon collection is unaffected. Production/release status unchanged.
