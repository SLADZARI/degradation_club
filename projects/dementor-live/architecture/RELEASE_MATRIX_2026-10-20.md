# Dementor Live — Release Matrix

**Snapshot:** 2026-10-20 · exact GitHub heads were read through the connected GitHub repository. Git heads may advance after this snapshot. Re-read before development or deployment.

| Scope | Ref | Verified Git SHA at snapshot | Package/version | Evidence/status |
| --- | --- | --- | --- | --- |
| v0.4 CIVIC/world release source | release/dementor-live-world-p0-clean-2026-10-20 | 71e02750c227c5dd1ee118bc703fac87f0115e77 | 0.4.0-world-p0 | Git source verified; user says externally published; exact live image SHA **not verified** |
| earlier isolated deploy branch | deploy/dementor-live-isolated-2026-10-18 | e948955e77fb5552eaaad260c358a29cd06a4f19 | historical 0.2.1 in deployment report | Branch head differs from historical deployed commit 130e47567077830a29df06ce545bac06c26ae032; not today's deployment proof |
| city economy, seeds and cities | feature/dementor-live-economy-seeds-cities-2026-10-18 | d7ca583b0ecf143e9cf999d271c00f01de02bbfe | 0.3.0-rc.1 candidate line | Prior experimental base; schema migration specs exist |
| world expansion P0 | feature/dementor-live-world-expansion-p0-2026-10-19 | 952a1583f8d6e2a27623481bf902b838bceea3f0 | next CIVIC world features | Included in v0.4 source ancestry; verify live separately |
| WORLD-01 Ideas Forest | feature/dementor-universe-world-01-forest-2026-10-20 | 489ec2809c56e4045c168a59d64c6371b4364127 | descends from 0.3.0-rc.1 | Isolated experiment, NOT production |
| WORLD-02 MentalHumor | feature/dementor-universe-mentalhumor-museum-2026-10-20 | 23cdd45b9c4d1ef0a4662bc2ccf0d6f4ce5be86c | 0.3.0-rc.1 in package.json | Isolated experiment, NOT production |
| COMBAT alpha | feature/dementor-live-combat-p0-2026-10-19 | 26c8a639a95dbb06c7f0ea3279f8073937978f71 | separate prototype module | No combined end-to-end acceptance proven |
| world-runtime contract QA | qa/dementor-live-world-runtime-contract-2026-10-20 | 89a9de11087a9bb52c469389ba47a5ac99618071 | QA branch | Documented 19/19 Node world travel/receipt checks; NOT live E2E |
| approved paper UI icon standard | fix/dementor-live-paper-cut-icons-v1-2026-10-20 | 20ae72887737364d5a84c613a296205545c9d791 | shared assets plan | Canon and manifest present; manifest says binary_import_pending |

## Critical reconciliation

GitHub comparison, v0.4 source → MentalHumor experiment: **diverged**, experiment ahead 28 commits and behind 95 commits at time of inspection. Do not merge/force push blindly. Inspect files individually.

## Actual live server

**User-provided claim:** v0.4 is published externally.
**Verified earlier source record:** 0.2.1 had been deployed to http://138.199.144.94/ on 2026-10-18 with separate Docker service and persistent volume.
**Not yet independently checked today:** actual health version, running container source SHA/image digest, deployed features, current save schema, external volume backup and user sessions.

**Before any release:** record observed health JSON, git SHA (ideally build fingerprint exposed by app), image digest, save schema, backups, owner approval, and postdeploy two-client results. NEVER infer any field from package.json alone.

## Status dictionary

Git verified; Model PASS; Browser PASS; Candidate; User-reported deployed; Production VERIFIED; BLOCKED. Each means a different gate. No bundled assertion.
