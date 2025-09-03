# NFL Backend Deployment to Render

## Prerequisites
1. Render account (free tier available)
2. GitHub repository with your code
3. PostgreSQL database (can be created on Render)

## Step-by-Step Deployment

### 1. Create PostgreSQL Database on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "PostgreSQL"
3. Choose a name (e.g., `nfl-database`)
4. Select the free tier
5. Click "Create Database"
6. Note the connection details

### 2. Deploy Backend Service
1. In Render Dashboard, click "New" → "Web Service"
2. Connect your GitHub repository
3. Choose the `backend` folder as the root directory
4. Configure the service:
   - **Name**: `nfl-backend`
   - **Environment**: `Java`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/quickstart-0.0.1-SNAPSHOT.jar`
   - **Plan**: Free

### 3. Set Environment Variables
In the Render service settings, add these environment variables:
- `SPRING_DATASOURCE_URL`: (Get from your PostgreSQL database connection string)
- `SPRING_PROFILES_ACTIVE`: `production`
- `PORT`: `10000`

### 4. Alternative: Use render.yaml (Recommended)
Instead of manual configuration, you can use the included `render.yaml` file:
1. In Render Dashboard, click "New" → "Blueprint"
2. Connect your GitHub repository
3. Select the `render.yaml` file
4. Render will automatically create both the database and web service

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:port/db` |
| `SPRING_PROFILES_ACTIVE` | Spring profile | `production` |
| `PORT` | Server port | `10000` |

## Database Migration
If you need to migrate your existing data:
1. Export your current database
2. Import to the new Render PostgreSQL database
3. Update your frontend to use the new backend URL

## Frontend Configuration
Update your frontend's API calls to point to your new Render backend URL:
```javascript
// In fetches.js, change from:
const response = await fetch(`http://localhost:8080/api/...`);

// To:
const response = await fetch(`https://your-backend-name.onrender.com/api/...`);
```

## Troubleshooting
- Check Render service logs for errors
- Ensure all environment variables are set correctly
- Verify database connection string format
- Check that the build completes successfully

## Free Tier Limitations
- Service sleeps after 15 minutes of inactivity
- Cold start takes ~30 seconds
- Limited to 750 hours/month
- Database limited to 1GB storage
