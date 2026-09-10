# Public Site Visual Harmonization — Final Live Smoke Evidence — 2026-09-10

Status: **EVIDENCE / LIVE PASS ON CHANGED ROUTES / RESULT 1 RELEASED**

Result: `dementor-club.result.public-site-visual-harmonization-v1`

## Exact production release

- production commit: `f3ffdea8cc4ec17a140beeada2b2af3f774dba29`;
- source PR: `#142` (`Events live-smoke correction — trace, compact header, Fuengirola H1`);
- pre-release validation: Site Integrity / Release Readiness `#931` / `34462667133` / **SUCCESS** against exact candidate `5dd66b18c49582dbdb532437dcd6b84f5ddfa7e3`;
- production deploy: `Deploy Dementor Production #55` / run `34463167914` / **SUCCESS**;
- deploy workflow explicitly checked out `dementor-club-production` and logged exact commit `f3ffdea8cc4ec17a140beeada2b2af3f774dba29`;
- Pages artifact: `10146383467`;
- Pages artifact digest: `sha256:08007f227f70ac3c1875020ce3785aad9dea18b6b4b9adc7259923e6ddacac42`.

## User live screenshots after deploy #55

The user supplied fresh production screenshots from `dementor.club` after deploy #55.

### `/`
**PASS**

Observed:
- one Fuengirola full-bleed scene;
- one compact copy rail;
- one Gabil relation treatment;
- one primary event CTA;
- no inner duplicate poster/card composition returned.

### `/events/`
**PASS**

Observed at the top of the page:
- canonical public Header remains intact;
- route opening reads `СОБЫТИЯ` as the section owner;
- one visitor-facing current-event block follows below;
- orphan `INK / L1 / PROGRAMME TRACE` label is absent;
- no persistent duplicate Fuengirola raster or standalone Gabil card is visible;
- Fuengirola row/preview remains a secondary catalogue interaction rather than a persistent owner.

### `/events/fuengirola/`
**PASS**

Observed:
- large `ФУЭНХИРОЛА` H1 is visible inside the hero;
- one canonical Fuengirola hero raster;
- one Gabil event relation card;
- no legacy ink-layout displacement of the H1;
- no second dominant Gabil feature.

## Other Result-1 target routes

`/community/`, `/community/gabil/`, and `/merch/` were not re-screenshoted by the user in this final post-#55 live pass. PR #142 did not change those route-specific presentation sources; they remained covered by the successful G6 #931 public harmonization browser matrix and the earlier live/corrective evidence chain.

This evidence therefore does **not** claim a new user screenshot for those three unchanged routes.

## Closure boundary

The visible Result-1 defects that triggered the final corrective pass are resolved in production. The accepted live state is now the baseline for `public-site-visual-tech-debt-cleanup-v1`.

Result 2 must preserve this visual state. Cleanup must remove dead/legacy presentation ownership only after active/compatibility/dead classification and must not introduce a user-visible redesign.

No Membership, DC-9, Workspace, Board, auth, Supabase, checkout, event-registration or commercial semantics were changed by this release.
