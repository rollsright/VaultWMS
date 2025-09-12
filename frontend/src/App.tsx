import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import Home from './pages/Home'
import Items from './pages/Items'
import Locations from './pages/Locations'
import CreateItem from './pages/CreateItem'
import EditItem from './pages/EditItem'
import { ItemProvider } from './hooks/useItems'

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

function App() {
  return (
    <AuthProvider>
      <ItemProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Protected Routes */}
          <Route path="/*" element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          } />
        </Routes>
      </ItemProvider>
    </AuthProvider>
  )
}

export default App
