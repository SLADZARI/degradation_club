import {getClient,currentSession,getEntryStatus} from '/community-runtime-v1.js';

export const BOARD_USER_STATES=Object.freeze({
  UNAUTHENTICATED:'UNAUTHENTICATED',
  AUTHENTICATED_GUEST_DC9_INCOMPLETE:'AUTHENTICATED_GUEST_DC9_INCOMPLETE',
  AUTHENTICATED_GUEST_DC9_COMPLETE:'AUTHENTICATED_GUEST_DC9_COMPLETE',
  APPLICANT:'APPLICANT',
  MEMBER_NOT_ACTIVATED:'MEMBER_NOT_ACTIVATED',
  MEMBER_ACTIVATED:'MEMBER_ACTIVATED',
  DEMENTOR:'DEMENTOR',
  OWNER_ADMIN:'OWNER_ADMIN'
});

const ACTIVE_APPLICATION_STATES=new Set(['submitted','reviewing','accepted']);

function activeWindow(row,now=Date.now()){
  return row?.status==='active'&&(!row.valid_from||Date.parse(row.valid_from)<=now)&&(!row.valid_to||Date.parse(row.valid_to)>now);
}

export function deriveBoardUserState({session,entryStatus,application,roles=[]}={}){
  if(!session?.user)return BOARD_USER_STATES.UNAUTHENTICATED;
  const now=Date.now();
  const activeRoles=(roles||[]).filter(row=>activeWindow(row,now)).map(row=>row.role);
  if(activeRoles.includes('owner_admin'))return BOARD_USER_STATES.OWNER_ADMIN;
  if(activeRoles.includes('dementor'))return BOARD_USER_STATES.DEMENTOR;

  const member=entryStatus?.membership_active===true;
  if(member){
    return entryStatus?.community_activation_state==='MEMBER_ACTIVATED'
      ?BOARD_USER_STATES.MEMBER_ACTIVATED
      :BOARD_USER_STATES.MEMBER_NOT_ACTIVATED;
  }

  if(application&&ACTIVE_APPLICATION_STATES.has(String(application.status||'').toLowerCase())){
    return BOARD_USER_STATES.APPLICANT;
  }

  // sphere_count is informative UI progress only. Permission completion is owned
  // by the canonical server first-complete baseline exposed as sphere_gate_complete.
  return entryStatus?.sphere_gate_complete===true
    ?BOARD_USER_STATES.AUTHENTICATED_GUEST_DC9_COMPLETE
    :BOARD_USER_STATES.AUTHENTICATED_GUEST_DC9_INCOMPLETE;
}

export async function resolveBoardUserState(client=getClient()){
  const session=await currentSession(client);
  if(!session?.user){
    return {key:BOARD_USER_STATES.UNAUTHENTICATED,session:null,entryStatus:null,application:null,roles:[]};
  }

  const uid=session.user.id;
  const [entryResult,applicationResult,rolesResult]=await Promise.allSettled([
    getEntryStatus(client),
    client.from('join_applications').select('id,status,created_at,reviewed_at').eq('profile_id',uid).order('created_at',{ascending:false}).limit(1).maybeSingle(),
    client.from('dc_role_assignments').select('role,status,valid_from,valid_to').eq('profile_id',uid)
  ]);

  const entryStatus=entryResult.status==='fulfilled'?entryResult.value:null;
  const application=applicationResult.status==='fulfilled'&&!applicationResult.value.error?applicationResult.value.data:null;
  const roles=rolesResult.status==='fulfilled'&&!rolesResult.value.error?(rolesResult.value.data||[]):[];
  const diagnostics=[];
  if(entryResult.status==='rejected')diagnostics.push('ENTRY_STATUS_UNAVAILABLE');
  if(applicationResult.status==='rejected'||applicationResult.value?.error)diagnostics.push('APPLICATION_STATUS_UNAVAILABLE');
  if(rolesResult.status==='rejected'||rolesResult.value?.error)diagnostics.push('ROLE_STATUS_UNAVAILABLE');

  return {
    key:deriveBoardUserState({session,entryStatus,application,roles}),
    session,
    entryStatus,
    application,
    roles,
    diagnostics
  };
}

export function isBoardMemberState(key){
  return [BOARD_USER_STATES.MEMBER_NOT_ACTIVATED,BOARD_USER_STATES.MEMBER_ACTIVATED,BOARD_USER_STATES.DEMENTOR,BOARD_USER_STATES.OWNER_ADMIN].includes(key);
}

export function isBoardGuestState(key){
  return [BOARD_USER_STATES.AUTHENTICATED_GUEST_DC9_INCOMPLETE,BOARD_USER_STATES.AUTHENTICATED_GUEST_DC9_COMPLETE,BOARD_USER_STATES.APPLICANT].includes(key);
}
