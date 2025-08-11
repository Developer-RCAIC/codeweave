# CodeWeave 🕸️

A completely free AI-powered coding platform developed by the Royal College Artificial Intelligence Club. Transform your ideas into production-ready web applications instantly with no cost, no limits, and no compromises.

## 🚀 Features

- **AI-Powered Generation**: Create complete web projects from simple descriptions
- **Iterative Editing**: Continuously refine projects without starting over
- **Live Preview**: See changes instantly with real-time preview
- **Professional Code**: Get production-ready HTML, CSS, and JavaScript
- **Project Management**: Save, organize, and manage all your projects
- **Firebase Integration**: Secure authentication and cloud storage
- **100% Free**: No costs, no limits, no premium tiers

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.3.3, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Editor**: Monaco Editor
- **Backend**: Firebase (Auth + Firestore)
- **AI**: GitHub Models API (GPT-4o)
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended) or Firebase Hosting

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm
- Firebase CLI

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd codeweave
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create `.env.local` with your Firebase config:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=codeweave-b125f
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   GITHUB_TOKEN=your_github_models_token
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Firebase Setup

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase (already done)**
   The project is already configured with:
   - `firebase.json` - Firebase configuration
   - `.firebaserc` - Project settings
   - `firestore.rules` - Security rules
   - `firestore.indexes.json` - Database indexes

## 🚀 Deployment

### Deploy to Vercel (Recommended)

CodeWeave is optimized for Vercel deployment:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy CodeWeave"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=codeweave-b125f
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     GITHUB_TOKEN=your_github_models_token
     ```
   - Deploy!

### Deploy to Firebase Hosting (Alternative)

If you prefer Firebase hosting:

```bash
# Build for static export
npm run build:firebase
firebase deploy --only hosting
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production (Vercel)
- `pnpm build:firebase` - Build for Firebase hosting
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🔧 Configuration

### Firebase Configuration

The project is configured for Firebase project `codeweave-b125f`:

- **Authentication**: Email/password authentication
- **Firestore**: NoSQL database for projects and user data
- **Hosting**: Static site hosting
- **Security Rules**: User-specific data access controls

### Firestore Collections

- `users/{userId}` - User profile data
- `projects/{projectId}` - User projects with code files
- `public_projects/{projectId}` - Public/shared projects (future feature)

### Security Rules

- Users can only access their own data
- Projects are scoped to the authenticated user
- All operations require authentication

## 🏗️ Project Structure

```
codeweave/
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   ├── dashboard/          # Dashboard page
│   ├── editor/            # Editor page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── lib/                   # Utility libraries
│   ├── firebase.ts        # Firebase configuration
│   ├── authService.ts     # Authentication service
│   └── projectService.ts  # Project management service
├── firebase.json          # Firebase configuration
├── firestore.rules        # Firestore security rules
├── firestore.indexes.json # Firestore indexes
├── .firebaserc           # Firebase project settings
└── deploy.sh             # Deployment script
```

## 🤝 Contributing

This is an open-source project by the Royal College AI Club. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is completely free and open-source, developed by the Royal College Artificial Intelligence Club.

## 🎓 About Royal College AI Club

CodeWeave is a passion project by students, for students and developers worldwide. Our mission is to make AI-powered development accessible to everyone through education and innovation.

---

**Live Demo**: [Deploy on Vercel](https://vercel.com/new/clone?repository-url=https://github.com/Developer-RCAIC/codeweave-new)

Built with ❤️ by Royal College AI Club
