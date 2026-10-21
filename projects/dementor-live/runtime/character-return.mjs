// CP-IDENTITY-01: draft identity portability; no public-name/number authentication.
// Production feature remains OFF pending explicit G3/G6/G7 review.
import {createHash,randomBytes,timingSafeEqual} from 'node:crypto';

export const RETURN_TTL_MS=10*60*1000;
export const RETURN_WINDOW_MS=10*60*1000;
export const RECOVERY_PENDING_MS=15*60*1000;
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const codePattern=/^[A-Za-z0-9_-]{43}$/;
const requestPattern=/^[a-f0-9]{32,64}$/;
const freshCode=()=>randomBytes(32).toString('base64url');
const freshSalt=()=>randomBytes(16).toString('hex');
export const isCharacterId=v=>typeof v==='string'&&uuid.test(v);
export const isRecoveryRequestId=v=>typeof v==='string'&&requestPattern.test(v);
function proofDigest(domain,salt,...parts){
  const h=createHash('sha256').update('dementor-live:'+domain+':v2\0');
  h.update(Buffer.from(salt,'hex'));
  for(const part of parts)h.update(String(part),'ascii').update('\0');
  return h.digest('hex');
}
function validProof(item,domain,...parts){
  if(!item||item.version!==1||typeof item.salt!=='string'||!/^[a-f0-9]{32}$/.test(item.salt)||
    typeof item.digest!=='string'||!/^[a-f0-9]{64}$/.test(item.digest))return false;
  const want=Buffer.from(item.digest,'hex'),got=Buffer.from(proofDigest(domain,item.salt,...parts),'hex');
  return timingSafeEqual(want,got);
}
function assertCharacter(p){if(!p||!isCharacterId(p.id))throw Error('invalid character');}

export function createReturnTicket(p,now=Date.now()){
  assertCharacter(p);
  const code=freshCode(),salt=freshSalt(),expiresAt=now+RETURN_TTL_MS;
  p.characterReturn={version:1,salt,digest:proofDigest('return-ticket',salt,code),expiresAt};
  delete p.characterReturnReplay;
  delete p.recoveryHandoff;
  return {characterId:p.id,code,expiresAt};
}
export function verifyReturnTicket(p,code,now=Date.now()){
  if(!p||typeof code!=='string'||!codePattern.test(code))return false;
  const ticket=p.characterReturn;
  return !!ticket&&Number.isSafeInteger(ticket.expiresAt)&&now<ticket.expiresAt&&
    validProof(ticket,'return-ticket',code);
}
export function retryReturnTicket(p,code,requestId,now=Date.now()){
  if(!p||!codePattern.test(String(code||''))||!isRecoveryRequestId(requestId))return null;
  const receipt=p.characterReturnReplay;
  if(!receipt||!Number.isSafeInteger(receipt.expiresAt)||now>=receipt.expiresAt||
    !validProof(receipt,'return-replay',code,requestId))return null;
  return {id:p.id,token:p.token,replayed:true};
}
export function claimReturnTicket(p,code,now=Date.now(),requestId){
  if(!isRecoveryRequestId(requestId))return null;
  const replay=retryReturnTicket(p,code,requestId,now);
  if(replay)return replay;
  if(!verifyReturnTicket(p,code,now))return null;
  const salt=freshSalt();
  p.token=freshCode(); // Existing runtime stores bearer; separate protected credential migration needed.
  delete p.characterReturn;
  p.characterReturnReplay={version:1,salt,
    digest:proofDigest('return-replay',salt,code,requestId),expiresAt:now+RETURN_TTL_MS};
  delete p.recoveryHandoff; // revoke any older incomplete self-service recovery.
  return {id:p.id,token:p.token,replayed:false};
}
export function revokeReturnTicket(p){
  if(p){delete p.characterReturn;delete p.characterReturnReplay;}
}

// Long-lived OFFLINE rescue key: independent of old browser/session bearer.
// Only an authenticated resident may enroll, or the explicit new-player onboarding may issue it.
// A legacy resident with no enrolled rescue key AND no old bearer cannot be cryptographically identified.
export function createRecoveryKit(p,now=Date.now()){
  assertCharacter(p);
  const code=freshCode(),salt=freshSalt();
  p.characterRecovery={version:1,salt,digest:proofDigest('offline-recovery',salt,code),createdAt:now};
  delete p.recoveryHandoff;
  delete p.characterReturn;
  delete p.characterReturnReplay; // old one-time acknowledgements must not resurrect access after re-enrollment
  return {characterId:p.id,recoveryCode:code,createdAt:now};
}
export function verifyRecoveryKit(p,code){
  return !!p&&typeof code==='string'&&codePattern.test(code)&&
    validProof(p.characterRecovery,'offline-recovery',code);
}
// State is persisted BEFORE the new bearer is returned. Retry with the same code+requestId
// returns the exact same bearer after HTTP ACK loss, even after a process restart.
// A second, different concurrent requestId is rejected until confirmation or handoff expiry.
export function beginRecovery(p,code,requestId,now=Date.now()){
  if(!p||!isRecoveryRequestId(requestId)||!verifyRecoveryKit(p,code))return null;
  const prior=p.recoveryHandoff;
  if(prior&&Number.isSafeInteger(prior.expiresAt)&&now<prior.expiresAt){
    if(validProof(prior,'offline-recovery-handoff',code,requestId))
      return {id:p.id,token:p.token,replayed:true};
    return null;
  }
  const salt=freshSalt();
  p.token=freshCode();
  p.recoveryHandoff={version:1,salt,
    digest:proofDigest('offline-recovery-handoff',salt,code,requestId),
    expiresAt:now+RECOVERY_PENDING_MS};
  delete p.characterReturn;
  delete p.characterReturnReplay;
  return {id:p.id,token:p.token,replayed:false};
}
// Confirmation requires the newly issued bearer; rotate the offline key on confirmation.
// Lost confirmation ACK cannot lose login because the new bearer was already received/stored.
export function confirmRecovery(p,now=Date.now()){
  if(!p?.recoveryHandoff)return null;
  return createRecoveryKit(p,now);
}
// Durable counter per CharacterId. Callers persist this optional field even on failed claims.
// IP/network admission belongs to the verified trusted edge (NOT arbitrary X-Forwarded-For).
export function admitCharacterAttempt(p,now=Date.now(),max=5){
  const old=p.identityAttempt;
  if(old&&now<old.until){
    if(old.count>=max)return false;
    old.count++;return true;
  }
  p.identityAttempt={count:1,until:now+RETURN_WINDOW_MS};
  return true;
}
export class ReturnAttemptLimiter {
  constructor(now=()=>Date.now()){this.now=now;this.entries=new Map();}
  admit(key,max,window=RETURN_WINDOW_MS){
    const now=this.now(),prior=this.entries.get(key);
    if(prior&&now<prior.until){if(prior.count>=max)return false;prior.count++;return true;}
    if(this.entries.size>=4096){
      for(const [k,v] of this.entries)if(now>=v.until)this.entries.delete(k);
      if(this.entries.size>=4096&&!this.entries.has(key))return false;
    }
    this.entries.set(key,{count:1,until:now+window});return true;
  }
}
