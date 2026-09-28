import fs from 'node:fs';
import path from 'node:path';

const failures=[];
const expect=(ok,message)=>{if(!ok)failures.push(message)};
const read=file=>fs.readFileSync(file,'utf8');

const model=read('community/board/board-entity-model-v1.js');
const integrations=read('community/board/board-integrations-v1.js');
const runtime=read('community/board/board-relations-v1.js');
const css=read('community/board/board-relations-v1.css');
const html=read('workspace/board/index.html');

// Board-local identity remains unchanged; relation identity is additive only.
expect(model.includes("id:`entity:${entity.id}`"),'entity projection id=entity:<uuid> was changed');
expect(model.includes('sourceId:entity.id'),'entity projection sourceId must remain dc_entities UUID');
expect(model.includes("relationKind:isEvent?'event':isProgram?'program':null"),'Event/Program relationKind projection missing');
expect(model.includes("relationSourceId:(isEvent||isProgram)?entity.slug:null"),'Event/Program canonical slug relationSourceId missing');
expect(model.includes("const kind=isEvent?'event':programType==='course'?'course':programType==='practice'?'practice':isProgram?'program':entityType"),'Course/Practice presentation type mapping drifted');

expect(integrations.includes('data-source-id="${esc(item.sourceId)}"'),'data-source-id must remain Board-local source UUID');
expect(integrations.includes('data-relation-kind="${esc(item.relationKind)}"'),'projection relation kind DOM attribute missing');
expect(integrations.includes('data-relation-source-id="${esc(item.relationSourceId)}"'),'projection relation source DOM attribute missing');
expect(integrations.includes("card.dataset.relationKind='artifact'"),'Artifact relation kind mapping missing');
expect(integrations.includes("card.dataset.relationSourceId=card.dataset.artifact||''"),'Artifact relationSourceId must be canonical Artifact UUID');

// One Board runtime owner, one read truth.
const boardDir='community/board';
const boardJs=fs.readdirSync(boardDir).filter(name=>name.endsWith('.js')).map(name=>({name,text:read(path.join(boardDir,name))}));
const readOwners=boardJs.filter(file=>file.text.includes("dc_board_relations_read_v1"));
expect(readOwners.length===1&&readOwners[0].name==='board-relations-v1.js',`relation read RPC must have one Board owner; found ${readOwners.map(x=>x.name).join(', ')}`);
expect((runtime.match(/dc_board_relations_read_v1/g)||[]).length===1,'runtime must call canonical read RPC in exactly one function');
expect(runtime.includes("client.rpc('dc_board_relation_create_v1'"),'create RPC owner missing');
expect(runtime.includes("client.rpc('dc_board_relation_delete_v1'"),'delete RPC owner missing');
expect(!runtime.includes("from('dc_board_relations')")&&!runtime.includes('from("dc_board_relations")'),'direct relation table client access is forbidden');
expect(!runtime.includes('localStorage')&&!runtime.includes('sessionStorage'),'local/session storage relation truth is forbidden');
expect(!runtime.includes('PARTICIPATES_IN'),'PARTICIPATES_IN must not be synthesized or persisted by runtime');

// Supported endpoint/type matrix stays closed.
expect(runtime.includes("const RELATION_TYPES=Object.freeze(['RELATED_TO','RESULT_OF','CONTINUES','ABOUT','REPORT_OF'])"),'runtime persisted relation type allow-list drifted');
expect(runtime.includes("const RELATION_KINDS=Object.freeze(['artifact','event','program'])"),'runtime endpoint allow-list drifted');
expect(runtime.includes("if(type==='RESULT_OF')return targetKind==='artifact'"),'RESULT_OF pair contract drifted');
expect(runtime.includes("if(type==='CONTINUES')return originKind===targetKind"),'CONTINUES pair contract drifted');
expect(runtime.includes("if(type==='ABOUT')return originKind==='artifact'"),'ABOUT pair contract drifted');
expect(runtime.includes("if(type==='REPORT_OF')return originKind==='artifact'&&['event','program'].includes(targetKind)"),'REPORT_OF pair contract drifted');

// UI permission mirror must be narrow and server remains final authority.
expect(runtime.includes("resolveBoardUserState"),'canonical Board user-state owner not reused');
expect(runtime.includes("client.from('dc_entity_assignments')"),'exact scoped entity assignment mirror missing');
expect(runtime.includes(".eq('role','dementor')"),'scoped assignment query is not role=dementor');
expect(runtime.includes("row.provenance_status==='confirmed'"),'scoped assignment confirmed provenance mirror missing');
expect(runtime.includes("systemDementor"),'system Dementor mirror missing');
expect(!runtime.includes('dc_can_read_entity'),'read helper must not authorize relation mutation UX');
function functionBody(source,name){
  const marker=`function ${name}(`;const start=source.indexOf(marker);
  expect(start>=0,`${name} permission helper missing`);if(start<0)return'';
  const brace=source.indexOf('{',start);if(brace<0){expect(false,`${name} body missing`);return''}
  let depth=0;
  for(let i=brace;i<source.length;i++){
    if(source[i]==='{')depth++;
    else if(source[i]==='}'){depth--;if(depth===0)return source.slice(brace+1,i)}
  }
  expect(false,`${name} body is unbalanced`);return'';
}
const compact=value=>String(value||'').replace(/\s+/g,'');
const createChoiceBody=compact(functionBody(runtime,'canCreateChoice'));
const joinedIdeaBody=compact(functionBody(runtime,'joinedIdeaEndpoint'));
const candidateChoicesBody=compact(functionBody(runtime,'candidateChoices'));
const createRelationBody=compact(functionBody(runtime,'createRelation'));
const deleteRowBody=compact(functionBody(runtime,'canDeleteRow'));

// Canonical permission semantics remain explicit inside one helper:
// RELATED_TO is manage-either, every directional relation is origin-only.
expect(
  createChoiceBody.includes("constcanonical=type==='RELATED_TO'?canManageEndpoint(origin)||canManageEndpoint(target):canManageEndpoint(origin);"),
  'canCreateChoice canonical branch no longer proves RELATED_TO manage-either + directional origin-only semantics'
);
expect(
  createChoiceBody.includes('if(canonical)returntrue;'),
  'canCreateChoice canonical authority must short-circuit before participant extension'
);

// Artifact Collaboration widens creation only for RELATED_TO and only through joinedIdeaEndpoint.
expect(
  createChoiceBody.includes("returntype==='RELATED_TO'&&(joinedIdeaEndpoint(origin)||joinedIdeaEndpoint(target));"),
  'participant extension must be RELATED_TO-only and scoped to joinedIdeaEndpoint'
);
expect(
  !createChoiceBody.includes("RESULT_OF")&&!createChoiceBody.includes("CONTINUES")&&!createChoiceBody.includes("ABOUT")&&!createChoiceBody.includes("REPORT_OF"),
  'participant extension must not widen directional relation types'
);
expect(
  joinedIdeaBody.includes("endpoint?.kind==='artifact'"),
  'participant relation extension must require artifact endpoint'
);
expect(
  joinedIdeaBody.includes("endpoint.card?.dataset.artifactSubtype==='idea'"),
  'participant relation extension must require artifact_type=idea'
);
expect(
  joinedIdeaBody.includes("endpoint.card?.dataset.collabMyState==='JOINED'"),
  'participant relation extension must require JOINED state'
);

// Both chooser and mutation mirror must go through the same structural permission helper.
expect(
  candidateChoicesBody.includes('if(!canCreateChoice(type,endpoint,target))continue;'),
  'candidateChoices must use canCreateChoice permission contract'
);
expect(
  createRelationBody.includes('constmirrored=canCreateChoice(choice.type,endpoint,target);'),
  'createRelation must re-check canCreateChoice before RPC'
);

// Delete presentation must consume only the server-authoritative capability
// projected by dc_board_relations_read_v1().
expect(
  deleteRowBody.includes("returnrow?.can_delete===true;"),
  'relation delete UI must require row.can_delete === true'
);
expect(
  !deleteRowBody.includes('canManageEndpoint')
  &&!deleteRowBody.includes('joinedIdeaEndpoint')
  &&!deleteRowBody.includes('canCreateChoice')
  &&!deleteRowBody.includes('created_by'),
  'relation delete UI must not infer permission from local ownership, JOINED state, creator or create authority'
);
expect(
  runtime.includes('const canDelete=canDeleteRow(row);'),
  'relation row rendering must consume canDeleteRow(row) without endpoint-manager fallback'
);
expect(
  runtime.includes("if(!row||!canDeleteRow(row)){setRelationStatus(statusRoot,'НЕТ ПРАВ / UI MIRROR','error');return}"),
  'delete mutation entry must fail closed unless current relation row has server-authoritative can_delete=true'
);

// Endpoint ontology remains closed and Person is not introduced.
expect(
  runtime.includes("const RELATION_KINDS=Object.freeze(['artifact','event','program'])"),
  'relation endpoint ontology must remain artifact/event/program'
);
expect(
  !/RELATION_KINDS[^\n]*person|relationKind[^\n]*person|relationSourceId[^\n]*person/i.test(runtime),
  'Person relation endpoint detected'
);

// Fail-closed backend-unavailable behavior.
expect(runtime.includes("document.documentElement.dataset.dcBoardRelations='unavailable'"),'RPC unavailable state marker missing');
expect(runtime.includes('Board continues without relation truth'),'non-destructive unavailable path missing');
expect(runtime.includes('relationRows=null'),'unavailable state must remain unknown, not fake empty truth');
expect(runtime.includes("if(!backendAvailable){clearBlocks(boardHost)"),'unavailable state must remove relation presentation');

// Canvas is presentation over existing coordinates/events, not a second layout owner.
for(const eventName of ['dc:board-projections-updated','dc:board-layout-updated','dc:board-layout-request','dc:board-filter-changed','dc:board-spatial-ready']){
  expect(runtime.includes(eventName),`relation presentation does not observe existing Board event: ${eventName}`);
}
expect(runtime.includes("attributeFilter:['style','hidden','class','data-relation-kind','data-relation-source-id']"),'drag/style/filter observer contract missing');
expect(runtime.includes("parseFloat(card.style.left)")&&runtime.includes("parseFloat(card.style.top)"),'relation lines do not project existing card coordinates');
expect(runtime.includes("const existingLines=new Map([...svg.querySelectorAll('.dc-board-relation-line')]")&&runtime.includes("let line=existingLines.get(row.relation_id)"),'relation canvas must reconcile existing SVG nodes instead of rebuilding them on every spatial update');
expect(!runtime.includes("svg.querySelectorAll('.dc-board-relation-line').forEach(node=>node.remove())"),'relation canvas rebuilds every line on drag/layout and can wake unrelated childList owners');
expect(css.includes('.dc-board-relation-line[hidden]{display:none}'),'filtered/hidden relation line presentation contract missing');
expect(!runtime.includes('dc_artifact_board_positions'),'relation runtime must not own/persist spatial coordinates');
expect(!runtime.includes('deterministicPlatformPosition')&&!runtime.includes('fallbackMemberPosition'),'relation runtime contains a parallel layout engine');
expect(runtime.includes("card.hidden||card.classList.contains('dc-board-filtered')"),'hidden/filtered endpoint line suppression missing');

// Detail integration extends existing card/Artifact overlay surfaces; no parallel shell.
expect(runtime.includes("card.querySelector(':scope > [data-relation-block]')"),'canonical card relation block integration missing');
expect(runtime.includes("document.querySelector('.dc-artifact-overlay:not([hidden])')"),'existing Artifact overlay state is not reused');
expect(runtime.includes("overlay?.querySelector('iframe')"),'existing Artifact iframe/detail owner is not reused');
expect(runtime.includes("overlay?.querySelector('.dc-artifact-overlay__panel')"),'existing Artifact overlay panel is not reused');
expect(runtime.includes("host.dataset.relationDetailHost='1'")&&runtime.includes('panel.appendChild(host)'),'relation detail block is not mounted inside canonical Artifact overlay panel');
expect(css.includes('.dc-board-relation-detail-host'),'Artifact overlay relation block presentation missing');
for(const forbidden of ['createElement(\'dialog\')','relation-modal','relation-drawer','relation-overlay']){
  expect(!runtime.includes(forbidden),`parallel relation detail shell detected: ${forbidden}`);
}

// Workspace wiring and minimal CSS only.
expect((html.match(/board-relations-v1\.js/g)||[]).length===1,'workspace must load one relation runtime owner');
expect((html.match(/board-relations-v1\.css/g)||[]).length===1,'workspace must load one relation stylesheet');
expect(css.includes('.dc-board-relations-layer'),'relation line CSS missing');
expect(css.includes('.dc-board-relations-block'),'relation block CSS missing');
expect(css.includes('.dc-board-relation-form'),'relation controls CSS missing');
expect(css.includes(':has(> .dc-board-relations-block[open])')&&css.includes('max-height:none!important')&&css.includes('overflow:visible!important'),'expanded relation controls can be clipped by canonical Board card max-height');
expect(runtime.includes("block.addEventListener('toggle',()=>schedulePresentation())"),'relation line presentation does not refresh when inline relation detail expands/collapses');

// Protected files remain semantically unhooked from Board Relations.
for(const protectedFile of ['thing-projection-v1.js','dementor-relations-v1.js']){
  const matches=[];
  const walk=dir=>{
    for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
      const full=path.join(dir,entry.name);
      if(entry.isDirectory())walk(full);
      else if(entry.name===protectedFile)matches.push(full);
    }
  };
  walk('.');
  for(const file of matches){
    const text=read(file);
    expect(!text.includes('dc_board_relations_read_v1'),`${file} became a second Board relation read owner`);
  }
}

if(failures.length){
  console.error('Board Relations v1 runtime contract FAILED');
  for(const failure of failures)console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Board Relations v1 runtime contract PASS');
console.log('- endpoint projection mapping PASS');
console.log('- one read/index owner PASS');
console.log('- fail-closed backend-unavailable contract PASS');
console.log('- existing spatial/detail owner extension PASS');
