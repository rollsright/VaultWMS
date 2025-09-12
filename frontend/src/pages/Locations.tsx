import { useState } from 'react'
import { ChevronDownIcon, MagnifyingGlassIcon, DownloadIcon, PlusIcon } from '@radix-ui/react-icons'
import Button from '../components/ui/Button'

function Locations() {
  const [selectedWarehouse] = useState('All Warehouses')
  const [selectedStatus] = useState('All Statuses')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="locations-management">
      {/* Page Header */}
      <div className="locations-header">
        <div className="locations-header-content">
          <div>
            <h1 className="locations-title">Warehouse Locations</h1>
            <p className="locations-subtitle">Manage your warehouse storage locations</p>
          </div>
          <Button className="add-location-button">
            <PlusIcon className="w-4 h-4" />
            Add Location
          </Button>
        </div>
      </div>

      {/* Top Filter Bar */}
      <div className="locations-filters">
        <div className="filter-controls">
          {/* Warehouse Dropdown */}
          <div className="filter-dropdown">
            <button className="dropdown-button">
              <span>{selectedWarehouse}</span>
              <ChevronDownIcon className="dropdown-icon" />
            </button>
          </div>

          {/* Status Dropdown */}
          <div className="filter-dropdown">
            <button className="dropdown-button">
              <span>{selectedStatus}</span>
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
        </div>
      </div>

      {/* Warehouse Locations Section */}
      <div className="locations-card">
        <div className="locations-card-header">
          <h2 className="locations-card-title">Warehouse Locations</h2>
        </div>

        {/* Locations Table */}
        <div className="locations-table-container">
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
              {/* Empty state will be shown */}
            </tbody>
          </table>

          {/* Empty State */}
          <div className="locations-empty-state">
            <div className="empty-state-icon">
              📍
            </div>
            <h3 className="empty-state-title">Select a warehouse</h3>
            <p className="empty-state-description">
              Choose a specific warehouse to view its current locations
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Locations
