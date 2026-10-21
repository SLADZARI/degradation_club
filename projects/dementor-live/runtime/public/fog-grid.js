// Grid masking for permanent exploration-based fog of war.
(function(root){
  root.DLFogGrid={
    hiddenCells(explored,minX,maxX,minY,maxY){
      const hidden=[];
      for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++)if(!explored.has(x+','+y))hidden.push([x,y]);
      return hidden;
    }
  };
})(globalThis);
