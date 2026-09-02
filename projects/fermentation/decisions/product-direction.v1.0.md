---
artifactId: fermentation.decision.product-direction
project: fermentation
documentType: DECISION
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

# MP | Fermentation | DECISION | Product Direction | v1.0

## Decision
The canonical product is **Fermentation**. The demand-validation proposition combines a finished fermented food product with customization and live observation of the fermentation process.

## Approved choices
- Primary value: the customer pays for the **experience** of their own fermentation; finished fermented cabbage is the physical outcome.
- A Fermentation package includes live access.
- Live-only access is a valid separate paid path.
- Ready fermented cabbage without live access is a separate product path.
- Starter / Personal / Experience remain the package architecture for demand validation; pricing and economics remain hypotheses.
- Customization includes cabbage type, vegetables/additions, spices and cut size, subject to later DOMAIN/process constraints.
- The intended live experience includes visible process activity and, when available, pH, temperature, salt and history.
- Macro-visible bubbles/gas activity are part of the intended experience.
- Recording is part of the direction; retention/delivery remains unresolved.
- For the first physical pilot, one fermentation + one camera is sufficient.
- A roughly 5-liter-class cell is a working design assumption only.
- Multi-cell central camera / 360° remains a later experiment, not an architecture lock.
- Degassing/gas release is important as an experience moment, but manual degassing is not approved as a required process step.
- The current landing exists to test demand; it is not a live production service and is not currently selling the production system.

## Explicitly unresolved
Pricing, exact finished-product quantity per package, fermentation duration/release criteria, final vessel, cell count, rack economics, camera/streaming architecture, sensor automation, legal/food-safety claims, recording storage and production fulfillment.

## Consequence
`projects/fermentation/product/fermentation-product.v1.0.md` becomes the protected PRODUCT authority. Research and implementation documents must not silently override it.

## Evidence
Explicit decision by Yauhen in the Fermentation project working session, 2026-09-02.
