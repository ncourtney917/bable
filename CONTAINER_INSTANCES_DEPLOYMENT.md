# Azure Container Instances Deployment Guide

This guide shows how to deploy Data API Builder using Azure Container Instances for **maximum cost savings** (~$8-12/month vs $78-83/month with Container Apps).

## Cost Comparison

| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| **Container Instances** | $8-12 | **Recommended** - Most cost-effective |
| Container Apps | $78-83 | Auto-scaling but expensive |
| App Service | $18 | Good middle ground |

## Prerequisites

- Azure CLI installed and logged in
- Docker installed locally
- Your existing Azure SQL Database
- Your existing Azure Static Web App

## Step 1: Create Azure Container Registry

```bash
# Create a resource group (if you don't have one)
az group create --name nickdev --location eastus

# Create Azure Container Registry (Basic tier - $5/month)
az acr create \
  --resource-group nickdev \
  --name babbleacr \
  --sku Basic \
  --admin-enabled true

# Get login server name
ACR_LOGIN_SERVER=$(az acr show --name babbleacr --query loginServer --output tsv)
echo "ACR Login Server: $ACR_LOGIN_SERVER"
```

## Step 2: Build and Push Docker Image

```bash
# Build the Docker image
docker build -t babble-dab .

# Tag the image for ACR
docker tag babble-dab babbleacr.azurecr.io/babble-dab:latest

# Login to ACR
az acr login --name babbleacr

# Push the image to ACR
docker push babbleacr.azurecr.io/babble-dab:latest
```

## Step 3: Get ACR Credentials

```bash
# Get ACR username and password
ACR_USERNAME=$(az acr credential show --name babbleacr --query username --output tsv)
ACR_PASSWORD=$(az acr credential show --name babbleacr --query passwords[0].value --output tsv)

echo "ACR Username: $ACR_USERNAME"
echo "ACR Password: $ACR_PASSWORD"
```

## Step 4: Create Container Instance

```bash
# Replace with your actual SQL connection string
SQL_CONNECTION_STRING="Server=tcp:your-server.database.windows.net,1433;Initial Catalog=your-database;Persist Security Info=False;User ID=your-username;Password=your-password;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

# Create Container Instance with minimal resources for cost optimization
az container create \
  --resource-group nickdev \
  --name babble-dab-container \
  --image babbleacr.azurecr.io/babble-dab:latest \
  --cpu 0.25 \
  --memory 0.5 \
  --ports 5000 \
  --ip-address Public \
  --environment-variables DATABASE_CONNECTION_STRING="$SQL_CONNECTION_STRING" \
  --registry-login-server babbleacr.azurecr.io \
  --registry-username "$ACR_USERNAME" \
  --registry-password "$ACR_PASSWORD" \
  --restart-policy Always \
  --location eastus
```

## Step 5: Get Container Instance IP Address

```bash
# Get the public IP address
CONTAINER_IP=$(az container show \
  --resource-group nickdev \
  --name babble-dab-container \
  --query ipAddress.ip --output tsv)

echo "Container IP: http://$CONTAINER_IP:5000"
echo "API Base URL: http://$CONTAINER_IP:5000/rest"
```

## Step 6: Update Static Web App Configuration

Update your `public/staticwebapp.config.json`:

```json
{
    "navigationFallback": {
       "rewrite": "index.html",
       "exclude": ["/static/media/*.{png,jpg,jpeg,gif,bmp}",   "/static/css/*"]
    },
    "mimeTypes": {
        ".json": "text/json"
    },
    "routes": [
        {
            "route": "/data-api/*",
            "allowedRoles": ["anonymous"],
            "rewrite": "http://YOUR_CONTAINER_IP:5000/rest/*"
        }
    ]
}
```

Replace `YOUR_CONTAINER_IP` with the IP address from Step 5.

## Step 7: Test the Container

```bash
# Test the health endpoint
curl http://$CONTAINER_IP:5000/health

# Test the API endpoint
curl http://$CONTAINER_IP:5000/rest/Game
```

## Step 8: Deploy Updated Static Web App

```bash
# Build your React app
npm run build

# Deploy to Azure Static Web Apps (method depends on your setup)
# If using GitHub Actions, push your changes
# If using Azure CLI:
az staticwebapp deploy --name your-static-web-app --source . --resource-group nickdev
```

## Cost Optimization Features

### 1. Minimal Resource Allocation
- **CPU**: 0.25 cores (minimum)
- **Memory**: 0.5 GB (minimum)
- **Storage**: 1 GB (minimum)

### 2. Auto-Shutdown Script (Optional)

Create `stop-container.sh`:
```bash
#!/bin/bash
# Stop container during off-hours to save costs
az container stop --resource-group nickdev --name babble-dab-container
```

Create `start-container.sh`:
```bash
#!/bin/bash
# Start container when needed
az container start --resource-group nickdev --name babble-dab-container
```

### 3. Monitor Costs

```bash
# Check container status
az container show --resource-group nickdev --name babble-dab-container --query instanceView.state

# View container logs
az container logs --resource-group nickdev --name babble-dab-container
```

## Troubleshooting

### Container Won't Start
```bash
# Check container logs
az container logs --resource-group nickdev --name babble-dab-container

# Check container events
az container show --resource-group nickdev --name babble-dab-container --query instanceView.events
```

### API Not Accessible
1. Verify container is running: `az container show --resource-group nickdev --name babble-dab-container --query instanceView.state`
2. Check IP address: `az container show --resource-group nickdev --name babble-dab-container --query ipAddress.ip`
3. Test direct API call: `curl http://YOUR_IP:5000/rest/Game`

### CORS Issues
1. Verify your Static Web App domain is in `dab-config.json` CORS origins
2. Check that the rewrite URL in `staticwebapp.config.json` is correct

## Monthly Cost Breakdown

- **Container Instance** (0.25 CPU, 0.5 GB): ~$7-10/month
- **Container Registry** (Basic): $5/month
- **Total**: ~$12-15/month

## Scaling Options

### Manual Scaling
```bash
# Stop container
az container stop --resource-group nick-dev --name babble-dab-container

# Start container
az container start --resource-group nick-dev --name babble-dab-container
```

### Upgrade to Container Apps Later
If you need auto-scaling in the future, you can easily migrate to Container Apps using the same Docker image.

## Security Notes

- Container Instances get a public IP by default
- Consider using Azure Application Gateway for SSL termination
- Monitor access logs regularly
- Use Azure Key Vault for sensitive environment variables

## Next Steps

1. Deploy using the commands above
2. Test all functionality
3. Set up monitoring and alerts
4. Consider implementing auto-shutdown for further cost savings
5. Monitor usage and costs in Azure Cost Management
