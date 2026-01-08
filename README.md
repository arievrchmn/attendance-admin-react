# Attendance Admin Panel

A modern admin panel for managing attendance system built with React, Vite and TypeScript.

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Query** - Data fetching and caching
- **Firebase** - Cloud messaging and notifications
- **React Router** - Routing

## Prerequisites

- Node.js (v20 or higher recommended)
- npm or yarn or pnpm

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd attendance-admin-react
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` file with your configuration:
```env
VITE_API_BASE_URL=your_api_url

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The app will be available at `https://localhost:5005` (HTTPS enabled via mkcert)

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable components
├── contexts/        # React contexts
├── hooks/           # Custom React hooks
├── lib/             # Library configurations (Firebase, etc)
├── pages/           # Page components
└── App.tsx          # Main app component
```

## Features

- Employee attendance management
- Real-time notifications via Firebase Cloud Messaging
- Image upload with Cloudinary
- Responsive design with TailwindCSS
- Type-safe development with TypeScript
