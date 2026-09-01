# DEMENTOR LAB — Editorial v0.4

Status: EXPERIMENT / COPY & PRESENTATION PASS

Branch: `experiment/dementor-lab-editorial-v0.4`
Entry: `dementor-lab/editorial.html`
Base: `agent/dementor-lab-vertical-slice-v0.3`

## Purpose

This branch exists to test the approved Dementor editorial direction without changing the vertical-slice branch used for the main implementation work.

Nikita's working branch/base is not modified by this experiment. Do not merge this branch automatically.

## Editorial rule

**The graph may know psychology. The player sees behavior.**

**The writer authors the situation. The runtime produces the joke.**

## Changes in v0.4

- Public scenario changed from abstract `КРИТИКА ИДЕИ / СОХРАНИТЬ КОНТАКТ` to a concrete kitchen scene: `ТРЕТЬЕ ОБЪЯСНЕНИЕ`.
- Machine scenario id and mechanics remain unchanged.
- Listener dialogue can now acknowledge that the idea was already understood instead of repeating the player's explanation copy.
- One-liner-heavy joke copy was reduced in favor of dry behavioral lines.
- Result copy now starts with an observation about what actually happened, then exposes the causal chain.
- HOT PATCH and TRACE receive an editorial presentation layer only in `editorial.html`.
- Added `tests/editorial-copy-selftest.mjs` and included it in `npm test`.

## Do not do in this branch

- No Vercel deployment unless explicitly requested.
- No mechanics expansion.
- No merge into the main vertical-slice branch before text playtest/approval.
