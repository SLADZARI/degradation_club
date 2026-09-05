const SUPABASE_AUTH_ORIGIN='https://mmekfydwbvptbdatwitj.supabase.co';
const APP_CALLBACK='https://dementor.club/auth/callback/?next=%2Fworkspace%2F';
const EXPECTED_GOOGLE_HOST='accounts.google.com';
const EXPECTED_PROVIDER_CALLBACK=`${SUPABASE_AUTH_ORIGIN}/auth/v1/callback`;

const authorize=new URL('/auth/v1/authorize',SUPABASE_AUTH_ORIGIN);
authorize.searchParams.set('provider','google');
authorize.searchParams.set('redirect_to',APP_CALLBACK);
authorize.searchParams.set('code_challenge','qa_dementor_club_google_handoff_12345678901234567890');
authorize.searchParams.set('code_challenge_method','s256');
authorize.searchParams.set('prompt','select_account');

const response=await fetch(authorize,{redirect:'manual',headers:{'user-agent':'DementorClub-ReleaseGate/1.0'}});
const location=response.headers.get('location');
const errors=[];
const expect=(ok,message)=>{if(!ok)errors.push(message)};

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

console.log('Google OAuth provider handoff PASS: Supabase redirects to accounts.google.com with canonical callback and explicit account chooser');