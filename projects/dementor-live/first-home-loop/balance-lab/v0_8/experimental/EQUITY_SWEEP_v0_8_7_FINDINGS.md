# WORLD ORGANISM v0.8.7 · Fairness and Welfare Budget Sweep

19 October 2026. **Experimental shadow laboratory — NOT the historical v0.8 simulator; NOT game server code.**

## Verified execution

- [GitHub Actions #39296305875](https://github.com/SLADZARI/degradation_club/actions/runs/39296305875): **1068/1068 PASS** (22 published D30 snapshot checks; 374 prior shadow checks; 672 federation, welfare and equity tests). This confirms accounting, implementation and scenario invariants, **not** optimal welfare outcomes.
- [Full machine-readable sweep](RESULT_v0_8_7_EQUITY_SWEEP.json): 50 distinct `reserve ∈ {0,30,90,180,360}` × `weeklyCap ∈ {0,12,24,48,96}` × normal/dry environment scenarios; 20 synthetic daily agents, three synthetic cities, 360 further days.
- Per-citizen ledger now counts **eligible requests where a physical carrot is available**, successful support, denials, consecutive denial streak and food/economic outcomes. This corrects the prior misleading inference that “9 residents with no subsidies” all needed assistance.

## Normal climate comparison (+360 days)

| City reserve / weekly aid cap | Missed meals | Eligible denials | City PAPER at end | Worst resident missed meals | Worst denial streak |
|---|---:|---:|---:|---:|---:|
| 0 / 24 | 981 | 180 | 842 | 231 | 37 |
| 30 / 24 | 984 | 189 | 865 | 230 | 28 |
| 90 / 24 | 1004 | 249 | 925 | 239 | 28 |
| 180 / 24 | 1034 | 340 | 1013 | 249 | 36 |
| 360 / 24 | 1121 | 568 | 1289 | 271 | 36 |
| 90 / 12 | 1052 | 390 | 1125 | 254 | 13 |

**The reserve/cap settings are only TEST assumptions** and must not be copied as official gameplay values. A cap above 24 shows no further welfare improvement at this simulated workload. A smaller cap can shorten the *worst consecutive denial streak* even when it increases total missed meals: the queue and feedback loops need another fairness pass.

At **90 / 24**, 652 eligible food-support opportunities were recorded: 403 subsidized physical meals and 249 funding refusals. Exactly **0 residents with at least one eligible opportunity remained without any support for the entire year**. This is a stronger, more appropriately defined fairness metric than the old “9/20 received nothing,” but does not prove uniform access or acceptable waiting time.

## Risks revealed

1. **Poverty trap persists:** 28 consecutive funding denials can accrue to one eligible synthetic resident at 90 / 24. Aggregate treasury and median hunger do not capture it.
2. **Budget reserve trades welfare for liquidity**: the 360 / 24 variant saves 364 PAPER vs 90 / 24 but has 117 additional missed meals and 319 additional denials. No universal optimum follows.
3. **Dry climate needs physical supply reforms**: drought remains dominated by absence of actual CARROT, which PAPER subsidies cannot solve.
4. **Policy simulator is deterministic and synthetic**: prices, resident behavior, weather, treasury starting values, four city architectures and service demand remain assumptions; no actual player authorization, runtime persistence integration or original v0.8 agent suite has been replayed.
5. **Pareto ranking is multi-dimensional**, not just total hunger and final treasury. Full JSON includes all 50 runs; deduplicated two-dimensional frontier has 15 entries across climates, but worst-citizen hunger and denial streak should be included when selecting settings.

## Next design / test gate

- Implement *priority by accumulated eligible denials* with a deterministic fairness queue **without exceeding physical meals, owner payout, treasury floor or per-week budget**. Compare the same 50 settings and log worst streak, max hunger and per-player aid distribution; if parity worsens, revert.
- Test robust welfare support under 10–20 agents and 2–4 cities with inactive resident days and true drought.
- Design physically founded municipal revenue and local financing separately; adding subsidies does not create productivity.
- No deployment / PR merge / game world mutation until authoritative game source + original lab simulator reconciled.
