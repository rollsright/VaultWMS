import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from './ui/Button'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { user, logout } = useAuth()

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
                <span className="logo-subtitle">est. 1970</span>
              </div>
            </div>
          </Link>
          
          {/* User Badge */}
          <div className="user-badge">
            <div className="user-info">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-email">{user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
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
            <div className="nav-section-header">
              <span className="nav-section-title">SETUP</span>
              <span className="nav-section-icon">🛠️</span>
            </div>
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
