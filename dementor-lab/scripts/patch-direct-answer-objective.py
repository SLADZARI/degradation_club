from pathlib import Path
p=Path('dementor-lab/src/encounter/runtime.mjs')
s=p.read_text()
old="""export function checkTerminal(encounter){
  for(const [side,a] of Object.entries(encounter.actors)){if(a.state.brain>=100)return {type:'BREAKDOWN',reason:'BRAIN',loser:side,turn:encounter.turn};if(a.state.energy<=0)return {type:'BREAKDOWN',reason:'ENERGY',loser:side,turn:encounter.turn};if(a.state.contact<=0&&encounter.scenario.objective==='contact')return {type:'BREAKDOWN',reason:'CONTACT',loser:side,turn:encounter.turn}}
  const limit=encounter.scenario.turnLimit||20;if(encounter.turn>=limit){if(encounter.scenario.objective==='contact'){const relationshipContact=Math.min(encounter.actors.A.state.contact,encounter.actors.B.state.contact);const minContact=Number(encounter.scenario.objectiveRules?.minRelationshipContact??25);return relationshipContact>=minContact?{type:'OBJECTIVE_COMPLETE',reason:'CONTACT',objective:'contact',relationshipContact,turn:encounter.turn}:{type:'OBJECTIVE_FAILED',reason:'CONTACT_LOW',objective:'contact',relationshipContact,turn:encounter.turn}}return {type:'TURN_LIMIT',reason:'LIMIT',turn:encounter.turn}}
  return null;
}"""
new="""function relationshipContact(encounter){return Math.min(encounter.actors.A.state.contact,encounter.actors.B.state.contact)}
function directAnswerProgress(encounter){return encounter.traces.filter(t=>t.actorId==='B'&&t.event?.type==='COUNTERPOINT').length}
export function checkTerminal(encounter){
  for(const [side,a] of Object.entries(encounter.actors)){if(a.state.brain>=100)return {type:'BREAKDOWN',reason:'BRAIN',loser:side,turn:encounter.turn};if(a.state.energy<=0)return {type:'BREAKDOWN',reason:'ENERGY',loser:side,turn:encounter.turn};if(a.state.contact<=0&&encounter.scenario.objective==='contact')return {type:'BREAKDOWN',reason:'CONTACT',loser:side,turn:encounter.turn}}
  const objective=encounter.scenario.objective;
  if(objective==='direct-answer'){
    const answers=directAnswerProgress(encounter),required=Number(encounter.scenario.objectiveRules?.requiredOpponentCounterpoints??2),contact=relationshipContact(encounter),minContact=Number(encounter.scenario.objectiveRules?.minRelationshipContact??25);
    if(answers>=required&&contact>=minContact)return {type:'OBJECTIVE_COMPLETE',reason:'DIRECT_ANSWER',objective:'direct-answer',answers,required,relationshipContact:contact,turn:encounter.turn};
  }
  const limit=encounter.scenario.turnLimit||20;if(encounter.turn>=limit){if(objective==='contact'){const contact=relationshipContact(encounter);const minContact=Number(encounter.scenario.objectiveRules?.minRelationshipContact??25);return contact>=minContact?{type:'OBJECTIVE_COMPLETE',reason:'CONTACT',objective:'contact',relationshipContact:contact,turn:encounter.turn}:{type:'OBJECTIVE_FAILED',reason:'CONTACT_LOW',objective:'contact',relationshipContact:contact,turn:encounter.turn}}if(objective==='direct-answer'){const answers=directAnswerProgress(encounter),required=Number(encounter.scenario.objectiveRules?.requiredOpponentCounterpoints??2),contact=relationshipContact(encounter),minContact=Number(encounter.scenario.objectiveRules?.minRelationshipContact??25);return {type:'OBJECTIVE_FAILED',reason:answers<required?'NO_DIRECT_ANSWER':'CONTACT_LOW',objective:'direct-answer',answers,required,relationshipContact:contact,minRelationshipContact:minContact,turn:encounter.turn}}return {type:'TURN_LIMIT',reason:'LIMIT',turn:encounter.turn}}
  return null;
}"""
if old not in s: raise SystemExit('checkTerminal block not found')
p.write_text(s.replace(old,new))
