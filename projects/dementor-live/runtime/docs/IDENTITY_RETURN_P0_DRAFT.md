# Character Return / CP-IDENTITY-01 — isolated G5 prototype, NOT a release

**Source base:** legacy H0 `SLADZARI/degradation_club@6d09e9828a549b6ce64a354c5f7bf0a29717a700` (PR #305). Canonical G3 Change Proposal: `SLADZARI/dementor_live` Lead PR #46, issue #45. Code isolated in a stacked Draft source PR; **no runtime merge, deploy, live save migration or G7 authorization**.

## Behavior and invariants

- CharacterId is the pre-existing immutable `player.id` (UUID), regardless of city, display name or device. Public numeric phone/profile number and a name cannot authenticate.
- The old `Game.auth` bearer remains valid until an owner-authorized transfer completes. All existing wallets, bag, plots, receipts, ledger and city save shape remain unchanged.
- Only an already authenticated bearer may **create** a recovery capability; the server returns a random 256-bit base64url code **once** and a 10-minute expiry. Any older pending code is revoked.
- The per-player `characterReturn` field stores ONLY `{version,salt,digest,expiresAt}`: 128-bit random salt + domain-separated SHA-256 digest. This does **not** hash or migrate pre-existing bearer tokens; that is a separate protected security migration.
- **Claim** validates CharacterId+code (not name or public number) in constant time, atomically replaces `player.token` with a fresh 256-bit bearer, deletes the recovery verifier, saves before successful acknowledgement and ends old SSE sessions. Failed/replayed/expired codes never mutate the world.
- Explicit **revoke** allows a still-authenticated character to cancel a pending code; only the currently held bearer can issue/revoke.
- Risk-admission: per-target 5 attempts / 10 minutes, per directly connected peer 60 / 10 minutes, issuance 5 / 10 minutes. Memory bounded; proxy trusted-client-IP controls must be separately reviewed before production (many players appear as loopback behind Nginx).
- Disabled on ordinary servers unless `DEMENTOR_IDENTITY_TRANSFER_ENABLED=1`; **even enabled it returns 503 unless `DEMENTOR_PUBLIC_URL` is an HTTPS origin**. Isolated local `node server.mjs --test` binds loopback and enables API exclusively for tests.
- No automatic club/MP/Robo account linkage. No transfer by staff without separate authenticated evidence + reviewed operator procedure. If all old login proof is lost and no code was preissued, self-service recovery is impossible without insecure account takeover.

## Endpoint contract (all POST JSON with same-origin Origin, no URL query / caching)

1. `/api/identity/transfer/create`: authenticated `Authorization: Bearer <existing-token>`; body `{}`; returns `{ok:true,characterId,code,expiresAt}`. Treat the code as secret, display once and NEVER store in URL, log, screenshot, public analytics, or copy to Git.
2. `/api/identity/transfer/revoke`: authenticated bearer, body `{}`; returns `{ok:true}`.
3. `/api/identity/transfer/claim`: body `{characterId,code}`; returns `{ok:true,id,token}`; receives a new bearer and MUST replace the old browser session credential only after response success. Invalid/missing/expired/replayed/wrong-user returns generic 401; throttled returns 429; public non-HTTPS/feature-disabled returns 503.

**Known trade-offs:** a stolen existing bearer can already impersonate a resident and could request a transfer code. Before any G7, Security #13 must review legacy `/api/events?token=` query-string exposure, origin/CSRF, HTTPS/Nginx proxy logs and a trusted per-client-IP rate limiter. Explicit user confirmation and transfer UX (Dev2 #10) are unimplemented. Network failure **after** durable claim but **before** client stores the new bearer may require supervised recovery; no auto-reissue to unauthenticated callers.

## Actual tests performed (all on the isolated Mac source checkout, synthetic accounts)

- `node --test test/character-return.test.mjs test/saved-resident-recovery.test.mjs`: **9/9 PASS**; stale bearer rejected, fresh bearer resumes same identity after process restart; code hash saved only, no secret exposed in `/api/state`; replay/parallel/CSRF/foreign identity fail; no PAPER/inventory/plots/receipt mutation; default-off and HTTP fail closed.
- `npm test`: **106/106 PASS** at local candidate; `npm run check`: syntax 103 files, 51 model tests PASS. `check` reports HTTP/SSE and browser as STALE, so separate new HTTP tests are independent evidence, not comprehensive G6.
- NOT RUN: real physical iPhone Safari, two independently authenticated human players, public HTTPS proxy/Nginx integration, multi-process rate persistence, production deploy, player #90 authenticated support recovery and real backup-copy test on this new change. The historical SRE #14 backup-copy restoration is separate evidence, not a test of this new candidate.
