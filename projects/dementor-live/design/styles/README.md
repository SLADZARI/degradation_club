# Dementor Live — Design Style Registry

## Registered styles

| ID | Style | Scope | State | Reference |
| --- | --- | --- | --- | --- |
| **`DL-STYLE-PAPER-CUT-01`** | **Paper Cut Appliqué** · детская аппликация из цветной бумаги | UI-иконки, инвентарь, HUD, интерфейсные иллюстрации | **Generation prompt LOCKED; 2 visual tests REJECT; new samples require visual approval** | [Prompt and detailed canon](PAPER_CUT_APPLIQUE_STYLE_V1.md) · [actual QA](PAPER_CUT_APPLIQUE_TEST_RESULTS_2026-10-20.md) |
| `DL-WORLD-PAPER-ORIGAMI` | Paper Origami / ISO30 (existing world art family) | Мир, здания, геометрия, игровые персонажи | Separate visual scope; do not overwrite | Separate production/visual rules; not defined by this UI prompt |

### Approved 20 icons ≠ automatically approved generators
The 20 existing UI icon IDs and their visual baseline are controlled by [PAPER_CUT_UI_ICON_CANON_v1.md](../PAPER_CUT_UI_ICON_CANON_v1.md). This registry only specifies how future replacements/candidates are generated and tested. **No generated candidate is game-ready before individual independent visual QA.**

### Workflow
Request a single object and stable ID → use registered style prompt with explicit isolated RGBA output → reject background, montage, outside shadow and rough crop → QA alpha, edges, layers and readability → review → export 256/64 px PNG → only then integrate. Never extract game icons from composite posters.

To find this style in any older/current/future game branch, search the exact string `DL-STYLE-PAPER-CUT-01`.

## Production update · 2026-10-20 · SVG-FIRST

**Canonical production contract for new artwork:** [SVG_FIRST_PAPER_CUT_PIPELINE_v1.md](SVG_FIRST_PAPER_CUT_PIPELINE_v1.md). Restored 20 independent SVG sources (v2 Clean), recovered SVG→transparent PNG 32/48/64/128/256 and atlases, technical control tests TEST_ONLY_KEY (3 shapes) and TEST_ONLY_LAMP (4 shapes) PASS. The two earlier **REJECT** image-generation results refer to a discontinued raster-poster workflow and **do not apply to this SVG-first pipeline**. 20 legacy SVG sources: 7 CANDIDATE + 13 REWORK pending art approval, zero rendering failures. SVG-first source package [Google Drive](https://drive.google.com/file/d/1UskpdEQvSBGz-poBvzqdwsvgxOZVzl5e/view). Do not force-replace current icons.
