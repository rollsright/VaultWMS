import { useState } from 'react'
import { useCustomers } from '../../hooks/useCustomers'
import { useContacts } from '../../hooks/useContacts'
import { CreateContactRequest, UpdateContactRequest } from '../../types/contact'
import Button from '../../components/ui/Button'
import ContactModal from '../../components/ContactModal'
import '../../styles/customer.css'
import '../../styles/components.css'

function Contacts() {
  const { customers } = useCustomers()
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')
  const { contacts, summary, loading, error, createContact, updateContact, deleteContact } = useContacts(selectedCustomerId)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<typeof contacts[0] | undefined>()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const handleAddContact = () => {
    setEditingContact(undefined)
    setIsModalOpen(true)
  }

  const handleEditContact = (contact: typeof contacts[0]) => {
    setEditingContact(contact)
    setIsModalOpen(true)
  }

  const handleDeleteContact = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(id)
      } catch (error) {
        console.error('Failed to delete contact:', error)
      }
    }
  }

  const handleModalSubmit = async (data: CreateContactRequest | UpdateContactRequest) => {
    if (editingContact) {
      await updateContact(editingContact.id, data as UpdateContactRequest)
    } else {
      await createContact(data as CreateContactRequest)
    }
  }

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact => 
    `${contact.first_name} ${contact.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (contact.title && contact.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (contact.department && contact.department.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId)

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading contacts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-state">
          <p>Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Contact Management</h1>
          <p className="page-description">Manage customer contacts</p>
        </div>
        <div className="page-actions">
          <Button 
            className="add-customer-btn"
            onClick={handleAddContact}
            disabled={!selectedCustomerId}
          >
            <span className="btn-icon">+</span>
            Add Contact
          </Button>
        </div>
      </div>

      {/* Customer Selection Section */}
      <div className="customers-section">
        <div className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <h2 className="section-title">Select Customer</h2>
          </div>
        </div>
        
        <div className="customers-list" style={{ padding: '1.5rem' }}>
          <select 
            value={selectedCustomerId} 
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              fontSize: '1rem',
              background: 'white',
              color: selectedCustomerId ? '#1a1a1a' : '#6b7280'
            }}
          >
            <option value="">Choose a customer to manage contacts...</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contacts Section */}
      {selectedCustomerId && (
        <>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-icon" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="card-content">
                <h3 className="card-title">Total Contacts</h3>
                <p className="card-value">{summary.totalContacts}</p>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22,4 12,14.01 9,11.01"></polyline>
                </svg>
              </div>
              <div className="card-content">
                <h3 className="card-title">Active Contacts</h3>
                <p className="card-value">{summary.activeContacts}</p>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
              <div className="card-content">
                <h3 className="card-title">Inactive Contacts</h3>
                <p className="card-value">{summary.inactiveContacts}</p>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M22 16v-2a4 4 0 0 0-3-3.87"></path>
                  <circle cx="7" cy="12" r="1"></circle>
                </svg>
              </div>
              <div className="card-content">
                <h3 className="card-title">Primary Contacts</h3>
                <p className="card-value">{summary.primaryContacts}</p>
              </div>
            </div>
          </div>

          {/* Contacts List */}
          <div className="customers-section">
            <div className="section-header">
              <h2 className="section-title">Contacts</h2>
              <p className="section-description">Manage contact information</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                <div className="search-container">
                  <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {filteredContacts.length === 0 ? (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#6b7280' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto' }}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  {searchQuery ? 'No contacts match your search' : `No contacts found for ${selectedCustomer?.name || 'this customer'}`}
                </p>
                {!searchQuery && (
                  <p style={{ fontSize: '0.9rem' }}>Add your first contact to get started</p>
                )}
              </div>
            ) : (
              <div className="customers-list">
                {filteredContacts.map((contact) => (
                  <div key={contact.id} className="customer-card" onClick={() => handleEditContact(contact)} style={{ cursor: 'pointer' }}>
                    <div className="customer-avatar">
                      <span className="avatar-text">{getInitials(contact.first_name, contact.last_name)}</span>
                    </div>
                    
                    <div className="customer-info">
                      <h3 className="customer-name">
                        {contact.first_name} {contact.last_name}
                        {contact.is_primary && (
                          <span style={{ 
                            marginLeft: '0.5rem',
                            fontSize: '0.75rem',
                            backgroundColor: '#9333ea',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontWeight: '600'
                          }}>
                            PRIMARY
                          </span>
                        )}
                      </h3>
                      <div className="customer-details">
                        {contact.title && (
                          <div style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500', marginBottom: '0.25rem' }}>
                            {contact.title}
                            {contact.department && ` - ${contact.department}`}
                          </div>
                        )}
                        {contact.email && (
                          <div className="contact-info">
                            <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                              <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <span className="email">{contact.email}</span>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="contact-info">
                            <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span className="email">{contact.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="customer-meta">
                      <div className={`status-badge ${contact.status}`}>
                        {contact.status}
                      </div>
                      <div className="created-date">
                        Created: {formatDate(contact.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        contact={editingContact}
        customerId={selectedCustomerId}
        isEditing={!!editingContact}
      />
    </div>
  )
}

export default Contacts
