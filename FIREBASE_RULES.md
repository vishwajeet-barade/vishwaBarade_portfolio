# 🔒 Firebase Security Rules

## Firestore Database Rules

Copy and paste this into Firebase Console → Firestore Database → Rules:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to all collections
    match /{document=**} {
      allow read: if true;
    }
    
    // Only allow authenticated admin (Vishwajeet) to write
    match /{document=**} {
      allow write: if request.auth != null && 
                     request.auth.token.email == 'baradevishwajeet15@gmail.com';
    }
  }
}
\`\`\`

## Firebase Storage Rules

Copy and paste this into Firebase Console → Storage → Rules:

\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Only allow authenticated admin (Vishwajeet) to upload
    match /{allPaths=**} {
      allow write: if request.auth != null && 
                     request.auth.token.email == 'baradevishwajeet15@gmail.com';
    }
  }
}
\`\`\`

## How to Apply Rules

### Firestore Rules:
1. Go to https://console.firebase.google.com/
2. Select your project: **portfolio-d2035**
3. Click **Firestore Database** in left sidebar
4. Click **Rules** tab
5. Copy the Firestore rules above
6. Paste into the editor
7. Click **Publish**

### Storage Rules:
1. In Firebase Console, click **Storage** in left sidebar
2. Click **Rules** tab
3. Copy the Storage rules above
4. Paste into the editor
5. Click **Publish**

## What These Rules Do

✅ **Public Read:** Anyone can view your portfolio data  
✅ **Admin Write:** Only you (baradevishwajeet15@gmail.com) can edit  
✅ **Secure:** No one else can modify your content  
✅ **Safe:** Your API keys are protected by these rules  

## Testing Rules

After applying rules, test by:
1. Visiting your portfolio (should load data)
2. Logging into /admin (should allow edits)
3. Trying to edit without login (should fail)

---

**Important:** Make sure to publish both Firestore AND Storage rules!
