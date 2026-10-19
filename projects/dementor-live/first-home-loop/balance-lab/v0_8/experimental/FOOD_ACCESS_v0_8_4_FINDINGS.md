# WORLD ORGANISM v0.8.4 — Food access experiment
19 October 2026 — isolated SHADOW MODEL, not canonical game, not original v0.8 source.

## Objective
Prior v0.8.3 comparison, 20 active agents, 3 towns, 360 simulated days:
- municipal purchase: 2312 missed meals, 679 due to no money and 1633 due to no food;
- farmer-owned consignment: 1471 missed meals, 1138 due to no money and 333 due to no food;
- both kept 3600 PAPER globally.
Thus, consignment improves real supply (−841 total missed meals) but worsens cash accessibility (+459 missed meals from insufficient spending power).

## Candidate v0.8.4
Third `foodMarket='cooperative'` policy:
- farmer owns harvested CARROT until paid and receives 3 PAPER per unit;
- citizen pays full price if balance >=3; with 1–2 PAPER, municipality MAY cover the exact missing 1–2 PAPER using existing nonnegative treasury, never printing money;
- a resident with 0 PAPER remains unsupported under this version (explicit open flaw);
- if municipality has no funds, this assistance is unavailable;
- physical carrot is removed once per meal, actual grower receives proceeds, all other physical goods remain ledger-accounted;
- self-consumption of own produce, other town services and real transport are retained.

This is a design experiment, not an approved price/subsidy policy. Real players have not consented to a welfare/taxation mechanism.

## Testing evidence
- [Early QA #39286864342](https://github.com/SLADZARI/degradation_club/actions/runs/39286864342): **839/839 checks PASS** (22 published v0.8 aggregate consistency tests, 374 prior shadow tests, 443 federation tests including 81 new cooperative parameter cases).
- [Expanded comparison #39286963150](https://github.com/SLADZARI/degradation_club/actions/runs/39286963150): 486 trajectories, 3 market policies x populations 10/15/20 x 2/3/4 cities x 3 weather types x local/trade x +60/+180/+360 days. **At authoring, run queued; NO outcome or improvement claim yet.**
- PR #270 is DRAFT, no merge or deployment; production game saves untouched.

## Acceptance / rejection criteria
1. All 486 scenarios PASS resource and money conservation, no negative treasury or wallet, no unbacked food.
2. Compare normal/dry/wet 20 agents/3 towns/+360 days under identical environment for `municipal`, `consignment`, `cooperative`: total missed meals, no-money vs no-food, treasury, subsidy spending, real deliveries, buildings.
3. A meaningful reduction in financially missed meals that is sustainable at +360 days is needed; a subsidy that depletes city budget and reduces agriculture is REJECTED.
4. Zero-wallet residents, actual unemployment, unfair subsidy queues, captured farmers, spoilage and off-session consumption need separate tests. Basic assistance for an entirely broke resident is NOT solved by this candidate.
5. Never promote synthetic results to the deployed live game without source-SHA parity and real multiplayer QA.
