# DEMENTOR LIVE — DOCUMENT COMPLETENESS & DELIVERY MAP / GLOBAL AUDIT
2026-10-17 | GA-01 / BASELINE REVIEW, no new approvals.
Status distinctions:
- CONTENT COVERAGE: 27/27 topics described in chat and consolidated GDD v0.1.
- VERBATIM ARCHIVE COVERAGE: NOT COMPLETE externally; Master GDD v0.1 is a 27-topic structured synopsis, not the full ~long-form chapters.
- CANONICAL PER-DOMAIN V0.2 SPECS: 0/27 finished, must reconcile all new found defects.
- ACTUAL GAME RUNTIME UNIT/INTEGRATION VERIFICATION: NOT RUN — no inspected executable Dementor Live runtime in this audit.
- CALCULATED 40/40 arithmetic assertions and 21/21 synthetic replay checks: these evidence formulas and expected behavior ONLY, not implementation readiness.

## Required future canonical chapter deliverables
| System | Target document | Specific completion requirements | Priority | State |
|---|---|---|---|---|
| WORLD | WORLD_SPEC_v0.2.md | map/region/district topology, public-route invariants | P1 | DRAFT PENDING |
| LAND | LAND_SPEC_v0.2.md | multi-axis states, parcel purchase, zoning and ownership | P1 | DRAFT PENDING |
| BUILD | BUILD_SPEC_v0.2.md | construction phases, placement/recipes, permissions | P1 | DRAFT PENDING |
| ECONOMY | ECONOMY_SPEC_v0.2.md | PAPER issuance/faucet-sink, city treasury, prices, ledger | P0 | DRAFT PENDING |
| RESOURCE | RESOURCE_SPEC_v0.2.md | item provenance, containers/stack capacity, fiber IDs | P0 | DRAFT PENDING |
| FARM | FARM_SPEC_v0.2.md | yield/seed/water/time, automation prerequisites | P1 | DRAFT PENDING |
| WATER | WATER_SPEC_v0.2.md | network, pump/litre granularity, event consumption | P0 | DRAFT PENDING |
| PRODUCTION | PRODUCTION_SPEC_v0.2.md | recipes, stages, outputs, factory buffers, source-tag fiber | P0 | DRAFT PENDING |
| TIME | TIME_SPEC_v0.2.md | REAL/WORLD, offline replay, concurrency, scheduling | P0 | DRAFT PENDING |
| WORK | WORK_SPEC_v0.2.md | job payouts, onboarding, licenses, funding | P1 | DRAFT PENDING |
| MARKET | MARKET_SPEC_v0.2.md | physical goods, escrow, shop and restock | P1 | DRAFT PENDING |
| SOCIAL | SOCIAL_SPEC_v0.2.md | rights, friends, groups, chat/moderation | P2 | DRAFT PENDING |
| COMBAT | COMBAT_SPEC_v0.2.md | PvE contract, two-player missions, first map liberation | P2 | DRAFT PENDING |
| TRANSPORT | TRANSPORT_SPEC_v0.2.md | road graph, bike, cargo physical state and deliveries | P2 | DRAFT PENDING |
| CHARACTER | CHARACTER_SPEC_v0.2.md | 2D canonical SVG, 8 views, rig and technical animator | P0 | DRAFT PENDING |
| QUEST | QUEST_SPEC_v0.2.md | 12-step onboarding with one-time reward conditions | P1 | DRAFT PENDING |
| NPC | NPC_SPEC_v0.2.md | 4 cast, timetable and dialogue/art registry | P1 | DRAFT PENDING |
| SURVIVAL | SURVIVAL_SPEC_v0.2.md | HP/stamina/downs, no starvation penalty MVP | P2 | DRAFT PENDING |
| AUTOMATION | AUTOMATION_SPEC_v0.2.md | module jobs, resource locks and offline boundaries | P1 | DRAFT PENDING |
| MONETIZATION | MONETIZATION_SPEC_v0.2.md | cosmetics/payment identity, age policy | P3 | DRAFT PENDING |
| UNITS | UNITS_SPEC_v0.2.md | WorldUnit/Cell/Tile/Pixel, camera, footprints | P0 | DRAFT PENDING |
| VISUAL | VISUAL_SPEC_v0.2.md | style lock, four source/eight runtime, board geometry | P0 | DRAFT PENDING |
| TECH | TECH_SPEC_v0.2.md | server auth/schema/transactions and QA harness | P0 | DRAFT PENDING |
| RELEASE | RELEASE_SPEC_v0.2.md | character-first gates, evidence-driven acceptance | P0 | DRAFT PENDING |
| GAMEPLAY | GAMEPLAY_SPEC_v0.2.md | short/medium/long loop, solo/co-op progression | P2 | DRAFT PENDING |
| GOVERNANCE | GOVERNANCE_SPEC_v0.2.md | decision lineage, source trace, version control | P0 | DRAFT PENDING |
| DECISIONS | DECISIONS_v0.2.md | closed/reviewed findings with evidence and approved patches | P0 | DRAFT PENDING |
## Standard per-chapter contract (no exception)
1. ID, revision, source authority, status, supersession history, owner.
2. Purpose, user-facing result, boundaries and non-goals.
3. Entities and schemas with examples, owner and source of truth.
4. Enumerated states and all valid transitions.
5. Numeric config: units, initial values, exact formulas and pricing rounding, TEST/APPROVED status.
6. Positive journey, negative cases, disconnected/offline + concurrency cases.
7. Dependencies & effects: source/destination systems for events and transfer.
8. Authoritative permission checks, transaction and rollback/idempotency conditions.
9. Failure modes, fraud/abuse and UI feedback.
10. Sample calculated fixtures and data conservation assertions.
11. Test matrix IDs, evidence references and gate status.
12. Migration impact and change log + approvals.

## Data/QA auxiliary documents required
CONFIG_CATALOG.json — named balance constants & versions.
ITEM_CATALOG.json — physical resources, input/output recipes and coefficients.
MONEY_POLICY.md — PAPER ledger, treasury, faucet/sinks, emission, city budgets.
EVENT_REPLAY_CONTRACT.md — time/event ordering, database tx and retry guarantees.
ONBOARDING_LEDGER.md — first 60m journey, funding and actual material provenance.
PROPERTY_ACCESS_CONTRACT.md — 4 land state axes + public/private/retail boundary.
CARGO_SETTLEMENT_CONTRACT.md — physical transport and escrow.
8_VIEW_SVG_ASSET_QA.md — art accepted sources, slices, sockets, poses and tests.
SOCIAL_SAFETY_POLICY.md — target audience, moderation and retention.
QA_RUNBOOK.md — how to run unit/integration/security/visual/stress tests on actual runtime.
RELEASE_EVIDENCE.md — builds, test logs, issues, approvals.
SOURCE_TRANSCRIPT_ARCHIVE.md — full long-form 27 chapters from original conversation with links or verified import.
Production engineering docs only after approved design: DB migrations, API schemas, deployment/runbooks.

## Sequencing
A. Source full-text archive and project boundary, then 27 domain owners and source IDs.
B. Character/Visual/Units first, with exact user's style lock.
C. Economy/Resource/Water/Production/Time shared contracts, including treasury and fiber.
D. Land/Build/Work/Quest/Market/Automation/Transport integrated first gameplay loop.
E. Social/Combat/NPC/Survival/Gameplay/Monetization and safety for public.
F. TECH and RELEASE gate evidence: implement and verify all relevant tests, then freeze v0.2 APPROVED by owner.

## Acceptance for "documentation complete"
27/27 domain specs have sections 1–12 above; zero P0 OPEN for upcoming release gate; all numerical configs are tagged APPROVED or flagged as accepted TEST with explicit rollout; no unresolved ambiguous ItemId/money semantics; clickable source/crossref and revision history; user has approved canon. Cannot truthfully claim done before those milestones.

## Persisted GA-01 work
Plan, numeric audit, 27-system QA matrix, extended issue register, data contracts, proposal patches, stress scenario document, arithmetic reproducible JS & results, synthetic event replay JS & results. These are inputs to v0.2 review, not canonical replacement.
