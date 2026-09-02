const nextCopy=document.getElementById('nextCopy');
const OLD='Карта ничего не назначает и никуда не зачисляет. Если хочется продолжить — можно оформить участие и зайти в клуб.';
const APPROVED='Можно оставить всё как есть. Можно продолжить деградацию среди своих.';
function applyApprovedCopy(){if(nextCopy?.textContent.trim()===OLD)nextCopy.textContent=APPROVED}
if(nextCopy){applyApprovedCopy();new MutationObserver(applyApprovedCopy).observe(nextCopy,{childList:true,characterData:true,subtree:true})}
