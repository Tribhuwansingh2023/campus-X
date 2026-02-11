# 🚀 Vercel Deployment Instructions

## ✅ Pre-Deployment Checklist

All hardcoded localhost URLs have been removed and replaced with environment variables.

### What Was Fixed:
1. ✅ `vite.config.ts` - Changed `host: "::"` to `host: "localhost"` (dev only)
2. ✅ All API calls use `import.meta.env.VITE_API_URL` with production fallback
3. ✅ No WebSocket/Socket.io connections (no network permission required)
4. ✅ Created `.env` (local) and `.env.production` (production) files

## 📝 Environment Variables to Set in Vercel

Go to your Vercel project settings → Environment Variables and add:

```
VITE_API_URL=https://campusx-rg-axgefjeqgae2bpfs.eastasia-01.azurewebsites.net
```

**Important:** Set this for **Production**, **Preview**, and **Development** environments.

## 🔄 Deployment Steps

1. **Commit and Push:**
   ```bash
   git add .
   git commit -m "fix: remove localhost URLs for Vercel deployment"
   git push origin main
   ```

2. **Vercel will auto-deploy** (if connected to GitHub)

3. **Or manually deploy:**
   ```bash
   vercel --prod
   ```

## 🎯 What This Fixes:

- ❌ **Before:** Browser asked for "Look for and connect to any device on your local network" permission
- ✅ **After:** No permission prompt - all API calls go to production backend URL

## 🧪 Testing After Deployment:

1. Open your Vercel deployment URL
2. Try to view product details
3. **Should NOT** see network permission prompt
4. **Should** successfully connect to backend API

## 📊 Current Configuration:

- **Frontend (Vercel):** campus-x-tan.vercel.app
- **Backend (Azure):** campusx-rg-axgefjeqgae2bpfs.eastasia-01.azurewebsites.net
- **Local Dev:** Uses `localhost:5000` from `.env` file

---

**Note:** The `.env.production` file is already configured with the correct production URL. Vercel will use this automatically during build.
