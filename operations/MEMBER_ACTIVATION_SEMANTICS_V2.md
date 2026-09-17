# Dementor Club — Member Activation Semantics v2

Status: **APPROVED LOCAL PRODUCT DECISION**  
Owner decision: **Yauhen**  
Decision date: **2026-09-17**  
Issue: **#214**  
Scope: **post-admission Member activation semantics only**

## 0. Decision status and boundary

This Decision resolves the semantic conflict tracked in issue #214 between the existing first-Artifact activation rule and the distinction between Contribution and Direct Publish.

It is a **project-local approved authority for Member activation scope only**.

It supersedes only activation-specific semantics in `operations/WORKSPACE_MEMBER_ACTIVATION_AND_SHELL_V1.md`. That document remains the approved authority for Workspace shell ownership, default Member entry, Workspace navigation, Community Board access boundary, Activity projection and its other non-activation rules.

This Decision does **not** approve a new Membership lifecycle. It does **not** approve `concept/CONTRIBUTION_MODEL_V1.md` as project-wide authority and does not raise that document above its existing authority level.

This Decision does **not** create project-wide PRODUCT / DOMAIN / ARCHITECTURE / DESIGN approval.

The invariant remains:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

No new activation state, Membership state, onboarding entity, tutorial state or reward mechanic is authorized.

No runtime, SQL, RLS, UI or Contribution implementation is authorized by this semantic registration.

## 1. Superseded rule

The superseded activation-specific rule was:

```text
MEMBER_ACTIVE
→ FIRST_ARTIFACT_REQUIRED
→ successful first Artifact publication
→ MEMBER_ACTIVATED
```

Under that rule, first Artifact publication was the only qualifying activation event and `FIRST_ARTIFACT_REQUIRED` was treated as canonical product terminology.

Only that activation meaning is superseded.

## 2. Human meaning of MEMBER_ACTIVATED

`MEMBER_ACTIVATED` means:

> **An admitted Member has completed the first intentional action by which they contributed something to the life of the club.**

For this Decision the neutral semantic category is:

**QUALIFYING ACTIVATION ACTION**

It is not a new state, entity, table or runtime owner.

Canonical distinction:

```text
MEMBER_ACTIVE
=
the person has been admitted and has Member access

MEMBER_ACTIVATED
=
the admitted Member has completed the first QUALIFYING ACTIVATION ACTION
```

`MEMBER_ACTIVATED` is not an editorial quality judgment.

**ACTIVATED ≠ EDITORIALLY ACCEPTED**

## 3. QUALIFYING ACTIVATION ACTION v1

There are exactly two semantically qualifying evidence classes in v1:

1. successful **Direct Publish**;
2. successful **Contribution RECEIVED**.

Direct Publish and Contribution remain distinct product contracts. Direct Publish is **not** a subtype of Contribution.

### Approved semantic target

```text
MEMBER_ACTIVE
+
(
  successful Direct Publish
  OR
  Contribution RECEIVED
)
→ MEMBER_ACTIVATED
```

The first proven qualifying event is sufficient. Both paths converge on the same existing semantic outcome: `MEMBER_ACTIVATED`.

No separate `CONTRIBUTION_ACTIVATED`, `PUBLISH_ACTIVATED` or other activation state is authorized.

### Current implemented activation evidence

Approval of this semantic target does not imply both evidence paths already exist in released runtime.

Until a canonical Contribution receipt runtime is separately implemented, validated and released:

```text
SEMANTIC TARGET:
Direct Publish OR Contribution RECEIVED

IMPLEMENTED EVIDENCE:
historical / successful Direct Publish only
```

Canonical transition principle:

**SEMANTIC ELIGIBILITY ≠ IMPLEMENTED EVIDENCE PATH.**

Therefore during the transition period:

- Contribution must not be presented to Members as an operationally available activation path until canonical `Contribution RECEIVED` evidence exists in released runtime;
- `RECEIVED` must not be inferred from Artifact draft, subtype, media upload, form opening, button click, Board response, editor visibility or client-only state;
- production is not in violation of this Decision merely because the approved Contribution activation path is still implementation-pending;
- existing historical / successful Direct Publish activation continues to operate;
- the runtime predicate may expand to `Contribution RECEIVED` only after canonical receipt evidence exists and a separate implementation/release authorization is given.

## 4. Contribution activation moment

A Contribution qualifies at the moment the canonical Contribution owner has successfully established:

```text
RECEIVED
```

Semantic target:

```text
MEMBER_ACTIVE
→ intentional Contribution
→ CONTRIBUTION RECEIVED
→ MEMBER_ACTIVATED
```

Activation occurs at successful receipt, not after editorial review.

The following are not activation conditions:

- `REVIEWING`;
- editorial disposition;
- editorial response;
- `KEEP_AS_OBSERVATION`;
- `MERGE_EXISTING`;
- `DEVELOP_NEW_THING`;
- `READY_THING_CANDIDATE`;
- `INVITE_TO_MAKE`;
- `NO_ACTION`;
- `DECLINE`;
- Thing creation;
- Project creation;
- Programming decision;
- Home inclusion;
- Telegram / external distribution.

A later `NO_ACTION` or `DECLINE` does not undo activation.

```text
CONTRIBUTION RECEIVED
≠
EDITORIAL ACCEPTANCE
```

No existing Artifact draft or other proxy is sufficient proof of `RECEIVED`.

This Decision does not authorize implementation of a Contribution receipt contract.

## 5. Direct Publish rule

Direct Publish remains an ordinary Member capability.

Successful Direct Publish is a `QUALIFYING ACTIVATION ACTION`:

```text
MEMBER_ACTIVE
→ DIRECT PUBLISH
→ successful publication
→ MEMBER_ACTIVATED
```

Direct Publish does not require prior Contribution. Contribution does not require prior Direct Publish.

```text
CONTRIBUTION PATH
≠
DIRECT PUBLISH PATH
```

Opening the composer, creating/saving a draft, failed publication or merely having an Artifact slot do not qualify.

Direct Publish activation does not imply editorial endorsement, editorial acceptance, Programming Moment, Home inclusion, Telegram/external distribution, creation of another entity type or additional Member permissions.

## 6. Non-qualifying evidence v1

The following do not activate a Member in v1:

- login / authentication;
- Workspace entry;
- viewing or browsing Board;
- reaction;
- Board response;
- DC-9 completion;
- Membership Application;
- Membership review;
- Membership admission itself;
- receipt of Member rights;
- Artifact slot grant;
- draft creation;
- editorial disposition or approval;
- Thing creation;
- Project creation;
- Programming selection;
- Home inclusion;
- Telegram or other distribution consequence.

Board response is explicitly excluded from v1 qualifying evidence. Adding it or any other participation class requires an explicit extension of this Decision.

## 7. Initial Artifact slot

The initial Artifact slot remains a **Direct Publish capability**. It is not the activation state itself.

A private Contribution must **not** consume the initial Artifact slot.

Thus the target semantics permit:

```text
MEMBER_ACTIVE
↓
Contribution RECEIVED
↓
MEMBER_ACTIVATED
↓
initial Artifact slot still available
↓
later optional Direct Publish
```

Contribution activation must not create a synthetic published Artifact, artificial slot consumption or replacement slot grant, and must not turn private Contribution into Board publication.

Existing Artifact slot ownership/accounting remains unchanged unless separately approved.

## 8. Backward compatibility

Existing Members activated under the previous first-publication rule remain activated.

Historical successful Artifact publication remains valid qualifying evidence.

Target compatibility predicate:

```text
historical successful publication evidence
OR
new successful Direct Publish evidence
OR
canonical Contribution RECEIVED evidence
→ MEMBER_ACTIVATED
```

During the transition period before Contribution receipt runtime exists, production may continue to prove activation only through historical / successful Direct Publish evidence.

No existing activated Member may be downgraded or required to repeat activation.

No historical Artifact is retroactively converted into Contribution, and no historical publication requires editorial disposition backfill.

Membership history, admission timestamps, Member-since semantics and Artifact slot grants remain unchanged.

This Decision authorizes no data migration or backfill.

## 9. FIRST_ARTIFACT_REQUIRED compatibility / deprecation

`FIRST_ARTIFACT_REQUIRED` is no longer correct canonical **product terminology** because first Artifact publication is no longer the only semantically valid activation path.

It is deprecated as product/domain meaning.

It may temporarily remain in runtime as an **internal compatibility implementation token** while consumers are reconciled.

During that period it must not:

- be treated as the human definition of the pre-activation condition;
- imply that Artifact publication is the only semantically valid activation path;
- imply restricted Member rights;
- become a second lifecycle authority;
- be replaced by a new persistent activation state merely to rename it.

While Contribution receipt runtime is not implemented, Direct Publish may remain the only operational activation transition. This does not restore `FIRST_ARTIFACT_REQUIRED` as canonical product meaning.

Human-facing UI must not advertise Contribution as an available activation path before canonical Contribution receipt runtime is released.

## 10. Membership and permissions remain unchanged

Membership admission remains the authority for Member access.

`MEMBER_ACTIVATED` remains a post-admission behavioural/product milestone and is not an RLS/permission requirement.

This Decision authorizes no changes to:

- Membership admission requirements or review;
- `dc_system_memberships`;
- active Membership semantics;
- Board access rights;
- reactions/responses permissions;
- ordinary Member RLS;
- Dementor permissions;
- Owner Admin permissions.

An admitted but not-yet-activated Member remains an admitted Member with all rights granted by active Membership.

## 11. Scoped supersession of WORKSPACE_MEMBER_ACTIVATION_AND_SHELL_V1

This Decision supersedes only activation-specific meaning in `operations/WORKSPACE_MEMBER_ACTIVATION_AND_SHELL_V1.md`.

### Section 2 — Protected boundaries

The old post-admission activation chain is replaced for semantic authority purposes by:

```text
MEMBER_ACTIVE
→ QUALIFYING ACTIVATION ACTION
→ MEMBER_ACTIVATED
```

where v1 qualifying actions are exactly successful Direct Publish or Contribution `RECEIVED`.

The prohibition on new Membership/onboarding/tutorial/reward states remains in force.

### Section 6 — First-entry activation focus

Superseded:

- `FIRST_ARTIFACT_REQUIRED` as canonical product terminology;
- first Artifact publication as the sole semantically valid activation action;
- the rule that only Artifact composer/publication can ever satisfy activation;
- any interpretation that activation itself grants normal Member rights.

Preserved:

- Community Board as ordinary Member default Workspace context;
- first-entry guidance may exist;
- guidance must reuse canonical owners rather than create a parallel tutorial state;
- dismissing guidance must not fabricate activation;
- no synthetic Artifact may be created merely to complete activation.

During transition, existing Direct Publish activation may continue while Contribution receipt is unavailable, and UI must not advertise an unreleased Contribution path.

### Section 10 — validation invariant

The old invariant “first Artifact publication remains the only transition to `MEMBER_ACTIVATED`” is superseded by the approved semantic predicate in §3.

Until Contribution receipt runtime exists, release validation may legitimately prove only the Direct Publish evidence branch.

All non-activation Workspace shell, route, Board-access, Activity, role and navigation constraints remain unchanged.

### Section 11 — acceptance outcome

The activation-specific fragment is replaced by:

```text
MEMBER_ACTIVE
→ QUALIFYING ACTIVATION ACTION
→ MEMBER_ACTIVATED
→ continued club participation
```

with the same transition distinction between semantic eligibility and actually released evidence paths.

## 12. Explicitly not superseded

`WORKSPACE_MEMBER_ACTIVATION_AND_SHELL_V1.md` remains the approved authority for its non-activation scope, including:

- Workspace Shell ownership;
- public/private shell boundary;
- default Member entry to Community Board;
- Workspace navigation;
- Community Board Membership access boundary;
- Activity projection ownership;
- role-aware shell rules and related constraints.

This Decision does not supersede or change Membership v2 admission/application/review, Artifact lifecycle, Artifact slot accounting, Board Information Architecture, ThingProjection, Programming authority, editorial selection authority, distribution authority, #200, #202 or Relations work.

`concept/CONTRIBUTION_MODEL_V1.md` retains its existing authority level.

## 13. Implementation boundary after this approval

This approval is **semantic authority registration only**. It opens no Result and authorizes no implementation.

Any future implementation must be separately authorized and must:

- keep one activation predicate/state outcome;
- reuse current Membership active authority and historical Direct Publish evidence first;
- retain existing Direct Publish plumbing unless a separate Decision changes it;
- add `Contribution RECEIVED` to runtime activation evidence only after canonical receipt evidence is implemented and released;
- preserve historical activation without downgrade or backfill;
- keep rights Membership-owned;
- leave the initial Artifact slot untouched by private Contribution;
- treat `FIRST_ARTIFACT_REQUIRED` only as a temporary compatibility token if it still exists.

## 14. Canonical invariant

```text
MEMBER_ACTIVE
+
QUALIFYING ACTIVATION ACTION
→ MEMBER_ACTIVATED

QUALIFYING ACTIVATION ACTION v1:
- successful Direct Publish
- Contribution RECEIVED
```

Transition invariant:

```text
SEMANTIC TARGET:
Direct Publish OR Contribution RECEIVED

IMPLEMENTED EVIDENCE:
historical / successful Direct Publish only
```

until released canonical Contribution receipt runtime exists.

**SEMANTIC ELIGIBILITY ≠ IMPLEMENTED EVIDENCE PATH.**

**ACTIVATED ≠ EDITORIALLY ACCEPTED.**
