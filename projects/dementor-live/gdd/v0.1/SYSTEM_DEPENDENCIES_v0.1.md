# DEMENTOR LIVE — System Dependencies v0.1
DATE 2026-10-17 / REVIEW. Одно понятие — одна система владелец.
## Dependency Matrix: Owner / consumers
WORLD: Region/District/public topology and permanent TerritoryState → LAND, SOCIAL, COMBAT, TRANSPORT.
UNITS: WU, Build Cell, Tile, ScreenPixel, projection/camera scale → WORLD, VISUAL, BUILD, CHARACTER, COMBAT, TRANSPORT.
VISUAL: SVG masters, artboards, view/rig animation contracts, approved reference tokens → CHARACTER, NPC, BUILD, TRANSPORT, CLIENT.
CHARACTER: CharacterId, locomotion/action/condition, presentation and character equipment slots → WORK, COMBAT, SOCIAL, TRANSPORT.
LAND: parcel ownership, zoning, geometry, access boundary, land availability → BUILD, FARM, MARKET, SOCIAL, WORLD.
BUILD: structures/capabilities/footprints/construction state/storage slots → PRODUCTION, WATER, AUTOMATION, MARKET.
RESOURCE: item definitions, item quantities, authoritative containers, reservations, material transaction ledger → BUILD, PRODUCTION, FARM, TRANSPORT, MARKET, WORK.
ECONOMY: PAPER accounts, transfers, emission policy, prices/ledger, payment reserves → WORK, MARKET, LAND, COMBAT.
FARM: plant instances, stage and harvest rules, seed demands → RESOURCE, WATER, TIME, AUTOMATION.
WATER: physical water volumes, source quotas, grid graph, priority and debit ledger → FARM, PRODUCTION, BUILD, TIME.
PRODUCTION: recipe, stages, equipment requirements, material conversion, outputs → RESOURCE, WATER, TIME, ECONOMY.
TIME: clock REAL_TIME/WORLD_TIME, profile definitions, event scheduling and replay → FARM, WATER, PRODUCTION, WORK, NPC.
WORK: offer/assignment/licence, objective verification and payment entitlement → ECONOMY, RESOURCE, TRANSPORT, SOCIAL.
MARKET: listing/order/trade/escrow condition and seller/purchaser rights → ECONOMY, RESOURCE, TRANSPORT, SOCIAL.
SOCIAL: friends/party/invite/grants/chat/blocks → LAND, WORK, COMBAT, MARKET, CHARACTER.
COMBAT: real-time PvE, action legality, mission outcomes, coop completion → WORLD, LAND, RESOURCE, ECONOMY, SOCIAL.
TRANSPORT: vehicles/cargo capacities, road graph routing, custodian, deliveries → WORLD, RESOURCE, WORK, MARKET.
QUEST: narrative objective rules, rewards triggers, global event references → WORK, COMBAT, LAND, TIME.
NPC: identity, scripts, behaviors and city services availability → CHARACTER, QUEST, WORK, TIME.
SURVIVAL: injuries and risks, no survival treadmill in MVP → CHARACTER, COMBAT.
AUTOMATION: permissioned orchestration of existing domain actions, no own inventory/wallet → FARM, WATER, PRODUCTION, RESOURCE, TIME.
MONETIZATION: real-money cosmetics and entitlements separate from PAPER → CHARACTER, VISUAL, SOCIAL.
TECH: authoritative lifecycle, DB, event ledger, migrations, tests → ALL.
RELEASE: gates and validation criteria → ALL.
GAMEPLAY: overall experience and loops, no duplicate formulas → ALL.
GOVERNANCE: statuses, versioning, decision lineage → ALL.
DECISIONS: reviewed APPROVED/PROPOSED/TEST/OPEN + crosscheck findings → ALL.

## Rules that prevent duplication
1. PAPER exists only in ECONOMY ledger; PRODUCED PAPER_SHEET exists only in RESOURCE ledger (subject to resolving E-003).
2. RESOURCE owns quantity; BUILD owns storage object metadata; TRANSPORT owns vehicle metadata; CARGO points to RESOURCE stock, does not copy it.
3. LAND owns owner and permissions boundary; SOCIAL owns invitation/grant; server queries both.
4. FARM owns crop progress; WATER owns water stock; TIME owns time processing; PRODUCTION owns material recipes.
5. WORK owns deliverable objective and licence; ECONOMY owns settlement. QUEST listens to work result, not duplicate payment.
6. MARKET negotiates; ECONOMY reserves and pays; RESOURCE moves stock; TRANSPORT moves custodian/physical cargo.
7. WORLD permanently marks regional liberation; COMBAT mission may be repeatable, WORLD unlock may occur once.
8. VISUAL ART accepted does not equal RIG VERIFIED; 4 authoring sketches are not 8 production views.
9. APPROVED design never implies IMPLEMENTED code; VERIFIED requires executed tests.

## Integration tests
IT-01 First work → PAPER → land purchase → cabin → resource consumption → persistence.
IT-02 4 hemp + 8l irrigation + 12 HEMP + 32l paper production → 24 PAPER_SHEET (TEST), limited by time/stock/water.
IT-03 40 WOOD loaded, 40l tank and output capacity 32 → max 4 wood-paper batches, 32 paper sheets, consumes 16 WOOD and 40l, if production has access and no other consumers; note city pump/inflow can change result.
IT-04 City courier job budget cannot pay without ledger funds or separately audited issuance; exactly-once reward.
IT-05 Marketplace 40 WOOD custody change from seller to courier to buyer with 100 PAPER escrow + 15 PAPER courier, exactly-once.
IT-06 Multiple parallel tasks hit one 40l tank; run online vs offline replay: same final stocks and logs.
IT-07 Anonymous visitor sees neighboring lot outdoors but cannot enter or harvest.
IT-08 Liberation of an instance first changes one WORLD region; replay doesn't grant new parcels.
IT-09 8-direction character with accepted 3/4 camera retains ground-anchor, silhouette, asymmetric attachments, consistent hands and sockets.
IT-10 Update one balance config and verify dependency graph, changelog and rollback.

## Ownership of open work
P0: Character authoring/render direction/camera; paper monetary basis; event engine; budget.
P1: plot geometry/price; production economics; delivery escrow; supply capacity.
P2: content expansion, cosmetics, chat moderation and release QA.