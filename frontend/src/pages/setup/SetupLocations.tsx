import { useState } from 'react'
import { useLocations } from '../../hooks/useLocations'
import { useWarehouses } from '../../hooks/useWarehouses'
import { CreateLocationRequest, UpdateLocationRequest } from '../../types/location'
import Button from '../../components/ui/Button'
import LocationModal from '../../components/LocationModal'

function SetupLocations() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWarehouse, setSelectedWarehouse] = useState('All Warehouses')
  const [selectedStatus, setSelectedStatus] = useState('All Statuses')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<any | undefined>()
  
  // Get selected warehouse ID for filtering
  const selectedWarehouseId = selectedWarehouse === 'All Warehouses' ? undefined : selectedWarehouse
  
  const { warehouses } = useWarehouses()
  const { locations, summary, loading, error, createLocation, updateLocation, deleteLocation } = useLocations(selectedWarehouseId)

  const handleExport = () => {
    console.log('Export locations')
    // TODO: Implement export functionality
  }

  const handleAddLocation = () => {
    setEditingLocation(undefined)
    setIsModalOpen(true)
  }

  const handleEditLocation = (locationId: string) => {
    const location = locations.find(l => l.id === locationId)
    if (location) {
      setEditingLocation(location)
      setIsModalOpen(true)
    }
  }

  const handleDeleteLocation = async (locationId: string) => {
    if (window.confirm('Are you sure you want to delete this location? This action cannot be undone.')) {
      try {
        await deleteLocation(locationId)
      } catch (error) {
        console.error('Failed to delete location:', error)
        alert('Failed to delete location. Please try again.')
      }
    }
  }

  const handleModalSubmit = async (data: CreateLocationRequest | UpdateLocationRequest) => {
    if (editingLocation) {
      await updateLocation(editingLocation.id, data as UpdateLocationRequest)
    } else {
      await createLocation(data as CreateLocationRequest)
    }
  }

  const handleWarehouseChange = (warehouse: string) => {
    setSelectedWarehouse(warehouse)
  }

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status)
  }

  // Filter locations based on search and status
  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (location.name && location.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (location.aisle && location.aisle.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (location.bay && location.bay.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = selectedStatus === 'All Statuses' || 
                         (selectedStatus === 'ACTIVE' && location.status === 'active') ||
                         (selectedStatus === 'INACTIVE' && location.status === 'inactive')
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="locations-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading locations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="locations-management">
      {/* Top Header Bar */}
      <div className="top-header-bar">
        <div className="top-header-content">
          <div className="top-header-filters">
            <div className="filter-dropdown">
              <select
                value={selectedWarehouse}
                onChange={(e) => handleWarehouseChange(e.target.value)}
                className="dropdown-select"
              >
                <option value="All Warehouses">All Warehouses</option>
                {warehouses.filter(w => w.status === 'active').map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-dropdown">
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="dropdown-select"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="FULL">Full</option>
              </select>
            </div>
          </div>
          
          <div className="top-header-search">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="top-header-actions">
            <Button 
              onClick={handleExport}
              variant="outline"
              className="export-button"
            >
              <span className="button-icon">⬇️</span>
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main Header Section */}
      <div className="locations-header">
        <div className="locations-header-content">
          <div className="locations-title-section">
            <h1 className="locations-title">Warehouse Locations</h1>
            <p className="locations-subtitle">Manage your warehouse storage locations</p>
          </div>
          <Button 
            onClick={handleAddLocation}
            className="add-location-button"
          >
            <span className="button-icon">+</span>
            Add Location
          </Button>
        </div>
      </div>

      {/* Locations Section */}
      <div className="locations-section">
        <div className="locations-section-header">
          <h2 className="locations-section-title">Warehouse Locations</h2>
        </div>
        
        {/* Locations Table */}
        <div className="locations-table-container">
          {filteredLocations.length === 0 ? (
            <div className="locations-empty-state">
              <div className="empty-state-icon">📍</div>
              <h3 className="empty-state-title">
                {locations.length === 0 ? 'No locations found' : 'No locations match your filters'}
              </h3>
              <p className="empty-state-description">
                {locations.length === 0 
                  ? (selectedWarehouse === 'All Warehouses' 
                      ? 'Create your first location by clicking the "Add Location" button above'
                      : 'No locations found for the selected warehouse')
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
            </div>
          ) : (
            <table className="locations-table">
              <thead>
                <tr>
                  <th>Location Code</th>
                  <th>Name</th>
                  <th>Aisle</th>
                  <th>Bay</th>
                  <th>Level</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLocations.map((location) => (
                  <tr key={location.id}>
                    <td className="location-code">{location.code}</td>
                    <td className="location-name">{location.name || '-'}</td>
                    <td className="location-aisle">{location.aisle || '-'}</td>
                    <td className="location-bay">{location.bay || '-'}</td>
                    <td className="location-level">{location.level || '-'}</td>
                    <td>
                      <span className={`type-badge ${location.type.toLowerCase()}`}>
                        {location.type.charAt(0).toUpperCase() + location.type.slice(1).replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${location.status.toLowerCase()}`}>
                        {location.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="location-capacity">
                      {location.capacity ? `${location.capacity} ${location.capacity_unit || 'units'}` : '-'}
                    </td>
                    <td className="location-actions">
                      <button 
                        className="action-button edit-button"
                        onClick={() => handleEditLocation(location.id)}
                        title="Edit location"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-button delete-button"
                        onClick={() => handleDeleteLocation(location.id)}
                        title="Delete location"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message-container">
          <p className="error-message">{error}</p>
        </div>
      )}

      {/* Location Modal */}
      <LocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        location={editingLocation}
        selectedWarehouseId={selectedWarehouseId}
        isEditing={!!editingLocation}
      />
    </div>
  )
}

export default SetupLocations
