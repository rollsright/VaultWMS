# Rolls Right

A modern full-stack application with React frontend and backend services, organized as a monorepo for easier development and deployment.

## Project Structure

This is a monorepo containing both frontend and backend applications:

```
Rolls Right/
├── frontend/              # React application
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/               # Backend services (ready for your implementation)
│   ├── src/
│   ├── package.json
│   └── ...
├── shared/                # Shared types and utilities
│   ├── types/
│   └── utils/
├── package.json          # Root package.json for monorepo management
└── README.md
```

## Tech Stack

### Frontend
- **React 18+** with TypeScript for type safety
- **Vite** for fast development and building
- **React Router v6** for client-side routing
- **React Hooks** for state management (Context API + useState)
- **Radix UI** for accessible, unstyled components
- **Supabase** for backend services
- **ESLint + Prettier** for code quality and formatting

### Backend
- Ready for your backend implementation
- TypeScript configuration included
- Express.js setup prepared (when you're ready to add backend code)

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Type-safe TypeScript implementation
- ✅ Responsive design with modern CSS
- ✅ Accessible UI components using Radix UI
- ✅ Client-side routing with React Router
- ✅ Context-based state management
- ✅ Error handling and loading states
- ✅ Mock data fallback for API development

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Clone or download the project
2. Install dependencies for both frontend and backend:

```bash
# Install root dependencies (monorepo management)
npm install

# Install frontend dependencies
npm run install:frontend

# Install backend dependencies (when you add backend code)
npm run install:backend

# Or install all at once
npm run install:all
```

3. Start the development servers:

```bash
# Start frontend only
npm run dev:frontend

# Start backend only (when you add backend code)
npm run dev:backend

# Or use your IDE to run both simultaneously
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser (Vite's default port)

## Available Scripts

### Root Level (Monorepo Management)
- `npm run dev:frontend` - Start frontend development server
- `npm run dev:backend` - Start backend development server
- `npm run build:frontend` - Build frontend for production
- `npm run build:backend` - Build backend for production
- `npm run install:all` - Install dependencies for all packages
- `npm run lint` - Run linting for all packages
- `npm run format` - Format code for all packages

### Frontend Specific
- `cd frontend && npm run dev` - Start frontend development server
- `cd frontend && npm run build` - Build frontend for production
- `cd frontend && npm run preview` - Preview frontend production build
- `cd frontend && npm run lint` - Run ESLint on frontend
- `cd frontend && npm run format` - Format frontend code

## Frontend Structure

```
frontend/src/
├── components/
│   ├── ui/              # Reusable UI components (Radix UI)
│   └── Layout.tsx       # Main layout component
├── hooks/
│   ├── useAuth.tsx      # Authentication hook
│   └── useItems.tsx     # State management hook with Context
├── pages/
│   ├── Home.tsx         # Homepage
│   ├── Items.tsx        # Items list page
│   ├── CreateItem.tsx   # Create item form
│   ├── EditItem.tsx     # Edit item form
│   └── setup/           # Setup pages for various entities
├── lib/
│   └── supabase.ts      # Supabase client configuration
├── App.tsx              # Main app component with routing
├── main.tsx             # App entry point
└── index.css            # Global styles
```

## Backend Integration

The frontend is currently set up to work with Supabase as the backend. When you're ready to add your own backend services:

1. Implement your backend in the `backend/` folder
2. Update API endpoints in `frontend/src/hooks/` files
3. Use the `shared/` folder for common types and utilities
4. Modify interfaces in `shared/types/` if your data structure differs

## Customization

### Styling
- Modify `frontend/src/index.css` for global styles
- Component-specific styles can be added inline or as CSS modules

### Components
- All UI components use Radix UI primitives for accessibility
- Customize the `Button` component in `frontend/src/components/ui/Button.tsx`
- Add new Radix UI components as needed

### State Management
- The app uses React Context for state management
- Extend the hooks in `frontend/src/hooks/` or create new context providers as needed

### Shared Code
- Use `shared/types/` for TypeScript interfaces used by both frontend and backend
- Use `shared/utils/` for utility functions that can be shared between projects

## License

MIT License - feel free to use this project as a starting point for your applications.
