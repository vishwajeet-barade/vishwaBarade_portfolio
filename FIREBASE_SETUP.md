# 🔥 Firebase Setup Guide

Complete guide to setting up Firebase for your portfolio website.

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **"Add project"** or **"Create a project"**
3. **Project name:** `vishwajeet-portfolio` (or your preferred name)
4. Click **"Continue"**
5. **Google Analytics:** Disable (optional, you can enable later)
6. Click **"Create project"**
7. Wait for project creation (30-60 seconds)
8. Click **"Continue"**

## Step 2: Register Web App

1. In Firebase Console, click the **Web icon** (`</>`)
2. **App nickname:** `Portfolio Web`
3. **Do NOT** check "Also set up Firebase Hosting"
4. Click **"Register app"**
5. **Copy the configuration** (you'll need this later)
6. Click **"Continue to console"**

## Step 3: Enable Firestore Database

### Create Database

1. In left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. **Location:** Choose closest to your users
   - For India: `asia-south1 (Mumbai)`
   - For US: `us-central1 (Iowa)`
   - For Europe: `europe-west1 (Belgium)`
4. Click **"Next"**
5. **Security rules:** Start in **Production mode**
6. Click **"Enable"**

### Set Security Rules

1. Go to **"Rules"** tab
2. Replace with:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access
    match /{document=**} {
      allow read: if true;
    }
    
    // Only allow authenticated admin to write
    match /{document=**} {
      allow write: if request.auth != null && 
                     request.auth.token.email == 'your_email@example.com';
    }
  }
}
\`\`\`

3. **Replace** `your_email@example.com` with your actual email
4. Click **"Publish"**

## Step 4: Enable Firebase Storage

### Create Storage Bucket

1. In left sidebar, click **"Storage"**
2. Click **"Get started"**
3. **Security rules:** Start in **Production mode**
4. Click **"Next"**
5. **Location:** Use same as Firestore
6. Click **"Done"**

### Set Security Rules

1. Go to **"Rules"** tab
2. Replace with:

\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Only allow authenticated admin to write
    match /{allPaths=**} {
      allow write: if request.auth != null && 
                     request.auth.token.email == 'your_email@example.com';
    }
  }
}
\`\`\`

3. **Replace** `your_email@example.com` with your actual email
4. Click **"Publish"**

## Step 5: Enable Authentication

### Enable Email/Password Auth

1. In left sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Click **"Email/Password"** in Sign-in providers
4. **Enable** the toggle
5. Click **"Save"**

### Create Admin User

1. Go to **"Users"** tab
2. Click **"Add user"**
3. **Email:** Your email address
4. **Password:** Create a strong password (save it!)
5. Click **"Add user"**

## Step 6: Get Firebase Configuration

1. Click **Settings gear icon** (⚙️) → **"Project settings"**
2. Scroll down to **"Your apps"**
3. Find your web app
4. Copy the configuration:

\`\`\`javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
\`\`\`

## Step 7: Configure Environment Variables

1. Open `.env.local` in your project
2. Add the Firebase configuration:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_ADMIN_EMAIL=your_email@example.com
\`\`\`

3. Save the file

## Step 8: Create Collections (Optional)

You can create collections manually or let the app create them:

### Manual Creation

1. Go to **Firestore Database**
2. Click **"Start collection"**
3. **Collection ID:** `profile`
4. Click **"Next"**
5. Add a document:
   - **Document ID:** Auto-ID
   - **Field:** `fullName`, Type: `string`, Value: `Vishwajeet Barade`
   - Add more fields as needed
6. Click **"Save"**

Repeat for other collections:
- `projects`
- `skills`
- `experience`
- `certificates`
- `resume`

### Automatic Creation

The app will create collections automatically when you add data through the admin panel.

## Step 9: Test Firebase Connection

### Test Locally

1. Run your development server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Open http://localhost:3000

3. Go to http://localhost:3000/admin

4. Login with your Firebase credentials

5. If login succeeds, Firebase is configured correctly!

### Verify in Firebase Console

1. Go to **Authentication** → **Users**
2. You should see your user with "Last sign-in" updated

## Step 10: Configure for Deployment

### Add Authorized Domains

When deploying to Vercel:

1. Go to **Authentication** → **Settings**
2. Scroll to **"Authorized domains"**
3. Click **"Add domain"**
4. Add your Vercel domain: `your-project.vercel.app`
5. Click **"Add"**

For custom domain:
1. Add your custom domain (e.g., `vishwajeet.com`)
2. Click **"Add"**

## Firebase Console Overview

### Key Sections

- **Authentication:** Manage users and sign-in methods
- **Firestore Database:** View and edit data
- **Storage:** View uploaded files
- **Functions:** (Not used in this project)
- **Hosting:** (Not used, using Vercel instead)

### Monitoring

- **Usage:** Check quotas and limits
- **Analytics:** (If enabled) View user analytics
- **Performance:** Monitor app performance

## Firebase Pricing

### Free Tier (Spark Plan)

**Firestore:**
- 1 GB storage
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day

**Storage:**
- 5 GB storage
- 1 GB/day downloads

**Authentication:**
- Unlimited users

**This is MORE than enough for a personal portfolio!**

### Monitoring Usage

1. Go to **Usage and billing**
2. View current usage
3. Set up budget alerts (optional)

## Security Best Practices

### 1. Protect API Keys

- Never commit `.env.local` to Git
- Use environment variables in Vercel
- API keys are safe to expose (they're restricted by Firebase rules)

### 2. Secure Firestore Rules

- Only allow authenticated writes
- Restrict to your email only
- Test rules in Firebase Console

### 3. Secure Storage Rules

- Same as Firestore
- Validate file types and sizes (optional)

### 4. Strong Password

- Use a strong password for admin account
- Enable 2FA on your Google account
- Don't share credentials

## Troubleshooting

### Error: "Firebase not initialized"

**Solution:**
- Check `.env.local` has all variables
- Restart development server
- Verify Firebase config is correct

### Error: "Permission denied"

**Solution:**
- Check Firestore/Storage rules
- Verify you're logged in
- Check email in rules matches your login email

### Error: "Quota exceeded"

**Solution:**
- Check Firebase Console → Usage
- Upgrade to Blaze plan (pay-as-you-go)
- Optimize queries to reduce reads

### Error: "Invalid API key"

**Solution:**
- Verify API key in `.env.local`
- Check for typos
- Regenerate API key in Firebase Console

## Backup & Restore

### Export Firestore Data

\`\`\`bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Export data
firebase firestore:export gs://your-bucket/backups
\`\`\`

### Import Firestore Data

\`\`\`bash
firebase firestore:import gs://your-bucket/backups
\`\`\`

## Advanced Configuration

### Enable App Check (Optional)

Protects against abuse:

1. Go to **App Check**
2. Click **"Get started"**
3. Choose reCAPTCHA v3
4. Register your site
5. Enable enforcement

### Enable Analytics (Optional)

Track user behavior:

1. Go to **Analytics**
2. Click **"Enable Google Analytics"**
3. Follow setup wizard

### Set Up Indexes (If Needed)

For complex queries:

1. Go to **Firestore Database** → **Indexes**
2. Click **"Create index"**
3. Configure fields
4. Wait for index creation

## Support Resources

- **Firebase Docs:** https://firebase.google.com/docs
- **Firestore Docs:** https://firebase.google.com/docs/firestore
- **Storage Docs:** https://firebase.google.com/docs/storage
- **Auth Docs:** https://firebase.google.com/docs/auth
- **Community:** https://firebase.google.com/community

---

🎉 **Firebase setup complete!** Your portfolio is now connected to a cloud database.

Next steps:
1. Run `npm run dev` to test locally
2. Login to `/admin` and add content
3. Deploy to Vercel (see DEPLOYMENT.md)
