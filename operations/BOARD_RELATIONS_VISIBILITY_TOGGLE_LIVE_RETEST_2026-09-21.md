---
artifactId: dementor-club.operations.board-relations-visibility-toggle-live-retest-2026-09-21
project: dementor-club
documentType: QA_EVIDENCE
projectStage: RELEASE
gate: G8_CLEANUP
status: PASS
version: 1.1
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

Supabase deployment was not required and was not run for STAB-03.

## Authenticated owner live retest

The owner manually exercised the requested production checks and confirmed them working:

```text
relation lines visible                     PASS
СКРЫТЬ СВЯЗИ → lines disappear             PASS
ПОКАЗАТЬ СВЯЗИ → same lines return         PASS
filter + visibility toggle                  PASS
refresh under current ephemeral contract    PASS
mobile                                      PASS
```

No relation data mutation, permission change or persistence change was observed or required.

## Verdict

`PASS_LIVE_BOARD_RELATIONS_VISIBILITY`

## Gate consequence

```text
candidate validation         PASS
production merge             PASS
Pages exact production SHA   PASS
Pages deployment             PASS
authenticated live QA        PASS
STAB-03 → WAITING / G8       AUTHORIZED
STAB-04 activation           AUTHORIZED
```

Parent stabilization issue #228 remains open for remaining BQA work.
