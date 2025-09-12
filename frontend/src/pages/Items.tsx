import { useState } from 'react'
import { ChevronDownIcon, MagnifyingGlassIcon, DownloadIcon, ReloadIcon, BellIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import Button from '../components/ui/Button'

function Items() {
  const [selectedWarehouse] = useState('All Warehouses')
  const [selectedCustomer] = useState('All Customers')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="inventory-management">
      {/* Page Header */}
      <div className="inventory-header">
        <h1 className="inventory-title">Inventory Management</h1>
        <p className="inventory-subtitle">Manage items and inventory for RR Tenant</p>
      </div>

      {/* Top Filter Bar */}
      <div className="inventory-filters">
        <div className="filter-controls">
          {/* Warehouse Dropdown */}
          <div className="filter-dropdown">
            <button className="dropdown-button">
              <span>{selectedWarehouse}</span>
              <ChevronDownIcon className="dropdown-icon" />
            </button>
          </div>

          {/* Customer Dropdown */}
          <div className="filter-dropdown">
            <button className="dropdown-button">
              <span>{selectedCustomer}</span>
              <ChevronDownIcon className="dropdown-icon" />
            </button>
          </div>

          {/* Search */}
          <div className="search-container">
            <MagnifyingGlassIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="action-controls">
          {/* Export Button */}
          <Button variant="outline" className="action-button">
            <DownloadIcon className="action-icon" />
            Export
          </Button>

          {/* Refresh Button */}
          <Button variant="outline" className="action-button">
            <ReloadIcon className="action-icon" />
            Refresh
          </Button>

          {/* Notification Icon */}
          <button className="icon-button">
            <BellIcon />
          </button>

          {/* Help Icon */}
          <button className="icon-button">
            <QuestionMarkCircledIcon />
          </button>
        </div>
      </div>

      {/* Current Inventory Section */}
      <div className="inventory-card">
        <div className="inventory-card-header">
          <h2 className="inventory-card-title">Current Inventory</h2>
          <div className="auto-refresh">
            Auto-refresh: 30s
          </div>
        </div>

        {/* Inventory Table */}
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Item</th>
                <th>Location</th>
                <th>Total</th>
                <th>Available</th>
                <th>Reserved</th>
                <th>Status</th>
                <th>Last Movement</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty state will be shown */}
            </tbody>
          </table>

          {/* Empty State */}
          <div className="inventory-empty-state">
            <div className="empty-state-icon">
              📦
            </div>
            <h3 className="empty-state-title">Select a warehouse</h3>
            <p className="empty-state-description">
              Choose a specific warehouse to view its current inventory
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Items
