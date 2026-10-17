# DEMENTOR LIVE — GLOBAL AUDIT ROUND 05 · START HERE
**2026-10-17 · REVIEW / SYNTHETIC CHECKED · USER APPROVAL PENDING**

GitHub: https://github.com/SLADZARI/degradation_club/tree/docs/dementor-live-global-audit-05/projects/dementor-live/audit/round-05
Google Drive: https://drive.google.com/drive/folders/11EJ6s_x6WN6zqYTM72Baq7cQR7p4WYYC

Project boundary: own 2D Dementor Live life sandbox, NOT Dementor Battle / Robo Games. Frozen v0.1 remains unchanged. A new test model is not approved new GDD or functional game code.

## Read in order
1. Round05 full audit: https://docs.google.com/document/d/18fF9JAUKQI9FiCb9FmC9LnKsM7eN-H-Bsjd9TmOanbg/edit
2. Core GDD v0.2 (draft) for MONEY, RESOURCE, WORK, QUEST, LAND, BUILD, FARM, PRODUCTION, WATER, TIME, MARKET, TRANSPORT, AUTOMATION, TECH, RELEASE: https://docs.google.com/document/d/1UOEPzp5qAI-TDzGEgVl_k8Sdj8b4LosKUmjz9S8UGGc/edit
3. GA05 decision review (not approved): https://docs.google.com/document/d/1fyg0s2ezq1XFDoz8yimzZ4EoaOKmFK7DYCN6T5_gE_s/edit
4. GA05 27-system traceability/closure matrix: https://docs.google.com/document/d/1dcN8TEUGf-xosMPH4ntq3NWPUPCfSNCMoWpQILm0qHg/edit
5. New CC-060..067 (cumulative review ledger CC-001..067): https://docs.google.com/document/d/10EP3HWkK9dOw-hYtSm1BHNvfvnT6vx6IXZP-3vSL8iU/edit
6. Target real server integration tests (36 tests NOT RUN): https://docs.google.com/document/d/1dBIx_jXbIzn4aViOOApYIzOaHK-5sVCRJF99Y_8LE6A/edit

## Reproducible files
- first_sale_unified_city_simulator.js — extends GA04 shared treasury+parcel+wood+seed+water+factory+warehouse+physical cargo+escrow with one-time FIRST_6 funded buyer.
- first_sale_stress_results.json — 31 new cohort/threshold cases, 496 repeated invariants PASS in synthetic model (not game).
- first_sale_test_runner.js — no-dependency Node runner, 47 runner assertions verified in equivalent JS execution; GA04 base regression16 scenarios retained.
- GA05_UNIFIED_CONFIG_CATALOG.json — 57 test parameter IDs with units/provenance; new seven: mode/6qty/1800 budget/128 hub cap/32 sheets per hour/7-day TTL/0 shipping fee for first sale.
- GA05_FUNDED_FIRST_SALE_AUDIT.md, GDD_v0_2_CORE_CONTRACTS_CANDIDATE.md, GA05_GDD_v0_2_DECISION_REVIEW.md, GA05_27_DOMAIN_CLOSURE_MATRIX.md, ISSUES_CC_060_067.md, GA05_REAL_INTEGRATION_ACCEPTANCE_RUNBOOK.md.

## Principal findings (GA05 TEST ONLY)
- Baseline GA04 city quota and min shipment16: 0/100 first sales within day1, 15/100 within7d.
- Funded six-sheet one-time city offer: 96/100 settled by1 REAL day, 100/100 by7 days under 50k treasury with a city buyer hub and 1800 offer budget.
- 100/7d physically delivered600 PAPER_SHEET to tutorial hub and settled1,800 PAPER by genuine city transfers; no PAPER mint.
- Median first-sale time in successful100/7d synthetic cohort =915 real minutes/15h15, **not accepted usability target** and far longer than early accessible short gameplay sessions.
- Offer budget900 yields50 funded first orders, hub processing0 yields only21 complete physical consignments, TTL60min expires all100 offers, treasury10k with100 simultaneous people cannot fund tutorial jobs. Exposing those limits and consequences is mandatory.
- For first SIX sheets, test player pays at least22 PAPER (seeds16, initial city water packs4, one stage maintenance2) before CITY payout18, excluding labor/tooling and with remaining hemp resource. First SALE != first positive cash flow or full profitability.
- All proposed economics depend on approval of PAPER vs PAPER_SHEET, HEMP vs FLAX fiber, municipal PAPER origin and physical demand, starter material grants and workshop access.

## Review and next
Issue count is 67 *review items* across GA01..GA05, not confirmed 67 bugs.
27/27 chapters have an editorial traceability row and inherited source baseline, but **0/27 full long-form GDD v0.2 chapters are yet approved**. Source long-form chat export still pending.
No real PostgreSQL/RLS/durable checkpoint test or final SVG character rig tested in GA05. Character-first gate remains before engine/runtime.
Next GA06 should prioritize an enjoyable FIRST 30/60/90 REAL minute narrative/interaction proof, source artifact completion for all27, and user acceptance of decision choices D01–D11; then bridge to actual game implementation when art/architecture gate is ready.
