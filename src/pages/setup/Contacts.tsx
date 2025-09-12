import Button from '../../components/ui/Button'

function Contacts() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Contacts</h1>
        <p className="page-description">Manage contact information for customers and suppliers</p>
        <div className="page-actions">
          <Button>Add New Contact</Button>
        </div>
      </div>
      
      <div className="page-content">
        <div className="content-card">
          <div className="card-header">
            <h2>Contact Management</h2>
          </div>
          <div className="card-content">
            <p>Contact management functionality will be implemented here.</p>
            <p>Features will include:</p>
            <ul>
              <li>Create and manage contacts</li>
              <li>Organize by customer/supplier</li>
              <li>Set contact preferences</li>
              <li>Track communication history</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contacts
