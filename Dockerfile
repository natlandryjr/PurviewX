# Multi-stage build for production-ready PurviewX container
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Install all dependencies (including dev dependencies for build)
RUN npm install --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S purviewx -u 1001

# Set working directory
WORKDIR /app

# Install PM2 globally for process management
RUN npm install -g pm2

# Copy package files
COPY package*.json ./
COPY pm2.config.js ./

# Install production dependencies only
RUN npm ci --only=production --silent && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./public
COPY --from=builder /app/server ./server

# Copy necessary files for production
COPY --chown=purviewx:nodejs . .

# Create logs directory
RUN mkdir -p /app/logs && chown -R purviewx:nodejs /app/logs

# Switch to non-root user
USER purviewx

# Expose ports
EXPOSE 3000 3001 3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/healthz', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV API_PORT=3001
ENV WORKER_PORT=3002

# Start the application with PM2
CMD ["pm2-runtime", "start", "pm2.config.js"]
