# PurviewX Production Deployment Guide

This guide provides comprehensive instructions for deploying PurviewX in production environments, specifically optimized for GCC and GCC High tenant deployments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Docker Deployment](#docker-deployment)
4. [Azure App Service Deployment](#azure-app-service-deployment)
5. [Security Considerations](#security-considerations)
6. [Monitoring and Health Checks](#monitoring-and-health-checks)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- Docker 20.10+ installed
- Node.js 20+ (for local development)
- Azure CLI (for Azure deployments)
- Access to Azure subscription with appropriate permissions

### Azure Resources
- Azure Container Registry (ACR)
- Azure Database for PostgreSQL
- Azure App Service (Linux)
- Azure Key Vault (recommended)
- Azure Storage Account (for evidence storage)

### Microsoft Entra ID Setup
- App Registration with appropriate permissions
- Client ID, Tenant ID, and Client Secret
- Admin consent granted for required scopes

## Environment Configuration

### 1. Environment Files

The project includes environment-specific configuration files:

- `env.production` - Commercial cloud environment
- `env.gcc` - GCC (Government Community Cloud)
- `env.gcc-high` - GCC High environment

### 2. Required Environment Variables

```bash
# Application Settings
NODE_ENV=production
LOG_LEVEL=info

# Database Configuration
DATABASE_URL=postgresql://username:password@server:5432/database?sslmode=require

# Microsoft Entra ID Configuration
ENTRA_CLIENT_ID=your-client-id
ENTRA_TENANT_ID=your-tenant-id
ENTRA_CLIENT_SECRET=your-client-secret

# Cloud Environment
PURVIEWX_CLOUD=Commercial  # or GCC, GCC High, DOD

# AI Services
GEMINI_API_KEY=your-gemini-api-key

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=your-storage-connection-string

# Security Settings
SESSION_SECRET=your-session-secret
JWT_SECRET=your-jwt-secret
```

### 3. Cloud-Specific Endpoints

#### Commercial Cloud
- Microsoft Graph: `https://graph.microsoft.com`
- Azure Storage: `core.windows.net`
- Database: `database.azure.com`

#### GCC
- Microsoft Graph: `https://graph.microsoft.us`
- Azure Storage: `core.usgovcloudapi.net`
- Database: `database.usgovcloudapi.net`

#### GCC High
- Microsoft Graph: `https://graph.microsoft.us`
- Azure Storage: `core.usgovcloudapi.net`
- Database: `database.usgovcloudapi.net`

## Docker Deployment

### 1. Quick Deployment

```bash
# Deploy for Commercial environment
./deploy-production.sh production

# Deploy for GCC environment
./deploy-production.sh gcc

# Deploy for GCC High environment
./deploy-production.sh gcc-high
```

### 2. Manual Docker Deployment

```bash
# Build the image
docker build -t purviewx:latest .

# Run with environment file
docker run -d \
  --name purviewx_app \
  --restart unless-stopped \
  -p 3000:3000 \
  -p 3001:3001 \
  -p 3002:3002 \
  --env-file env.production \
  -v $(pwd)/logs:/app/logs \
  purviewx:latest
```

### 3. Docker Compose Deployment

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# With environment file
docker-compose -f docker-compose.prod.yml --env-file env.gcc up -d
```

## Azure App Service Deployment

### 1. Build and Push to ACR

```bash
# Login to Azure
az login

# Login to ACR
az acr login --name your-acr-name

# Build and push image
docker build -t your-acr-name.azurecr.io/purviewx:latest .
docker push your-acr-name.azurecr.io/purviewx:latest
```

### 2. Deploy to App Service

```bash
# Create App Service (if not exists)
az webapp create \
  --resource-group your-rg \
  --plan your-app-service-plan \
  --name your-app-name \
  --deployment-container-image-name your-acr-name.azurecr.io/purviewx:latest

# Configure App Service
az webapp config appsettings set \
  --resource-group your-rg \
  --name your-app-name \
  --settings \
    NODE_ENV=production \
    DATABASE_URL="your-database-url" \
    ENTRA_CLIENT_ID="your-client-id" \
    ENTRA_TENANT_ID="your-tenant-id" \
    ENTRA_CLIENT_SECRET="your-client-secret" \
    PURVIEWX_CLOUD="GCC" \
    GEMINI_API_KEY="your-gemini-key"
```

## Security Considerations

### 1. Container Security

- **Non-root user**: Container runs as user ID 1001
- **Security headers**: Implemented in all HTTP responses
- **Resource limits**: Memory and CPU limits configured
- **Health checks**: Comprehensive health monitoring

### 2. Network Security

- **HTTPS only**: All traffic encrypted in transit
- **CORS configuration**: Restricted to allowed origins
- **Security headers**: XSS protection, content type options, frame options

### 3. Secrets Management

- **Azure Key Vault**: Store sensitive configuration
- **Environment variables**: Use secure environment variable injection
- **No hardcoded secrets**: All secrets externalized

### 4. Database Security

- **SSL/TLS**: Database connections encrypted
- **Connection pooling**: Efficient connection management
- **Access controls**: Database access restricted to application

## Monitoring and Health Checks

### 1. Health Endpoints

- **API Health**: `http://localhost:3001/healthz`
- **Worker Health**: `http://localhost:3002/healthz`
- **Readiness**: `http://localhost:3001/readyz`, `http://localhost:3002/readyz`
- **Metrics**: `http://localhost:3001/metrics`, `http://localhost:3002/metrics`

### 2. Monitoring Integration

```bash
# Check container health
docker ps --filter name=purviewx_app

# View logs
docker logs purviewx_app

# Monitor resource usage
docker stats purviewx_app
```

### 3. Log Management

- **Structured logging**: JSON-formatted logs
- **Log rotation**: Automatic log rotation configured
- **Centralized logging**: Logs stored in `/app/logs` directory

## Troubleshooting

### 1. Common Issues

#### Container Won't Start
```bash
# Check logs
docker logs purviewx_app

# Check environment variables
docker exec purviewx_app env | grep -E "(DATABASE_URL|ENTRA_|PURVIEWX_)"
```

#### Health Checks Failing
```bash
# Check individual services
curl http://localhost:3001/healthz
curl http://localhost:3002/healthz

# Check readiness
curl http://localhost:3001/readyz
curl http://localhost:3002/readyz
```

#### Database Connection Issues
```bash
# Test database connectivity
docker exec purviewx_app node -e "
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect().then(() => console.log('Connected')).catch(console.error);
"
```

### 2. Performance Optimization

#### Resource Limits
```yaml
# docker-compose.prod.yml
deploy:
  resources:
    limits:
      memory: 1G
      cpus: '0.5'
    reservations:
      memory: 512M
      cpus: '0.25'
```

#### Scaling
```bash
# Scale horizontally
docker-compose -f docker-compose.prod.yml up -d --scale purviewx=3
```

### 3. Backup and Recovery

#### Database Backup
```bash
# Create database backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

#### Container Backup
```bash
# Export container
docker export purviewx_app > purviewx_backup.tar

# Import container
docker import purviewx_backup.tar purviewx:backup
```

## Production Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Microsoft Entra ID app registration complete
- [ ] SSL certificates configured
- [ ] Security headers implemented
- [ ] Health checks working

### Post-Deployment
- [ ] Application accessible via HTTPS
- [ ] Health endpoints responding
- [ ] Database connectivity confirmed
- [ ] Authentication flow working
- [ ] Logs being generated
- [ ] Monitoring configured

### Security Verification
- [ ] No hardcoded secrets
- [ ] HTTPS redirect working
- [ ] Security headers present
- [ ] Database encryption enabled
- [ ] Access controls configured
- [ ] Audit logging enabled

## Support and Maintenance

### Regular Maintenance
- Monitor application logs
- Check health endpoints
- Verify database connectivity
- Update security patches
- Review access controls

### Emergency Procedures
- Container restart: `docker restart purviewx_app`
- Service restart: `docker exec purviewx_app pm2 restart all`
- Log analysis: `docker logs purviewx_app --tail 100`
- Health check: `curl http://localhost:3001/healthz`

For additional support, refer to the main deployment documentation in the `deploy/` directory.
