# Dementor Club — Current Design Canon

Status: **AUTHORITATIVE POINTER**  
Effective: 2026-08-29

## Current design authority

`docs/DEMENTOR_DESIGN_CANON_v10.md`

Version: **v10**  
Status: **DESIGN AUTHORITY / APPROVED**  
Reference implementation: `dementor-club/concept/ABOUT_PAGE_APPROVED_V10.md`

## Resolution rule

Any human or LLM working on Dementor Club visual implementation must read this file first.

The canon referenced here is the current highest-priority visual authority.

When this pointer conflicts with references to an older canon version elsewhere, **this pointer wins**.

Current priority order:

1. `docs/DEMENTOR_DESIGN_CANON_CURRENT.md` — resolves the active canon version.
2. Active canon referenced above — current visual law.
3. Approved reference implementation for that canon.
4. `docs/ENTITY_PRESENTATION_STANDARD_v1.md`.
5. Component/header/motion implementation contracts.
6. `docs/DESIGN_PRESENTATION_GUIDE.md` — background/reference only.
7. Legacy CSS, historical experiments and dated design branches.

## Version policy

Approved canon files are historical records and must not be silently rewritten to represent a materially different visual system.

- Minor clarification without a change of design authority: update the active version with an explicit dated clarification note, or use a patch-style revision when useful (`v10.1`).
- Material change to visual language, composition, typography, component behaviour or system rules: create a new approved canon version (`v11`, `v12`, etc.).
- A new experiment or implemented page does not become canon automatically.
- A new canon becomes active only after explicit human design approval and an update to this pointer.

**Implemented ≠ approved.**  
**Newer file ≠ active canon.**  
**Only this pointer determines CURRENT.**

## Migration tracking

Pages and QA evidence should record the canon they were validated against when practical, for example:

`design_canon: v10`

After a new canon is approved, migration may be gradual. Existing approved pages may remain on the previous canon until explicitly migrated and revalidated.

QA must distinguish:

- page valid under its declared canon;
- page requiring migration to CURRENT;
- visual regression;
- intentional approved canon change.

A visual baseline must never be updated automatically merely because CURRENT changed.
