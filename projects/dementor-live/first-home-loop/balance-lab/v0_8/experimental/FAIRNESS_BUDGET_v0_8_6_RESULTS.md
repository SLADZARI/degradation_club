# WORLD ORGANISM v0.8.6 — Fair food access and safeguarded civic treasury

19 October 2026 · EXPERIMENTAL shadow only · not deployed · no canonical rule changes

## Run and reproducibility

GitHub Actions [#39295099127](https://github.com/SLADZARI/degradation_club/actions/runs/39295099127) **PASS 1014/1014**:
- original v0.8 published snapshot consistency: 22 checks (not original simulation source);
- v0.8.2 shadow model: 374 checks;
- federation + food and guarded quality gates: 618 checks, including **162 new guarded scenarios** across 2 participation profiles × 3 environments × 3 populations (10/15/20) × 3 city counts (2/3/4) × 3 horizons (+60/+180/+360 days).
- Both baseline v0.8.5 BASIC and new `cooperative-guarded` remain separate policy options; the original standalone v0.8 simulator ZIP is unavailable.

### Temporary policy assumptions, **not approved gameplay**

A synthetic owner-linked CARROT physically exists before sale; farmer receives 3 PAPER. A player with less than 3 PAPER can receive municipal assistance from already existing city balances. In BASIC each city can pay fully for **at most one zero-wallet meal per active day**. GUARDED adds:
- 90 PAPER minimum city reserve below which subsidies are refused;
- 24 PAPER maximum actual subsidy payout per city per game-week;
- the pre-existing rotating service queue;
- detailed, per-resident counters for needs, eaten meals, missed meals and subsidized meals. Personal counters reconcile with city and world ledgers every simulation tick.
- Full invariants: **3600 PAPER global**; no negative money; no phantom carrots; no negative escrow, duplicated shipment or raw asset creation; consent checks inherited from earlier shadow suites.

## Main matched comparison: 20 agents / 3 cities / +360 days

| Outcome | Direct farmer consignment | Cooperative 1–2 PAPER copay | BASIC zero-wallet meals | GUARDED basic + reserve + weekly cap |
|---|---:|---:|---:|---:|
| NORMAL unmet meals | 1471 | 1467 | **981** | **1004** |
| NORMAL missed due to no cash | 1138 | 1134 | 648 | 671 |
| NORMAL missed due to no goods | 333 | 333 | 333 | 333 |
| NORMAL city treasuries | 2065 | 1950 | 842 | **925** |
| NORMAL actual subsidy PAPER | 0 | 115 | 1209 | **1140** |
| NORMAL subsidized meals | 0 | 62 | 426 | 403 |
| NORMAL worst individual missed meals | 310 | 309 | **231** | 239 |
| NORMAL residents with no subsidy ever | 20 | 7 | 9 | 9 |
| DRY unmet meals | 1953 | — | 1615 | **1636** |
| DRY missed due to no cash | 1220 | — | 655 | 676 |
| DRY missed due to no goods | 733 | — | 960 | **960** |
| DRY city treasuries | 1785 | — | 731 | **810** |
| DRY actual subsidy PAPER | 0 | — | 1000 | **937** |

## Finding and interpretation

Guarded welfare keeps **83 more PAPER** in city treasuries than BASIC after one year, at the cost of **23 additional unmet meals**. In drought this is **79 extra PAPER for 21 additional unmet meals**. This is not an unambiguous quality gain. The 90-PAPER reserve and 24-PAPER weekly cap are *test parameters*, not balanced optimums. A future experiment should sample ranges and identify the Pareto frontier of welfare vs civic liquidity.

**Fairness:** 9/20 simulated residents never received subsidy in both BASIC and GUARDED. This alone does not prove discrimination: some might not qualify for it. A meaningful fairness test must count *eligible and refused requests per resident*, queue position, reasons (no food, cash, municipal reserve, weekly cap), and their worst-case waiting days. Aggregate hunger and a rotated queue are insufficient.

**Drought:** Keeping the municipal PAPER reserve cannot fix physical food unavailability. Dry-weather missed meals due to missing goods remain 960 in both BASIC and GUARDED. Water input, resilient agricultural production and storage are a separate mechanical problem.

## Next decisions

1. Add resident-level *eligible but denied* records and caps on consecutive refusals, then test accessibility fairness across the same calendar.
2. Parameter sweep for treasury reserve and weekly caps; publish the Pareto frontier (cost, additional meals, treasury risk, worst resident).
3. Replace synthetic willingness and permissions with authenticated actual player events before any production integration.
4. Verify current live game source version and reconcile its city-founding currency rule with federation-wide PAPER conservation.
5. Keep global economy and persistent save volumes untouched pending explicit game design sign-off.
