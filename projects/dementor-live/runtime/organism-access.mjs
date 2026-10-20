// Fail closed unless isolated --test or explicitly configured HTTPS admin secret.
import {timingSafeEqual} from 'node:crypto';
export function organismAccess(req,{testMode=false,secret='',publicUrl=''}={}){
 if(testMode)return req.headers['x-test-key']==='local-integration-tests';
 if(typeof secret!=='string'||secret.length<32||!String(publicUrl).startsWith('https://'))return false;
 const bearer=req.headers.authorization;
 if(typeof bearer!=='string'||!bearer.startsWith('Bearer ')||bearer.length>512)return false;
 const a=Buffer.from(bearer.slice(7)),b=Buffer.from(secret);
 return a.length===b.length&&timingSafeEqual(a,b);
}
export const organismEnabled=({testMode=false,secret='',publicUrl=''}={})=>!!testMode||(typeof secret==='string'&&secret.length>=32&&String(publicUrl).startsWith('https://'));
