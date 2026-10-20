# Dementor Live — Project Master v1.0

**Architecture decision accepted by project owner: 20 October 2026.**
**Implementation status: partially existing common 2D lineage; two branches not reconciled.**

## Vision

A persistent multiplayer 2D paper-cut world growing through game systems, resident actions, authored thematic places and carefully moderated third-party ideas.

**ONE ENGINE · TWO GAME DIRECTIONS · MANY WORLDS · CONTROLLED RELEASES.**

## Direction A — CIVIC

Purpose: multiplayer survival, resource economy, city projects and gradual settlement development.

Core loop: explore → harvest → carry → trade/work → earn PAPER → build → extend territory and social structures.

Owned concepts: forests and natural deposits as physical sources, warehouses and reservations, courier jobs, city treasury, plots and homes, planting, construction, production, private and public permissions, and eventually professions and PvE missions.

The v0.4 code branch provides the current source baseline. Production runtime SHA must be established independently.

## Direction B — UNIVERSE

Purpose: explore physical, authored and themed regions with their own activities and meanings.

Core loop: discover → travel → interact → understand/participate → access new content/worlds.

Currently established experiments: WORLD-01 Ideas Forest (separate forest scene with physical roads, scooter prototype and read-only public boards) and WORLD-02 MentalHumor (navigable park, central Museum of Laughter and interior hall).

Worlds are not static website tiles. Club information boards do not grant Club authentication, economic actions, partner status or rights to private data.

## Shared ENGINE — one target contract

Character identity; persistent wallets and inventory; materials ledger; server-owned commands, collision and travel; Node game state/persistence; multiplayer synchronization; 2D camera and input; one approved interface asset canon; common QA/release gates.

CIVIC and UNIVERSE retain their own backlogs, implementation branches and gameplay logic. Neither may fork common money, identity or save schema without explicit engine governance.

## Modular boundaries

- CIVIC: city economy, municipal work, plots, production, physical resources.
- UNIVERSE: thematic world definitions, content interactions and region navigation.
- COMBAT: opt-in cooperative PvE feature with the same CharacterId; alpha model is not evidence of complete deployment.
- WORLD ORGANISM: analytical/synthetic laboratory; never automatically imported into a live save or taken as runtime QA.
- ENGINE: cross-track interfaces and controlled migrations.

## Expansion process

IDEA → RESEARCH → SPEC → isolated prototype → model + integration + browser tests → release candidate → approved deployment → real acceptance.

Every new idea needs a world/mechanic owner, source/rights provenance, player action, economy impact, save schema impact, dependency list, exit/return, QA evidence and rollback.

External museums, creators and brands require rights/permission review. Mentions or visual homage must not imply partnership, public rights to audiovisual collections, recordings or commercial participation.

## Release governance

Always pin source branch and SHA. Record exact tests, test environments, migration plan, rollback, issues and actual deployed SHA. Gate production on verified current saves and active users; never use a reset-world operation as a routine update.

A release can ship only one direction. Common ENGINE changes must pass regression suites for both directions before a unified release.

## Visual canon

Shared 2D paper-cut/origami visuals, mobile-first scene visibility and camera scaling. The approved 20-item UI icon set from PAPER_CUT_UI_ICON_CANON_v1 applies to both tracks, but binary import to older branches and the live build is not yet verified. No fallback emoji for canonical icons after migration.

Historical GDDs are context and do not supersede later owner decisions.

## Status terminology

IDEA, RESEARCH, SPEC, IMPLEMENTED, MODEL_PASS, BROWSER_PASS, RC, DEPLOYED, VERIFIED, BLOCKED. State each gate separately: one PASS does not imply another.

## Agent working rules

Start by declaring ENGINE/CIVIC/UNIVERSE/COMBAT, compare live/branch SHA, inspect files and preserve existing data. Changes to shared world, saves, money or UI must be checked for cross-track impact. Report done/not done/untested explicitly. Keep work and tests isolated from production until authorized.
