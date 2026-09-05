import fs from 'node:fs';
import path from 'node:path';

const SUPABASE_AUTH_ORIGIN='https://mmekfydwbvptbdatwitj.supabase.co';
const APP_CALLBACK='https://dementor.club/auth/callback/?next=%2Fworkspace%2F';
const EXPECTED_GOOGLE_HOST='accounts.google.com';
const EXPECTED_PROVIDER_CALLBACK=`${SUPABASE_AUTH_ORIGIN}/auth/v1/callback`;
const errors=[];
const expect=(ok,message)=>{if(!ok)errors.push(message)};

const artifact=path.join(process.cwd(),'_site');
for(const [rel,label] of [['global-header.js','GlobalHeader'],['community-runtime-v1.js','Community runtime'],['workspace/workspace.js','Workspace guest gate'],['workspace/owner-admin-gate-v1.js','Owner-admin gate'],['workspace/review/review.js','Membership Review gate']]){
  const file=path.join(artifact,rel);
  expect(fs.existsSync(file),`${label}: built auth owner missing: ${rel}`);
  if(fs.existsSync(file)){
    const source=fs.readFileSync(file,'utf8');
    expect(source.includes("provider:'google'"),`${label}: Google provider contract missing`);
    expect(source.includes("queryParams:{prompt:'select_account'}"),`${label}: Safari-safe prompt=select_account contract missing`);
    expect(source.includes('/auth/callback/'),`${label}: canonical auth callback contract missing`);
  }
}

const authorize=new URL('/auth/v1/authorize',SUPABASE_AUTH_ORIGIN);
authorize.searchParams.set('provider','google');
authorize.searchParams.set('redirect_to',APP_CALLBACK);
authorize.searchParams.set('code_challenge','qa_dementor_club_google_handoff_12345678901234567890');
authorize.searchParams.set('code_challenge_method','s256');
authorize.searchParams.set('prompt','select_account');

const response=await fetch(authorize,{redirect:'manual',headers:{'user-agent':'DementorClub-ReleaseGate/1.0'}});
const location=response.headers.get('location');

expect([301,302,303,307,308].includes(response.status),`Supabase /authorize did not redirect: HTTP ${response.status}`);
expect(Boolean(location),'Supabase /authorize returned no Location header');

if(location){
  let providerUrl=null;
  try{providerUrl=new URL(location)}catch{}
  expect(Boolean(providerUrl),'Provider Location is not a valid absolute URL');
  if(providerUrl){
    expect(providerUrl.hostname===EXPECTED_GOOGLE_HOST,`Unexpected OAuth provider host: ${providerUrl.hostname}`);
    expect(providerUrl.searchParams.get('prompt')==='select_account','Google provider redirect lost prompt=select_account');
    expect(providerUrl.searchParams.get('redirect_uri')===EXPECTED_PROVIDER_CALLBACK,`Google provider redirect_uri drifted: ${providerUrl.searchParams.get('redirect_uri')||'<missing>'}`);
    expect(Boolean(providerUrl.searchParams.get('client_id')),'Google provider redirect is missing client_id');
    const responseType=providerUrl.searchParams.get('response_type')||'';
    expect(responseType.includes('code'),`Google provider response_type is unexpected: ${responseType||'<missing>'}`);
  }
}

if(errors.length){
  console.error('GOOGLE OAUTH PROVIDER HANDOFF BLOCKED');
  for(const error of errors)console.error(`- ${error}`);
  process.exit(1);
}

console.log('Google OAuth provider handoff PASS: all built Google login owners request explicit account choice and Supabase redirects to accounts.google.com with canonical callback');
