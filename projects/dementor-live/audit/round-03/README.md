# DEMENTOR LIVE — GLOBAL AUDIT ROUND 03 / START HERE
17 October 2026 | Status: SIMULATED / CALCULATED / PROPOSALS FOR GDD v0.2. Source GDD v0.1 and GA-01/02 are immutable in their branches.
GitHub: https://github.com/SLADZARI/degradation_club/tree/docs/dementor-live-global-audit-03/projects/dementor-live/audit/round-03
Drive: https://drive.google.com/drive/folders/1q-gjPDB4s9Na0IgWdmN2OZZmH1UEGqK1
IMPORTANT: DEMENTOR LIVE is separate 2D project; do not mix with Dementor Battle and Robo Games.

## Findings and first review
1. City funds liquidity is sensitive to ordering. 20 same-time onboarding with 10,000 PAPER treasury succeeded 20/20. 100 same-time with10k =>0/100 complete because up-front payments use available funds before land sale receipts. 100 same-time with50k=>100/100; 100 sequential with10k=>100/100. This is a Toy Design model, not actual observed game. First tutorial starter kit 6 WOOD +4 PAPER_SHEET is physically debited; insufficient kits cause hard-block even with funds.
2. First home cash20 PAPER cannot cover TEST first HEMP cycle operating expenses37 PAPER (16 seeds+8 water+8 test maintenance+5 test delivery) → liquidity shortage17 PAPER before first sale; workshop and other equipment not included.
3. Shared city water120 L/hour applies to CITY DISTRICT TRUNK, not per farm. Water model CITY total first-day sheets for 1/4/20/100 concurrent farms:744/1752/1920/3000. At100 farms, initial 40L tank each =4,000L stored initial stock; CITY input over day2,878L, within head capacity2,880L. Water-only model intentionally ignores finance/inventory/seed purchase and cannot be summed with Round02 finite market runs.
4. Hypothetical CAPEX 0/120/300/600/1000 PAPER merely tests payback *relative to GA-02 mature farm scenario wallet500*, not affording machinery after first house and not actual ROI.
5. OPEN crosscheck CC-046..052 (7 new) added to previous CC-001..045; 52 items are design conflicts/questions/tests, NOT 52 proven runtime bugs.

## Documents and reproducible calculation sources
- GLOBAL_AUDIT_ROUND_03_REPORT.md (Drive readable: https://docs.google.com/document/d/11OpjpodbU_XifjU3_INedGxqWW0JpEvPzZceKYhMEDY/edit)
- onboarding_treasury_model.js + onboarding_treasury_results.json: 8 independent scenario fixtures / 56 invariant checks all PASS in JS toy simulation.
- shared_city_water_model.js + shared_city_water_results.json: 16 scenario fixtures / 112 invariant checks PASS and exact offline checkpoint replay equality.
- capex_opex_sensitivity_results.json: conditional cash-flow and cost/ROI sensitivity.
- ISSUES_CC_046_052.md (Drive readable: https://docs.google.com/document/d/1xo2NypX687dmbQjyPnorLOOwmuB3PJcOdJRKNBuR0Z4/edit)
- GDD_v0_2_TREASURY_WATER_PATCH_CANDIDATE.md (Drive readable: https://docs.google.com/document/d/11FLr6FXjmk-oADk92WmeqMCcIGLl3v1lbVI90qH0ZkM/edit)

## Evidence boundary / What GA-03 did not validate
No execution of actual DEMENTOR LIVE game runtime, Supabase/PostgreSQL transactions, mobile controls, SVG hero, or true multiplayer.
City ledger, water and economic market are separate independent fixture models; no claim of full integrated system simulation.
Business startup tools, industrial kit prices and physical building asset construction are not approved numbers, so a real business payback/EBITDA cannot yet be estimated credibly.
Full source 27 long-form GDD chapters are still in chat, the externally stored Master is the consolidated structured summary. Full verbatim archive not created.
Proposals have no APPROVED status; preserve original user decisions and character-first visual production gate.

## Next work — GA-04
A. Combine treasury, one-time city starter kits, first home, first production and city buy orders with shared water in a single finite ledger and 1/20/100-player stress test, 1/7/30-day horizon.
B. Review money mint/burn/treasury policy and material fiber origin / paper split with user; not silently approve.
C. Add real economic costs catalog and cash feasibility, not merely arbitrary paper CAPEX parameters.
D. Generate comprehensive per-domain canonical 27-chapter v0.2 candidate with source references, invariants, acceptance and change provenance; preserve edits in new branch.
E. Only test game runtime after canonical SVG hero and 2D character gate and after executable game integration exists.
