import Button from '../../components/ui/Button'

function Categories() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <p className="page-description">Organize items into categories and subcategories</p>
        <div className="page-actions">
          <Button>Add New Category</Button>
        </div>
      </div>
      
      <div className="page-content">
        <div className="content-card">
          <div className="card-header">
            <h2>Category Management</h2>
          </div>
          <div className="card-content">
            <p>Category management functionality will be implemented here.</p>
            <p>Features will include:</p>
            <ul>
              <li>Create hierarchical categories</li>
              <li>Define category attributes</li>
              <li>Set category-specific rules</li>
              <li>Manage category relationships</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Categories
