/* Small deterministic growth renderer for the public garden. Save data remains authoritative. */
(() => {
  const duration = { carrot: 120000, hemp: 180000 };
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  function growthStage(bed, now) {
    if (!bed?.crop || !bed.watered) return 0;
    const ms = duration[bed.crop] || 120000;
    const progress = clamp(1 - Math.max(0, Number(bed.readyAt || 0) - Number(now || 0)) / ms, 0, 1);
    return progress >= 1 ? 4 : Math.min(3, Math.floor(progress * 3) + 1);
  }
  function draw(ctx, project, scale, bed, x, y, now, time) {
    const stage = growthStage(bed, now);
    if (!stage) return stage;
    const p = project(x + 0.6, y + 0.56), s = scale;
    const sway = Math.sin(time * 0.002 + x * 2.1) * s * 0.018;
    const ripe = stage === 4;
    const leafColor = bed.crop === 'hemp'
      ? (ripe ? '#39734e' : '#6f9b68')
      : (ripe ? '#4d8050' : '#84a66d');
    const edge = bed.crop === 'hemp' ? '#385d43' : '#58734d';
    const polygon = (points, fill, stroke=edge) => {
      ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
      ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = Math.max(0.8, s * 0.025); ctx.stroke(); }
    };
    const stem = (x1,y1,x2,y2) => {
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
      ctx.strokeStyle = edge; ctx.lineWidth = Math.max(1, s * 0.035); ctx.stroke();
    };
    ctx.save();
    ctx.globalAlpha = 0.2; ctx.fillStyle = '#364432';
    ctx.beginPath(); ctx.ellipse(p.x, p.y + s * 0.04, s * 0.18, s * 0.07, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    if (bed.crop === 'carrot') {
      const leafCount = stage === 1 ? 2 : stage === 2 ? 3 : 4;
      const height = s * (0.18 + stage * 0.075);
      const crownY = p.y - height;
      if (stage >= 3) {
        const rootTop = p.y - s * (stage === 4 ? 0.10 : 0.045);
        polygon([[p.x-s*.105,rootTop],[p.x+s*.105,rootTop],[p.x+s*.018,p.y+s*.18],[p.x,p.y+s*.21],[p.x-s*.018,p.y+s*.18]], stage===4?'#e58436':'#d69a52', '#9b683d');
        if (stage === 4) {
          stem(p.x-s*.07,rootTop+s*.005,p.x-s*.045,rootTop+s*.08);
          stem(p.x+s*.06,rootTop+s*.005,p.x+s*.045,rootTop+s*.08);
        }
      }
      for (let i=0;i<leafCount;i++) {
        const side=i%2===0?-1:1, row=Math.floor(i/2);
        const baseX=p.x+sway, baseY=p.y-s*.02-row*s*.045;
        const tipX=baseX+side*s*(.07+row*.035), tipY=crownY+row*s*.025;
        stem(baseX,baseY,tipX,tipY);
        const w=s*(stage===1?.055:stage===2?.085:.105), h=s*(stage===1?.045:stage===2?.075:.095);
        polygon([[tipX,tipY],[tipX+side*w,tipY-h],[tipX+side*w*.55,tipY+h*.12],[tipX,tipY+h*.42]],leafColor);
      }
    } else {
      const leafCount = stage === 1 ? 2 : stage === 2 ? 3 : stage === 3 ? 4 : 5;
      const height=s*(.18+stage*.085), top=p.y-height;
      stem(p.x,p.y,p.x+sway,top);
      for(let i=0;i<leafCount;i++){
        const side=i%2===0?-1:1, row=Math.floor(i/2);
        const baseY=p.y-s*(.055+row*.075), baseX=p.x+sway+side*s*.025;
        const tipX=baseX+side*s*(.13+stage*.025), tipY=baseY-s*(.035+row*.018);
        stem(baseX,baseY,tipX,tipY);
        const w=s*(.12+stage*.018), h=s*(.085+stage*.012);
        polygon([[tipX,tipY],[tipX+side*w*.52,tipY-h*.48],[tipX+side*w*.35,tipY-h],[tipX,tipY-h*.72],[tipX-side*w*.32,tipY-h],[tipX-side*w*.45,tipY-h*.38]],leafColor);
      }
      if(stage===4){ctx.fillStyle='#7ca85f';ctx.beginPath();ctx.ellipse(p.x,p.y-s*.08,s*.09,s*.04,0,0,Math.PI*2);ctx.fill();}
    }
    ctx.restore();
    return stage;
  }
  globalThis.DLGardenVisuals = Object.freeze({ growthStage, draw });
})();
