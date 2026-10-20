# WORLD ORGANISM v0.10.1 — REAL RUNTIME BRIDGE · 20.10.2026
Status **INTEGRATION DRAFT / REAL RUNTIME TESTED IN ISOLATION / PRODUCTION UNCHANGED**.

Continuation of [v0.10 Unified Atlas](../v0_10/README.md). The original v0.8 economic simulator and new v0.9/v0.9.1 atlas remain separate from the game. This release adds the first production-code bridge into **Dementor Live 0.5.0-rc.2** CityNetwork, through real runtime code, but **not** by deploying all atlas entities in gameplay.

**Implementation:** [Draft PR #295](https://github.com/SLADZARI/degradation_club/pull/295), base `qa/dementor-live-rc2-chain-audit-2026-10-20`. Adds `organism-bridge.mjs`, `organism-access.mjs`, read-only GET `/api/organism/snapshot`, cloned-save readback and independent two-client HTTP smoke. No new world economy action/command; no writes to world volume.

**Data schema:** `dementor-organism-live-v1`. Reported PAPER = city treasuries + player wallets + proceeds in private stalls; resources by field/warehouse/municipal/bag/shop/ground/transit. No individual personal data, token, chat content or exact player positions. Free city budget and project stages per city, populations and housing. No global money conservation asserted: current code creates fresh treasury in city founding and unknown holds need separate audit.

**Source:** live aggregate requires auth. Disabled by default; local `--test` is only on localhost. Public read requires HTTPS origin + dedicated 32+ char bearer; security review before enabling in real world.

**QA:** [GitHub Actions #39458630500](https://github.com/SLADZARI/degradation_club/actions/runs/39458630500) bridge+real CityNetwork+two independent automated HTTP clients+clone readback PASS; rc2 safe upgrade [#39458630448](https://github.com/SLADZARI/degradation_club/actions/runs/39458630448), land/mayor [#39458630511](https://github.com/SLADZARI/degradation_club/actions/runs/39458630511), payphone/bridge [#39458630518](https://github.com/SLADZARI/degradation_club/actions/runs/39458630518) all PASS. Chromium standalone v0.10.1: 3/3 viewports 1440/390/320, sticky HUD, authenticated-schema JSON fixture import, no pageerrors. Synthetic fixture 150 city + 30 wallets + 6 tills = 186 PAPER **not live data**.

**Release blockers:** actual production Docker image SHA, real copied production save and version-aware upgrade audit, two *human* clients/device visual QA, HTTPS admin auth, core global money mint/provenance and NPC/multiworld real contracts. NO GO to production deploy. Master GDD unchanged.
