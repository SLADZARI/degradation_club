# Public Site Visual Harmonization — Live Smoke Evidence — 2026-09-09

Status: EVIDENCE / CORRECTIVE PASS OPEN

Result: `dementor-club.result.public-site-visual-harmonization-v1`

Production observed:
- commit: `0f19e52c17a700b7e477cab0fca8f98bffaf441c`
- deploy run: `#50` / `34357305018`
- Pages artifact: `10106288390`

User-supplied production screenshots after deploy showed:

1. `/` — Fuengirola Home feature
   - two event image treatments visible at once;
   - two Gabil identity treatments visible at once;
   - root cause confirmed in current production CSS/runtime: `home-event-fuengirola-20260828.css` owns the full banner, while `visual-standard-v2.css` still adds a second Fuengirola `::after` image; `dementor-relations-v1.js` adds the semantic Gabil relation while the Home event CTA CSS still adds a second decorative Gabil portrait/copy.

2. `/events/`
   - compact lifecycle layout is visually improved;
   - programme intro still reads as implementation/process explanation rather than public editorial copy.

3. `/events/fuengirola/`
   - one primary Gabil relation is visible;
   - no second dominant Gabil portrait feature is visible in the supplied screenshot.

4. `/community/gabil/`
   - no obvious source-of-truth/PENDING implementation wording is visible in the supplied screenshot;
   - hero presentation is visually coherent.

5. `/merch/`
   - prior hard implementation markers are gone;
   - hero still uses internal taxonomy wording (`OBJECT / WEAR / DROP сущности`) and supporting internal labels.

Corrective implementation remains inside the same Result and single integration branch. No Workspace, Board, DC-9, Membership, auth, Supabase, checkout or registration semantics are in scope.
