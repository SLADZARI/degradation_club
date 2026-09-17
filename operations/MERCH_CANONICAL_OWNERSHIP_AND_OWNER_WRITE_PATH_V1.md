# Dementor Club — Merch Canonical Ownership & Owner Write Path v1

Status: **APPROVED PROJECT-LOCAL ARCHITECTURE DECISION**  
Owner decision: **Yauhen**  
Approval date: **2026-09-18**  
Related: **#199 · #198 · #224**  
Runtime authorization: **NONE**  
Schema authorization: **NONE**  
UI authorization: **NONE**  
Result authorization: **NONE**

## 0. Decision boundary

This Decision defines the project-local canonical ownership architecture for Dementor Club Merch and the required write boundary for a future Owner Merch Management Surface.

It does not authorize runtime, Supabase/schema, UI, checkout, sales opening, asset-storage implementation, or a new Result.

Approval of this architecture and completion of a mutable-field cutover are separate events:

~~~text
ARCHITECTURE APPROVED
≠
FIELD CUTOVER COMPLETE
≠
RUNTIME RELEASED
~~~

## 1. Canonical ownership model

~~~text
GIT PRODUCT DEFINITION
+
CANONICAL MUTABLE COMMERCE STATE
+
COMMERCE READINESS
→
COMPOSED PUBLIC PROJECTION
~~~

The future Owner Merch UI is a control plane over canonical owners, not a second Product database or registry.

~~~text
OWNER UI
≠
CANONICAL PRODUCT REGISTRY
~~~

## 2. Git Product Definition

Canonical Product Definition remains merch/products/* plus approved Product/source Decisions.

It owns:
- stable Product identity / SKU;
- title / public name;
- editorial description;
- category / Product kind;
- line / collection / drop;
- variant definitions;
- Product disposition;
- canonical public route;
- rich Product specification;
- approved asset manifest / asset references;
- Product relations and editorial metadata.

After a separately proven controlled cutover, Git does not remain an independently editable current owner of transferred mutable commerce facts such as current base price or current product-level commerce state.

Git may retain historical values, decisions, provenance and migration evidence, but must not become a competing current authority for a transferred field.

## 3. Canonical Mutable Commerce State

Dementor Club shall have one canonical owner for approved mutable commerce facts.

Preferred direction is to reuse existing dc_merch_items where semantically sufficient before introducing any new registry. This Decision does not approve schema changes.

After controlled cutover, Canonical Mutable Commerce State owns:
- current base price;
- current product-level commerce state;
- commerce-runtime visibility;
- availability / stock facts only after those semantics are separately approved.

It does not own Product existence, Product editorial identity, variant definitions, canonical route, asset definition, Product publication, checkout readiness, Home placement, Telegram distribution or Programming.

## 4. Commerce Readiness

Commerce Readiness remains a separate canonical responsibility.

It owns facts such as:
- checkout enabled;
- checkout provider;
- checkout URL;
- payment-method readiness;
- system ability to transact.

It does not own Product identity, Product publication, price approval, Product-level commerce state, stock truth or historical sales truth.

~~~text
MUTABLE COMMERCE STATE
+
COMMERCE READINESS
→
EFFECTIVE PUBLIC COMMERCE STATE
~~~

A commerce-state value does not by itself prove that the system can transact.

## 5. Controlled cutover

Approval of this Decision does not immediately transfer current base_price_eur or product-level commerce-state authority away from Git / approved Product Decisions.

Before an individual field transfer becomes effective:

~~~text
1. identify approved current truth
2. inspect operational value
3. reconcile conflicts
4. establish validated command boundary
5. establish canonical server-side Owner Admin authorization
6. establish actor attribution
7. establish conflict detection
8. establish audit evidence
9. switch downstream read/projection ownership
10. declare cutover complete
11. demote the old Git field from independently editable current authority
~~~

Until cutover is explicitly proven:

~~~text
GIT / APPROVED PRODUCT DECISION
=
CURRENT CANONICAL TRUTH
~~~

Operational disagreement remains drift, not new authority.

## 6. Base price

After controlled cutover:

~~~text
base_price_eur
→ Canonical Mutable Commerce State
~~~

Before cutover, Git / approved Product Decision remains current authority. After cutover, Mutable Commerce State is the single current owner; Git may retain historical/provenance values only.

~~~text
CURRENT PRICE HAS ONE OWNER
~~~

## 7. Product-level commerce-state v1

Canonical Owner-facing Product commerce-state contract v1:

~~~text
NOT_OPEN
AVAILABLE
PREORDER
SOLD_OUT
~~~

These are Product-level commerce states, not Product-publication or checkout-readiness states.

Compatibility classification:

~~~text
reservation_confirmed
→ NON-PRODUCT FULFILMENT COMPATIBILITY

shipped
→ NON-PRODUCT FULFILMENT COMPATIBILITY

production
→ AMBIGUOUS COMPATIBILITY
~~~

production must not be exposed as a canonical Owner Product commerce-state option until separately resolved.

cancelled and archived are not part of canonical commerce-state v1. No automatic mapping is approved.

This Decision does not design a replacement order/fulfilment schema.

## 8. Product disposition remains separate

~~~text
PRODUCT DISPOSITION
≠
PRODUCT COMMERCE STATE
~~~

For example ACTIVE_PUBLIC_PRODUCT + NOT_OPEN is valid.

## 9. UNKNOWN

UNKNOWN is a legitimate knowledge state.

~~~text
UNKNOWN
≠
0
≠
false
≠
unavailable
≠
out_of_stock
≠
sold_out
~~~

This applies at minimum to price, availability and stock.

The system must preserve the difference between NO APPROVED FACT EXISTS and AN APPROVED NEGATIVE / ZERO FACT EXISTS.

This Decision does not require a DB enum named UNKNOWN. Exact storage representation is deferred, provided no coercion occurs.

## 10. public_visible semantics

Existing dc_merch_items.public_visible means:

~~~text
COMMERCE-RUNTIME VISIBILITY
~~~

It determines whether that Commerce State record may participate in public commerce runtime projection.

It does not mean Product existence, Product publication or existence of a public route.

~~~text
PRODUCT PUBLICATION
≠
COMMERCE RUNTIME VISIBILITY
~~~

public_visible=false does not by itself unpublish a Product. public_visible=true does not imply sales open or checkout ready.

No field rename/schema change is authorized here.

## 11. Product publication

Product publication remains a Git Product Definition responsibility.

A Product is not required to have a dc_merch_items row until it participates in managed Canonical Mutable Commerce State.

~~~text
PRODUCT EXISTS / IS PUBLIC
≠
dc_merch_items ROW EXISTS
~~~

## 12. Future Publish Product authority

For future Phase 3 Product authoring, active OWNER_ADMIN is sufficient semantic authority to perform an explicit Publish Product action. No new Merch-specific role or approval subsystem is required.

This Decision does not implement that command.

~~~text
PUBLISH PRODUCT
≠
DEPLOY
≠
OPEN SALES
≠
ENABLE CHECKOUT
~~~

## 13. SKU identity

SKU / product_id is stable and immutable after creation.

A new SKU must be unique across:

~~~text
CANONICAL PRODUCT NAMESPACE
+
KNOWN OPERATIONAL COLLISIONS
~~~

Exact allocator, format and generation mechanism remain deferred until before Phase 3.

## 14. content/merch/*.json

~~~text
NOT AUTHORITY
~~~

These files must not become Product source, Commerce source or Owner UI registry.

After dependency proof they may only be:

~~~text
Git Product Definition
→ deterministic derived projection
→ content/merch/*.json
~~~

or safely retired.

They must not remain a fourth truth layer.

## 15. Owner write-path contract

Future mutable commerce writes:

~~~text
Owner UI
→ validated command
→ canonical owner
→ audit
→ downstream projection
~~~

Not:

~~~text
browser
→ raw UPDATE dc_merch_items
~~~

Architectural authorization contract:

~~~text
canonical server-side Owner Admin predicate
=
existing approved dc_is_owner_admin predicate
or explicitly approved successor
~~~

The concrete invocation signature is an implementation detail and is not fixed by this Decision.

The browser/UI gate is presentation only and is not sufficient mutation authority.

## 16. Validation, actor attribution, conflicts and audit

Every mutable commerce command must validate at the canonical owner boundary.

Actor attribution must come from authenticated server context, not browser payload.

~~~text
ACTOR
=
SERVER-AUTHENTICATED OWNER ADMIN
~~~

Canonical commerce writes must not use blind last-write-wins.

~~~text
READ revision A
→ prepare change
→ WRITE expecting revision A

if state changed:
CONFLICT
→ reject
→ reload / explicitly resolve
~~~

Exact concurrency primitive is deferred.

Every accepted canonical commerce mutation must produce reconstructable audit evidence identifying actor, timestamp, SKU, changed fields, previous values, new values, reason/authority reference where applicable, and command/correlation identity.

Audit storage form is not selected by this Decision.

## 17. Assets

Asset manifest / references remain part of Git Product Definition.

Physical asset upload/storage/write ownership remains unresolved and requires a separate Decision.

dc-community-artifacts must not be reused for Merch by default.

~~~text
BOARD ARTIFACT MEDIA OWNER
≠
MERCH ASSET OWNER
~~~

No new storage bucket is authorized here.

## 18. Composed public projection

~~~text
Git Product Definition
+
Canonical Mutable Commerce State
+
Commerce Readiness
→
Composed Merch Projection
→
Public Merch Surface
~~~

The projection may never strengthen source truth.

PRICE UNKNOWN must not become EUR 0.

PREORDER plus checkout-not-ready must not become an actionable preorder promise.

## 19. Acceptance baselines

### SH-DEM-01

~~~text
SH-DEM-01
LIGHT
EUR 89
NOT_OPEN
availability UNKNOWN
no real public SOLD_OUT history
~~~

Historical operational sold_out is legacy/test/internal and must not become initial canonical Mutable Commerce State.

Before cutover, #199 remains current authority.

Future cutover must align base price = EUR 89 and commerce state = NOT_OPEN without inventing sales history.

### SH-DEM-04

~~~text
SH-DEM-04
ACTIVE_PUBLIC_PRODUCT
NOT_OPEN
price UNKNOWN
availability UNKNOWN
~~~

The Product remains in canonical Product inventory even without a dc_merch_items row.

If it later enters managed Mutable Commerce State, UNKNOWN price/availability remain UNKNOWN until separately approved.

## 20. Future implementation phases

This Decision establishes architecture only.

Phase 1 — Owner Merch Read Model:
read-only composition of all canonical Product Definitions + optional Commerce State + Commerce Readiness + drift indicators; no second registry.

Phase 2 — Commerce Commands:
only approved mutable commerce fields, with canonical Owner Admin server authorization, validation, actor attribution, conflict detection and audit. SH-DEM-01 / SH-DEM-04 are acceptance examples.

Phase 3 — Product Definition Authoring:
Add Product, SKU creation, rich Git-backed fields, assets, canonical route and explicit Publish Product.

Phase 3 does not block Phase 1. Approval of this Decision does not authorize any phase to start.

## 21. Downstream invariants

~~~text
EDIT PRODUCT
≠
OPEN SALES
≠
ENABLE CHECKOUT
≠
PUBLISH TO HOME
≠
PROMOTE TO TELEGRAM
≠
CREATE PROGRAMMING MOMENT
~~~

Also:

~~~text
PUBLISH PRODUCT ≠ DEPLOY
PRICE CHANGE ≠ CHECKOUT ACTIVATION
PRODUCT PUBLICATION ≠ COMMERCE RUNTIME VISIBILITY
COMMERCE STATE ≠ COMMERCE READINESS
~~~

Each downstream consequence retains its own owner.

## 22. Scoped supersession

### merch/README.md

Its statement that Git Merch owns all current base prices and statuses is superseded as future ownership architecture by this three-owner model.

However:

~~~text
CURRENT GIT AUTHORITY FOR base_price_eur
AND PRODUCT-LEVEL COMMERCE STATE
REMAINS EFFECTIVE
UNTIL CONTROLLED CUTOVER IS PROVEN
~~~

All non-transferred Product Definition responsibilities remain in force.

### MERCH_SOURCE_TRUTH_DECISION_V1 / #199

#199 is not superseded for its factual findings.

Until controlled cutover:

~~~text
SH-DEM-01
LIGHT
EUR 89
NOT_OPEN
legacy sold_out ≠ public sales history

SH-DEM-04
ACTIVE_PUBLIC_PRODUCT
NOT_OPEN
price UNKNOWN
availability UNKNOWN
~~~

After controlled cutover, #199 remains baseline/provenance authority for transferred values and continues to own unaffected Product identity/disposition facts.

### Commerce Truth Guard #198

Not superseded.

~~~text
PUBLIC PROMISE
MUST NOT BE STRONGER
THAN CURRENT COMMERCE READINESS
~~~

### Catalog

Not changed. Catalog remains secondary navigation/provenance.

### Owner Admin

No new role is introduced.

## 23. No implied migration

Approval is not proof that:
- dc_merch_items already contains canonical values;
- existing sales_state values satisfy commerce-state v1;
- price/state cutover is complete;
- public_visible is reconciled;
- SH-DEM-04 must immediately receive a DB row.

~~~text
DECISION APPROVAL
≠
DATA MIGRATION
~~~

## 24. Explicit non-goals

No runtime mutation, schema migration, new table/registry, Result, Owner UI, Add Product implementation, DB reconciliation, order/fulfilment schema, stock model, UNKNOWN enum, asset bucket, automatic dc-community-artifacts reuse, checkout/payment integration, preorder/sales opening, public-route deploy, Home publication, Telegram promotion or Programming integration is authorized.

cancelled, archived and production are not approved as canonical commerce-state v1 options.

## 25. Canonical invariant

~~~text
GIT PRODUCT DEFINITION
owns what the Product is

CANONICAL MUTABLE COMMERCE STATE
owns approved current mutable commercial facts after controlled cutover

COMMERCE READINESS
owns whether the system can actually transact

COMPOSED PUBLIC PROJECTION
combines them without strengthening truth
~~~

~~~text
OWNER UI
=
CONTROL PLANE OVER CANONICAL OWNERS

OWNER UI
≠
SECOND PRODUCT DATABASE
~~~
