# DEMENTOR CLUB — LEGAL IMPLEMENTATION CHECKLIST v0.2

Status: `DRAFT / BLOCKER LIST`
Updated: `2026-08-28`

This file separates legal design from production readiness.

## P0 — operator identity

Before any live consumer checkout, confirm and publish where required:

- [ ] full JDG legal/business name;
- [ ] NIP;
- [ ] business/contact address;
- [ ] complaints/returns address;
- [ ] legal/privacy/customer-service email;
- [ ] phone if used/required;
- [ ] VAT/invoice status and sales-document flow;
- [ ] approved business-linked payment destination/provider.

No personal CV, private Drive document or unrelated source may be used to reconstruct these fields.

## P0 — checkout evidence

For every paid flow:

- [ ] show main characteristics immediately before final order;
- [ ] show total gross price and additional costs;
- [ ] show accepted payment method;
- [ ] show delivery restriction and expected timing;
- [ ] show applicable withdrawal right or statutory exception;
- [ ] final button explicitly communicates payment obligation;
- [ ] persist exact order payload;
- [ ] persist applicable terms version/hash;
- [ ] send durable-medium confirmation, normally e-mail;
- [ ] preserve payment reference/status;
- [ ] do not treat a draft order as paid/confirmed.

## P0 — ordinary merch

For standard shirts and other non-personalised products:

- [ ] 14-day distance-withdrawal flow enabled where legally applicable;
- [ ] statutory withdrawal information displayed before contract;
- [ ] model withdrawal form available;
- [ ] return address confirmed;
- [ ] return-cost rule stated;
- [ ] complaint/conformity flow independent of withdrawal flow;
- [ ] product-composition and applicable product-safety/label information added before sale.

Do not claim `PREORDER = NO RETURNS`.

## P0 — OBJECT 001 / НЕ НАДО

Protected sales model:

`CUSTOMER SPEC → CONFIRMATION → PAYMENT → INDIVIDUAL PRODUCTION/FINAL FINISH → PERMANENT OWNER MARK → QC → SHIP`

Required:

- [ ] `OWNER MARK` is free-form customer input, not only preset options;
- [ ] allowed technical character/length rules are defined;
- [ ] prohibited-content rule is defined;
- [ ] customer sees exact final text before paying;
- [ ] personalisation is permanently applied to the sold object itself;
- [ ] individual specification enters the production/finishing instruction before final manufacture/finish;
- [ ] evidence of production/finalisation for the specific order is retained;
- [ ] checkout clearly explains art. 38 ust. 1 pkt 3 statutory exception;
- [ ] confirmation of that information is logged;
- [ ] complaint/conformity rights remain fully available;
- [ ] wrong engraving by Operator is handled as non-conformity;
- [ ] customer typo correctly reproduced by Operator is treated according to confirmed specification;
- [ ] no automatic contractual right to cancel after paid personalised order is promised;
- [ ] Operator may voluntarily accept a change/cancellation when technically possible without creating a general entitlement.

Important: edition numbering `001/050` is not sufficient personalisation.

## P0 — OBJECT 001 source conflict

Current canonical product record and current website presentation are inconsistent.

Canonical branch currently says:

- sales state: `not_open`;
- canonical base price: `EUR 220`.

Website has previously displayed:

- `PREORDER OPEN`;
- `EUR 520`.

Before checkout opens:

- [ ] approve one price in `dementor-club`;
- [ ] approve sales-state transition in `dementor-club`;
- [ ] only then sync `dementor-club-site`.

The legal draft must not be used to legitimise a sales state that the product canon has not approved.

## P0 — preorder timing

For each preorder product:

- [ ] real production window or understandable range approved;
- [ ] shipment estimate approved;
- [ ] handling of production delay documented;
- [ ] handling of Operator inability to fulfil documented;
- [ ] customer confirmation includes the timing shown at checkout.

Avoid `we will ship when ready` as the only timing statement.

## P0 — event sales

Before charging for any event:

- [ ] legal organiser identified;
- [ ] actual service provider identified;
- [ ] date/place/status confirmed;
- [ ] cancellation/rescheduling/weather rules confirmed;
- [ ] consumer withdrawal analysis performed;
- [ ] refund rule defined;
- [ ] safety restrictions defined where relevant;
- [ ] insurance responsibilities defined where relevant;
- [ ] third-party operator rules linked before purchase;
- [ ] participant consent/acknowledgement kept separate from invalid blanket liability waivers.

For skydiving/gliding/aviation/high-risk activities, event-specific terms are mandatory before sale.

## P0 — digital products/services

- [ ] classify each product as service, digital content, or mixed product;
- [ ] if digital content starts immediately, collect the legally required prior express consent and acknowledgement of loss of withdrawal right;
- [ ] if paid service starts during withdrawal period, implement explicit request/acknowledgement appropriate to services;
- [ ] send durable confirmation;
- [ ] never reuse the personalised-goods checkbox for digital content.

## P0 — Support

Current legal/accounting model is not approved.

Before enabling live Support:

- [ ] accountant/tax adviser confirms treatment of gratuitous payments received by JDG;
- [ ] exact recipient identity published;
- [ ] payment documentation flow approved;
- [ ] foreign payments reviewed;
- [ ] erroneous/duplicate/unauthorised payment procedure approved;
- [ ] no OPP/foundation implication unless factually true;
- [ ] no tax-deduction promise;
- [ ] no goods/services/membership/Spores/investment promised in exchange.

Until this is completed: `Support = disabled` is the safer production state.

## P0 — privacy

Current architecture includes Google OAuth + Supabase and therefore the old local-only privacy notice is obsolete.

Before publication:

- [ ] controller identity completed;
- [ ] actual Supabase project region verified;
- [ ] actual Google/Vercel/Supabase data-transfer mechanisms verified;
- [ ] retention periods approved;
- [ ] account deletion/data deletion operational path defined;
- [ ] assessment data categories verified;
- [ ] order/personalisation retention defined;
- [ ] vendor/DPA inventory created;
- [ ] public privacy notice updated before account/checkout launch.

## P1 — browser storage / consent

Known functional storage includes:

- `dementorClubOnboardingV3`;
- `dementorClubCartV1`;
- auth/session-related storage from current account stack.

Before adding analytics/marketing:

- [ ] classify each tracker/storage mechanism;
- [ ] block non-essential storage until consent where required;
- [ ] allow refusal as easily as acceptance;
- [ ] allow consent withdrawal;
- [ ] document vendors and purposes;
- [ ] do not deploy a decorative cookie banner that does nothing.

## P1 — records and auditability

For disputes, the useful evidence package for a paid order should include:

- order id;
- customer identity/contact used for contract;
- product SKU/version;
- exact product configuration;
- individual `OWNER MARK`, if applicable;
- date/time of confirmations;
- final price and delivery cost;
- terms/privacy version active at checkout;
- checkbox/consent values where legally relevant;
- payment status/reference;
- production record for personalised items;
- shipment record;
- customer confirmation email content/version.

## P1 — legal voice

Brand voice is permitted around the legal core, not instead of it.

Good:

> Zmieniłeś zdanie. Przedmiot nie zmienił specyfikacji.

only after the legal rule is clearly stated.

Bad:

> Zwrotów nie ma. Taki mamy klimat.

if statutory rights actually apply.

## Release gate

No feature should be labelled `LIVE`, `OPEN`, `CHECKOUT ACTIVE`, `BLIK LIVE`, or equivalent until its corresponding P0 section above is complete and the source-of-truth state is updated first.