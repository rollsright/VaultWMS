import { useState } from 'react'
import { useCarriers } from '../../hooks/useCarriers'
import { CreateCarrierRequest, UpdateCarrierRequest } from '../../types/carrier'
import Button from '../../components/ui/Button'
import CarrierModal from '../../components/CarrierModal'
import '../../styles/customer.css'
import '../../styles/components.css'

function Carriers() {
  const { carriers, summary, loading, error, createCarrier, updateCarrier, deleteCarrier } = useCarriers()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCarrier, setEditingCarrier] = useState<typeof carriers[0] | undefined>()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleAddCarrier = () => {
    setEditingCarrier(undefined)
    setIsModalOpen(true)
  }

  const handleEditCarrier = (carrier: typeof carriers[0]) => {
    setEditingCarrier(carrier)
    setIsModalOpen(true)
  }

  const handleDeleteCarrier = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this carrier?')) {
      try {
        await deleteCarrier(id)
      } catch (error) {
        console.error('Failed to delete carrier:', error)
      }
    }
  }

  const handleModalSubmit = async (data: CreateCarrierRequest | UpdateCarrierRequest) => {
    if (editingCarrier) {
      await updateCarrier(editingCarrier.id, data as UpdateCarrierRequest)
    } else {
      await createCarrier(data as CreateCarrierRequest)
    }
  }

  // Filter carriers based on search
  const filteredCarriers = carriers.filter(carrier => 
    carrier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    carrier.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (carrier.contact_name && carrier.contact_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (carrier.contact_email && carrier.contact_email.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading carriers...</p>
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
          <h1 className="page-title">Carrier Management</h1>
          <p className="page-description">Manage shipping carriers and their service configurations</p>
        </div>
        <div className="page-actions">
          <Button 
            className="add-customer-btn"
            onClick={handleAddCarrier}
          >
            <span className="btn-icon">+</span>
            Add Carrier
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
              <path d="M15 18H9"></path>
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"></path>
              <path d="M8 8v4"></path>
              <path d="M9 18h6"></path>
              <circle cx="17" cy="18" r="2"></circle>
              <circle cx="7" cy="18" r="2"></circle>
            </svg>
          </div>
          <div className="card-content">
            <h3 className="card-title">Total Carriers</h3>
            <p className="card-value">{summary.totalCarriers}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
          </div>
          <div className="card-content">
            <h3 className="card-title">Active Carriers</h3>
            <p className="card-value">{summary.activeCarriers}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div className="card-content">
            <h3 className="card-title">Inactive Carriers</h3>
            <p className="card-value">{summary.inactiveCarriers}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
              <path d="M15 18H9"></path>
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"></path>
              <circle cx="17" cy="18" r="2"></circle>
              <circle cx="7" cy="18" r="2"></circle>
            </svg>
          </div>
          <div className="card-content">
            <h3 className="card-title">Total Services</h3>
            <p className="card-value">{summary.totalServices}</p>
          </div>
        </div>
      </div>

      {/* Carriers Table */}
      <div className="customers-section">
        <div className="section-header">
          <h2 className="section-title">Carriers</h2>
          <p className="section-description">Manage your shipping carrier network</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <div className="search-container">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search carriers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto', background: 'white' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Service Types</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Tracking</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCarriers.map((carrier) => (
                <tr key={carrier.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: '#1a1a1a' }}>{carrier.name}</div>
                  </td>
                  <td>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: '#6b7280' }}>
                      {carrier.code}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {carrier.service_types.length > 0 ? (
                        carrier.service_types.map((service, index) => (
                          <span 
                            key={index}
                            style={{ 
                              backgroundColor: '#f3f4f6',
                              color: '#374151',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}
                          >
                            {service}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem' }}>
                      {carrier.contact_name && (
                        <div style={{ fontWeight: '600', color: '#1a1a1a' }}>{carrier.contact_name}</div>
                      )}
                      {carrier.contact_email && (
                        <div style={{ color: '#6b7280' }}>{carrier.contact_email}</div>
                      )}
                      {carrier.contact_phone && (
                        <div style={{ color: '#6b7280' }}>{carrier.contact_phone}</div>
                      )}
                      {!carrier.contact_name && !carrier.contact_email && !carrier.contact_phone && (
                        <span style={{ color: '#9ca3af' }}>-</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}
                    >
                      {carrier.status}
                    </span>
                  </td>
                  <td>
                    {carrier.tracking_url ? (
                      <a
                        href={carrier.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#2563eb',
                          fontSize: '0.875rem',
                          textDecoration: 'none'
                        }}
                      >
                        🔗
                      </a>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="action-button edit-button"
                        onClick={() => handleEditCarrier(carrier)}
                        title="Edit Carrier"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDeleteCarrier(carrier.id)}
                        title="Delete Carrier"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCarriers.length === 0 && (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#6b7280' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto' }}>
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
                  <path d="M15 18H9"></path>
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"></path>
                  <circle cx="17" cy="18" r="2"></circle>
                  <circle cx="7" cy="18" r="2"></circle>
                </svg>
              </div>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No carriers found</p>
              <p style={{ fontSize: '0.9rem' }}>
                {searchQuery 
                  ? 'Try adjusting your search criteria' 
                  : 'Create your first carrier to get started'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Carrier Modal */}
      <CarrierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        carrier={editingCarrier}
        isEditing={!!editingCarrier}
      />
    </div>
  )
}

export default Carriers
