import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from './ui/Button'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [isSetupCollapsed, setIsSetupCollapsed] = useState(false)
  const { user, signOut } = useAuth()
  
  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="app-layout">
      {/* Left Sidebar */}
      <aside className="sidebar">
        {/* Logo Section */}
        <div className="sidebar-logo">
          <Link to="/" className="logo-link">
            <div className="logo-container">
              <div className="logo-icon">📦</div>
              <div className="logo-content">
                <span className="logo-text">Rolls Right</span>
                <span className="logo-subtitle">est. 1976</span>
              </div>
            </div>
          </Link>
          
          {/* Tenant Badge */}
          <div className="tenant-badge">
            <span className="tenant-text">RR Tenant</span>
            <span className="tenant-status">active</span>
          </div>
          
          {/* User Badge */}
          <div className="user-badge">
            <div className="user-info">
              <span className="user-name">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </span>
              <span className="user-email">{user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="logout-button"
            >
              Sign out
            </Button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="sidebar-nav">
          {/* Main Dashboard */}
          <div className="nav-section">
            <Link 
              to="/" 
              className={`sidebar-link dashboard-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <span className="nav-icon">📊</span>
              <span>WMS Dashboard</span>
            </Link>
          </div>

          {/* Inventory Section */}
          <div className="nav-section">
            <div className="nav-section-header">
              <span className="nav-section-title">INVENTORY</span>
              <span className="nav-section-icon">📦</span>
            </div>
            <ul className="sidebar-links">
              <li>
                <Link 
                  to="/items" 
                  className={`sidebar-link ${location.pathname.startsWith('/items') ? 'active' : ''}`}
                >
                  <span className="nav-icon">📋</span>
                  <span>Inventory</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/locations" 
                  className={`sidebar-link ${location.pathname.startsWith('/locations') ? 'active' : ''}`}
                >
                  <span className="nav-icon">📍</span>
                  <span>Locations</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/transactions" 
                  className={`sidebar-link ${location.pathname.startsWith('/transactions') ? 'active' : ''}`}
                >
                  <span className="nav-icon">🔄</span>
                  <span>Transactions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Operations Section */}
          <div className="nav-section">
            <div className="nav-section-header">
              <span className="nav-section-title">OPERATIONS</span>
              <span className="nav-section-icon">⚙️</span>
            </div>
            <ul className="sidebar-links">
              <li>
                <Link 
                  to="/orders" 
                  className={`sidebar-link ${location.pathname.startsWith('/orders') ? 'active' : ''}`}
                >
                  <span className="nav-icon">🛒</span>
                  <span>Orders</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipments" 
                  className={`sidebar-link ${location.pathname.startsWith('/shipments') ? 'active' : ''}`}
                >
                  <span className="nav-icon">🚚</span>
                  <span>Shipments</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Cross-Docking Section */}
          <div className="nav-section">
            <div className="nav-section-header">
              <span className="nav-section-title">CROSS-DOCKING</span>
              <span className="nav-section-icon">🔄</span>
            </div>
          </div>

          {/* Finance Section */}
          <div className="nav-section">
            <div className="nav-section-header">
              <span className="nav-section-title">FINANCE</span>
              <span className="nav-section-icon">💰</span>
            </div>
          </div>

          {/* System Section */}
          <div className="nav-section">
            <div className="nav-section-header">
              <span className="nav-section-title">SYSTEM</span>
              <span className="nav-section-icon">⚙️</span>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="nav-section">
            <div className="nav-section-header">
              <span className="nav-section-title">ANALYTICS</span>
              <span className="nav-section-icon">📈</span>
            </div>
          </div>

          {/* Setup Section */}
          <div className="nav-section">
            <div 
              className="nav-section-header collapsible" 
              onClick={() => setIsSetupCollapsed(!isSetupCollapsed)}
              style={{ cursor: 'pointer' }}
            >
              <span className="nav-section-title">SETUP</span>
              <div className="nav-section-controls">
                <span className="nav-section-icon">🛠️</span>
                <svg 
                  className={`collapse-icon ${isSetupCollapsed ? 'collapsed' : 'expanded'}`}
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="none"
                >
                  <path 
                    d="M3 4.5L6 7.5L9 4.5" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {!isSetupCollapsed && (
              <ul className="sidebar-links">
              <li>
                <Link 
                  to="/setup/users" 
                  className={`sidebar-link ${location.pathname.startsWith('/setup/users') ? 'active' : ''}`}
                >
                  <span className="nav-icon">👥</span>
                  <span>Users</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/setup/warehouses" 
                  className={`sidebar-link ${location.pathname.startsWith('/setup/warehouses') ? 'active' : ''}`}
                >
                  <span className="nav-icon">🏢</span>
                  <span>Warehouses</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/setup/zones" 
                  className={`sidebar-link ${location.pathname.startsWith('/setup/zones') ? 'active' : ''}`}
                >
                  <span className="nav-icon">📊</span>
                  <span>Zones</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/setup/locations" 
                  className={`sidebar-link ${location.pathname.startsWith('/setup/locations') ? 'active' : ''}`}
                >
                  <span className="nav-icon">📍</span>
                  <span>Locations</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/setup/customers" 
                  className={`sidebar-link ${location.pathname.startsWith('/setup/customers') ? 'active' : ''}`}
                >
                  <span className="nav-icon">👥</span>
                  <span>Customers</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/setup/suppliers" 
                  className={`sidebar-link ${location.pathname.startsWith('/setup/suppliers') ? 'active' : ''}`}
                >
                  <span className="nav-icon">🚚</span>
                  <span>Suppliers</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/setup/uoms" 
                  className={`sidebar-link ${location.pathname.startsWith('/setup/uoms') ? 'active' : ''}`}
                >
                  <span className="nav-icon">⚖️</span>
                  <span>UOMs</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/setup/categories" 
                  className={`sidebar-link ${location.pathname.startsWith('/setup/categories') ? 'active' : ''}`}
                >
                  <span className="nav-icon">🏷️</span>
                  <span>Categories</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/setup/items" 
                  className={`sidebar-link ${location.pathname.startsWith('/setup/items') ? 'active' : ''}`}
                >
                  <span className="nav-icon">📦</span>
                  <span>Items</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/setup/carriers" 
                  className={`sidebar-link ${location.pathname.startsWith('/setup/carriers') ? 'active' : ''}`}
                >
                  <span className="nav-icon">🚛</span>
                  <span>Carriers</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/setup/contacts" 
                  className={`sidebar-link ${location.pathname.startsWith('/setup/contacts') ? 'active' : ''}`}
                >
                  <span className="nav-icon">📞</span>
                  <span>Contacts</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/setup/doors" 
                  className={`sidebar-link ${location.pathname.startsWith('/setup/doors') ? 'active' : ''}`}
                >
                  <span className="nav-icon">🚪</span>
                  <span>Doors</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/setup/document-types" 
                  className={`sidebar-link ${location.pathname.startsWith('/setup/document-types') ? 'active' : ''}`}
                >
                  <span className="nav-icon">📄</span>
                  <span>Document Types</span>
                </Link>
              </li>
              </ul>
            )}
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="main-container">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
