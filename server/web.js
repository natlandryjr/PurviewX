// Simple HTTP server for serving the React app
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
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

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Get content type
const getContentType = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
};

// Serve static files
const serveStaticFile = (req, res, filePath) => {
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
            return;
        }

        const contentType = getContentType(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
};

// Main request handler
const requestHandler = (req, res) => {
    let filePath = req.url === '/' ? '/index.html' : req.url;

    // Remove query parameters
    filePath = filePath.split('?')[0];

    // Security: prevent directory traversal
    if (filePath.includes('..')) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    const fullPath = path.join(__dirname, '../public', filePath);

    // Check if file exists
    fs.access(fullPath, fs.constants.F_OK, (err) => {
        if (err) {
            // If file doesn't exist, serve index.html for SPA routing
            const indexPath = path.join(__dirname, '../public/index.html');
            serveStaticFile(req, res, indexPath);
        } else {
            serveStaticFile(req, res, fullPath);
        }
    });
};

// Create server
const server = http.createServer(requestHandler);

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
    console.log(`[Web] Received ${signal}, shutting down gracefully...`);
    server.close(() => {
        console.log('[Web] Server closed');
        process.exit(0);
    });
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Web] Static file server listening on port ${PORT}`);
    console.log(`[Web] Environment: ${NODE_ENV}`);
    console.log(`[Web] Serving files from: ${path.join(__dirname, '../public')}`);
});

// Handle server errors
server.on('error', (err) => {
    console.error('[Web] Server error:', err);
    process.exit(1);
});
