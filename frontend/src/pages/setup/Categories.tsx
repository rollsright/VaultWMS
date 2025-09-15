import { useState } from 'react'
import { useCategories } from '../../hooks/useCategories'
import { CreateCategoryRequest, UpdateCategoryRequest } from '../../types/category'
import Button from '../../components/ui/Button'
import CategoryModal from '../../components/CategoryModal'
import '../../styles/customer.css'
import '../../styles/components.css'

function Categories() {
  const { categories, summary, loading, error, createCategory, updateCategory, deleteCategory } = useCategories()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<typeof categories[0] | undefined>()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleAddCategory = () => {
    setEditingCategory(undefined)
    setIsModalOpen(true)
  }

  const handleEditCategory = (category: typeof categories[0]) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id)
      } catch (error) {
        console.error('Failed to delete category:', error)
      }
    }
  }

  const handleModalSubmit = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data as UpdateCategoryRequest)
    } else {
      await createCategory(data as CreateCategoryRequest)
    }
  }

  // Filter categories based on search
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading categories...</p>
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
          <h1 className="page-title">Categories</h1>
          <p className="page-description">Organize your inventory with category management</p>
        </div>
        <div className="page-actions">
          <Button 
            className="add-customer-btn"
            onClick={handleAddCategory}
          >
            <span className="btn-icon">+</span>
            Add Category
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 7h.01"></path>
              <path d="M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 0 1 0 2.828l-7 7a2 2 0 0 1-2.828 0l-7-7A1.994 1.994 0 0 1 3 12V7a4 4 0 0 1 4-4z"></path>
            </svg>
          </div>
          <div className="card-content">
            <h3 className="card-title">Total Categories</h3>
            <p className="card-value">{summary.totalCategories}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
          </div>
          <div className="card-content">
            <h3 className="card-title">Active Categories</h3>
            <p className="card-value">{summary.activeCategories}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div className="card-content">
            <h3 className="card-title">Inactive Categories</h3>
            <p className="card-value">{summary.inactiveCategories}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="customers-section">
        <div className="section-header" style={{ paddingBottom: '0' }}>
          <div className="search-container" style={{ maxWidth: 'none', width: '100%' }}>
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="customers-section">
        <div className="section-header">
          <h2 className="section-title">Categories List</h2>
        </div>

        <div style={{ overflowX: 'auto', background: 'white' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Sort Order</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: '#1a1a1a' }}>{category.name}</div>
                  </td>
                  <td>
                    <div style={{ color: '#6b7280' }}>
                      {category.description || '-'}
                    </div>
                  </td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}
                    >
                      {category.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontFamily: 'monospace', color: '#6b7280' }}>
                      {category.sort_order}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {formatDate(category.created_at)}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="action-button edit-button"
                        onClick={() => handleEditCategory(category)}
                        title="Edit Category"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDeleteCategory(category.id)}
                        title="Delete Category"
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

          {filteredCategories.length === 0 && (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#6b7280' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto' }}>
                  <path d="M7 7h.01"></path>
                  <path d="M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 0 1 0 2.828l-7 7a2 2 0 0 1-2.828 0l-7-7A1.994 1.994 0 0 1 3 12V7a4 4 0 0 1 4-4z"></path>
                </svg>
              </div>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No categories found</p>
              <p style={{ fontSize: '0.9rem' }}>
                {searchQuery 
                  ? 'Try adjusting your search criteria' 
                  : 'Create your first category to get started'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        category={editingCategory}
        isEditing={!!editingCategory}
      />
    </div>
  )
}

export default Categories
