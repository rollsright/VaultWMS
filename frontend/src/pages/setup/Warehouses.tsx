import { useState } from 'react'
import Button from '../../components/ui/Button'

// Mock data for warehouses - will be replaced with API calls later
const mockWarehouses = [
  {
    id: 1,
    name: 'Delta Warehouse2',
    code: 'Delta2',
    location: 'Delta, BC',
    status: 'ACTIVE'
  },
  {
    id: 2,
    name: 'Delta Warehouse',
    code: 'Delta',
    location: 'Delta, BC',
    status: 'ACTIVE'
  },
  {
    id: 3,
    name: 'Coquitlam Test-01',
    code: 'CQ-TEST',
    location: 'Vancouver, BC',
    status: 'INACTIVE'
  },
  {
    id: 4,
    name: 'East Vancouver Test',
    code: 'EVT-01',
    location: 'Vancouver, BC',
    status: 'ACTIVE'
  },
  {
    id: 5,
    name: 'United',
    code: 'UN-01',
    location: 'Coquitlam, BC',
    status: 'ACTIVE'
  }
]

function Warehouses() {
  const [warehouses] = useState(mockWarehouses)
  
  // Calculate summary statistics
  const totalWarehouses = warehouses.length
  const activeWarehouses = warehouses.filter(w => w.status === 'ACTIVE').length
  const totalLocations = '-'

  const handleEdit = (warehouseId: number) => {
    console.log('Edit warehouse:', warehouseId)
    // TODO: Implement edit functionality
  }

  const handleDelete = (warehouseId: number) => {
    console.log('Delete warehouse:', warehouseId)
    // TODO: Implement delete functionality
  }

  const handleAddWarehouse = () => {
    console.log('Add new warehouse')
    // TODO: Implement add warehouse functionality
  }

  return (
    <div className="warehouse-management">
      {/* Header Section */}
      <div className="warehouse-header">
        <div className="warehouse-header-content">
          <div className="warehouse-title-section">
            <h1 className="warehouse-title">Warehouse Management</h1>
            <p className="warehouse-subtitle">Manage warehouses for RR Tenant</p>
          </div>
          <Button 
            onClick={handleAddWarehouse}
            className="add-warehouse-button"
          >
            <span className="button-icon">+</span>
            Add Warehouse
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="warehouse-stats-grid">
        <div className="warehouse-stat-card">
          <div className="stat-content">
            <div className="stat-number">{totalWarehouses}</div>
            <div className="stat-label">Total Warehouses</div>
          </div>
          <div className="stat-icon warehouse-icon">🏢</div>
        </div>
        
        <div className="warehouse-stat-card">
          <div className="stat-content">
            <div className="stat-number">{activeWarehouses}</div>
            <div className="stat-label">Active Warehouses</div>
          </div>
          <div className="stat-icon chart-icon">📊</div>
        </div>
        
        <div className="warehouse-stat-card">
          <div className="stat-content">
            <div className="stat-number">{totalLocations}</div>
            <div className="stat-label">Locations</div>
          </div>
          <div className="stat-icon location-icon">📍</div>
        </div>
      </div>

      {/* Warehouses Table Section */}
      <div className="warehouses-section">
        <div className="warehouses-section-header">
          <h2 className="warehouses-section-title">Warehouses</h2>
          <p className="warehouses-section-subtitle">Manage and monitor your warehouse locations</p>
        </div>
        
        <div className="warehouses-table-container">
          <table className="warehouses-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td className="warehouse-name">{warehouse.name}</td>
                  <td className="warehouse-code">{warehouse.code}</td>
                  <td className="warehouse-location">{warehouse.location}</td>
                  <td>
                    <span className={`status-badge ${warehouse.status.toLowerCase()}`}>
                      {warehouse.status}
                    </span>
                  </td>
                  <td className="warehouse-actions">
                    <button 
                      className="action-button edit-button"
                      onClick={() => handleEdit(warehouse.id)}
                      title="Edit warehouse"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-button delete-button"
                      onClick={() => handleDelete(warehouse.id)}
                      title="Delete warehouse"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Warehouses
