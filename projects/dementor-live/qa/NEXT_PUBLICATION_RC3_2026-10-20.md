# Next publication intake · Dementor Live 0.5.0-rc.3

**Status: staged, not published.** This branch is a new next-publication candidate derived from the latest release base at `4e60e6cea2aa8a89cf9447ca590ae958e4dcc0c4`; the verified QA fixes from #289 are included without discarding newer release-base history.

| Required scope | Source file | Acceptance |
| --- | --- | --- |
| No trapping when a new building appears | `runtime/world.mjs` | `dynamic-footprint-evacuation.test.mjs`, browser forge chain |
| Accurate mobile tap → route → input → arrival | `runtime/test/mobile.cjs` | Gate 01 |
| Current mobile panels, close buttons and controls | `runtime/test/compact-panels.cjs` | Gate 02 |
| In-world object selection/actions | `runtime/test/playtest-actions.cjs` | Gate 03 |
| Inventory/tool durability and building materials | `runtime/test/inventory.cjs` | Gate 04 |
| Estate acquisition and mayor interactions | `runtime/test/browser.cjs`, `runtime/test/estate-mayor-ui.cjs` | Gate 05 & 07 |
| Physical save, upgrade & cross-city IDs | `runtime/test/persistence.cjs`, `runtime/test/rc2-cross-chain.test.mjs` | Gate 06 |
| Full two-player story, square→forge→food→help→restart | `runtime/test/browser.cjs` | Gate 07 |
| Preserve icons/world, verify next package | `runtime/tools/verify-rc3-release.mjs`, `runtime/deploy/publish-preserve-world.sh` | Version, source and safe publish CI |

**Only** deploy a 40-character SHA that has passed all CI checks on this exact branch; publishing any earlier `0.5.0-rc.2` image would omit these fixes. No automatic production job is part of this candidate.

**Operator handoff and rollback:** [RC3 safe release runbook](../runtime/docs/RELEASE_0.5.0_RC3_SAFE.md). Existing real world/volume is not used or written by GitHub Actions.
