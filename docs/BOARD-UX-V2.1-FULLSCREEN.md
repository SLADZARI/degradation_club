# Board UX v2.1 — Fullscreen Spatial Board

## Locked composition
- One compact Workspace header.
- No live banner, duplicate page topbar, Board hero or wall heading.
- The spatial Board owns all remaining viewport height and suppresses page scroll.
- Filters live inside the Board viewport.
- Personal membership/application/DC-9 state does not render on the Board; it belongs to My Club.

## Primary Board action
- Member + free slot: `+ ПРИКОЛОТЬ`.
- Member + occupied slot: `МОЁ ОБЪЯВЛЕНИЕ`.
- Guest: no publication CTA.
- Canonical composer/RPC/storage/Telegram distribution remain unchanged.

## Notice contract
- Board notice is discovery-only.
- Optional image + title + short preview + minimal metadata.
- Long body is visually clamped on the Board.
- Reactions, responses, links and owner controls are not exposed on the Board card.
- Whole card is one click/tap target and opens the full Artifact over the Board.
- Closing the Artifact preserves Board camera/context.

## Spatial/filter navigation
- Keep mouse pan, one-finger pan, pinch+centroid pan, wheel, double-tap, +/- and `К ЖИЗНИ`.
- Primary filters: `ВСЁ / ОТ ЛЮДЕЙ / ОТ КЛУБА / ФИЛЬТР`.
- Previous/next arrows traverse the currently visible filtered cards.

## Security
R1-R10 auth/membership/RLS boundaries remain unchanged. This patch is presentation/composition only and must not broaden Guest or Member permissions.