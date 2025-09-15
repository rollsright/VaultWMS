import { useState } from 'react'
import { useWarehouses } from '../../hooks/useWarehouses'
import { useDoors } from '../../hooks/useDoors'
import { CreateDoorRequest, UpdateDoorRequest } from '../../types/door'
import Button from '../../components/ui/Button'
import DoorModal from '../../components/DoorModal'
import '../../styles/customer.css'
import '../../styles/components.css'

function Doors() {
  const { warehouses } = useWarehouses()
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('')
  const { doors, summary, loading, error, createDoor, updateDoor } = useDoors(selectedWarehouseId)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDoor, setEditingDoor] = useState<typeof doors[0] | undefined>()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleAddDoor = () => {
    setEditingDoor(undefined)
    setIsModalOpen(true)
  }

  const handleEditDoor = (door: typeof doors[0]) => {
    setEditingDoor(door)
    setIsModalOpen(true)
  }


  const handleModalSubmit = async (data: CreateDoorRequest | UpdateDoorRequest) => {
    if (editingDoor) {
      await updateDoor(editingDoor.id, data as UpdateDoorRequest)
    } else {
      await createDoor(data as CreateDoorRequest)
    }
  }

  // Filter doors based on search
  const filteredDoors = doors.filter(door => 
    door.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    door.door_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    door.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (door.location && door.location.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const selectedWarehouse = warehouses.find(w => w.id === selectedWarehouseId)

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading doors...</p>
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
          <h1 className="page-title">Dock Doors Management</h1>
          <p className="page-description">Manage warehouse dock doors and their configurations</p>
        </div>
        <div className="page-actions">
          <Button 
            className="add-customer-btn"
            onClick={handleAddDoor}
            disabled={!selectedWarehouseId || selectedWarehouseId === 'all'}
          >
            <span className="btn-icon">+</span>
            Add Door
          </Button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="customers-section">
        <div className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div className="search-container">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search doors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select 
              value={selectedWarehouseId} 
              onChange={(e) => setSelectedWarehouseId(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '1rem',
                background: 'white',
                color: selectedWarehouseId ? '#1a1a1a' : '#6b7280',
                minWidth: '200px'
              }}
            >
              <option value="">All Warehouses</option>
              <option value="all">All Warehouses</option>
              {warehouses.filter(w => w.status === 'active').map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {selectedWarehouseId && (
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-icon" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Total Doors</h3>
              <p className="card-value">{summary.totalDoors}</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Inbound Doors</h3>
              <p className="card-value">{summary.inboundDoors}</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Outbound Doors</h3>
              <p className="card-value">{summary.outboundDoors}</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Active Doors</h3>
              <p className="card-value">{summary.activeDoors}</p>
            </div>
          </div>
        </div>
      )}

      {/* Doors Section */}
      <div className="customers-section">
        <div className="section-header">
          <h2 className="section-title">Dock Doors</h2>
          <p className="section-description">
            {selectedWarehouseId === 'all' ? 'All warehouse dock doors' : 
             selectedWarehouseId ? `Select a warehouse to view its dock doors` : 
             'Select a warehouse to view its dock doors'}
          </p>
        </div>

        {!selectedWarehouseId ? (
          <div style={{ padding: '4rem 1.5rem', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.3 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto' }}>
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#374151' }}>Select a warehouse</h3>
            <p style={{ fontSize: '1rem' }}>Choose a warehouse from the dropdown to view its dock doors</p>
          </div>
        ) : filteredDoors.length === 0 ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto' }}>
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              {searchQuery ? 'No doors match your search' : `No doors found for ${selectedWarehouse?.name || 'this warehouse'}`}
            </p>
            {!searchQuery && selectedWarehouseId !== 'all' && (
              <p style={{ fontSize: '0.9rem' }}>Add your first door to get started</p>
            )}
          </div>
        ) : (
          <div className="customers-list">
            {filteredDoors.map((door) => (
              <div key={door.id} className="customer-card" onClick={() => handleEditDoor(door)} style={{ cursor: 'pointer' }}>
                <div className="customer-avatar">
                  <span className="avatar-text">{door.door_number}</span>
                </div>
                
                <div className="customer-info">
                  <h3 className="customer-name">
                    {door.name}
                    <span style={{ 
                      marginLeft: '0.5rem',
                      fontSize: '0.75rem',
                      backgroundColor: door.type === 'inbound' ? '#16a34a' : door.type === 'outbound' ? '#9333ea' : '#d97706',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {door.type}
                    </span>
                  </h3>
                  <div className="customer-details">
                    <div style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500', marginBottom: '0.25rem' }}>
                      Door #{door.door_number}
                      {door.location && ` - ${door.location}`}
                    </div>
                    {door.description && (
                      <div className="contact-info">
                        <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14,2 14,8 20,8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10,9 9,9 8,9"></polyline>
                        </svg>
                        <span className="email">{door.description}</span>
                      </div>
                    )}
                    {door.dimensions && (
                      <div className="contact-info">
                        <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <rect x="7" y="7" width="10" height="10" rx="1" ry="1"></rect>
                        </svg>
                        <span className="email">{door.dimensions.width}W × {door.dimensions.height}H ft</span>
                      </div>
                    )}
                    {door.capacity && (
                      <div className="contact-info">
                        <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M16 3h5v5"></path>
                          <path d="M8 3H3v5"></path>
                          <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"></path>
                          <path d="M21 3l-7.828 7.828A4 4 0 0 0 12 13.657V22"></path>
                        </svg>
                        <span className="email">{door.capacity.toLocaleString()} lbs capacity</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="customer-meta">
                  <div className={`status-badge ${door.status}`}>
                    {door.status}
                  </div>
                  {door.equipment && door.equipment.length > 0 && (
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Equipment: {door.equipment.slice(0, 2).join(', ')}
                      {door.equipment.length > 2 && ` +${door.equipment.length - 2} more`}
                    </div>
                  )}
                  <div className="created-date">
                    Created: {formatDate(door.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Door Modal */}
      <DoorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        door={editingDoor}
        selectedWarehouseId={selectedWarehouseId}
        isEditing={!!editingDoor}
      />
    </div>
  )
}

export default Doors
