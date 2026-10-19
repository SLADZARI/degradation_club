# Dementor Universe · WORLD-01 — Город → Лес идей

**Статус:** ИЗОЛИРОВАННАЯ ЭКСПЕРИМЕНТАЛЬНАЯ ВЕТКА · NOT RELEASED · NOT CONNECTED TO LIVE CLUB DB  
**Branch:** `feature/dementor-universe-world-01-forest-2026-10-20`  
**Base:** `feature/dementor-live-economy-seeds-cities-2026-10-18` (candidate 0.3.0-rc.1)  
**Independent of:** combat PR #267, public Club production release, Supabase schema/migrations, and WORLD ORGANISM lab.

## Product principle
One shared 2D game engine with *separate development branches*, preserving the current resident, wallet, resources and existing civic world. The forest is **another physical region**, not a cluster of website tiles.

## Playable scope
- Starter-city trail sign `world01-city-gate` at (30,2).
- Separate `ideas-forest` scene 64×48, seeded deterministic 135 decorative trees with real collision and walkable roads.
- Entry at (31,44), pedestrian return at (31,46). World-state change is a scene transition, not a second character.
- Test scooter rack (34,42): speed ×1.65 while mounted, no object mint, no transport monetization.
- Forest portal (31,10): must be physically discovered first; then forest→city and city→forest quick travel can be used.
- Central Board (31,24) and three public-demo information billboards:
  - `program:dengi-na-veter` from **current-program-v1** + **thing-projection-v1** → /courses/dengi-na-veter/
  - `project:dementor-lab` from same source → /projects/dementor-lab/
  - `event:fuengirola` from current-program-v1 → /events/fuengirola/
- On approach and action, render a sanitized, read-only card with link to the **public** Club page. No token sharing or live Board claims. Source status is `DEMO_PUBLIC_STATIC`.
- Portrait/landscape mobile canvas and analog movement pad at left, interaction/route/optional portal actions at right; desktop WASD and E still work.

## Engine boundaries
- `runtime/world-01.mjs`: canonical forest objects, roads, deterministic trees, collision, server-authoritative interactions and public projection metadata.
- `runtime/world.mjs`: thin hooks for scene-specific collision, speed, snapshot and actions.
- `runtime/life.mjs`: only suppresses private-plot target rendering for forest scene.
- `runtime/public/app.js`: thin renderer + cards + mobile control. Existing city is intact.
- Existing `CityNetwork` and `Game` are authoritative for player identity and material ledger. `p.world01` stores minimal teleport and scooter state inside the original saved player. No new tables and no destructive migration.
- No transport from arbitrary coordinates: all transitions use server proximity + requestId idempotency.
- Forest trees are scenery/obstacles, NOT harvestable resources at this stage. No new PAPER mint or material generation.
- City elsewhere than first origin: this candidate intentionally displays the gate only in origin. Full cross-city region ownership/registry to be separately designed.

## Public source and relation policy
The Club already supports `RELATED_TO`, `RESULT_OF`, `CONTINUES`, `ABOUT`, `REPORT_OF` for source kinds `artifact`, `event`, `program`. The experimental forest does **not** claim that the displayed course, project and event have relations. The project `project:dementor-lab` is **not** yet a valid Board Relations v1 endpoint kind, so it is a **public billboard only**. The full bridge requires separately authorized identity, Club permissions and private-result filtering. No live Supabase data is queried in WORLD-01.

## Acceptance & gates
1. **World model:** 12 invariants (collision, long forest path, no remote teleport, conserved resources, two residents, scooter, portal, no invented relations, reload).
2. **Existing city regressions:** `npm test`.
3. **Mobile browser:** real Chrome touch gestures and right-side action button, two clients in shared forest, real billboard card, scooter, unlocked portal, forest↔city, unchanged inventory, errors none.
4. **Local packaging:** `npm run check && npm run pack` into `projects/dementor-live/dementor-live-workspace.zip` (must exclude saves).
5. **NO-GO for prod:** no physical iOS Safari proof; no exact live rc.2 SHA reconciliation; no authentic Club auth/live Board bridge; no persistent smooth streaming between regions (currently region handoff at trail/portal).

## Roadmap beyond WORLD-01
WORLD-02: physically streaming sectors so walking transitions can become seamless, scooter animation and route controls, friends/presence rules.  
WORLD-03: confirmed club identity and read-only Board API integration respecting membership and RLS.  
WORLD-04: per-project region planning, plots/billboards with club-approved authoring, restrictions and moderated placement.  
These are **not requirements of the first isolated branch**.

## Running
1. In test workspace run Node 22+, `npm start`, open the local game (default http://localhost:4173).
2. Login with an independent **test** resident; walk to north trail at (30,2). Use E or action button.
3. Enter forest → find a billboard → read card → scooter rack / old portal → return by trail or teleport.
4. For two players, open same local server from two clients. Do not expose this alpha to production or overwrite public saves.

**Do not infer GDD approval, QA PASS or production deployment merely from a successful model test.**
