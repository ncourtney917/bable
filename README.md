# Babble!

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

If this is your first time running the app, install dependencies by running: in the project directory
### `yarn install`

To start the app, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


# Set-Up
`npm install react-router-dom`
`npm install --save style-components`

# Architecture

This application uses a decoupled architecture:
- **Frontend**: React app deployed to Azure Static Web Apps
- **Backend API**: Data API Builder (DAB) running in Azure Container Apps
- **Database**: Azure SQL Database

## Deployment

### Prerequisites
- Azure CLI installed and logged in
- Docker installed locally
- Existing Azure SQL Database

### Quick Start
1. Follow the detailed deployment guide in `AZURE_DEPLOYMENT_GUIDE.md`
2. Update configuration files with your Azure resource URLs
3. Deploy both the Container App and Static Web App

### Configuration Files
- `dab-config.json`: Data API Builder configuration
- `Dockerfile`: Container definition for DAB
- `public/staticwebapp.config.json`: Static Web App routing configuration

### API Endpoints
- `POST /data-api/rest/Game/` - Create new game
- `GET /data-api/rest/Game/Id/{id}` - Get game details
- `GET /data-api/rest/GameLeaderboard?$filter=...` - Get leaderboard
- `POST /data-api/rest/GameLeaderboard/` - Submit score

## Cost Optimization

This application uses **Azure Container Instances** for maximum cost savings:

### Monthly Costs
- **Container Instance** (0.25 CPU, 0.5 GB): ~$7-10/month
- **Container Registry** (Basic): $5/month
- **Total**: ~$12-15/month

### Cost Comparison
| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| **Container Instances** | $8-12 | **Current** - Most cost-effective |
| Container Apps | $78-83 | Auto-scaling but expensive |
| App Service | $18 | Good middle ground |

### Cost Optimization Features
- Minimal resource allocation (0.25 CPU, 0.5 GB RAM)
- Auto-shutdown scripts available
- Scales to zero when not in use
- Basic Container Registry tier
