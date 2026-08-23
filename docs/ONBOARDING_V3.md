# Dementor Club — Onboarding v3

Status: implementation of approved club model.

Source-of-truth: `dementor-club/operations/ONBOARDING_SYSTEM.md`.

## Change from v2

The previous onboarding measured one general personality-style profile using broad dimensions such as openness, structure, cooperation and reflection.

That model is deprecated for club qualification.

Version 3 treats `/join/` as a router into nine independent sphere-specific diagnostics:

- personality
- work
- consumption
- relationships
- control
- information
- self-development
- meaning
- technology

## URL model

Main selector:

`/join/`

Addressable sphere routes:

`/join/?sphere=personality`
`/join/?sphere=work`
`/join/?sphere=consumption`
`/join/?sphere=relationships`
`/join/?sphere=control`
`/join/?sphere=information`
`/join/?sphere=self-development`
`/join/?sphere=meaning`
`/join/?sphere=technology`

## Scoring

Each sphere has:

- four thematic tags;
- sphere-specific questions;
- an intentionality guard;
- a responsibility guard.

The result is a 0–5 level for the selected sphere plus 0–5 levels for its tags.

High thematic scores can be capped when intentionality or responsibility is low. This prevents ordinary avoidance, collapse or dysfunction from being classified as conscious degradation.

## Storage

Until a server-side member profile is approved, progress and results are stored only in browser localStorage under:

`dementorClubOnboardingV3`

The profile can accumulate independent results across several spheres. There is no overall average or global human score.

## Future integration

Each result should later resolve to content routes:

`sphere → tag → articles → dementors → projects → products → events`

The site must not invent new sphere names, tag meanings or scoring rules independently of the `dementor-club` source-of-truth.
