# 🚀 Vishwajeet Barade - Portfolio Website

A modern, feature-rich portfolio website built with Next.js, Firebase, and Tailwind CSS. This portfolio showcases AI/ML projects, skills, experience, and certificates with full CRUD capabilities for the owner.

## ✨ Features

### Public Portfolio (Read-Only for Visitors)
- **Hero Section**: Animated introduction with profile image and social links
- **About Me**: Personal bio, interests, and statistics
- **Skills & Expertise**: Categorized skills with proficiency levels
- **Projects Showcase**: 
  - Detailed project cards with filtering
  - Project detail modal with:
    - Demo videos
    - Image galleries
    - Detailed descriptions
    - GitHub, LinkedIn, and custom links
    - Technologies used
- **Experience Timeline**: Professional journey with responsibilities
- **Certificates**: Achievement showcase with credential verification
- **Contact Form**: Get in touch section with social links

### Admin Panel (Owner Only - Full CRUD)
- **Dashboard**: Analytics and quick stats
- **Profile Management**: Edit personal information
- **Projects Management**: Add/Edit/Delete projects with media upload
- **Skills Management**: Manage skills and proficiency levels
- **Certificates Upload**: Add certificates with images
- **Resume Upload**: Update resume files
- **Experience Management**: Add work experience
- **Authentication**: Secure Firebase Auth

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (React), TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage (for images, videos, resume)
- **Authentication**: Firebase Auth
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase account
- Git

## 🚀 Getting Started

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd Portfolio
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Firebase Setup

#### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "vishwajeet-portfolio")
4. Disable Google Analytics (optional)
5. Click "Create Project"

#### Enable Firebase Services

**Firestore Database:**
1. In Firebase Console, go to "Firestore Database"
2. Click "Create Database"
3. Start in **Production Mode**
4. Choose a location (e.g., asia-south1 for India)
5. Click "Enable"

**Firebase Storage:**
1. Go to "Storage" in Firebase Console
2. Click "Get Started"
3. Start in **Production Mode**
4. Click "Done"

**Authentication:**
1. Go to "Authentication" in Firebase Console
2. Click "Get Started"
3. Enable "Email/Password" sign-in method
4. Click "Save"

#### Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register your app (name: "Portfolio Web")
5. Copy the Firebase configuration

### 4. Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit \`.env.local\` and add your Firebase configuration:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ADMIN_EMAIL=your_email@example.com
\`\`\`

### 5. Firestore Security Rules

In Firebase Console > Firestore Database > Rules, add:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access to all collections
    match /{document=**} {
      allow read: if true;
    }
    
    // Only authenticated admin can write
    match /{document=**} {
      allow write: if request.auth != null && request.auth.token.email == 'your_email@example.com';
    }
  }
}
\`\`\`

### 6. Firebase Storage Rules

In Firebase Console > Storage > Rules, add:

\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read access
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Only authenticated admin can write
    match /{allPaths=**} {
      allow write: if request.auth != null && request.auth.token.email == 'your_email@example.com';
    }
  }
}
\`\`\`

### 7. Create Admin User

1. Go to Firebase Console > Authentication > Users
2. Click "Add User"
3. Enter your email and password
4. Click "Add User"

### 8. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
Portfolio/
├── app/                      # Next.js app directory
│   ├── admin/               # Admin panel pages
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/
│   ├── layout/              # Layout components (Navbar, Footer)
│   ├── sections/            # Page sections (Hero, About, Projects, etc.)
│   └── admin/               # Admin panel components
├── lib/
│   └── firebase.ts          # Firebase configuration
├── types/
│   └── index.ts             # TypeScript type definitions
├── public/                  # Static assets
├── .env.example             # Environment variables template
├── .env.local               # Your environment variables (not in git)
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── package.json             # Dependencies
\`\`\`

## 🎨 Customization

### Update Personal Information

1. Go to `/admin` and login
2. Navigate to Profile Management
3. Update your information
4. Save changes

### Add Projects

1. Go to `/admin/projects`
2. Click "Add New Project"
3. Fill in project details:
   - Title, description, overview
   - Upload thumbnail
   - Add demo video URL
   - Upload project images
   - Add GitHub, LinkedIn, or custom links
4. Save project

### Add Skills

1. Go to `/admin/skills`
2. Click "Add Skill"
3. Enter skill name, category, and proficiency
4. Save

### Upload Resume

1. Go to `/admin/resume`
2. Upload your PDF resume
3. It will be available for download on the public site

## 🚀 Deployment to Vercel

### 1. Push to GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
\`\`\`

### 2. Deploy on Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables (same as .env.local)
5. Click "Deploy"

### 3. Update Firebase Configuration

Add your Vercel domain to Firebase:
1. Firebase Console > Authentication > Settings
2. Add your Vercel domain to "Authorized domains"

## 📊 Firestore Collections Structure

### profile
\`\`\`javascript
{
  fullName: string,
  title: string,
  bio: string,
  aboutMe: string,
  email: string,
  profileImageUrl: string,
  socialLinks: [{ platform, url, icon }],
  interests: string[],
  updatedAt: timestamp
}
\`\`\`

### projects
\`\`\`javascript
{
  title: string,
  shortDescription: string,
  detailedDescription: string,
  overview: string,
  thumbnailUrl: string,
  demoVideoUrl: string,
  media: [{ type, url, thumbnail, caption, order }],
  githubUrl: string,
  linkedinUrl: string,
  liveUrl: string,
  customLinks: [{ platform, url }],
  technologies: string[],
  category: string,
  status: 'completed' | 'in-progress' | 'planned',
  featured: boolean,
  order: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
\`\`\`

### skills
\`\`\`javascript
{
  name: string,
  category: 'AI/ML' | 'Data Analysis' | 'Programming' | 'Tools' | 'Other',
  proficiency: number (0-100),
  createdAt: timestamp
}
\`\`\`

### certificates
\`\`\`javascript
{
  title: string,
  issuer: string,
  issueDate: timestamp,
  expiryDate: timestamp,
  credentialId: string,
  credentialUrl: string,
  imageUrl: string,
  description: string,
  skills: string[],
  createdAt: timestamp
}
\`\`\`

### experience
\`\`\`javascript
{
  company: string,
  position: string,
  location: string,
  startDate: timestamp,
  endDate: timestamp,
  current: boolean,
  description: string,
  responsibilities: string[],
  technologies: string[],
  companyLogo: string,
  createdAt: timestamp
}
\`\`\`

## 🎯 Features Roadmap

- [ ] Blog section
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Contact form email integration
- [ ] Project search functionality
- [ ] Resume builder

## 🤝 Contributing

This is a personal portfolio project, but suggestions are welcome!

## 📄 License

MIT License - feel free to use this template for your own portfolio!

## 👤 Author

**Vishwajeet Barade**
- GitHub: [@vishwajeet](https://github.com/vishwajeet)
- LinkedIn: [Vishwajeet Barade](https://linkedin.com/in/vishwajeet)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for backend services
- Vercel for hosting
- Framer Motion for animations

---

Made with ❤️ and ☕ by Vishwajeet Barade
