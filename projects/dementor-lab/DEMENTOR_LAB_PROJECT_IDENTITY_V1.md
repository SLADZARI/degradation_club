---
artifactId: dementor-lab.decision.project-identity
project: dementor-lab
documentType: DECISION
projectStage: DECISION
status: DRAFT
version: 0.1
updated: 2026-09-17
owner: Dementor Club
sourceSystem: GIT
authorityType: REFERENCE
supersedes: null
---

# DEMENTOR LAB — Project Identity v1

**STATUS:** DRAFT / DECISION PREPARATION / NO RUNTIME EFFECT  
**SOURCE-OF-TRUTH BRANCH:** `dementor-club`  
**SCOPE:** project identity only

## 1. Purpose

This draft prepares one narrow project-local Decision for **DEMENTOR LAB**.

Its purpose is only to define the stable identity tuple that other semantic projections may reference without making Current Program, Catalog, a route page, runtime code or a generic registry the owner of Project identity.

If approved, this artifact would govern only:

- canonical project name;
- source kind;
- stable project slug;
- semantic reference derivation;
- canonical public route;
- the project-local authority boundary for those identity fields.

It does **not** approve or redefine Product, runtime, gameplay, release, programming, Catalog or route-page semantics.

## 2. Proposed identity tuple

```text
canonicalName: DEMENTOR LAB
sourceKind: project
slug: dementor-lab
semanticRef: project:dementor-lab
canonicalPublicRoute: /projects/dementor-lab/
```

### Canonical name

```text
DEMENTOR LAB
```

This is the stable project name for cross-surface semantic reference.

### Source kind

```text
project
```

`sourceKind` identifies implementation provenance only. It does not redefine the audience-facing form, release state or gameplay model of DEMENTOR LAB.

### Stable slug

```text
dementor-lab
```

The slug is the stable project-local identifier used to derive the semantic reference defined below.

### Semantic reference derivation

For DEMENTOR LAB only:

```text
project:<slug>
→ project:dementor-lab
```

Therefore:

```text
thingRef = project:dementor-lab
```

This draft does not establish a universal Project registry or a generic identity system for every Dementor Club Project. It records the derivation for this existing Project only.

### Canonical public route

```text
/projects/dementor-lab/
```

The route is the canonical public destination for this Project identity. The route page is a projection/destination and is **not** the authority that creates or owns the identity.

## 3. Project-local authority boundary

If approved, `projects/dementor-lab/DEMENTOR_LAB_PROJECT_IDENTITY_V1.md` becomes the project-local authority only for the identity tuple defined in section 2.

The boundary is explicit:

```text
identity authority
≠ runtime semantics
≠ Game Architecture
≠ Current Program
≠ Catalog
≠ route page
```

Consequences:

- Current Program may reference `project:dementor-lab`, but does not own that identity.
- Catalog may index or present DEMENTOR LAB, but remains a secondary registry/provenance utility and does not own Project identity.
- `/projects/dementor-lab/` may render the Project, but page existence or page copy does not establish identity authority.
- runtime code may consume the identity, but implementation does not become semantic owner by doing so.
- no `dc_entities` row is required by this Decision.
- no new common Project registry is created by this Decision.

## 4. Existing Dementor Lab authorities remain separate

### Runtime semantics

`projects/dementor-lab/DEMENTOR_LAB_RUNTIME_SEMANTIC_DECISIONS_V0.1.md` retains authority only over the runtime semantics it explicitly approves.

Approval of this identity Decision would not expand, reduce or supersede that runtime-semantics authority.

### Game Architecture

`projects/dementor-lab/DEMENTOR_LAB_GAME_ARCHITECTURE_V0.1.md` remains **DRAFT / working product contract**.

This identity Decision does not promote Game Architecture to APPROVED authority and does not copy any of its broader Product/Game claims into the identity layer.

## 5. Fermentation precedent

The precedent is the existing project-local approach under:

```text
projects/fermentation/
```

Fermentation demonstrates that a Dementor Club Project may keep its own semantic authorities inside its project-local source boundary rather than requiring a shared cross-project registry.

Only that authority-placement pattern is reused here.

This draft does **not** copy or inherit Fermentation's protected PRODUCT authority, Product model, approval state, gate state or implementation boundary.

In particular:

```text
Fermentation PRODUCT authority
≠ DEMENTOR LAB identity authority
```

## 6. Non-goals

This Decision does not:

- create a universal `dc_projects` or `dc_things` registry;
- add or change a `dc_entities` row;
- change Supabase schema or data;
- change runtime code;
- change Current Program composition or programming semantics;
- change Catalog ownership or Catalog data;
- change the public route implementation;
- define Release/playability state;
- define Product semantics;
- approve Game Architecture;
- redefine runtime semantics;
- create a ThingProjection implementation;
- activate issue #213;
- create a Result or integration branch.

## 7. Approval effect

Until explicitly approved, this file is **DRAFT / REFERENCE only** and has no runtime or semantic promotion effect.

If approved, the narrow authority chain becomes:

```text
projects/dementor-lab/DEMENTOR_LAB_PROJECT_IDENTITY_V1.md
  → canonicalName: DEMENTOR LAB
  → sourceKind: project
  → slug: dementor-lab
  → semanticRef: project:dementor-lab
  → canonicalPublicRoute: /projects/dementor-lab/
```

All other Dementor Lab meanings remain with their existing specific authorities or remain unresolved until separately decided.
