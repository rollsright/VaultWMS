import Button from '../../components/ui/Button'

function Carriers() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Carriers</h1>
        <p className="page-description">Manage shipping carriers and delivery services</p>
        <div className="page-actions">
          <Button>Add New Carrier</Button>
        </div>
      </div>
      
      <div className="page-content">
        <div className="content-card">
          <div className="card-header">
            <h2>Carrier Management</h2>
          </div>
          <div className="card-content">
            <p>Carrier management functionality will be implemented here.</p>
            <p>Features will include:</p>
            <ul>
              <li>Create and manage carriers</li>
              <li>Configure shipping services</li>
              <li>Set rate tables and zones</li>
              <li>Manage carrier integrations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Carriers
