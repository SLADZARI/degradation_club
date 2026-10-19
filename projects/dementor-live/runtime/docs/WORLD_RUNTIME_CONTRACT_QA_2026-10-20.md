# Dementor Live · P0 world runtime contract cross-check

20 October 2026 · **QA BRANCH ONLY** · no deployed server or production save changes

## Which code was actually tested

Base: `feature/dementor-live-world-expansion-p0-2026-10-19`, **not** the synthetic `WORLD ORGANISM v0.9.1` scene graph. Direct imports under Node 22:

- `runtime/world-expansion-adapter.mjs` and `runtime/world-expansion.mjs`
- `runtime/world.mjs` (actual `Game.command`, `Game.snapshot`, player state and city treasury)
- `runtime/test/world-expansion.test.mjs` (existing checks)
- `runtime/test/world-runtime-contract.test.mjs` (new real-runtime checks)

[GitHub Actions #39332679792](https://github.com/SLADZARI/degradation_club/actions/runs/39332679792): **17/17 PASS**, comprising 6 existing world-expansion tests and 11 new tests, 0 failure.

## Observed implementation state

| Mechanic in expanded world design | Runtime observed | Status |
| --- | --- | --- |
| World area 5× city target, public bridge, forests and mountain obstacles | Actual `walkable` and terrain geometry | TESTED in Node |
| Tourist kiosk purchases and PAPER treasury transfer | Real `touristBuy` command; one-time map; repeat `requestId` result persisted in player results | TESTED in Node |
| Museum and farlands with exhibits and return portals | Scene state, portal access, snapshot and round-trip | TESTED in Node |
| Resuming after restart | `structuredClone` of current game state, rehydrate Game, same player token | TESTED in Node; **not** durable disk or crash test |
| Active courier and combat blocking world gate | Delivery/combat flags rejected by real `worldUse` | TESTED for blocked flags, **not** for full live courier/combat sessions |
| University +20 slots | `university-site` is a preview; not a graduation gameplay implementation | NOT IMPLEMENTED here |
| Robo Games venue | `robo-stadium-site` is a preview | NOT IMPLEMENTED here |
| Manufacturing / agriculture expansion | `industry-site` is a preview | NOT IMPLEMENTED here |
| Real co-op combat | Not performed by these tests; separate Combat Alpha P0 module/branch | NOT VERIFIED |
| NPC-worker/mayor private ownership/professions and economy | Validated previously only by isolated v0.9.1 shadow model | NOT INTEGRATED in this runtime check |

## Proven constraints and remaining defects/risks

- Current command idempotency is implemented in player `results` array limited to last **128 request IDs**. A **replayed consumable purchase after 128 later actions** may be charged again. That is not necessarily invalid if a client deliberately buys the same consumable again, but a repeated network request must not be accepted as a new purchase; use persisted stable transaction ID with explicit retention/expiry. Current test only checks replay within history and through in-memory state rehydration.
- P0 tourist purchase gives treasury PAPER from a wallet and therefore does not mint it; world total PAPER conservation across every other income and **city-founding path has not been certified** by this test suite.
- `worldTravelAction` checks per-player current scene target, proximity and active courier/combat blockers; there is no real pathfinding or end-to-end on-screen walk assertion in this Node run.
- `museum` and `farlands` are real separate scene records. Woods and mountains in the expanded city are **obstacles and paths**, not independent persisted `forest` / `mountains` scene IDs. Do not equate the synthetic `city→forest→ruins` story graph with actual runtime world scenes.
- From the world-expansion P0 source, the map purchase is an owned boolean, shirts and souvenirs are owned quantities, but stock is not yet a finite physical production/delivery chain.
- No direct code merge or copy from speculative v0.9.1 into the world runtime is appropriate until persistent CharacterId, mayor authorization, actual courier custody, physical NPC behavior, PvE authoritative combat and city money policy align.

## Next acceptance gate

1. Add **durable request ledger** for tourist consumable commands and persistent transaction history beyond the 128-result replay cache; document intentional separate purchases.
2. Create an integration branch merging tested world-expansion and Combat Alpha source compatibility (same CharacterId / scene / command route) only after verifying exact base SHAs; include adversarial two-player regressions.
3. Test actual courier offer→accept→pickup→travel→deliver with authoritative stock and budget, not hand-populated `delivery` fixture flags.
4. Browser / mobile device walkability acceptance: two crossings, path to museum and farlands, return portals and touch viewport; cover interrupted courier/combat sessions and reconnect.
5. Validate mayor city ownership and origin of minted treasury before any WORLD ORGANISM economic implementation.
6. Only then add the multi-actor v0.9.1 story loop behind feature flags, with isolated test world and **zero writes to live user saves**.

**Final status**: ✅ actual Node module-level world travel + kiosk regression. ❌ not a live, deployed, online multiplayer, browser or PvE runtime acceptance.
