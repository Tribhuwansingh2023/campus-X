# Vercel Deployment - Environment Variable Setup

## ⚠️ IMPORTANT: Set Environment Variable in Vercel

To prevent network permission prompts and ensure the app works correctly on Vercel, you MUST set the following environment variable in your Vercel project settings:

### Steps:

1. Go to your Vercel project dashboard: https://vercel.com/jhakeshav1/campus-x
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:

```
Name: VITE_API_URL
Value: https://campusx-rg-axgefjeqgae2bpfs.eastasia-01.azurewebsites.net
Environment: Production, Preview
```

4. **Redeploy** your application for the changes to take effect

### Why This is Needed:

- Without this environment variable, the app will try to connect to `localhost:5000` in production
- This causes browser security errors and network permission prompts
- The `.env.production` file in this repo provides a fallback, but Vercel environment variables take precedence

### Verification:

After deployment, open the browser console on your Vercel site and check:
```javascript
console.log(import.meta.env.VITE_API_URL);
```

It should show: `https://campusx-rg-axgefjeqgae2bpfs.eastasia-01.azurewebsites.net`

---

## Local Development

For local development, the `.env` file already has:
```
VITE_API_URL=http://localhost:5000
```

This allows you to run the frontend and backend locally without issues.
