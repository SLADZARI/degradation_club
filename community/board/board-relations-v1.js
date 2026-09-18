import {getClient,esc} from '/community-runtime-v1.js';
import {resolveBoardUserState,isBoardMemberState,BOARD_USER_STATES} from '/community/board/board-user-state-v2.js';

const boardHost=document.getElementById('boardHost');
const RELATION_TYPES=Object.freeze(['RELATED_TO','RESULT_OF','CONTINUES','ABOUT','REPORT_OF']);
const RELATION_KINDS=Object.freeze(['artifact','event','program']);
const FORWARD_LABELS=Object.freeze({
  RELATED_TO:'СВЯЗАНО С',
  RESULT_OF:'РЕЗУЛЬТАТ ДЛЯ',
  CONTINUES:'ПРОДОЛЖАЕТ',
  ABOUT:'О',
  REPORT_OF:'ОТЧЁТ ПО'
});
const INVERSE_LABELS=Object.freeze({
  RESULT_OF:'ИСТОЧНИК ДЛЯ',
  CONTINUES:'ПРОДОЛЖЕНО',
  ABOUT:'УПОМИНАЕТСЯ В',
  REPORT_OF:'ИМЕЕТ ОТЧЁТ'
});

let client=null;
let boardState=null;
let relationRows=null;
let relationIndex=new Map();
let backendAvailable=false;
let scopedEntityIds=new Set();
let systemDementor=false;
let relationsVisible=true;
let presentationQueued=false;
let detailRefreshRequested=true;
let rendering=false;
let observer=null;

const endpointKey=(kind,sourceId)=>`${kind}:${sourceId}`;
const endpointFromTuple=(kind,sourceId)=>({kind:String(kind||''),sourceId:String(sourceId||''),key:endpointKey(kind,sourceId)});
function activeWindow(row,now=Date.now()){
  const from=row?.valid_from?Date.parse(row.valid_from):null;
  const to=row?.valid_to?Date.parse(row.valid_to):null;
  return row?.status==='active'
    && (!from||Number.isNaN(from)||from<=now)
    && (!to||Number.isNaN(to)||to>now);
}
function pairAllowed(type,originKind,targetKind){
  if(!RELATION_TYPES.includes(type)||!RELATION_KINDS.includes(originKind)||!RELATION_KINDS.includes(targetKind))return false;
  if(type==='RELATED_TO')return true;
  if(type==='RESULT_OF')return targetKind==='artifact';
  if(type==='CONTINUES')return originKind===targetKind;
  if(type==='ABOUT')return originKind==='artifact';
  if(type==='REPORT_OF')return originKind==='artifact'&&['event','program'].includes(targetKind);
  return false;
}
function isValidRelationRow(row){
  const id=String(row?.relation_id||'');
  const type=String(row?.relation_type||'');
  const ok=Boolean(
    id
    &&pairAllowed(type,String(row?.origin_kind||''),String(row?.target_kind||''))
    &&String(row?.origin_source_id||'')
    &&String(row?.target_source_id||'')
    &&endpointKey(row.origin_kind,row.origin_source_id)!==endpointKey(row.target_kind,row.target_source_id)
  );
  return ok;
}
function buildIndex(rows){
  const next=new Map();
  const ensure=key=>{
    if(!next.has(key))next.set(key,{outgoing:[],incoming:[],symmetric:[]});
    return next.get(key);
  };
  for(const row of rows){
    const originKey=endpointKey(row.origin_kind,row.origin_source_id);
    const targetKey=endpointKey(row.target_kind,row.target_source_id);
    if(row.relation_type==='RELATED_TO'){
      ensure(originKey).symmetric.push(row);
      ensure(targetKey).symmetric.push(row);
    }else{
      ensure(originKey).outgoing.push(row);
      ensure(targetKey).incoming.push(row);
    }
  }
  relationIndex=next;
}
function relationBucket(endpoint){return relationIndex.get(endpoint.key)||{outgoing:[],incoming:[],symmetric:[]}}
function supportedCard(card){
  return Boolean(card&&RELATION_KINDS.includes(String(card.dataset.relationKind||''))&&String(card.dataset.relationSourceId||''));
}
function endpointFromCard(card){
  if(!supportedCard(card))return null;
  return {
    kind:String(card.dataset.relationKind),
    sourceId:String(card.dataset.relationSourceId),
    key:endpointKey(card.dataset.relationKind,card.dataset.relationSourceId),
    localSourceId:String(card.dataset.sourceId||card.dataset.artifact||''),
    title:(card.querySelector('h3')?.textContent||card.dataset.relationSourceId||'').trim(),
    card
  };
}
function supportedCards(){
  return [...(boardHost?.querySelectorAll('[data-relation-kind][data-relation-source-id]')||[])].filter(supportedCard);
}
function endpointMap(){return new Map(supportedCards().map(card=>{const endpoint=endpointFromCard(card);return[endpoint.key,endpoint]}))}
function activeMember(){return isBoardMemberState(boardState?.key)}
function isOwnerAdmin(){return boardState?.key===BOARD_USER_STATES.OWNER_ADMIN}
function canManageEndpoint(endpoint){
  if(!endpoint)return false;
  if(isOwnerAdmin())return true;
  if(!activeMember())return false;
  if(endpoint.kind==='artifact')return endpoint.card?.dataset.artifactOwned==='1';
  if(!systemDementor)return false;
  return Boolean(endpoint.localSourceId&&scopedEntityIds.has(endpoint.localSourceId));
}
function canDeleteRow(row,map=endpointMap()){
  const origin=map.get(endpointKey(row.origin_kind,row.origin_source_id))||endpointFromTuple(row.origin_kind,row.origin_source_id);
  const target=map.get(endpointKey(row.target_kind,row.target_source_id))||endpointFromTuple(row.target_kind,row.target_source_id);
  if(row.relation_type==='RELATED_TO')return canManageEndpoint(origin)||canManageEndpoint(target);
  return canManageEndpoint(origin);
}
function counterpart(row,endpoint){
  const originKey=endpointKey(row.origin_kind,row.origin_source_id);
  const targetKey=endpointKey(row.target_kind,row.target_source_id);
  return endpoint.key===originKey
    ?endpointFromTuple(row.target_kind,row.target_source_id)
    :endpointFromTuple(row.origin_kind,row.origin_source_id);
}
function relationLabel(row,endpoint){
  if(row.relation_type==='RELATED_TO')return FORWARD_LABELS.RELATED_TO;
  return endpoint.key===endpointKey(row.origin_kind,row.origin_source_id)
    ?FORWARD_LABELS[row.relation_type]
    :INVERSE_LABELS[row.relation_type];
}
function endpointTitle(endpoint,map=endpointMap()){
  return map.get(endpoint.key)?.title||endpoint.sourceId;
}
function relationItems(endpoint){
  const bucket=relationBucket(endpoint);
  const seen=new Set();
  return [...bucket.symmetric,...bucket.outgoing,...bucket.incoming].filter(row=>{
    if(seen.has(row.relation_id))return false;
    seen.add(row.relation_id);
    return true;
  });
}
function candidateChoices(endpoint){
  const map=endpointMap();
  const choices=[];
  for(const target of map.values()){
    if(target.key===endpoint.key)continue;
    for(const type of RELATION_TYPES){
      if(!pairAllowed(type,endpoint.kind,target.kind))continue;
      const allowed=type==='RELATED_TO'
        ?canManageEndpoint(endpoint)||canManageEndpoint(target)
        :canManageEndpoint(endpoint);
      if(!allowed)continue;
      choices.push({type,target});
    }
  }
  return choices;
}
function relationStatusHost(root){return root?.querySelector('[data-relation-status]')}
function setRelationStatus(root,message,state=''){
  const host=relationStatusHost(root);
  if(!host)return;
  host.textContent=message||'';
  host.dataset.state=state;
  host.hidden=!message;
}
function humanRelationError(error){
  const message=String(error?.message||error||'');
  if(/FORBIDDEN|permission|42501/i.test(message))return 'НЕТ ПРАВ / SERVER';
  if(/DUPLICATE/i.test(message))return 'СВЯЗЬ УЖЕ ЕСТЬ';
  if(/UNSUPPORTED|INVALID|SELF_EDGE/i.test(message))return 'ЭТА СВЯЗЬ НЕ ПОДДЕРЖИВАЕТСЯ';
  return 'СВЯЗЬ НЕ СОХРАНЕНА';
}
function escapeOption(value){return esc(JSON.stringify(value))}
function blockHtml(endpoint,{detail=false}={}){
  const map=endpointMap();
  const rows=relationItems(endpoint);
  const choices=candidateChoices(endpoint);
  if(!rows.length&&!choices.length)return'';
  const relationRowsHtml=rows.length?rows.map(row=>{
    const other=counterpart(row,endpoint);
    const title=endpointTitle(other,map);
    const canDelete=canDeleteRow(row,map);
    return `<div class="dc-board-relation-row" data-relation-id="${esc(row.relation_id)}"><button type="button" class="dc-board-relation-link" data-relation-focus="${esc(other.key)}"><span>${esc(relationLabel(row,endpoint))}</span><strong>${esc(title)}</strong></button>${canDelete?`<button type="button" class="dc-board-relation-delete" data-relation-delete="${esc(row.relation_id)}" aria-label="Удалить связь">×</button>`:''}</div>`;
  }).join(''):'<div class="dc-board-relation-empty">СВЯЗЕЙ ПОКА НЕТ.</div>';
  const options=choices.map(choice=>`<option value="${escapeOption({type:choice.type,targetKey:choice.target.key})}">${esc(FORWARD_LABELS[choice.type]||choice.type)} · ${esc(choice.target.title||choice.target.sourceId)}</option>`).join('');
  const add=choices.length?`<button type="button" class="dc-board-relation-add" data-relation-add>＋ СВЯЗЬ</button><div class="dc-board-relation-form" data-relation-form hidden><select data-relation-choice aria-label="Тип и объект связи">${options}</select><button type="button" data-relation-save>СОХРАНИТЬ</button><button type="button" data-relation-cancel>ОТМЕНА</button></div>`:'';
  return `<details class="dc-board-relations-block" data-relation-block data-relation-detail="${detail?'1':'0'}" ${detail?'open':''}><summary>СВЯЗИ · ${rows.length}</summary><div class="dc-board-relations-block__body">${relationRowsHtml}${add}<div class="dc-board-relation-status" data-relation-status hidden aria-live="polite"></div></div></details>`;
}
function findCardByKey(key){
  return supportedCards().find(card=>endpointFromCard(card)?.key===key)||null;
}
function focusEndpoint(key){
  const card=findCardByKey(key);
  if(!card||card.hidden||card.classList.contains('dc-board-filtered'))return;
  window.dispatchEvent(new CustomEvent('dc:board-focus-target',{detail:{node:card,open:false}}));
}
async function refreshAfterMutation(){
  const ok=await readCanonicalRelations();
  if(ok)schedulePresentation({details:true});
}
async function createRelation(card,endpoint,select,statusRoot=card){
  let choice=null;
  try{choice=JSON.parse(select?.value||'')}catch{}
  if(!choice?.type||!choice?.targetKey){setRelationStatus(statusRoot,'ВЫБЕРИТЕ СВЯЗЬ','error');return}
  const target=endpointMap().get(choice.targetKey);
  if(!target||!pairAllowed(choice.type,endpoint.kind,target.kind)){
    setRelationStatus(statusRoot,'ЭТА СВЯЗЬ НЕ ПОДДЕРЖИВАЕТСЯ','error');return;
  }
  const mirrored=choice.type==='RELATED_TO'
    ?canManageEndpoint(endpoint)||canManageEndpoint(target)
    :canManageEndpoint(endpoint);
  if(!mirrored){setRelationStatus(statusRoot,'НЕТ ПРАВ / UI MIRROR','error');return}
  setRelationStatus(statusRoot,'СОХРАНЯЕМ…','busy');
  const {error}=await client.rpc('dc_board_relation_create_v1',{
    p_relation_type:choice.type,
    p_origin_kind:endpoint.kind,
    p_origin_source_id:endpoint.sourceId,
    p_target_kind:target.kind,
    p_target_source_id:target.sourceId
  });
  if(error){setRelationStatus(statusRoot,humanRelationError(error),'error');return}
  setRelationStatus(statusRoot,'СВЯЗЬ СОХРАНЕНА','success');
  await refreshAfterMutation();
}
async function deleteRelation(card,relationId,statusRoot=card){
  const row=relationRows?.find(item=>item.relation_id===relationId);
  if(!row||!canDeleteRow(row)){setRelationStatus(statusRoot,'НЕТ ПРАВ / UI MIRROR','error');return}
  setRelationStatus(statusRoot,'УДАЛЯЕМ…','busy');
  const {error}=await client.rpc('dc_board_relation_delete_v1',{p_relation_id:relationId});
  if(error){setRelationStatus(statusRoot,humanRelationError(error),'error');return}
  setRelationStatus(statusRoot,'СВЯЗЬ УДАЛЕНА','success');
  await refreshAfterMutation();
}
function wireBlock(block,endpoint,card){
  if(!block||block.dataset.relationBound==='1')return;
  block.dataset.relationBound='1';
  block.addEventListener('toggle',()=>schedulePresentation());
  block.addEventListener('click',event=>{
    const focus=event.target.closest?.('[data-relation-focus]');
    if(focus){event.preventDefault();const key=focus.dataset.relationFocus;const inDetail=block.dataset.relationDetail==='1';if(inDetail){window.dispatchEvent(new CustomEvent('dc:board-close-artifact'));setTimeout(()=>focusEndpoint(key),80)}else focusEndpoint(key);return}
    const add=event.target.closest?.('[data-relation-add]');
    if(add){event.preventDefault();const form=block.querySelector('[data-relation-form]');if(form)form.hidden=false;return}
    const cancel=event.target.closest?.('[data-relation-cancel]');
    if(cancel){event.preventDefault();const form=block.querySelector('[data-relation-form]');if(form)form.hidden=true;return}
    const save=event.target.closest?.('[data-relation-save]');
    if(save){event.preventDefault();createRelation(card,endpoint,block.querySelector('[data-relation-choice]'),block).catch(error=>setRelationStatus(block,humanRelationError(error),'error'));return}
    const remove=event.target.closest?.('[data-relation-delete]');
    if(remove){event.preventDefault();deleteRelation(card,remove.dataset.relationDelete,block).catch(error=>setRelationStatus(block,humanRelationError(error),'error'))}
  });
}
function clearBlocks(root=document){
  root.querySelectorAll?.('[data-relation-block]').forEach(node=>node.remove());
}
function renderCardBlocks(){
  if(!backendAvailable||!relationRows){clearBlocks(boardHost);return}
  rendering=true;
  try{
    for(const card of supportedCards()){
      card.querySelector(':scope > [data-relation-block]')?.remove();
      const endpoint=endpointFromCard(card);
      const html=blockHtml(endpoint);
      if(!html)continue;
      const actions=card.querySelector(':scope > .dc-notice__actions');
      if(actions)actions.insertAdjacentHTML('beforebegin',html);
      else card.insertAdjacentHTML('beforeend',html);
      wireBlock(card.querySelector(':scope > [data-relation-block]'),endpoint,card);
    }
  }finally{rendering=false}
}
function cardVisible(card){
  if(!card||card.hidden||card.classList.contains('dc-board-filtered'))return false;
  const style=getComputedStyle(card);
  return style.display!=='none'&&style.visibility!=='hidden';
}
function cardCenter(card){
  const x=parseFloat(card.style.left)||0;
  const y=parseFloat(card.style.top)||0;
  return{x:x+Math.max(card.offsetWidth||0,220)/2,y:y+Math.max(card.offsetHeight||0,140)/2};
}
function ensureLayer(){
  if(!backendAvailable||!relationRows?.length||!boardHost)return null;
  let svg=boardHost.querySelector(':scope > .dc-board-relations-layer');
  if(svg)return svg;
  svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('class','dc-board-relations-layer');
  svg.setAttribute('viewBox','0 0 12000 8000');
  svg.setAttribute('aria-hidden','true');
  svg.innerHTML='<defs><marker id="dc-board-relation-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs>';
  boardHost.insertBefore(svg,boardHost.firstChild);
  return svg;
}
function renderLines(){
  const existing=boardHost?.querySelector(':scope > .dc-board-relations-layer');
  if(!backendAvailable||!relationRows?.length){existing?.remove();return}
  const map=endpointMap();
  const svg=ensureLayer();if(!svg)return;
  svg.hidden=!relationsVisible;
  const existingLines=new Map([...svg.querySelectorAll('.dc-board-relation-line')].map(line=>[line.dataset.relationId,line]));
  const activeIds=new Set();
  for(const row of relationRows){
    activeIds.add(row.relation_id);
    let line=existingLines.get(row.relation_id);
    if(!line){
      line=document.createElementNS('http://www.w3.org/2000/svg','line');
      line.dataset.relationId=row.relation_id;
      line.classList.add('dc-board-relation-line');
      svg.appendChild(line);
    }
    line.dataset.relationType=row.relation_type;
    if(row.relation_type==='RELATED_TO')line.removeAttribute('marker-end');
    else line.setAttribute('marker-end','url(#dc-board-relation-arrow)');
    const origin=map.get(endpointKey(row.origin_kind,row.origin_source_id));
    const target=map.get(endpointKey(row.target_kind,row.target_source_id));
    const visible=Boolean(origin&&target&&cardVisible(origin.card)&&cardVisible(target.card));
    line.toggleAttribute('hidden',!visible);
    if(!visible)continue;
    const a=cardCenter(origin.card),b=cardCenter(target.card);
    line.setAttribute('x1',String(a.x));line.setAttribute('y1',String(a.y));line.setAttribute('x2',String(b.x));line.setAttribute('y2',String(b.y));
  }
  for(const [id,line] of existingLines)if(!activeIds.has(id))line.remove();
}
function updateToggle(){
  const controls=document.querySelector('.dc-spatial-controls');
  if(!controls)return;
  let button=controls.querySelector('[data-relations-toggle]');
  if(!backendAvailable||!relationRows?.length){button?.remove();return}
  if(!button){
    button=document.createElement('button');
    button.className='dc-spatial-control dc-board-relations-toggle';
    button.type='button';
    button.dataset.relationsToggle='1';
    controls.appendChild(button);
    button.addEventListener('click',()=>{
      relationsVisible=!relationsVisible;
      updateToggle();
      renderLines();
    });
  }
  button.textContent=relationsVisible?'СКРЫТЬ СВЯЗИ':'ПОКАЗАТЬ СВЯЗИ';
  button.setAttribute('aria-pressed',relationsVisible?'true':'false');
}
function renderPresentation(){
  presentationQueued=false;
  if(rendering)return;
  if(!backendAvailable){clearBlocks(boardHost);boardHost?.querySelector(':scope > .dc-board-relations-layer')?.remove();updateToggle();return}
  if(detailRefreshRequested){
    detailRefreshRequested=false;
    renderCardBlocks();
    injectArtifactDetail();
  }
  updateToggle();
  renderLines();
}
function schedulePresentation({details=false}={}){
  if(details)detailRefreshRequested=true;
  if(presentationQueued)return;
  presentationQueued=true;
  requestAnimationFrame(renderPresentation);
}
function markUnavailable(error){
  backendAvailable=false;
  relationRows=null;
  relationIndex=new Map();
  document.documentElement.dataset.dcBoardRelations='unavailable';
  clearBlocks(boardHost);
  boardHost?.querySelector(':scope > .dc-board-relations-layer')?.remove();
  updateToggle();
  console.info('[DC Board relations] unavailable; Board continues without relation truth',error?.message||error||'RPC_UNAVAILABLE');
}
async function readCanonicalRelations(){
  const {data,error}=await client.rpc('dc_board_relations_read_v1');
  if(error){markUnavailable(error);return false}
  const rows=Array.isArray(data)?data:[];
  if(rows.some(row=>!isValidRelationRow(row))){
    markUnavailable('RELATION_PAYLOAD_INVALID');
    return false;
  }
  relationRows=rows;
  buildIndex(rows);
  backendAvailable=true;
  document.documentElement.dataset.dcBoardRelations='ready';
  return true;
}
async function loadPermissionMirror(){
  scopedEntityIds=new Set();
  systemDementor=false;
  if(!boardState?.session?.user||!activeMember()||isOwnerAdmin())return;
  systemDementor=(boardState.roles||[]).some(row=>row.role==='dementor'&&activeWindow(row));
  if(!systemDementor)return;
  const {data,error}=await client.from('dc_entity_assignments')
    .select('entity_id,role,status,valid_from,valid_to,provenance_status')
    .eq('profile_id',boardState.session.user.id)
    .eq('role','dementor');
  if(error){console.info('[DC Board relations] scoped permission mirror unavailable; entity mutation controls stay closed',error.message);return}
  scopedEntityIds=new Set((data||[]).filter(row=>row.role==='dementor'&&row.provenance_status==='confirmed'&&activeWindow(row)).map(row=>String(row.entity_id)));
}
function clearArtifactDetail(){
  document.querySelector('.dc-artifact-overlay__panel > [data-relation-detail-host]')?.remove();
}
function injectArtifactDetail(){
  clearArtifactDetail();
  if(!backendAvailable||!relationRows)return;
  const overlay=document.querySelector('.dc-artifact-overlay:not([hidden])');
  const frame=overlay?.querySelector('iframe');
  const panel=overlay?.querySelector('.dc-artifact-overlay__panel');
  if(!frame||!panel||frame.src==='about:blank')return;
  let path='';
  try{path=new URL(frame.src,location.href).pathname}catch{return}
  const match=path.match(/^\/community\/artifact\/([^/]+)\/?$/);
  if(!match)return;
  const card=supportedCards().find(node=>node.dataset.relationKind==='artifact'&&node.dataset.relationSourceId===match[1]);
  if(!card)return;
  const endpoint=endpointFromCard(card);
  const html=blockHtml(endpoint,{detail:true});if(!html)return;
  const host=document.createElement('section');
  host.className='dc-board-relation-detail-host';
  host.dataset.relationDetailHost='1';
  host.setAttribute('aria-label','Связи Artifact');
  host.innerHTML=html;
  panel.appendChild(host);
  wireBlock(host.querySelector('[data-relation-block]'),endpoint,card);
}
function bindArtifactOverlay(){
  const bindFrame=()=>{
    const frame=document.querySelector('.dc-artifact-overlay iframe');
    if(!frame||frame.dataset.dcRelationsBound==='1')return;
    frame.dataset.dcRelationsBound='1';
    frame.addEventListener('load',()=>{
      if(frame.src==='about:blank'){clearArtifactDetail();return}
      injectArtifactDetail();
    });
  };
  bindFrame();
  new MutationObserver(bindFrame).observe(document.body,{childList:true,subtree:true});
  window.addEventListener('dc:board-artifact-closed',clearArtifactDetail);
}
function installObservers(){
  if(boardHost){
    observer=new MutationObserver(mutations=>{
      if(rendering)return;
      const relevant=mutations.some(m=>
        (m.type==='childList'&&m.target===boardHost)
        ||(m.type==='attributes'&&m.target instanceof HTMLElement&&supportedCard(m.target))
      );
      if(relevant){
        const details=mutations.some(m=>(m.type==='childList'&&m.target===boardHost)||(m.type==='attributes'&&['data-relation-kind','data-relation-source-id'].includes(m.attributeName)));
        schedulePresentation({details});
      }
    });
    observer.observe(boardHost,{childList:true,subtree:true,attributes:true,attributeFilter:['style','hidden','class','data-relation-kind','data-relation-source-id']});
  }
  window.addEventListener('dc:board-projections-updated',()=>schedulePresentation({details:true}));
  for(const name of ['dc:board-layout-updated','dc:board-layout-request','dc:board-filter-changed','dc:board-spatial-ready']){
    window.addEventListener(name,()=>schedulePresentation());
  }
  window.addEventListener('resize',()=>schedulePresentation(),{passive:true});
  window.addEventListener('dc:board-artifact-closed',()=>schedulePresentation());
}
async function init(){
  if(!boardHost)return;
  client=getClient();
  boardState=await resolveBoardUserState(client);
  await loadPermissionMirror();
  installObservers();
  bindArtifactOverlay();
  await readCanonicalRelations();
  schedulePresentation({details:true});
}

init().catch(error=>markUnavailable(error));
