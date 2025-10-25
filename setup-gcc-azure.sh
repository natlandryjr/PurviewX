#!/bin/bash

# PurviewX GCC Azure Infrastructure Setup Script
# This script automates the creation of Azure resources for PurviewX in GCC

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is logged in
if ! az account show &> /dev/null; then
    print_error "Not logged in to Azure CLI. Please run 'az login --cloud AzureUSGovernment' first."
    exit 1
fi

# Get user input
echo -e "${BLUE}🚀 PurviewX GCC Azure Infrastructure Setup${NC}"
echo ""

read -p "Enter resource group name (default: purviewx-rg): " RESOURCE_GROUP
RESOURCE_GROUP=${RESOURCE_GROUP:-purviewx-rg}

read -p "Enter location (usgovvirginia, usgovtexas, usgovarizona) [usgovvirginia]: " LOCATION
LOCATION=${LOCATION:-usgovvirginia}

read -p "Enter app name (will be used for App Service and ACR) [purviewx]: " APP_NAME
APP_NAME=${APP_NAME:-purviewx}

# Generate unique names
TIMESTAMP=$(date +%s)
ACR_NAME="${APP_NAME}acr${TIMESTAMP}"
DB_SERVER_NAME="${APP_NAME}-db-${TIMESTAMP}"
STORAGE_ACCOUNT="${APP_NAME}storage${TIMESTAMP}"
KEY_VAULT_NAME="${APP_NAME}-kv-${TIMESTAMP}"
APP_SERVICE_NAME="${APP_NAME}-app-${TIMESTAMP}"
APP_SERVICE_PLAN="${APP_NAME}-plan"

# Generate passwords
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
SESSION_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

print_info "Creating Azure resources..."

# Create resource group
print_info "Creating resource group: $RESOURCE_GROUP"
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

print_status "Resource group created"

# Create Azure Container Registry
print_info "Creating Azure Container Registry: $ACR_NAME"
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic \
  --admin-enabled true

ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer --output tsv)
print_status "ACR created: $ACR_LOGIN_SERVER"

# Create PostgreSQL database
print_info "Creating PostgreSQL database: $DB_SERVER_NAME"
az postgres flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER_NAME \
  --location $LOCATION \
  --admin-user purviewx_admin \
  --admin-password $DB_PASSWORD \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --public-access 0.0.0.0 \
  --storage-size 32

# Create database
az postgres flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $DB_SERVER_NAME \
  --database-name purviewx_db

DB_CONNECTION_STRING="postgresql://purviewx_admin:$DB_PASSWORD@$DB_SERVER_NAME.postgres.database.usgovcloudapi.net:5432/purviewx_db?sslmode=require"
print_status "PostgreSQL database created"

# Create storage account
print_info "Creating storage account: $STORAGE_ACCOUNT"
az storage account create \
  --resource-group $RESOURCE_GROUP \
  --name $STORAGE_ACCOUNT \
  --location $LOCATION \
  --sku Standard_LRS

STORAGE_CONNECTION_STRING=$(az storage account show-connection-string \
  --resource-group $RESOURCE_GROUP \
  --name $STORAGE_ACCOUNT \
  --query connectionString \
  --output tsv)
print_status "Storage account created"

# Create Key Vault
print_info "Creating Key Vault: $KEY_VAULT_NAME"
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

az keyvault secret set \
  --vault-name $KEY_VAULT_NAME \
  --name "session-secret" \
  --value "$SESSION_SECRET"

az keyvault secret set \
  --vault-name $KEY_VAULT_NAME \
  --name "jwt-secret" \
  --value "$JWT_SECRET"

print_status "Key Vault created and secrets stored"

# Create App Service Plan
print_info "Creating App Service Plan: $APP_SERVICE_PLAN"
az appservice plan create \
  --resource-group $RESOURCE_GROUP \
  --name $APP_SERVICE_PLAN \
  --location $LOCATION \
  --is-linux \
  --sku B1

print_status "App Service Plan created"

# Create Web App
print_info "Creating Web App: $APP_SERVICE_NAME"
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --name $APP_SERVICE_NAME \
  --deployment-container-image-name $ACR_LOGIN_SERVER/purviewx:latest

print_status "Web App created"

# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username --output tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv)

# Configure app settings
print_info "Configuring app settings..."
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_SERVICE_NAME \
  --settings \
    NODE_ENV=production \
    DATABASE_URL="$DB_CONNECTION_STRING" \
    PURVIEWX_CLOUD=GCC \
    AZURE_STORAGE_CONNECTION_STRING="$STORAGE_CONNECTION_STRING" \
    SESSION_SECRET="$SESSION_SECRET" \
    JWT_SECRET="$JWT_SECRET" \
    DOCKER_REGISTRY_SERVER_URL="https://$ACR_LOGIN_SERVER" \
    DOCKER_REGISTRY_SERVER_USERNAME="$ACR_USERNAME" \
    DOCKER_REGISTRY_SERVER_PASSWORD="$ACR_PASSWORD"

print_status "App settings configured"

# Enable HTTPS only
az webapp update \
  --resource-group $RESOURCE_GROUP \
  --name $APP_SERVICE_NAME \
  --https-only true

print_status "HTTPS enabled"

# Get app URL
APP_URL=$(az webapp show --resource-group $RESOURCE_GROUP --name $APP_SERVICE_NAME --query defaultHostName --output tsv)

# Display summary
echo ""
echo -e "${GREEN}🎉 Azure infrastructure setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Summary:${NC}"
echo "Resource Group: $RESOURCE_GROUP"
echo "Location: $LOCATION"
echo "ACR Name: $ACR_NAME"
echo "ACR Login Server: $ACR_LOGIN_SERVER"
echo "Database Server: $DB_SERVER_NAME"
echo "Storage Account: $STORAGE_ACCOUNT"
echo "Key Vault: $KEY_VAULT_NAME"
echo "App Service: $APP_SERVICE_NAME"
echo "App URL: https://$APP_URL"
echo ""
echo -e "${BLUE}🔐 Database Credentials:${NC}"
echo "Username: purviewx_admin"
echo "Password: $DB_PASSWORD"
echo "Connection String: $DB_CONNECTION_STRING"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo "1. Build and push Docker image:"
echo "   docker build -t purviewx:latest ."
echo "   docker tag purviewx:latest $ACR_LOGIN_SERVER/purviewx:latest"
echo "   az acr login --name $ACR_NAME"
echo "   docker push $ACR_LOGIN_SERVER/purviewx:latest"
echo ""
echo "2. Create Microsoft Entra ID App Registration:"
echo "   - Go to https://portal.azure.us"
echo "   - Navigate to Microsoft Entra ID > App registrations"
echo "   - Create new registration"
echo "   - Set redirect URI to: https://$APP_URL"
echo "   - Configure API permissions and grant admin consent"
echo ""
echo "3. Update app settings with your App Registration details:"
echo "   az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $APP_SERVICE_NAME --settings ENTRA_CLIENT_ID='your-client-id' ENTRA_TENANT_ID='your-tenant-id' ENTRA_CLIENT_SECRET='your-client-secret'"
echo ""
echo "4. Test your deployment:"
echo "   curl https://$APP_URL:3001/healthz"
echo "   Open https://$APP_URL in your browser"
echo ""
echo -e "${YELLOW}⚠️  Important: Save the database password and connection details securely!${NC}"
