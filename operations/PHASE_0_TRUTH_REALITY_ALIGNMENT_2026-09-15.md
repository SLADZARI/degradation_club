# DEMENTOR CLUB — PHASE 0 · TRUTH / REALITY ALIGNMENT

Status: **WORKING CANON / IMPLEMENTATION GATE**  
Updated: **2026-09-15**  
Stack: Product → Production Audit v1 / Product & Marketing Package 01–15

## Purpose

Phase 0 exists to make one thing true before any large product transformation:

> **THE PUBLIC PRODUCT MUST HAVE ONE FACTUAL REALITY.**

This phase does not redesign Home, Board, Community or Projects.
It does not invent a new ontology.
It does not open payments, registration or new access.

It resolves which source owns which fact, identifies conflicts that cannot be resolved safely, and defines the gate that must pass before Phase 1.

---

# 1. Conflict order

Use `15 · Product Principles / Anti-patterns`:

```text
TRUTH
→ VALUE
→ MEANING
→ SEMANTICS
→ AUTONOMY
→ OPTIMIZATION
```

Therefore a factual conflict blocks optimization.

A newer UI, a runtime field, a database row, a search result or a stronger CTA does not automatically become public truth merely because it exists.

---

# 2. Authority map

## 2.1 Deployed site artifact

**Authority:** successful manual production deploy + canonical production branch.

Current evidence:

- production branch: `dementor-club-production`;
- current branch SHA: `688899e31b82e14c31f5f805b2bce4f00f3741c0`;
- merge time: 2026-09-14 22:09 UTC;
- manual `Deploy Dementor Production` run `34903066857` started 2026-09-14 22:14 UTC;
- workflow explicitly checks out `dementor-club-production`;
- build: SUCCESS;
- GitHub Pages deploy: SUCCESS.

### Phase-0 conclusion

Treat `688899e31b82e14c31f5f805b2bce4f00f3741c0` as the currently deployed production artifact unless a later successful production deploy supersedes it.

An older search-engine snapshot must not override deploy evidence.

---

## 2.2 Canonical public origin

**Authority:** `site-config.js`.

Canonical origin:

`https://dementor.club`

Legacy origins are not canonical:

- `https://degradation-club.vercel.app`
- `https://sladzari.github.io/degradation_club`

Runtime currently normalizes some legacy OG metadata in-browser. This is useful as a compatibility patch, but it is not sufficient for crawlers / previews that read static HTML without executing JS.

### Public truth

Every current public Thing / Event / Dementor work should identify `dementor.club` as canonical unless an external address is intentionally the product's canonical home.

---

## 2.3 Programs

**Operational authority:** `dc_entities` + `dc_programs`.

Current truth:

| Slug | Title | Status | Type | Delivery |
| --- | --- | --- | --- | --- |
| `dengi-na-veter` | Деньги на ветер | `mvp-in-development` | course | adaptive_digital |
| `dumai-s-opasnostyu` | Думай с опасностью | `approved-draft` | course | self_paced |
| `ne-komanda` | НЕ КОМАНДА | `active` | practice | recurring |
| `slaboumie-i-otvaga` | Слабоумие и отвага | `planned` | experience | physical |

Additional confirmed facts:

- `НЕ КОМАНДА`: Monday 10:00 / Europe-Madrid;
- `Деньги на ветер`: Dementor Никита;
- `Думай с опасностью`: Dementor Валентин Лосев;
- `Слабоумие и отвага`: Dementor Евгений.

### Rule

Public status labels may be editorially translated, but may not imply a stronger state than the operational status.

Examples:

- `approved-draft` ≠ released paid course;
- `mvp-in-development` ≠ finished commercial product;
- `planned` ≠ registration open.

---

## 2.4 Event · Fuengirola

**Operational authority:** `dc_entities` + `dc_events`.

Confirmed current truth:

- title: `Фуэнхирола`;
- status: `planned`;
- location: `Fuengirola, Spain`;
- capacity: `7`;
- Dementor: `Габиль`;
- visibility rule: `member-details-after-onboarding`.

Current site configuration:

- event registration: disabled;
- registration URL: none.

Current public page additionally states:

- date: not published;
- price: not published.

### Phase-0 conclusion

These claims are compatible and can remain public:

- PLANNED;
- Fuengirola / Spain;
- up to 7 people;
- Gabil;
- detailed access after onboarding / membership path.

Do **not** publish a date, price, registration-open state or payment CTA until a primary source explicitly confirms it.

---

## 2.5 Projects

**Authority:** project-specific editorial/product sources + reviewed public Project surface.

Projects are not required to exist as rows in `dc_entities`.
The absence of a Project row does not make a real Project nonexistent.

Current production Projects Hub v2 contains four project surfaces:

1. Dementor Lab — public approved project presentation; not yet a public playable Release;
2. Dementor Battle — in development;
3. Robo Games — in development;
4. Logic & Awareness — editorial project with its own project authority.

### Rule

Do not make `/catalog/` or `dc_entities` the source of truth for whether a Project exists.

A Project can have its own source authority.
The public Projects Hub must reflect those sources, not the limitations of the registry implementation.

---

## 2.6 Membership / Join

**Authority:** current membership review model + DC-9 entry state.

Confirmed product boundary:

- account ≠ membership;
- DC-9 can exist as a standalone experience;
- completed DC-9 enables the membership application path;
- membership is reviewed separately;
- membership is not a payment tier.

### Rule

Do not describe registration, DC-9 completion, application and membership as one continuous conversion state.

---

## 2.7 Board / Artifacts

**Operational authority:** `dc_artifacts` and related Board tables for Board records.

Current snapshot:

- 17 total Artifacts inspected;
- 3 `active`;
- 4 `archived`;
- 10 `expired`.

Recent history contains explicit QA / smoke records such as:

- `#176 SMOKE ON`;
- `#176 SMOKE OFF`;
- Board test publications.

### Phase-0 rule

`ARTIFACT EXISTS` does not mean:

- Programming Moment;
- audience evidence;
- current editorial priority;
- market demand;
- meaningful delta.

Until editorial disposition exists, Board Artifacts remain operational Board content only.

### Measurement rule

Raw Artifact count, raw Board open count and QA activity must not be used as Program Health or external demand evidence.

---

# 3. Merch — resolved rules and unresolved source decisions

Merch currently has the highest factual risk.

## 3.1 Commerce readiness authority

Current `site-config.js`:

- catalog enabled: yes;
- cart enabled: yes;
- checkout enabled: **false**;
- checkout provider: none;
- checkout URL: none;
- preorder payment method: none;
- runtime source: Supabase.

Current operational WIP explicitly says:

> Replace client-facing `SALES NOT OPEN` / `NOT OPEN` with `PREORDER` only when payment flow is actually ready.

And:

> No production deploy is authorized by this document.

### Phase-0 conclusion

Raw `dc_merch_items.sales_state` is **not sufficient authority for public commerce-open wording**.

Public state must be gated by commerce readiness.

While `checkoutEnabled=false` and no approved payment flow exists:

- do not advertise `PREORDER` as an actionable public state;
- do not advertise an item as commercially `OPEN`;
- do not show checkout/order CTAs;
- do not infer real sold-out history from a raw runtime state unless an approved source confirms that sales were actually open.

This rule overrides the current behavior in `merch-runtime-v1.js` that can project `PREORDER` / `SOLD OUT` directly from Supabase.

---

## 3.2 OBJECT 001 — НЕ НАДО

### Confirmed

Operational WIP price:

- `EUR 520`.

Supabase:

- SKU: `DC-OBJECT-001`;
- price: `EUR 520`;
- raw sales state: `preorder`;
- public_visible: true.

Static production HTML fallback:

- price: `EUR 220`;
- state: `NOT OPEN`.

### Phase-0 public truth

- canonical price: **EUR 520**;
- public commerce state: **NOT OPEN / CHECKOUT DISABLED** until payment flow is approved;
- raw DB `preorder` may remain an internal/preparatory state but must not be exposed as actionable public commerce state while checkout is disabled.

### Required correction

Static/public fallbacks must not say EUR 220.

Either:

- render EUR 520 consistently;
- or omit price until canonical runtime loads.

Never show EUR 220 as current truth.

---

## 3.3 SH-DEM-01 — OVERTHINKING IS MY CARDIO.

### Conflict

Operational WIP says:

- LIGHT: EUR 79.

Supabase currently says:

- base price: EUR 89;
- sales state: `sold_out`.

### Status

**SOURCE DECISION REQUIRED.**

Do not choose EUR 79 or EUR 89 by inference.
Do not call it `SOLD OUT` as a public claim until the owner confirms whether this represents real historical sales or a test/internal state.

Until resolved, safest public commercial state is:

- product visible if editorially intended;
- purchase unavailable;
- no sold-out claim;
- price either hidden or explicitly sourced from the approved product source after decision.

---

## 3.4 SH-DEM-02 — PERSONAL GROWTH CANCELLED.

Operational WIP:

- EUR 79.

Supabase:

- EUR 79;
- `not_open`.

### Phase-0 truth

- price: EUR 79;
- public sales state: NOT OPEN.

No conflict requiring owner decision.

---

## 3.5 SH-DEM-03 — SUCCESS IS BORING.

Operational WIP:

- LIGHT: EUR 79;
- BLACK: EUR 89.

Supabase currently contains one row:

- base price: EUR 79;
- state: `not_open`.

### Phase-0 truth

For the current registered row:

- EUR 79;
- NOT OPEN.

Black variant EUR 89 must not be implied to be a separately purchasable runtime item until its variant/source representation is explicitly approved.

---

## 3.6 SH-DEM-04 — ВАШ ПОТЕНЦИАЛ СЛИШКОМ ДОЛГО ОСТАВАЛСЯ РАСКРЫТЫМ.

Current production Merch surface includes the product card / route.

Current `dc_merch_items` snapshot contains no `SH-DEM-04` row.

### Status

**SOURCE DECISION REQUIRED.**

Need one explicit decision:

- active public working product;
- concept / preview only;
- removed from current catalog;
- or missing registry row that must be restored.

Until resolved it must not claim `LIVE PRICE / LIVE STATUS`.

---

# 4. Catalog truth

Current static `/catalog/` claims hard counts and statuses across multiple source systems.

This is not a single-source registry in practice.

Examples:

- Projects have project-specific sources;
- current `dc_entities` contains 4 Programs + 1 Event but no Project rows;
- Merch runtime has its own source table;
- static Catalog includes four Wear routes while runtime currently has three Wear rows.

### Phase-0 rule

Catalog is a **secondary registry / provenance surface**, not a primary source of product truth.

Before it can make hard live claims it must either:

1. be generated from approved authorities; or
2. stop publishing volatile hard counts/statuses.

Until then:

- do not use Catalog counts as operational evidence;
- do not use Catalog absence to conclude a Thing does not exist;
- do not use Catalog status to override primary source status.

---

# 5. Canonical metadata truth

Runtime normalizes some legacy metadata to `https://dementor.club`.

Static files still contain legacy hosts in places including:

- Fuengirola;
- Gabil profile;
- Object 001;
- НЕ КОМАНДА.

### Phase-0 rule

Runtime normalization is not enough for:

- crawler previews;
- Telegram / social parsers that may not execute JS;
- static HTML audits;
- share-card consistency.

Static build output must contain canonical `dementor.club` URLs.

---

# 6. Deployment status truth

`.github/production-release.txt` currently describes the site as `READY_FOR_MANUAL_APPROVAL`.

However a later manual production deploy succeeded on 2026-09-14 after the current production SHA was merged.

### Phase-0 conclusion

The file is stale as a current release-status statement.

It may remain as historical release metadata only if clearly versioned as such.
It must not be read as current deployment truth.

Current deployment truth comes from the latest successful `Deploy Dementor Production` run.

---

# 7. Analytics / evidence truth

Current data is heavily affected by:

- internal use;
- authentication flows;
- QA;
- Board smoke tests;
- small sample size.

### Phase-0 rule

Before Phase 1 conclusions are measured:

- internal/test traffic must be identified or excluded;
- QA Artifacts must not count as editorial activity;
- auth/referral traffic must not be interpreted as acquisition demand;
- pageviews alone must not be treated as value;
- Board opens alone must not be treated as Program consumption.

No monetization conclusion should be derived from current raw traffic.

---

# 8. Current truth matrix

| Object / Surface | Current factual state | Authority | Public action now |
| --- | --- | --- | --- |
| Deployed site artifact | production SHA `688899e…` deployed successfully | GitHub Actions + production branch | KEEP |
| Canonical origin | `https://dementor.club` | site-config | FIX static metadata where legacy remains |
| Projects Hub | 4 current project surfaces | project sources + production Hub | KEEP |
| Dementor Lab | public presentation, not public playable Release | Project source / production page | KEEP, no playable promise |
| Dementor Battle | in development | Project source / Hub | KEEP status, no generic release claim |
| Robo Games | in development | Project source / Hub | KEEP status, no generic release claim |
| Logic & Awareness | editorial project | project editorial source | KEEP |
| Деньги на ветер | MVP in development | dc_entities/programs | KEEP status |
| Думай с опасностью | approved draft / self-paced | dc_entities/programs | do not imply commercial release |
| НЕ КОМАНДА | active recurring practice, Mon 10:00 Europe/Madrid | dc_entities/programs | KEEP |
| Слабоумие и отвага | planned physical experience | dc_entities/programs | KEEP PLANNED only |
| Fuengirola | planned / Spain / ≤7 / member details after onboarding | dc_events | KEEP; no date/price/open registration claim |
| DC-9 | standalone experience + optional membership branch | current Join system | KEEP |
| Membership | reviewed access relationship | membership system | KEEP, not a paid tier |
| Board Artifacts | operational records; 3 active / 17 inspected | dc_artifacts | do not equate with Program |
| Object 001 | EUR 520; public commerce not open | WIP + Supabase + checkout gate | FIX €220 fallback; suppress actionable PREORDER |
| SH-DEM-01 | price/state conflict | WIP vs Supabase | BLOCKED / SOURCE DECISION |
| SH-DEM-02 | EUR 79 / not open | WIP + Supabase | KEEP |
| SH-DEM-03 registered row | EUR 79 / not open | WIP + Supabase | KEEP |
| SH-DEM-03 black | EUR 89 working source only | WIP | no separate runtime sales claim yet |
| SH-DEM-04 | public route exists, runtime row absent | static surface vs runtime registry | BLOCKED / SOURCE DECISION |
| Catalog | mixed-source static snapshot | secondary utility | MOVE / do not treat as authority |
| Production release txt | stale relative to successful deploy | historical file | FIX / version as historical |

---

# 9. Required implementation tickets

Phase 0 requires five implementation workstreams.

## P0-A · Commerce truth gate

Public Merch state must combine:

- product/source state;
- commerce readiness;
- checkout readiness.

A raw `preorder` database state cannot become an actionable public PREORDER when checkout is disabled and launch rules say payment is not ready.

## P0-B · Merch source decisions

Owner decision required for:

- SH-DEM-01 canonical price;
- SH-DEM-01 whether `sold_out` is a real historical public state or test/internal state;
- SH-DEM-04 current public existence and registry status.

## P0-C · Static canonical metadata

Build/static HTML must use `dementor.club` canonical URLs without relying on client-side rewrite.

## P0-D · QA / evidence separation

Board and analytics need explicit test/internal classification so smoke activity cannot be read as Program activity or user demand.

## P0-E · Catalog / release-status synchronization

- Catalog must stop acting like a live single-source register unless generated from authorities;
- production release status file must not contradict actual deployment history.

---

# 10. Phase-0 Definition of Done

Phase 0 is closed only when all are true:

- [x] current deployed artifact is identified from deploy evidence;
- [x] canonical public origin is identified;
- [x] current Program statuses are confirmed from operational source;
- [x] current Fuengirola facts / access boundary are confirmed;
- [x] Projects are assigned to project-specific authority instead of forced into `dc_entities`;
- [x] Board Artifact state is separated conceptually from Program state;
- [x] public commerce readiness rule is resolved;
- [x] Object 001 canonical price is resolved;
- [ ] SH-DEM-01 source conflict is resolved by owner;
- [ ] SH-DEM-04 current status is resolved by owner;
- [ ] Merch public projection no longer exposes stronger sales-state than commerce readiness permits;
- [ ] static canonical URLs are corrected in build output;
- [ ] QA/test Artifacts and traffic are separated from product evidence;
- [ ] Catalog volatile counts/statuses are generated from authorities or removed;
- [ ] current deployment status documentation no longer contradicts deploy history.

---

# 11. Exit rule

Phase 1 · Program Layer may start in design / specification now.

Production implementation of Phase 1 should not be used to amplify surfaces with unresolved P0 truth conflicts.

Especially:

> **DO NOT MAKE COMMERCE MORE VISIBLE UNTIL COMMERCE TRUTH IS CONSISTENT.**

> **DO NOT USE BOARD ACTIVITY AS PROGRAM EVIDENCE UNTIL QA / EDITORIAL DISPOSITION IS SEPARATED.**

Once the remaining Phase-0 tickets are closed, the product can safely move from factual alignment to semantic re-ordering.
