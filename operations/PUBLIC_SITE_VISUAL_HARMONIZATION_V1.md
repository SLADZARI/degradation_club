# Dementor Club — Public Site Visual Harmonization v1

Status: **DRAFT / IMPLEMENTATION SPECIFICATION**  
Prepared: **2026-09-08**  
Project: `dementor-club`  
Semantic source: `dementor-club`  
Production implementation baseline observed while preparing this spec: `b1ed177564581c820e3739e70404957108157af1`  
Authority type: **REFERENCE / IMPLEMENTATION SPECIFICATION**

> This document defines the next public-site harmonization scope. It does not authorize production merge/deploy and does not change Membership, DC-9, Workspace, Board, auth or Supabase semantics.

---

## 0. Goal

Bring the public Dementor Club site to a more coherent visual and editorial state without redesigning it:

- remove duplicate entity presentations;
- remove repeated presentation blocks;
- remove implementation/data-model language from public copy;
- reduce unnecessary information-density competition;
- preserve the existing design character and canonical Public Shell;
- add regression guards so the same duplicate patterns do not return;
- defer structural CSS/runtime/asset entropy cleanup to a separate Result after the visible harmonization state is protected.

Principles:

`Existing before new.`  
`One responsibility = one canonical owner.`  
`One entity = one dominant presentation per semantic block.`  
`Built artifact is production evidence; raw HTML alone is not.`

---

## 1. Hard boundaries — do not change

### 1.1 Global Header is locked

Current canonical runtime is `global-header.js` + `global-header.css`.

Desktop information architecture:

`DEMENTOR CLUB · [Вступить в клуб] · О клубе · События · Проекты · Сообщество · Мерч | identity/login`

Guest:
- persistent `Вступить в клуб` CTA;
- `Войти` service action.

Authenticated Member:
- Join CTA hidden;
- avatar/name identity leads to Workspace.

Do not:
- return `Archive` to primary navigation;
- return legacy `Join` as an ordinary menu item;
- translate the canonical menu back to English;
- change header structure, dimensions, typography or visual treatment in the user-facing harmonization Result;
- create another page-owned primary header/menu.

Header before/after the visible harmonization pass must remain visually unchanged.

### 1.2 Out of scope

Do not change in this work:
- Google OAuth/auth lifecycle;
- Membership lifecycle or permissions;
- DC-9 state or flows;
- Workspace routes/shell;
- Board permissions/product behavior;
- Supabase schema or RPC semantics;
- merch checkout logic;
- event registration logic;
- unapproved prices, dates, roles or product facts.

The separate `dementor-club.result.board-access-control-v2` remains `WAITING` and is not part of this public-site Result.

---

## 2. Production baseline rule

This specification was reconciled against production HEAD:

`b1ed177564581c820e3739e70404957108157af1`

Before implementation, re-read `dementor-club-production` and create the implementation branch from the then-current exact production HEAD. Do not assume the SHA above remains current.

Because `dementor-club-site` and `dementor-club-production` have divergent history, do not blind-merge site → production.

---

# 3. Result 1 — `public-site-visual-harmonization-v1`

Recommended scope: visible public-site harmonization + the minimum regression guards required to protect the corrected state.

Recommended implementation branch:

`agent/public-site-visual-harmonization-v1`

Branch must start from the exact current `dementor-club-production` baseline.

No production merge/deploy without explicit owner authorization.

---

## 3.1 Priority A / Visual Major — `/events/fuengirola/`: one Gabil identity treatment

### Current fact

The page already contains a static hero relation:

`dc-event-hero__relation dc-dementor-relation`

with portrait, name and event relationship.

Later on the same page, a full `dc-dementor-feature` again presents Gabil as a dominant portrait/identity block, followed by another Gabil quote.

In addition, `dementor-relations-v1.js` contains route-specific injection for `/events/fuengirola/`.

The current runtime defect is not a missing `.dc-event-relation` class guard. The route-specific runtime searches for:

`.dc-event-relations || .dc-event-detail__intro`

and then checks only inside that selected target for an existing relation. The static hero relation lives outside that target, so the runtime may still inject another Gabil card into the detail area.

The static relation also contains internal copy:

`Организатор / participant relation from entity record`

which must not remain public.

### Required change

- one owner for `event → Dementor` relation;
- keep one compact relation near the event hero/core facts;
- remove route-specific duplicate injection on Fuengirola, or make the runtime detect the page-level existing relation before injection;
- remove/demote the later large Gabil portrait feature so it does not become a second dominant identity treatment;
- Gabil may remain named in ordinary text and the quote may remain without another portrait/identity card;
- replace the internal `participant relation from entity record` wording with user-facing relation language or remove the explanatory subline if no approved wording is needed.

### Acceptance

On the built `/events/fuengirola/` artifact:
- exactly one primary event→Gabil relation card;
- no second dominant Gabil portrait feature in the adjacent page flow;
- no third runtime-injected Gabil card;
- ordinary textual mentions/citations are allowed;
- no internal entity-record terminology is visible.

---

## 3.2 Priority A / Visual Major — Home: one Valentin presentation in course feature

### Current fact

The `Думай с опасностью` block contains both:

`Дементор: Валентин Лосев.`

inside the paragraph and immediately after it a full mentor-card with Valentin portrait/name/role.

### Required change

Keep the visual mentor-card as the identity treatment. Remove only the duplicate textual attribution from the preceding course paragraph.

Do not redesign the course feature.

### Acceptance

One Valentin identity presentation in the course block; course paragraph describes the course only.

---

## 3.3 Priority A — remove implementation/data-model language from public UI

### Confirmed examples

Public implementation currently exposes phrases including:
- `source-of-truth`;
- `canonical source-of-truth`;
- `participant relation from entity record`;
- `CHECKOUT / DISABLED`;
- `PRICE / TBD`;
- `production spec`;
- `sales_state`;
- `PENDING` where it explains internal fixation rather than useful public state;
- `MECHANICS PENDING`.

Primary surfaces:
- `/`;
- `/events/`;
- `/events/fuengirola/`;
- `/merch/`;
- `/community/gabil/`.

### Rule

Remove real implementation/data-model terminology, but preserve the club's intentional pseudo-bureaucratic visual language.

Allowed stylistic vocabulary can still include things such as:
- `STATUS`;
- `EVENT / PLANNED`;
- `PUBLIC FACTS`;
- numbered registries and formal-looking labels.

The cleanup target is language that exposes repository/database/CMS mechanics, not the Dementor Club tone itself.

### Replacement principles

Examples:
- `PRICE / TBD` → `Цена будет объявлена` or equivalent existing club-language state;
- `CHECKOUT / DISABLED` → `Продажи пока не открыты`;
- `MECHANICS PENDING` → remove, or replace with a useful public state if one is already supported;
- `source-of-truth`, `sales_state`, `production spec`, entity-record terms → never show publicly.

If a fact is not approved:
- do not invent it;
- hide the unnecessary field/section, or use a neutral public state such as `Раздел готовится` when useful.

### Acceptance

Built public copy contains no implementation markers such as:

`source-of-truth`, `sales_state`, `production spec`, `participant relation from entity record`.

The validator may maintain an explicit denylist for these internal markers.

---

## 3.4 Priority B — `/community/`: one semantic hero DOM

### Current fact

The Community hero has two full content trees:

- `.hero-ref__desktop`;
- `.hero-ref__mobile`.

Both independently contain the same image, `ЛЮДИ ЕСТЬ.`, lead and body copy.

### Required change

Use one semantic hero DOM and rearrange the same nodes through Grid/Flex/order/media queries.

Do not redesign the hero content.

### Acceptance

Built DOM contains:
- one hero `<h1>`;
- one hero image source;
- one lead source;
- one body-copy source.

Desktop/mobile layout may differ through CSS only.

---

## 3.5 Priority B — `/events/`: reduce empty lifecycle visual weight

### Current fact

One real event exists in `PLANNED`, while ANNOUNCED / REGISTRATION / SOLD-OUT / COMPLETED / CANCELLED each receive full-size lanes with `00` empty states.

The same editorial point — empty states are meaningful and the club does not invent activity — is repeated in multiple blocks.

### Required change

Do not change the lifecycle model.

- active lifecycle states with real entities remain full rows/lanes;
- empty states collapse into a compact lifecycle rail/legend/status block;
- state names/counts remain visible enough to preserve the model;
- explain the editorial rule once, not repeatedly;
- Fuengirola remains the dominant programme record.

### Acceptance

Five empty states no longer occupy most of the page or compete visually with the actual event.

---

## 3.6 Entity Identity Density rule

Use existing Entity Presentation vocabulary:

`link / micro / inline / row / relation / feature / hero / detail / preview`.

Production rule:

> The same entity must not have two large identity treatments in one semantic block or in immediately adjacent sections without an explicit editorial exception.

Examples:
- `Gabil relation + Gabil feature + Gabil runtime card` → prohibited;
- `Valentin text attribution + full mentor card` → one is redundant;
- `Gabil relation + ordinary text quote lower on page` → allowed.

This is enforcement of the existing presentation system, not a new design system.

---

## 3.7 Public product/course local-shell QA

Do not rebuild all headers.

Check public course/product pages only for local bars that:
- sit below the canonical Global Header;
- do not duplicate the club logo;
- do not appear as a second primary navigation;
- do not overlap the Global Header;
- reflow correctly on mobile.

This is QA unless a concrete defect is found.

---

# 4. Regression guards required in Result 1

Minimum route matrix:

- `/`;
- `/events/`;
- `/events/fuengirola/`;
- `/community/`;
- `/community/gabil/`;
- `/merch/`.

Canonical responsive baseline:

`1440 / 1024 / 768 / 390 / 360`.

Optional extreme-small check:

`320`.

`320` is supplementary; it must not be described as replacing the existing canonical responsive baseline.

### Required assertions

At minimum:
- Fuengirola has exactly one event→Gabil relation treatment;
- no second dominant Gabil portrait feature remains;
- Home course block has one Valentin identity attribution;
- Community hero has one `<h1>` and one semantic content source;
- Public Header matches current Russian/auth-aware canonical contract;
- `Archive` and legacy `Join` do not return to primary nav;
- public copy has no forbidden internal markers;
- no horizontal overflow at baseline widths;
- mobile critical interactions do not depend on hover;
- built artifact, not source HTML alone, is the validation target.

Extend existing validators where possible:

- `scripts/validate-visual-contract.mjs`;
- `scripts/validate-browser-shell.mjs`;
- `scripts/validate-shell-contract.mjs`.

Do not create a pile of one-off validators if an existing coherent validator can own the check.

---

# 5. G6 validation for Result 1

Before any production release, run the full current Site Integrity / Release Readiness chain plus targeted visual/content assertions.

Validation must cover:
- production build;
- built `_site` artifact;
- route integrity;
- canonical shell ownership;
- header pixel/structure regression;
- desktop/mobile public routes above;
- DOM duplication assertions;
- internal-language denylist;
- no horizontal overflow;
- no auth/DC9/Workspace/Board regressions introduced by shared-runtime edits;
- SEO/canonical/OG route sanity for touched public pages.

A green source-level diff is not sufficient.

---

# 6. Release rule for Result 1

`commit ≠ merge ≠ deploy`.

Sequence:

1. implementation branch from exact production baseline;
2. G6 validation;
3. clean production candidate if required by branch divergence;
4. explicit owner approval;
5. merge to `dementor-club-production`;
6. manual production deploy;
7. live desktop/mobile retest;
8. G8 cleanup.

No DB mutation is expected or authorized by this visual Result.

---

# 7. Result 2 — `public-site-visual-tech-debt-cleanup-v1`

Start only after Result 1 is released/live-validated and its visual state is protected by tests.

Requirement:

> No user-visible visual change relative to the accepted Result 1 production state unless a separate defect is explicitly opened.

## 7.1 Header legacy debt

The current runtime header is canonical; visual header remains locked.

Known debt:
- `docs/GLOBAL_HEADER_v1.md` still documents legacy English nav including `Archive / Join`;
- `motion-v1.js` contains historical `.nav` behavior that inserts `Archive` before legacy `Join`.

Actions:
- update the documentation or mark the old contract superseded and create a current contract;
- remove the old `.nav`/Archive mutation only after proving the built production artifact no longer depends on it;
- preserve shell regression tests.

Acceptance: header is visually identical before/after tech-debt cleanup.

## 7.2 CSS ownership cleanup

Do not delete date/version-stamped layers blindly.

First build an active import map from built `_site`, including dynamically injected CSS/JS.

Classify each file:

`ACTIVE OWNER / COMPATIBILITY / DEAD`.

Only then:
- move surviving necessary rules into canonical owners;
- remove obsolete correction/tuning layers;
- preserve computed output.

## 7.3 Exact duplicate assets

For binary duplicate families:
- confirm exact content/blob equality;
- perform full source + built-reference scan;
- choose one canonical path;
- update references;
- delete only proven exact duplicates.

Do not deduplicate merely because filenames or images look similar.

## 7.4 Runtime/version cleanup

The previous DC-9 G8 cleanup already removed retired account-sync v8/v9; do not use the earlier v6/v7/v8/v9/v10 list as current truth.

Build a fresh runtime manifest from current production and classify generations as:

`ACTIVE / COMPAT ROUTE / DEAD`.

Delete only `DEAD`.

Keep this cleanup separate from user-facing visual harmonization.

---

# 8. Primary implementation surfaces

Result 1 likely touches:

- `events/fuengirola/index.html`;
- `dementor-relations-v1.js`;
- `index.html`;
- `community/index.html`;
- `events/index.html`;
- `merch/index.html`;
- `community/gabil/index.html`;
- `event-system.css`;
- `community-v2.css`;
- existing visual/browser/shell validators.

Result 2 investigation surfaces:

- `motion-v1.js`;
- `docs/GLOBAL_HEADER_v1.md`;
- `styles.css` + page-family CSS dependency graph;
- `site-config.js`;
- asset tree;
- runtime version tree;
- `scripts/build-pages.mjs`.

This is an investigation list, not permission to mutate every listed file.

---

# 9. Built-artifact rule

Raw HTML is not authoritative proof of production behavior.

The production builder intentionally:
- removes legacy page-owned `header.topbar` markup;
- injects the canonical Public Global Header on public routes;
- removes/replaces public footers where required;
- injects shared production modules;
- normalizes legacy origins/paths;
- hardens selected runtime behavior.

Therefore every visual change must be validated against built `_site` after `scripts/build-pages.mjs` / the canonical production build path.

Source HTML remains implementation evidence, not the final visual/runtime contract.

---

# 10. Definition of Done

Result 1 is complete only when the public site reads as if each entity was intentionally placed once:

- Fuengirola has one Gabil relation identity, not several competing Gabil cards;
- Home has one Valentin identity presentation in the course feature;
- Community has one semantic hero source;
- Events gives real activity more visual weight than empty lifecycle states;
- public pages use club language rather than repository/database/CMS language;
- canonical Global Header is unchanged;
- regression guards protect all of the above in the built artifact;
- desktop/mobile smoke passes;
- no Workspace/DC-9/Board/auth semantics changed.

Result 2 is complete only when proven dead/duplicate implementation debt is reduced without changing the accepted public visual output.

---

## 11. Decision boundary

This specification does not itself approve new public facts, prices, event dates, membership mechanics, roles, new design patterns or lifecycle changes.

If harmonization reveals that fixing a visible problem requires changing product meaning rather than presentation/ownership, stop that mutation and open the required Decision/Change Proposal instead of silently folding it into cleanup.