import Button from '../../components/ui/Button'

function SetupLocations() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Setup Locations</h1>
        <p className="page-description">Configure storage locations within zones</p>
        <div className="page-actions">
          <Button>Add New Location</Button>
        </div>
      </div>
      
      <div className="page-content">
        <div className="content-card">
          <div className="card-header">
            <h2>Location Setup</h2>
          </div>
          <div className="card-content">
            <p>Location setup functionality will be implemented here.</p>
            <p>Features will include:</p>
            <ul>
              <li>Create storage locations</li>
              <li>Define location coordinates</li>
              <li>Set location types and properties</li>
              <li>Configure picking sequences</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetupLocations
