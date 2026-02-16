# Quickstart Guide: Frontend Implementation for Todo App

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Access to the backend API

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Navigate to frontend directory
```bash
cd frontend
```

### 3. Install dependencies
```bash
npm install
# or
yarn install
```

### 4. Environment Configuration
Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 5. Start the development server
```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3000

## Key Features

### Authentication
- Visit `/signup` to create an account
- Visit `/login` to sign in
- The `/logout` functionality is accessible from the user menu

### Task Management
- Visit `/tasks` to view your task list
- Click "New Task" to create a task
- Use drag-and-drop to reorder tasks
- Toggle task completion status
- Filter tasks by completion status

## Folder Structure
```
frontend/
├── app/
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   ├── login/              # Login page
│   │   └── page.tsx
│   ├── signup/             # Signup page
│   │   └── page.tsx
│   └── tasks/              # Task management pages
│       ├── page.tsx        # Task list
│       ├── new/            # Create task
│       │   └── page.tsx
│       └── [id]/           # Task detail/edit
│           └── page.tsx
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx
│   │   └── AuthForm.tsx
│   └── layout/             # Layout components
│       ├── Navbar.tsx
│       └── Footer.tsx
├── lib/
│   ├── api.ts              # API client with JWT handling
│   └── auth.ts             # Authentication utilities
├── middleware.ts           # Route protection middleware
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── CLAUDE.md               # Frontend development guidelines
```

## Running Tests
```bash
# Run unit tests
npm run test
# or
yarn test

# Run e2e tests
npm run test:e2e
# or
yarn test:e2e
```

## Build for Production
```bash
npm run build
# or
yarn build
```

## Deployment
The application is built as a Next.js app and can be deployed to platforms like:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any Node.js hosting platform

## Troubleshooting

### Common Issues
1. **API Connection Issues**: Ensure the backend server is running and the API URL is correctly configured in environment variables
2. **JWT Authentication Issues**: Verify that the `BETTER_AUTH_SECRET` matches between frontend and backend
3. **Route Protection Not Working**: Check that middleware.ts is properly configured

### Development Mode Features
- Hot Module Replacement (HMR) for instant updates
- TypeScript type checking
- Tailwind CSS JIT compilation
- ESLint and Prettier linting/formatting