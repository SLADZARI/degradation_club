// Stable tourist controls across 10Hz SSE: do not replace an active button every frame.
(function(){
const update=updateCityPanels;
let previous='';
updateCityPanels=function(force=false){
  if(cityPanelMode==='tourist'&&me&&state?.worldTravel){
    const signature=JSON.stringify([me.wallet,me.spirit,me.job,state.worldTravel.profile,nearby('tourist-kiosk')]);
    if(!force&&signature===previous)return;
    previous=signature;
  }
  return update(force);
};
})();
