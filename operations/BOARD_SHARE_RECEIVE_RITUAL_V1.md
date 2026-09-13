---
artifactId: dementor-club.decision.board-share-receive-ritual-v1
project: dementor-club
documentType: ARCHITECTURE_DECISION
projectStage: BUILD
gate: G5_BUILD
status: APPROVED
version: 1.0
updated: 2026-09-13
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: APPROVED_AUTHORITY
basis:
  - operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
  - operations/BOARD_ACCESS_AND_OWNER_ADMIN_V2.md
  - production live acceptance after Deploy Dementor Production run 34761634673
supersedesScope:
  - Guest/Applicant 600 ms automatic open after shared arrival
  - Member/Dementor/Owner direct-open on shared arrival
  - post-OAuth automatic opening of the shared Artifact
---

# Dementor Club — Board Share → Receive Ritual v1

**STATUS: APPROVED / PROJECT-LOCAL SOURCE OF TRUTH**  
**VERSION: 1.0**  
**DATE: 2026-09-13**  
**SCOPE:** Shared Artifact arrival presentation, auth return and explicit recipient choice on Community Board.  
**CANONICAL RUNTIME OWNER:** `community/board/board-deeplink-auth-return-v1.js`.

## 1. Decision

A valid shared Artifact arrival is a deliberate receive ritual, not a transient loading state.

Canonical shared arrival remains:

`/workspace/board/?focus=artifact:<uuid>&from=share`

`from=share` means: **show the incoming-transfer presentation before opening the target**.

The earlier behavior is superseded:

- Guest/Applicant must not receive a 600 ms `ДОСТАВЛЕНО` flash followed by automatic open;
- Member/Dementor/Owner must not bypass the incoming postcard and open directly;
- successful Google return must not automatically finish the ritual by opening the Artifact.

## 2. Sender side

The released sender contract remains unchanged:

- Artifact Share lives inside the opened Artifact action row;
- sender postcard is explicit and stable;
- canonical Workspace identity is reused for sender name/avatar;
- sender chooses native share or copy explicitly;
- `/share/artifact/?id=<uuid>` remains the transport-only external URL;
- the transport surface owns no Artifact body/media, membership, permissions or RLS semantics.

## 3. Unauthenticated receive boundary

Unauthenticated users cannot open Board and must not receive an Artifact-existence oracle.

Therefore before login:

- do **not** resolve or reveal whether the exact private Artifact exists;
- show generic incoming postcard `ВАМ ПЕРЕДАЛИ АРТЕФАКТ`;
- primary action: `ВОЙТИ И ПОСМОТРЕТЬ →`;
- Google OAuth `returnTo` preserves the exact same Board URL including `focus=artifact:<uuid>&from=share`;
- authentication does not imply membership.

This preserves the existing access authority:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`.

## 4. Authenticated target resolution

For every authenticated Board-readable state — Guest, Applicant, Member, Dementor, Owner Admin — the shared arrival follows the same presentation rule.

Board first resolves the exact target through the existing Board data/permission owner.

If the target is not available to the current user, preserve the generic missing state:

`ЭТОГО ЗДЕСЬ БОЛЬШЕ НЕТ.`

Do not distinguish deleted / hidden / nonexistent / denied for the recipient.

If the target resolves and is readable, show a persistent incoming postcard:

- title: `ВАМ ПЕРЕДАЛИ АРТЕФАКТ`;
- no timeout;
- no automatic open;
- no role-specific bypass.

## 5. Explicit recipient actions

The persistent incoming postcard has two canonical outcomes.

### Accept

Primary action:

`ПОСМОТРЕТЬ АРТЕФАКТ →`

On explicit activation:

1. remove `from=share` from the current URL with `replaceState`;
2. preserve `focus=artifact:<uuid>`;
3. close the postcard;
4. open the exact resolved Artifact through the existing fullscreen/detail owner.

### Stay on Board

Secondary action:

`ОСТАТЬСЯ НА ДОСКЕ`

Closing via `×`, backdrop or `Escape` has the same semantic result.

On this outcome:

1. remove `from=share`;
2. remove `focus`;
3. close the postcard;
4. remain on Board;
5. do not allow the ordinary focus resolver to reopen the Artifact.

The recipient therefore makes a real choice after understanding that something was sent.

## 6. OAuth return

OAuth is an interruption inside the ritual, not the end of it.

Canonical flow:

`transport URL → unauth incoming postcard → Google → exact returnTo → authenticated target resolution → persistent incoming postcard → explicit accept OR stay on Board`

No shared Artifact opens automatically merely because authentication completed.

## 7. History / URL semantics

`from=share` is one-time presentation state.

- Accept consumes only `from=share` and keeps canonical `focus`.
- Stay/close consumes both `from=share` and `focus`.
- Neither outcome creates a second canonical object URL.
- Board remains the spatial context around the Artifact.

## 8. Ownership and non-goals

This Decision does not authorize:

- a second Board/deeplink/auth/fullscreen owner;
- new membership states, roles or permission semantics;
- DB/RPC/RLS changes;
- sender identity in the public URL;
- share attribution or analytics identity;
- a dynamic social metadata endpoint;
- public Artifact preview/body/media exposure.

`community/board/board-deeplink-auth-return-v1.js` remains the single Share/Auth/Return orchestrator.

## 9. Deferred separate work

### Share attribution

A future separately approved Result may introduce opaque `share_id` attribution and a funnel such as:

`share_created → share_copy/native_share_completed → share_opened → share_authenticated → share_accepted`.

Sender/profile identifiers must not be exposed directly in the public URL by this Result.

### Public Community social metadata

The absence of canonical `og:image` on `/community/` is a separate public-site metadata debt and does not belong to this receive corrective.

A dedicated 1200×630 social raster for transport may be considered separately; the current corrective does not create a new metadata owner.

## 10. Required validation

Before merge, fresh G6 evidence on the exact candidate SHA must prove at minimum:

- unauth shared arrival shows generic login postcard and preserves exact OAuth return;
- no pre-auth target existence disclosure is introduced;
- Guest/Applicant resolved shared arrival remains on persistent postcard until explicit action;
- Member/Dementor/Owner follow the same persistent postcard path and no longer direct-open;
- `ПОСМОТРЕТЬ АРТЕФАКТ →` removes `from`, retains `focus` and opens exact Artifact;
- `ОСТАТЬСЯ НА ДОСКЕ`, `×`, backdrop and `Escape` remove both `from` and `focus` and do not reopen the Artifact;
- missing/inaccessible target keeps generic missing state;
- ordinary non-share deeplinks retain existing direct focus behavior;
- Back/Forward remains coherent;
- Chromium + WebKit, desktop + mobile pass;
- production route manifest and release gate pass;
- no duplicate owner or new permission path is introduced.

## 11. Release boundary

Build, validation, merge and deploy remain separate gates.

`CI PASS ≠ merge authorization ≠ deploy authorization`.
