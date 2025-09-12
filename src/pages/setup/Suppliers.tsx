import Button from '../../components/ui/Button'

function Suppliers() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Suppliers</h1>
        <p className="page-description">Manage supplier information and configurations</p>
        <div className="page-actions">
          <Button>Add New Supplier</Button>
        </div>
      </div>
      
      <div className="page-content">
        <div className="content-card">
          <div className="card-header">
            <h2>Supplier Management</h2>
          </div>
          <div className="card-content">
            <p>Supplier management functionality will be implemented here.</p>
            <p>Features will include:</p>
            <ul>
              <li>Create and edit supplier profiles</li>
              <li>Manage supplier contacts</li>
              <li>Configure purchase terms</li>
              <li>Track supplier performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Suppliers
