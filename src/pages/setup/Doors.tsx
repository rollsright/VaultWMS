import Button from '../../components/ui/Button'

function Doors() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Doors</h1>
        <p className="page-description">Configure warehouse doors and dock assignments</p>
        <div className="page-actions">
          <Button>Add New Door</Button>
        </div>
      </div>
      
      <div className="page-content">
        <div className="content-card">
          <div className="card-header">
            <h2>Door Management</h2>
          </div>
          <div className="card-content">
            <p>Door management functionality will be implemented here.</p>
            <p>Features will include:</p>
            <ul>
              <li>Create and configure doors</li>
              <li>Set door types and capabilities</li>
              <li>Assign doors to operations</li>
              <li>Schedule door usage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Doors
