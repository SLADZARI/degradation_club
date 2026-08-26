# Dementor profile QA — current pass

Status: QA branch only. Do not merge to `dementor-club-site` yet.

## Confirmed against current implementation

- Personal background tokens match the approved values:
  - Valentin `#EFE5D3`
  - Nikita `#F6E9D4`
  - Evgeniy `#F6EDD9`
  - Gabil `#EFE6D3`
- All four profile pages use the same structural hero markup and explicit identity classes (`dc-dementor--...`).
- All four profile pages use the renamed WebP portraits (`dementor_*.webp`).
- Legacy `portrait-ink.webp` duplicates are removed from the QA branch.
- The QA profile layer removes the framed portrait treatment and renders the first screen as one personal surface.
- Web/tablet/mobile rules are defined in one shared profile layer.
- Community roster cards reuse the same personal background tokens and portrait treatment.
- Community opening, Home hero, About, Logic and Fuengirola illustration containers have explicit paper-tone surfaces.
- Illustration containers preserve approved artwork with `contain` where full artwork retention is required.
- The legacy runtime Community duplicate illustration is suppressed because the page already has the approved Community hero.
- Fuengirola uses the current Gabil portrait path and personal background token.

## Issues resolved in this pass

1. Identity is no longer inferred only from portrait URL; profile pages and Community cards carry explicit Dementor classes.
2. Legacy duplicate Dementor portraits were removed.
3. Illustration surfaces now have named paper-tone tokens and consistent responsive container behaviour.
4. Community People block has a fallback raster so an invalid/missing new binary cannot leave a blank section.
5. Previous Site Integrity runs completed successfully after the structural changes.

## Current blocker discovered

`assets/ink/home-community-01.webp` in the QA branch is only **427 bytes**. That is not the prepared People WebP (the prepared local file is ~352 KB) and must be treated as an invalid/broken binary until replaced with the real upload.

The Home Community block therefore currently uses this order:

1. `home-community-01.webp` — intended canonical asset;
2. `community-flow-01.webp` — temporary visual fallback.

Do not remove the fallback or merge the branch until the real `home-community-01.webp` exists on Git with a normal raster file size and renders correctly.

## Remaining release gate

Do not merge until:

- `home-community-01.webp` is replaced by the real WebP binary;
- web/tablet/mobile render is visually checked at 390, 560, 768, 900, 1280 and 1440 widths;
- no horizontal overflow is present at those widths;
- all four Dementor portraits remain fully visible and bottom-anchored;
- Community micro cards remain aligned with long labels and relationships;
- Home Community People image uses its canonical file rather than the fallback;
- final Site Integrity run is green after the binary replacement.
