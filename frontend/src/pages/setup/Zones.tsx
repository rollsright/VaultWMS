import { useState } from 'react'
import Button from '../../components/ui/Button'

// Mock data for zones - will be replaced with API calls later
const mockZones: any[] = [] // Empty for now to show empty state

function Zones() {
  const [zones] = useState(mockZones)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWarehouse, setSelectedWarehouse] = useState('All Warehouses')
  const [selectedType, setSelectedType] = useState('All Types')
  
  // Calculate summary statistics
  const totalZones = zones.length
  const activeZones = zones.filter(z => z.status === 'ACTIVE').length
  const storageZones = zones.filter(z => z.type === 'STORAGE').length
  const receivingZones = zones.filter(z => z.type === 'RECEIVING').length

  const handleExportCSV = () => {
    console.log('Export CSV')
    // TODO: Implement CSV export
  }

  const handleExportXLSX = () => {
    console.log('Export XLSX')
    // TODO: Implement XLSX export
  }

  const handleAddZone = () => {
    console.log('Add new zone')
    // TODO: Implement add zone functionality
  }

  const handleWarehouseChange = (warehouse: string) => {
    setSelectedWarehouse(warehouse)
    // TODO: Filter zones by warehouse
  }

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    // TODO: Filter zones by type
  }

  return (
    <div className="zones-management">
      {/* Header Section */}
      <div className="zones-header">
        <div className="zones-header-content">
          <div className="zones-title-section">
            <h1 className="zones-title">Warehouse Zones</h1>
            <p className="zones-subtitle">Manage warehouse zones for organizing storage locations</p>
          </div>
          <div className="zones-header-actions">
            <Button 
              onClick={handleExportCSV}
              variant="outline"
              className="export-button"
            >
              <span className="button-icon">📄</span>
              Export (CSV)
            </Button>
            <Button 
              onClick={handleExportXLSX}
              variant="outline"
              className="export-button"
            >
              <span className="button-icon">📄</span>
              Export (XLSX)
            </Button>
            <Button 
              onClick={handleAddZone}
              className="add-zone-button"
            >
              <span className="button-icon">+</span>
              Add Zone
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="zones-stats-grid">
        <div className="zones-stat-card">
          <div className="stat-content">
            <div className="stat-number">{totalZones}</div>
            <div className="stat-label">Total Zones</div>
            <div className="stat-description">Across all warehouses</div>
          </div>
          <div className="stat-icon zones-icon">📦</div>
        </div>
        
        <div className="zones-stat-card">
          <div className="stat-content">
            <div className="stat-number">{activeZones}</div>
            <div className="stat-label">Active Zones</div>
            <div className="stat-description">Currently operational</div>
          </div>
          <div className="stat-icon active-icon">🟢</div>
        </div>
        
        <div className="zones-stat-card">
          <div className="stat-content">
            <div className="stat-number">{storageZones}</div>
            <div className="stat-label">Storage Zones</div>
            <div className="stat-description">For inventory storage</div>
          </div>
          <div className="stat-icon storage-icon">🟣</div>
        </div>
        
        <div className="zones-stat-card">
          <div className="stat-content">
            <div className="stat-number">{receivingZones}</div>
            <div className="stat-label">Receiving Zones</div>
            <div className="stat-description">For incoming goods</div>
          </div>
          <div className="stat-icon receiving-icon">🟠</div>
        </div>
      </div>

      {/* Zones Section */}
      <div className="zones-section">
        <div className="zones-section-header">
          <h2 className="zones-section-title">Zones</h2>
          <p className="zones-section-subtitle">View and manage warehouse zones</p>
        </div>
        
        {/* Filters and Search */}
        <div className="zones-filters">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search zones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
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
              value={selectedType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="dropdown-select"
            >
              <option value="All Types">All Types</option>
              <option value="STORAGE">Storage</option>
              <option value="RECEIVING">Receiving</option>
              <option value="PICKING">Picking</option>
              <option value="SHIPPING">Shipping</option>
            </select>
          </div>
        </div>
        
        {/* Zones Table */}
        <div className="zones-table-container">
          {zones.length === 0 ? (
            <div className="zones-empty-state">
              <div className="empty-state-icon">📦</div>
              <h3 className="empty-state-title">Select a warehouse</h3>
              <p className="empty-state-description">Choose a specific warehouse to view and manage its zones</p>
            </div>
          ) : (
            <table className="zones-table">
              <thead>
                <tr>
                  <th>Zone Name</th>
                  <th>Zone Code</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => (
                  <tr key={zone.id}>
                    <td className="zone-name">{zone.name}</td>
                    <td className="zone-code">{zone.code}</td>
                    <td>
                      <span className={`type-badge ${zone.type.toLowerCase()}`}>
                        {zone.type}
                      </span>
                    </td>
                    <td className="zone-capacity">{zone.capacity}</td>
                    <td>
                      <span className={`status-badge ${zone.status.toLowerCase()}`}>
                        {zone.status}
                      </span>
                    </td>
                    <td className="zone-description">{zone.description}</td>
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

export default Zones
