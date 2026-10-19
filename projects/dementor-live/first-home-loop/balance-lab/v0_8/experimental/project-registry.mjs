// Declarative city project proposals for shadow simulation only.
// A project is never created just because time passed: need, available real
// materials, funded work and an active worker must all be checked.
const signals=Object.freeze({
  CARROT_SPOILAGE:(s,c)=>s.used.CARROT_SPOILED>=c.minSpoiled,
  UNMET_ACTIVE_MEALS:(s,c)=>s.unmetFood>=c.minUnmet,
  UNMET_WILLING_CIVIC_VISITORS:(s,c)=>s.serviceRequestsUnserved>=c.minUnserved,
});
export const REGISTRY=Object.freeze([
  Object.freeze({id:'pantry',signal:'CARROT_SPOILAGE',description:'Extends physical carrot shelf life for all batches',audience:'residents',setting:'pantry',policies:['needs-growth','sponsored-growth'],effect:'SHELF_LIFE'}),
  Object.freeze({id:'irrigation',signal:'UNMET_ACTIVE_MEALS',description:'Increases measured external water inflow; water is booked, not silently minted',audience:'growers',setting:'irrigation',policies:['needs-growth','sponsored-growth'],effect:'WATER_SOURCE'}),
  Object.freeze({id:'communityHall',signal:'UNMET_WILLING_CIVIC_VISITORS',description:'Adds one supported weekly, consented civic event venue',audience:'sponsors',setting:'communityHall',policies:['sponsored-growth'],effect:'ONE_SERVICE_SLOT'}),
  Object.freeze({id:'readingRoom',signal:'UNMET_WILLING_CIVIC_VISITORS',description:'Adds one additional civic event venue',audience:'sponsors',setting:'readingRoom',policies:['sponsored-growth'],effect:'ONE_SERVICE_SLOT'})
]);
export function pendingProjects(s,settings){
  return REGISTRY.filter(p=>p.policies.includes(s.policy)).map(project=>{
    const cost=settings[project.setting];
    if(!cost)throw Error('Project registry cost missing: '+project.id);
    const needed=signals[project.signal](s,cost);
    const built=s.projects.includes(project.id);
    const mature=s.day>=cost.earliestDay;
    const materials=s.wood>=cost.WOOD&&s.stone>=cost.STONE;
    const financed=s.city>=cost.payout;
    return {...project,needed,built,mature,materials,financed,
      cost:{wood:cost.WOOD,stone:cost.STONE,paper:cost.payout},
      eligible:needed&&!built&&mature&&materials&&financed};
  });
}
export function assertRegistry(settings){
  const ids=new Set();
  for(const item of REGISTRY){
    if(ids.has(item.id))throw Error('project ID collides: '+item.id);
    ids.add(item.id);
    if(!signals[item.signal])throw Error('unknown project need: '+item.signal);
    if(!settings[item.setting])throw Error('project unfunded source: '+item.setting);
    if(!['SHELF_LIFE','WATER_SOURCE','ONE_SERVICE_SLOT'].includes(item.effect))
      throw Error('no functional benefit: '+item.id);
    if(!item.policies.length)throw Error('unreachable project: '+item.id);
  }
  return true;
}
