import Button from '../../components/ui/Button'

function Zones() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Zones</h1>
        <p className="page-description">Define warehouse zones and areas</p>
        <div className="page-actions">
          <Button>Add New Zone</Button>
        </div>
      </div>
      
      <div className="page-content">
        <div className="content-card">
          <div className="card-header">
            <h2>Zone Management</h2>
          </div>
          <div className="card-content">
            <p>Zone management functionality will be implemented here.</p>
            <p>Features will include:</p>
            <ul>
              <li>Create warehouse zones</li>
              <li>Define zone characteristics</li>
              <li>Set zone capacity limits</li>
              <li>Configure zone-specific rules</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Zones
