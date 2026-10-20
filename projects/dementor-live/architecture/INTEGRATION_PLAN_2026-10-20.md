# CIVIC + UNIVERSE integration plan — P0 preparation

**Status: preparation and documentation ONLY. NO combined code, QA pass or deployment implied.**

## Branch strategy

Documentation: docs/dementor-live-dual-track-v1-2026-10-20.
Initial integration branch: integration/dementor-live-civic-universe-v0-2026-10-20, based on the documentation commit whose parent is GitHub v0.4 source SHA 71e02750c227c5dd1ee118bc703fac87f0115e77.

This is a **candidate base**, not certified parity with actual VM. Do not fast-forward production or modify Docker saves as part of this plan.

## Stage 0 — Release identity, assets and backups

- Read-only: prove actual live health, source/build SHA, image digest and save schema. Do not disclose tokens or private saves.
- Read exact differences in world.mjs, life.mjs, public/app.js, UI controls and save envelope.
- Confirm PAPER/icon asset files in source and runtime. The approved icon manifest currently records binary_import_pending.
- Prepare off-VM backup/restore validation for production world; test only against copy.

## Stage 1 — Shared engine adapter and registry

- Define explicit CharacterId, cityId, worldId, regionId, sceneId mappings.
- Make travel commands server-owned, proximity checked, requestId-idempotent; preserve money, jobs and bags.
- Implement a registry/adapter rather than copying entire experimental Game or financial logic.
- Treat historic CIVIC museum and experimental MentalHumor park/hall as distinct until an approved migration connects them.

## Stage 2 — Port WORLD-01 behind feature flag

- Move deterministic forest scene geometry and server validated interactions, without changing city ledger.
- Retain static, sanitized read-only public billboards; no Club auth; scooter has no resource mint.
- Validate return to each city/region and two-player presence.
- Feature flag OFF by default in published game.

## Stage 3 — Port MentalHumor behind feature flag

- Preserve 80×60 park and 20×17 hall, rights-marked research cards, forest and city entrances.
- No unlicensed artist audio, uploads, voice cloning, fictitious partnerships or private Club DB reads.
- Eliminate museum duplication in navigation only after identifying precise desired player experience.

## Stage 4 — Test gates

- npm run check + full existing CIVIC suite.
- Forest and MentalHumor model tests against actual integrated Game; no synthetic model acceptance substitution.
- Two real clients: travel city → forest → museum → hall → reverse, with collision/proximity, idempotency and conservation.
- Restart/reconnect test on disposable save, phone viewport tests, real iOS Safari acceptance.
- Check icon atlas binary presence and appearance in both CIVIC and UNIVERSE.
- Check code/state compatibility on copy of production save, rollback and external backup.
- Explicit GO/NO-GO before production release. DO NOT invoke publish-clean-world.sh --reset-world for routine update.

## First PR should contain

1. Adapter and World Registry with tests, no feature switched on by default.
2. Safe docs and migration plan showing preserved data.
3. Real tests and screenshots, not concept references.
4. File-by-file conflict resolution record for shared engine paths.
5. Version matrix update with exact hashes.

## Non-goals for this bootstrap

No code merge from experimental branches, no production deploy, no automatic backup deletion, no gameplay/map rewrites, no Combat/WORLD ORGANISM import.
