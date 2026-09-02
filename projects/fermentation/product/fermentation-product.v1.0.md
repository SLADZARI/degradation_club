---
artifactId: fermentation.product.core
project: fermentation
documentType: PRODUCT
projectStage: DECISION
gate: G1_PRODUCT_LOCK
status: APPROVED
version: 1.0
updated: 2026-09-02
owner: Yauhen
sourceSystem: GIT
authorityType: APPROVED_AUTHORITY
supersedes: null
---

# MP | Fermentation | DECISION | Product | v1.0

## Purpose
Protected product baseline for the Dementor Club project **Fermentation**. This artifact defines what the demand-validation prototype is testing. It does not approve production infrastructure, food-safety claims, final economics or public release.

## Product
**Fermentation** is a combination of food, controlled fermentation process and live experience.

The primary value proposition is not simply fermented cabbage. It is the experience of making a fermentation personally yours, following the living process over time and receiving the finished fermented product.

## Approved product model
- Canonical product name: **Fermentation**.
- The project belongs to the Dementor Club ecosystem.
- A fermentation package includes live access to the customer's fermentation.
- Live-only access may also be sold separately.
- Ready fermented cabbage may be sold without live access as a separate product path.
- Starter / Personal / Experience remain the approved working package architecture. Exact prices, weights and economics are not approved by this artifact.
- Customization is core to the proposition: white/red cabbage, vegetables such as carrot or beetroot, spices and cut size. The exact allowed option set remains subject to DOMAIN and food-process validation.
- Any kilograms presented in product packages refer to finished fermented product mass; exact package quantities remain unapproved until separately locked.
- The immediate product is a **demand-validation prototype**, not a production commerce system. Its purpose is to test whether people want to start and follow a personalized fermentation.
- The intended customer experience includes seeing their own fermentation live.
- Macro-visible activity such as bubbles and gas movement is an important part of the experience.
- Intended process transparency includes pH, temperature, salt concentration, pH curve and process history when real instrumentation/data exists.
- Recording of the fermentation process is part of the product direction. The storage/delivery model remains unresolved.
- Visible gas release / degassing moments are important experience moments. The actual fermentation method must be chosen from process evidence; this artifact does not claim that manual degassing is required or beneficial.

## MVP direction
The first physical validation may use one fermentation and one camera. A vessel/cell roughly comparable to a 5-liter jar is a working sizing assumption for design/research, not an approved final vessel specification.

A central-camera / multi-cell / 360° architecture remains a later experiment. The customer outcome is authoritative: the customer must be able to see their own fermentation; the implementation method is not yet locked.

## Primary demand-validation flow
1. Understand the Fermentation proposition.
2. Choose a package or alternative path (live-only / ready product).
3. Choose meaningful fermentation preferences.
4. See the intended live/process experience.
5. Express intent to join/request the pilot and leave contact details.

The prototype may show sample batches and sample telemetry to demonstrate the intended experience, but mock data must not be represented as factual current production data.

## Not approved by v1.0
- exact prices or discounts;
- final package weights;
- exact fermentation duration or release criteria;
- final vessel/cell design;
- cell/rack/room capacity and production economics;
- final camera, macro-camera or 360° architecture;
- sensor/IoT architecture;
- recording retention/storage implementation;
- payments, auth, fulfillment or subscriptions backend;
- regulatory, medical, probiotic or food-safety claims not separately verified and approved;
- deterministic lunar-phase effects on fermentation rate, texture or bacterial activity;
- a requirement for manual degassing.

## Boundary
Product semantics are governed here in the Dementor Club source-of-truth. `SLADZARI/dementor-fermentation` is the implementation repository and must reference this artifact instead of maintaining a competing product authority.

## Approval evidence
Decision owner Yauhen explicitly approved the product direction in the Fermentation project working session on 2026-09-02. The corresponding decision record is `projects/fermentation/decisions/product-direction.v1.0.md`.
