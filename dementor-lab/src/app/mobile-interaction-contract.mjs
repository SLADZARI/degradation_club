export const MOBILE_INTERACTION=Object.freeze({
  minTouchTargetPx:44,
  dragSlopPx:8,
  bottomSheetMaxViewport:0.86,
  brainViewBox:{width:900,height:720,minWidth:420,maxWidth:1200},
  safeArea:true,
  gestures:{
    canvasPan:'one finger on blank canvas',
    nodeDrag:'one finger after drag slop',
    zoom:'two-finger pinch anywhere in BRAIN',
    connect:'tap output → tap compatible node',
    inspect:'tap node without drag'
  }
});

export function svgRadiusForCssTarget({cssDiameter=44,viewBoxWidth,canvasCssWidth}){
  return (cssDiameter/2)*viewBoxWidth/Math.max(1,canvasCssWidth);
}
