# Dementor Live — Paper Cut UI Icons v2 CLEAN
**Status: USER SELECTED / SUPERSEDES v1 · 20 Oct 2026**

On 20 Oct 2026 the owner explicitly rejected the earlier `Dementor_Live_Paper_Icons_v1_FULL.zip` as incorrect and supplied `Dementor_Live_Paper_Icons_v2_CLEAN_REVIEW.zip` as the correct new set. **Do not use v1 assets or the old v1 atlas SHA** for game releases.

## Archived original
- `projects/dementor-live/runtime/assets-source/Dementor_Live_Paper_Icons_v2_CLEAN_REVIEW.zip`
- 20 item identifiers: wood, stone, food, seed_hemp, seed_carrot, hemp, carrot, water, axe, pick, rifle, ammo, map, shirt, souvenir, paper, backpack, cargo, health, stamina
- Original SVGs, 256×256 and 64×64 RGBA PNGs, 320×256 / 1280×1024 atlases, QA preview, manifest hashes.
- SHA256 atlas 64: `0687fddf17666809e36c9c45810ea9dcf910ed7236656167fdf1ba542c93a538`
- SHA256 atlas 256: `b2db04d077e414ab6a0a11cb6454fdc92504fe5c27b021fb20701a95e0409b99`
- **No automatic game integration** from merely committing the ZIP. Extract into runtime public assets and wire adapter/CSS/server route. Do not confuse committed art archive with deployed art.

## Correct handoff
Source artwork must not be regenerated, cut out of a colored background, restyled or externally shadowed. Preserve transparent PNG originals byte for byte. UI-only update: inventory/quickslots/HUD/stores/tourist/health/ammo. No player/world-save migration; retain Docker volume `dementor-live-world`. Browser visual checks at 32, 48px mobile and desktop are required.

Production currently remains at 0.4.0-world-p0 until an independently checked, game-only image containing these files is deliberately published. Closing earlier v1 PR is a supersedence, not a graphics deployment.
