# v0.10.1 feature integration matrix
| Mechanic | v0.10 LAB | Current live game source RC2 | v0.10.1 integration |
| --- | --- | --- | --- |
| PAPER cash, players, individual plots | Simulated | Real CityNetwork | **READ-ONLY aggregate connected** |
| City construction, forge, bridge, seed shop, garden | Simulated | Real city projects | **READ-ONLY stage totals connected** |
| Real warehouse, paper resources, courier cargo | v0.9 demo | Real warehouse/courier | **READ-ONLY by custody connected** |
| NPC_Worker/mayor hired job, finite escrow | v0.9.1 demo | Different game mechanics, not validated | **NOT INTEGRATED** |
| CIVIC estates, shops and rent | registry | RC2 runtime | **READ-ONLY shop till/stock/plots connected** |
| UNIVERSE Ideas Forest/MentalHumor | map passports | isolated branches | **NOT MERGED IN GAME** |
| Gabel 6 areas, 5000 USD founded town | design passport | unrelated actual createCity mechanism | **NOT IMPLEMENTED** |
| PvE, cave, fishing, telephone UI | roadmap passports | independent draft/runtime features | **NOT ADDED BY BRIDGE** |
| Full end-to-end human route + iPhone Safari | not in simulator | partial browser evidence | **PENDING** |
| Copy-level live save compatibility | synthetic test copy | immutable volume on VM | **PENDING LIVE COPY** |

**Never infer deployment from a green synthetic workflow.** New bridge is an optional GET-only interface on a staged branch.
