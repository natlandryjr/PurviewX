# PurviewX GCC Deployment - Quick Start

## 🚀 Automated Setup (Recommended)

### Option 1: Automated Azure Setup
```bash
# Run the automated setup script
./setup-gcc-azure.sh

# Follow the prompts and save the output
# The script will create all Azure resources automatically
```

### Option 2: Manual Setup
Follow the detailed guide: [GCC-DEPLOYMENT-GUIDE.md](./GCC-DEPLOYMENT-GUIDE.md)

## 📋 Prerequisites Checklist

- [ ] **Azure Subscription** with GCC access
- [ ] **Global Administrator** role in GCC tenant
- [ ] **Azure CLI** installed and configured
- [ ] **Docker** installed locally
- [ ] **Git** access to PurviewX repository

## 🔧 Quick Commands

### 1. Prepare Environment
```bash
# Clone repository
git clone https://github.com/natlandryjr/PurviewX.git
cd PurviewX

# Install dependencies
npm install

# Configure environment
cp env.gcc .env
# Edit .env with your values
```

### 2. Build and Deploy
```bash
# Build Docker image
docker build -t purviewx:latest .

# Tag for ACR
docker tag purviewx:latest <ACR_LOGIN_SERVER>/purviewx:latest

# Login to ACR
az acr login --name <ACR_NAME>

# Push image
docker push <ACR_LOGIN_SERVER>/purviewx:latest
```

### 3. Configure App Service
```bash
# Set app settings
az webapp config appsettings set \
  --resource-group <RESOURCE_GROUP> \
  --name <APP_NAME> \
  --settings \
    NODE_ENV=production \
    DATABASE_URL="<DATABASE_CONNECTION_STRING>" \
    ENTRA_CLIENT_ID="<CLIENT_ID>" \
    ENTRA_TENANT_ID="<TENANT_ID>" \
    ENTRA_CLIENT_SECRET="<CLIENT_SECRET>" \
    PURVIEWX_CLOUD=GCC
```

## 🔐 Microsoft Entra ID Setup

### Required Steps:
1. **Create App Registration** in Azure Portal (GCC)
2. **Set Redirect URI** to your App Service URL
3. **Configure API Permissions:**
   - `Application.Read.All`
   - `Directory.Read.All`
   - `Policy.Read.All`
   - `InformationProtectionPolicy.ReadWrite`
   - `DataLossPreventionPolicy.ReadWrite`
   - `RecordsManagement.ReadWrite.All`
   - `eDiscovery.ReadWrite.All`
   - `Audit.ReadWrite.All`
4. **Grant Admin Consent**

## 🧪 Testing

### Health Checks
```bash
# Test API health
curl https://<APP_URL>:3001/healthz

# Test Worker health
curl https://<APP_URL>:3002/healthz

# Test Web UI
curl -I https://<APP_URL>
```

### Browser Testing
1. Open `https://<APP_URL>` in browser
2. Verify login screen loads
3. Test wizard functionality
4. Check all steps work correctly

## 📊 Monitoring

### Check Logs
```bash
# View application logs
az webapp log tail --resource-group <RESOURCE_GROUP> --name <APP_NAME>

# Download logs
az webapp log download --resource-group <RESOURCE_GROUP> --name <APP_NAME>
```

### Health Endpoints
- **API Health**: `https://<APP_URL>:3001/healthz`
- **Worker Health**: `https://<APP_URL>:3002/healthz`
- **Metrics**: `https://<APP_URL>:3001/metrics`

## 🚨 Troubleshooting

### Common Issues

#### Container Won't Start
```bash
# Check container logs
az webapp log tail --resource-group <RESOURCE_GROUP> --name <APP_NAME>

# Check app settings
az webapp config appsettings list --resource-group <RESOURCE_GROUP> --name <APP_NAME>
```

#### Database Connection Issues
```bash
# Test database connectivity
az postgres flexible-server show-connection-string \
  --resource-group <RESOURCE_GROUP> \
  --name <DB_SERVER_NAME> \
  --admin-user <DB_USERNAME> \
  --admin-password <DB_PASSWORD>
```

#### Authentication Issues
1. Verify App Registration permissions
2. Check Redirect URI matches app URL
3. Confirm Client secret is correct
4. Ensure Admin consent is granted

## 📚 Documentation

- **[GCC-DEPLOYMENT-GUIDE.md](./GCC-DEPLOYMENT-GUIDE.md)** - Detailed step-by-step guide
- **[PRODUCTION-DEPLOYMENT.md](./PRODUCTION-DEPLOYMENT.md)** - General production guide
- **[README-PRODUCTION.md](./README-PRODUCTION.md)** - Quick reference

## 🆘 Support

For issues:
1. Check the detailed [GCC-DEPLOYMENT-GUIDE.md](./GCC-DEPLOYMENT-GUIDE.md)
2. Review troubleshooting section
3. Check Azure App Service logs
4. Verify all environment variables are set correctly

---

**🎉 Ready to deploy!** Follow the automated setup script for the fastest deployment experience.
