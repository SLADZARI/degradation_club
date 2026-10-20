# Dementor Live — World Registry v1.0

**20.10.2026 · Source-backed known worlds/scenes · design registry, not active production API.**

## Identity model (proposed namespace)

Use distinct IDs for CharacterId, cityId, worldId, regionId and sceneId. In code, IDs must be mapped to current actual scene names, not renamed in persistent saves without migration.

| Logical ID | Direction | Current code/source representation | State | Function |
| --- | --- | --- | --- | --- |
| civic/origin | CIVIC | city scene, CityNetwork origin and additional founded cities | v0.4 candidate | Economy, city objects, public buildings |
| civic/expansion-forest | CIVIC | forest biome/obstacles *inside city*, not a persisted forest scene | v0.4 candidate | Paths, hazards, travel landmarks |
| civic/museum-legacy | CIVIC | scene museum, 20×16 in world-expansion.mjs | v0.4 candidate | Small exhibit and return |
| civic/farlands | CIVIC | scene farlands, 28×20 | v0.4 candidate | Distant themed exploration |
| universe/ideas-forest | UNIVERSE | scene ideas-forest, 64×48 in world-01.mjs | isolated experiment | Forest paths, public demo boards, scooter, discovered portal |
| universe/mentalhumor-park | UNIVERSE | scene mentalhumor, 80×60 | isolated experiment | Park, outdoor research points, museum exterior |
| universe/mentalhumor-hall | UNIVERSE | scene mentalhumor-hall, 20×17 | isolated experiment | Museum interior and read-only research cards |

## Canonical geometry and transitions

- Civic world expansion provides tourist kiosk, physical signs, a small museum gate, farlands and preview sites; forest/mountain obstacles are not distinct scenes.
- Ideas Forest: origin city sign (30,2) ↔ forest south entry/exit; a forest portal is proximity- and discovery-locked.
- MentalHumor: origin city (17,2) ↔ park south road; Ideas Forest (37,28) ↔ park west trail; park ↔ museum hall via physical doorway. These are the Universe experiment's own routes, **not** verified v0.4 production paths.
- Both versions currently have a museum concept. **Do not delete or silently overwrite either.** Architecture decision: make the CIVIC museum an explicit entry/preview for the one future MentalHumor region only after implementing a migration and obtaining product acceptance.
- All coordinates are prototype-specific and MUST be tested against the integrated geometry before exposure to users.

## World passport requirement

Any new world must include:
worldId; name; direction; world/region/scene boundaries; owner and provenance; status and source branch/SHA; gameplay loop; spawn/exit/return targets; objects; collision; source/asset permissions; economy and reward rules; save schema impact; dependencies; mobile controls; tests and observed QA; release gate.

## External content

WORLD-01 billboards refer to public Club pages as static read-only demos without Club auth. The MentalHumor museum is a research-stage homage, not a licensed digital twin or authorized partnership. No rights to audio, video or real museum collections are implied.

## Expansion convention

Each new world is a module/registry entry and authoring package, not a new independent money engine or CharacterId store. Region modules are merged through an explicit compatibility adapter with tests.

## Original sources

- [World expansion source](../runtime/world-expansion.mjs)
- [Ideas Forest specification](https://github.com/SLADZARI/degradation_club/blob/feature/dementor-universe-world-01-forest-2026-10-20/projects/dementor-live/universe/WORLD_01_IDEAS_FOREST_SCOPE.md)
- [MentalHumor specification](https://github.com/SLADZARI/degradation_club/blob/feature/dementor-universe-mentalhumor-museum-2026-10-20/projects/dementor-live/universe/MENTALHUMOR_MUSEUM_WORLD_02.md)
