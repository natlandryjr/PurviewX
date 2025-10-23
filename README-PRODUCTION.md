# PurviewX Production Ready

This document provides a quick reference for deploying PurviewX in production environments, specifically optimized for GCC and GCC High tenant deployments.

## Quick Start

### 1. Environment Setup

Choose your environment and copy the appropriate configuration:

```bash
# For Commercial cloud
cp env.production .env

# For GCC
cp env.gcc .env

# For GCC High
cp env.gcc-high .env
```

### 2. Update Configuration

Edit your `.env` file with your actual values:

```bash
# Required: Database connection
DATABASE_URL=postgresql://username:password@server:5432/database?sslmode=require

# Required: Microsoft Entra ID configuration
ENTRA_CLIENT_ID=your-client-id
ENTRA_TENANT_ID=your-tenant-id
ENTRA_CLIENT_SECRET=your-client-secret

# Required: Cloud environment
PURVIEWX_CLOUD=Commercial  # or GCC, GCC High, DOD

# Optional: AI services
GEMINI_API_KEY=your-gemini-api-key

# Optional: Azure Storage
AZURE_STORAGE_CONNECTION_STRING=your-storage-connection-string
```

### 3. Deploy

```bash
# Quick deployment
./deploy-production.sh production

# Or use npm scripts
npm run deploy:production
npm run deploy:gcc
npm run deploy:gcc-high
```

## Docker Commands

```bash
# Build image
docker build -t purviewx:latest .

# Run container
docker run -d --name purviewx_app \
  -p 3000:3000 -p 3001:3001 -p 3002:3002 \
  --env-file .env \
  purviewx:latest

# Check status
docker ps --filter name=purviewx_app

# View logs
docker logs purviewx_app

# Stop container
docker stop purviewx_app && docker rm purviewx_app
```

## Health Checks

- **Web UI**: http://localhost:3000
- **API Health**: http://localhost:3001/healthz
- **Worker Health**: http://localhost:3002/healthz
- **Metrics**: http://localhost:3001/metrics

## Production Features

### Security
- ✅ Non-root user execution
- ✅ Security headers implemented
- ✅ HTTPS enforcement
- ✅ CORS configuration
- ✅ Input validation

### Monitoring
- ✅ Health check endpoints
- ✅ Readiness probes
- ✅ Metrics collection
- ✅ Structured logging
- ✅ Resource limits

### Scalability
- ✅ PM2 process management
- ✅ Graceful shutdown
- ✅ Resource optimization
- ✅ Horizontal scaling support

## Cloud Environment Support

### Commercial Cloud
- Microsoft Graph: `https://graph.microsoft.com`
- Azure Storage: `core.windows.net`
- Database: `database.azure.com`

### GCC (Government Community Cloud)
- Microsoft Graph: `https://graph.microsoft.us`
- Azure Storage: `core.usgovcloudapi.net`
- Database: `database.usgovcloudapi.net`

### GCC High
- Microsoft Graph: `https://graph.microsoft.us`
- Azure Storage: `core.usgovcloudapi.net`
- Database: `database.usgovcloudapi.net`

## Troubleshooting

### Container Issues
```bash
# Check container status
docker ps --filter name=purviewx_app

# View logs
docker logs purviewx_app --tail 50

# Check health
curl http://localhost:3001/healthz
```

### Environment Issues
```bash
# Check environment variables
docker exec purviewx_app env | grep -E "(DATABASE_URL|ENTRA_|PURVIEWX_)"

# Test database connection
docker exec purviewx_app node -e "
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect().then(() => console.log('Connected')).catch(console.error);
"
```

### Performance Issues
```bash
# Monitor resource usage
docker stats purviewx_app

# Check PM2 status
docker exec purviewx_app pm2 status

# View PM2 logs
docker exec purviewx_app pm2 logs
```

## Next Steps

1. **Configure Microsoft Entra ID**: Set up app registration with required permissions
2. **Set up Database**: Configure Azure Database for PostgreSQL
3. **Configure Storage**: Set up Azure Storage for evidence storage
4. **Test Deployment**: Verify all health checks pass
5. **Monitor**: Set up monitoring and alerting

## Support

For detailed deployment instructions, see:
- [PRODUCTION-DEPLOYMENT.md](./PRODUCTION-DEPLOYMENT.md) - Comprehensive deployment guide
- [deploy/README.md](./deploy/README.md) - Azure deployment guide
- [deploy/DEPLOYMENT_CHECKLIST.md](./deploy/DEPLOYMENT_CHECKLIST.md) - Deployment checklist

## Security Notes

- Never commit `.env` files to version control
- Use Azure Key Vault for production secrets
- Enable HTTPS in production
- Regularly rotate secrets
- Monitor access logs
- Implement proper access controls
