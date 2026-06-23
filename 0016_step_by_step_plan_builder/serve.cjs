// Minimal static server for the Plan Builder prototype (localhost:8754).
// No deps — Node built-ins only, so `pnpm dev` runs it without an install.
const http = require('http');
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'Plan_Builder_5Page_Prototype_v2_2026-06-09.html');
const PORT = process.env.PORT || 8754;

http
  .createServer((req, res) => {
    if (req.url === '/favicon.ico') { res.writeHead(204); res.end(); return; }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(fs.readFileSync(FILE));
  })
  .listen(PORT, () => console.log('Plan Builder prototype serving on http://localhost:' + PORT));
