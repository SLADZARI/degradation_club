# DEMENTOR CLUB — LEGAL / COMPLIANCE / COMMERCIAL READINESS DECISION MAP v1

Status: **DRAFT / DECISION MAP — NOT LEGAL ADVICE**  
Updated: **2026-09-15**

## Purpose

Identify the legal/commercial decisions that must be resolved before Dementor scales payments, paid acquisition, cross-border data processing or public UGC-like functionality.

This document does not provide jurisdiction-specific legal conclusions.
It defines the facts counsel/operations must resolve.

---

# 1. Core decision matrix

For every commercial / data flow define:

```text
LEGAL ENTITY
× CUSTOMER / USER GEOGRAPHY
× PRODUCT TYPE
× DATA COLLECTED
× DATA PROCESSING / STORAGE GEOGRAPHY
× PAYMENT PROVIDER
× FULFILLMENT GEOGRAPHY
× REFUND / CANCELLATION RULE
× TAX / INVOICING RULE
× PUBLICATION / UGC ROLE
```

If any required field is unknown, the flow is not scale-ready.

---

# 2. Legal entity

Need explicit answer:

- who contracts with customer;
- who receives payment;
- who owns/refunds the transaction;
- who is data controller/business operator as applicable;
- who contracts with Dementors / contributors / vendors.

Do not publish commerce terms until seller identity is literal.

---

# 3. Geography classes

Separate:

- audience geography;
- legal entity jurisdiction;
- payment provider jurisdiction;
- data storage / processor geography;
- physical fulfillment location;
- Event location.

“Russian-speaking audience” is not a compliance jurisdiction.

---

# 4. Product type map

Evaluate separately:

## Free digital Thing

Questions:

- analytics/cookies;
- account/data collection;
- IP/content rights.

## Paid digital Thing / Course / Tool

Additionally:

- seller terms;
- digital-content consumer rules;
- refund/withdrawal rules;
- tax/VAT/sales tax;
- payment receipts/invoices.

## Event / live experience

Additionally:

- cancellation/rescheduling;
- venue rules;
- participant safety/liability;
- capacity/access terms.

## Physical Thing

Additionally:

- shipping;
- returns;
- product labeling/safety where applicable;
- customs/cross-border fulfillment.

## Intervention / professional service

Additionally:

- scope/disclaimer;
- contract with payer;
- confidentiality;
- outcome claims;
- professional-regulation review where relevant.

## Contribution / public content

Additionally:

- contributor rights/license;
- moderation/removal;
- privacy;
- public/private transition;
- intermediary/platform obligations where applicable.

---

# 5. Data map

Create a living inventory:

```text
DATA CATEGORY
PURPOSE
SOURCE
SYSTEM / PROCESSOR
RETENTION
LEGAL BASIS / PERMISSION
PUBLIC / PRIVATE
CROSS-BORDER TRANSFER?
DELETION / ACCESS PROCESS
```

Systems likely requiring review include current auth/database, analytics, session replay, Telegram and future payments.

Do not put raw Contribution/Situation content into marketing analytics.

---

# 6. Consent / analytics

Current consent/privacy technical guardrails should be preserved.

Before expanding analytics/ads determine per target geography:

- cookie/analytics consent requirements;
- privacy notice requirements;
- processor agreements;
- cross-border transfer requirements;
- advertising identifiers / remarketing restrictions.

Paid acquisition must not be enabled merely because the ad platform supports it.

---

# 7. Payment readiness

Commerce may open only when all are true:

- approved seller/legal entity;
- provider account active;
- price/currency literal;
- tax/invoice approach known;
- refund/cancellation handling known;
- fulfillment owner and capacity known;
- customer support/contact available;
- payment success/failure/reconciliation tested.

Database `preorder` state alone is not payment readiness.

---

# 8. Public commercial terms

Every offer must state as applicable:

- seller/provider identity;
- exact value supplied;
- price/currency/taxes;
- timing;
- recurring period/autorenewal if any;
- cancellation;
- refund/withdrawal;
- capacity/eligibility;
- contact/support;
- material restrictions.

Humor must not obscure these facts.

---

# 9. Advertising / partner readiness

Before paid promotion / sponsored integrations determine:

- advertising disclosure/labeling duties;
- data reporting duties where applicable;
- partner contract;
- attribution/payment terms;
- IP usage;
- editorial independence.

Partner payment does not buy editorial priority.

---

# 10. Contributor / IP readiness

Before scaling Contribution or external Dementor production define:

- ownership of submitted material;
- license to review/store/use;
- permission to edit/reframe;
- attribution / pseudonymity choices;
- withdrawal/removal policy;
- authorship vs provenance;
- rights to media/assets used in released Things.

Do not solve this with an unreadable universal rights grab.

---

# 11. Event readiness gate

Before opening registration/payment:

```text
DATE / LOCATION CONFIRMED
CAPACITY CONFIRMED
ELIGIBILITY CONFIRMED
PRICE CONFIRMED
PAYMENT READY
CANCELLATION / RESCHEDULE POLICY
OPERATOR / HOST
PARTICIPANT COMMUNICATION
DATA HANDLING
```

If date/price are not approved, interest/notification may be valid; registration/payment is not.

---

# 12. Recurring readiness gate

Before subscription / recurring package:

- recurring value exists;
- billing interval literal;
- autorenewal explicit;
- cancellation path functional;
- refund rules defined;
- failed-payment handling;
- recurring tax/invoice handling;
- user can understand package without relying on “membership status”.

---

# 13. Decision statuses

For each flow use:

- **READY** — approved for stated geography/scope;
- **CONDITIONAL** — allowed only under listed constraints;
- **HOLD** — unresolved material decision;
- **BLOCKED** — known incompatibility;
- **NOT REVIEWED** — no claim of readiness.

---

# 14. Immediate decision list

Before first paid test resolve at minimum:

1. selling legal entity;
2. initial customer/payment geography;
3. payment provider;
4. tax/invoicing mechanism;
5. public terms + privacy notice;
6. refund/cancellation rule for the selected offer;
7. processor/data map;
8. fulfillment ownership;
9. contributor/IP terms if user material is involved.

---

# Final rule

> **COMMERCIAL READINESS IS A FACTUAL GATE, NOT A FEATURE FLAG.**
