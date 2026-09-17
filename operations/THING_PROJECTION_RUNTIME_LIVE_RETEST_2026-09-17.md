# ThingProjection Runtime v1 — Live Retest — 2026-09-17

Result: `dementor-club.result.thing-projection-runtime-v1`
Issue: `#213`
Production commit: `23d4266a4009d34042b29ec1fb73fb0cbad6b62e`
Pages deploy run: `#120 / 35259685738`

## Live observations

Live `https://dementor.club/` responded successfully after deployment.

The deployed runtime serves `https://dementor.club/thing-projection-v1.js` with the intended thin read boundary, including:

- `program:dengi-na-veter`
- `project:dementor-lab`
- canonical Dengi route `/courses/dengi-na-veter/`
- canonical Lab route `/projects/dementor-lab/`

The deployed `https://dementor.club/current-program-v1.js` consumes:

- `readDengiNaVeterThingProjection`
- `readDementorLabThingProjection`

and retains composition-local contextual fields. `event:fuengirola` remains local to Current Program and was not promoted into ThingProjection.

The live DSO surface `https://dementor.club/courses/dumai-s-opasnostyu/` responded successfully with canonical metadata, and its deployed data/runtime files are present under the released course path.

## Live verdict

`PASS_LIVE_RUNTIME_BOUNDARY`

This is layered live evidence: successful exact-SHA Pages deployment plus direct reads from the public production runtime. It does not claim a new authenticated Board acceptance beyond the exact-head browser regressions already passed in G6/G7 CI.
