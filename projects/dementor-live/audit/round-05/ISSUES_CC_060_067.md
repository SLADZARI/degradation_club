# DEMENTOR LIVE — CROSSCHECK CC-060..CC-067
Date 2026-10-17 | GA-05 | Status OPEN. Cumulative issue IDs CC-001..067; not 67 live bugs. Evidence: first_sale_unified_city_simulator.js and first_sale_stress_results.json, 31 fixtures ×16 invariants, test-only.

### CC-060 [ECONOMY/MARKET/QUEST; P0 ECONOMY GATE] Beginner first purchase requires extra public money and physical demand
A funded six-sheet beginner CityPurchaseOrder adds 18 PAPER per player, or1,800 PAPER for100, and600 additional physical sheets accepted by the city. These are real treasury commitments in the TEST, not new PAPER emission; if there is no believable city consumption/use of600 sheets the service is a disguised unlimited demand sink.
Candidate: define limited municipal education/printing input demand with actual recipes, budget source, hub capacity, one-time eligibility; allow alternative player buyer. NOT APPROVED. Gate: city cannot issue order if not funded, every city paper input has a documented physical disposition.

### CC-061 [GAMEPLAY/WORK; P0 FIRST LOOP] Seven-day completion is not acceptable proof of early progression
100 simultaneous novices with FIRST_6 funded:96 first sales in the first24 real hours,100 within7 real days; median successful payment in seven-day test at915 real minutes (15h15). Four miss day-one target, and no true player movement/work steps were modeled. An onboarding quest needing 15 hours is at odds with earlier 35–60 min first-home target and short session design.
Candidate: enforce first-sale time budget such as 30–90 min as a proposed target only after measured user flow; add smaller manual accessible recipe/city pickup and physically verified actions; test 1/20/100 users on real path.

### CC-062 [MARKET/TRANSPORT; P0] First-sale quote expiry and shipment crossing boundaries
Set offer TTL60 REAL minutes: 100 funded offers allocated, all100 expired before any could deliver paper, exactly zero special settlements. Money was returned correctly but gameplay promise was false. Once cargo is accepted, expiry cannot release escrow; receipt/courier disconnect must preserve in-transit commitment.
Candidate: separate offer start and delivery deadline; expiry starts only after realistic recipe/access can be fulfilled or is renewable with funded rules; never expire after pickup without dispute state.
Gate: competing expiry/pickup/retry tests, meaningful time limits.

### CC-063 [MARKET/WATER; P1] Receiver throughput makes guarantee conditional
With first-sale hub capacity128 and processing32 sheets/real hour, 100 contracts physically deliver by seven-day test; capacity128, zero processing ⇒ only21 receive six sheets each (126 stock), 79 remain held, with1,422 PAPER locked; no logistics or city intake for the rest.
Candidate: approved municipal consumption/transfer recipe and capacity planning, water/power/labor, queue fairness telemetry. Gate: city first-sale backlog and cash obligations bounded.

### CC-064 [ECONOMY/QUEST/PRODUCTION; P0] First six sheets are not initially cash-profitable
City payout6×3=18 PAPER; before first-six-sheet sale the TEST farm needs4 seeds=16 PAPER, water16L in2×10L city packs=4 PAPER, one paper batch upkeep=2 PAPER, total cash outlay22 PAPER excluding equipment, labor and delivery. The first crop's unprocessed HEMP remains a genuine future asset, so this is a cash-timing/working-capital issue, NOT a complete profit calculation. First house leaves20 PAPER; extra30 paid courier job is used by the GA05 simulator.
Candidate: funded job/proven material-gathering before production, communal workshop availability, explicit first batch costs, no negative wallet or counterfeit mint.
Gate: true user-controlled first sale + source transaction proofs.

### CC-065 [ECONOMY/WORK/SOCIAL; P0] Starter city trust and entitlement requires anti-alt rules
The offer is one-time per CharacterId in the toy; players may create many characters/accounts in a real multiplayer product. For100 fresh claims, initial starter job/paper funds plus1,800 PAPER buyer commitment and kits impose city budget/stock risks even if aggregate currency conserved.
Candidate: one-time moderated eligibility and anti-abuse under privacy/age policy, transparent reentry/refund on failed attempts, no intrusive ID collection assumption. Gate: 100+ concurrent claims, duplicate requests, legitimate households unaffected.

### CC-066 [MARKET; P1] Onboarding procurement quota and open market quota are distinct
100 first-sale offers receive separate demand independent from the ordinary city quote64 sheets/REAL day. Under test, total seven-day city purchases952 PAPER_SHEET for100 participants versus370 with no first-sale assistance, of which600 physically consumed by the education buyer hub. Without clearly documented distinct public need, the city turns from market-maker into artificial sink that can mask later weak real demand.
Candidate: budgeted city-project requirement, total municipal PAPER demand ledger shared across departments, teacher/office production recipe, citizen alternative markets.
Gate: aggregate city demand finite in all accounts and a truthful user-visible quota.

### CC-067 [TECH/TIME; P1] Demonstration of conservation is not durable exactly-once transaction validation
GA05 has16 invariant assertions per scenario and a baseline code rerun; it doesn't actually test PostgreSQL locks, event cursor, crash between city offer hold and physical reservation, cargo theft/loss or concurrent user registration against the same last city PAPER. Funds held at building stage, transferred to escrow at dispatch and settled after15 virtual minutes; any real implementation must prove these are atomic/resumable with retries.
Candidate: idempotent OfferId, TxId, ContainerReservationId; isolation/rollback/fault injection, compensating expiry transaction. Gate: real SQL+websocket concurrency, offline snapshot parity, negative tests.

## Ownership and acceptance
CC-060 ECONOMY/MARKET; CC-061 GAMEPLAY/WORK; CC-062 MARKET/TIME; CC-063 WATER/MARKET; CC-064 ECONOMY/PRODUCTION; CC-065 SOCIAL/SECURITY; CC-066 CITY_TREASURY/PRODUCTION; CC-067 TECH/TIME.
For any closure: user decision or explicitly approved test policy + full owning chapter changes + source/units and dependent crossrefs + test plan + actual evidence. No Round05 finding is closed merely from a passing synthetic invariant.
