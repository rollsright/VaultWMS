import { useState } from 'react'
import { useUOMs } from '../../hooks/useUOMs'
import { CreateUOMRequest, UpdateUOMRequest, UOM_TYPE_COLORS } from '../../types/uom'
import Button from '../../components/ui/Button'
import UOMModal from '../../components/UOMModal'
import '../../styles/customer.css'
import '../../styles/components.css'

function UOMs() {
  const { uoms, summary, loading, error, createUOM, updateUOM, deleteUOM } = useUOMs()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUOM, setEditingUOM] = useState<typeof uoms[0] | undefined>()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleAddUOM = () => {
    setEditingUOM(undefined)
    setIsModalOpen(true)
  }

  const handleEditUOM = (uom: typeof uoms[0]) => {
    setEditingUOM(uom)
    setIsModalOpen(true)
  }

  const handleDeleteUOM = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this UOM?')) {
      try {
        await deleteUOM(id)
      } catch (error) {
        console.error('Failed to delete UOM:', error)
      }
    }
  }

  const handleModalSubmit = async (data: CreateUOMRequest | UpdateUOMRequest) => {
    if (editingUOM) {
      await updateUOM(editingUOM.id, data as UpdateUOMRequest)
    } else {
      await createUOM(data as CreateUOMRequest)
    }
  }

  // Filter UOMs based on search and type
  const filteredUOMs = uoms.filter(uom => {
    const matchesSearch = uom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         uom.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || uom.type === typeFilter
    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading UOMs...</p>
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
          <h1 className="page-title">UOMs Management</h1>
          <p className="page-description">Manage Unit of Measure configurations for your warehouse</p>
        </div>
        <div className="page-actions">
          <Button 
            className="add-customer-btn"
            onClick={handleAddUOM}
          >
            <span className="btn-icon">+</span>
            Add UOM
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z"></path>
              <path d="M21 11h-4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z"></path>
              <path d="M7 3H5a2 2 0 0 0-2 2v2h4V5a2 2 0 0 0-2-2z"></path>
              <path d="M19 3h-2a2 2 0 0 0-2 2v2h4V5a2 2 0 0 0-2-2z"></path>
            </svg>
          </div>
          <div className="card-content">
            <h3 className="card-title">Total UOMs</h3>
            <p className="card-value">{summary.totalUOMs}</p>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Configured unit measures
            </p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div className="card-content">
            <h3 className="card-title">Weight UOMs</h3>
            <p className="card-value">{summary.weightUOMs}</p>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Weight measurements
            </p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
          </div>
          <div className="card-content">
            <h3 className="card-title">Volume UOMs</h3>
            <p className="card-value">{summary.volumeUOMs}</p>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Volume measurements
            </p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
              <path d="M13 13l6 6"></path>
            </svg>
          </div>
          <div className="card-content">
            <h3 className="card-title">Length UOMs</h3>
            <p className="card-value">{summary.lengthUOMs}</p>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Length measurements
            </p>
          </div>
        </div>
      </div>

      {/* UOM Configuration Table */}
      <div className="customers-section">
        <div className="section-header">
          <h2 className="section-title">UOM Configuration</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <div className="search-container">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search UOMs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="dropdown-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="COUNT">Count</option>
              <option value="WEIGHT">Weight</option>
              <option value="VOLUME">Volume</option>
              <option value="LENGTH">Length</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto', background: 'white' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Type</th>
                <th>Conversion Factor</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUOMs.map((uom) => (
                <tr key={uom.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: '#1a1a1a' }}>{uom.name}</div>
                  </td>
                  <td>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: '#6b7280' }}>
                      {uom.code}
                    </div>
                  </td>
                  <td>
                    <span 
                      className="type-badge"
                      style={{ 
                        backgroundColor: UOM_TYPE_COLORS[uom.type].bg,
                        color: UOM_TYPE_COLORS[uom.type].text,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}
                    >
                      {uom.type}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontFamily: 'monospace' }}>{uom.conversion_factor.toFixed(4)}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {formatDate(uom.created_at)}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="action-button edit-button"
                        onClick={() => handleEditUOM(uom)}
                        title="Edit UOM"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDeleteUOM(uom.id)}
                        title="Delete UOM"
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

          {filteredUOMs.length === 0 && (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#6b7280' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto' }}>
                  <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z"></path>
                  <path d="M21 11h-4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z"></path>
                </svg>
              </div>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No UOMs found</p>
              <p style={{ fontSize: '0.9rem' }}>
                {searchQuery || typeFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Create your first UOM to get started'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* UOM Modal */}
      <UOMModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        uom={editingUOM}
        isEditing={!!editingUOM}
      />
    </div>
  )
}

export default UOMs
