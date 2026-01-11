# Railway Deployment Guide

This guide helps you deploy the Subscriptions application to Railway.

## Prerequisites

- Railway account (free or paid tier)
- GitHub account (Railway connects to GitHub)
- Telegram bot token (for notifications)

## Step 1: Push to GitHub

1. Initialize git repository (if not already):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub

3. Push to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/subscriptions.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Railway

### 2.1 Create MySQL Service

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Click "Add MySQL" service
5. Railway will create a MySQL database
6. Note the database connection URL from environment variables

### 2.2 Create Backend Service

1. In the same project, click "New Service" → "GitHub Repo"
2. Select your repository
3. Set root directory: `apps/backend`
4. Configure environment variables:

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | From MySQL service (click + to copy) |
| `JWT_SECRET` | Generate a random secret key |
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token |
| `TELEGRAM_WEBHOOK_URL` | Will be auto-generated |
| `FRONTEND_URL` | Your frontend URL (set after frontend deployment) |

5. Configure build settings:
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `node dist/main`

6. Click "Deploy"

7. After deployment, note the backend URL (e.g., `https://your-app.railway.app`)

## Step 3: Deploy Frontend to Railway

### 3.1 Create Frontend Service

1. Click "New Service" → "GitHub Repo"
2. Select your repository
3. Set root directory: `apps/frontend`
4. Configure environment variables:

| Variable | Value |
|----------|--------|
| `VITE_API_URL` | Your backend URL from Step 2.2 |

5. Configure build settings:
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `npx serve dist`
   - Runtime: `Node`

6. Click "Deploy"

7. After deployment, note the frontend URL

## Step 4: Configure Database Migrations

Since Railway creates a fresh database, you need to run migrations:

### Option A: Use Railway Console

1. Go to your backend service
2. Click "Console" tab
3. Run:
```bash
cd apps/backend
npx ts-node seed.ts
```

### Option B: Add Custom Command

Add a custom command to run during deployment:

In `package.json` (backend), add:
```json
{
  "scripts": {
    "migrate": "drizzle-kit push:mysql",
    "seed": "ts-node seed.ts"
  }
}
```

Then in Railway deploy settings:
- Build Command: `pnpm install && pnpm build && pnpm migrate && pnpm seed`

## Step 5: Connect Telegram Webhook

After both services are deployed:

1. Set the frontend URL in backend environment variables:
   - Update `FRONTEND_URL` to your frontend URL

2. Update the Telegram webhook:
   - In your backend service console:
   ```bash
   curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://YOUR_BACKEND_URL/api/telegram/webhook"
   ```

## Step 6: Create Admin User

If migrations were successful, your admin user is already created:

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password immediately after first login!

## Step 7: Verify Deployment

1. Visit your frontend URL
2. Login with admin credentials
3. Check dashboard loads
4. Create a test client
5. Test Telegram notifications (send `/start` to your bot)

## Environment Variables Reference

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://root:password@host:3306/railway` |
| `JWT_SECRET` | JWT signing secret | `your-random-secret-key` |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | `123456789:ABCDEF...` |
| `TELEGRAM_WEBHOOK_URL` | Webhook URL | `https://backend.railway.app/api/telegram/webhook` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://frontend.railway.app` |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://backend.railway.app/api` |

## Troubleshooting

### Backend Won't Start

- Check Railway logs in the "Logs" tab
- Verify database URL is correct
- Ensure all required environment variables are set

### Frontend Shows API Errors

- Verify `VITE_API_URL` points to the correct backend URL
- Check backend CORS configuration includes frontend URL
- Verify backend is running and accessible

### Telegram Webhook Not Working

- Ensure webhook URL is publicly accessible
- Verify bot token is correct
- Check backend logs for Telegram errors

### Database Connection Errors

- Verify database service is running
- Check DATABASE_URL format is correct
- Ensure database service is in the same project as backend

## Production Considerations

1. **Security**
   - Change default admin password
   - Use strong JWT_SECRET
   - Enable Railway HTTPS (default)

2. **Backups**
   - Railway automatically backs up databases
   - Consider manual database exports periodically

3. **Scaling**
   - Start with Railway's free tier
   - Upgrade to paid tier for production workloads

4. **Monitoring**
   - Monitor Railway metrics tab
   - Set up error tracking (Sentry, etc.)

5. **Domain**
   - Add custom domain in Railway settings
   - Update FRONTEND_URL and Telegram webhook

## Cost Estimate

| Service | Free Tier | Paid Tier |
|---------|-------------|------------|
| MySQL | $0 (512MB) | $5+/mo (2GB+) |
| Backend | $5/mo | $10+/mo |
| Frontend | $5/mo | $10+/mo |

**Total**: ~$10-25/month for production

## Next Steps

After successful deployment:

1. ✅ Change admin password
2. ✅ Add your Telegram bot webhook
3. ✅ Test all features (clients, subscriptions, payments, expenses)
4. ✅ Set up regular database backups
5. ✅ Monitor Railway logs for errors
6. ✅ Consider custom domain setup
