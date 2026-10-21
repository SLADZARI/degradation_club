// Three-stage, treasury-funded civic structures for a fresh starting city.
const stages=(a,b,c)=>[
 {title:'Площадка и фундамент',works:1,wood:a[0],stone:a[1]},
 {title:'Коробка и опоры',works:2,wood:b[0],stone:b[1]},
 {title:'Завершение и открытие',works:1,wood:c[0],stone:c[1]}
];
const site=(id,title,type,x,y,w,h,dropX,dropY,buildX,buildY,parts)=>({
 id,title,type,x,y,w,h,drop:{id:'municipal-'+id+'-drop',type:'project',x:dropX,y:dropY},
 build:{id:'municipal-'+id+'-build',type:'build',x:buildX,y:buildY},
 need:{wood:parts.reduce((n,p)=>n+p[0],0),stone:parts.reduce((n,p)=>n+p[1],0)},
 stages:stages(...parts)
});
export const MUNICIPAL_SITES=Object.freeze({
 'tool-shop':site('tool-shop','Магазин инструмента','shop',22.7,1,2.6,2,21,4,24,4,[[2,2],[3,2],[3,2]]),
 'landscape-shop':site('landscape-shop','Магазин благоустройства','landscape',15.5,1.5,2.5,2.2,14,4,17,4,[[2,1],[2,1],[2,2]]),
 warehouse:site('warehouse','Городской склад','warehouse',10.7,25,2.6,3,10,28,13,27,[[3,2],[5,3],[4,3]]),
 'city-registry':site('city-registry','Городской реестр','city-registry',18.7,5.7,.6,.6,17,7,20,7,[[2,1],[2,1],[2,2]]),
 'phone-square':site('phone-square','Таксофон площади','payphone',10,12,.8,.8,8.5,13.5,10,14,[[1,1],[2,1],[1,0]]),
 'tourist-kiosk':site('tourist-kiosk','Туристический киоск','tourist',25,38,2.8,2.2,22,40,25,41,[[2,2],[3,2],[3,2]]),
 'university-site':site('university-site','Университет','world-preview',18,42,3,2.5,15,44,18,45,[[3,2],[5,3],[4,3]]),
 'robo-stadium-site':site('robo-stadium-site','Стадион Robo Games','world-preview',29,43,4,3,26,46,30,47,[[4,3],[6,4],[6,3]]),
 'industry-site':site('industry-site','Производство и агротехника','world-preview',94,67,5,4,90,71,95,72,[[5,3],[7,5],[6,4]]),
 'museum-entry':site('museum-entry','Библиотека и музей','world-gate',96,60,3,3,92,63,96,64,[[3,2],[5,3],[4,3]]),
 'combat-gate':site('combat-gate','Боевая экспедиция','combat',27,33,4,3,27,33,29,34,[[2,2],[4,3],[3,2]])
});
export const emptyMunicipalProject=()=>({stage:0,work:0,accepted:{wood:0,stone:0},stock:{wood:0,stone:0},consumed:{wood:0,stone:0},spent:0});
export const municipalBuilt=(state,id)=>!!state?.municipalBuildings?.[id]&&state.municipalBuildings[id].stage>=MUNICIPAL_SITES[id]?.stages.length;
export function municipalBuildingView(state){
 return Object.values(MUNICIPAL_SITES).map(s=>({...s,project:state.municipalBuildings?.[s.id]||emptyMunicipalProject(),built:municipalBuilt(state,s.id)}));
}
