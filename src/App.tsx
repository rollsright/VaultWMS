import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Items from './pages/Items'
import Locations from './pages/Locations'
import CreateItem from './pages/CreateItem'
import EditItem from './pages/EditItem'
import Login from './pages/Login'
import { ItemProvider } from './hooks/useItems'
import { AuthProvider, useAuth } from './hooks/useAuth'

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <ItemProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items" element={<Items />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/items/create" element={<CreateItem />} />
          <Route path="/items/:id/edit" element={<EditItem />} />
        </Routes>
      </Layout>
    </ItemProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
