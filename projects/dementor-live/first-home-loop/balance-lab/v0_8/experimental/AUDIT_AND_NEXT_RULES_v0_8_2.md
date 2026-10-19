# WORLD ORGANISM v0.8.2 · Sponsored civic services and functional building registry

**19 October 2026 · EXPERIMENTAL_SHADOW_NOT_ORIGINAL_NOT_SERVER · NO DEPLOY**

This is a follow-up to [v0.8.1 shadow sustainability audit](AUDIT_AND_NEXT_RULES_v0_8_1.md) and the historical [WORLD ORGANISM v0.8 contract](../DEMAND_CONTRACT_v0_8_CANDIDATE.md). The original v0.8 ZIP/JS engine remains unavailable; **the original 52 tests were not replayed**. Starting inventory other than the published D30 aggregate was reconstructed synthetically. No live accounts, stored game world, public server, or canonical GDD were written.

## Reproducible evidence

- CI: **[396/396 PASS — #39272266100](https://github.com/SLADZARI/degradation_club/actions/runs/39272266100)**. 22 independent original-D30 aggregate checks plus 374 tests of the experimental shadow model.
- Test breadth: 288 policy × environment × agents × activity × horizon cases, plus 36 +180/+360 day projections. Machine output: [RESULT_B5_SPONSORED_SERVICES_2026-10-19.json](RESULT_B5_SPONSORED_SERVICES_2026-10-19.json). Full scenario records are published in the CI job artifact.
- No inflation, no material loss, no negative escrow, no over-capacity civic crates or personal inventory: conservation asserted on **every simulated daily step**, not only summary.
- Earlier rejected balance trials are preserved in B0/B1/B3 summaries. No unapproved pricing/recipe is presented as canonical.

### Run locally with Node 22

```sh
cd projects/dementor-live/first-home-loop/balance-lab/v0_8
node --test tests/snapshot-contract.test.mjs
cd experimental
node --test shadow-model.test.mjs quality-gates.test.mjs long-run.test.mjs sponsored-services.test.mjs project-registry.test.mjs
node run-projection.mjs reports
```

## Experiment: one sponsored civic session

- A simulated *active and consenting* citizen voluntarily authorizes 17 PAPER to run a city service (TEST numbers). Identity must match the actor, and the `accepted:true` guard is required. This is **NOT secure proof of real user authorization**; the future server must use authenticated actor identity and a user-confirmed request.
- 12 PAPER reserved for 1 real PAPER_SHEET; 3 PAPER reserved for 1 real CARROT; 2 PAPER in **separate municipal service-fee escrow**. City cannot book the 2 PAPER by merely publishing an advertisement. Initial city treasury is not debited to create a citizen-backed demand.
- Suppliers deliver actual physical goods. Only then escrow moves to the supplier. Both items must be fulfilled before the city earns the 2 PAPER fee. The consumed paper/food is recorded as material participation in a public session.
- If orders expire, unused item escrow and the entire unearned 2-PAPER city fee return to the original sponsor. A partially served event is recorded as PARTIAL, not wrongly counted as complete.
- Every session/facility/week has a stable ID; repeated event booking or acceptance cannot charge twice.
- City revenue in this experiment is **real PAPER transferred from participating citizens**, not a new mint. Citizens pay for the concrete registered event; participation is optional. Agents' willingness to spend is an **unverified synthetic assumption**.

The money equation now includes both separately recorded supplier and fee reserves:

```
PAPER(city) + PAPER(players) + Σ(remaining supplier escrow) + Σ(pending service-fee escrow) = 3600
```

## Construction: reusable functional registry

`project-registry.mjs` defines the need, material cost, municipal labor payout, policy eligibility and functional effect for each candidate, rather than allowing an unbounded random-building generator.

| Building | Measured trigger | Physical function | Test-only WOOD / STONE / PAPER wages |
|---|---|---|---|
| Pantry | Carrots spoiled | Extends food preservation | 30 / 20 / 50 |
| Irrigation | Active resident meal needs unmet | Expands booked external water supply | 20 / 10 / 60 |
| Community hall | Willing citizens cannot book existing event slots | Adds 1 funded civic session venue per week | 22 / 10 / 45 |
| Reading room | Further unserved willing civic visitors | Adds 1 more funded civic venue | 20 / 12 / 55 |

All materials and labor money are transferred to physical structures and working players once. Project eligibility is **rechecked after each build** to avoid overcommitting the same treasury or materials. Unregistered objects cannot spontaneously appear. A future content generator must extend this registry only with a real demand signal and measurable functional impact.

Critical design limitation: in this synthetic test all active agents with ≥17 PAPER are considered willing sponsors. Hence `serviceRequestsUnserved` is *assumed* interest, not measured player interest. Genuine UI intent, participation rules, attendance/utility and server-side actor auth must be specified and verified before integration.

## Final 360-day comparison: normal, 3 daily agents, D30 → D390

| | v0.8.1 upkeep | v0.8.1 needs-growth | v0.8.2 sponsored-growth |
|---|---:|---:|---:|
| Original city treasury at D30 | 2301 | 2301 | 2301 |
| City treasury at D390 | **0** | **1** | **2345** |
| Unfunded attempts to post orders | 4 | 117 | **0** |
| Registered new buildings | 0 | 2 | **4** |
| Unmet active meals | 723 | 42 | **33** |
| Complete sponsored public events | 0 | 0 | **127** |
| City fees from **completed** events | 0 | 0 | **254** |
| Global PAPER | **3600** | **3600** | **3600** |

The sponsoring model's city treasury is exactly **2301 − 210 real building wages + 254 earned event fees = 2345 PAPER**. All other trading funds remain with players or in escrow; **14 PAPER** remains in escrow from an unfinished near-horizon event. 256 physical delivery orders were posted, 255 item orders were filled, 127 two-item events were fully completed.

This is a **different fiscal model, not proof that charging ticket fees is inherently better**. In the sponsored policy, consumers finance the physical event supplies themselves; the city no longer spends its own treasury on those orders. Comparing it to municipal procurement mixes the origin of demand and payer as intentional scenario changes. All figures and prices are provisional.

## +90 days, normal world

Daily, 3 agents: 20 completed sponsored events, 40 PAPER in earned city fees, and 3 needs-backed new constructions (pantry, community hall, irrigation). Remaining treasury: 2186 PAPER; unmet food 33. Daily, 5 agents: 25 completed sponsored events and 4 buildings (including reading room). 37 willing requests could not be serviced at existing capacity before expansion.

Weekend-only, 3 agents: 16 complete and 3 PARTIAL sessions, **42 PAPER refunded** for undelivered assets or unearned fees; 12 unmet active meals. No offline hunger penalty and no automatic fee for a session that was never authorized.

## Residual risk and false conclusions to avoid

1. **Dry weather still fails welfare:** for 3 daily agents in +360-day dry stress, 603 active meal needs are unfulfilled. A profitable city with hungry residents is not healthy. Water demand/source ledger, rainfall capture, storage, irrigation efficiency and famine protection require separate design.
2. **No infinite building supply:** four projects are justified and unique, but there is no registry entry for a fifth genuine need. Adding random buildings or fake paid orders to keep the skyline growing would weaken the economy.
3. **Synthetic opt-in ≠ actual player consent:** the tests reject missing `accepted:true` and cross-account `actorId` mismatches, but real authentication and interaction have not been integrated. Model conditions are not enforceable user permissions.
4. **No free financing when interest is absent:** someone unable or unwilling to buy a service does not generate an order. Support for important noncommercial infrastructure will still require legitimate town funding (donations, service rents, parcel sales, approved user governance, etc.).
5. **Physical service utility needs a design decision:** the lab treats consumed CARROT and PAPER_SHEET as a delivered public meeting and tracks that utility. In the game, visitors should actually get an experience/benefit (public bulletin, food at event, attendance reward if properly justified). Avoid merely routing money through a fictional meeting.
6. **Live integration mismatch:** The earlier 0.3.0-rc.1 game source created each city with 1000 new PAPER at founding, potentially contradicting a global no-mint design. Before transport to game code verify the currently deployed release SHA and city issuance policy; run real multiplayer and persistence tests.

**Recommended next gate:** design a genuine player-triggered service UI / authenticated booking with asset-level escrow, then run separately (a) economic stress, (b) real active/inactive sessions, (c) civic venue attendance/benefits, (d) 5–20 players and multi-city cross-transfer. Keep this research branch separate from the production game and keep all treasury/resource data untouched.
