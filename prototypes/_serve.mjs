import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
const ROOT = '/Users/icecasasola/Documents/Claude/Projects/Setnayan/prototypes';
const TYPES = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript',
                '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png' };
createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = join(ROOT, path === '/' ? 'admin_home_interactive_2026-08-25.html' : path);
    if (!file.startsWith(ROOT)) { res.writeHead(403).end('no'); return; }
    const buf = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(buf);
  } catch { res.writeHead(404, {'content-type':'text/plain'}).end('not found'); }
}).listen(Number(process.env.PORT ?? 4173), () => console.log('prototypes ready'));
