# QA-INTEGRATION-0002 — Community / site ↔ QA reconciliation

Status: PAGE_SYNC_COMPLETE_PENDING_BROWSER
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
- Community is a direct top-level navigation link.
- The stale `Community → People / Courses` dropdown is removed.
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

### Community page and CSS

Synchronized into QA from the approved `dementor-club-site` implementation without merging the branches wholesale.

Exact public blobs now used in QA:
- `community/index.html` → `97e697ab56105a9c0697e88f3eebbbd567bceb2f`;
- `community-v2.css` → `79f0648f620f6d5784e850949110a9f828adbf8e`.

The supplied hero asset was already identical on both branches:
- `assets/ink/community-hero-01.webp` → `4a96112bf5339510c27436609e67ba50f1705936`.

QA reconciliation commit: `e4e62ffd38ed41489a11f023f6ae9d195395e4d8`.

This means the QA candidate now combines the approved Community UX with the existing Workspace/Auth/System Tools hardening layer.

## Browser evidence still required

Community:
- desktop 1440/1024;
- tablet 768;
- mobile 390/360;
- no horizontal overflow;
- supplied hero asset stays light and matches `#F7EBD4` field;
- direct Community navigation works on desktop/mobile;
- all people/format/activity links resolve;
- Logic & Awareness opens from the top.

Workspace regression remains separately tracked in `QA-RUNTIME-0001-workspace-club-navigation.md` and still requires:
- `HOME → MY CLUB → HOME → MY CLUB ×20`;
- Activity / Profile / Work;
- anonymous `/workspace/`;
- console/network/session checks.

## Release rule

Production remains untouched until browser-level Workspace and Community regression evidence passes and the protected production candidate is explicitly approved.
