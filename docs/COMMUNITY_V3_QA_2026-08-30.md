# Community v3 — staging QA

Date: 2026-08-30
Branch: `dementor-club-site`
Design canon: v10
Status: **STATIC QA PASSED / RUNTIME VISUAL QA PENDING**

## Scope

- `/community/`
- global header relationship to Community
- links from Community to people / courses / projects / objects / events
- `/projects/logic-awareness/` entry scroll regression

## Static QA

### Community page

- [x] Hero uses approved three-zone desktop composition: slogan / image + `ЛЮДИ ЕСТЬ.` / explanatory copy.
- [x] Mobile hero has its own composition rather than a proportional desktop shrink.
- [x] Hero paper surface is `#F7EBD4` and image has no blend/filter darkening in Community CSS.
- [x] Core palette remains paper / black / acid (`#d8ff3e`).
- [x] Community copy uses predominantly affirmative language.
- [x] Community does not repeat the nine-sphere Join product.
- [x] Community does not repeat the About explanation as a full educational block.
- [x] People are presented as examples of people who have already started formats, not as a closed hierarchy.
- [x] Different output types are visible together: course, practice, independent project, club object.
- [x] `СЕЙЧАС ПРОИСХОДИТ` uses current statuses rather than invented event details.
- [x] Links use relative canonical routes.
- [x] Mobile CSS contains dedicated layout for hero, roster, activity ledger and create section.

### Global navigation

- [x] Community is now a direct global-navigation destination.
- [x] `Courses` removed from the Community dropdown; the dropdown itself is removed.
- [x] Course pages may still mark Community as the active global section.
- [x] Account remains a separate utility group.

### Logic & Awareness scroll regression

- [x] Root cause identified in `content-series-v1.js`: carousel initialization previously used `scrollIntoView()`, which could move the document vertically.
- [x] Carousel navigation now changes only `track.scrollLeft` via `track.scrollTo()`.
- [x] Initial carousel centering uses horizontal scrolling only and cannot intentionally move the document to the series section.
- [x] Explicit hash links remain untouched by this fix.

## Runtime / visual QA still required

These checks need a reachable staging deployment or local browser build with all repository assets:

- [ ] 1440 desktop screenshot against approved reference.
- [ ] 1024 tablet composition.
- [ ] 768 tablet composition.
- [ ] 390 mobile composition.
- [ ] 360 mobile composition.
- [ ] No horizontal overflow at all target widths.
- [ ] Hero image is the approved final binary and matches the supplied reference without darkening.
- [ ] All person portraits load.
- [ ] All Community entity links return the intended page.
- [ ] Keyboard focus states remain visible.
- [ ] Global mobile menu opens/closes correctly from Community.
- [ ] `/projects/logic-awareness/` opens at scroll position 0 from Community, Home, Projects and direct URL.
- [ ] `/projects/logic-awareness/#series-01` and other explicit fragments still land on the requested section.
- [ ] Back/forward browser behavior remains reasonable.

## Release gate

Do not promote Community v3 to `dementor-club-production` until the runtime / visual QA items above are checked on the actual staging build.
