// CP-IDENTITY-01 / proposed G3 contract. No automatic character claiming by name or public ID.
import {createHash,randomBytes,timingSafeEqual} from 'node:crypto';

export const RETURN_TTL_MS = 10 * 60 * 1000;
export const RETURN_WINDOW_MS = 10 * 60 * 1000;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const codePattern = /^[A-Za-z0-9_-]{43}$/;

export function isCharacterId(value) {
  return typeof value === 'string' && uuid.test(value);
}
function hashReturnCode(code,salt) {
  return createHash('sha256').update('dementor-live:character-return:v1\0')
    .update(Buffer.from(salt,'hex')).update(code,'ascii').digest('hex');
}
// One 256-bit recovery capability is shown once; only a salted hash reaches the save.
export function createReturnTicket(player,now=Date.now()) {
  if (!player || !isCharacterId(player.id)) throw Error('invalid character');
  const code=randomBytes(32).toString('base64url');
  const salt=randomBytes(16).toString('hex');
  const expiresAt=now+RETURN_TTL_MS;
  player.characterReturn={version:1,salt,digest:hashReturnCode(code,salt),expiresAt};
  return {characterId:player.id,code,expiresAt};
}
export function verifyReturnTicket(player,code,now=Date.now()) {
  if (!player || typeof code!=='string' || !codePattern.test(code)) return false;
  const t=player.characterReturn;
  if (!t || t.version!==1 || !Number.isSafeInteger(t.expiresAt) || now>=t.expiresAt ||
      typeof t.salt!=='string' || !/^[a-f0-9]{32}$/.test(t.salt) ||
      typeof t.digest!=='string' || !/^[a-f0-9]{64}$/.test(t.digest)) return false;
  const expected=Buffer.from(t.digest,'hex'),received=Buffer.from(hashReturnCode(code,t.salt),'hex');
  return timingSafeEqual(expected,received);
}
export function claimReturnTicket(player,code,now=Date.now()) {
  if (!verifyReturnTicket(player,code,now)) return null;
  const token=randomBytes(32).toString('base64url');
  player.token=token; // legacy single-session API; old bearer is revoked after durable save
  delete player.characterReturn;
  return {id:player.id,token};
}
export function revokeReturnTicket(player) {
  if (player) delete player.characterReturn;
}

// Bounded, process-local admission. Nginx-level per-client admission remains an explicit G7 gate.
export class ReturnAttemptLimiter {
  constructor(now=()=>Date.now()) { this.now=now;this.entries=new Map(); }
  admit(key,max,window=RETURN_WINDOW_MS) {
    const now=this.now();
    const prior=this.entries.get(key);
    if (prior && now<prior.until) {
      if (prior.count>=max) return false;
      prior.count++;return true;
    }
    if (this.entries.size>=4096) {
      for (const [k,v] of this.entries) if (now>=v.until) this.entries.delete(k);
      if (this.entries.size>=4096 && !this.entries.has(key)) return false;
    }
    this.entries.set(key,{count:1,until:now+window});
    return true;
  }
}
