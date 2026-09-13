import {getClient} from '/community-runtime-v1.js';

const client=getClient();
const CLUB_SCOPE='club';
const CLUB_NAME='DEMENTOR CLUB';
const CLUB_MARK='/assets/brand/dementor-mark-black.svg';
const host=document.getElementById('artifactHost');
let busy=false;

function idFromLocation(){
  const query=new URLSearchParams(location.search).get('id');
  if(query)return query;
  const parts=location.pathname.split('/').filter(Boolean);
  const index=parts.indexOf('artifact');
  return index>=0&&parts[index+1]&&parts[index+1]!=='index.html'?parts[index+1]:null;
}

function renderClubIdentity(){
  const author=host?.querySelector('.dc-artifact-author');
  if(!author)return;
  author.dataset.publisherScope=CLUB_SCOPE;
  author.innerHTML=`<img class="dc-artifact-avatar" src="${CLUB_MARK}" alt=""><div><strong>${CLUB_NAME}</strong><span>CLUB / PUBLICATION</span></div>`;
}

async function refresh(){
  if(busy)return;
  const id=idFromLocation();
  if(!id||!/^[0-9a-f-]{36}$/i.test(id)||!host?.querySelector('.dc-artifact-record'))return;
  busy=true;
  try{
    const result=await client.rpc('dc_artifact_publisher_scopes_v1',{p_artifact_ids:[id]});
    if(result.error)throw result.error;
    const row=(result.data||[]).find(item=>item.artifact_id===id);
    if(row?.publisher_scope===CLUB_SCOPE)renderClubIdentity();
  }catch(error){
    console.warn('[DC Artifact] publisher projection unavailable',error);
  }finally{busy=false}
}

const observer=new MutationObserver(()=>refresh());
if(host)observer.observe(host,{childList:true,subtree:true});
refresh();
