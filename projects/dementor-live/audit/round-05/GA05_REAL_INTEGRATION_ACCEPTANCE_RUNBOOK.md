# DEMENTOR LIVE — GA05 END-TO-END ACCEPTANCE RUNBOOK
2026-10-17. Target for actual independent 2D runtime, NOT a claim tests are currently implemented or passed.

Synthetic evidence: 31 fixture cases×16 repeated laws=496 checks PASS in JavaScript model; 47 assertions in independent GA05 smoke runner passed; this is not a server integration suite.

Mandatory gate order: Character SVG8 views accepted → data owners/monetary policy approved → implementation of ledgers → real multiplayer tests → GDD v0.2 APPROVED/VERIFIED by owner.

Every real test report requires build SHA, environment, test account type, data revision, start/end ledgers, expected/actual, screenshots/logs if relevant, status, bug link, retest timestamp and owner.

Status of every REAL-001..036 below: NOT RUN. Synthetic findings are supporting design inputs only.

## FINANCE_AND_ENTITLEMENT

- [ ] REAL-001 | 100 simultaneous accounts under city initial 10k PAPER: budget shortfall is explicit; no unpaid promise or negative city wallet.
- [ ] REAL-002 | 100 staggered job entrants: money received from legitimate land sales can finance later jobs, but time-to-job and fairness logged.
- [ ] REAL-003 | City reserve 18 PAPER for FIRST_6 once; double-click same EntitlementId has no second hold.
- [ ] REAL-004 | 50 funded offers if offer budget=900; 51st request receives clear WAIT_BUDGET, no fake quote.
- [ ] REAL-005 | Issuance only via approved MINT authority, crafting SHEET changes no PAPER supply.
- [ ] REAL-006 | Cancel an unaccepted offer returns CITY funds precisely once; after accepted pickup no immediate refund.
- [ ] REAL-007 | Client drops during CITY hold creation/commit: transaction eventually visible or rolled back, not half-written.

## PHYSICAL_GOODS_AND_PRODUCTION

- [ ] REAL-008 | Starter plot receives exactly6 WOOD+4 PAPER_SHEET from finite CityStarterWarehouse; duplicate claim rejected.
- [ ] REAL-009 | 100-player simultaneous starter-kit claim against20 kits: only20 sets reserved, no other player loses cash.
- [ ] REAL-010 | HEMP recipe cannot use FLAX_FIBER, alternate generic fiber doesn't bypass water costs.
- [ ] REAL-011 | One HEMP harvest requires seeds and water; another concurrent process cannot spend same last 10 liters.
- [ ] REAL-012 | PAPER_SHEET production stage finish with full output buffer: either reserve capacity beforehand or pause without deletion.
- [ ] REAL-013 | After workshop disconnect/output return player/city physical quantities remain conserved.
- [ ] REAL-014 | 100 farmers in one district head demand shared120L/hr; not 100×120L/hr.
- [ ] REAL-015 | Source intake/meter billing/city water stock follows actual dispatched milliliters; fractional rounding never prints PAPER.

## MARKET_TRANSPORT

- [ ] REAL-016 | 6 real sheets in seller warehouse generate single funded CityPurchaseOrder, with city escrow and receiving capacity hold.
- [ ] REAL-017 | Courier picks exactly6 sheets from original ContainerId; one cargo manifest, one custodian.
- [ ] REAL-018 | First-sale city hub capacity128 and consumption32/hour: under heavy load queue is visible, none teleported.
- [ ] REAL-019 | Zero hub consumption: hub stops after21 complete 6-sheet parcels; 79 claims remain funded/WAIT_INTAKE.
- [ ] REAL-020 | Offer TTL60min (if configured) expires before first sale without phantom currency; UX must warn and give re-issue path.
- [ ] REAL-021 | Cancel seller after pickup / buyer delivery race: exactly one terminal payout or dispute/return, no duplicate.
- [ ] REAL-022 | Ordinary city demand cap64 sheets/day cannot be reused as independent budget without a separate funded municipal buyer.
- [ ] REAL-023 | 100 first-sale payments carry600 physical sheet stock into the municipal city workflow; disposition is real and explainable.
- [ ] REAL-024 | Paid standard transport qty16 vs6: fee/hour/travel are real, and first sale remains accessible without hidden teleport.

## TIME_GAMEPLAY_VISUAL

- [ ] REAL-025 | First home from real player keyboard/touch interactions not just seven-minute wage timers; courier path proof verified.
- [ ] REAL-026 | 30min /60min /90min /24h /7d first-sale cohort progress, including median/p90 and 0-sale population.
- [ ] REAL-027 | Real time governs crops and offer TTL; accelerated World Time affects NPC sun only.
- [ ] REAL-028 | Offline equivalent to online same-world event log; restarting between escrow debit and payout cannot double settle.
- [ ] REAL-029 | Avatar sprite ground anchor/8 views match 2D high3/4 reference, camera and BuildCell scale under one unit contract.
- [ ] REAL-030 | Physical 12×12 plot supports player/door/routed cargo access and municipal workshop journeys without overlapping hitboxes.
- [ ] REAL-031 | One shared city source under 100 users fairly allocates capacity and exposes WAIT_WATER vs error event correctly.

## SECURITY_OPERATIONS

- [ ] REAL-032 | Auth/RLS prevents other player selling somebody's stock or changing CITY wallets.
- [ ] REAL-033 | Admin grant/mint operations auditable; no public RPC can credit money by spoofed salary or item event.
- [ ] REAL-034 | Anti-alt entitlement policy is explicit and privacy-preserving; cannot receive100 free kits from one allowed identity.
- [ ] REAL-035 | Moderator block/invite and property boundaries cannot be bypassed by first-sale quests.
- [ ] REAL-036 | All 27 chapters have source, APPROVED/PROPOSED/TEST status, dependency, version and real test evidence before release gate.

## Exit criteria
- All correctness and security tests in FINANCE / RESOURCE / MARKET / TIME must be PASS on the actual server; launch blocked for P0 fails.
- Visual gate must be satisfied before selecting final engine/runtime, according to accepted START HERE.
- Product target for first-sale time must be user-approved; 915 min median from current toy model must not be silently declared acceptable.
- City's first-sale physical PAPER_SHEET consumption must have a believable destination (office/printing facility) with actual item and money ledger; no permanent sink by unstated fiat.
- 27 full chapter texts still to be aligned and reviewed; this runbook is a target, not a replacement.