# WORLD ORGANISM v0.8.5 · Zero-wallet basic food experiment
19 October 2026 · research-only shadow simulation · no production deployment

## Reproducibility
- CI **844/844 PASS**: https://github.com/SLADZARI/degradation_club/actions/runs/39287978446
- Snapshot aggregate checks: 22 PASS; older v0.8.2 shadow checks: 374 PASS; federation + food policy tests: 448 PASS. Original historical v0.8 JS suite (52 checks) still not available.
- 486 baseline matched municipal / direct consignment / co-operative 10–20-agent trajectories. The new `cooperative-basic` mechanism additionally ran fixed adversarial tests and 9 year-long climate/population scenarios. The previous 486-run JSON does **not** include the new fourth policy; avoid describing it as a full 4-way 648-scenario factorial analysis.
- Shadow rules, synthetic willing agents, prices and wallets are TEST assumptions. None reflects authenticated live player decisions.

## 20 agents, 3 cities, 360 additional days

| Metric | Consignment | Cooperative (1–2 PAPER copay) | Cooperative-basic (plus one zero-wallet funded meal per city/day) |
|---|---:|---:|---:|
| NORMAL missed meals | 1471 | 1467 | **981** |
| NORMAL cash-related missed meals | 1138 | 1134 | **648** |
| NORMAL no-food missed meals | 333 | 333 | **333** |
| NORMAL municipal treasury | 2065 | 1950 | **842 PAPER** |
| NORMAL meal subsidies | 0 | 62 | **426** |
| NORMAL full zero-wallet city-funded meals | 0 | 0 | **366** |
| NORMAL total subsidy cost | 0 | 115 | **1209 PAPER** |
| DRY missed meals | 1953 | 1950 | **1615** |
| DRY cash-related missed meals | 1220 | 1213 | **655** |
| DRY no-food missed meals | 733 | 737 | **960** |
| DRY municipal treasury | 1785 | 1730 | **731 PAPER** |
| DRY full zero-wallet city-funded meals | 0 | 0 | **318** |
| DRY total subsidy cost | 0 | 61 | **1000 PAPER** |

## Decision

**Accept for additional LAB testing only** — more residents can access food, but costs are high, and drought shifts failure from unaffordability to true physical shortage. Not approved for the game economy. One fully covered 3-PAPER meal/city/day is a deliberately hard cap; this is not a guarantee for every zero-wallet citizen. Service queue rotates by day to reduce persistent first-player privilege.

Prioritize:
1. Add long-term city budget guardrail and municipal revenue mechanisms grounded in actually provided services — do not mint new PAPER.
2. Under drought, address water source, storage and crop yield before raising subsidies: no-food misses rise to 960.
3. Full fairness measurements for each resident (distribution of subsidized meals, variance of wallet and hunger), and a matched 4-policy/648-run test matrix.
4. Genuine player opt-in and ownership/permissions when eventually integrated with live runtime. No files or saves on the production game server were modified.
