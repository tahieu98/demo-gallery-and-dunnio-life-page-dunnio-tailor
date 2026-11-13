import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stat, readFile } from 'node:fs/promises';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.PORT || 4173), mount='/demo-gallery-and-dunnio-life-page-dunnio-tailor';
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.csv':'text/csv; charset=utf-8','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow, noarchive, nosnippet, noimageindex'};
const server=http.createServer(async(request,response)=>{
  try{
    if(!['GET','HEAD'].includes(request.method)){response.writeHead(405,headers);response.end();return;}
    let pathname=decodeURIComponent(new URL(request.url,'http://127.0.0.1').pathname);
    if(pathname===mount){response.writeHead(302,{...headers,Location:mount+'/'});response.end();return;}
    if(pathname.startsWith(mount+'/'))pathname=pathname.slice(mount.length);
    const segments=pathname.split('/').filter(Boolean);
    if(segments.some(s=>s.startsWith('.')||s.includes('\\'))){response.writeHead(403,headers);response.end('Forbidden');return;}
    let target=path.resolve(root,...segments);
    if(target!==root&&!target.startsWith(root+path.sep)){response.writeHead(403,headers);response.end('Forbidden');return;}
    const info=await stat(target);
    if(info.isDirectory()){
      if(!pathname.endsWith('/')){response.writeHead(302,{...headers,Location:pathname+'/'});response.end();return;}
      target=path.join(target,'index.html');
    }
    response.writeHead(200,{...headers,'Content-Type':types[path.extname(target)]||'application/octet-stream'});
    response.end(request.method==='HEAD'?undefined:await readFile(target));
  }catch{response.writeHead(404,{...headers,'Content-Type':'text/plain; charset=utf-8'});response.end('Page not found.');}
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is in use. Choose another PORT.`:error.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`Dunnio demos: http://127.0.0.1:${port}${mount}/\nCtrl+C to stop.`));
