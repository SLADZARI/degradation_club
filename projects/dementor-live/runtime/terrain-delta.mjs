// Per-SSE-connection append-only landscape diff. The save itself stays the v1 tile array.
// Snapshot and client SSE payload are separate: never mutate the authoritative world.
export function packTerrainSse(snapshot,previous=null){
  const tiles=snapshot.landscape?.tiles;
  const city=snapshot.cityNetwork?.current||'origin';
  if(!Array.isArray(tiles))return {snapshot,cursor:null};
  const revision=snapshot.landscape.revision||0;
  const cursor={city,count:tiles.length,revision};
  if(!previous||previous.city!==city||previous.count>tiles.length||
    (previous.count===tiles.length&&previous.revision!==revision)){
    return {snapshot,cursor};
  }
  const delta=tiles.slice(previous.count);
  const payload={...snapshot,landscape:{...snapshot.landscape}};
  delete payload.landscape.tiles;
  payload.landscapeDelta={from:previous.count,to:tiles.length,tiles:delta,city};
  return {snapshot:payload,cursor};
}
// Client helper for reconciliation, equally useful for deterministic tests.
export function reconcileTerrain(previous,next){
  if(!next.landscapeDelta)return next;
  const d=next.landscapeDelta,prior=previous?.landscape?.tiles,city=previous?.cityNetwork?.current||'origin';
  if(!Array.isArray(prior)||d.city!==city||prior.length!==d.from)return null;
  const merged={...next,landscape:{...next.landscape,tiles:prior.concat(d.tiles)}};
  if(merged.landscape.tiles.length!==d.to)return null;
  delete merged.landscapeDelta;
  return merged;
}
