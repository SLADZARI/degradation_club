---
artifactId: dementor-club.evidence.current-program-projection-g8-2026-09-15
project: dementor-club
documentType: QA_EVIDENCE
projectStage: CLEANUP
gate: G8_CLEANUP
status: APPROVED_EVIDENCE
updated: 2026-09-15
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.current-program-projection-v1
---

# Current Program Projection v1 — G8 closure evidence

## Release evidence

Final validated implementation head:

`6708b517d8404f8af68b413eef7f9d179c933ecc`

Full Site Integrity / Release Readiness #1182 — PASS on that exact head.

PR #208 was merged into `dementor-club-production` as:

`7054c5c7cf3ccfb6cc15875e6c2db5c825a5cd75`

The merge commit records parent `6708b517d8404f8af68b413eef7f9d179c933ecc` and explicitly states merge occurred after full exact-head CI PASS #1182.

The initial Current Program production deploy succeeded, and the later Board Mobile Harmonization corrective preserved Current Program semantics while fixing mobile composition. The final live production state containing both Current Program and the corrective is production commit:

`48a18b5567804d29219efcea217b846f1ebdd675`

Deploy Dementor Production #85 / Actions run `35020704474` — SUCCESS.

Build logs confirm exact checkout of `dementor-club-production@48a18b5567804d29219efcea217b846f1ebdd675` before build and production release validation.

Pages artifact: `10417765961`.

Artifact digest: `sha256:627cb5797efb4fc9587b2a0c27bf53a1ec55caa5ad376f796e557e57a759cae5`.

GitHub Pages deploy reported SUCCESS.

## Current Program invariants preserved

Released Current Program remains exactly the reviewed three-Thing composition:

1. `Деньги на ветер` — ready to take → `/courses/dengi-na-veter/`;
2. `Dementor Lab` — public project presentation, not a playable release → `/projects/dementor-lab/`;
3. `Фуэнхирола` — PLANNED event projection → `/events/fuengirola/`.

The Board corrective did not change this truth or composition.

Program Things remain separate from raw Board Artifacts and spatial persistence. No `data-artifact` identity, Artifact coordinate ownership or raw Board-activity promotion was introduced for Program Things.

No payment/Merch commerce, Membership redesign, automatic programming of Board activity, Telegram programming automation, broad schema migration or recommendation AI was introduced.

## Mobile corrective relation

Post-release owner evidence identified a real mobile presentation defect: Workspace chrome and Current Program composition did not fit harmoniously at phone widths.

That finding was handled in the separate presentation Result `dementor-club.result.board-mobile-harmonization-v1`, rather than silently widening Current Program semantics.

The corrective passed full CI #1188, merged in PR #210, deployed in clean manual deploy #85, and preserved Current Program truth and render ownership.

Focused 390 / 360 acceptance then proved all three Program cards visible simultaneously inside the mobile viewport without turning Program into an Artifact rail or changing the shared projection source.

Project-owner post-deploy live smoke on 2026-09-15: PASS. Owner explicitly confirmed the corrected live Board is normal.

This satisfies the live mobile evidence that remained open after the initial Current Program release.

## G8 inventory

- PR #208 is merged/closed; `result/current-program-projection-v1` is historical integration state only.
- shared `current-program-v1.js` remains the single Current Program composition/projection source for Home and Board.
- `home-current-program-v1.js` remains the Home projection renderer.
- `community/board/board-program-v1.js` remains the Board Program renderer.
- no second Thing ontology, universal `dc_things` table, alternate analytics click owner, compatibility runtime or temporary feature flag was introduced.
- regression validators are retained deliberately as QA coverage.
- the later mobile harmonization layer changes composition only and does not become a second Program semantic owner.

## G8 conclusion

Current Program Projection v1 has sufficient evidence for closure:

- exact implementation head validated;
- production merge identified;
- Current Program is present in the current production ancestry;
- current production commit was exactly checked out, built and deployed successfully in #85;
- Pages artifact/digest recorded;
- desktop/mobile regression evidence preserved;
- mobile presentation defect corrected in a separately scoped Result;
- project-owner post-deploy live smoke PASS;
- no semantic, database, Membership or commerce scope drift occurred.

`dementor-club.result.current-program-projection-v1` may move to APPROVED / completed history at G8.
