# Dementor Live — architecture start here

**20.10.2026 · Dual-track v1.0 · Product structure accepted, technical integration pending.**

Canonical entry point for cross-track decisions: [architecture/README.md](architecture/README.md).

**Decision:** ONE ENGINE · TWO GAME DIRECTIONS · MANY WORLDS · CONTROLLED RELEASES.

- **CIVIC** — economic survival, resources, construction, cities and shared infrastructure. Development anchored to v0.4 source, not automatically to the unverified live container.
- **UNIVERSE** — explorative thematic regions, currently Ideas Forest and MentalHumor. Its experimental code descends from a 0.3.0-rc.1 branch and must be ported safely to current Engine.
- **ENGINE** — one target contract for player identity, authoritative state, inventory, PAPER, material accounting, saves, movement, networking, rendering and graphics. One source of truth is a goal; the two branches have not yet been integrated.

**No production changes in this documentation step.** Do not deploy, reset game saves or claim successful browser QA without execution evidence.

Source documents: [approved core](CORE_AND_FIRST_LEVEL_v0.1.md), [CIVIC runtime](runtime/), [original game design](design/), [common icon canon (on icon branch)](https://github.com/SLADZARI/degradation_club/blob/fix/dementor-live-paper-cut-icons-v1-2026-10-20/projects/dementor-live/design/PAPER_CUT_UI_ICON_CANON_v1.md).

Existing GDD and runtime documentation are not replaced by this index. The architecture defines organization and cross-track contracts; gameplay details remain in their source specifications.
