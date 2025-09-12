import Button from '../../components/ui/Button'

function UOMs() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Units of Measurement (UOMs)</h1>
        <p className="page-description">Configure units of measurement for inventory</p>
        <div className="page-actions">
          <Button>Add New UOM</Button>
        </div>
      </div>
      
      <div className="page-content">
        <div className="content-card">
          <div className="card-header">
            <h2>UOM Management</h2>
          </div>
          <div className="card-content">
            <p>Unit of measurement management functionality will be implemented here.</p>
            <p>Features will include:</p>
            <ul>
              <li>Create and manage UOMs</li>
              <li>Define conversion factors</li>
              <li>Set base and alternate units</li>
              <li>Configure precision settings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UOMs
