#!/bin/bash

# PurviewX Production Deployment Script
# This script builds and deploys the PurviewX application for production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="purviewx"
IMAGE_TAG="latest"
CONTAINER_NAME="purviewx_app"
ENVIRONMENT=${1:-"production"}

echo -e "${BLUE}🚀 Starting PurviewX Production Deployment${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"

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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if environment file exists
ENV_FILE="env.${ENVIRONMENT}"
if [ ! -f "$ENV_FILE" ]; then
    print_error "Environment file $ENV_FILE not found!"
    print_warning "Available environment files:"
    ls -la env.* 2>/dev/null || echo "No environment files found"
    exit 1
fi

print_status "Found environment file: $ENV_FILE"

# Build the Docker image
echo -e "${BLUE}🔨 Building Docker image...${NC}"
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

if [ $? -eq 0 ]; then
    print_status "Docker image built successfully"
else
    print_error "Failed to build Docker image"
    exit 1
fi

# Stop and remove existing container if it exists
if docker ps -a --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${YELLOW}🛑 Stopping existing container...${NC}"
    docker stop ${CONTAINER_NAME} || true
    docker rm ${CONTAINER_NAME} || true
    print_status "Existing container removed"
fi

# Create logs directory
mkdir -p logs

# Run the container
echo -e "${BLUE}🚀 Starting container...${NC}"
docker run -d \
    --name ${CONTAINER_NAME} \
    --restart unless-stopped \
    -p 3000:3000 \
    -p 3001:3001 \
    -p 3002:3002 \
    --env-file ${ENV_FILE} \
    -v $(pwd)/logs:/app/logs \
    ${IMAGE_NAME}:${IMAGE_TAG}

if [ $? -eq 0 ]; then
    print_status "Container started successfully"
else
    print_error "Failed to start container"
    exit 1
fi

# Wait for services to be ready
echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Health check
echo -e "${BLUE}🔍 Performing health checks...${NC}"

# Check API health
if curl -f http://localhost:3001/healthz > /dev/null 2>&1; then
    print_status "API health check passed"
else
    print_warning "API health check failed"
fi

# Check Worker health
if curl -f http://localhost:3002/healthz > /dev/null 2>&1; then
    print_status "Worker health check passed"
else
    print_warning "Worker health check failed"
fi

# Check Web UI
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_status "Web UI is accessible"
else
    print_warning "Web UI health check failed"
fi

# Display container status
echo -e "${BLUE}📊 Container Status:${NC}"
docker ps --filter name=${CONTAINER_NAME} --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Display logs
echo -e "${BLUE}📋 Recent logs:${NC}"
docker logs --tail 20 ${CONTAINER_NAME}

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}🌐 Web UI: http://localhost:3000${NC}"
echo -e "${BLUE}🔍 API Health: http://localhost:3001/healthz${NC}"
echo -e "${BLUE}⚙️  Worker Health: http://localhost:3002/healthz${NC}"
echo -e "${BLUE}📊 Metrics: http://localhost:3001/metrics${NC}"

# Display environment-specific information
case $ENVIRONMENT in
    "gcc")
        echo -e "${YELLOW}🇺🇸 GCC Environment Configuration${NC}"
        echo -e "${YELLOW}Make sure your Microsoft Entra ID app registration is configured for GCC${NC}"
        ;;
    "gcc-high")
        echo -e "${YELLOW}🇺🇸 GCC High Environment Configuration${NC}"
        echo -e "${YELLOW}Make sure your Microsoft Entra ID app registration is configured for GCC High${NC}"
        ;;
    *)
        echo -e "${YELLOW}🌍 Commercial Environment Configuration${NC}"
        ;;
esac

echo -e "${BLUE}📝 Next steps:${NC}"
echo -e "1. Update your environment variables in ${ENV_FILE}"
echo -e "2. Configure your Microsoft Entra ID app registration"
echo -e "3. Set up your database connection"
echo -e "4. Test the application functionality"
