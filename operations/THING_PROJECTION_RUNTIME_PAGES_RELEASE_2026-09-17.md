# ThingProjection Runtime v1 — Pages Release Evidence — 2026-09-17

Result: `dementor-club.result.thing-projection-runtime-v1`
Issue: `#213`
Production commit: `23d4266a4009d34042b29ec1fb73fb0cbad6b62e`
Deploy workflow: `Deploy Dementor Production`
Run: `#120`
Run id: `35259685738`
Conclusion: `SUCCESS`

## Exact production checkout

The canonical deploy workflow ran from branch `dementor-club-production` at exact head:

`23d4266a4009d34042b29ec1fb73fb0cbad6b62e`

This is the merge commit produced by PR #220 from validated release candidate:

`40b5d55cdf8c1fd137dacc7fd2fcee9f62438f01`

## Build and deploy evidence

Both workflow jobs completed successfully:

- `build` — SUCCESS
- `deploy` — SUCCESS

The build job passed registry/routes, content readiness, visual contract, Pages build, canonical shell, built JS syntax, browser shell/workspace recovery, route manifest and production release gate before upload.

Pages artifact:

- artifact id: `10514141329`
- name: `github-pages`
- digest: `sha256:4e10d17049a3280d0ec219e1344b73ca94a7a4a07c363a637e76993b12b6844d`
- source branch: `dementor-club-production`
- source SHA: `23d4266a4009d34042b29ec1fb73fb0cbad6b62e`

The deploy action reported a successful Pages deployment for exact build version `23d4266a4009d34042b29ec1fb73fb0cbad6b62e` and environment URL `http://dementor.club/`.

## Boundary

This evidence proves deployment of the exact production commit. It does not by itself prove live semantic behavior; live runtime evidence is recorded separately.
