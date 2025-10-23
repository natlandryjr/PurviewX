// Production API server with health checks and security
const http = require('http');
const url = require('url');

const PORT = process.env.API_PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security headers
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

// CORS headers for production
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};

// Health check endpoint
const healthCheck = (req, res) => {
  const health = {
    status: 'ok',
    service: 'api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  };

  res.writeHead(200, {
    'Content-Type': 'application/json',
    ...securityHeaders
  });
  res.end(JSON.stringify(health));
};

// Readiness check endpoint
const readinessCheck = (req, res) => {
  // Add your readiness checks here (database connectivity, external services, etc.)
  const readiness = {
    status: 'ready',
    service: 'api',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'connected', // Implement actual database check
      storage: 'connected',  // Implement actual storage check
      auth: 'ready'         // Implement actual auth service check
    }
  };

  res.writeHead(200, {
    'Content-Type': 'application/json',
    ...securityHeaders
  });
  res.end(JSON.stringify(readiness));
};

// Metrics endpoint (for monitoring)
const metrics = (req, res) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    environment: NODE_ENV
  };

  res.writeHead(200, {
    'Content-Type': 'application/json',
    ...securityHeaders
  });
  res.end(JSON.stringify(metrics));
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

  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    res.writeHead(200);
    res.end();
    return;
  }

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

    case '/api/status':
      if (method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'operational',
          service: 'purviewx-api',
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
  console.log(`[API] Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    console.log('[API] Server closed');
    process.exit(0);
  });
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[API] Health check server listening on port ${PORT}`);
  console.log(`[API] Environment: ${NODE_ENV}`);
  console.log(`[API] Health endpoint: http://localhost:${PORT}/healthz`);
  console.log(`[API] Readiness endpoint: http://localhost:${PORT}/readyz`);
  console.log(`[API] Metrics endpoint: http://localhost:${PORT}/metrics`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('[API] Server error:', err);
  process.exit(1);
});