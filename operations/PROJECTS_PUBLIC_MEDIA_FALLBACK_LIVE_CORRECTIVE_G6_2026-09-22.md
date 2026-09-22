---
artifactId: dementor-club.operations.projects-public-media-fallback-live-corrective-g6-2026-09-22
project: dementor-club
documentType: QA_EVIDENCE
projectStage: VALIDATION
gate: G6_VALIDATION
status: PASS
version: 1.0
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentIssue: 228
---

# STAB-05 · LIVE corrective · Projects hero video · G6

## Owner correction

Owner live QA rejects the prior unavailable-state and confirms video id `dWokndhJLKQ` exists.

The prior automated source-availability verdict is superseded for Product truth and treated as an environment false negative.

## Exact identity

Production baseline:

`4a8e95cb669dab660a7afe381e580278d4575a2a`

Same integration branch / same Result:

`result/projects-public-media-fallback-v1`

Corrective candidate:

`91607fdbd02b815122ce25c7a8920691dda6320f`

Draft PR:

`#236`

CI:

`Site Integrity / Release Readiness #1233 / 35671603405 · SUCCESS`

## Corrective

Existing Projects hero owner restored to:

- stable vertical 9:16 media geometry;
- `youtube-nocookie.com/embed/dWokndhJLKQ`;
- `autoplay=1`;
- `mute=1`;
- `playsinline=1`;
- `loop=1`;
- `playlist=dWokndhJLKQ`;
- `controls=1`;
- visible external `ОТКРЫТЬ ВИДЕО ↗` fallback;
- non-black fallback layer behind iframe;
- accessible iframe title and keyboard-focusable external fallback.

Removed owner-rejected copy:

- `ФРАГМЕНТ ВРЕМЕННО НЕДОСТУПЕН`;
- `Источник видео больше не воспроизводится.`

No second media owner/runtime was introduced.

## Browser validation

Existing `scripts/validate-projects-v2-browser.mjs` extended and PASS on built candidate:

- Chromium 1440;
- mobile 390;
- mobile 360;
- exact youtube-nocookie source and video id;
- exact autoplay/mute/playsinline/loop/playlist contract;
- visible controls fallback;
- exact external fallback link;
- rejected unavailable copy absent;
- stable 9:16 geometry;
- reload stability;
- canonical Header/routes/overflow/history remain intact.

Parent-page browser preview also confirmed:

- real rendered YouTube player surface, not an empty black rectangle;
- owner-rejected copy absent;
- visible external fallback link.

Automated preview environment encountered YouTube anti-bot overlay, so autoplay/playback progress could not be used as a reliable Product verdict. This is recorded as environment limitation, not source unavailability.

Post-deploy live human-browser playback remains a required release acceptance.

## Boundary

Schema mutation = NO.
Semantic mutation = NO.
Change Proposal = NO.
Supabase changes = NO.
STAB-06 = NOT STARTED.

## Verdict

`PASS`
