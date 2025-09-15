import { useState, useEffect } from 'react'
import { User, CreateUserRequest, UpdateUserRequest, UserRole, UserType } from '../types/user'
import { useCustomers } from '../hooks/useCustomers'
import Button from './ui/Button'

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>
  user?: User
  isEditing?: boolean
}

function UserModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  user, 
  isEditing = false 
}: UserModalProps) {
  const { customers } = useCustomers()
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'Staff User' as UserRole,
    user_type: 'system' as UserType,
    status: 'active' as 'active' | 'inactive',
    is_active: true,
    customer_id: '',
    password: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user && isEditing) {
      setFormData({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        user_type: user.user_type,
        status: user.status,
        is_active: user.is_active,
        customer_id: user.customer_id || '',
        password: ''
      })
    } else {
      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        role: 'Staff User',
        user_type: 'system',
        status: 'active',
        is_active: true,
        customer_id: '',
        password: ''
      })
    }
    setErrors({})
  }, [user, isEditing, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    }

    if (!isEditing && !formData.password.trim()) {
      newErrors.password = 'Password is required for new users'
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.user_type === 'customer' && !formData.customer_id) {
      newErrors.customer_id = 'Customer is required for customer users'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const submitData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        role: formData.role,
        user_type: formData.user_type,
        status: formData.status,
        is_active: formData.is_active,
        customer_id: formData.user_type === 'customer' ? formData.customer_id : undefined,
        ...(formData.password && { password: formData.password })
      }
      
      await onSubmit(submitData)
      onClose()
    } catch (error) {
      console.error('Failed to submit user:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value,
      // Reset customer_id when switching to system user
      ...(field === 'user_type' && value === 'system' ? { customer_id: '' } : {})
    }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getAvailableRoles = (): UserRole[] => {
    if (formData.user_type === 'system') {
      return ['Tenant Super Admin', 'Staff User', 'Warehouse Manager']
    } else {
      return ['Customer Admin', 'Customer User']
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit User' : 'Add New User'}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3 className="form-section-title">Basic Information</h3>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="first_name">First Name *</label>
                <input
                  id="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  className={errors.first_name ? 'error' : ''}
                  placeholder="Enter first name"
                />
                {errors.first_name && <span className="error-message">{errors.first_name}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="last_name">Last Name *</label>
                <input
                  id="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  className={errors.last_name ? 'error' : ''}
                  placeholder="Enter last name"
                />
                {errors.last_name && <span className="error-message">{errors.last_name}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="username">Username *</label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className={errors.username ? 'error' : ''}
                  placeholder="Enter username"
                  disabled={isEditing}
                />
                {errors.username && <span className="error-message">{errors.username}</span>}
                {isEditing && (
                  <small style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                    Username cannot be changed
                  </small>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter email address"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            {(!isEditing || formData.password) && (
              <div className="form-field">
                <label htmlFor="password">
                  Password {!isEditing ? '*' : ''}
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={errors.password ? 'error' : ''}
                  placeholder={isEditing ? "Leave blank to keep current password" : "Enter password"}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
                {isEditing && (
                  <small style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                    Leave blank to keep current password
                  </small>
                )}
              </div>
            )}
          </div>

          {/* User Type & Role */}
          <div className="form-section">
            <h3 className="form-section-title">User Type & Permissions</h3>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="user_type">User Type</label>
                <select
                  id="user_type"
                  value={formData.user_type}
                  onChange={(e) => {
                    const newType = e.target.value as UserType
                    handleChange('user_type', newType)
                    // Reset role to appropriate default
                    if (newType === 'system') {
                      handleChange('role', 'Staff User')
                    } else {
                      handleChange('role', 'Customer User')
                    }
                  }}
                  disabled={isEditing}
                >
                  <option value="system">System User</option>
                  <option value="customer">Customer User</option>
                </select>
                {isEditing && (
                  <small style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                    User type cannot be changed
                  </small>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                >
                  {getAvailableRoles().map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formData.user_type === 'customer' && (
              <div className="form-field">
                <label htmlFor="customer_id">Customer *</label>
                <select
                  id="customer_id"
                  value={formData.customer_id}
                  onChange={(e) => handleChange('customer_id', e.target.value)}
                  className={errors.customer_id ? 'error' : ''}
                >
                  <option value="">Select customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
                {errors.customer_id && <span className="error-message">{errors.customer_id}</span>}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="form-section">
            <h3 className="form-section-title">Settings</h3>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="form-field">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                  <input
                    id="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => handleChange('is_active', e.target.checked)}
                    style={{ width: 'auto' }}
                  />
                  <label htmlFor="is_active" style={{ margin: 0, cursor: 'pointer' }}>
                    User account is active
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update User' : 'Add User')}
            </Button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e5e5;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          padding: 0.5rem;
          cursor: pointer;
          color: #6b7280;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: #f3f4f6;
          color: #1a1a1a;
        }

        .modal-form {
          padding: 1.5rem;
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .form-section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e5e5;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .form-field label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }

        .form-field input,
        .form-field select {
          padding: 0.75rem 1rem;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
          background: white;
        }

        .form-field input:focus,
        .form-field select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-field input.error {
          border-color: #dc2626;
        }

        .form-field input:disabled,
        .form-field select:disabled {
          background-color: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
        }

        .error-message {
          color: #dc2626;
          font-size: 0.75rem;
          margin-top: -0.25rem;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e5e5;
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .modal-content {
            margin: 0;
            border-radius: 0;
            height: 100vh;
            max-height: none;
          }
          
          .modal-overlay {
            padding: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default UserModal
