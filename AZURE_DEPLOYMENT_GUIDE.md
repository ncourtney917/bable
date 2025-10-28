# Azure Container Instances Deployment Guide (Cost-Optimized)

This guide walks you through deploying the Data API Builder (DAB) to Azure Container Instances for **maximum cost savings** (~$8-12/month vs $78-83/month with Container Apps).

## Cost Comparison

| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| **Container Instances** | $8-12 | **Recommended** - Most cost-effective |
| Container Apps | $78-83 | Auto-scaling but expensive |
| App Service | $18 | Good middle ground |

## Prerequisites

- Azure CLI installed and logged in
- Docker installed locally (for building container image)
- Your existing Azure Static Web App
- Your existing Azure SQL Database

## Step 1: Create Azure Container Registry

```bash
# Create a resource group (if you don't have one)
az group create --name babble-rg --location eastus

# Create Azure Container Registry (Basic tier - $5/month)
az acr create \
  --resource-group babble-rg \
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
  --resource-group babble-rg \
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
  --resource-group babble-rg \
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
az staticwebapp deploy --name your-static-web-app --source . --resource-group babble-rg
```

## Step 9: Test the Migration

1. Visit your Static Web App URL
2. Test creating a new game
3. Test playing an existing game
4. Test submitting to leaderboard
5. Check browser console for any CORS errors

## Troubleshooting

### Common Issues

1. **CORS Errors**: 
   - Ensure your Static Web App domain is in the CORS origins list in `dab-config.json`
   - Check that the Container App URL is correct in `staticwebapp.config.json`

2. **Database Connection Issues**:
   - Verify the connection string is correct
   - Ensure your SQL Database allows connections from Azure services
   - Check firewall rules

3. **Container App Not Starting**:
   - Check Container App logs in Azure Portal
   - Verify the Docker image was built and pushed correctly
   - Ensure environment variables are set correctly

### Useful Commands

```bash
# View Container App logs
az containerapp logs show --name your-dab-app --resource-group your-resource-group

# Update Container App environment variables
az containerapp update \
  --name your-dab-app \
  --resource-group your-resource-group \
  --set-env-vars DATABASE_CONNECTION_STRING="new-connection-string"

# Restart Container App
az containerapp restart --name your-dab-app --resource-group your-resource-group
```

## Cleanup (After Successful Migration)

1. Remove the `swa-db-connections` folder from your project
2. Disconnect the old Database Connections feature in Azure Portal:
   - Go to your Static Web App in Azure Portal
   - Navigate to "Database connections" in the left menu
   - Click "Disconnect" to remove the old connection

## Cost Considerations

- Container Apps Environment: ~$0.10/hour when running
- Container App: Scales to zero when not in use
- Container Registry: ~$5/month for Basic tier
- Consider using Azure Container Instances for even lower cost if you don't need advanced features
