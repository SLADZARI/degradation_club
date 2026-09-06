# Dementor Club — User Journey & Traffic Classification Evidence

Status: **EVIDENCE / OBSERVATION / NON-AUTHORITATIVE**  
Date: **2026-09-06**  
Observed period: **2026-08-31 — 2026-09-06**  
Environment: **PRODUCTION / https://dementor.club**  
Project source: `SLADZARI/degradation_club@dementor-club`  
Primary telemetry source: **GA4 `properties/551957295` / Europe-Warsaw timezone**  
Additional evidence: user-confirmed traffic classification + Supabase auth/profile timestamp reconciliation.

## 0. Purpose

This evidence normalizes production traffic before advertising so team/technical sessions, known test participants and external visitors are not mixed into one acquisition number.

This document is evidence, not semantic authority. It does not change PRODUCT / DOMAIN / ARCHITECTURE / DESIGN or Membership state.

Canonical boundary for interpretation:

`ACTIVITY ≠ PROGRESS ≠ CONTRIBUTION ≠ SPORE AWARD`

WeeklyOS Contribution requires evidence-backed work toward a Result. This file may support a future Contribution record, but it does **not** create a SporeAward or SporeCredit by itself.

## 1. Classification rules used in this pass

### TEAM / TECHNICAL
Known or user-confirmed team activity. Included for QA/development evidence; excluded from external audience/acquisition counts.

### KNOWN TEST TRAFFIC
A known non-team participant intentionally sent to the site to inspect/test a surface. Excluded from external acquisition.

### EXTERNAL / UNCLASSIFIED
Traffic not identified as team or known test traffic. City is an IP-derived GA4 approximation and is not treated as person identity or residence.

## 2. Team / technical traffic

### Warsaw — TEAM / TECHNICAL PROXY
User confirms that a large share of Warsaw activity is technical traffic from Evgeny and Nikita. GA4 does not expose a safe person-level identifier that allows these sessions to be split between them, so no individual session attribution is made.

Observed aggregate for Warsaw, 2026-08-31 — 2026-09-06:

- sessions: **88**
- active users: **13**
- page/screen views: **898**
- user engagement duration: **15,865 sec = 264.4 min ≈ 4 h 24 min**
- engaged sessions: **46**
- `auth_complete`: **22 events / 9 users**
- `join_start`: **51 events / 7 users**
- `course_open`: **21 events / 4 users**
- `merch_open`: **6 events / 2 users**

Interpretation: raw production GA4 totals are heavily dominated by team/development/QA activity and must not be reported as audience demand without classification.

### Malaga — Gabil / TEAM ACTIVITY
User-confirmed identity: **Gabil**.

City aggregate:

- sessions: **3**
- active users: **1**
- views: **17**
- engagement: **640 sec = 10.7 min**
- engaged sessions: **1**
- `join_start`: **1**
- `auth_complete`: **0**

Meaningful 2026-09-04 journey:

`Merch → About → Events → Projects → Community → Projects → About → Home → Join → Events → Home`

The main session produced **16 views**, ~**34m44s session duration** and **640 sec foreground engagement**. This is classified as **TEAM ACTIVITY / exploratory QA**, not external conversion demand.

## 3. Known test traffic

### Minsk — 2026-09-02 — son / KNOWN TEST PARTICIPANT
User confirms that he sent his son a Merch link. This traffic is deliberately excluded from external acquisition.

Observed 2026-09-02 Minsk aggregate:

- sessions: **3**
- GA4 active users: **2** (cookie/user measurement; not interpreted as two people)
- views: **13**
- engagement: **282 sec = 4.7 min**
- engaged sessions: **2**
- `merch_open`: **2**
- `auth_complete`: **0**

Observed journey includes:

`Home → Merch → Community → Merch → Object 001-ne-nado → Merch drop → Join`

Later the same evening a returning visit to the object was observed.

Contribution interpretation:
- son = **test participant**, not team contribution;
- Evgeny sending the Merch link = **promotion/test-distribution evidence candidate**;
- resulting traffic is useful product evidence but does not create Spores automatically.

## 4. External / unclassified traffic after cleanup

### Belarus — Brest — 2026-09-05 — meaningful external conversion candidate

- sessions: **1**
- views: **13**
- engagement: **321 sec = 5.35 min**
- `auth_complete`: **1**
- `course_open`: **7**
- `event_open`: **2**

Observed journey:

`Home → Community → Думай с опасностью → Не команда → Community → Fuengirola → Community → Деньги на ветер → Google Auth → Деньги на ветер → Nikita → Projects`

At **10:29 Europe/Warsaw**, the only non-Warsaw `auth_complete` in the period aligns with the creation timestamp of the newest Supabase profile. This is a **high-confidence journey match**, not a direct GA4 identity join.

### Belarus — Minsk — 2026-09-04 — UNCLASSIFIED

This is separate from the known son traffic: different date, desktop device and route.

- sessions: **1**
- views: **2**
- engagement: **32 sec**
- session duration: ~**119 sec**
- route: `Home → Думай с опасностью`
- `auth_complete`: **0**

Keep as an external/unclassified Belarus candidate until additional evidence identifies it.

### United States — New York — 2026-09-03 — low-signal external

- source: `google / organic`
- device: mobile
- new visitor
- sessions: **1**
- views: **1**
- engagement: **1 sec**
- no conversion event

Interpretation: external organic arrival, effectively a bounce; do not treat as meaningful demand.

## 5. Clean comparison

| Bucket | Sessions | Views | Engagement | Join start | Auth complete | Classification |
|---|---:|---:|---:|---:|---:|---|
| Warsaw | 88 | 898 | 264.4 min | 51 | 22 | TEAM / TECHNICAL PROXY |
| Malaga / Gabil | 3 | 17 | 10.7 min | 1 | 0 | TEAM ACTIVITY |
| Minsk 02 Sep / son | 3 | 13 | 4.7 min | 0 | 0 | KNOWN TEST TRAFFIC |
| Brest | 1 | 13 | 5.35 min | 0* | 1 | EXTERNAL / meaningful |
| Minsk 04 Sep | 1 | 2 | 0.53 min | 0 | 0 | EXTERNAL / unclassified |
| New York | 1 | 1 | 0.02 min | 0 | 0 | EXTERNAL / bounce |

`*` The Brest auth trigger did not emit `auth_start`/`join_start`; the observable chain is course interaction → Google callback → `auth_complete`.

External residual after removing Warsaw, Malaga/Gabil and known son traffic:

- sessions: **3**
- views: **16**
- engagement: **354 sec = 5.9 min**
- `auth_complete`: **1**

Meaningful external residual excluding the 1-second New York bounce:

- Brest + Minsk 04 Sep = **2 sessions / 15 views / 353 sec engagement / 1 auth_complete**.

## 6. Contribution evidence candidates

These are evidence candidates only. No personal SporeAward/SporeCredit is created by this document.

### Evgeny + Nikita — QA / DEVELOPMENT
Evidence:
- Warsaw technical proxy dominates production usage during the pre-advertising QA period;
- canonical QA ledger records sustained browser/auth/shell/release testing and development activity;
- person-level GA session split is unavailable, therefore no numeric individual traffic attribution is asserted.

Candidate contribution kind: `QA + DEVELOPMENT`.

### Gabil — EXPLORATORY QA / TEAM ACTIVITY
Evidence:
- user-confirmed Malaga identity;
- 3 sessions / 17 views / 640 sec engagement;
- broad traversal of Merch/About/Events/Projects/Community/Join;
- one `join_start` without auth completion.

Candidate contribution kind: `EXPLORATORY QA`.

### Evgeny — PROMOTION / TEST DISTRIBUTION
Evidence:
- user explicitly confirms sending the Merch link to his son;
- known test traffic then produced 3 sessions / 13 views / 282 sec engagement and reached Join.

Candidate contribution kind: `PROMOTION / TEST DISTRIBUTION`.

### Son — TEST PARTICIPANT
Evidence is retained as product/test evidence but is not team Contribution by default.

## 7. Measurement / QA findings

### Analytics noise
Raw GA4 production totals are not usable as external-acquisition KPIs while known team/technical traffic is not separated.

Recommended measurement change: introduce a governed internal/team traffic classification mechanism before paid advertising, without adding person-level analytics identity.

### Auth telemetry privacy
Observed GA4 callback URLs include OAuth authorization `code` in `pagePathPlusQueryString`.

Required QA follow-up:

`strip sensitive auth callback query → keep safe auth_complete → emit auth_start with source/placement on every auth surface`

This is a QA finding only. No runtime implementation or deployment is performed by this evidence commit.

## 8. Evidence caveats

- GA4 city is derived from network/IP and can be wrong due to VPN, ISP routing or mobile networks.
- GA4 sessions/users can fragment around redirects/auth callbacks and attribution changes.
- consent requirements mean GA4 is not a complete census of all site activity.
- user-confirmed classification takes precedence for known team/test traffic in this evidence pass.
- no individual Warsaw session counts are assigned to Evgeny or Nikita.
- `auth_complete` does not mean Membership; canonical boundary remains `AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`.

## 9. Follow-up

1. Keep a classified traffic evidence snapshot during pre-advertising QA and after launch.
2. Exclude/label team and known test activity in reporting.
3. Add safe auth-start telemetry and strip sensitive callback query parameters.
4. Tie future Contribution/Spores only to a governed Result with evidence; do not award from traffic/tool activity alone.
