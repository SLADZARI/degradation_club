# DEMENTOR LIVE — GA04 DESIGN DECISION PACK FOR GDD v0.2
Date 2026-10-17 | CANON REVIEW ONLY. No choice below is automatically approved. Each proposed decision requires explicit acceptance, source owner, dependent rule revisions and future REAL server tests.
Evidence: GA04 code + JSON, 39 synthetic runs /507 repeated invariants, 27-system traceability matrix, issue register CC-001..059.

## D-001 PAPER currency/material identity — REQUIRED before economy implementation
A (RECOMMENDED): PAPER = immutable integer units in server monetary ledger; PAPER_SHEET = physical resource stack; manufactured sheets can be sold for PAPER but NEVER minted by crafting.
B: physical certificates with approved minting and redemption; significantly complex monetary policy.
Cost to approve: update ECONOMY/RESOURCE/PRODUCTION/MARKET/WORK/LAND and explicit CITY emission/funding.

## D-002 Two crop fibers and recipe provenance
A (RECOMMENDED): HEMP_FIBER and FLAX_FIBER are separate Items with matching recipes and tracking from harvest.
B: generic PLANT_FIBER only if SAME price/time/water recipe regardless of crop origin, or provenance-tagged variants.
Test exploitation case CC-028: original generic fiber allowed alternative recipe saving 14L water per 24 sheets.

## D-003 Treasury funding of 100 simultaneous novices
A (RECOMMENDED): reserve funded onboarding obligations per admitted cohort; public enrollment queue with fair acceptance and funded city entitlement, no silent mint. On 100 simultaneous players and 80+4×90 payments each, up to44,000 PAPER may be due before plot/cabin receipts return (TEST).
B: unlimited city-controlled emissions must be explicitly recorded (inflation and alt-account controls).
C: staggered intake/disbursement using collected city sale receipts; 100 players at30-minute intervals with10k CITY passed synthetic but NOT proof of acceptable wait/playtime.
Required: decide actual city treasury starting amounts, source of PAPER, budget policy, stock replenishment and anti-abuse constraints.

## D-004 Starter material and first operating finance
A (RECOMMENDED): one-time finite city starter kit 6 WOOD+4 PAPER_SHEET physically reserved before irreversible building expense; mandatory starter/extra paid job or legal gathering covers first farm cash gap17 PAPER (20 remaining after cabin, estimated first cycle needs37 PAPER).
B: players buy materials and do extra normal jobs to close 18 PAPER cabin material shortfall + first production costs.
C: communal starter toolbench/initial materials after physically recorded tutorial completion.
Note: city stock kit for20 cannot serve100 people regardless of treasury. All grants must be idempotent and preserve material origin.

## D-005 Fair first-market access
A: allow smaller city/communal physical drop-off lot6 sheets with a visible logistics price or personal carry (RECOMMENDED to TEST). Seven-day 100-player GA04 min16 →15 sellers/100 and370 sold. Min6 →27 sellers/100 and436 sold. Even min6 leaves73 players without sale. Need book city budget and receiving capacity before transit.
B: funded first-sale tutorial buy order per newcomer at small size (e.g.6 sheets) with fixed one-time budget and city physical demand/storage; 100×6×3=1,800 PAPER city reserved if all players use it (TEST), plus actual transport/human labor.
C: all players trade only freely; weaker tutorial guarantee but may be consistent later in life-cycle.
Do not imply the 6-sheet first order is net-profitable by itself: seed cost for four plants and water/maintenance can precede it. Need verify complete harvest-to-sold24-sheet cycle and money held in escrow, not just moment of payout.
Critical open: city daily quota64 sheets shared across everyone insufficient for100 once-off 6-sheet sale in a single day without explicit separate onboarding buyer budget/quote.

## D-006 Municipal water source and producer capital
A (RECOMMENDED TEST): shared source120L/h TOTAL district, physical source meter, connection cap, 40L plot tank and 10L/2 PAPER packets; connection & district priority fairness to be tested with simultaneous work.
B: scalable source based on number of users/property fees, with clearly recorded finite municipal CAPEX and OPEX, not secretly multiplying120L/h per plot.
Shared workshop four slots is a provisional service, not proof each player owns a workshop. Choose municipal starter bench for tutorial or private facilities with real material and money CAPEX.
GA04 20-player fixture equipmentCAPEX=600 leaves20 WAIT_STARTUP after extra-job cap12 — affordability not established.

## D-007 Gate for beginning code implementation
1. Approved separate GDD canon and status per domain.
2. Character-first SVG source, 8 game views with one 3/4 camera, viable grounding and animation.
3. Stable World Unit↔Build Cell and 12×12 starter property path with doors.
4. Data owner/schema for ledger currency, items, market order/cargo, water and farm state; real database locks and retry.
5. Gameplay path for zero-to-first-purchase and zero-to-first-finished SALE verified by actual user actions, not clock-only job timers.
6. Public moderation and safety before public multiplayer.
No current toy fixtures count as code passes.

## Prioritized review sequence
Approve identity (D-001/D-002) → fund/stock onboarding (D-003/D-004) → municipal small-sale contract (D-005) → capacities/ownership (D-006) → actual rig/server implementation gates (D-007).
