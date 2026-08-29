# QA-INTEGRATION-0002 — Community / site ↔ QA reconciliation

Status: PARTIALLY_RECONCILED_PENDING_PAGE_SYNC
Severity: P1
Type: RELEASE INTEGRATION / BRANCH DIVERGENCE
Environment: `dementor-club-site` + `dementor-club-qa`
Recorded: 2026-08-30

## Context

The approved Community redesign and the Workspace hardening package were developed on diverged branches.

`dementor-club-site` owns the current public Community architecture and the current site UX decisions.
`dementor-club-qa` owns the QA-only Workspace/Auth/System Tools hardening and browser regression work.

The branches must not be merged wholesale because doing so can restore stale public navigation/content or overwrite QA hardening.

## Reconciliation completed in QA

### Global header

Reconciled manually:
- Community is now a direct top-level navigation link.
- The stale `Community → People / Courses` dropdown has been removed.
- Course routes still mark Community as active.
- QA Account hardening is preserved: Account points to Personal Workspace.
- Cart stays hidden unless `cartEnabled === true`.

QA commit: `c36aed98ea33041a099da641770ba37c1fb662fd`.

### Logic & Awareness entry scroll

Reconciled manually:
- carousel initialization no longer uses `scrollIntoView()`;
- horizontal centering uses track-local `scrollTo()`;
- normal entry to `/projects/logic-awareness/` should therefore remain at the project hero;
- explicit fragment links remain a separate behavior to preserve.

QA commit: `799ab2a6ce85cdbeaad00d8335ff2013663e8833`.

## Still pending

The QA branch still contains the older Community page implementation. Before creating the next production candidate, synchronize the approved Community page from `dementor-club-site` into QA together with its current CSS/assets, while preserving QA-only environment boundaries.

Do not resolve this by merging the whole branch.

## Required browser evidence after page sync

Community:
- desktop 1440/1024;
- tablet 768;
- mobile 390/360;
- no horizontal overflow;
- supplied hero asset stays light and matches `#F7EBD4` field;
- direct Community navigation works on desktop/mobile;
- all people/format/activity links resolve;
- Logic & Awareness opens from the top.

Workspace regression remains separately tracked in `QA-RUNTIME-0001-workspace-club-navigation.md`.

## Release rule

Production remains untouched until both:
1. Community/site reconciliation is complete in QA;
2. browser-level Workspace and Community regression evidence passes.
