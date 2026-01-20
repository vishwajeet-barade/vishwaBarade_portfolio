# ✅ Firebase Setup 

## Status: Firebase Configured ✅

Your Firebase credentials have been added to `.env.local`

---

## Next Steps to Complete Setup

### 1. ✅ DONE - Environment Variables
- [x] Created `.env.local` with your Firebase config
- [x] Added your email: baradevishwajeet15@gmail.com

### 2. 🔥 Firebase Console Setup (Do This Now!)

#### A. Enable Firestore Database
1. Go to https://console.firebase.google.com/
2. Select project: **portfolio-d2035**
3. Click **"Firestore Database"** in left sidebar
4. Click **"Create database"**
5. Choose location: **asia-south1 (Mumbai)** (closest to India)
6. Select **"Start in production mode"**
7. Click **"Enable"**

#### B. Set Firestore Security Rules
1. In Firestore, click **"Rules"** tab
2. **Copy this and paste:**

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                     request.auth.token.email == [EMAIL_ADDRESS]';
    }
  }
}
\`\`\`

3. Click **"Publish"**

#### C. Enable Firebase Storage(Not Need We use Claudinary or image storage)
1. Click **"Storage"** in left sidebar
2. Click **"Get started"**
3. Select **"Start in production mode"**
4. Use same location: **asia-south1**
5. Click **"Done"**

#### D. Set Storage Security Rules(No Need We use Claudinary or image storage)
1. In Storage, click **"Rules"** tab
2. **Copy this and paste:**

\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                     request.auth.token.email == [EMAIL_ADDRESS]';
    }
  }
}
\`\`\`

3. Click **"Publish"**

#### E. Enable Authentication
1. Click **"Authentication"** in left sidebar
2. Click **"Get started"**
3. Click **"Email/Password"** provider
4. **Enable** the toggle switch
5. Click **"Save"**

#### F. Create Your Admin User
1. Go to **"Users"** tab in Authentication
2. Click **"Add user"**
3. **Email:** baradevishwajeet15@gmail.com
4. **Password:** (Create a strong password - save it!)
5. Click **"Add user"**

---

## 3. ✅ Test Your Setup

### A. Server is Running
Your dev server is already running at: **http://localhost:3000**

### B. Test Public Portfolio
1. Open browser: http://localhost:3000
2. You should see the portfolio homepage
3. (Data will be empty until you add content)

### C. Test Admin Login
1. Open browser: http://localhost:3000/admin
2. Login with:
   - **Email:** baradevishwajeet15@gmail.com
   - **Password:** (the one you created in Firebase)
3. You should see the admin dashboard!

---

## 4. 🎨 Add Your First Content

Once logged into admin panel:

1. **Profile** - Add your name, bio, profile picture
2. **Skills** - Add your technical skills
3. **Projects** - Add your first project with:
   - Title and description
   - Demo video URL
   - Project images
   - GitHub/LinkedIn links
4. **Experience** - Add work experience
5. **Certificates** - Upload certificates

---

## 5. 🚀 Deploy to Vercel (Later)

After adding content locally:
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

See `DEPLOYMENT.md` for detailed instructions.

---

## Troubleshooting

### "Firebase not initialized" error
- Make sure you completed steps A-E above
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

### "Permission denied" error
- Check Firestore rules are published
- Check Storage rules are published
- Verify your email in rules matches: baradevishwajeet15@gmail.com

### Can't login to admin
- Make sure you created user in Firebase Authentication
- Check email and password are correct
- Check browser console for errors (F12)

---

## Quick Reference

**Firebase Project:** portfolio-d2035  
**Your Email:** baradevishwajeet15@gmail.com  
**Local URL:** http://localhost:3000  
**Admin URL:** http://localhost:3000/admin  

**Firebase Console:** https://console.firebase.google.com/project/portfolio-d2035

---

## What's Working Now

✅ Environment variables configured  
✅ Dependencies installed  
✅ Dev server running  
✅ Firebase credentials loaded  

## What You Need to Do

⏳ Enable Firestore Database  
⏳ Set Firestore security rules  
⏳ Enable Firebase Storage  
⏳ Set Storage security rules  
⏳ Enable Authentication  
⏳ Create admin user  
⏳ Test login  

**Estimated time:** 10-15 minutes

---

**After completing these steps, you'll be able to:**
- Login to admin panel
- Add projects, skills, certificates
- Upload images and files
- Manage your entire portfolio!

**Good luck! 🚀**
