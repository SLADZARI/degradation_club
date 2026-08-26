# DEMENTOR economics model — roadmap v0.1

Status: **DRAFT / DO NOT DEPLOY**

Branch: `dementor-economics-model-v0.1-draft-object-economy`

This document fixes the intended architecture of the Dementor Club economic system, what already exists, what has been tested, what is still missing, and which ideas remain hypotheses.

---

## 0. TARGET SYSTEM

The target is not a merch calculator. The target is an operating economic control system for Dementor Club:

`sales → product economics → value added → company result → contribution ledger → Spory → conversion → Dementor wallet → optimisation radar`

Every Dementor should eventually be able to answer:

1. What did the club earn?
2. What did my work create?
3. How was my contribution measured?
4. How many Spory do I have?
5. What part of those Spory is only hypothetical value and what part is convertible into actual money?
6. What has already been paid to me?
7. What is the economic state of the club right now?
8. Which operating model should the club use at the current level of sales?

---

## 1. CURRENT FACTS / BASELINE

### Operating geography

- Production and operational work: Warsaw / Poland.
- Initial sales market: Europe.
- Management reporting currency: EUR.
- Historical PLN research inputs are normalised to EUR in the current draft.
- FX risk is intentionally excluded from v0.1.

### Labour

- Internal team labour rate for modelling: **€15/hour**.
- Labour is never treated as free.
- Procurement, coordination, pickup, QC, packing, dispatch and other operational time are included in full cost.

### Current sales wrapper

- Sales currently go through a Polish sole proprietorship / JDG.
- Therefore the accounting and tax layer must be designed according to Polish rules and the actual taxation/VAT status of that JDG.
- Tax treatment is **not yet implemented** in the calculator and requires a separate accounting specification.

### Current products

- Premium T-shirt Drop 001.
- OBJECT 001 — «НЕ НАДО».
- OBJECT 001 retail price currently fixed in the model at **€520**.

---

## 2. WHAT IS ALREADY DONE

### DONE — Product / operating economics calculator

Current file: `index.html`

The v0.1 calculator already models:

- monthly sold quantity;
- retail price;
- VAT as a scenario field;
- payment fee as a scenario field;
- one-unit economics floor;
- cash production cost;
- team labour at €15/hour;
- production windows;
- pickup runs;
- batch effect on pickup cost;
- local courier vs team pickup;
- shipping windows;
- customer-paid vs club-paid carrier cost;
- order → production → shipping handoff timing;
- revenue;
- full variable cost;
- contribution;
- contribution margin.

### TESTED — One-unit floor logic

The model preserves the case where only one product is sold in a month.

This is a core rule: batching may improve economics, but it must never hide the cost of the first isolated order.

### TESTED — Operational batching logic

The calculator already separates:

- product unit cost;
- per-run coordination cost;
- pickup run cost;
- dispatch run cost.

If 1 item is collected in a run, the entire run belongs to that unit. If 2 or 3 items are collected together, the run cost is distributed across the batch.

### PARTIAL — Product master records

The wider repository already has product records for the first T-shirt drop and OBJECT 001 presentation. Product economics still needs to become a formal first-class data layer instead of living partly inside calculator assumptions.

---

## 3. WHAT IS NOT YET IMPLEMENTED

### NOT IMPLEMENTED — Full company P&L

The current calculator is contribution-level, not a full company financial model.

Still required:

- fixed OPEX;
- recurring software/services;
- accounting;
- storage/workspace;
- marketing;
- insurance if applicable;
- returns/refunds;
- bad debt / payment losses if relevant;
- taxes;
- depreciation/amortisation;
- EBITDA bridge;
- cash flow bridge.

### NOT IMPLEMENTED — CAPEX register

We need a separate CAPEX layer for equipment and investments, for example:

- heat press;
- tools;
- workshop equipment;
- photo/content equipment if assigned to the product operation;
- reusable packaging tooling;
- software setup/integration costs where economically appropriate.

CAPEX must not be mixed directly into one-unit COGS.

For every CAPEX item the model should keep:

`asset_id / purchase_price / useful_life / residual_value / monthly_depreciation / capacity / avoided_outsource_cost / break_even_units / status`

### NOT IMPLEMENTED — EBITDA

The target management bridge should become:

`Revenue ex VAT`

`- Direct COGS`

`= Gross Profit`

`- Variable operating labour / fulfilment / payment`

`= Contribution`

`- Fixed OPEX`

`= EBITDA`

`- Depreciation / amortisation`

`= EBIT`

Taxes and owner/JDG-specific withdrawals must be shown below the operational result, not mixed into product contribution.

---

## 4. ADDED VALUE RULES

This layer must be designed before profit distribution.

The club needs an explicit rule for what counts as value creation.

### Proposed value chain

For any product/project/revenue line:

`customer revenue`

`- externally purchased value (materials, vendors, carriers, payment costs)`

`- operational cost required to fulfil the sale`

`= club-created economic value before fixed overhead`

The contribution system must distinguish at least:

1. **Revenue creation** — sale, commercial channel, conversion.
2. **Product/IP creation** — concept, design, object, method, content with reusable economic value.
3. **Production execution** — manufacturing, procurement, QA, packaging, fulfilment.
4. **System creation** — software, automation, operational process, reusable infrastructure.
5. **Risk/capital contribution** — cash or assets put at risk.
6. **Maintenance/operations** — necessary recurring work that preserves value but does not necessarily create new IP.

Hours alone must not equal contribution automatically. €15/hour remains the economic cost of work, while contribution value is a separate ledger concept.

---

## 5. DEMENTOR CONTRIBUTION LEDGER

### NEXT — contribution events

Every meaningful contribution should become a structured event:

`event_id`

`dementor_id`

`project/product_id`

`role`

`contribution_type`

`description`

`evidence/source`

`date`

`estimated_hours`

`labour_cost_eur`

`value_score`

`spory_awarded`

`status: proposed / approved / rejected / adjusted`

`approver / rule`

The ledger must be auditable. A Dementor should be able to open any line and see why the value was credited.

### Important separation

`labour cost != Spory != cash payout != ownership`

These are four different economic concepts and must never be collapsed into one number.

---

## 6. SPORY SYSTEM

Status: **CONCEPT / NOT FORMALISED IN THIS BRANCH**.

No verified implementation of a Spory ledger or conversion engine was found in the current economics branch/repository audit. It therefore remains a design task, even if the concept exists in the wider project work.

### Intended role

Spory are an internal unit representing approved contribution to the club.

Spory should initially be **non-cash accounting units**, not money, shares or a promise of a fixed payout.

A wallet should distinguish:

- Spory earned;
- Spory pending approval;
- Spory vested/eligible for conversion;
- Spory converted;
- cash actually paid;
- hypothetical value at the current conversion model.

### Conversion model — to design and test

Recommended first prototype:

1. Close a reporting period.
2. Calculate distributable economic pool.
3. Apply reserve rules.
4. Determine which projects/products generated the pool.
5. Determine eligible Spory attached to that value creation.
6. Calculate provisional conversion value.
7. Approve payout.
8. Record actual cash payment separately from Spory balance.

Do **not** start with a fixed permanent `1 Spora = X EUR` promise. A floating period/project conversion model is safer for an early operating prototype because real economics are not yet stable.

---

## 7. PROFIT DISTRIBUTION LAYER

### NEXT — waterfall

Before any payout, the company must define a transparent waterfall.

Working structure to test:

`Revenue ex VAT`

`- COGS`

`- fulfilment / variable operations`

`= Contribution`

`- fixed OPEX allocation`

`- tax/accounting reserve`

`- working-capital reserve`

`- CAPEX reserve if approved`

`= Distributable Pool`

Only the Distributable Pool can feed contribution payouts.

Open decisions:

- minimum reserve months;
- whether product-specific pools exist;
- whether creator/product-originator receives a persistent share;
- whether sales contribution is transaction-specific;
- whether maintenance work is paid only as labour or also earns Spory;
- maximum payout percentage per period;
- treatment of losses / negative periods.

---

## 8. DEMENTOR WALLET — PRIMARY PROTOTYPE

### TARGET UI

The wallet is the individual economic feedback surface for each Dementor.

It should show:

#### My Spory

- total Spory;
- pending;
- approved;
- convertible;
- already converted.

#### My economic contribution

- attributed revenue;
- attributed gross value;
- approved value events;
- labour cost contributed;
- product/project breakdown.

#### My money

- hypothetical current conversion value;
- approved payout;
- paid to date;
- unpaid approved amount.

#### Why this number

Every amount must drill down to contribution events and source records.

#### Company context

The Dementor should also see enough company economics to understand whether conversion is possible without exposing a fake certainty:

- revenue trend;
- contribution trend;
- EBITDA or current pre-EBITDA proxy;
- cash/reserve state when this becomes available;
- current optimisation regime.

---

## 9. POLAND / JDG TAX & ACCOUNTING ENGINE

Status: **REQUIRED BEFORE REAL PAYOUT LOGIC / NOT YET SPECIFIED**.

Because sales currently go through a Polish sole proprietorship, the model needs a dedicated tax/accounting layer based on the actual JDG setup.

Required inputs to confirm with accounting/legal sources:

- VAT registration/status;
- applicable VAT treatment for EU B2C/B2B sales;
- OSS applicability where relevant;
- income-tax regime of the JDG;
- deductibility of product and operating costs;
- ZUS/social contribution treatment where relevant to management reporting;
- invoicing/fiscal receipt obligations;
- treatment of payments to other Dementors: contractor invoice, civil contract, employment-like relationship, other;
- treatment of Spory conversion payments;
- accounting treatment of CAPEX/depreciation;
- treatment of returns/refunds and cross-border shipping.

Until this specification exists, the calculator may show VAT as a scenario but must not present final net profit after Polish tax as verified.

---

## 10. ECONOMIC RADAR / OPTIMISATION ENGINE

### NEXT — management radar

The radar should not merely show that sales rose or fell. It should recommend the cheapest viable operating model and show the difficulty of switching to it.

### Inputs

- orders per month;
- units per SKU;
- revenue trend;
- contribution margin trend;
- average order value;
- production runs;
- average batch size;
- pickup/dispatch cost per unit;
- lead time;
- rejection/return rate;
- stock days;
- labour minutes per order;
- utilisation of owned equipment;
- supplier lead time;
- cash requirement / working capital.

### Example operating regimes

#### R0 — MANUAL / ONE-OFF

Best for very low volume.

- outsource production;
- no stock or minimal stock;
- manual QC/packing;
- few fixed costs.

#### R1 — BATCHED OUTSOURCE

When orders become regular.

- fixed production windows;
- fixed pickup/dispatch days;
- small blank/packaging buffer;
- lower logistics cost per unit.

#### R2 — HYBRID IN-HOUSE

When repetitive outsourced operations justify equipment.

- own heat press / selected finishing;
- outsource specialised processes;
- CAPEX decision based on actual break-even.

#### R3 — MICRO-PRODUCTION

When stable volume justifies controlled stock/capacity.

- reorder points;
- defined capacity;
- dedicated operating process;
- supplier framework terms.

### Radar output

For every suggested transition show:

`CURRENT REGIME`

`RECOMMENDED REGIME`

`WHY`

`EXPECTED SAVING / MARGIN EFFECT`

`CAPEX REQUIRED`

`WORKING CAPITAL REQUIRED`

`IMPLEMENTATION TIME`

`COMPLEXITY: 1–5`

`REVERSIBILITY: easy / medium / hard`

`TRIGGER TO SWITCH`

### Rule

The radar recommends a transition only when the expected economic improvement exceeds the cost and complexity of switching.

---

## 11. DAO / EQUITY / TRANSFERABLE OWNERSHIP

Status: **HYPOTHESIS ONLY**.

Possible future directions to investigate:

- profit-participation units;
- phantom-equity style internal units;
- contractual revenue-share rights;
- a separate company with real shares;
- tokenised/DAO-like governance layer;
- buyback / secondary transfer mechanics;
- contributor vesting.

### Critical current limitation

The current Polish sole proprietorship is not a share company and does not provide corporate shares that can simply be allocated or sold to Dementors.

Therefore no Spory balance in v0.1 should be described as legal ownership, equity or a security.

Any real transferable ownership model requires a separate legal wrapper and dedicated Polish/EU legal and tax analysis before implementation.

---

## 12. DELIVERY SEQUENCE

### PHASE 0 — current

**Status: DONE / DRAFT**

- unit economics calculator;
- one-unit floor;
- product cash/labour model;
- batching;
- pickup/shipping windows;
- contribution-level result.

### PHASE 1 — company economics

**Status: NEXT**

- product master economics records;
- fixed OPEX register;
- CAPEX register;
- depreciation;
- Gross Profit / Contribution / EBITDA bridge;
- working capital / reserve fields;
- Polish JDG tax placeholders clearly separated from verified tax rules.

### PHASE 2 — contribution accounting

**Status: NEXT AFTER PHASE 1**

- contribution event schema;
- approval workflow;
- attribution to product/project;
- explicit added-value rules;
- separation of labour cost from value credit.

### PHASE 3 — Spory prototype

**Status: PLANNED**

- Spory ledger;
- pending/approved states;
- period/project pools;
- hypothetical conversion;
- conversion history;
- no legal-equity claims.

### PHASE 4 — Dementor wallet

**Status: PLANNED**

- personal contribution dashboard;
- Spory balance;
- hypothetical earned amount;
- approved payout;
- paid amount;
- source drilldown;
- company context/radar feedback.

### PHASE 5 — economic radar

**Status: PLANNED**

- regime detection;
- growth/decline triggers;
- optimisation recommendation;
- CAPEX break-even recommendation;
- transition complexity score;
- expected effect on margin/EBITDA.

### PHASE 6 — verified Polish accounting/tax integration

**Status: REQUIRED BEFORE PRODUCTION PAYOUT MODEL**

- actual JDG tax regime;
- VAT/OSS rules;
- payout contracts/tax treatment;
- accounting export;
- verified after-tax result.

### PHASE 7 — ownership / DAO research

**Status: HYPOTHESIS / DO NOT IMPLEMENT YET**

- legal wrapper alternatives;
- transferability;
- governance;
- equity vs profit-share vs internal reputation/value units;
- regulatory/tax implications.

---

## 13. NEXT CONCRETE BUILD

The next implementation should extend the current calculator rather than replace it.

Recommended next screen architecture:

1. **ECONOMY** — existing product calculator.
2. **P&L** — Gross Profit → Contribution → EBITDA.
3. **CAPEX** — assets, break-even, depreciation.
4. **CONTRIBUTIONS** — contribution event ledger.
5. **SPORY** — internal units and conversion pools.
6. **WALLET** — personal Dementor view.
7. **RADAR** — operating-regime recommendations.
8. **TAX / PL** — accounting assumptions and verified Polish rules.
9. **LAB / DAO** — explicitly experimental ownership layer.

The prototype should continue to be a transparent control panel: every derived number must expose the formula and the source inputs behind it.

---

## 14. STATUS LEGEND

- **DONE** — implemented in the economics branch.
- **TESTED** — logic has been exercised in the calculator, but not necessarily against real transactions.
- **PARTIAL** — some data/model exists but is incomplete.
- **NEXT** — next implementation layer.
- **PLANNED** — sequenced after required dependencies.
- **REQUIRED** — blocking requirement before real financial use.
- **HYPOTHESIS** — research concept; not an approved economic/legal mechanism.

---

## 15. NON-NEGOTIABLE RULES

1. Do not deploy this branch without explicit approval.
2. Do not treat labour as free.
3. Do not hide one-unit economics behind batch averages.
4. Do not call Spory money before a payout is approved and actually payable.
5. Do not call Spory equity or ownership under the current JDG structure.
6. Do not distribute profit before taxes/reserves/working capital rules are defined.
7. Do not mix CAPEX directly into product COGS.
8. Do not show EBITDA until fixed OPEX is represented.
9. Every contribution credit must have a source/evidence trail.
10. Every optimisation recommendation must show expected benefit and transition cost.
