import { useCustomers } from '../../hooks/useCustomers'
import Button from '../../components/ui/Button'
import '../../styles/customer.css'

function Customers() {
  const { customers, summary, loading, error } = useCustomers()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading customers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-state">
          <p>Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Customer Management</h1>
          <p className="page-description">Manage customers for RR Tenant</p>
        </div>
        <div className="page-actions">
          <Button className="add-customer-btn">
            <span className="btn-icon">+</span>
            Add Customer
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="card-content">
            <h3 className="card-title">Total Customers</h3>
            <p className="card-value">{summary.totalCustomers}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="card-content">
            <h3 className="card-title">Active Customers</h3>
            <p className="card-value">{summary.activeCustomers}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <div className="card-content">
            <h3 className="card-title">This Month</h3>
            <p className="card-value">{summary.thisMonth}</p>
          </div>
        </div>
      </div>

      {/* Customers List */}
      <div className="customers-section">
        <div className="section-header">
          <h2 className="section-title">Customers</h2>
          <p className="section-description">Manage your customer database.</p>
        </div>

        <div className="customers-list">
          {customers.map((customer) => (
            <div key={customer.id} className="customer-card">
              <div className="customer-avatar">
                <span className="avatar-text">{getInitials(customer.name)}</span>
              </div>
              
              <div className="customer-info">
                <h3 className="customer-name">{customer.name}</h3>
                <div className="customer-details">
                  <div className="contact-info">
                    <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span className="email">{customer.email}</span>
                  </div>
                  {customer.location && (
                    <div className="location-info">
                      <svg className="location-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span className="location">{customer.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="customer-meta">
                <div className={`status-badge ${customer.status}`}>
                  {customer.status}
                </div>
                <div className="created-date">
                  Created: {formatDate(customer.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Customers
