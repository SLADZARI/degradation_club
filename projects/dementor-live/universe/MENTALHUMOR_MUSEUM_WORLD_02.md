# DEMENTOR UNIVERSE · MENTALHUMOR — Музей смеха

**Статус:** ISOLATED RESEARCH / EXPERIMENTAL GAME BRANCH (20.10.2026)  
**Branch:** `feature/dementor-universe-mentalhumor-museum-2026-10-20`  
**Base:** `feature/dementor-universe-world-01-forest-2026-10-20` (civic 2D engine + Ideas Forest).  
**Not included:** combat PR #267, Club production publication, real recordings, digital collection intake, commercial partnership, live Board auth.

## Geographical identity
MentalHumor is **a full navigable region, not a museum button or a single building**. Museum at its physical centre, built in our compact paper/ink 2D renderer. Surroundings evoke the historical village of Purku, Estonia and former school grounds without claiming cartographic accuracy.

The existing **Eesti Huumorimuuseum** in Purku (Rapla County) is a real institution. Building reference comes from user-provided Google Street View screenshots (2011) and museum pictures (2017): stone central gable, green clapboard wings, red brick entry vestibule, white windows, reddish roof, park with mature trees and a road/flagpole. We **do not** copy photographs into the game. Illustrated geometry is independently drawn in Canvas. It is a visual homage rather than a photogrammetric or authorised digital twin.

## Walkable first slice
- `mentalhumor`: 80×60 outside park with 160 deterministic decorative trees, public routes, stone museum footprint and front entrance.
- Exterior museum at x29..50 y14..28. Museum interaction at (39,29.5).
- `mentalhumor-hall`: separate 20×17 indoor scene, 3 research points and an exit. Same resident, bag, wallet and tools.
- **World-to-world access:** First City (17,2) → museum south road (39,55) and return at (39,57). Ideas Forest (37,28) → museum western trail (14,48) and return at (14,50). No free remote jump.
- Park stations: famous laughter (FORMAT 01), voluntarily recorded laughter (FORMAT 02), cartoon/history garden and Purku memorial alley. These remain descriptions only.
- Museum hall: museum introduction linking `https://eestihuumor.ee/`, publicly described exhibitions linking `https://eestihuumor.ee/toimunud-naitused/`, and research-only MentalHumor laughter library hypothesis. Only explicitly accepted origins may be opened.
- Visible phone left movement stick, right action button, MentalHumor route button; desktop WASD/E unchanged.
- Server-owned collision, region and interaction proximity. RequestId idempotency; same player ID/economy on every transition and saved reload.

## Legal/editorial lock
MentalHumor is a **2026 discovery-stage project hypothesis**, not a launched public product or institutionally endorsed museum exhibition. Potential collaboration with Eesti Huumorimuuseum / Andrus Tamm does not constitute consent. All cards are tagged `RESEARCH_DEMO_NOT_PARTNERED`. Do not copy/replay artists' laughter, film clips, actor voices, museum collection images or archival audio without permission. This branch contains **no** audio, voice uploads, voice cloning, medical claims, or biometric analysis. If voluntary audio donation is ever approved, it needs a separate privacy/rights design, lawful basis and explicit consent. The game does not implement such collection here.

Source anchors (editorial branch, not canon):
- `SLADZARI/degradation_club_redaction` → `references/incoming/mentalhumor/PROJECT.md`
- `references/incoming/mentalhumor/GLOBAL-COLLECTION-LAUNCH-AND-LEGAL-HOST-2026-10-10.md`
- Museum source `https://eestihuumor.ee/` and supplied museum dossier of 20 October 2026

## Engineering boundaries
- `runtime/mentalhumor.mjs`: region definitions, deterministic trees, museum/hall collision, validated transitions, rights-marked cards.
- `runtime/world.mjs`: isolated scene hooks into existing Game; no permanent profile migration or changes to warehouse/material accounting.
- `runtime/life.mjs`: suppress plotting/house interactions when in museum scenes.
- `runtime/public/app.js`: Canvas paper-craft architecture, park roads, exhibits, modal cards, mobile route. `index.html`/CSS add isolated controls.
- `runtime/test/mentalhumor.test.mjs` model and `test/mentalhumor-browser.cjs` two-browser phone journey.

## Acceptance gates
1. Museum is central, park visually distinct and travel routes physically walkable.
2. Arrival via both City and Ideas Forest; museum hall enter/leave; no action at arbitrary distance.
3. Museum/exhibition/research cards load with original public museum URL; do **not** assert collaboration or playback rights.
4. Existing player state preserved on scene transitions, two-player presence and server restart.
5. Screenshots from two phone viewport orientations plus error-free browser test.
6. CI pack as independent artifact. **NO-GO for production** until actual iOS Safari and current production engine parity tested; official museum approvals not implied.

## Not yet included
- Seamless terrain streaming between regions: these are server-managed scene transitions at physical trailheads.
- Furniture and full floorplan of the real museum; original physical collection remains inaccessible.
- Any rights-unverified third-party voice/audio.
- Signed partnership, financial model, funding, linked Supabase/MentalHumor collection or real-world visitor location services.
- Player-created exhibits or moderated content upload.

## Test mode
Use Node 22 in the extracted workspace. `npm start` launches a **local copy**, not public production. Start a new resident in a disposable save, navigate to the sign at (17,2) in the first city or the sign (37,28) in Ideas Forest. Enter park; front door at (39,29.5); exit at (39,57) or (14,50). Do not overwrite any known game save.
