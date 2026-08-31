# DC-9 Result — Graph Linked Cards v5

Status: **CURRENT WORKING REFERENCE**  
Approved for further design and implementation work: **2026-08-31**

Source-of-truth presentation contract:
`dementor-club/operations/DC9_RESULT_SYSTEM_V0.1.md`

Reference artifact name:
`dementor-dc9-graph-linked-cards-v5.html`

## Baseline

All further work on `/join/result/` should begin from Graph Linked Cards v5 until an explicitly approved later version replaces it.

Graph Linked Cards v5 defines:

- radar axes indexed `01–09`;
- each axis exposes its final `/5` value;
- strongest visible results may use simple black radar dots;
- legend maps `01–09 → sphere name → score`;
- highlighted legend states may use the acid field;
- no A/B/C markers;
- no redundant sphere numbers inside result cards;
- sphere pictograms replace decorative empty circles;
- card hierarchy: icon → sphere → final level → level name → short editorial line;
- public cards do not expose internal `tagLevels / intent / responsibility / base` by default;
- page order: hero → linked graph → highlighted results → remaining results → dossier → Community;
- mobile must preserve graph meaning, not reduce the radar to an unexplained shape.

This file is an implementation pointer. Diagnostic semantics remain governed by the `dementor-club` source-of-truth documents.