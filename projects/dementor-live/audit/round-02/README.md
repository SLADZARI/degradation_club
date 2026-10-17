# DEMENTOR LIVE — GLOBAL AUDIT ROUND 02 / START HERE
Date: 2026-10-17 | Status: DESIGN & SYNTHETIC SIMULATION DONE, P0 CANON APPROVAL OPEN.
Parent: GDD v0.1 frozen / GA-01 documented; GA-02 isolated branch docs/dementor-live-global-audit-02. Not Dementor Battle / Robo Games.
GitHub: https://github.com/SLADZARI/degradation_club/tree/docs/dementor-live-global-audit-02/projects/dementor-live/audit/round-02
Google Drive: https://drive.google.com/drive/folders/1boQ19wMZdr8cH0O4iDUb32uUKmvkJytz

## READ THE EXECUTED WORK FIRST
1. FINITE_ECONOMY_AUDIT_REPORT.md — 24 limited budget/stock/city demand scenarios, 1/7/30 real days, 1/20/100 players, finite supplies and outcomes. 24×8=192 invariant checks PASS in independent JS toy model (not game runtime). Report: https://docs.google.com/document/d/1qHMqGfMi7J9qkm6N0NeL8xMjza1z-OkAuyffNO13G0Y/edit
2. finite_economy_simulator.js + finite_economy_results.json — fully reproducible minute-step model input/output.
3. finite_economy_simulator_v0_2_backpressure.js + backpressure_comparison_results.json — 16 comparison cases of automated safety against unrestricted spending.
4. finite_economy_simulator_v0_3_reserved_orders.js + market_reservations_comparison.json — booked municipal city purchase order + escrow and rotating seller priority in 30-day examples.
5. order_reservation_smoke_test.js + order_reservation_results.json — 10/10 SYNTHETIC checks, incl. shipment still in flight with 96 PAPER escrow and 32 sheets reserved at day boundary, zero demand/budget/warehouse, fair allocation.
6. starter_plot_12x12_grid_validator.js + starter_plot_12x12_results.json — 1 viable logical 12×12 plot, 5 objects, footprints55, 89 free cells, each accessible from street; NOT real WU scale/art collision. Report: https://docs.google.com/document/d/15pi1bnAIr1261ajMlvHWPG_75xMBKfcO9NQzaszn9ig/edit

## DESIGN DOCUMENTS FOR REVIEW
- MARKET_CITY_BUY_ORDER_CONTRACT_v0_2_CANDIDATE.md — atomic city demand/escrow/physical delivery conditions, user approval pending. Drive: https://docs.google.com/document/d/1ENxGNnBk9B79NSGs8R5Naz-BCyKtX5ysJLEWVJKXuxA/edit
- AUTOMATION_BACKPRESSURE_v0_2_CANDIDATE.md — proposals for spend, inventory and plant stop; not approved. Drive: https://docs.google.com/document/d/1OAvTpuk3LmlPFN_ctl5i4pQU--TdY1arDsbm12gnB5A/edit
- ISSUES_CC_041_045.md — new findings on runaway spending, supply queue, shared water, missing CAPEX and telemetry. Drive: https://docs.google.com/document/d/1kYYpAy-dW_t1wdcM6vOMNWr-2UBLKTGd6B7m5wsv1Hs/edit
- BALANCE_CONFIG_CATALOG_v0_2_CANDIDATE.json — 46 named config values with unit/source/test status. Drive summary: https://docs.google.com/document/d/1EYj11uSYiFvVvMPkckjwunTcbpbHnui4GF6jXoI-o68/edit
- GDD_v0_2_CORE_RECONCILIATION_CANDIDATE.md — domain-owned proposed patches to Economy, Resource, Farm, Water, Production, Automation, Market, Time, Work, Quest, Land. Drive: https://docs.google.com/document/d/1-9XFDvKJ8gHqH73q9d2-QsVVyinVodkek_2uI_f0CqY/edit

## New verified-model findings (NOT game implementation)
Limited demand starves active autosow: one mature-farm HEMP starts500 PAPER, city buys max64 sheets/real day. Baseline: after7d production348, sold192, cash0; with proposed backpressure:576 produced,448 sold, cash1022; after30d baseline stuck at348/192/cash0, backpressure2040/1920/cash3256.
100 farms with same total city demand (64/day) compete: no booked order/backpressure base 64 had zero sales in30d, with booking+rotation 30 had zero sales. This is scenario-specific improvement, not fairness proof or guarantee of economic sustainability.
City treasury conservation held in synthetic checks. Shared CITY water backbone NOT simulated; dedicated city utility service per farm assumed.
Source provenance remains GA-01; 27 source chapters only summarized in persisted first GDD, full original discussion needs official transcription/export to finish documentary audit.

## Status / closure
ROUND 02: documented and reproduced independent design-model outputs; design corrections proposed, no game server or real SQL stress proof. Total issue tracker CC-001..045 with 5 new CC-041..045, not a count of confirmed live bugs. No user approval for any new v0.2 rules, no 27 completed v0.2 chapters, no character SVG gate resolved.
Next: Round03 shared water graph + actual money issuance/treasury and full onboarding including kit, crop logistics, plot CAPEX/OPEX; then update per-domain v0.2 candidate texts and run DB transaction QA when actual game runtime exists.
