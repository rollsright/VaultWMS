# Rolls Right

A modern React CRUD application built with TypeScript, Vite, React Router v6, React hooks for state management, Radix UI components, and the Fetch API.

## Tech Stack

- **React 18+** with TypeScript for type safety
- **Vite** for fast development and building
- **React Router v6** for client-side routing
- **React Hooks** for state management (Context API + useState)
- **Radix UI** for accessible, unstyled components
- **Fetch API** for HTTP requests
- **ESLint + Prettier** for code quality and formatting

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
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Radix UI)
│   └── Layout.tsx       # Main layout component
├── hooks/
│   └── useItems.tsx     # State management hook with Context
├── pages/
│   ├── Home.tsx         # Homepage
│   ├── Items.tsx        # Items list page
│   ├── CreateItem.tsx   # Create item form
│   └── EditItem.tsx     # Edit item form
├── App.tsx              # Main app component with routing
├── main.tsx             # App entry point
└── index.css            # Global styles
```

## API Integration

The app is set up to work with a REST API at `/api/items`. Currently, it falls back to mock data when the API is not available. To integrate with your backend:

1. Update the API endpoints in `src/hooks/useItems.tsx`
2. Modify the `Item` interface if your data structure differs
3. Add authentication headers if required

## Customization

### Styling
- Modify `src/index.css` for global styles
- Component-specific styles can be added inline or as CSS modules

### Components
- All UI components use Radix UI primitives for accessibility
- Customize the `Button` component in `src/components/ui/Button.tsx`
- Add new Radix UI components as needed

### State Management
- The app uses React Context for state management
- Extend the `useItems` hook or create new context providers as needed

## License

MIT License - feel free to use this project as a starting point for your applications.
