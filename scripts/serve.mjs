import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stat, readFile } from 'node:fs/promises';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.csv':'text/csv; charset=utf-8','.md':'text/plain; charset=utf-8'};
const ownFolder = path.basename(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
const allowed = new Set(['gallery-page-dunnio-tailor','dunnio-life-page-dunnio-tailor',ownFolder,'index.html']);
const server = http.createServer(async (request,response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url,'http://127.0.0.1').pathname);
    const segments = pathname.split('/').filter(Boolean);
    if (!segments.length) segments.push('index.html');
    if (!allowed.has(segments[0]) || segments.some(segment => segment.startsWith('.') || segment.includes('\\'))) {
      response.writeHead(403); response.end('Forbidden'); return;
    }
    let target = path.resolve(root,...segments);
    if (!target.startsWith(root + path.sep)) { response.writeHead(403);response.end('Forbidden');return; }
    if (segments.length === 1 && segments[0] === 'index.html') {
      try { await stat(target); } catch { target = path.join(root,ownFolder,'index.html'); }
    }
    const info = await stat(target);
    if (info.isDirectory()) target = path.join(target,'index.html');
    const bytes = await readFile(target);
    response.writeHead(200,{'Content-Type':types[path.extname(target)] || 'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    response.end(request.method === 'HEAD' ? undefined : bytes);
  } catch { response.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});response.end('Không tìm thấy tài nguyên.'); }
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Cổng ${port} đang được sử dụng. Mở http://127.0.0.1:${port}/ hoặc chọn biến PORT khác.`:error.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`Dunnio demos: http://127.0.0.1:${port}/\nChỉ phục vụ trên thiết bị hiện tại. Ctrl+C để dừng.`));
