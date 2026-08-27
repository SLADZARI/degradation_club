# Design Audit — Batch 5B / Route & Course Owners

Date: 2026-08-27
Branch: `design-audit-batch-2026-08-27`

## Goal

Finish the remaining route-owned and course-owned cascade cleanup as one batch, while preserving explicit accessibility invariants.

## Scope

The sweep was generated from the current runtime style graph (34 scanned HTML routes/components). Global shared layers were excluded from automatic route-owner cleanup. `accessibility-v1.css` was explicitly protected from mechanical weakening.

## Result

30 route/course owner stylesheets were checked. 10 contained `!important` and were cleaned to zero:

- `catalog-v1.css`: 1 → 0
- `community-v2.css`: 3 → 0
- `course-bridge-v1.css`: 39 → 0
- `courses/dengi-na-veter/course.css`: 5 → 0
- `courses/dumai-s-opasnostyu/course-shell.css`: 3 → 0
- `courses/dumai-s-opasnostyu/production.css`: 1 → 0
- `courses/slaboumie-i-otvaga/course.css`: 12 → 0
- `dementor-profile.css`: 3 → 0
- `design-system/ui-lab-v2.css`: 4 → 0
- `support-v1.css`: 1 → 0

All other route owners were already override-free.

## Accessibility exception

`accessibility-v1.css` keeps its 8 intentional `!important` declarations. These enforce contrast invariants for the acid surface and inherited foreground color. They are treated as accessibility policy, not layout pressure.

The permanent audit fails if:

- any route/course owner regains `!important`;
- the accessibility contract marker disappears;
- acid foreground/background protection is weakened.

## Evidence

Machine report: `artifacts/design-batch5b-route-owner-report.json`
Permanent gate: `scripts/audit-route-owner-sweep.mjs`

## Status

Batch 5B complete. Production branch is unchanged. Next work should move to remaining shared cross-route systems rather than reopening route-specific override cleanup.
