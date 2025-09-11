import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div>
      <nav className="nav">
        <div className="container">
          <div className="nav-content">
            <Link to="/" className="nav-brand">
              Rolls Right
            </Link>
            <ul className="nav-links">
              <li>
                <Link 
                  to="/" 
                  className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/items" 
                  className={`nav-link ${location.pathname.startsWith('/items') ? 'active' : ''}`}
                >
                  Items
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main>
        <div className="container" style={{ paddingTop: '2rem' }}>
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
