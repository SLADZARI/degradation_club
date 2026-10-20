# Dementor Live — Asset Library v2 · Audit 2026-10-20

> **ИСТОРИЧЕСКИЙ АУДИТ V2.** Библиотека теперь расширена до 62 независимых SVG: [SVG-FIRST v3](ASSET_LIBRARY_v3_2026-10-20.md) / [реестр DL-ICON номеров](ICON_NUMBER_REGISTRY_v3_2026-10-20.json). Старые утверждённые PNG v2 CLEAN остаются активными до художественной приёмки новой графики; v3 пока CANDIDATE, не production.


> **PACKAGE:** [SVG Asset Library v2 ZIP · complete 62-entry register, 37 SVG renders and QA]( https://drive.google.com/file/d/1tHD9_cCiJGAlwaZVW9YO5PRSnjjQE2fU/view ). This GitHub copy is the audit/index; individual new SVG, PNG and browser gallery are included in the package, not auto-installed in any game branch. New art remains candidate until manual visual sign-off.


**Scope:** CIVIC v0.5.0-rc.2 candidate; Forestry/Combat/Pager; isolated Cave/Fishing; draft UNIVERSE Ideas Forest + MentalHumor. User's Gabel mountain/quest concept is recorded separately as concept, not misrepresented as deployed.

**Machine registry:** [library_registry.json](library_registry.json) (stable IDs, evidence, runtime flags, art QA); [library_index.csv](library_index.csv).

## Source of truth / critical checks

- 20 approved old **pixel** assets came from exact Paper Cut v2 CLEAN archive: SHA-256 `930d1e390e81e3c1b2734f3abdfa7bbb52077a3feb803bb32efe6b6bd6cd533f`, matching [PR #283](https://github.com/SLADZARI/degradation_club/pull/283); old v1 PNG crop damage must not be reused.
- 20 original SVGs are *not* all in compliance with today's stricter SVG production rule: **13 with >4 shapes**; **6 more within 2–4 shapes but use extra legacy color variants**, and **1 strict color+shape candidate**. The 20 game-ready PNG were not changed or withdrawn.
- New SVG source must have 2–4 large opaque paper layers, canonical fills, pure alpha outside shape, no blur, shadow, embedded image, labels, crop, poster. Raster assets derive from single-item SVG only.
- **17 new icon candidates** authored SVG-first, each independently compiled to PNG at 32/48/64/128/256 and technically PASS. Their artistic approval and game integration are **PENDING**; do not replace current game assets automatically.
- **25 other items/props/concepts** added to registry but have no drawn SVG yet. They are deliberately separated into world structures/UI/future concepts, not inserted into city bag.

## New artwork: status by feature

| Feature | SVG-first new candidates | Other art / UI missing | Runtime status |
|---|---|---|---|
| CIVIC forestry | shovel, seed_tree_broadleaf, seed_tree_round, seed_tree_oak, seed_tree_spruce, seed_tree_small | grown tree stage art from existing world not audited here | Candidate release |
| COMBAT Touch | pistol | action HUD/firing microposes out of inventory icon scope | Candidate release |
| P3 telecom | pager | physical payphone world prop in 11 scene positions | Candidate release |
| Cave / Light | lantern, oil, key | walls, secret door, altar, bats and visibility effect | Isolated model; NOT live release |
| Fishing | rod, worm, larva, roach, perch, carp | bite/timing HUD; cast/fish action frames | Isolated model; NOT live release |
| CIVIC property / mayor | — | shop signs, goods display, mayor mail | Candidate release |
| UNIVERSE Ideas Forest | — | billboards, notice board, scooter rack, portal | Experimental branch |
| UNIVERSE MentalHumor | — | museum silhouette, exhibits, outdoor stations | Experimental branch |
| Border / irrigation / Gabel world | — | bucket, watering can, hoe, permits, mountain & guru | Backlog / concept only |

## What exactly is illustrated in this library

- [SVG_NEW_QA_CONTACT.png](SVG_NEW_QA_CONTACT.png): 17 genuinely independent *new* SVG icons as separate PNG renders, laid out for QA (not a source sheet).
- [new_svg_candidates/](new_svg_candidates): editable 17 SVG files with `data-layer` and only canonical palette colors; **these are review candidates**.
- [candidate_build/](candidate_build): PNG exports / normalized SVG and candidate atlases; no shadow / no backdrop.
- [Dementor_Live_SVG_First_Canon_v1/](Dementor_Live_SVG_First_Canon_v1): recovered, auditable base source + build scripts + old 20 asset QA; historical approved PNG independent of style-strict status.

## New game ID safety and exclusions

- Forestry tree-seed IDs were read verbatim from `runtime/forestry.mjs`. Fishing bait/fish IDs come from isolated `runtime/cave-adventure.mjs`. Telecom uses server-side `pagerOwns`; icons are **not** automatically bag items.
- `oil`, `key`, `lantern` and `rod` are display IDs for isolated mechanics pending official bag-ID mapping; do not invent a persistent inventory field.
- Separate UI-paper-cut icons from large world origami/ISO30 props, terrain, buildings and NPC, which require their own visual representation. World prop IDs are prefixed `world:`; future design ideas `concept:`; they must never be passed to bag/inventory without separate logic.
- No new hero or altered hero drawing. No deployment, save migration or in-game asset replacement performed.

## Required next steps

1. Review 17 new SVG candidates visually at **32px and 64px**, accept or send for shape changes (no production promotion without user approval).
2. Redesign 13 original too-complex SVGs to <=4 shapes while preserving approved silhouette; compare against same old v2 pixels and verify readable at 32px. The 6 in-limit palette-exception sources need color acceptance/refactoring; 1 source meets strict structural+palette criteria.
3. Render world-space payphone, cave altar/walls and MentalHumor museum in their separate ISO30/world pipeline; do not reuse tiny inventory SVG at game-map scale.
4. Once specific game mechanic reaches RC and game IDs are confirmed, import only approved PNG to matching branch; test server state unchanged and verify both city and combat UI.

## Evidence sources
- icons: https://github.com/SLADZARI/degradation_club/pull/283
- forestry: https://github.com/SLADZARI/degradation_club/blob/feature/dementor-live-touch-forestry-2026-10-20/projects/dementor-live/design/COMBAT_TOUCH_V2_CIVIC_FORESTRY_V1_2026-10-20.md
- cave: https://github.com/SLADZARI/degradation_club/blob/feature/dementor-live-mountain-cave-fishing-p0-2026-10-20/projects/dementor-live/design/MOUNTAIN_CAVE_FISHING_LIGHT_ANIMATIONS_P0_2026-10-20.md
- payphone: https://github.com/SLADZARI/degradation_club/pull/287
- civic: https://github.com/SLADZARI/degradation_club/pull/285
- release: https://github.com/SLADZARI/degradation_club/pull/288
- forest: https://github.com/SLADZARI/degradation_club/pull/278
- humor: https://github.com/SLADZARI/degradation_club/pull/279
- playtest: https://github.com/SLADZARI/degradation_club/blob/release/dementor-live-civic-p3-safe-upgrade-2026-10-20/projects/dementor-live/qa/PLAYTEST_2026-10-20_RECONCILIATION.md