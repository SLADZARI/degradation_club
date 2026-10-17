# DEMENTOR LIVE — GLOBAL AUDIT ROUND 04 / START HERE
**2026-10-17 · Round 04 integrated city · SYNTHETIC REVIEW COMPLETE, GDD v0.2 APPROVAL PENDING**

[GitHub Round 04](https://github.com/SLADZARI/degradation_club/tree/docs/dementor-live-global-audit-04/projects/dementor-live/audit/round-04/)
[Google Drive Round 04](https://drive.google.com/drive/folders/1QBM6s5Px94OTgRreIcezLLksX1B6cojr)

This is an isolated docs/test branch inside the parent Dementor Club repository. It DOES NOT modify the game executables, the approved 2D character-first policy, or the immutable GDD v0.1.
No game runtime, actual 2D engine, real PostgreSQL transaction, client input, networking or visual SVG animation was executed here.

## Read these documents
1. [GA04 main report](https://docs.google.com/document/d/1M8CH1E8o3AuezQJFfLpcDV9A4-_lfxC3LPRSa-28PPY/edit) — one city, money/stock/water/workshop/courier procurement and major findings.
2. [All 27 systems cross-checked on same fixture](https://docs.google.com/document/d/1SyD5NsMg4k9XlHrIU9mQf49UshPuvo5O4nySnsJgkq8/edit) — per-domain evidence and missing work.
3. [CC-053–CC-059 cross-check issues](https://docs.google.com/document/d/1L-UdB0dL6apjzeeu5rQzVWmUzYf3jW9I2GMFONspMH4/edit) — seven additional design findings, cumulative CC-001..059.
4. [GDD v0.2 review decision pack](https://docs.google.com/document/d/1DNnoY0oWQlrWQG17nIbaxl8kRNZFJU0EaDYYrO8LDmg/edit) — choices, preferred proposals, prerequisites and approval gate.

## Machine-verifiable data
- `unified_city_simulator.js` — deterministic 1-minute unified ledger of treasury, onboarding, land/build starter kits, seed farming, 120L/h shared district water, workshop slots, city quota, physical deliveries and escrow.
- `unified_city_test_runner.js` — standalone Node.js checks, execute in this directory: `node unified_city_test_runner.js`.
- `unified_city_scenarios.json` — 16 integrated cases ×13 repeated invariants = 208/208.
- `unified_city_sensitivity_results.json` — 11 variants ×13 repeated invariants =143/143.
- `integrated_market_fairness_results.json` — 12 shipping-minimum variants ×13 repeated invariants =156/156.
- `GA04_UNIFIED_CONFIG_CATALOG.json` — 50 numbered TEST values tagged with source/units/owners, no hidden approvals.

## Main findings
- 100 first-day crafters physically have >=6 PAPER_SHEET each, but zero sellers because the paid city shipping minimum is16 sheets.
- 100 farmers over7 REAL days: 2,868 sheets produced and370 city-buyback sheets delivered; 15 players sold any,85 sold none.
- Lower shipping lot16→6 changes delivered to436 and unique sellers15→27 for100 users over7 days; even this leaves73 no-sale suppliers.
- 100 simultaneous newcomers with treasury10k fail to purchase first houses because wages are due before plot receipts; 100 staggered newcomers with same10k can complete on7d fixture via money recirculation.
- Shared municipal water (120L/h TOTAL) has measurable congestion; adding four→20 community workbench slots doesn't increase throughput in100-user7d base, increasing city quotas and physical stock changes different bottlenecks.
- TEST equipmentCAPEX600 with 12 extra work cap leaves 20 users unable to begin production. Actual CAPEX of machines/storage/roads/pumps, character work and production travel remains unknown.
- City cash, player cash and escrow + physical WOOD, seeds, HEMP, water and PAPER_SHEET all conserved in 507 repeated model checks; this does NOT establish a balanced economy.

## Status and caveats
**39/39 synthetic cases completed with 507 repeated invariant passes.** The same 13 checks run against multiple scenarios; not 507 different features. The runCity function produces identical results on repeat with identical settings. No durable DB checkpoint/resume tested.

**27/27 GDD domains cross-reviewed** against one common parameter catalog, but NOT 27 signed-off comprehensive v0.2 long-form documents. All numeric models are TEST, proposed changes to paper identity/fiber, city minting, city purchase policy, fairness, equipment and SVG pipeline remain OPEN.

## Next practical gate
User review for decisions D-001..D-007 → reconcile 27 domain-owning chapter specs with formal source IDs, then develop character-first 2D SVG and a real authoritative server ledger with crash/reconnect tests. A subsequent GA-05 may evaluate starter market guarantee and funding with full journey and urban supply queue.
