import { useState } from 'react'
import Button from '../../components/ui/Button'

// Mock data for locations - will be replaced with API calls later
const mockLocations: any[] = [] // Empty for now to show empty state

function SetupLocations() {
  const [locations] = useState(mockLocations)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWarehouse, setSelectedWarehouse] = useState('All Warehouses')
  const [selectedStatus, setSelectedStatus] = useState('All Statuses')

  const handleExport = () => {
    console.log('Export locations')
    // TODO: Implement export functionality
  }

  const handleAddLocation = () => {
    console.log('Add new location')
    // TODO: Implement add location functionality
  }

  const handleWarehouseChange = (warehouse: string) => {
    setSelectedWarehouse(warehouse)
    // TODO: Filter locations by warehouse
  }

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status)
    // TODO: Filter locations by status
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
                <option value="Delta Warehouse">Delta Warehouse</option>
                <option value="Delta Warehouse2">Delta Warehouse2</option>
                <option value="Coquitlam Test-01">Coquitlam Test-01</option>
                <option value="East Vancouver Test">East Vancouver Test</option>
                <option value="United">United</option>
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
          {locations.length === 0 ? (
            <div className="locations-empty-state">
              <div className="empty-state-icon">📍</div>
              <h3 className="empty-state-title">Select a warehouse</h3>
              <p className="empty-state-description">Choose a specific warehouse to view its current locations</p>
            </div>
          ) : (
            <table className="locations-table">
              <thead>
                <tr>
                  <th>Location Code</th>
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
                {locations.map((location) => (
                  <tr key={location.id}>
                    <td className="location-code">{location.code}</td>
                    <td className="location-aisle">{location.aisle}</td>
                    <td className="location-bay">{location.bay}</td>
                    <td className="location-level">{location.level}</td>
                    <td>
                      <span className={`type-badge ${location.type.toLowerCase()}`}>
                        {location.type}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${location.status.toLowerCase()}`}>
                        {location.status}
                      </span>
                    </td>
                    <td className="location-capacity">{location.capacity}</td>
                    <td className="location-actions">
                      <button 
                        className="action-button edit-button"
                        onClick={() => console.log('Edit location:', location.id)}
                        title="Edit location"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-button delete-button"
                        onClick={() => console.log('Delete location:', location.id)}
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
    </div>
  )
}

export default SetupLocations
