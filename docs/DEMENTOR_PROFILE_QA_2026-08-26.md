# Dementor Profile QA — 2026-08-26

Status: QA ONLY. Do not merge into `dementor-club-site` until visual review is complete.

## Identity contract

Every Dementor entity must carry two visual inputs:

1. approved portrait asset;
2. approved personal background token.

Current approved mapping:

- Valentin — `#EFE5D3` — `--dc-dementor-valentin-bg`
- Nikita — `#F6E9D4` — `--dc-dementor-nikita-bg`
- Evgeniy — `#F6EDD9` — `--dc-dementor-evgeniy-bg`
- Gabil — `#EFE6D3` — `--dc-dementor-gabil-bg`

For every future Dementor: portrait + background token are added together before public presentation.

## Layout contract from approved Drive mocks

### Web
- One coherent hero surface on the Dementor personal background.
- Copy occupies the left field.
- Portrait occupies the dominant right field.
- Portrait is not presented as a framed card.
- Portrait uses `contain`, bottom anchoring and multiply blending where appropriate.
- Hero fills approximately one viewport after the global header.

### Tablet
- Same composition, 8-column grid.
- Portrait field grows proportionally.
- Controlled visual overlap/tension is acceptable; broken grid is not.

### Mobile
- Identity/name/formula are read first.
- Portrait follows below at full content width.
- No horizontal overflow.
- Image is not replaced by a different composition.

### Micro / Community roster
- Same portrait and same personal background token as the detail page.
- Background is identity, not hover decoration.
- Card dimensions and typography remain common across all Dementors.

## QA branch implementation

Temporary QA stylesheet: `/dementor-profile-qa.css`.

The stylesheet is intentionally loaded only on the Community roster and the four Dementor profile pages in branch `qa-dementor-profile-layout`.

## Acceptance checklist before merge

- [ ] Valentin web matches approved composition.
- [ ] Nikita web matches approved composition.
- [ ] Evgeniy web matches approved composition.
- [ ] Gabil web matches approved composition.
- [ ] All four tablet layouts use the same geometry.
- [ ] All four mobile layouts use the same geometry.
- [ ] Community micro cards use corresponding personal backgrounds.
- [ ] Portraits are not boxed with generic background/border.
- [ ] No horizontal overflow at 320 / 375 / 390 / 430 px.
- [ ] Header remains readable over each personal background.
- [ ] Long names and long quotes do not collide with portrait.
- [ ] Existing profile content and links remain unchanged.
- [ ] Production branch remains untouched until sign-off.
