[object Object]

## Read-only G7 attestation (2026-10-20)

`deploy/mac-production-audit.sh` is a **separate non-deployment command** run on the Mac. It uses only `~/Downloads/dementor_server` and a single SSH public-key authentication. The VM script only inspects the current game Docker image/container and health, the latest successful `release-manifest.txt` and backup integrity (SHA/size), and aggregates of world state loaded in memory from `/app/data/world.json`. It never prints player names, IDs or tokens, and **never** stops/restarts game, writes to saves or applies a release. Output is suitable for redacted attachment to `SLADZARI/dementor_live#24`.

This is not a physical iPhone check, two independent real clients, or backup restoration on a disposable world. Full G7 acceptance remains open until separately verified.
