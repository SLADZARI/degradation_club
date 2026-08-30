// Dementor Club — transitional DC-9 sphere compatibility.
// The legacy assessment UI stores `self-development`; Community v1 uses `self_development`.
(()=>{
  const STORAGE='dementorClubOnboardingV3';
  const LEGACY='self-development';
  const CANONICAL='self_development';
  const newer=(a,b)=>{if(!a)return b;if(!b)return a;return(Date.parse(b.date||0)||0)>(Date.parse(a.date||0)||0)?b:a};
  try{
    const state=JSON.parse(localStorage.getItem(STORAGE)||'null');
    if(!state?.results)return;
    const merged=newer(state.results[LEGACY],state.results[CANONICAL]);
    if(!merged)return;
    if(state.results[CANONICAL]===merged)return;
    state.results[CANONICAL]=merged;
    localStorage.setItem(STORAGE,JSON.stringify(state));
  }catch(error){console.warn('[DC9 sphere compat]',error)}
})();
