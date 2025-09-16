import { useState } from 'react'
import { useCustomers } from '../../hooks/useCustomers'
import { useSuppliers } from '../../hooks/useSuppliers'
import { CreateSupplierRequest, UpdateSupplierRequest } from '../../types/supplier'
import Button from '../../components/ui/Button'
import SupplierModal from '../../components/SupplierModal'
import '../../styles/customer.css'

function Suppliers() {
  const { customers } = useCustomers()
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')
  const { suppliers, summary, loading, error, createSupplier, updateSupplier, deleteSupplier } = useSuppliers(selectedCustomerId)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<typeof suppliers[0] | undefined>()

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

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId)

  const handleAddSupplier = () => {
    setEditingSupplier(undefined)
    setIsModalOpen(true)
  }

  const handleEditSupplier = (supplier: typeof suppliers[0]) => {
    setEditingSupplier(supplier)
    setIsModalOpen(true)
  }

  const handleDeleteSupplier = async (supplierId: string) => {
    if (window.confirm('Are you sure you want to delete this supplier? This action cannot be undone.')) {
      try {
        await deleteSupplier(supplierId)
      } catch (error) {
        console.error('Failed to delete supplier:', error)
        alert('Failed to delete supplier. Please try again.')
      }
    }
  }

  const handleModalSubmit = async (data: CreateSupplierRequest | UpdateSupplierRequest) => {
    if (editingSupplier) {
      await updateSupplier(editingSupplier.id, data as UpdateSupplierRequest)
    } else {
      await createSupplier(data as CreateSupplierRequest)
    }
  }

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Supplier Management</h1>
          <p className="page-description">Manage suppliers for RR Tenant</p>
        </div>
        <div className="page-actions">
          <Button 
            className="add-customer-btn"
            disabled={!selectedCustomerId}
            onClick={handleAddSupplier}
          >
            <span className="btn-icon">+</span>
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Customer Selection Section */}
      <div className="customers-section">
        <div className="section-header">
          <h2 className="section-title">Select Customer</h2>
          <p className="section-description">Choose a customer to view and manage their suppliers</p>
        </div>
        
        <div className="customers-list" style={{ padding: '1.5rem' }}>
          <select 
            value={selectedCustomerId} 
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              fontSize: '1rem',
              background: 'white',
              color: selectedCustomerId ? '#1a1a1a' : '#6b7280'
            }}
          >
            <option value="">Select a customer to view suppliers</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Suppliers Section */}
      {selectedCustomerId && (
        <>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 7h-9"></path>
                  <path d="M14 17H5"></path>
                  <circle cx="17" cy="17" r="3"></circle>
                  <circle cx="7" cy="7" r="3"></circle>
                </svg>
              </div>
              <div className="card-content">
                <h3 className="card-title">Total Suppliers</h3>
                <p className="card-value">{summary.totalSuppliers}</p>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 7h-9"></path>
                  <path d="M14 17H5"></path>
                  <circle cx="17" cy="17" r="3"></circle>
                  <circle cx="7" cy="7" r="3"></circle>
                </svg>
              </div>
              <div className="card-content">
                <h3 className="card-title">Active Suppliers</h3>
                <p className="card-value">{summary.activeSuppliers}</p>
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

          {/* Suppliers List */}
          <div className="customers-section">
            <div className="section-header">
              <h2 className="section-title">Suppliers</h2>
              <p className="section-description">Manage your supplier network</p>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading suppliers...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>Error: {error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : suppliers.length === 0 ? (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#6b7280' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto' }}>
                    <path d="M20 7h-9"></path>
                    <path d="M14 17H5"></path>
                    <circle cx="17" cy="17" r="3"></circle>
                    <circle cx="7" cy="7" r="3"></circle>
                  </svg>
                </div>
                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Please select a customer to view suppliers</p>
                {selectedCustomer && (
                  <p style={{ fontSize: '0.9rem' }}>No suppliers found for {selectedCustomer.name}</p>
                )}
              </div>
            ) : (
              <div className="customers-list">
                {suppliers.map((supplier) => (
                  <div key={supplier.id} className="customer-card">
                    <div className="customer-avatar">
                      <span className="avatar-text">{getInitials(supplier.name)}</span>
                    </div>
                    
                    <div className="customer-info">
                      <h3 className="customer-name">{supplier.name}</h3>
                      <div className="customer-details">
                        <div className="contact-info">
                          <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                          <span className="email">{supplier.email}</span>
                        </div>
                        {supplier.phone && (
                          <div className="contact-info">
                            <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span className="email">{supplier.phone}</span>
                          </div>
                        )}
                        {supplier.contact_person && (
                          <div className="contact-info">
                            <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span className="email">{supplier.contact_person}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="customer-meta">
                      <div className="customer-actions">
                        <button 
                          className="action-button edit-button"
                          onClick={() => handleEditSupplier(supplier)}
                          title="Edit supplier"
                        >
                          ✏️
                        </button>
                        <button 
                          className="action-button delete-button"
                          onClick={() => handleDeleteSupplier(supplier.id)}
                          title="Delete supplier"
                        >
                          🗑️
                        </button>
                      </div>
                      <div className={`status-badge ${supplier.status}`}>
                        {supplier.status.toUpperCase()}
                      </div>
                      {supplier.payment_terms && (
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                          {supplier.payment_terms}
                        </div>
                      )}
                      <div className="created-date">
                        Created: {formatDate(supplier.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Supplier Modal */}
      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        supplier={editingSupplier}
        customerId={selectedCustomerId}
        isEditing={!!editingSupplier}
      />
    </div>
  )
}

export default Suppliers
