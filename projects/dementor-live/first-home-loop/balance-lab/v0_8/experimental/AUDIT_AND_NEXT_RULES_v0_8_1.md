# WORLD ORGANISM · v0.8 → Shadow Sustainability v0.8.1
**19.10.2026 · LAB ONLY · ORIGINAL v0.8 SIMULATOR NOT AVAILABLE · DO NOT DEPLOY**

## Test provenance and reproduction

- Original docs: [v0.8 README](../README.md), [D30 JSON](../BALANCE_CASE_v0_8_D30.json), [economic contract](../DEMAND_CONTRACT_v0_8_CANDIDATE.md).
- Published v0.8 claims 52/52 and 41/41 original invariants. Their source is in a separately delivered ZIP **not present** in this GitHub/Drive folder; we have **not replayed** those 52.
- Independent snapshot audit: 22 PASS: verifies accounting in the historical aggregate, not individual orders/consent.
- Shadow projection: 216 parameter combinations (3 policy regimes × 4 environments × 3 player counts × 3 forward horizons × 2 activity profiles) + 24 further half-year/year-long scenarios.
- Final verified workflow: [#39176577018](https://github.com/SLADZARI/degradation_club/actions/runs/39176577018), **22 snapshot + 267 experimental test = 289 PASS / 0 FAIL**.
- Real server was **not accessed with write methods**. The published v0.8 laboratory is not deployed. Public game at time of audit reports `0.3.0-rc.2`; current server SHA still requires verification.

Use Node 22:
```bash
cd projects/dementor-live/first-home-loop/balance-lab/v0_8
node --test tests/snapshot-contract.test.mjs
cd experimental
node --test shadow-model.test.mjs quality-gates.test.mjs long-run.test.mjs
node run-projection.mjs reports
```

Reproducible machine records:
- `RESULT_B4_SUSTAINABILITY_2026-10-19.json` — checked figures, scenarios, activity contrast and 180/360-day stress;
- `BASELINE_B0_108_SUMMARY.json`, `B1_PROPAGATION_108_SUMMARY.json`, `B3_CIVIC_CRATE_108_SUMMARY.json` — experimental traces, including rejected regressions;
- Actions artifact `world-organism-v08-shadow-216-plus-24-long-term-report` — 216 full JSON records plus long-term summaries.

**Do not cite shadow numbers as the original v0.8 simulator's game-balance facts.** Starting from published PAPER (3600 total, city 2301, player share 1299), original 3 facilities and leftover 4 HEMP, **all individual wallets, crop holdings, land resources, water, activity and new rules have been reconstructed as TEST assumptions**, not from a historical ledger.

## Three policies

1. **STATIC:** original city construction-completion orders have terminated; no new demand or project materializes without a new real need.
2. **UPKEEP:** hypothetical finite public-service events weekly; each facility posts new bounded demand for physical PAPER_SHEET and CARROT if escrow is funded. Each event has its own ID; original completion event is never replayed. **Weekly public events are a TEST hypothesis, NOT an existing server feature.**
3. **NEEDS-GROWTH:** same bounded service demand plus exactly two eligible new project types: pantry after verified spoilage, irrigation after verified unmet food. Both have wood/stone cost and work financed by the city, both change functionality. The model cannot secretly mint PAPER.

## 3 active agents, normal conditions, +90 days (checkpoint D30 → D120)

| Metric | STATIC | UPKEEP | NEEDS-GROWTH |
|---|---:|---:|---:|
| New constructions | 0 | 0 | 2 (pantry, irrigation) |
| Demand orders posted | 0 | 78 | 114 |
| Orders filled | 0 | 76 | 97 |
| Sheets physically produced and used | 0 | 37 | 40 |
| Missing household meals | 183 | 183 | **38** |
| Carrots spoiled | 174 | 174 | **35** |
| City PAPER left | 2301 | 1716 | **1456** |

**Important qualification:** only the final policy improves household nutrition; simply posting city buyouts is not sufficient. Making city crops in the player's 12kg bag backfired due to harvest/storage/seed bottlenecks; the final experimental producer stores market-bound food in a separate owner-linked **12-unit plot crate**. No silent transfers or unbounded storage; money moves only when an existing physical carrot is delivered. A player with no online session incurs no hunger debit.

## A/B iterations in the NEW shadow harness (not historical v0.8)

| Step | Change | D120 missing meals | Sheets used | Spontaneous conclusion |
|---|---|---:|---:|---|
| B0 | Fixed original TEST seed stock; pantry + irrigation | 84 | 4 | HEMP seeds exhausted |
| B1 | Separate biological hemp seed propagation, one civic bed | 53 | 39 | Household and civic demand compete for carrot seeds |
| B2 | Added second civic bed in personal bag | 124 | 38 | **Rejected:** extra crop crowds out household supplies |
| B3 | Plot-side civic crate, protected personal bag | 115 | 39 | Storage fixes did not cure shortage of carrot seeds |
| B4 | Separate finite 12-unit civic crate + experimental carrot-seed plant yield **6** | **38** | **40** | Better; number 6 remains an unapproved parameter |

D120 spoilage in B4 is 35 units from 327 grown; the low B0 waste total partly reflected lower production and must not be read as superior welfare. This is iterative engineering, not a controlled biological trial. The current quality gates explicitly fail if nutrition or sheet production regresses behind accepted B1 thresholds.

## Physical ledger and activity

Each simulation tick checks:
- `PAPER(city) + PAPER(players) + sum(order escrow) = 3600`; no positive/negative accounts.
- `order.escrow = remaining × unitPrice`, finite request ID, exactly one delivery payout and physically removed CARROT/PAPER_SHEET.
- All HEMP input, cultivated carrots, both seed types, physical sheets, water extracted+recharged, and wood/stone embodied in buildings have zero accounting residual.
- Six beds per synthetic grower, **12-weight portable inventory**, 12-unit plot-side civic crate, finite municipal construction materials.
- Synthetic P2P opt-in/offer/replay tests pass, **but no real two-browser or actual repeated P2P trades are simulated in the 216 forward runs**; consent of autonomous synthetic agents is not real player consent.
- Daily activity: 270 meal needs, 232 consumed, 38 unmet.
- Weekends activity: **78 meal needs, 62 consumed, 16 unmet**. None incurred on inactive days.

## +360-day stress (D30 → D390)

| Mode / environment, 3 daily agents | City PAPER | Unfunded attempts | Unmet meals | New buildings |
|---|---:|---:|---:|---|
| UPKEEP / normal | **0** | 4 | 723 | 0 |
| NEEDS-GROWTH / normal | **1** | **117** | 42 | 2 |
| NEEDS-GROWTH / dry | 1078 | 0 | **1069** | 2 |
| NEEDS-GROWTH / treasury shock | 2 | 307 | 723 | 0 |

PAPER remains 3600 globally in every scenario. In a NORMAL future year, the two needs-based improvements reduce hunger, but the city's PAPER migrates to individual sellers/workers and **does not return via a real payment for city services**. Once the city is unfunded, it stops creating demand instead of printing money. A dry year keeps some treasury because suppliers cannot fulfill many physically infeasible orders: it is not evidence of prosperity.

Wood-rich `forest` outcomes match normal welfare in the chosen horizon because only two functional constructions are registered and material stocks are not yet binding. **Simply generating more trees does not create meaningful new construction.**

## Integration blockers and candidate design rules

**P0 — closed money loop.** Design real, consented player-to-city value: actual service use, production facilities, land, transport, local market or finite taxes if governance explicitly authorizes them. No ad hoc weekly fee chosen to rescue a spreadsheet; no artificial city printing. Existing game candidate 0.3.0-rc.1 creates each new city with a fresh 1000-PAPER treasury — **separate potentially conflicting policy** with v0.8 PAPER conservation. Published 0.3.0-rc.2 source/behavior must be audited before integration.

**P0 — request-to-project registry.** A new construction must have:
1. measured need and source event;
2. functional role (what bottleneck it removes);
3. one-time ownership/permitted-city authorization;
4. finite physical materials and paid labor;
5. treasury reservation with refund/expiration rules;
6. lifecycle (under construction → operating → maintenance → possible replacement);
7. explicit production, resource consumption and wear, plus negative outcome tests.

Validated **prototype** cases: pantry addresses food spoilage (30 WOOD + 20 STONE + 50 PAPER for labor, freshness 1→3d), irrigation addresses water/food shortages (20 WOOD + 10 STONE + 60 PAPER for labor, +4 WATER/day). All these numbers and benefits are TEST values. Potential subsequent recipes must be triggered by measured logistics congestion, full warehouses, actual population growth, depleted natural resources, repair demand, or transport demand — not mere passage of time.

**P1 — biological and seasonal truth.** Seed-carrot propagation factor 6 produced a better synthetic result, but real agronomy/crop parameters, off-session growth, crop spoilage and water replenishment need approval. Dry case remains a serious gameplay dead end.

**P1 — agent-activity and P2P evidence.** Test actual real-client online presence, independent buyers and sellers, offer consent races, safe transfers, plot property, restart and crime board. The current simulator uses synthetic willingness, not legal player permissions.

**P1 — source completeness.** Archive the original standalone WORLD ORGANISM v0.8 JS/HTML runner, 52 tests, full event-ledger ZIP and SHA in GitHub or Drive, then rerun those exact cases and compare results; without those files this document cannot certify the historical D30 model.

**Recommendation:** Keep B4 as a **test laboratory** for balancing needs-based construction and finite municipal demand. Do not copy its numbers or implementation into the 0.3.0 game until the rules above are decided, published rc.2 source is reconciled, and full actual runtime QA passes. No production deployment has been performed here.
