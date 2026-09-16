# ДУМАЙ С ОПАСНОСТЬЮ — PUBLIC RELEASE DECISION v1

Status: **APPROVED LOCAL PRODUCT DECISION**  
Owner decision: **Yauhen**  
Decision date: **2026-09-16**  
Scope: release semantics, completion artifact, continuation and return contract for `/courses/dumai-s-opasnostyu/`.

## Decision

`Думай с опасностью` is a **PUBLIC RELEASE**, not a draft/preview surface.

This decision resolves the ambiguity tracked in Phase 0 issue #203.

It supersedes only the older public-status wording `Status: approved-draft` in `courses/dumai-s-opasnostyu.md`. It does not rewrite the course body, authorial content, Event boundary, Membership model, payment model or database architecture.

The already approved Production Stage 1 remains the implementation baseline:
- public route `/courses/dumai-s-opasnostyu/`;
- web / self-paced;
- deterministic browser-local state;
- no required account for the current course experience;
- no claim of server-side session or real e-mail delivery unless separately implemented and validated.

## Canonical release loop

`THING → COURSE EXPERIENCE → COMPLETION → CERTIFICATE → ONE NEXT THING → RETURN`

### Completion

Completion is explicit. It is not equivalent to opening the last page.

The current course flow already contains:
- verdict;
- exam;
- completed state;
- Danger Map;
- certificate.

Phase 2 must preserve that causal order.

### Certificate

The final certificate is the canonical completion artifact:

**СЕРТИФИКАТ ПОВЫШЕННОЙ ПОДОЗРИТЕЛЬНОСТИ**

Degree copy may remain:
**Опасно думающий гражданин I класса**.

Semantic boundary:

`CERTIFICATE = EVIDENCE OF COURSE COMPLETION`

It is **not**:
- Membership;
- application approval;
- professional qualification;
- licensed credential;
- club rank;
- role;
- permission;
- status ladder;
- access entitlement.

The certificate may be printable/saveable/recoverable, but must not create a parallel identity or membership system.

## Continuation

After certificate/completion, show **one primary honest next action**.

The next action must be selected from current approved Thing/program truth at implementation time.

It must not default to:
- Join;
- Membership;
- Board;
- Catalog;
- generic “learn more”;
- a list of many unrelated links.

Rule:
**ONE COMPLETED VALUE → ONE CLEAR CONTINUATION.**

The continuation target may change over time through programming authority; the course completion meaning must not.

## Return

Return must follow an expected future value.

Allowed return reasons include:
- a real continuation of the selected next Thing;
- meaningful History / Release;
- a genuinely useful follow-up related to the course;
- a new Programming Moment that is worth attention.

Blocked:
- streak;
- unread debt;
- fake urgency;
- FOMO;
- “you have not been here for N days”;
- notifications without payoff;
- endless `СКОРО`.

Rule:
**RETURN FOLLOWS VALUE, NOT DEBT.**

## Product Health questions for Phase 2

Observe only the causal chain required to answer:
1. Did the person actually start the course?
2. Did they make meaningful progress?
3. Did they complete the course?
4. Did they reach/receive the certificate?
5. Did they open the one continuation?
6. Did a later real reason produce a return with payoff?

Candidate semantic events:
- `thing_experience_start`
- `thing_meaningful_progress`
- `thing_experience_complete`
- `completion_artifact_view`
- `continuation_open`
- `return_payoff`

Exact event implementation belongs to the Result and Metrics authority; names may be adjusted if an existing canonical event already owns the same meaning.

## Explicit non-goals

This decision does not approve:
- new CRM;
- server-side course sessions;
- real e-mail delivery;
- AI answer analysis;
- payment;
- Membership gate;
- certificate NFT/token/credential registry;
- leaderboard;
- social sharing requirement;
- automatic recommendation engine.

## Implementation gate

Phase 2 implementation must first inventory the existing course owners and extend them.

Do not rebuild the course shell, certificate, or completion flow in parallel when an existing owner can be extended.
