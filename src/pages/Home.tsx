import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

function Home() {
  return (
    <div className="card">
      <h1 className="text-lg font-semibold mb-4">Welcome to Rolls Right</h1>
      <p className="text-gray-600 mb-6">
        A modern React CRUD application built with TypeScript, Vite, React Router v6, 
        React hooks for state management, Radix UI components, and the Fetch API.
      </p>
      
      <div className="flex gap-4">
        <Link to="/items">
          <Button>View Items</Button>
        </Link>
        <Link to="/items/create">
          <Button variant="outline">Create New Item</Button>
        </Link>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-medium mb-2">Tech Stack:</h2>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• React 18+ with TypeScript</li>
          <li>• Vite for fast development and building</li>
          <li>• React Router v6 for client-side routing</li>
          <li>• React hooks for state management</li>
          <li>• Radix UI for accessible components</li>
          <li>• Fetch API for HTTP requests</li>
          <li>• ESLint + Prettier for code quality</li>
        </ul>
      </div>
    </div>
  )
}

export default Home
