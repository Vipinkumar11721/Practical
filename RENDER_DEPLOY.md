# Listings App - Render Deployment Guide

## Quick Start

### 1. Connect GitHub to Render
1. Go to [render.com](https://render.com/) and sign up / log in
2. Click **"New +"** → **"Web Service"**
3. Select **"Connect a repository"** and authorize GitHub
4. Choose the `Practical` repository
5. Fill in the deployment form:
   - **Name:** `listings-app` (or any name)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or Paid)

### 2. Set Environment Variables in Render
In the Render dashboard, under your service → **"Environment"**, add:

```
NODE_ENV=production
PORT=8080
ATLUSDB_URL=mongodb+srv://vk2386598_db_user:hI1XDB45DcmIXTb5@cluster0.m6jipkp.mongodb.net/listings?retryWrites=true&w=majority
SECRET=MySecureSessionSecret2024
CLOUD_NAME=dgwltwm00
CLOUD_API_KEY=268849863485512
CLOUD_API_SECRET=hPZab6iF_F3ieZtJr27d06rs17s
```

**⚠️ Important Security Note:**
- Do NOT commit `.env` with secrets to GitHub
- Always set these in Render's Environment Variables section
- After deployment, delete `.env` from your GitHub (or add it to `.gitignore`)

### 3. Configure MongoDB Atlas for Render
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to **Security** → **Network Access**
3. Add Render's IP to whitelist:
   - Click **"Add IP Address"**
   - Use `0.0.0.0/0` (allows all IPs) OR
   - Use Render's static IP (if on paid plan)

### 4. Deploy
Click **"Deploy"** in Render dashboard. Logs will show build and startup progress.

---

## Troubleshooting

### Build Fails: "npm: command not found"
- Ensure Node 18+ is installed locally
- Check `package.json` exists in repo root

### Port Already in Use
- Render sets `PORT` env var automatically; `app.js` uses `process.env.PORT || 8080` ✓

### MongoDB Connection Error
- Verify `ATLUSDB_URL` is correct and not URL-encoded twice
- Check your IP is whitelisted in Atlas Network Access
- Test connection: `node test-db.js` locally before pushing

### 403 / Deploy Rejected
- Ensure GitHub repo is public or Render has access
- Check your Render account has credits (free tier has limits)

### Session Store Error
- `connect-mongo` requires Atlas connection to work
- If Atlas is down, sessions won't persist (app will still start)

---

## Local Testing Before Deploy

```powershell
npm install
npm start
# Visit http://localhost:8080
```

If this works locally, it will work on Render.

---

## Post-Deployment

1. Visit your app: `https://your-service-name.onrender.com`
2. Check logs in Render dashboard if errors occur
3. For updates, push to GitHub and Render auto-redeploys (if enabled)

---

## Optional: Secure `.env`

Remove `.env` from GitHub (it's already in `.gitignore`):

```powershell
git rm --cached .env
git commit -m "Remove .env from tracking"
git push
```

Then set all variables in Render's Environment panel instead.
