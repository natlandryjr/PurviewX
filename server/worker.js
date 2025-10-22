// server/worker.js
const http = require('http');
const PORT = 3002;

let isReady = false;

// Simulate some startup work
console.log('[Worker] Starting up...');
setTimeout(() => {
    isReady = true;
    console.log('[Worker] Worker is now ready to process jobs.');
}, 5000); // 5-second startup delay


const server = http.createServer((req, res) => {
  if (req.url === '/readyz' && req.method === 'GET') {
    if (isReady) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ready', service: 'worker' }));
    } else {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'not_ready', service: 'worker' }));
    }
    return;
  }
  
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`[Worker] Readiness check server listening on port ${PORT}`);
});
