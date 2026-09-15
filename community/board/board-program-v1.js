import {getCurrentProgram,announceCurrentProgram} from '/current-program-v1.js';

const host=document.getElementById('boardProgramHost');
if(host){
  const items=getCurrentProgram();
  host.innerHTML=`<div class="dc-board-program__head"><span>CURRENT PROGRAM / V0</span><span>ВЕЩИ, КОТОРЫЕ СЕЙЧАС СТОИТ ОТКРЫТЬ</span></div><div class="dc-board-program__rail">${items.map(item=>`<article class="dc-board-program__card" data-thing-ref="${item.thingRef}" data-source-kind="${item.sourceKind}"><div class="dc-board-program__state">${item.stateLabel}</div><h3>${item.title}</h3><p>${item.currentTruth}</p><a href="${item.href}" data-current-program-action data-analytics-cta="current-program:${item.analyticsId}">${item.actionLabel} →</a></article>`).join('')}</div>`;
  announceCurrentProgram('board');
}
