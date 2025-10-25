# PurviewX GCC Tenant Deployment Guide

This guide provides step-by-step instructions for deploying PurviewX to a GCC (Government Community Cloud) tenant environment.

## Prerequisites

### Required Access
- **Azure Subscription** with GCC access
- **Global Administrator** or **Application Administrator** role in GCC tenant
- **Azure CLI** installed and configured
- **Docker** installed locally
- **Git** access to the PurviewX repository

### Required Resources
- Azure Container Registry (ACR)
- Azure Database for PostgreSQL
- Azure App Service (Linux)
- Azure Key Vault (recommended)
- Azure Storage Account

## Step 1: Prepare Your Local Environment

### 1.1 Clone and Setup
```bash
# Clone the repository
git clone https://github.com/natlandryjr/PurviewX.git
cd PurviewX

# Install dependencies
npm install

# Build the application locally (optional, for testing)
npm run build
```

### 1.2 Configure Environment
```bash
# Copy GCC environment template
cp env.gcc .env

# Edit the environment file with your values
nano .env
```

**Required Environment Variables:**
```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@your-server.postgres.database.usgovcloudapi.net:5432/purviewx_db?sslmode=require

# Microsoft Entra ID Configuration (GCC)
ENTRA_CLIENT_ID=your-gcc-client-id
ENTRA_TENANT_ID=your-gcc-tenant-id
ENTRA_CLIENT_SECRET=your-gcc-client-secret

# Cloud Environment
PURVIEWX_CLOUD=GCC

# AI Services (optional)
GEMINI_API_KEY=your-gemini-api-key

# Azure Storage (GCC)
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=yourstorageaccount;AccountKey=your-storage-key;EndpointSuffix=core.usgovcloudapi.net

# Security Settings
SESSION_SECRET=your-session-secret
JWT_SECRET=your-jwt-secret
```

## Step 2: Azure Infrastructure Setup

### 2.1 Login to Azure CLI
```bash
# Login to Azure (GCC)
az login --cloud AzureUSGovernment

# Verify you're in the correct cloud
az cloud show
```

### 2.2 Create Resource Group
```bash
# Set variables
RESOURCE_GROUP="purviewx-rg"
LOCATION="usgovvirginia"  # or usgovtexas, usgovarizona

# Create resource group
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION
```

### 2.3 Create Azure Container Registry
```bash
# Set ACR variables
ACR_NAME="purviewxacr$(date +%s)"  # Must be globally unique

# Create ACR
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic \
  --admin-enabled true

# Get ACR login server
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer --output tsv)
echo "ACR Login Server: $ACR_LOGIN_SERVER"
```

### 2.4 Create Azure Database for PostgreSQL
```bash
# Set database variables
DB_SERVER_NAME="purviewx-db-$(date +%s)"
DB_NAME="purviewx_db"
DB_USERNAME="purviewx_admin"
DB_PASSWORD="YourSecurePassword123!"

# Create PostgreSQL server
az postgres flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER_NAME \
  --location $LOCATION \
  --admin-user $DB_USERNAME \
  --admin-password $DB_PASSWORD \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --public-access 0.0.0.0 \
  --storage-size 32

# Create database
az postgres flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $DB_SERVER_NAME \
  --database-name $DB_DB_NAME

# Get connection string
DB_CONNECTION_STRING="postgresql://$DB_USERNAME:$DB_PASSWORD@$DB_SERVER_NAME.postgres.database.usgovcloudapi.net:5432/$DB_NAME?sslmode=require"
echo "Database Connection String: $DB_CONNECTION_STRING"
```

### 2.5 Create Azure Storage Account
```bash
# Set storage variables
STORAGE_ACCOUNT="purviewxstorage$(date +%s)"

# Create storage account
az storage account create \
  --resource-group $RESOURCE_GROUP \
  --name $STORAGE_ACCOUNT \
  --location $LOCATION \
  --sku Standard_LRS

# Get storage connection string
STORAGE_CONNECTION_STRING=$(az storage account show-connection-string \
  --resource-group $RESOURCE_GROUP \
  --name $STORAGE_ACCOUNT \
  --query connectionString \
  --output tsv)
echo "Storage Connection String: $STORAGE_CONNECTION_STRING"
```

### 2.6 Create Azure Key Vault (Recommended)
```bash
# Set Key Vault variables
KEY_VAULT_NAME="purviewx-kv-$(date +%s)"

# Create Key Vault
az keyvault create \
  --resource-group $RESOURCE_GROUP \
  --name $KEY_VAULT_NAME \
  --location $LOCATION

# Store secrets in Key Vault
az keyvault secret set \
  --vault-name $KEY_VAULT_NAME \
  --name "database-url" \
  --value "$DB_CONNECTION_STRING"

az keyvault secret set \
  --vault-name $KEY_VAULT_NAME \
  --name "storage-connection-string" \
  --value "$STORAGE_CONNECTION_STRING"
```

## Step 3: Microsoft Entra ID App Registration

### 3.1 Create App Registration
1. **Navigate to Azure Portal** (GCC): https://portal.azure.us
2. **Go to Microsoft Entra ID** → **App registrations**
3. **Click "New registration"**
4. **Configure:**
   - Name: `PurviewX Application`
   - Supported account types: `Accounts in this organizational directory only`
   - Redirect URI: `Single-page application (SPA)` → `https://your-app-name.azurewebsites.net`
5. **Click "Register"**

### 3.2 Record App Registration Details
```bash
# Note these values from the Azure Portal:
CLIENT_ID="your-client-id-from-portal"
TENANT_ID="your-tenant-id-from-portal"
```

### 3.3 Create Client Secret
1. **Go to "Certificates & secrets"**
2. **Click "New client secret"**
3. **Configure:**
   - Description: `PurviewX Production Secret`
   - Expires: `24 months`
4. **Click "Add"**
5. **Copy the secret VALUE immediately**

```bash
# Store the client secret
CLIENT_SECRET="your-client-secret-value"
```

### 3.4 Configure API Permissions
1. **Go to "API permissions"**
2. **Click "Add a permission"**
3. **Select "Microsoft Graph"**
4. **Add these Delegated permissions:**
   - `Application.Read.All`
   - `Directory.Read.All`
   - `Policy.Read.All`
   - `InformationProtectionPolicy.ReadWrite`
   - `DataLossPreventionPolicy.ReadWrite`
   - `RecordsManagement.ReadWrite.All`
   - `eDiscovery.ReadWrite.All`
   - `Audit.ReadWrite.All`
5. **Click "Grant admin consent for [Your Tenant]"**

## Step 4: Build and Push Docker Image

### 4.1 Build Docker Image
```bash
# Build the image
docker build -t purviewx:latest .

# Tag for ACR
docker tag purviewx:latest $ACR_LOGIN_SERVER/purviewx:latest
```

### 4.2 Login to ACR and Push
```bash
# Login to ACR
az acr login --name $ACR_NAME

# Push image to ACR
docker push $ACR_LOGIN_SERVER/purviewx:latest
```

## Step 5: Deploy to Azure App Service

### 5.1 Create App Service Plan
```bash
# Set App Service variables
APP_SERVICE_PLAN="purviewx-plan"
APP_NAME="purviewx-app-$(date +%s)"

# Create App Service Plan
az appservice plan create \
  --resource-group $RESOURCE_GROUP \
  --name $APP_SERVICE_PLAN \
  --location $LOCATION \
  --is-linux \
  --sku B1
```

### 5.2 Create Web App
```bash
# Create Web App
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --name $APP_NAME \
  --deployment-container-image-name $ACR_LOGIN_SERVER/purviewx:latest
```

### 5.3 Configure App Settings
```bash
# Configure environment variables
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings \
    NODE_ENV=production \
    DATABASE_URL="$DB_CONNECTION_STRING" \
    ENTRA_CLIENT_ID="$CLIENT_ID" \
    ENTRA_TENANT_ID="$TENANT_ID" \
    ENTRA_CLIENT_SECRET="$CLIENT_SECRET" \
    PURVIEWX_CLOUD=GCC \
    GEMINI_API_KEY="your-gemini-api-key" \
    AZURE_STORAGE_CONNECTION_STRING="$STORAGE_CONNECTION_STRING" \
    SESSION_SECRET="your-session-secret" \
    JWT_SECRET="your-jwt-secret"
```

### 5.4 Configure Container Registry Access
```bash
# Enable continuous deployment
az webapp config container set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --docker-custom-image-name $ACR_LOGIN_SERVER/purviewx:latest

# Configure ACR access
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings \
    DOCKER_REGISTRY_SERVER_URL=https://$ACR_LOGIN_SERVER \
    DOCKER_REGISTRY_SERVER_USERNAME=$ACR_NAME \
    DOCKER_REGISTRY_SERVER_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv)
```

## Step 6: Configure Security

### 6.1 Enable HTTPS Only
```bash
# Enable HTTPS only
az webapp update \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --https-only true
```

### 6.2 Configure CORS (if needed)
```bash
# Configure CORS for your domain
az webapp cors add \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --allowed-origins "https://your-domain.com"
```

## Step 7: Test Deployment

### 7.1 Get App URL
```bash
# Get the app URL
APP_URL=$(az webapp show --resource-group $RESOURCE_GROUP --name $APP_NAME --query defaultHostName --output tsv)
echo "App URL: https://$APP_URL"
```

### 7.2 Test Health Endpoints
```bash
# Test health endpoints
curl https://$APP_URL:3001/healthz
curl https://$APP_URL:3002/healthz
```

### 7.3 Access the Application
1. **Open browser** and navigate to: `https://$APP_URL`
2. **Verify** the PurviewX wizard loads
3. **Test** the login functionality
4. **Check** that all wizard steps work correctly

## Step 8: Post-Deployment Configuration

### 8.1 Update App Registration Redirect URI
1. **Go to Azure Portal** → **Microsoft Entra ID** → **App registrations**
2. **Select your PurviewX app**
3. **Go to "Authentication"**
4. **Update Redirect URI** to: `https://$APP_URL`

### 8.2 Configure Custom Domain (Optional)
```bash
# Add custom domain
az webapp config hostname add \
  --resource-group $RESOURCE_GROUP \
  --webapp-name $APP_NAME \
  --hostname your-domain.com
```

### 8.3 Set Up Monitoring
```bash
# Enable Application Insights
az monitor app-insights component create \
  --resource-group $RESOURCE_GROUP \
  --app $APP_NAME \
  --location $LOCATION \
  --kind web
```

## Step 9: Verification Checklist

### ✅ Infrastructure
- [ ] Resource group created
- [ ] Container registry created and image pushed
- [ ] PostgreSQL database created and accessible
- [ ] Storage account created
- [ ] Key Vault created (if used)

### ✅ Application
- [ ] App Service created and running
- [ ] Environment variables configured
- [ ] Container image deployed
- [ ] Health endpoints responding

### ✅ Security
- [ ] App registration created
- [ ] API permissions granted
- [ ] Client secret created
- [ ] HTTPS enabled
- [ ] Redirect URI configured

### ✅ Functionality
- [ ] Web UI accessible
- [ ] Login screen loads
- [ ] Wizard steps functional
- [ ] Database connectivity confirmed
- [ ] Microsoft Graph API access working

## Troubleshooting

### Common Issues

#### Container Won't Start
```bash
# Check container logs
az webapp log tail --resource-group $RESOURCE_GROUP --name $APP_NAME

# Check app settings
az webapp config appsettings list --resource-group $RESOURCE_GROUP --name $APP_NAME
```

#### Database Connection Issues
```bash
# Test database connectivity
az postgres flexible-server show-connection-string \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER_NAME \
  --admin-user $DB_USERNAME \
  --admin-password $DB_PASSWORD
```

#### Authentication Issues
1. **Verify** App Registration permissions
2. **Check** Redirect URI matches app URL
3. **Confirm** Client secret is correct
4. **Ensure** Admin consent is granted

## Next Steps

1. **Configure your Microsoft 365 tenant** with the required Purview features
2. **Test the complete wizard flow** with your actual data
3. **Set up monitoring and alerting** for production
4. **Configure backup and disaster recovery**
5. **Train your team** on using PurviewX

## Support

For additional help:
- Check the main [PRODUCTION-DEPLOYMENT.md](./PRODUCTION-DEPLOYMENT.md)
- Review [README-PRODUCTION.md](./README-PRODUCTION.md)
- Contact your Azure support team for infrastructure issues

---

**🎉 Congratulations!** Your PurviewX application is now deployed to your GCC tenant and ready for use!
