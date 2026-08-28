# MEMBERSHIP APPLICATION & DC-9 PUBLIC FLOW v0.1

Status: APPROVED PRODUCT CONTRACT / IMPLEMENTED IN SITE
Date: 2026-08-28

## 1. Boundary

Authentication is not membership.

A person may browse the public Dementor Club site and complete DC-9 without membership.

DC-9 result may exist locally before authentication. Authentication is required when the person wants the result to be persisted to their account and restored cross-device.

A membership application is a separate authenticated action.

Flow:

PUBLIC VISITOR
→ DC-9
→ LOCAL RESULT
→ optional AUTH / SAVE TO PROFILE
→ AUTHENTICATED GUEST
→ MEMBERSHIP APPLICATION
→ REVIEW
→ CLUB MEMBERSHIP only after a separate confirmed decision.

No application creates `dc_system_memberships` automatically.

## 2. DC-9 selector semantics

The nine cards are a persistent map, not a set of hover-only states.

- acid/yellow card = sphere not completed;
- paper/white card = sphere completed;
- hover/focus must never invert or change the semantic completion state;
- completed card shows latest level 0–5, date and `РЕЗУЛЬТАТ →`;
- result can be expanded without starting a new test;
- repeat assessment is a separate action;
- unauthenticated result can be saved by signing in; local state is then synchronized through the existing assessment sync layer.

`assessment_runs` / `assessment_snapshots` remain the canonical account-bound source for DC-9 history.

## 3. Membership application

Route: `/join/apply/`

Application requires an authenticated Supabase user. Anonymous INSERT is forbidden.

Minimum application fields:

- first name;
- last name;
- short self-description;
- social/profile/site URL;
- optional reason for joining;
- interest distribution across the nine canonical DC-9 spheres.

The application is stored in existing `join_applications`.

Structured payload lives in `answers` JSONB and must not be copied into neutral `profiles` as role/membership fields.

## 4. Interest distribution mechanism

Canonical copy:

**РЕГРЕСС ОГРАНИЧЕН.**
**РАСПРЕДЕЛИТЕ БЕЗОТВЕТСТВЕННО.**

The person has one fixed 100% budget distributed across all nine spheres.

The nine horizontal controls are coupled:

- increasing one sphere proportionally compresses the remaining eight;
- decreasing one sphere proportionally releases budget to the remaining eight;
- total always equals exactly 100%;
- this map represents INTEREST / DIRECTION OF ATTENTION, not current DC-9 level;
- it must never modify assessment results automatically.

This creates two separate nine-dimensional maps:

1. DC-9 FACT MAP — what is currently measured;
2. INTEREST MAP — where the applicant wants to move.

They may later support recommendations, but no recommendation implies membership, Dementor status, ownership or permission.

## 5. Security

`join_applications`:

- anonymous insert removed;
- authenticated INSERT requires `profile_id = auth.uid()`;
- own-user SELECT only;
- one active `submitted` application per profile;
- review / approval remains a separate administrative operation.

## 6. Related programs

Related Dementor programs may appear inside an expanded DC-9 result as a next practice.

A related program is a recommendation relation only.

It does not automatically increase DC-9 level and does not imply ownership, authorship, membership or role assignment.
