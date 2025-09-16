import { useState } from 'react'
import { useWarehouses } from '../../hooks/useWarehouses'
import { CreateWarehouseRequest, UpdateWarehouseRequest } from '../../types/warehouse'
import Button from '../../components/ui/Button'
import WarehouseModal from '../../components/WarehouseModal'

function Warehouses() {
  const { warehouses, summary, loading, error, createWarehouse, updateWarehouse, deleteWarehouse } = useWarehouses()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState<typeof warehouses[0] | undefined>()
  
  // Calculate summary statistics
  const totalWarehouses = summary.totalWarehouses
  const activeWarehouses = summary.activeWarehouses
  const totalLocations = '-'

  const handleEdit = (warehouseId: string) => {
    const warehouse = warehouses.find(w => w.id === warehouseId)
    if (warehouse) {
      setEditingWarehouse(warehouse)
      setIsModalOpen(true)
    }
  }

  const handleDelete = async (warehouseId: string) => {
    if (window.confirm('Are you sure you want to delete this warehouse? This action cannot be undone.')) {
      try {
        await deleteWarehouse(warehouseId)
      } catch (error) {
        console.error('Failed to delete warehouse:', error)
        alert('Failed to delete warehouse. Please try again.')
      }
    }
  }

  const handleAddWarehouse = () => {
    setEditingWarehouse(undefined)
    setIsModalOpen(true)
  }

  const handleModalSubmit = async (data: CreateWarehouseRequest | UpdateWarehouseRequest) => {
    if (editingWarehouse) {
      await updateWarehouse(editingWarehouse.id, data as UpdateWarehouseRequest)
    } else {
      await createWarehouse(data as CreateWarehouseRequest)
    }
  }

  if (loading) {
    return (
      <div className="warehouse-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading warehouses...</p>
        </div>
      </div>
    )
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
                      {warehouse.status.toUpperCase()}
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

      {/* Error Display */}
      {error && (
        <div className="error-message-container">
          <p className="error-message">{error}</p>
        </div>
      )}

      {/* Warehouse Modal */}
      <WarehouseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        warehouse={editingWarehouse}
        isEditing={!!editingWarehouse}
      />
    </div>
  )
}

export default Warehouses
