---
artifactId: dementor-club.operations.board-relations-visibility-toggle-live-retest-2026-09-21
project: dementor-club
documentType: QA_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 1.0
updated: 2026-09-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentIssue: 228
---

# STAB-03 · Board Relations visibility toggle · production/live retest

## Release identity

Validated candidate:

`3a017d75271578089d5b108375b03c73dcf7832c`

Production merge commit:

`692c87da4a15a986861c18d41fc9861aa1cb08f6`

PR:

`#232 · MERGED`

Exact production delta from previous production `354d7ea9b176b55f2d4386b178f61cd9cd0e68ef`:

- `community/board/board-relations-v1.js`
- `scripts/validate-board-relations-runtime-browser.mjs`

Candidate → production content diff:

`0 files`

## Pages deployment

Canonical workflow:

`Deploy Dementor Production`

Run:

- run number: `#125`
- run id: `35645805930`
- head SHA: `692c87da4a15a986861c18d41fc9861aa1cb08f6`
- status: `COMPLETED`
- conclusion: `SUCCESS`

Both jobs passed:

- `build · SUCCESS`
- `deploy · SUCCESS`

Therefore GitHub Pages deployment is proven against the exact production SHA above.

Supabase deployment was not required and was not run for STAB-03.

## Authenticated live retest

Target:

`https://dementor.club/workspace/board/`

Required checks:

- relation lines visible;
- `СКРЫТЬ СВЯЗИ` hides relation lines;
- `ПОКАЗАТЬ СВЯЗИ` restores the same relation lines;
- filter + toggle;
- refresh under current ephemeral contract;
- mobile.

Browser evidence run:

`1bedc2b8-ef33-4de2-993b-6174edfe32c2`

Observed production state:

- `НЕ ВЫПОЛНЕН ВХОД`;
- `СОДЕРЖИМОЕ ДОСКИ ДОСТУПНО ТОЛЬКО УЧАСТНИКАМ`;
- no Board relation lines available;
- no relation visibility control available.

### Verdict

`BLOCKED · NO AUTHENTICATED LIVE SESSION`

The authenticated live acceptance requirements were **not executed** and therefore are **not PASS**.

This is not evidence of a BQA-16 regression. It is an evidence/access blocker for the required production acceptance.

## Gate consequence

STAB-03 must remain the current Result at `G7_RELEASE` until one of the following produces valid authenticated production evidence:

1. an authenticated browser/session runs the required live checks; or
2. the owner performs the checks and supplies explicit observed PASS evidence covering desktop/mobile, toggle, filter and refresh.

Do not move STAB-03 to `WAITING / G8` yet.

Do not activate STAB-04 yet.

## Current release state

```text
MERGED                  PASS
PAGES EXACT SHA         PASS
PAGES DEPLOY            PASS
SUPABASE DEPLOY         NOT REQUIRED / NOT RUN
AUTHENTICATED LIVE QA   BLOCKED
STAB-03 → WAITING/G8    NOT AUTHORIZED BY EVIDENCE
STAB-04 ACTIVATION      NOT YET
```
