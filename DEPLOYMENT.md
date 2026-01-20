# 🚀 Deployment Guide - Vercel

This guide will help you deploy your portfolio website to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier is sufficient)
- Firebase project set up (see SETUP.md)
- All environment variables ready

## Step 1: Push to GitHub

### Initialize Git Repository

\`\`\`bash
git init
git add .
git commit -m "Initial commit: Portfolio website"
\`\`\`

### Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `portfolio` (or your preferred name)
3. Keep it Public or Private (your choice)
4. **Do NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

### Push to GitHub

\`\`\`bash
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git branch -M main
git push -u origin main
\`\`\`

## Step 2: Deploy to Vercel

### Connect Vercel to GitHub

1. Go to https://vercel.com
2. Click "Sign Up" or "Log In"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### Import Your Project

1. Click "Add New..." → "Project"
2. Find your `portfolio` repository
3. Click "Import"

### Configure Project

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `./` (leave as is)

**Build Command:** `npm run build` (auto-filled)

**Output Directory:** `.next` (auto-filled)

### Add Environment Variables

⚠️ **CRITICAL:** Your deployment will fail if you don't add ALL environment variables!

Click "Environment Variables" and add all variables from your `.env.local`:

#### Firebase Variables (Required)
\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ADMIN_EMAIL=your_email@example.com
\`\`\`

#### Cloudinary Variables (Required for image uploads)
\`\`\`
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=portfolio_upload
\`\`\`

**How to Add Each Variable:**
1. Click "Add New" for each variable
2. Enter the **Key** (variable name) exactly as shown above
3. Enter the **Value** from your `.env.local` file (without quotes)
4. Select **ALL three environments**: Production, Preview, Development
5. Click "Save"

**Important:** 
- Copy values from your local `.env.local` file
- Don't include quotes around values
- Make sure to add these for all environments (Production, Preview, Development)
- If you skip any variable, deployment will fail!

### Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be live at `https://your-project.vercel.app`

## Step 3: Configure Firebase for Vercel

### Add Vercel Domain to Firebase

1. Go to Firebase Console → Authentication → Settings
2. Scroll to "Authorized domains"
3. Click "Add domain"
4. Add your Vercel domain: `your-project.vercel.app`
5. Click "Add"

### Update Firestore Rules (if needed)

Make sure your Firestore rules allow public read access:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                     request.auth.token.email == 'your_email@example.com';
    }
  }
}
\`\`\`

## Step 4: Custom Domain (Optional)

### Add Custom Domain

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Enter your custom domain (e.g., `vishwajeet.com`)
4. Follow Vercel's instructions to configure DNS

### Update Firebase

1. Add your custom domain to Firebase Authorized domains
2. Update CORS settings if needed

## Step 5: Verify Deployment

### Test Your Site

1. Visit your Vercel URL
2. Check all sections load correctly
3. Test navigation
4. Verify images and media load

### Test Admin Panel

1. Go to `https://your-project.vercel.app/admin`
2. Login with your Firebase credentials
3. Verify you can access the dashboard

### Test Firebase Connection

1. Try adding a skill or project
2. Verify data appears on the public site
3. Check Firebase Console to confirm data is saved

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

\`\`\`bash
# Make changes
git add .
git commit -m "Update: Added new project"
git push
\`\`\`

Vercel will automatically:
- Build your project
- Run tests (if configured)
- Deploy to production
- Update your live site

## Environment-Specific Deployments

### Preview Deployments

- Every pull request gets a unique preview URL
- Test changes before merging to main
- Preview URLs: `https://portfolio-git-branch-name-username.vercel.app`

### Production Deployment

- Only `main` branch deploys to production
- Production URL: `https://your-project.vercel.app`

## Monitoring & Analytics

### Vercel Analytics

1. Go to your project in Vercel
2. Click "Analytics"
3. View page views, performance metrics, etc.

### Firebase Analytics (Optional)

1. Enable Analytics in Firebase Console
2. Add Firebase Analytics to your project
3. Track user behavior and engagement

## Troubleshooting

### Build Fails

**Error:** Module not found
- **Solution:** Run `npm install` locally and commit `package-lock.json`

**Error:** Environment variable not found
- **Solution:** Check all env vars are added in Vercel settings

### Firebase Connection Issues

**Error:** Firebase not initialized
- **Solution:** Verify all Firebase env vars are correct

**Error:** Permission denied
- **Solution:** Check Firestore and Storage rules

### Images Not Loading

**Error:** 403 Forbidden
- **Solution:** Check Firebase Storage rules allow public read

**Error:** CORS error
- **Solution:** Add Vercel domain to Firebase authorized domains

## Performance Optimization

### Enable Vercel Speed Insights

1. Go to project settings
2. Enable "Speed Insights"
3. Monitor Core Web Vitals

### Image Optimization

- Next.js automatically optimizes images
- Use Next.js `<Image>` component for best performance

### Caching

Vercel automatically caches:
- Static assets (images, CSS, JS)
- API routes (configurable)
- Page renders (ISR/SSG)

## Security Best Practices

### Environment Variables

- Never commit `.env.local` to Git
- Use Vercel's environment variables feature
- Rotate Firebase API keys periodically

### Firebase Security

- Keep Firestore rules restrictive
- Only allow authenticated writes
- Use Firebase App Check (optional)

### Admin Access

- Use strong passwords
- Enable 2FA on Firebase account
- Limit admin email to your email only

## Updating Your Site

### Content Updates

1. Login to `/admin`
2. Make changes
3. Changes reflect immediately (no deployment needed)

### Code Updates

1. Make code changes locally
2. Test with `npm run dev`
3. Commit and push to GitHub
4. Vercel auto-deploys

## Rollback

If something goes wrong:

1. Go to Vercel dashboard
2. Click "Deployments"
3. Find a previous working deployment
4. Click "..." → "Promote to Production"

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Firebase Docs:** https://firebase.google.com/docs

---

🎉 **Congratulations!** Your portfolio is now live on Vercel!

Share your link: `https://your-project.vercel.app`
