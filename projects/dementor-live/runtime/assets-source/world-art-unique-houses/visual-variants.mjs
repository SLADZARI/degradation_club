// Dementor Live ISO30 artwork lookup only. No gameplay/state writes.
// Origin plots 1..8 receive one unique facade each. Other city IDs rotate
// the same eight designs deterministically, preserving visual continuity.
const count=8;
export function stableHash(value){
 let h=2166136261;
 for(const ch of String(value)){h^=ch.codePointAt(0);h=Math.imul(h,16777619);}
 return h>>>0;
}
export function stablePlotTentVariant(cityId,plotId){
 const n=/^plot-(\d+)$/.exec(String(plotId));
 const idx=n?(Number(n[1])-1)%count:stableHash(plotId)%count;
 const offset=(cityId==='origin')?0:stableHash(cityId)%count;
 return 1+(idx+offset)%count;
}
export function candidateTentSVG(cityId,plotId){
 return `plot-personal-tent-plot-${stablePlotTentVariant(cityId,plotId)}.svg`;
}
export const STATUS='CANDIDATE_DO_NOT_REPLACE_RUNTIME_WITHOUT_ART_G6';
