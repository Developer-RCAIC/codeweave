# CodeWeave Deployment Guide 🚀

## Quick Vercel Deployment

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Deploy CodeWeave to Vercel"
git push origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your `codeweave-new` repository
4. Configure environment variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=codeweave-b125f.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=codeweave-b125f
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=codeweave-b125f.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
   GITHUB_TOKEN=your_github_models_token_here
   ```
5. Click "Deploy"

### Step 3: Configure Custom Domain (Optional)
- Add your custom domain in Vercel dashboard
- Update Firebase Auth authorized domains to include your Vercel domain

## Benefits of Vercel for CodeWeave

✅ **Perfect for Next.js** - Made by the same team  
✅ **Automatic deployments** - Every push triggers a new deployment  
✅ **Edge functions** - API routes run on the edge for better performance  
✅ **Preview deployments** - Every PR gets a preview URL  
✅ **Analytics** - Built-in performance monitoring  
✅ **Zero configuration** - Works out of the box  

## Environment Variables Required

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=codeweave-b125f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=codeweave-b125f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=codeweave-b125f.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# GitHub Models API
GITHUB_TOKEN=your_github_models_token
```

## Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Troubleshooting

### Common Issues:
1. **Build fails** - Check environment variables are set
2. **Firebase Auth errors** - Ensure authorized domains include your Vercel domain
3. **API errors** - Verify GITHUB_TOKEN is valid and has access to GitHub Models

### Support:
- Check Vercel deployment logs
- Verify Firebase project settings
- Ensure all environment variables are correctly set

---

**CodeWeave** - Built with ❤️ by Royal College AI Club
