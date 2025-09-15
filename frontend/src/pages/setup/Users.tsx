import { useState } from 'react'
import { useUsers } from '../../hooks/useUsers'
import { CreateUserRequest, UpdateUserRequest, ROLE_COLORS } from '../../types/user'
import Button from '../../components/ui/Button'
import UserModal from '../../components/UserModal'
import '../../styles/customer.css'
import '../../styles/components.css'

function Users() {
  const [activeTab, setActiveTab] = useState<'system' | 'customer'>('system')
  const { users, summary, loading, error, createUser, updateUser } = useUsers(activeTab)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [userFilter, setUserFilter] = useState('All Users')
  const [sortBy, setSortBy] = useState('Full Name')
  const [sortOrder, setSortOrder] = useState('A-Z')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<typeof users[0] | undefined>()

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

  const handleAddUser = () => {
    setEditingUser(undefined)
    setIsModalOpen(true)
  }

  const handleEditUser = (user: typeof users[0]) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }


  const handleModalSubmit = async (data: CreateUserRequest | UpdateUserRequest) => {
    if (editingUser) {
      await updateUser(editingUser.id, data as UpdateUserRequest)
    } else {
      await createUser(data as CreateUserRequest)
    }
  }

  // Filter users based on search, role, and user type
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter
    const matchesUserFilter = userFilter === 'All Users' || 
      (userFilter === 'Active' && user.status === 'active') ||
      (userFilter === 'Inactive' && user.status === 'inactive')
    
    return matchesSearch && matchesRole && matchesUserFilter
  })

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue = '', bValue = ''
    
    switch (sortBy) {
      case 'Full Name':
        aValue = `${a.first_name} ${a.last_name}`
        bValue = `${b.first_name} ${b.last_name}`
        break
      case 'Username':
        aValue = a.username
        bValue = b.username
        break
      case 'Email':
        aValue = a.email
        bValue = b.email
        break
      case 'Role':
        aValue = a.role
        bValue = b.role
        break
      case 'Created':
        aValue = a.created_at
        bValue = b.created_at
        break
      default:
        aValue = `${a.first_name} ${a.last_name}`
        bValue = `${b.first_name} ${b.last_name}`
    }

    if (sortOrder === 'A-Z') {
      return aValue.localeCompare(bValue)
    } else {
      return bValue.localeCompare(aValue)
    }
  })

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
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
          <h1 className="page-title">User Management</h1>
          <p className="page-description">Manage system users and customer users</p>
        </div>
        <div className="page-actions">
          <Button 
            className="add-customer-btn"
            onClick={handleAddUser}
          >
            <span className="btn-icon">+</span>
            Add User
          </Button>
        </div>
      </div>

      {/* Tab Section */}
      <div className="customers-section">
        <div className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
            <button
              onClick={() => setActiveTab('system')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                border: activeTab === 'system' ? '2px solid #2563eb' : '2px solid transparent',
                borderRadius: '8px',
                background: activeTab === 'system' ? '#f0f9ff' : 'transparent',
                color: activeTab === 'system' ? '#2563eb' : '#6b7280',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Tenant Users
            </button>

            <button
              onClick={() => setActiveTab('customer')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                border: activeTab === 'customer' ? '2px solid #2563eb' : '2px solid transparent',
                borderRadius: '8px',
                background: activeTab === 'customer' ? '#f0f9ff' : 'transparent',
                color: activeTab === 'customer' ? '#2563eb' : '#6b7280',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Customer Users
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="customers-section">
        <div className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div className="search-container">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '1rem',
                background: 'white',
                color: '#1a1a1a',
                minWidth: '150px'
              }}
            >
              <option value="All Roles">All Roles</option>
              <option value="Tenant Super Admin">Tenant Super Admin</option>
              <option value="Staff User">Staff User</option>
              <option value="Customer Admin">Customer Admin</option>
              <option value="Customer User">Customer User</option>
              <option value="Warehouse Manager">Warehouse Manager</option>
            </select>

            <select 
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '1rem',
                background: 'white',
                color: '#1a1a1a',
                minWidth: '120px'
              }}
            >
              <option value="All Users">All Users</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '1rem',
                background: 'white',
                color: '#1a1a1a',
                minWidth: '130px'
              }}
            >
              <option value="Full Name">Full Name</option>
              <option value="Username">Username</option>
              <option value="Email">Email</option>
              <option value="Role">Role</option>
              <option value="Created">Created</option>
            </select>

            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '1rem',
                background: 'white',
                color: '#1a1a1a',
                minWidth: '80px'
              }}
            >
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
            </select>
          </div>
        </div>
      </div>

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
            <h3 className="card-title">Total Users</h3>
            <p className="card-value">{summary.totalUsers}</p>
            <p className="card-subtitle">{summary.totalUsers} shown</p>
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
            <h3 className="card-title">Active Users</h3>
            <p className="card-value">{summary.activeUsers}</p>
            <p className="card-subtitle">{summary.totalUsers > 0 ? Math.round((summary.activeUsers / summary.totalUsers) * 100) : 0}% of total</p>
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
            <h3 className="card-title">Inactive Users</h3>
            <p className="card-value">{summary.inactiveUsers}</p>
            <p className="card-subtitle">{summary.totalUsers > 0 ? Math.round((summary.inactiveUsers / summary.totalUsers) * 100) : 0}% of total</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4"></path>
              <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
              <path d="M21 16c.552 0 1-.448 1-1v-2c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v2c0 .552.448 1 1 1h18z"></path>
            </svg>
          </div>
          <div className="card-content">
            <h3 className="card-title">Administrators</h3>
            <p className="card-value">{summary.administrators}</p>
            <p className="card-subtitle">Privileged access</p>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="customers-section">
        <div className="section-header">
          <h2 className="section-title">{activeTab === 'system' ? 'System Users' : 'Customer Users'}</h2>
          <p className="section-description">{sortedUsers.length} users found</p>
        </div>

        {sortedUsers.length === 0 ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto' }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              {searchQuery || roleFilter !== 'All Roles' || userFilter !== 'All Users' ? 'No users match your filters' : `No ${activeTab} users found`}
            </p>
            {!searchQuery && roleFilter === 'All Roles' && userFilter === 'All Users' && (
              <p style={{ fontSize: '0.9rem' }}>Add your first user to get started</p>
            )}
          </div>
        ) : (
          <div className="customers-list">
            {sortedUsers.map((user) => (
              <div key={user.id} className="customer-card" onClick={() => handleEditUser(user)} style={{ cursor: 'pointer' }}>
                <div className="customer-avatar">
                  <span className="avatar-text">{getInitials(user.first_name, user.last_name)}</span>
                </div>
                
                <div className="customer-info">
                  <h3 className="customer-name">
                    {user.first_name} {user.last_name}
                    <span style={{ 
                      marginLeft: '0.75rem',
                      fontSize: '0.75rem',
                      backgroundColor: ROLE_COLORS[user.role].bg,
                      color: ROLE_COLORS[user.role].text,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '6px',
                      fontWeight: '600'
                    }}>
                      {user.role}
                    </span>
                  </h3>
                  <div className="customer-details">
                    <div className="contact-info">
                      <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span className="email">@{user.username}</span>
                    </div>
                    <div className="contact-info">
                      <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      <span className="email">{user.email}</span>
                    </div>
                    {user.customer_name && (
                      <div className="contact-info">
                        <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9,22 9,12 15,12 15,22"></polyline>
                        </svg>
                        <span className="email">{user.customer_name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="customer-meta">
                  <div className={`status-badge ${user.status}`} style={{ 
                    backgroundColor: user.status === 'active' ? '#16a34a' : '#dc2626',
                    color: 'white',
                    marginBottom: '0.5rem'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.25rem' }}>
                      {user.status === 'active' ? (
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      ) : (
                        <circle cx="12" cy="12" r="10"></circle>
                      )}
                      {user.status === 'active' && <polyline points="22,4 12,14.01 9,11.01"></polyline>}
                      {user.status === 'inactive' && (
                        <>
                          <line x1="15" y1="9" x2="9" y2="15"></line>
                          <line x1="9" y1="9" x2="15" y2="15"></line>
                        </>
                      )}
                    </svg>
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                  <div className="created-date">
                    Created: {formatDate(user.created_at)}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      className="action-button edit-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditUser(user)
                      }}
                      title="Edit User"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Edit
                    </button>
                    <button
                      className="action-button"
                      onClick={(e) => e.stopPropagation()}
                      title="More actions"
                      style={{ padding: '0.25rem 0.5rem' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        user={editingUser}
        isEditing={!!editingUser}
      />
    </div>
  )
}

export default Users
