# Dementor Live — Decision Register v1.0

**20 October 2026.** Distinguish user-approved direction from unresolved engineering implementation.

| ID | Decision | Class | Implementation state |
| --- | --- | --- | --- |
| DL-001 | One platform, shared 2D Engine; two independent gameplay directions CIVIC and UNIVERSE | APPROVED by user | Engine reconciliation PENDING |
| DL-002 | CIVIC: survive, earn, build cities, conserve physical resources and develop a shared economy | APPROVED product direction | Existing v0.4 source baseline, actual prod SHA unverified |
| DL-003 | UNIVERSE: physical navigable themed worlds, not website tile menus | APPROVED product direction | Experimental Forest/MentalHumor code, not deployed |
| DL-004 | One character identity, wallet, inventory and persistent authoritative transactions across connected directions | APPROVED target rule | Integrated proof PENDING |
| DL-005 | Common paper-cut style and the approved set of 20 UI icons in all supported versions | APPROVED canon | PNG binary import and QA PENDING |
| DL-006 | Incremental releases, no routine save resets, migration/backup/rollback gates | APPROVED release policy | Needs automated and operator checks |
| DL-007 | Third-party authored worlds require provenance/rights/explicit permission, no partnership claims | APPROVED publishing policy | Authorization workflow PENDING |
| DL-008 | WORLD ORGANISM model remains separate until actual Game/save/ledger integration passes | Technical safety decision based on existing QA | NOT INTEGRATED |
| DL-009 | CIVIC small Museum of Laughter to become gateway/preview for MentalHumor park/hall | PROPOSAL, not yet final content approval | Design and technical alignment required |
| DL-010 | New integration candidate may be branched from known v0.4 GitHub release, but does not replace deployed VM or real save | Preparation decision | Docs branch and empty integration branch only |

| DL-011 | Mobile COMBAT: larger shifted movement stick, semicircular action controls, neutral/aim/fire concentric hold zones, separate rifle/pistol cadence and automatic magazines | APPROVED product requirement 20 Oct 2026 | Implementation candidate PR #284, device acceptance PENDING |
| DL-012 | Tree planting: species-linked seeds, shovel soil prep, 3 growth stages, real-time growth and finite harvested wood | APPROVED product requirement 20 Oct 2026 | CIVIC personal-plot implementation candidate PR #284; public-space tree planting and UNIVERSE port PENDING |

| DL-013 | Multiple plots per character in one and multiple CIVIC cities, retained by character ID without forcing ownership of exactly one plot | APPROVED product requirement 20 Oct 2026 | Draft PR for core implementation; production release pending |
| DL-014 | Residential / business / universal zoning, public business by default; rental 1 PAPER/day with visible signage, on-site stocked public stall and escrow | APPROVED product requirement, anti-loss guard adopted | Prototype CIVIC implementation; trade/saved-goods QA pending |
| DL-015 | Mayor's office as in-game suggestion inbox with an offer every ~15 active-play minutes; first eligible letter earns 50 PAPER | APPROVED product requirement; anti-spam interpretation one payout per 24h | Prototype, reward treasury-funded, real email is NOT connected |
| DL-016 | Character gender selection at first entry for Russian forms of address, including unspecified option; forest/mountain terrain audit | APPROVED user-facing requirement | CIVIC implementation candidate, real phone and migration QA pending |

| DL-017 | Public physical payphones in scenes + searchable world subscriber list, six-digit character-number, 100-symbol pager message priced 1 PAPER; expensive 180 PAPER receiving pager | User requirement 20 Oct 2026 | CANDIDATE only; no telephony or external SMS; multi-city server-authoritative receipts |
| DL-018 | Second bridge must not exist as walkable/finished before its own materials and work are completed; first bridge unaffected | User requirement 20 Oct 2026 | Server + client collision gated by secondBridgeProject stage; save migration QA pending |
| DL-019 | Minimal building silhouettes vary within same paper canon; same board shape with distinct purpose pictograms; university/Valentina excluded | User requirement 20 Oct 2026 | Candidate visuals, device screenshot review pending |
| DL-020 | Shared gameplay/video QA protocol for Евгений and Женя with separate timed server event file and synchronization markers, no message bodies or tokens | User requirement 20 Oct 2026 | Opt-in QA recording on isolated server, export test-mode only |

## Supersession / conflict records

- Existing runtime AGENTS.md on v0.4 allows emojis for UI. New approved PAPER CUT UI canon disallows substitutes for the 20 approved icons. Canon supersedes emoji guidance for those IDs; deployment is still pending.
- Existing CIVIC world contains museum (20×16) and Farlands; UNIVERSE MentalHumor is distinct park (80×60) and hall (20×17). These are not identical objects or verified equivalent scenes.
- v0.4 expanded world and UNIVERSE both touch world.mjs, life.mjs and public/app.js. Cherry-picking without reconciliation is NOT APPROVED.
- The git release candidate version and latest VM version can differ. Keep separate fields until observed independently.

## How to change decisions

Append a new dated entry with author, source link, impact (ENGINE/CIVIC/UNIVERSE), superseded decision, migration needs and current QA/deployment evidence. Never silently erase old decisions or rewrite experiments as already shipped.
