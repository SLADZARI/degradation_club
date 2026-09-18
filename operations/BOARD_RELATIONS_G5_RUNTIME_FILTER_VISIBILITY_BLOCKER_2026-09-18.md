---
artifactId: dementor-club.evidence.board-relations-g5-runtime-filter-visibility-blocker-2026-09-18
project: dementor-club
documentType: QA_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: BLOCKER_EVIDENCE
version: 1.0
updated: 2026-09-18
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-relations-v1
candidateCommit: e7fe4606e5ce4fe4369b7d791a451e92751f1a49
validationRunId: 35328652669
validationRunNumber: 1220
validationConclusion: FAILURE
blockingStep: 48
liveDatabaseMutation: false
productionMutation: false
---

# Board Relations v1 — G5 runtime filter visibility blocker

## Verdict

**G5 RUNTIME CONTRACT BLOCKED**

Exact candidate:

`e7fe4606e5ce4fe4369b7d791a451e92751f1a49`

Site Integrity:

`#1220 / 35328652669 = FAILURE`

Static/schema/runtime contract checks passed. Browser acceptance step 48 failed before reaching the drag assertion.

## Read-only corrective review

Compared with blocker candidate:

`cc8b2f51ca9dc1f4bdc53dd0210834404bc8ef1c`

The corrective keeps canonical owners unchanged:

- `community/board/board-spatial-v1.js` unchanged;
- `community/board/board-layout-v2.js` unchanged;
- `community/board/board-fullscreen-v2-1.js` unchanged;
- `community/board/board-own-drag-livefix-v2-2.js` unchanged;
- `workspace/board/index.html` unchanged.

No new click owner, drag owner, detail shell, modal, drawer, coordinate owner, or layout owner was introduced.

Relations remain presentation-only for coordinates: the runtime still reads existing card `style.left/top` and does not persist or calculate Board layout ownership.

The corrective is limited to relation line reconciliation:

```text
before:
remove all SVG relation lines
recreate all relation lines

after:
reuse line node by relation_id
update visibility/coordinates in place
remove only stale relation ids
```

QA was updated to count only visible relation lines.

## Exact failing assertion

Step:

`48 — Validate Board Relations v1 browser acceptance`

Failure:

```text
page.waitForFunction: Timeout 30000ms exceeded.
scripts/validate-board-relations-runtime-browser.mjs:239
```

Exact assertion at candidate head:

```js
await page.waitForFunction(
  () => document.querySelectorAll('.dc-board-relation-line:not([hidden])').length === 0,
  {timeout: 3000}
);
```

This occurs immediately after:

```text
open type filter
→ select artifact
→ expect every relation line with a hidden endpoint to become hidden
```

The test never reaches the later canonical drag assertion in this run.

Therefore:

```text
drag/detail suppression status = UNRESOLVED / NOT EXERCISED IN #1220
filter-line visibility assertion = BLOCKER
```

Do not infer from #1220 that the previous drag/detail blocker has been fixed.

## Diagnostic interpretation

The canonical filter owner still sets endpoint cards with:

```text
card.hidden = true
card.classList += dc-board-filtered
dispatch dc:board-filter-changed
dispatch dc:board-layout-request
```

The relation owner still listens to those canonical events and recomputes line presentation.

The new reconciliation path sets SVG line visibility with:

```js
line.hidden = !visible;
```

while the QA/CSS contract observes the SVG `hidden` **attribute**:

```css
.dc-board-relation-line[hidden] { display:none }
```

and:

```js
.dc-board-relation-line:not([hidden])
```

The exact run proves that the expected visible-line count never reached zero. The evidence supports a mismatch in the new line visibility/reconciliation path; it does not support an architecture or ownership failure.

No corrective is authorized by this evidence.

## What passed before the blocker

On exact candidate `e7fe4606...`:

- Board Relations schema contract: PASS;
- Board Relations runtime static contract: PASS;
- canonical shell/build/JS syntax: PASS;
- Board mobile harmonization: PASS;
- public harmonization: PASS;
- Projects browser regression: PASS;
- DC-9 sync browser regression: PASS;
- Board v2.1 fullscreen browser matrix: PASS;
- Board live corrective browser acceptance: PASS;
- Board navigation/adaptive-card acceptance: PASS.

## Boundaries

After #1220:

- `dementor-club-production` remains exactly `2dae3b6ece79652c81af780c049521fda7262726`;
- `dementor-club-site` remains exactly `61d85d95bd95dfb536acdd363b45d2773a4b2ca5`;
- live Supabase migration ledger remains 56 migrations;
- live Supabase max migration remains `20260916213500_evidence_hygiene_v1`;
- `public.dc_board_relations` is absent live;
- Board Relations read/create/delete RPCs are absent live;
- PR #225 remains OPEN, DRAFT, UNMERGED.

Therefore:

```text
LIVE DB UNCHANGED
STAGING UNMERGED
PRODUCTION UNCHANGED
PR #225 DRAFT / UNMERGED
```

## Gate consequence

Result remains **ACTIVE / G5_BUILD**.

Runtime validation remains blocked at `RUNTIME_CONTRACT_VALIDATION`.

No Supabase apply, staging merge, production merge, deploy, G6 release work, new owner, new detail shell, or automatic scope expansion is authorized by this evidence.
