---
artifactId: dementor-club.operations.projects-public-media-fallback-g6-2026-09-21
project: dementor-club
documentType: QA_EVIDENCE
projectStage: VALIDATION
gate: G6_VALIDATION
status: PASS
version: 1.0
updated: 2026-09-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentIssue: 228
---

# STAB-05 · Projects Public Media Fallback · G6 validation

## Result

`projects-public-media-fallback-v1`

Scope:

`STAB-05 / BQA-21`

## Exact identity

Production baseline:

`440ebce65efc46831a5736fc74a9bf798bf991d5`

Integration branch:

`result/projects-public-media-fallback-v1`

Validated candidate:

`581468fbf4b2b321bd2c2a16bd9e65a9e12e3a4f`

Draft PR:

`#234`

Canonical CI:

`Site Integrity / Release Readiness #1232`

Run id:

`35660069754`

Conclusion:

`SUCCESS`

## Source verification

External source inspected before corrective:

`https://www.youtube.com/shorts/dWokndhJLKQ`

Observed:

- YouTube page loads;
- title shown: `Важен процесс`;
- player reports `Video unavailable`;
- no functioning public playback affordance;
- no age restriction, geo restriction or login requirement observed.

Verdict:

`SOURCE_UNAVAILABLE`

Therefore STAB-05 followed the authorized unavailable-source branch: collapse/remove the inert video promise rather than adding an embed that cannot play.

## Corrective

Canonical owners remain:

- `projects/index.html`;
- `projects-hub-v2.css`.

Behavior:

- removes the large black 9:16 media frame;
- removes the broken external YouTube `VIDEO ↗` link;
- adds one compact explicit unavailable state;
- no iframe/video runtime;
- no autoplay dependency;
- no dead keyboard-focusable media control;
- no second project-media system.

Existing regression owner extended:

`scripts/validate-projects-v2-browser.mjs`

Coverage now includes:

- desktop Chromium 1440;
- mobile 390;
- mobile 360;
- compact unavailable media state;
- no legacy 9:16 empty frame;
- no broken YouTube source link;
- no iframe/video runtime;
- no dead focusable controls;
- bounded fallback height/width;
- reload stability;
- existing canonical Header/routes/overflow/history/hash checks.

## Validation history

Initial CI #1231 found one validator-only copy assertion issue: `textContent` concatenated words separated by `<br>`.

Runtime UI was not changed in response.

The existing validator was corrected to inspect visible `innerText`.

Final CI #1232 passed.

## Build-output evidence

CI log confirms:

```text
GitHub Pages production candidate ready for https://dementor.club at .../_site
Projects v2 browser regression PASS:
fresh-top + Logic hashes + history restoration + no overflow +
mobile heading fit + canonical shell/routes on 1440/390/360 +
BQA-21 unavailable-media fallback/reload contract.
Production route manifest passed: 34 indexable routes · 17 private/compat routes · 1 disabled routes
```

Production artifact release gate also PASS.

## Boundary

No changes to:

- Project entity semantics;
- Board projections;
- Current Program;
- BQA-22 Project creation;
- Contribution;
- Membership / DC-9;
- auth;
- storage / RLS;
- BQA-20 generic media pipeline.

Schema mutation: NO.
Semantic mutation: NO.
Change Proposal: NO.

## G6 verdict

`PASS`

Eligible for G7 release-candidate precheck.
