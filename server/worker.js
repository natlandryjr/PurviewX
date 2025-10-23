// Production worker server with health checks and job processing
const http = require('http');
const url = require('url');

const PORT = process.env.WORKER_PORT || 3002;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security headers
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'",
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

// Worker state
let isReady = false;
let isHealthy = true;
let jobCount = 0;
let lastJobTime = null;

// Simulate startup work
console.log('[Worker] Starting up...');
const startupDelay = process.env.WORKER_STARTUP_DELAY || 5000;

setTimeout(() => {
  isReady = true;
  console.log('[Worker] Worker is now ready to process jobs.');
}, startupDelay);

// Health check endpoint
const healthCheck = (req, res) => {
  const health = {
    status: isHealthy ? 'ok' : 'unhealthy',
    service: 'worker',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    ready: isReady,
    jobCount: jobCount,
    lastJobTime: lastJobTime
  };

  const statusCode = isHealthy ? 200 : 503;

  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    ...securityHeaders
  });
  res.end(JSON.stringify(health));
};

// Readiness check endpoint
const readinessCheck = (req, res) => {
  const readiness = {
    status: isReady ? 'ready' : 'not_ready',
    service: 'worker',
    timestamp: new Date().toISOString(),
    ready: isReady,
    jobCount: jobCount
  };

  const statusCode = isReady ? 200 : 503;

  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    ...securityHeaders
  });
  res.end(JSON.stringify(readiness));
};

// Metrics endpoint
const metrics = (req, res) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    environment: NODE_ENV,
    ready: isReady,
    healthy: isHealthy,
    jobCount: jobCount,
    lastJobTime: lastJobTime
  };

  res.writeHead(200, {
    'Content-Type': 'application/json',
    ...securityHeaders
  });
  res.end(JSON.stringify(metrics));
};

// Job processing endpoint
const processJob = (req, res) => {
  if (!isReady) {
    res.writeHead(503, {
      'Content-Type': 'application/json',
      ...securityHeaders
    });
    res.end(JSON.stringify({
      error: 'Worker not ready',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Simulate job processing
  jobCount++;
  lastJobTime = new Date().toISOString();

  console.log(`[Worker] Processing job #${jobCount}`);

  // Simulate job processing time
  setTimeout(() => {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      ...securityHeaders
    });
    res.end(JSON.stringify({
      success: true,
      jobId: jobCount,
      timestamp: lastJobTime,
      message: 'Job processed successfully'
    }));
  }, 1000);
};

// Main request handler
const requestHandler = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Add security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Route handling
  switch (path) {
    case '/healthz':
      if (method === 'GET') {
        healthCheck(req, res);
        return;
      }
      break;

    case '/readyz':
      if (method === 'GET') {
        readinessCheck(req, res);
        return;
      }
      break;

    case '/metrics':
      if (method === 'GET') {
        metrics(req, res);
        return;
      }
      break;

    case '/api/jobs':
      if (method === 'POST') {
        processJob(req, res);
        return;
      }
      break;

    case '/api/status':
      if (method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'operational',
          service: 'purviewx-worker',
          ready: isReady,
          jobCount: jobCount,
          timestamp: new Date().toISOString()
        }));
        return;
      }
      break;

    default:
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Not Found',
        path: path,
        method: method,
        timestamp: new Date().toISOString()
      }));
      return;
  }

  // If we get here, method not allowed
  res.writeHead(405, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: 'Method Not Allowed',
    path: path,
    method: method,
    timestamp: new Date().toISOString()
  }));
};

// Create server
const server = http.createServer(requestHandler);

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`[Worker] Received ${signal}, shutting down gracefully...`);
  isHealthy = false;

  // Wait for current jobs to complete
  setTimeout(() => {
    server.close(() => {
      console.log('[Worker] Server closed');
      process.exit(0);
    });
  }, 5000); // Give 5 seconds for jobs to complete
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Worker] Readiness check server listening on port ${PORT}`);
  console.log(`[Worker] Environment: ${NODE_ENV}`);
  console.log(`[Worker] Health endpoint: http://localhost:${PORT}/healthz`);
  console.log(`[Worker] Readiness endpoint: http://localhost:${PORT}/readyz`);
  console.log(`[Worker] Metrics endpoint: http://localhost:${PORT}/metrics`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('[Worker] Server error:', err);
  isHealthy = false;
  process.exit(1);
});