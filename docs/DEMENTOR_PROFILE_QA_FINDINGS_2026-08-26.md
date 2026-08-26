# Dementor profile QA — second pass

Status: QA branch only. Do not merge to `dementor-club-site` yet.

## Confirmed against current implementation

- Personal background tokens are fixed and match the approved values:
  - Valentin `#EFE5D3`
  - Nikita `#F6E9D4`
  - Evgeniy `#F6EDD9`
  - Gabil `#EFE6D3`
- All four profile pages use the same structural hero markup.
- All four profile pages use the new named WebP portrait assets.
- The QA layer removes the legacy framed portrait treatment and turns the hero into one personal surface.
- Web/tablet/mobile rules are defined in one shared CSS layer.
- Community roster cards reuse the same person background token and portrait treatment.

## Issues found in second pass

1. The current QA CSS derives identity with `:has()` + portrait URL matching. This works in current evergreen browsers but is the wrong long-term contract. Identity must be explicit data on the page/entity, not inferred from an asset URL.
2. Old duplicate `portrait-ink.webp` files still exist next to the renamed portraits in the QA branch. They are byte-identical duplicates and should not survive release cleanup.
3. `entity-visual-tokens.json` still contains the old Home hero asset name. This is outside this profile change but is a documented inconsistency to fix separately before the next design-system freeze.
4. Visual sign-off still requires actual rendered comparison at representative widths. Static code inspection cannot certify pixel alignment.

## Release gate

Do not merge until:

- identity is explicit (`data-dementor` / entity token), not URL-derived;
- duplicate legacy portraits are removed in QA;
- web/tablet/mobile render is visually checked;
- no horizontal overflow is present at 390, 560, 768, 900, 1280, 1440 widths;
- all four portraits remain fully visible and bottom-anchored;
- Community micro cards remain aligned with long labels and relationships.
