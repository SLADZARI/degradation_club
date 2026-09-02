import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { networkInterfaces } from 'node:os';

const host='0.0.0.0';
const port=Number(process.env.PORT||4173);
const root=resolve(new URL('..',import.meta.url).pathname);

const mime={
  '.html':'text/html; charset=utf-8',
  '.js':'text/javascript; charset=utf-8',
  '.mjs':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.svg':'image/svg+xml',
  '.png':'image/png',
  '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg',
  '.webp':'image/webp',
  '.ico':'image/x-icon'
};

function safePath(rawPath){
  const decoded=decodeURIComponent(rawPath.split('?')[0]);
  const relative=decoded==='/'?'index.html':decoded.replace(/^\/+/, '');
  const target=resolve(root,relative);
  if(target!==root&&!target.startsWith(`${root}${sep}`))return null;
  return target;
}

async function serve(req,res){
  try{
    let target=safePath(req.url||'/');
    if(!target){res.writeHead(403);res.end('Forbidden');return;}
    const info=await stat(target).catch(()=>null);
    if(info?.isDirectory())target=resolve(target,'index.html');
    const body=await readFile(target);
    res.writeHead(200,{
      'Content-Type':mime[extname(target).toLowerCase()]||'application/octet-stream',
      'Cache-Control':'no-store'
    });
    res.end(body);
  }catch{
    res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});
    res.end('Not found');
  }
}

const server=http.createServer(serve);
server.listen(port,host,()=>{
  const addresses=[];
  for(const entries of Object.values(networkInterfaces())){
    for(const net of entries||[]){
      if(net.family==='IPv4'&&!net.internal)addresses.push(`http://${net.address}:${port}/`);
    }
  }
  console.log('\nDEMENTOR LAB physical-device QA server');
  console.log(`Local: http://127.0.0.1:${port}/`);
  if(addresses.length){
    console.log('Phone on the same Wi-Fi:');
    addresses.forEach(url=>console.log(`  ${url}`));
  }else{
    console.log('No LAN IPv4 address detected. Check that the laptop and phone are on the same Wi-Fi.');
  }
  console.log('\nStop with Ctrl+C. No Vercel deploy is performed.\n');
});
