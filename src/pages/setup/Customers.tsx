import Button from '../../components/ui/Button'

function Customers() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <p className="page-description">Manage customer information and settings</p>
        <div className="page-actions">
          <Button>Add New Customer</Button>
        </div>
      </div>
      
      <div className="page-content">
        <div className="content-card">
          <div className="card-header">
            <h2>Customer Management</h2>
          </div>
          <div className="card-content">
            <p>Customer management functionality will be implemented here.</p>
            <p>Features will include:</p>
            <ul>
              <li>Create and edit customer profiles</li>
              <li>Manage billing and shipping addresses</li>
              <li>Set customer-specific pricing</li>
              <li>Configure delivery preferences</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Customers
