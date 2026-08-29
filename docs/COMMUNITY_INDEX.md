# Dementor Club — Community Index

STATUS: WORKING STRUCTURE / APPROVED BOUNDARY  
DATE: 2026-08-28  
Updated: 2026-08-30  
SOURCE OF TRUTH: `dementor-club`  
PUBLIC ROUTE: `/community/`

## Role

`/community/` is the single root/index page for Community inside the Dementor Club ecosystem.

Do not create a parallel Community root page. New approved Community entities should be added to this index or linked from it.

## Current public entity groups

The current site implementation already exposes these Community-facing groups:

- Dementors / public roster;
- current activity;
- club spheres/profile system;
- Community membership-system status.

The page may connect people to approved courses, practices, events and projects.

## Approved Community participation v1

The first approved closed-Community participation mechanic is defined in:

`community/MEMBER_ENTRY_AND_ARTIFACT_FLOW_V1.md`

Core approved distinctions:

- authenticated User ≠ Member;
- Member ≠ Dementor;
- Community membership v1 becomes available after completion of all 9 sphere onboardings plus required identity/legal gates;
- v1 membership activates automatically when those gates are satisfied;
- a newly admitted Member receives one first Artifact slot;
- the first implemented Artifact form is a Community notice / `type = notice`;
- first-entry Community activation is completed after the Member publishes the first Artifact;
- Member Artifacts are closed-Community content by default;
- Artifact reactions/responses may create activity but do not automatically create an Event, Course, Project or Dementor role.

The authenticated Board is a Community surface under this root, not a second Community root. Recommended implementation route:

`/community/board/`

## Boundary

Community presentation must not invent mechanics beyond approved source-of-truth records.

Specifically, do not invent or silently expand:

- membership mechanics beyond v1;
- additional access rules;
- paid membership/access;
- participant role hierarchy;
- automatic Dementor status;
- Artifact reward/slot economy beyond the initial approved slot;
- automatic Artifact promotion;
- public Community Board access;
- unapproved Telegram/channel rules;
- pricing;
- rituals beyond the approved first-Artifact entry mechanic;
- approval/status mechanics not defined by source-of-truth.

If a mechanic is not approved, the public/site surface must present it as unavailable/in development or omit it rather than imply it exists.

## Home entry

The approved Home Community block routes directly to this page:

`Home → COMMUNITY / PEOPLE / ACTIVITY → /community/`

Visual implementation contract is documented separately in `docs/COMMUNITY_HOME_BLOCK.md`.

## Approved/future entity model

Community records may now include the approved base entity:

- **Artifact** — a persistent Member/Club contribution record; first implementation form is `notice`.

Existing/future Community relations may include:

- person / Member;
- person / Dementor;
- Artifact;
- activity / practice;
- related event;
- related project;
- approved participation format;
- archive/result record.

Every record must retain its factual status and provenance. Internal ideas are not public entities.

An Artifact can later become source/evidence for another approved entity, but promotion must be explicit and the original Artifact must retain its identity and provenance.
