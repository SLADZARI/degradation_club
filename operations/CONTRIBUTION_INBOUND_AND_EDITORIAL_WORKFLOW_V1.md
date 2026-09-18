# Dementor Club — Contribution Inbound & Editorial Workflow v1

Status: **APPROVED PROJECT-LOCAL ARCHITECTURE DECISION**  
Owner decision: **Yauhen**  
Approval date: **2026-09-18**  
Related: **#214 · concept/CONTRIBUTION_MODEL_V1.md**  
Runtime authorization: **NONE**  
Schema authorization: **NONE**  
UI authorization: **NONE**  
Membership mutation authorization: **NONE**  
Result authorization: **NONE**

## 0. Decision boundary

This Decision defines the approved project-local semantic architecture for Contribution inbound and later editorial workflow.

It does not promote the complete `concept/CONTRIBUTION_MODEL_V1.md`, which remains **WORKING CANON** except where a semantic rule is explicitly approved here.

Canonical boundaries:

~~~text
CONTRIBUTION ≠ THING ≠ PUBLICATION
CONTRIBUTION PATH ≠ DIRECT PUBLISH PATH
RECEIVED ≠ EDITORIAL RESPONSE
~~~

## 1. Contributor scope v1

Contribution v1 is:

~~~text
MEMBERS ONLY
~~~

Phase 1 accepts Contribution only from an authenticated active Dementor Club Member.

Guest, Applicant and anonymous/public inbound are outside v1.

This is an implementation-scope boundary, not a permanent prohibition on broader future participation.

~~~text
authenticated
+
MEMBER_ACTIVE
→ eligible contributor v1
~~~

No Membership state or permission is changed by this Decision.

## 2. Canonical owner

Dementor Club shall have one minimal semantic owner:

~~~text
CONTRIBUTION INBOUND OWNER
~~~

This is a responsibility boundary, not a table name.

It owns:

~~~text
intentional editorial inbound
+
persistent RECEIVED fact
+
payload / durable payload reference
+
contributor
+
private-by-default semantics
+
context / provenance
+
operational workflow
+
editorial outcome attachment point
~~~

It does not own:

~~~text
Publication
Artifact lifecycle
Thing lifecycle
Project lifecycle
Programming
Membership
Board response
Contact/support
Artifact slots
Telegram/external distribution
~~~

Explicit anti-alias rule:

~~~text
CONTRIBUTION INBOUND OWNER
≠ dc_artifacts
≠ dc_artifact_responses
≠ contact_requests
≠ join_applications
≠ dc_membership_reviews
≠ mp_project_requests
~~~

Existing owners may provide implementation patterns. They do not become Contribution domain truth.

## 3. One-record-first architecture

v1 uses:

~~~text
ONE canonical inbound record
~~~

The same canonical record may express both:

~~~text
Contribution material
+
Submission / receipt fact
~~~

while preserving the semantic distinction:

~~~text
Contribution
=
what material/context was brought

Submission / receipt
=
the operational fact that the material was successfully delivered
~~~

Do not create separate persistent Contribution and Submission entities until demonstrated product need exists.

A later split is justified only if real runtime evidence proves requirements such as:

- one Contribution with multiple independently meaningful submissions;
- independent resubmission/revision cycles;
- one material object submitted into multiple editorial contexts;
- delivery attempts acquiring independent product/legal identity;
- materially different retention lifecycles for Contribution material and receipt records.

Until then:

~~~text
ONE RECORD FIRST
~~~

## 4. Exact RECEIVED contract

Canonical semantic transaction boundary:

~~~text
server validation successful
+
canonical inbound record committed
+
required payload/reference durably established
=
CONTRIBUTION RECEIVED
~~~

All three conditions are required.

The system may acknowledge receipt only after this boundary succeeds.

None of the following establish RECEIVED:

~~~text
draft
autosave
composer open
upload start
upload success by itself
button click
client state
analytics event
Artifact draft
Board response
~~~

Canonical invariants:

~~~text
UI INTERACTION ≠ SUBMISSION RECEIPT
MEDIA EXISTS ≠ CONTRIBUTION RECEIVED
~~~

## 5. Payload and future media

Phase 1 is deliberately capable of operating with:

~~~text
text
link
basic durable reference
~~~

No Contribution file/image owner is approved by this Decision.

Explicit invariant:

~~~text
dc-community-artifacts
≠
Contribution media owner
~~~

If a future Contribution includes a file/image, RECEIVED may occur only after a valid durable payload/reference is established and the canonical inbound record is committed.

~~~text
durable file/reference
+
canonical inbound record commit
→ RECEIVED
~~~

Upload success alone is insufficient.

A failed final commit means RECEIVED did not occur even if temporary bytes existed.

Any future Contribution media owner must separately establish:

- private editorial read boundary;
- contributor access;
- authorized reviewer access;
- no ordinary Community Member read leakage;
- no synthetic Artifact FK;
- durable payload reference before RECEIVED;
- orphan cleanup;
- retention/deletion rules.

No bucket or schema is selected here.

## 6. Operational state contract v1

Approved semantic states:

~~~text
RECEIVED
REVIEWING
WAITING_ON_CONTRIBUTOR
RESOLVED
WITHDRAWN
~~~

This is a semantic contract, not a required DB enum or workflow-engine design.

Canonical invariant:

~~~text
RECEIPT FACT ≠ CURRENT WORKFLOW STATE
~~~

A valid historical receipt remains true when current state later becomes REVIEWING, WAITING_ON_CONTRIBUTOR, RESOLVED or WITHDRAWN.

At minimum the historical receipt must remain reconstructable through:

- receipt identity;
- contributor at receipt;
- received timestamp;
- receipt provenance;
- evidence that required payload/reference existed.

Normal v1 transition semantics:

~~~text
RECEIVED → REVIEWING
RECEIVED → WITHDRAWN
REVIEWING → WAITING_ON_CONTRIBUTOR
WAITING_ON_CONTRIBUTOR → REVIEWING
REVIEWING → RESOLVED
REVIEWING → WITHDRAWN
WAITING_ON_CONTRIBUTOR → WITHDRAWN
WAITING_ON_CONTRIBUTOR → RESOLVED  // controlled closure
~~~

Immediate authorized editorial resolution need not manufacture a fake persisted REVIEWING duration if the editorial action itself is auditable.

Automatic reopen after RESOLVED is outside v1.

## 7. Editorial disposition v1

Operational status and editorial disposition are separate owners of meaning.

~~~text
STATUS ≠ DISPOSITION
~~~

Approved minimal disposition set:

~~~text
NEEDS_CONTEXT
KEEP_AS_OBSERVATION
MERGE_EXISTING
DEVELOP_NEW_THING
NO_ACTION
DECLINE
~~~

This is a semantic contract, not a required DB enum.

### NEEDS_CONTEXT

Editorial looked at the Contribution but requires additional information.

Typical relationship:

~~~text
disposition = NEEDS_CONTEXT
status = WAITING_ON_CONTRIBUTOR
~~~

This is not rejection.

### KEEP_AS_OBSERVATION

Material is useful as observation/evidence but no standalone Thing is being developed now.

No Publication or Programming implication exists.

### MERGE_EXISTING

Material belongs with an existing canonical object/context rather than creating a duplicate.

Merge must preserve Contribution/source provenance.

### DEVELOP_NEW_THING

Editorial sees enough standalone potential to begin a downstream Thing-making path.

It does not mean that a Thing already exists, Publication is approved, Release is approved, or Programming is approved.

### NO_ACTION

Editorial intentionally decides that no further action should happen now.

~~~text
NO_ACTION ≠ forgotten in queue
~~~

### DECLINE

Editorial intentionally declines further use/development in this workflow.

It is not a Membership judgment about the contributor.

## 8. Deferred Working Canon dispositions

The following do not become first-class v1 dispositions:

~~~text
REFRAME
READY_THING_CANDIDATE
INVITE_TO_MAKE
LINK_TO_EXISTING_PROJECT
~~~

Until separate evidence/Decision:

- REFRAME may be editorial note/context;
- READY_THING_CANDIDATE may be DEVELOP_NEW_THING plus readiness context;
- INVITE_TO_MAKE may be a downstream consequence/next action;
- LINK_TO_EXISTING_PROJECT may be a contextual/downstream consequence.

## 9. Reviewer authority v1

Contribution editorial/review authority v1 is:

~~~text
OWNER_ADMIN ONLY
~~~

Canonical server-side authorization must use the existing approved Owner Admin predicate or an explicitly approved successor. Concrete invocation signature is implementation detail.

The following do not grant Contribution editorial authority:

~~~text
global Dementor role
dc_entity_assignments role=dementor
Board Relations scoped Dementor permission
Artifact ownership
Membership Review permission
~~~

Therefore:

~~~text
GLOBAL DEMENTOR ≠ CONTRIBUTION REVIEWER
SCOPED DEMENTOR ASSIGNMENT ≠ CONTRIBUTION EDITORIAL AUTHORITY
~~~

Scoped editorial delegation requires a separate future Decision.

No new Contribution-specific system role is introduced.

## 10. UNSCOPED CONTRIBUTION

Canonical term:

~~~text
UNSCOPED CONTRIBUTION
=
target = none
~~~

UNSCOPED means no contextual target is attached.

It does not mean public, anonymous, or available to everyone.

This distinction is mandatory:

~~~text
UNSCOPED / TARGETLESS CONTRIBUTION
≠
PUBLIC OR ANONYMOUS INBOUND
~~~

UNSCOPED CONTRIBUTION is a valid v1 case and supports the primary entry meaning:

~~~text
Что заметил?
Есть что показать?
~~~

## 11. Context target architecture

Future contextual Contribution uses:

~~~text
sourceKind
+
stable source reference
+
optional proven thingRef
~~~

No universal registry.

Canonical direction:

~~~text
SOURCE OWNER
→ stable source identity
→ optional proven thingRef
→ Contribution context
~~~

Context-target runtime is deferred from Phase 1.

Artifact, Event, Program, proven Project and optional proven thingRef support require a later increment.

That increment must:

- reuse canonical source identities;
- fail closed when target identity is not proven;
- avoid Board-local/card/DOM IDs;
- avoid turning dc_entities into a universal registry;
- avoid requiring Board Relations persistence.

Canonical invariant:

~~~text
CONTRIBUTION RECEIPT
DOES NOT DEPEND ON
BOARD RELATIONS
~~~

## 12. Provenance and authorship

Canonical invariant:

~~~text
contributor / source provenance
captured at receipt

authorship
assigned separately downstream
~~~

Forbidden:

~~~text
submitter = author automatically
~~~

Contributor may be the original creator, finder, source carrier, participant, observer or person supplying third-party material.

If a Contribution is merged into an existing object, its source/provenance remains traceable subject to later privacy/retention rules.

If a Contribution leads to DEVELOP_NEW_THING, the future Thing may reference the Contribution as provenance, but authorship is resolved independently.

Both are valid:

~~~text
Contributor = Author
Contributor ≠ Author
~~~

## 13. Withdrawal

Approved semantic baseline:

~~~text
WITHDRAWN
→ future editorial use stops by default
→ contributor sees WITHDRAWN
→ historical RECEIVED remains true
~~~

Withdrawal does not mean that the Contribution never existed.

~~~text
RECEIPT HISTORY
≠
CURRENT PERMISSION TO CONTINUE USING MATERIAL
~~~

This Decision does not define retention periods, physical deletion timing, redaction, anonymization, payload retention after downstream use, or audit retention duration.

No deletion/privacy promise may be inferred until a separate privacy/retention contract is approved.

Withdrawal must not automatically delete an independently canonical downstream Thing, Project, Publication or other merged object. Later source/privacy handling is a separate decision.

## 14. #214 activation bridge

Approved Member Activation semantics remain intact.

For Contribution:

~~~text
MEMBER_ACTIVE
+
valid Contribution RECEIVED
→ activation evidence established
~~~

Editorial outcome is not an activation condition.

~~~text
EDITORIAL OUTCOME ≠ ACTIVATION CONDITION
~~~

Later workflow state does not rewrite the historical activation evidence:

~~~text
MEMBER_ACTIVE
→ valid Contribution RECEIVED
→ activation evidence established

later WITHDRAWN
→ activation evidence remains
~~~

Existing successful Direct Publish evidence remains a separate valid activation path:

~~~text
successful Direct Publish
OR
valid Contribution RECEIVED
→ qualifying activation evidence
~~~

No historical Artifact is backfilled into a Contribution.

No existing activated Member is downgraded.

No Membership access permission becomes dependent on Contribution status or disposition.

This Decision does not authorize activation runtime changes.

## 15. Acknowledgement and closure

Phase 1 acknowledgement means only:

~~~text
we durably received this material
~~~

It must not promise editorial review completion, Thing creation, Publication, Programming, acceptance or response deadline.

~~~text
ACKNOWLEDGED RECEIPT ≠ EDITORIAL RESPONSE
~~~

Later contributor surfaces must distinguish operational state from editorial outcome.

Operational meanings:

~~~text
RECEIVED → получено
REVIEWING → в работе
WAITING_ON_CONTRIBUTOR → нужно уточнение
RESOLVED → закрыто
WITHDRAWN → отозвано
~~~

RESOLVED by itself is insufficient closure.

Meaningful contributor-visible closure is mandatory at minimum for:

~~~text
NEEDS_CONTEXT
KEEP_AS_OBSERVATION
MERGE_EXISTING
NO_ACTION
DECLINE
~~~

Minimum meaning:

- NEEDS_CONTEXT → what is missing and what the contributor needs to do;
- KEEP_AS_OBSERVATION → editorial looked; useful observation retained; no standalone Thing now;
- MERGE_EXISTING → editorial looked; material associated with existing context/object; target may be shown where permitted;
- NO_ACTION → editorial looked; no further action planned now;
- DECLINE → material will not continue through the current workflow.

## 16. Audit semantics

The Contribution architecture requires reconstructable audit semantics. This Decision does not choose an audit table, event store or storage implementation.

### Receipt audit

Must establish:

- canonical inbound identity;
- contributor;
- received_at;
- payload/reference presence;
- source/provenance where applicable;
- command/correlation identity.

### Status transition audit

Must establish:

- actor;
- timestamp;
- previous status;
- new status;
- reason/context where required.

### Editorial disposition audit

Must establish:

- editorial actor;
- timestamp;
- previous disposition if any;
- new disposition;
- reason/note where required.

### Withdrawal audit

Must establish:

- who initiated withdrawal;
- timestamp;
- previous workflow state;
- resulting WITHDRAWN state;
- retention/privacy action reference where applicable.

### Closure audit

Must establish:

- actor;
- timestamp;
- final operational state;
- editorial disposition;
- contributor-facing closure outcome.

### Merge/link consequence audit

When such consequence exists, preserve:

- Contribution identity;
- consequence type;
- target sourceKind;
- stable target source reference;
- optional proven thingRef;
- actor;
- timestamp.

Canonical invariant:

~~~text
CURRENT RECORD ≠ COMPLETE HISTORY
~~~

## 17. Future implementation phases

Approval of this Decision does not authorize any phase.

### Phase 1 — Receipt

Future separately authorized scope:

~~~text
Bring
→ canonical persistent RECEIVED
→ acknowledgement
~~~

Constraints:

~~~text
Members only
UNSCOPED CONTRIBUTION
text / link / basic durable reference
private by default
~~~

Phase 1 proves only intentional private editorial inbound → honest durable receipt.

It excludes:

- editorial queue;
- disposition workflow;
- context targets;
- file/image media;
- merge implementation;
- Thing creation;
- Project creation;
- Publication;
- Programming;
- Membership changes;
- activation runtime changes;
- Guest/Applicant/anonymous inbound;
- Board Relations dependency.

### Phase 2 — Editorial workflow

Future separate increment:

~~~text
editorial queue
→ operational workflow
→ disposition
→ meaningful closure
~~~

Includes OWNER_ADMIN review, operational state changes, approved disposition v1, contributor-visible closure and audit.

No automatic Publication or Thing creation follows.

### Phase 3 — Context / media / consequences

Future separate increment may address:

~~~text
contextual targets
private file/image media
MERGE_EXISTING target relation
Thing provenance consequences
Project consequences
other downstream editorial actions
~~~

Each must compose canonical source owners. No universal Thing registry is authorized.

## 18. Relationship to CONTRIBUTION_MODEL_V1

Approval of this Decision does not promote the complete `concept/CONTRIBUTION_MODEL_V1.md`.

Only semantics explicitly approved in this Decision become project-local authority.

The following remain Working Canon or future-decision territory where not otherwise approved:

- broader contributor populations;
- full Working Canon disposition vocabulary;
- scoped editorial delegation;
- contextual target runtime;
- private media owner;
- detailed provenance graph;
- authorship/credit system;
- retention/privacy policy;
- automatic downstream consequences;
- reopen/versioning/resubmission semantics.

~~~text
APPROVAL OF THIS DECISION
≠
APPROVAL OF FULL CONTRIBUTION_MODEL_V1
~~~

## 19. Explicit non-goals / authorization boundary

Approval of this Decision does not authorize:

- Contribution Result;
- implementation branch;
- runtime mutation;
- schema migration;
- new table;
- new enum;
- new RPC;
- new bucket;
- UI;
- new role;
- Membership mutation;
- Membership access-rule changes;
- activation runtime changes;
- historical Artifact backfill;
- Artifact conversion;
- Board Relations dependency;
- universal Thing registry;
- Guest/Applicant/anonymous Contribution;
- private file/image implementation;
- context-target implementation;
- full CONTRIBUTION_MODEL_V1 promotion.

## 20. Final canonical architecture

~~~text
ACTIVE MEMBER
      ↓
intentional BRING
      ↓
CONTRIBUTION INBOUND OWNER
      ↓
server validation
+
canonical record commit
+
durable required payload/reference
      ↓
RECEIVED
      ↓
ACKNOWLEDGEMENT
~~~

Later, separately:

~~~text
RECEIVED
→ REVIEWING
→ WAITING_ON_CONTRIBUTOR / RESOLVED / WITHDRAWN
~~~

with:

~~~text
STATUS ≠ DISPOSITION
~~~

and approved disposition v1:

~~~text
NEEDS_CONTEXT
KEEP_AS_OBSERVATION
MERGE_EXISTING
DEVELOP_NEW_THING
NO_ACTION
DECLINE
~~~

Canonical downstream boundary:

~~~text
Contribution
MAY inform
Observation / existing context / new Thing development

but

Contribution
≠ Thing
≠ Publication
≠ Programming
~~~
