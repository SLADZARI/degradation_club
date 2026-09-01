# DEMENTOR LAB — production character assets

This directory is intentionally small.

## Canonical base roster

Only two base-character SVGs are part of the current vertical slice:

```text
character-01/character-01-layered.svg
character-02/character-02-layered.svg
```

They are the implementation counterparts of the approved product record:

`dementor-club/projects/dementor-lab/DEMENTOR_LAB_CHARACTER_SYSTEM_V0.1.md`

## Ownership

Each base character owns its own body/rig, outfit and shoes.

Shared appearance categories across the roster:

- hat / headwear;
- glasses;
- beard / facial-hair category where applicable;
- accessory.

Shared category state may survive switching base character. Outfit and shoes remain character-owned.

## Asset hygiene rule

Do not add prototype exports, pivot-reference SVGs, flattened reconstruction drafts, duplicate rigs or alternate characters to this runtime directory.

Reference/source material belongs outside the production runtime asset set. A new base character requires an explicit product decision and a registry update.
