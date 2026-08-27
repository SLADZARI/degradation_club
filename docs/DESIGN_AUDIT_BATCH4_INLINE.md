# DESIGN AUDIT — BATCH 4 / INLINE STYLE OWNERSHIP

Status: completed in audit branch. Production is not touched.

## Scope

Removed route-local `<style>` blocks from the 10 routes detected by the style graph and converted them to explicit route-owned stylesheets while preserving stylesheet order in `<head>`.

Affected routes:

- `/404.html` → `/404-inline.css`
- `/contacts/` → `/contacts/inline-v1.css`
- `/design-system/preorder/` → `/design-system/preorder/inline-v1.css`
- `/design-system/support/` → `/design-system/support/inline-v1.css`
- `/donate/` → `/donate/inline-v1.css`
- `/join/` → `/join/inline-v1.css`
- `/projects/logic-awareness/` → `/projects/logic-awareness/inline-v1.css`
- `/projects/logic-awareness/dossiers/` → `/projects/logic-awareness/dossiers/inline-v1.css`
- `/projects/logic-awareness/dossiers/logic/` → `/projects/logic-awareness/dossiers/logic/inline-v1.css`
- `/projects/logic-awareness/dossiers/awareness/` → `/projects/logic-awareness/dossiers/awareness/inline-v1.css`

## Contract

1. Public/runtime HTML must not hide major layout ownership in inline `<style>` blocks.
2. Route-specific styles may remain route-specific, but must live in named CSS files.
3. Extracted CSS keeps the same cascade position as the previous inline block.
4. No visual redesign is introduced by this batch; this is ownership normalization only.

## Permanent gates

`Design Audit` now runs:

- style graph audit;
- Dementor HERO audit;
- Event HERO audit;
- FEATURE / RELATION audit;
- Ink surface audit;
- inline style ownership audit.

`audit-inline-styles.mjs` requires all ten migrated routes to have zero inline `<style>` ownership and a non-empty linked route stylesheet.

## Next batch

Do not strip `!important` mechanically. Batch 4B must first classify the remaining cascade pressure in active stylesheets by component and decide which declarations are structural, compatibility-only, or obsolete overrides. Primary hotspot remains `visual-standard-v2.css`, followed by `presentation-standard-v1.css`, `ui-v2.css`, `course-bridge-v1.css`, and `mobile-qa.css`.
