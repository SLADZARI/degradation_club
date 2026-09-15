import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const errors=[];
const expect=(ok,msg)=>{if(!ok)errors.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg'};

function resolveFile(urlPath){
  let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);
  if(pathname.endsWith('/'))pathname+='index.html';
  const full=path.resolve(artifact,pathname.replace(/^\/+/,''));
  return full.startsWith(path.resolve(artifact)+path.sep)?full:null;
}
const server=http.createServer((req,res)=>{
  const file=resolveFile(req.url||'/');
  if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('Not found');return}
  res.setHeader('content-type',mime[path.extname(file).toLowerCase()]||'application/octet-stream');res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});

const supabaseStub=`
export function createClient(){
  const chain={select(){return chain},eq(){return chain},order(){return chain},limit(){return chain},maybeSingle:async()=>({data:null,error:null}),then(resolve,reject){return Promise.resolve({data:[],error:null}).then(resolve,reject)}};
  return {auth:{getSession:async()=>({data:{session:null},error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),signInWithOAuth:async()=>({data:null,error:null})},from:()=>chain,rpc:async()=>({data:[],error:null})};
}
`;

const expectedRefs=['program:dengi-na-veter','project:dementor-lab','event:fuengirola'];
const expectedHrefs=['/courses/dengi-na-veter/','/projects/dementor-lab/','/events/fuengirola/'];

for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:1000}});
  await context.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',body:supabaseStub}));

  for(const [surface,routePath,hostSelector] of [['home','/','#currentProgramHost'],['board','/workspace/board/','#boardProgramHost']]){
    const page=await context.newPage();
    await page.goto(base+routePath,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(selector=>document.querySelectorAll(`${selector} [data-thing-ref]`).length===3,hostSelector,{timeout:3000}).catch(()=>{});
    const label=`${surface}@${width}`;
    const cards=page.locator(`${hostSelector} [data-thing-ref]`);
    expect(await cards.count()===3,`${label}: expected exactly 3 Current Program Things`);
    const refs=await cards.evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-thing-ref')));
    expect(JSON.stringify(refs)===JSON.stringify(expectedRefs),`${label}: Thing refs/order drifted ${JSON.stringify(refs)}`);
    const hrefs=await cards.locator('a[data-current-program-action]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')));
    expect(JSON.stringify(hrefs)===JSON.stringify(expectedHrefs),`${label}: actions drifted ${JSON.stringify(hrefs)}`);
    expect(await cards.locator('[data-artifact]').count()===0,`${label}: Current Program Thing masquerades as Artifact`);
    const evidence=await page.evaluate(()=>window.__DC_CURRENT_PROGRAM_V0__||null);
    expect(evidence?.version==='v0'&&evidence?.surface===surface,`${label}: render evidence missing/drifted ${JSON.stringify(evidence)}`);
    expect(JSON.stringify(evidence?.thing_refs||[])===JSON.stringify(expectedRefs),`${label}: render evidence refs drifted`);
    const hostBox=await page.locator(hostSelector).boundingBox();
    if(hostBox)expect(hostBox.x>=-1&&hostBox.x+hostBox.width<=width+1,`${label}: Program host escapes viewport ${JSON.stringify(hostBox)}`);

    if(surface==='home'){
      expect(await page.locator('.dc-course-prototype').count()===0,`${label}: legacy course feature survived`);
      expect(await page.locator('section.dc-event').count()===0,`${label}: legacy event feature survived`);
      const text=await page.locator('body').innerText();
      expect(!text.includes('ACCESS AFTER JOIN'),`${label}: legacy Fuengirola Join gate visible`);
      expect(!text.includes('Думай с опасностью'),`${label}: non-selected course visible as old Home feature`);
    }else{
      expect(await page.locator('#boardHost').count()===1,`${label}: canonical Artifact Board host missing`);
      expect(await page.locator('#boardFilters').count()===1,`${label}: canonical Board filters missing`);
      await page.locator('.dc-spatial-viewport').waitFor({state:'visible',timeout:3000});
      const geometry=await page.evaluate(()=>{
        const program=document.getElementById('boardProgramHost');
        const viewport=document.querySelector('.dc-spatial-viewport');
        const shell=document.querySelector('.dc-board-wall>.dc-board-shell');
        const rail=document.querySelector('.dc-board-program__rail');
        if(!program||!viewport||!shell||!rail)return null;
        const p=getComputedStyle(program),v=viewport.getBoundingClientRect(),s=getComputedStyle(shell),r=getComputedStyle(rail);
        return{programPosition:p.position,viewportTop:v.top,viewportHeight:v.height,shellPosition:s.position,programPointer:p.pointerEvents,railPointer:r.pointerEvents,innerHeight};
      });
      expect(geometry?.programPosition==='absolute',`${label}: Current Program still participates in fullscreen Board flow ${JSON.stringify(geometry)}`);
      expect(geometry?.shellPosition==='relative',`${label}: fullscreen Board shell does not own Program overlay placement ${JSON.stringify(geometry)}`);
      expect((geometry?.viewportTop??999)<=140,`${label}: Current Program displaced canonical Board viewport ${JSON.stringify(geometry)}`);
      expect((geometry?.viewportHeight??0)>=((geometry?.innerHeight??0)-140),`${label}: Board lost fullscreen remaining-height ownership ${JSON.stringify(geometry)}`);
      expect(geometry?.programPointer==='none'&&geometry?.railPointer==='auto',`${label}: Program overlay pointer boundary drifted ${JSON.stringify(geometry)}`);
    }
    await page.close();
  }
  await context.close();
}

await browser.close();await new Promise(resolve=>server.close(resolve));
if(errors.length){console.error('CURRENT PROGRAM BROWSER ACCEPTANCE BLOCKED');for(const error of errors)console.error(`- ${error}`);process.exit(1)}
console.log('Current Program browser acceptance PASS');
console.log('✓ Home + Workspace Board at 1440 / 390');
console.log('✓ exact 3 Thing refs + exact destinations');
console.log('✓ shared render evidence v0');
console.log('✓ Program Things remain separate from Artifacts');
console.log('✓ Board Program overlay preserves canonical fullscreen viewport geometry');
console.log('✓ legacy Home course/event funnel blocks absent');