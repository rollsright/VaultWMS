import { useState } from 'react'
import { useZones } from '../../hooks/useZones'
import { useWarehouses } from '../../hooks/useWarehouses'
import { CreateZoneRequest, UpdateZoneRequest } from '../../types/zone'
import Button from '../../components/ui/Button'
import ZoneModal from '../../components/ZoneModal'

function Zones() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWarehouse, setSelectedWarehouse] = useState('All Warehouses')
  const [selectedType, setSelectedType] = useState('All Types')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingZone, setEditingZone] = useState<any | undefined>()
  
  // Get selected warehouse ID for filtering
  const selectedWarehouseId = selectedWarehouse === 'All Warehouses' ? undefined : selectedWarehouse
  
  const { warehouses } = useWarehouses()
  const { zones, summary, loading, error, createZone, updateZone, deleteZone } = useZones(selectedWarehouseId)
  
  // Calculate summary statistics
  const totalZones = summary.totalZones
  const activeZones = summary.activeZones
  const storageZones = summary.storageZones
  const receivingZones = summary.receivingZones

  const handleExportCSV = () => {
    console.log('Export CSV')
    // TODO: Implement CSV export
  }

  const handleExportXLSX = () => {
    console.log('Export XLSX')
    // TODO: Implement XLSX export
  }

  const handleAddZone = () => {
    setEditingZone(undefined)
    setIsModalOpen(true)
  }

  const handleEditZone = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId)
    if (zone) {
      setEditingZone(zone)
      setIsModalOpen(true)
    }
  }

  const handleDeleteZone = async (zoneId: string) => {
    if (window.confirm('Are you sure you want to delete this zone? This action cannot be undone.')) {
      try {
        await deleteZone(zoneId)
      } catch (error) {
        console.error('Failed to delete zone:', error)
        alert('Failed to delete zone. Please try again.')
      }
    }
  }

  const handleModalSubmit = async (data: CreateZoneRequest | UpdateZoneRequest) => {
    if (editingZone) {
      await updateZone(editingZone.id, data as UpdateZoneRequest)
    } else {
      await createZone(data as CreateZoneRequest)
    }
  }

  const handleWarehouseChange = (warehouse: string) => {
    setSelectedWarehouse(warehouse)
  }

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
  }

  // Filter zones based on search and type
  const filteredZones = zones.filter(zone => {
    const matchesSearch = zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zone.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zone.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'All Types' || zone.type === selectedType.toLowerCase()
    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <div className="zones-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading zones...</p>
        </div>
      </div>
    )
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
          {filteredZones.length === 0 ? (
            <div className="zones-empty-state">
              <div className="empty-state-icon">📦</div>
              <h3 className="empty-state-title">
                {zones.length === 0 ? 'No zones found' : 'No zones match your filters'}
              </h3>
              <p className="empty-state-description">
                {zones.length === 0 
                  ? (selectedWarehouse === 'All Warehouses' 
                      ? 'Create your first zone by clicking the "Add Zone" button above'
                      : 'No zones found for the selected warehouse')
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredZones.map((zone) => (
                  <tr key={zone.id}>
                    <td className="zone-name">{zone.name}</td>
                    <td className="zone-code">{zone.code}</td>
                    <td>
                      <span className={`type-badge ${zone.type.toLowerCase()}`}>
                        {zone.type.charAt(0).toUpperCase() + zone.type.slice(1)}
                      </span>
                    </td>
                    <td className="zone-capacity">
                      {zone.capacity ? `${zone.capacity} ${zone.capacity_unit || 'units'}` : '-'}
                    </td>
                    <td>
                      <span className={`status-badge ${zone.status.toLowerCase()}`}>
                        {zone.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="zone-description">{zone.description || '-'}</td>
                    <td className="zone-actions">
                      <button 
                        className="action-button edit-button"
                        onClick={() => handleEditZone(zone.id)}
                        title="Edit zone"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-button delete-button"
                        onClick={() => handleDeleteZone(zone.id)}
                        title="Delete zone"
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

      {/* Zone Modal */}
      <ZoneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        zone={editingZone}
        selectedWarehouseId={selectedWarehouseId}
        isEditing={!!editingZone}
      />
    </div>
  )
}

export default Zones
