# ДУМАЙ С ОПАСНОСТЬЮ — RELEASE LOOP V1 · G8 CLOSURE EVIDENCE

Status: **APPROVED_EVIDENCE / G8 CLOSED**  
Date: **2026-09-16**  
Result: `dementor-club.result.dumai-s-opasnostyu-release-loop-v1`

## Release chain

Validated candidate:
`bc36c67b17e37e9dd718298d08e971b78e39d242`

G6:
- PR: **#212**
- Site Integrity: **#1194**
- run id: `35075627995`
- conclusion: **SUCCESS**

Production merge:
- commit: `88a5efdb92a7a30678c5fcc74f02de7886c46d65`
- previous production parent: `48a18b5567804d29219efcea217b846f1ebdd675`
- exact candidate parent: `bc36c67b17e37e9dd718298d08e971b78e39d242`
- ancestry: **VERIFIED**

Manual production deploy:
- workflow: **Deploy Dementor Production #86**
- run id: `35084248203`
- event: `workflow_dispatch`
- conclusion: **SUCCESS**
- build checkout: `dementor-club-production@88a5efdb92a7a30678c5fcc74f02de7886c46d65`
- Pages artifact: `10441805262`
- artifact digest: `sha256:695da304d6bfb1cef59c3eb3ebeb5f147a55178c8cda77a3f6c5661c2bfed743`
- deploy job: **SUCCESS**
- Pages deployment reported success for `dementor.club`

Production branch was rechecked after deploy and still pointed to:
`88a5efdb92a7a30678c5fcc74f02de7886c46d65`.

## Live sequential retest

Project owner performed the live sequential loop on `dementor.club` after deploy and explicitly reported:

`live loop прошёл`

This is recorded as:
`PASS_OWNER_SEQUENTIAL_2026-09-16`.

The live acceptance covered the Phase 2 product path requested before G8 closure:
- public DSO entry without mandatory login;
- sequential course progression;
- explicit completion;
- certificate surface;
- exactly one primary continuation to `Деньги на ветер`;
- continuation route opening;
- completed-user revisit without false same-version `НОВОЕ ПРОДОЛЖЕНИЕ`;
- mobile final-surface sanity.

## Semantic invariants preserved

- `Думай с опасностью` is a PUBLIC RELEASE.
- Certificate is course-completion evidence only.
- Certificate does not create Membership, qualification, role, rank, permission or access.
- Continuation v1 is `program:dengi-na-veter` → `/courses/dengi-na-veter/`.
- First continuation exposure is not Return.
- Same-version revisit is not Return.
- Elapsed time alone is not Return.
- `return_payoff` requires a later approved continuation-version delta.
- Existing production analytics runtime remains the sole analytics owner.
- No new DB/schema, Supabase course-session model, CRM, recommendation engine or parallel runtime was introduced.

## Cleanup / ownership

No temporary Phase 2 runtime owner was introduced. The Result extended existing canonical course, site-config and analytics owners. The historical integration branch is retired from active semantic ownership after closure.

The validation corrective remains an explicit lesson from this Result: sequential G6 found a pre-existing shared-owner semantic drift (mandatory auth/server sync for a browser-local public release), and the canonical owner was corrected rather than weakening the test.

No unrelated WAITING Board Result is closed by this evidence.

## Closure

Phase 2 is **RELEASED / LIVE-VALIDATED / G8 CLOSED**.

This closure supplies the second live product proof for the broader Thing pattern, but it does **not** automatically approve Phase 3 or `ThingProjection Runtime v1`. Any extraction remains a separate future Result/decision after canonical entry review.
