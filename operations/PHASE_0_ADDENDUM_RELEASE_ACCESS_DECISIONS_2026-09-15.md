# DEMENTOR CLUB — PHASE 0 ADDENDUM · RELEASE & ACCESS DECISIONS

Status: **NORMATIVE ADDENDUM TO PHASE 0 / IMPLEMENTATION GATE**  
Updated: **2026-09-15**  
Parent authority: `operations/PHASE_0_TRUTH_REALITY_ALIGNMENT_2026-09-15.md`

## Purpose

This addendum closes two truth gaps found after the first Phase-0 pass.

It does not create new Product policy by inference.
It records where operational facts are known but Product meaning is still unresolved.

Until these decisions are resolved, Phase 1 may use only the safe claims defined below.

---

# A. Думай с опасностью — Release meaning

## Confirmed operational fact

Current Program source state:

- slug: `dumai-s-opasnostyu`;
- type: course;
- delivery: self-paced;
- status: `approved-draft`.

A public route / experience surface exists.

These two facts do **not** by themselves answer whether the accessible surface is:

1. a public prototype Release;
2. a preview / draft surface;
3. a finished Release.

A URL is not sufficient evidence of Release state.

## Required decision

Issue **#203** owns the source decision.

Choose one literal public meaning:

### Option A · Public prototype / Release

If the current accessible experience is intentionally released to users, source semantics and messaging must explicitly support that interpretation.

Allowed Phase-1 language after approval may include:

- prototype;
- public version;
- current release;

only if those words match the approved source decision.

### Option B · Draft / preview

If the current surface is not a Product Release, public copy and Program projection must say preview / draft / prototype-in-making literally.

It must not be presented as a finished course.

## Safe behavior before decision

Allowed:

- identify the Thing as `Думай с опасностью`;
- identify it as a self-paced course/form;
- link to the real accessible surface when useful;
- describe source state as approved draft where status context is necessary.

Blocked:

- `готовый курс`;
- finished/released/commercially available claims;
- Programming Moment whose reason depends on it being a finished Release;
- conversion or payment framing based on assumed Release state.

## Phase-0 DoD delta

- [ ] `Думай с опасностью` public Release/prototype/draft semantics explicitly resolved in #203.

This is a **P0 blocker for strong Program claims**, but not a blocker for Phase-1 architecture work using other safe Things.

---

# B. Fuengirola — access policy meaning

## Confirmed operational fact

Current Event source says:

- status: `planned`;
- location: Fuengirola, Spain;
- capacity: 7;
- Dementor: Габиль;
- visibility metadata: `member-details-after-onboarding`;
- registration: disabled.

This confirms what the runtime currently does.

It does **not** prove why the rule exists.

Operational access state is not automatically Product policy.

## Required classification

Issue **#204** owns the decision.

Classify `member-details-after-onboarding` as one of:

### A. Intentional eligibility rule

Membership/onboarding is functionally required for this Event.

If so, the reason should be explicit and the eligibility condition may remain part of Event semantics.

### B. Legacy funnel rule

The gate is inherited from the previous `Club → Join → Event` journey and is not essential to the Event itself.

If so, Phase 1 must not preserve it as Product policy merely because metadata exists.

## Safe behavior before decision

Allowed:

- `PLANNED`;
- Fuengirola / Spain;
- up to 7 people;
- Габиль;
- details are currently available after onboarding, if that operational fact must be explained.

Blocked:

- `Join the Club to get the Event` as promoted Program CTA;
- claiming Membership is inherently required;
- using Join as the Event's default continuation;
- date, price, open registration or payment claims.

## Phase-0 / Phase-1 boundary

This decision does **not** block showing Fuengirola in the Current Program as a factual planned Event.

It **does** block strengthening Membership/Join as the Event's intended product path.

## Phase-0 DoD delta

- [ ] Fuengirola onboarding/membership rule classified as intentional eligibility or legacy funnel in #204.

---

# Updated Phase-0 status

Semantic/source governance remains substantially closed, with these explicit unresolved decisions added to the existing blockers.

## Resolved enough for Phase 1 architecture

- deployed artifact authority;
- canonical origin;
- Program operational states;
- Project authority boundary;
- Board Artifact ≠ Programming Moment;
- commerce-readiness rule;
- Object 001 canonical price;
- Fuengirola factual Event state.

## Still blocks strong public claims

- #198 public Merch commerce-state gate;
- #199 SH-DEM-01 / SH-DEM-04 source decisions;
- #200 static canonical metadata correction;
- #201 QA/test evidence separation;
- #202 Catalog / release-status truth synchronization;
- #203 Думай с опасностью Release meaning;
- #204 Fuengirola eligibility-policy meaning.

## Phase-1 rule

> **Architecture may proceed on safe objects. Blocked facts may not be amplified.**

Phase 1 may design Current Program / ThingProjection now, but its initial reference set must respect this gate.