# Dementor Club — Fuengirola Access Policy Decision v1

Status: **APPROVED LOCAL PRODUCT DECISION**  
Owner decision: **Yauhen**  
Decision date: **2026-09-18**  
Issue: **#204**  
Decision: **LEGACY_FUNNEL**  
Scope: **Fuengirola Event access / CTA semantics only**

## 0. Decision status and boundary

This Decision resolves issue #204 and classifies the existing Fuengirola onboarding / Membership gate as a **legacy funnel**, not intrinsic Event eligibility.

It is a project-local approved authority for **Fuengirola access semantics only**.

It supersedes only the Fuengirola-specific access/gating/CTA meaning that treated global Dementor Club onboarding or Membership as a prerequisite for Event details or as the canonical continuation from the Event.

`events/fuengirola.md` remains the Event source for its confirmed factual and editorial Event content, except that its old onboarding/Membership gating statements no longer define Product policy after this Decision.

This Decision does **not** create a general Event access policy and does **not** change Membership semantics.

This Decision authorizes **no runtime, Event UI, registration, Membership, SQL, RLS, payment or other implementation mutation**. No Result is opened by this approval.

## 1. Approved classification

```text
DECISION:
LEGACY_FUNNEL
```

The existing path:

```text
Fuengirola
→ global onboarding / Join Club
→ Event details / registration context
```

is classified as inherited funnel/gating from an older product journey.

It is **not** an intrinsic eligibility rule for Fuengirola.

Therefore:

```text
MEMBERSHIP / ONBOARDING
≠
FUENGIROLA ELIGIBILITY
```

and current operational metadata such as `member-details-after-onboarding` must not be interpreted as Product authority proving that Membership is required for this Event.

## 2. Canonical Fuengirola access rule

Confirmed Event information should be available directly without requiring Membership or global onboarding merely to discover the Event.

Canonical semantic target:

```text
PUBLIC FUENGIROLA EVENT
→ confirmed Event information
→ Event-specific continuation when one actually exists
```

Not:

```text
PUBLIC FUENGIROLA EVENT
→ Join Club
→ unlock Event as a Membership consequence
```

This decision does not require every future operational or private logistics detail to be public. It only removes Membership/onboarding as the product-level prerequisite for confirmed public Event information.

## 3. CTA rule

`Join Club` is **not** the canonical or default Fuengirola CTA.

Membership may still exist elsewhere in Dementor Club as its own product relationship, but Fuengirola must not be framed as:

```text
Join the Club
→ get the Event
```

or as a Membership benefit unless a future explicit authority establishes a separate fact.

A future Fuengirola CTA must follow the real Event continuation available at that time. This Decision does not invent that continuation.

## 4. Registration and unknown facts remain closed

Current confirmed operational state remains:

```text
registration: disabled
```

This Decision does not open registration and does not authorize a registration URL, booking flow, waitlist, purchase path or payment flow.

The following remain unconfirmed and must not be invented:

- date / time;
- exact venue;
- price;
- payment;
- registration availability;
- attendance availability;
- other logistics not already confirmed by an approved source.

Removing the legacy funnel does not convert any of those unknowns into facts.

## 5. Facts preserved

This Decision does not reopen the already confirmed Fuengirola facts:

- Event status: `planned`;
- location: Fuengirola / Spain;
- capacity: up to 7 participants;
- Dementor: Габиль;
- registration currently disabled.

Those facts remain governed by their existing Event / operational sources.

## 6. Transitional invariant

Approval of the semantic target does not imply that existing runtime presentation has already been corrected.

Until a separately authorized implementation aligns the operational projection:

```text
SEMANTIC TARGET:
Membership/onboarding is not Fuengirola eligibility;
confirmed Event information is directly available;
Join Club is not the default/canonical Fuengirola CTA.

CURRENT IMPLEMENTATION MAY STILL CONTAIN:
legacy member-details-after-onboarding gating / old funnel presentation.
```

Canonical distinction:

**PRODUCT POLICY ≠ LEGACY IMPLEMENTATION METADATA.**

The presence of the old metadata after this Decision is implementation debt, not continuing product authority.

This Decision alone is not implementation authorization.

## 7. Scope is Fuengirola only

```text
FUENGIROLA ACCESS DECISION
≠
GENERAL EVENT ACCESS POLICY
```

No rule for other Events is created by analogy.

This Decision does not establish that all Dementor Events must be public, ungated, member-free, registration-free or share the same CTA model.

Any general Event access/eligibility rule requires its own authority.

## 8. Protected boundaries

This Decision does not change:

```text
AUTHENTICATION
≠
DC9 COMPLETE
≠
APPLICATION
≠
MEMBERSHIP
```

It does not change Membership admission, review, permissions or Member rights.

It does not change Board, ThingProjection, Contribution, Programming, Distribution, Commerce or #199 source truth.

It does not authorize Event UI mutation or runtime cleanup.

It creates no project-wide PRODUCT / DOMAIN / ARCHITECTURE / DESIGN approval.

## 9. Canonical invariant

```text
FUENGIROLA ACCESS POLICY v1
=
LEGACY_FUNNEL

Membership/onboarding is not intrinsic eligibility for Fuengirola.
Confirmed Event information should be directly available.
Join Club is not the canonical/default Fuengirola CTA.
Registration remains disabled until independently confirmed otherwise.
Unknown date / venue / price / payment / availability remain unknown.
Scope is Fuengirola only.
```
