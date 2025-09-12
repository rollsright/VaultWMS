import Button from '../../components/ui/Button'

function DocumentTypes() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Document Types</h1>
        <p className="page-description">Configure document types and templates</p>
        <div className="page-actions">
          <Button>Add New Document Type</Button>
        </div>
      </div>
      
      <div className="page-content">
        <div className="content-card">
          <div className="card-header">
            <h2>Document Type Management</h2>
          </div>
          <div className="card-content">
            <p>Document type management functionality will be implemented here.</p>
            <p>Features will include:</p>
            <ul>
              <li>Create document type definitions</li>
              <li>Configure document templates</li>
              <li>Set approval workflows</li>
              <li>Manage document numbering</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentTypes
