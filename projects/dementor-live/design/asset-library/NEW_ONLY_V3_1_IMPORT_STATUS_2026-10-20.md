# Dementor Live · NEW-ONLY v3.1 · GitHub asset import state (2026-10-20)

## Immutable baseline
**Do not modify DL-ICON-001–020 / approved v2 CLEAN**. They are not in the new-only ZIP installer, no previous v2 PNGs or legacy HTML APIs were changed in this asset migration.

## What exists right now
- [Complete **42 new SVG + 210 PNG** archive](https://drive.google.com/file/d/13nNQYJ0rLOasHLE2pGA5Vsx2TS2DTiM_/view), SHA256 `83fdd8133a62e1c64e8704c9df887769f88cd4b7e6b4ee855aa3e0fe17bed99a`.
- [Preview of the **42 new icons only**](https://drive.google.com/file/d/1YWHVfm7pj8-2Gy-6OnyMUawig0YxnfRq/view).
- **35 of 42** new SVG source files committed to [CIVIC RC branch: `runtime/assets-source/paper-cut-v3/svg-new/`](https://github.com/SLADZARI/degradation_club/tree/release/dementor-live-civic-p3-safe-upgrade-2026-10-20/projects/dementor-live/runtime/assets-source/paper-cut-v3/svg-new). These are **source candidates**, not deployed game PNGs.
- **Seven** new SVG sources were not accepted by GitHub connector (not retried/modified): `concept__guard.svg`, `concept__hoe.svg`, `lantern.svg`, `rod.svg`, `world__bridge2.svg`, `world__cave_altar.svg`, `worm.svg`. The original valid files remain intact in the ZIP.
- Installer source `runtime/icons-v3/install_new_only.py`, test source `runtime/icons-v3/test_new_only.py` and README committed. The supplementary browser JS `new-icons-v3.js` was also blocked for GitHub import; exact file exists in ZIP.
- All 42 SVG and 210 PNG **are not yet published as individual runtime binaries in GitHub**; no production/local running server was modified in this action.

## Automatic documentation update
Running the archive's `install_new_only.py <runtime_root>` against the actual existing runtime:
1. Validates each image SHA256; refuses mismatch.
2. Hashes all existing v2 Paper Cut assets and code.
3. Imports **only** new 21–62 assets to `public/assets/paper-icons-new-v3/` and adds the supplemental client JS to city/combat without touching older icons.
4. **Automatically writes** `runtime/docs/PAPER_ICONS_NEW_ONLY_V3.md`.
5. Asserts all pre-existing v2 hashes unchanged.
6. Is idempotent; `--stage-only` imports without UI activation.

## QA
PASS: 42 unique stable SVG IDs, 2–4 flat shapes, muted palette, transparent PNG exports (210 files), repeated install, old-icon hash invariance, JS syntax, Chromium DOM test (seed shop/bag/quickbar, shovel, pistol and pager).

NOT VERIFIED: new PNG HTTP load on user's Mac (browser sandbox blocks localhost with `ERR_BLOCKED_BY_ADMINISTRATOR`), real device/production regression. New SVG designs pending final artistic acceptance, especially world/preview concepts.

**Do not claim `deployed`, `all GitHub assets imported`, or `approved gameplay sprites`.**
