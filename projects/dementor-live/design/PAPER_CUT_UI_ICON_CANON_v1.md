# Dementor Live — PAPER CUT UI ICON CANON v1
## LOCKED visual standard · 2026-10-19

This document governs item/resource, bag, travel-collection and combat HUD icons. Existing hero, world objects and axonometric environment are **out of scope**.

### Approved source sheets
- Pack 01: 10 base icons, approved desaturated paper-cut illustration (wood, stone, food, seed_hemp, seed_carrot, hemp, carrot, water, axe, pick).
- Pack 02: 10 additional icons, approved on 2026-10-19 (rifle, ammo, map, shirt, souvenir, paper, backpack, cargo, health, stamina).
- The 20 derived transparent 256px PNGs + 64px thumbnails, 5×4 atlas, QA previews and integration installer are bundled in conversation artifact `Dementor_Live_Paper_Icons_v1_READY.zip`. **The binary pack must be installed/committed before enabling the loader in a deployed runtime**. A ZIP filename is not a public hosting URL.
- Do not replace these with stock emoji, photorealistic icons, new or resampled illustration variants without explicit visual review.

### Nonnegotiable style
- Childlike hand-scissored paper appliqué, clean but slightly irregular silhouette.
- Two to four large paper layers; simple cut shapes, no intricate polygon subdivisions.
- No shaggy fibers, heavy outlines, photorealism, glossy effects or intense contrast.
- Keep approved muted palette: ochre #C9965B, terracotta #B8654D, sage #81936B, olive #526C4D, warm gray #92938B, water blue #8CAFB5, carrot orange #D98146, cream #E7D8BA.
- Transparent icon PNGs; physical world sizes are not UI icon sizes. Use 32–48 CSS px for inventory slots. Keep UI count/durability labels as actual text.

### Canonical UI IDs
| Group | IDs |
| --- | --- |
| city bag | wood, stone, food, seed_hemp, seed_carrot, hemp, carrot, water |
| city tools | axe, pick |
| combat profile | rifle (= starter-rifle), ammo |
| travel collection | map, shirt, souvenir |
| interface-only | paper (= PAPER wallet), backpack, cargo, health, stamina |

**Important:** only 8 types above are city-bag resource kinds. The rifle and ammunition are stored in combat profile, map/shirt/souvenir under worldTravel; interface-only icons do not introduce new inventory resources. Upgraded axes/picks reuse original shapes; show quality/durability in text/badge, not new graphics. The courier cargo is UI status of reserved real wood/stone, not a new physical material. No hero changes.

### Integration and release discipline
Keep one canonical id->asset mapping. Replace UI item emojis and relevant HUD icons only; never alter game IDs, transaction ledger, saves, movement, combat, city geometry, or character models. Confirm no JS exceptions, 20 PNG alpha, 20 icon ID mappings, quickbar selection and counts, mobile 390px, world travel shop, combat HP/ammo display. Validate in browser before deploy. Production remains subject to separate release gates.

**Status:** Visual canonical specification approved. Binary export and standalone local installer packaged. GitHub runtime integration is pending import of the binary icon atlas; this documentation alone does not imply deployment.
