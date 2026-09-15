# DEMENTOR CLUB — CURRENT IMPLEMENTATION STATE

Status: **CURRENT STATE / IMPLEMENTATION HANDOFF**  
Date: **2026-09-15**

## 0. Executive verdict

Product & Marketing Package `01–15` is semantically complete enough for v1.

The project does **not** need another ontology pass and does **not** need a platform rewrite.

The next phase is:

**TRUTH LOCK → REMOVE WRONG USER-FACING MEANING → CROSS-SURFACE SEMANTIC ADAPTERS → SPLIT USER CONTRACTS → ADD EDITORIAL TRUTH → BUILD CONTINUATION → HARDEN DISTRIBUTION / METRICS → TEST MONEY ONLY AFTER VALUE**

Canonical implementation stance:

> **PRESERVE WORKING INFRASTRUCTURE. REPLACE WRONG PRODUCT MEANING.**

And the main governance rule:

> **SEMANTICALLY ACCEPTED ≠ MERGED ≠ IMPLEMENTED ≠ EMPIRICALLY VALIDATED.**

Those four states must be tracked separately from now on.

---

# 1. Package state

## Semantically complete

The package now contains the full v1 authority chain:

1. Product Thesis / JTBD
2. CJM Club + participation journey
3. Audience & Entry
4. Value Architecture
5. Product Model
6. Board Product Model
7. Content & Programming
8. Return Loops
9. Contribution
10. Dementor / Intervention
11. Marketing Positioning & Messaging
12. Distribution
13A. Monetization Architecture
13B. Distribution Economics
14. Metrics & Signals
15. Product Principles / Anti-patterns

The product theory is no longer the bottleneck.

## Merge reality

`01–07` are already on the `dementor-club` authority base.

`08–15` remain an open stacked authority chain:

```text
#188
→ #189
→ #190
→ #191
→ #193
→ #192
→ #194
→ #195
```

`14` concept is already `WORKING CANON / open stack`, but PR #194 is still Draft. Before landing, its production mapping should be synchronized to final `14` wording where old `Qualified Entry` / generic `13` terminology remains.

The package index on `dementor-club` is stale relative to the open stack. It should be updated once after the chain lands, not in every stacked PR.

---

# 2. Operational document ownership

Two full runtime audits now exist. They must not become competing truths.

## PR #196 — Product → Production Audit

**Owner question:**

> **WHAT IS TRUE NOW, AND WHERE DO LIVE / PRODUCTION / SOURCE TRUTH / PACKAGE DISAGREE?**

Keep #196 as the current-state / truth audit.

It already identified a critical precondition: LIVE, `dementor-club-production` and source truth are not always the same reality.

Examples include Project surfaces, Merch/source-state differences, canonical/OG drift and QA-heavy Board history.

## PR #197 — Runtime Harmonization Plan

**Owner question should become:**

> **HOW DO WE CHANGE THE CURRENT REALITY SAFELY?**

#197 should not remain a second equal current-state audit.

Before merge / execution it should be:

- retargeted after #196 / current package stack;
- shortened where it duplicates #196;
- corrected using the sequencing and risk decisions below.

---

# 3. What already works and should be preserved

## Domain / operational source truth

KEEP:

- Event entities and Event detail surfaces;
- Program / Course sources;
- Projects;
- `dc_entities`;
- Artifact storage / publication carrier;
- profiles;
- membership / access infrastructure;
- moderation infrastructure;
- existing IDs and stable routes.

The package does **not** justify converting all of these into one universal Thing table.

## Board foundation

KEEP:

- current spatial Board infrastructure;
- source projections / adapters;
- guest/member state model;
- reactions / responses plumbing;
- detail routes;
- Artifact ownership / slots where operationally required;
- RLS / RPC permission boundaries.

The Board needs a semantic reframe, not a ground-up rewrite.

## Distribution transport

KEEP:

- sitemap / robots;
- canonical runtime;
- public routes;
- OG / Twitter metadata primitives;
- Telegram outbox / worker;
- Telegram delivery states;
- scheduler/service-to-service worker boundary.

## Analytics transport

KEEP:

- GA4;
- Clarity;
- consent gate;
- production-origin guard;
- payload sanitization / PII blocking;
- route/entity opens;
- CTA telemetry;
- `recommendation_click` and placement/source-page primitives.

The missing layer is Product Health semantics, not another analytics vendor.

---

# 4. Active product conflicts

## A. Home still teaches CLUB / SERVICE / JOIN before Thing proof

Production Home currently leads with `CLUB / CULTURAL PLATFORM`, service framing and a primary Join/procedure CTA.

It already contains strong Things — Course, Event, Project — but the hierarchy still teaches the organizational model before the product experience.

Target:

**VIEWPOINT / BRAND FRAME → REAL THING → EXPERIENCE → NEXT THING**

Important: Wave 1 should correct hierarchy and proof first. Do **not** build the full dynamic Programming engine inside the Home rewrite. Real Programming selection belongs to the later Programming layer.

## B. Board still has coercive first-Artifact language

Production still contains copy such as:

`FIRST ARTIFACT / REQUIRED`

and:

`ПРЕЖДЕ ЧЕМ ОСМАТРИВАТЬСЯ, ОСТАВЬТЕ ЧТО-НИБУДЬ.`

This conflicts with `Consumption itself is success` and `Value is not a ladder`.

But this is **not currently a broad permission gate**.

Production `board-activation-gate-v1.js` explicitly treats `FIRST_ARTIFACT_REQUIRED` as presentation/onboarding only and preserves reaction/response rights.

Therefore the fix is:

> **REMOVE COERCIVE FIRST-ARTIFACT FRAMING; PRESERVE ACTIVATION / WRITE-PERMISSION LIFECYCLE.**

Do not delete membership/RLS/slot logic just to fix wording.

## C. Artifact carries too many product meanings

Current Artifact machinery simultaneously participates in:

- public member publication;
- Board object rendering;
- member slot mechanics;
- history/status presentation;
- Telegram promotion state;
- potential future contribution carrier.

This is acceptable as implementation reuse only if user contracts are separated.

Artifact must stop defining product ontology.

## D. Contribution and Direct Publish are not structurally separated

This is the highest-risk semantic/runtime gap.

Two explicit contracts are required:

### Contribution / ПРИНЁС

Private/editorial inbound by default.

### Direct Publish

Explicit public action for a ready standalone Thing.

A UI split alone is insufficient.

Backend safety invariant:

> **A CONTRIBUTION MUST BE STRUCTURALLY UNABLE TO ENTER PUBLIC BOARD / TELEGRAM / SITEMAP / SHARE / MEMBER SLOT BY ACCIDENT.**

This may require an additive purpose/visibility/status boundary and dedicated RPC/RLS behavior even if Artifact remains the common carrier.

## E. Programming truth is still weaker than technical activity

Current product still contains places where publication, timestamps and activity are closer to audience visibility than the new model permits.

Target:

**THING / RELEASE / HISTORY / PARTICIPATION SIGNAL → EDITORIAL PROGRAMMING DECISION → SURFACE / DISTRIBUTION**

Not:

**ROW CHANGED / PUBLISHED → SHOW / SEND**

## F. Release and History need semantic truth

Do not infer Release from URL existence or generic `published` status.

Do not infer History from every Activity row.

Release means audience-available standalone experience.

History means meaningful consequence/change in the life of Thing/Project.

## G. Product identity is not yet stable across surfaces

ThingProjection is the right bridge, but it needs a stable identity contract before analytics and continuation depend on it.

Recommended v0 identity:

```text
event:<canonical-id>
program:<canonical-id>
artifact:<uuid>
project-output:<stable-id>
```

Do not prematurely merge multiple source objects into one cross-source Thing identity unless the editorial identity is actually proven.

Adapters must allow `unknown / none`; they must not invent Release, Participation or History just to fill a ViewModel.

---

# 5. Telegram — preserve transport, reclassify meaning

The existing Telegram system is more mature than a simple `Artifact submit → worker` model.

Production already has:

- trusted scheduler (`pg_cron + pg_net`);
- service-to-service worker auth;
- promotion support ledger;
- threshold mechanics;
- `held → pending` delivery states;
- Owner/Admin suppression;
- `delivery_unknown` recovery.

The new Distribution model must **not silently remove this working mechanism**.

Important authority rule from `12`:

> **PROGRAMMING MOMENT GATES EDITORIAL OUTBOUND. IT DOES NOT GATE ALL DISCOVERY.**

Before changing Telegram, explicitly classify the current community-support promotion path.

Two valid options to test:

### Option A — Community support is a separate Distribution Trigger

`community_support` can legitimately create a DistributionDecision without pretending it is an editorial Programming Moment.

### Option B — Community support creates a candidate

Threshold is reached → editorial/distribution decision confirms outbound eligibility.

Do not choose silently.

Protect idempotency and existing delivery recovery while changing semantic eligibility.

---

# 6. ThingProjection ownership

ThingProjection is **not Board infrastructure**.

Hard guardrail:

> **THING PROJECTION IS PRODUCT-SEMANTIC INFRASTRUCTURE. BOARD IS A CONSUMER, NOT ITS OWNER.**

Consumers include:

- Home;
- Board;
- Thing / Artifact detail;
- Programming;
- Distribution / Share;
- Metrics;
- Dementor body of work.

The shared semantic layer should be independent of spatial Board code.

Board-specific `BoardThingViewModel` may adapt the shared product projection for Board presentation, but it must not become the canonical Thing source.

---

# 7. Analytics state

Current telemetry is usable but current sample is contaminated by internal/admin/auth/Workspace/Board activity.

Do not interpret raw traffic as market demand.

Population classes from final `14`:

- `external_audience`;
- `authenticated_member_or_contributor`;
- `internal_admin_test`;
- `unknown`.

Important:

> **AUTHENTICATED ≠ INTERNAL.**

Do not blanket-exclude all Google referral or signed-in sessions. Real Members, Contributors and Participants are valid product populations.

Use final terminology:

### Qualified Experience Entry

Valid Entry Object + actual experience start + valid human population.

### Distribution-qualified Entry

Qualified Experience Entry + known promise / target-intent fit.

Unknown distribution context does not invalidate a good experience.

Commercial evidence chain:

**SEEN → CONSUMED → RETURNED → EXPRESSED INTENT → COMMITTED → PAID → DELIVERED → REPEATED**

---

# 8. Revised implementation roadmap

## W0A — TRUTH / REALITY ALIGNMENT

Before refactoring:

- compare LIVE site;
- compare `dementor-club-production`;
- compare Supabase / authoritative runtime facts;
- resolve stale canonical / OG / price / availability / project-state disagreements;
- pin exact production/staging SHAs;
- only then freeze reference objects.

This is the first required correction to #197.

## W0B — AUTHORITY LANDING

Land / restack:

```text
#188
→ #189
→ #190
→ #191
→ #193
→ #192
→ #194
→ #195
```

Before landing #194, synchronize its production mapping terminology with final Metrics authority and mark Ready only after that review.

Then update package index once.

## W0C — HONEST ANALYTICS BASELINE

Implement population classification and produce a dated baseline without growth claims.

## W1A — HOME ENTRY HIERARCHY

Goal:

- Thing proof before Join;
- DaaS preserved as brand frame;
- 1–3 strong current objects visible;
- natural Thing → Thing continuation;
- no new hardcoded pseudo-Programming system.

## W1B — BOARD ONBOARDING SEMANTICS

Goal:

- public/eligible browsing value before creation pressure;
- remove coercive first-Artifact copy;
- preserve permissions, activation, RLS and slot lifecycle;
- no technical taxonomy as primary audience language.

## W2 — CROSS-SURFACE THING PROJECTION v0

Before implementation define:

- stable `thing_ref`;
- source mapping;
- nullable/unknown semantics;
- ownership of shared adapter;
- projection contract for Home / Board / Detail / Distribution / Metrics.

No universal `dc_things` table.

## W3 — CONTRIBUTION / DIRECT PUBLISH SPLIT

Ship UX and backend safety atomically.

Acceptance:

- private inbound cannot leak publicly;
- Direct Publish is explicitly public;
- Contribution does not consume public slot unless deliberately promoted to a public consequence;
- raw Contribution cannot trigger Telegram/SEO/share;
- editorial disposition / closure is representable;
- provenance survives merge/reframe.

## W4 — PROGRAMMING / RELEASE / HISTORY / DISTRIBUTION ELIGIBILITY

Add semantic truth for:

- why-now;
- audience availability;
- meaningful History;
- outbound eligibility;
- existing Telegram support-trigger classification.

## W5 — CONTINUATION / RETURN / PRODUCT HEALTH

Implement:

- truthful Thing → Thing;
- satisfied exit where no continuation exists;
- `thing_experience_start` only after stable Thing identity;
- form-aware consumption;
- Return / Return Payoff review.

## W6 — DEMENTOR / SITUATION

Move discovery toward:

**Situation → relevant Thing / Method / Tool / Course → human only if needed**

Profiles emphasize body of work, Practice and relevant situations.

## W7 — DISTRIBUTION HARDENING

Reuse existing transport.

Add:

- exact destination QA;
- Thing-specific previews;
- canonical-host consistency;
- Share context preservation;
- Event/physical continuation;
- semantic attribution.

## W8 — MONETIZATION EVIDENCE

No platform-wide billing project.

Only after external repeated value signal:

**one Value Object → one valid Offer → small payment test → delivery → repeat / no-repeat**

## W9 — VALIDATE / AMEND PRINCIPLES

`15` already exists.

Do not create it again after Waves 1–4.

Instead use implementation evidence to check whether any principle needs amendment in its primary authority and then synchronize `15`.

---

# 9. Immediate priorities

## P0 — before substantial runtime refactor

1. Truth / Reality Lock.
2. Fix Home hierarchy without premature Program engine.
3. Fix Board coercive first-Artifact framing without deleting permission lifecycle.
4. Design Contribution privacy/publication safety boundary.
5. Classify existing Telegram community-promotion trigger before semantic migration.
6. Separate analytics populations.

## P1 — semantic spine

1. stable Thing identity / ThingProjection;
2. Release truth;
3. ProgrammingDecision;
4. meaningful History;
5. Thing → Thing;
6. Qualified Experience instrumentation.

---

# 10. Risk register

| Risk | Severity | Failure mode | Required mitigation |
|---|---|---|---|
| Two competing operational audits (#196/#197) | **CRITICAL** | team uses two different current states | #196 = truth audit; #197 = execution plan |
| LIVE / production branch / DB divergence | **CRITICAL** | harmonize the wrong reality | W0A Reality Lock before W1 |
| Contribution leakage | **CRITICAL** | private material becomes Board/Telegram/SEO | backend/RLS invariant shipped with UX |
| Thing identity drift | **CRITICAL** | continuation/history/analytics cannot be compared | stable namespaced `thing_ref` contract |
| Telegram semantic overwrite / duplicate delivery | **CRITICAL** | lose community promotion or send duplicates | classify support trigger; preserve outbox idempotency |
| Removing activation instead of fixing presentation | **HIGH** | membership/Board write permissions regress | keep activation/RLS; remove coercive copy only |
| Hardcoding Home Program before Programming layer | **HIGH** | second temporary content engine | W1 = hierarchy; W4 = actual Program truth |
| ThingProjection owned by Board | **HIGH** | Board becomes hidden product model | standalone cross-surface semantic adapter |
| Adapter guesses unknown state | **HIGH** | false Release/History/Participation facts | explicit `unknown/none`, no inference without evidence |
| Analytics over-cleaning | **HIGH** | real authenticated product users disappear | classify populations, do not blanket-exclude login |
| Private object receives canonical/OG/share surface | **HIGH** | privacy / accidental publication failure | explicit public eligibility contract |
| Home + Board as one giant implementation PR | **MEDIUM** | regression/debug surface too large | split implementation ownership/QA even if same semantic wave |
| Reference fixtures selected before truth lock | **MEDIUM** | tests validate stale facts | freeze fixtures after W0A |
| Instrumentation before stable identity | **MEDIUM** | data becomes incomparable after W2 | population first; Thing events after identity contract |

---

# 11. Safe-start gate for runtime implementation

Do not begin large semantic runtime changes until all are true:

1. #196 truth map has been reviewed against current LIVE / production / DB.
2. Exact staging / production base SHA is pinned.
3. Reference objects have literal current facts — date, availability, route, author, price where relevant.
4. Thing identity v0 contract is chosen before cross-object analytics.
5. Contribution public/private safety invariant is designed before Contribution UI ships.
6. Existing Telegram support-promotion path is explicitly classified.
7. Analytics population baseline can distinguish internal/test from real users without deleting all authenticated traffic.
8. Runtime work targets staging / release branches, not semantic authority branches.

---

# 12. Branch / rollout discipline

Use semantic branches for authority documents.

Runtime implementation should follow the existing release discipline through staging / production candidates.

Conceptually:

```text
semantic acceptance
→ implementation on staging-compatible branch
→ browser / visual / anonymous / authenticated QA
→ analytics event QA
→ release gate
→ production deploy
→ production evidence
```

Do not treat:

**commit = merge = deploy**.

They are separate facts.

---

# 13. Final verdict by artifact

## Product & Marketing Package 01–15

**KEEP / SEMANTICALLY COMPLETE FOR v1.**

Do not add another theory layer unless real implementation evidence exposes a missing authority question.

## PR #196

**KEEP as Current Truth / Product-to-Production Audit.**

It should own factual current-state divergence and surface transformation decisions.

## PR #197

**REWRITE / RETARGET BEFORE MERGE.**

The implementation direction is strong, but it must:

- inherit #196 truth;
- add W0A Reality Lock;
- fix the Board-gate wording;
- make ThingProjection cross-surface;
- make Contribution privacy structural;
- classify current Telegram promotion semantics;
- use final Metrics terminology;
- treat `15` as existing constitution, not future output;
- remove obsolete restack instructions already completed for #192/#194.

## Package index

**UPDATE ONCE AFTER STACK LANDING.**

Do not use its current stale TODO state as evidence that 08–15 do not exist.

## Next product phase

**IMPLEMENTATION + TRUTH + EVIDENCE.**

Not more ontology.

The package has reached the point described by `15`:

> **THE PACKAGE IS COMPLETE WHEN IT STOPS NEEDING NEW THEORY AND STARTS PRODUCING TESTABLE DECISIONS.**
