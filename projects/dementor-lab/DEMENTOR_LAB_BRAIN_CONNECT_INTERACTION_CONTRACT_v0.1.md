# DEMENTOR LAB — BRAIN CONNECT INTERACTION CONTRACT v0.1

Status: APPROVED
Date: 2026-09-03
Owner: Dementor Club product source-of-truth

## 1. Core rule

`СВЯЗАТЬ` is one system mechanic.

There MUST NOT be separate visual or interaction languages for connecting:

- a Trigger from the Trigger Hub;
- an ordinary BRAIN node from the vertical stack;
- a newly added node from the library.

Same action -> same entry state -> same compatible-target state -> same completion feedback.

## 2. Unified CONNECT MODE

### Enter

The user activates the same CONNECT action on a source node/Trigger.

The source receives the same active visual state everywhere:

- acid functional accent;
- clear source highlight;
- global status copy: `СВЯЗЬ: «SOURCE» → ВЫБЕРИ ДОПУСТИМЫЙ УЗЕЛ.`

### Compatible targets

While CONNECT MODE is active:

- only compatible target nodes become active targets;
- every compatible target uses the same black + acid target treatment;
- every compatible target exposes the same CTA: `СОЕДИНИТЬ`;
- incompatible nodes remain visually inactive and cannot complete the connection.

### Complete

Tap `СОЕДИНИТЬ` on a target:

1. create one real BehaviorGraph edge;
2. leave CONNECT MODE;
3. update the visible route immediately;
4. preserve the edge through reorder;
5. Trigger Hub must show every immediate destination for Trigger sources.

### Cancel

Tap the active CONNECT action/source again to cancel CONNECT MODE.

No hidden alternative connection gesture is allowed for the same operation.

## 3. Trigger Hub ownership model

The six vertical-slice Trigger types are a fixed system alphabet:

- КРИТИКА
- ИГНОР
- ВОЗРАЖЕНИЕ
- ПРИНЯТО
- УШЛИ В СТОРОНУ
- ДАВЛЕНИЕ

They are not ordinary disposable content nodes in the Hub.

The player does NOT add/remove Trigger types from the Trigger Hub.

For every Trigger the player can only manage routes:

- `СВЯЗАТЬ` — no destination exists yet;
- `ИЗМЕНИТЬ` — one or more destinations exist; enters the same CONNECT MODE;
- `ОТКЛЮЧИТЬ` — removes all outgoing routes of this Trigger without deleting the Trigger type.

Custom BRAIN starts with the Trigger Hub expanded so the question `НА ЧТО ТЫ РЕАГИРУЕШЬ?` is explicit.
Preset BRAIN may start with the Hub collapsed.

Rule: **Hide infrastructure, never hide causality.**

The Hub always exposes every immediate Trigger destination when expanded.

## 4. Node Library

The add-node library is not a raw text inventory.

### Sections

Use one accordion with semantic families:

- TRIGGER
- STATE
- IMPULSE
- REACTION
- CONTROL
- ABILITY

On open:

- the first available section is expanded;
- all other sections are collapsed;
- opening one section closes the previous section.

### Cards

Library entries reuse the visual grammar of BRAIN gameplay nodes:

- family label;
- large node title;
- short semantic description;
- parameter/value when relevant;
- same paper / black / acid system.

A library card tap adds the node, closes the library, scrolls to the added node and briefly highlights it.

Trigger types already present in the fixed Trigger Hub MUST NOT be duplicated by ordinary add/remove semantics.

## 5. Consistency invariant

The word/action `СВЯЗАТЬ` may never mean different gestures in different parts of BRAIN.

One source state.
One target state.
One completion CTA.
One BehaviorGraph edge.

Implementation may project Trigger infrastructure differently for mobile readability, but connection semantics and visual feedback remain identical.
