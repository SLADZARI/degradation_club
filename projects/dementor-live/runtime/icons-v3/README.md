# Dementor Live · Paper Cut new icons v3 · NEW-ONLY (2026-10-20)

**Source of truth:** independent SVG files in `assets/svg/` (one `DL-ICON` number per ID), exactly 2–4 primary matte paper pieces. Export PNG for 32,48,64,128,256px from SVG. Never crop a shared sheet. No external shadows, no opaque background.

## Migration contract
- `DL-ICON-001…020` = pre-existing approved Paper Cut v2 images. **IMMUTABLE**. Installer performs pre/post SHA-256 hash scans on entire `public/assets/paper-icons` and leaves `public/paper-icons.js` + CSS intact.
- `DL-ICON-021…062` = 42 new SVG/PNG candidates, namespace `public/assets/paper-icons-new-v3`. UUID/item mapping in `manifest-new-only.json`; no ID renumbering.
- Active CIVIC/Combat categories `shovel`, 5 x `seed_tree_*`, `pistol`, `pager` receive additive icons in their existing UI controls via `new-icons-v3.js` after activation. Existing item logic, hero, save data, PAPER and world renderer are unchanged.
- `lantern`, `oil`, `key`, `rod`, `worm`, `larva`, `roach`, `perch`, `carp` belong to isolated cave/fishing feature; asset files are staged but do not imply activated mechanics.
- `world:*` icons are navigation/catalog previews, **not** isometric world sprites. `ui:*` are visual indicators, `concept:*` are future proposals. Don't create new bag items or NPCs from preview icons.
- URL static handler serves only exact whitelisted new source names and PNG sizes. CSP remains unchanged; new files use original self origin.

## Reproducible rollout
Use the candidate runtime wrapper from its root:

```
python3 tools/install-new-icons-v3.py .
npm run check:icons
npm run check:icons-new
```

The wrapper verifies the approved ZIP SHA and entries, extracts assets to a temporary directory, and overlays only the checked-in `icons-v3/install_new_only.py` implementation before installation. The ZIP and its 42 SVG / 210 PNG payload are unchanged. The checked-in installer exposes the exact new-only manifest URL as JSON; the smoke check exercises GET/HEAD against an isolated server.

Then restart `npm start` from existing `runtime`, hard-refresh browser. Before applying to a real VM, test with disposable save, verify new image HTTP 200, old v2 hashes, desktop/mobile UI, backup/save migration and release gate. Never `--reset-world`.

## Expected acceptance state
All 42 new independent SVGs, 210 PNGs and ID mapping pass static checks; existing 20 left unchanged; runtime activation may still require browser/mobile QA for final release. A successful ZIP build is not equivalent to a deployed server. Keep this as release candidate until approved.
