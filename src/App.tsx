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

// Setup Pages
import Users from './pages/setup/Users'
import Warehouses from './pages/setup/Warehouses'
import Zones from './pages/setup/Zones'
import SetupLocations from './pages/setup/SetupLocations'
import Customers from './pages/setup/Customers'
import Suppliers from './pages/setup/Suppliers'
import UOMs from './pages/setup/UOMs'
import Categories from './pages/setup/Categories'
import SetupItems from './pages/setup/SetupItems'
import Carriers from './pages/setup/Carriers'
import Contacts from './pages/setup/Contacts'
import Doors from './pages/setup/Doors'
import DocumentTypes from './pages/setup/DocumentTypes'

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
          
          {/* Setup Routes */}
          <Route path="/setup/users" element={<Users />} />
          <Route path="/setup/warehouses" element={<Warehouses />} />
          <Route path="/setup/zones" element={<Zones />} />
          <Route path="/setup/locations" element={<SetupLocations />} />
          <Route path="/setup/customers" element={<Customers />} />
          <Route path="/setup/suppliers" element={<Suppliers />} />
          <Route path="/setup/uoms" element={<UOMs />} />
          <Route path="/setup/categories" element={<Categories />} />
          <Route path="/setup/items" element={<SetupItems />} />
          <Route path="/setup/carriers" element={<Carriers />} />
          <Route path="/setup/contacts" element={<Contacts />} />
          <Route path="/setup/doors" element={<Doors />} />
          <Route path="/setup/document-types" element={<DocumentTypes />} />
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
