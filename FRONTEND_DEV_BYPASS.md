# Frontend Development Authentication Bypass

## Problem
When developing frontend in Codespaces or local environment, you need access to all authenticated pages without setting up Azure backend and MongoDB authentication.

## Solution
We've implemented a development bypass mode that allows frontend developers to skip authentication.

## How to Enable Bypass Mode

### Method 1: Using .env File (Recommended for Codespaces)

1. Create a `.env` file in the project root (or copy from `.env.example`)
2. Add this line:
   ```
   VITE_DEV_BYPASS=true
   ```
3. Restart the development server
4. Now you can access all pages without login!

### Method 2: Browser Console Quick Access

If you don't want to use .env, you can manually set the session in browser console:

```javascript
// Run this in browser console (F12)
sessionStorage.setItem('authToken', 'dev-bypass-token');
sessionStorage.setItem('currentUser', JSON.stringify({
  id: 'dev-user-id',
  name: 'Frontend Developer',
  email: 'dev@frontend.local',
  college: 'IIT Delhi',
  verified: true,
  trustScore: 100,
  avatar: null
}));
// Then refresh the page
```

## How It Works

When `VITE_DEV_BYPASS=true`:
- The `ProtectedRoute` component automatically creates mock session data
- All protected routes become accessible
- Mock user data is used for UI display
- No backend API calls are blocked (they just won't return real data)

**Mock User Data Created:**
- Name: Frontend Developer
- Email: dev@frontend.local
- College: IIT Delhi
- Verified: Yes
- Trust Score: 100

## Accessible Routes in Bypass Mode

With bypass enabled, you can access:
- ✅ `/marketplace` - Browse listings
- ✅ `/product/:id` - View products
- ✅ `/chat/:id` - Chat interface
- ✅ `/messages` - Messages page
- ✅ `/sell` - Sell item form
- ✅ `/profile` - User profile
- ✅ `/edit-profile` - Edit profile
- ✅ `/my-listings` - My listings
- ✅ `/favorites` - Favorites page
- ✅ `/settings` - Settings page
- ✅ `/help` - Help center

## Important Notes

⚠️ **WARNING**: 
- **NEVER** enable this in production
- **NEVER** commit `.env` with `VITE_DEV_BYPASS=true` to the repository
- This is **ONLY** for frontend development/testing
- Backend API calls will still fail without proper backend setup

## Disabling Bypass Mode

To disable and require real authentication:

1. **Option 1**: Remove the `.env` file
2. **Option 2**: Set `VITE_DEV_BYPASS=false` in `.env`
3. **Option 3**: Delete the environment variable
4. Restart the dev server

## For Production Deployment

The production build automatically ignores this bypass:
- Azure deployment uses production environment variables
- No `.env` file is deployed
- Real authentication is enforced

## Troubleshooting

**Issue**: Still getting redirected to login
- **Solution**: Make sure you restarted the dev server after changing `.env`
- **Solution**: Check browser console for the environment variable: `import.meta.env.VITE_DEV_BYPASS`

**Issue**: API calls failing
- **Solution**: This is normal! The bypass only skips authentication, not backend connectivity
- **Solution**: For full testing, either:
  - Use mock data in the frontend
  - Set up local backend
  - Point `VITE_API_URL` to development backend

## Example Codespace Setup

```bash
# 1. Clone the repository in Codespace
git clone https://github.com/Jhakeshav1/campusX.git
cd campusX

# 2. Create .env file
echo "VITE_DEV_BYPASS=true" > .env

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Open browser - you can now access all pages!
```

## Security Notice

This bypass mechanism:
- ✅ Only works in development (`import.meta.env` variables)
- ✅ Has no effect on production builds
- ✅ Cannot bypass real backend authentication
- ✅ Only allows frontend UI testing

The backend API at Azure still requires proper authentication tokens for real operations.
