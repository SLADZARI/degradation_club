# Dementor Club — Artifact Presentation Extension v1

Status: **WORKING IMPLEMENTATION EXTENSION / QA PENDING**  
Date: 2026-08-30  
Parent standard: `docs/ENTITY_PRESENTATION_STANDARD_v1.md`  
Design authority: CURRENT → v10  
Source-of-truth: `dementor-club` Community / Artifact mechanics

## 1. Purpose

`Artifact` became an approved Community entity after the parent Entity Presentation Standard v1 was written.

This extension defines the minimum rendering grammar required to implement Artifact without inventing a parallel UI system.

This document does not change the club design canon and cannot override v10.

## 2. Entity definition

Artifact is a persistent Community-origin record created by a Member.

The first implemented Artifact type is:

`notice`

Public Community wording may call this an **объявление**.

Artifact does not automatically become an Event, Course, Project, Practice or Dementor role. Promotion to another entity is a later explicit relation/status transition.

## 3. Allowed presentation roles

### `notice`
Primary Board representation. A physically suggestive notice pinned to the Community wall.

### `row`
Compact register/archive representation when scanability matters more than the wall metaphor.

### `detail`
Own addressable Artifact page.

### `archive`
Terminal/history representation for expired or deliberately closed Artifacts.

No additional Artifact role may be introduced without an explicit extension to this document or its successor.

## 4. Contexts

Artifact v1 is valid in:

- `community-board` — private active Community wall;
- `entity-detail` — addressable Artifact detail;
- `community-archive` — later archive/history surface;
- `member-history` — later Member profile/history relation.

It is **not** automatically a public-site entity.

## 5. Notice anatomy

Required when source data exists:

- Artifact identifier / local sequence marker;
- author identity;
- author display name;
- published date;
- body;
- factual status;
- expiration state (`persistent` or dated);
- reaction affordance/count;
- response affordance for another Member;
- detail action.

Optional:

- title;
- one media attachment in v1;
- one external URL;
- nickname;
- avatar.

Unknown fields are omitted. They are never fabricated.

## 6. State vocabulary

Canonical runtime states:

- `draft`
- `publishing`
- `active`
- `expired`
- `archived`
- `removed`

Presentation rules:

- `draft` belongs only to its author;
- `publishing` is a service state, not an active Board entity;
- `active` appears on the current Board;
- `expired` is removed from current active Board presentation and remains historical;
- `archived` is explicitly closed/history;
- `removed` is not presented as normal Community history.

## 7. Interaction states

All actionable Artifact controls must support relevant states from the parent standard:

- default;
- hover on pointer devices;
- focus-visible;
- active/pressed;
- selected where relevant;
- disabled;
- loading/processing;
- error.

Examples:

- reaction: default → selected → loading → default/selected;
- response: default → composer open → submitting → submitted/disabled;
- publish: default → saving draft → uploading → publishing → success/error;
- archive: default → confirmation → processing → archived/error.

Color alone must not communicate selected/success/error state.

## 8. Visual contract

Artifact follows v10:

**PAPER / BLACK / ACID + editorial metadata + controlled system violation.**

The Board may use a local physical-wall metaphor, but the interface remains disciplined first.

Approved local treatments:

- paper-like notice surface;
- hard ink border/shadow;
- a small controlled vertical offset between some desktop notices;
- differing notice height caused by real content;
- media crossing a small internal inset;
- acid used only for active action/selection/signal.

Forbidden:

- random rotation on every card;
- fake torn-paper effects everywhere;
- uncontrolled overlap;
- decorative glitch;
- generic SaaS cards/pills;
- masonry that destroys reading order;
- white/PAPER foreground on ACID.

## 9. Responsive contract

### Desktop / 1440+

Board may use a 12-column wall composition with controlled notice width variation and small deliberate offsets.

### Compact / 1024

Reduce variation; preserve readable author/body/actions and stable reading order.

### Tablet / 768

Recompose toward a simple two/one-column sequence depending on available width.

### Mobile / 390 and narrow / 320

The wall metaphor becomes a **vertical notice stream**.

Rules:

- no scaled-down desktop wall;
- no essential hover behavior;
- controls remain reachable and approximately 44 px+ where primary;
- title/body do not clip horizontally;
- media stays inside viewport;
- one Artifact remains clearly one semantic block;
- controlled desktop offsets are removed.

## 10. Detail page

Artifact detail is evidence/history, not a second promotional hero.

It must expose early:

- ID;
- status;
- author;
- published date;
- expiration state;
- body;
- attachment/link when present.

Member actions reuse the same reaction/response semantics as the Board.

## 11. Empty/loading/error states

The Board explicitly supports:

- loading;
- membership required;
- first Artifact required;
- slot available;
- slot occupied;
- draft exists;
- empty active Board;
- publish/upload error;
- offline/provider error.

An empty Board must remain factually empty. Historical club material may be seeded only from confirmed source-backed artifacts.

## 12. QA requirement

Before production approval test at minimum:

- 1440 / 1024 / 768 / 390 / 320;
- anonymous;
- authenticated non-member;
- active member without Artifact;
- active member with draft;
- active member with active Artifact;
- another member reacting/responding;
- persistent Artifact;
- dated Artifact;
- expired Artifact;
- image attachment;
- file attachment;
- upload failure;
- duplicate publish attempt;
- no available slot;
- keyboard focus;
- reduced motion.

Implemented layout is not approved production presentation until this QA and explicit release approval are complete.
