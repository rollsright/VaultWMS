import { useState } from 'react'
import { useCustomers } from '../../hooks/useCustomers'
import { useSetupItems } from '../../hooks/useSetupItems'
import { CreateSetupItemRequest, UpdateSetupItemRequest } from '../../types/setupItem'
import Button from '../../components/ui/Button'
import SetupItemModal from '../../components/SetupItemModal'
import '../../styles/customer.css'
import '../../styles/components.css'

function SetupItems() {
  const { customers } = useCustomers()
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')
  const { items, loading, error, createItem, updateItem, deleteItem, exportItems } = useSetupItems(selectedCustomerId)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<typeof items[0] | undefined>()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleAddItem = () => {
    setEditingItem(undefined)
    setIsModalOpen(true)
  }

  const handleEditItem = (item: typeof items[0]) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id)
      } catch (error) {
        console.error('Failed to delete item:', error)
      }
    }
  }

  const handleModalSubmit = async (data: CreateSetupItemRequest | UpdateSetupItemRequest) => {
    if (editingItem) {
      await updateItem(editingItem.id, data as UpdateSetupItemRequest)
    } else {
      await createItem(data as CreateSetupItemRequest)
    }
  }

  const handleExport = () => {
    exportItems()
  }

  // Filter items based on search
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId)

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading items...</p>
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
          <h1 className="page-title">Items Management</h1>
          <p className="page-description">Manage your inventory items and product catalog</p>
        </div>
      </div>

      {/* Customer Selection Section */}
      <div className="customers-section">
        <div className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <h2 className="section-title">Select Customer</h2>
          </div>
          <p className="section-description">Choose a customer to manage their items</p>
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
            <option value="">Select a customer...</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Items Section */}
      <div className="customers-section">
        <div className="section-header">
          <h2 className="section-title">Items</h2>
          <p className="section-description">Manage your inventory items</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <div className="search-container">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleExport}
              disabled={!selectedCustomerId || filteredItems.length === 0}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                whiteSpace: 'nowrap'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7,10 12,15 17,10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export
            </Button>

            <Button 
              className="add-customer-btn"
              onClick={handleAddItem}
              disabled={!selectedCustomerId}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                whiteSpace: 'nowrap'
              }}
            >
              <span className="btn-icon">+</span>
              Add Item
            </Button>
          </div>
        </div>

        {!selectedCustomerId ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto' }}>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Please select a customer to view items</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto' }}>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              {searchQuery ? 'No items match your search' : `No items found for ${selectedCustomer?.name || 'this customer'}`}
            </p>
            {!searchQuery && (
              <p style={{ fontSize: '0.9rem' }}>Add your first item to get started</p>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto', background: 'white' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Weight</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: '#1a1a1a' }}>{item.name}</div>
                    </td>
                    <td>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: '#6b7280' }}>
                        {item.sku || '-'}
                      </div>
                    </td>
                    <td>
                      <div style={{ color: '#6b7280', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.description || '-'}
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
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontFamily: 'monospace', color: '#6b7280' }}>
                        {item.weight ? `${item.weight} kg` : '-'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {formatDate(item.created_at)}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="action-button edit-button"
                          onClick={() => handleEditItem(item)}
                          title="Edit Item"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          className="action-button delete-button"
                          onClick={() => handleDeleteItem(item.id)}
                          title="Delete Item"
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
          </div>
        )}
      </div>

      {/* Item Modal */}
      <SetupItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        item={editingItem}
        customerId={selectedCustomerId}
        isEditing={!!editingItem}
      />
    </div>
  )
}

export default SetupItems
