#!/bin/bash

# PurviewX GCC Docker Build and Deploy Script
# This script builds and pushes the Docker image to Azure Container Registry

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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Azure CLI is installed and user is logged in
if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed. Please install it first."
    exit 1
fi

if ! az account show &> /dev/null; then
    print_error "Not logged in to Azure CLI. Please run 'az login --cloud AzureUSGovernment' first."
    exit 1
fi

# Get user input
echo -e "${BLUE}🐳 PurviewX GCC Docker Build and Deploy${NC}"
echo ""

read -p "Enter your Azure Container Registry name: " ACR_NAME
read -p "Enter your resource group name: " RESOURCE_GROUP
read -p "Enter your app service name: " APP_SERVICE_NAME

# Get ACR login server
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer --output tsv 2>/dev/null)

if [ -z "$ACR_LOGIN_SERVER" ]; then
    print_error "Could not find ACR '$ACR_NAME'. Please check the name and try again."
    exit 1
fi

print_info "Found ACR: $ACR_LOGIN_SERVER"

# Build Docker image
print_info "Building Docker image..."
docker build -t purviewx:latest .

if [ $? -eq 0 ]; then
    print_status "Docker image built successfully"
else
    print_error "Failed to build Docker image"
    exit 1
fi

# Tag image for ACR
print_info "Tagging image for ACR..."
docker tag purviewx:latest $ACR_LOGIN_SERVER/purviewx:latest

print_status "Image tagged successfully"

# Login to ACR
print_info "Logging in to Azure Container Registry..."
az acr login --name $ACR_NAME

if [ $? -eq 0 ]; then
    print_status "Successfully logged in to ACR"
else
    print_error "Failed to login to ACR"
    exit 1
fi

# Push image to ACR
print_info "Pushing image to Azure Container Registry..."
docker push $ACR_LOGIN_SERVER/purviewx:latest

if [ $? -eq 0 ]; then
    print_status "Image pushed successfully to ACR"
else
    print_error "Failed to push image to ACR"
    exit 1
fi

# Restart App Service to pull new image
print_info "Restarting App Service to pull new image..."
az webapp restart --resource-group $RESOURCE_GROUP --name $APP_SERVICE_NAME

if [ $? -eq 0 ]; then
    print_status "App Service restarted successfully"
else
    print_warning "App Service restart failed, but image was pushed successfully"
fi

# Get app URL
APP_URL=$(az webapp show --resource-group $RESOURCE_GROUP --name $APP_SERVICE_NAME --query defaultHostName --output tsv)

# Display summary
echo ""
echo -e "${GREEN}🎉 Docker deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Summary:${NC}"
echo "ACR Name: $ACR_NAME"
echo "ACR Login Server: $ACR_LOGIN_SERVER"
echo "Image: $ACR_LOGIN_SERVER/purviewx:latest"
echo "App Service: $APP_SERVICE_NAME"
echo "App URL: https://$APP_URL"
echo ""
echo -e "${BLUE}🧪 Testing Commands:${NC}"
echo "Test API health: curl https://$APP_URL:3001/healthz"
echo "Test Worker health: curl https://$APP_URL:3002/healthz"
echo "Open in browser: https://$APP_URL"
echo ""
echo -e "${BLUE}📊 Monitoring Commands:${NC}"
echo "View logs: az webapp log tail --resource-group $RESOURCE_GROUP --name $APP_SERVICE_NAME"
echo "Check status: az webapp show --resource-group $RESOURCE_GROUP --name $APP_SERVICE_NAME --query state"
echo ""
echo -e "${YELLOW}⏳ Note: It may take 2-3 minutes for the new container to start and be ready.${NC}"
