import { useState, useEffect } from 'react'
import { Warehouse, CreateWarehouseRequest, UpdateWarehouseRequest } from '../types/warehouse'
import Button from './ui/Button'

interface WarehouseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateWarehouseRequest | UpdateWarehouseRequest) => Promise<void>
  warehouse?: Warehouse
  isEditing?: boolean
}

const CAPACITY_UNITS = [
  { value: 'square_feet', label: 'Square Feet' },
  { value: 'cubic_feet', label: 'Cubic Feet' },
  { value: 'square_meters', label: 'Square Meters' },
  { value: 'cubic_meters', label: 'Cubic Meters' },
];

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Toronto', label: 'Toronto (EST/EDT)' },
  { value: 'America/Vancouver', label: 'Vancouver (PST/PDT)' },
];

function WarehouseModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  warehouse, 
  isEditing = false 
}: WarehouseModalProps) {
  
  const [formData, setFormData] = useState({
    name: '',
    warehouse_code: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    manager_name: '',
    manager_email: '',
    manager_phone: '',
    total_capacity: '',
    capacity_unit: 'square_feet',
    timezone: 'UTC',
    is_active: true
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (warehouse && isEditing) {
      setFormData({
        name: warehouse.name,
        warehouse_code: warehouse.code,
        description: warehouse.description || '',
        address: {
          street: warehouse.address?.street || '',
          city: warehouse.address?.city || '',
          state: warehouse.address?.state || '',
          zip: warehouse.address?.zip || '',
          country: warehouse.address?.country || ''
        },
        manager_name: warehouse.manager_name || '',
        manager_email: warehouse.manager_email || '',
        manager_phone: warehouse.manager_phone || '',
        total_capacity: warehouse.total_capacity?.toString() || '',
        capacity_unit: warehouse.capacity_unit || 'square_feet',
        timezone: warehouse.timezone || 'UTC',
        is_active: warehouse.status === 'active'
      })
    } else {
      setFormData({
        name: '',
        warehouse_code: '',
        description: '',
        address: {
          street: '',
          city: '',
          state: '',
          zip: '',
          country: ''
        },
        manager_name: '',
        manager_email: '',
        manager_phone: '',
        total_capacity: '',
        capacity_unit: 'square_feet',
        timezone: 'UTC',
        is_active: true
      })
    }
    setErrors({})
  }, [warehouse, isEditing, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Warehouse name is required'
    }
    
    if (!formData.warehouse_code.trim()) {
      newErrors.warehouse_code = 'Warehouse code is required'
    }
    
    if (formData.manager_email && !/\S+@\S+\.\S+/.test(formData.manager_email)) {
      newErrors.manager_email = 'Please enter a valid email address'
    }
    
    if (formData.total_capacity && isNaN(Number(formData.total_capacity))) {
      newErrors.total_capacity = 'Capacity must be a valid number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: string, value: any) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const submitData: CreateWarehouseRequest | UpdateWarehouseRequest = {
        name: formData.name.trim(),
        warehouse_code: formData.warehouse_code.trim(),
        description: formData.description.trim() || undefined,
        address: Object.values(formData.address).some(v => v.trim()) ? formData.address : undefined,
        manager_name: formData.manager_name.trim() || undefined,
        manager_email: formData.manager_email.trim() || undefined,
        manager_phone: formData.manager_phone.trim() || undefined,
        total_capacity: formData.total_capacity ? Number(formData.total_capacity) : undefined,
        capacity_unit: formData.capacity_unit,
        timezone: formData.timezone,
        is_active: formData.is_active
      }
      
      await onSubmit(submitData)
      onClose()
    } catch (error) {
      console.error('Failed to submit warehouse:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Warehouse' : 'Add New Warehouse'}</h2>
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
                <label htmlFor="name">Warehouse Name *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={errors.name ? 'error' : ''}
                  placeholder="Enter warehouse name"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="warehouse_code">Warehouse Code *</label>
                <input
                  id="warehouse_code"
                  type="text"
                  value={formData.warehouse_code}
                  onChange={(e) => handleChange('warehouse_code', e.target.value)}
                  className={errors.warehouse_code ? 'error' : ''}
                  placeholder="Enter warehouse code"
                  disabled={isEditing}
                />
                {errors.warehouse_code && <span className="error-message">{errors.warehouse_code}</span>}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter warehouse description"
                rows={3}
              />
            </div>

            <div className="form-field">
              <label>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                />
                Active Warehouse
              </label>
            </div>
          </div>

          {/* Address Information */}
          <div className="form-section">
            <h3 className="form-section-title">Address Information</h3>
            
            <div className="form-field">
              <label htmlFor="street">Street Address</label>
              <input
                id="street"
                type="text"
                value={formData.address.street}
                onChange={(e) => handleChange('address.street', e.target.value)}
                placeholder="Enter street address"
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleChange('address.city', e.target.value)}
                  placeholder="Enter city"
                />
              </div>

              <div className="form-field">
                <label htmlFor="state">State/Province</label>
                <input
                  id="state"
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => handleChange('address.state', e.target.value)}
                  placeholder="Enter state/province"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="zip">ZIP/Postal Code</label>
                <input
                  id="zip"
                  type="text"
                  value={formData.address.zip}
                  onChange={(e) => handleChange('address.zip', e.target.value)}
                  placeholder="Enter ZIP/postal code"
                />
              </div>

              <div className="form-field">
                <label htmlFor="country">Country</label>
                <input
                  id="country"
                  type="text"
                  value={formData.address.country}
                  onChange={(e) => handleChange('address.country', e.target.value)}
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>

          {/* Manager Information */}
          <div className="form-section">
            <h3 className="form-section-title">Manager Information</h3>
            
            <div className="form-field">
              <label htmlFor="manager_name">Manager Name</label>
              <input
                id="manager_name"
                type="text"
                value={formData.manager_name}
                onChange={(e) => handleChange('manager_name', e.target.value)}
                placeholder="Enter manager name"
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="manager_email">Manager Email</label>
                <input
                  id="manager_email"
                  type="email"
                  value={formData.manager_email}
                  onChange={(e) => handleChange('manager_email', e.target.value)}
                  className={errors.manager_email ? 'error' : ''}
                  placeholder="Enter manager email"
                />
                {errors.manager_email && <span className="error-message">{errors.manager_email}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="manager_phone">Manager Phone</label>
                <input
                  id="manager_phone"
                  type="tel"
                  value={formData.manager_phone}
                  onChange={(e) => handleChange('manager_phone', e.target.value)}
                  placeholder="Enter manager phone"
                />
              </div>
            </div>
          </div>

          {/* Capacity & Settings */}
          <div className="form-section">
            <h3 className="form-section-title">Capacity & Settings</h3>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="total_capacity">Total Capacity</label>
                <input
                  id="total_capacity"
                  type="number"
                  value={formData.total_capacity}
                  onChange={(e) => handleChange('total_capacity', e.target.value)}
                  className={errors.total_capacity ? 'error' : ''}
                  placeholder="Enter total capacity"
                  min="0"
                />
                {errors.total_capacity && <span className="error-message">{errors.total_capacity}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="capacity_unit">Capacity Unit</label>
                <select
                  id="capacity_unit"
                  value={formData.capacity_unit}
                  onChange={(e) => handleChange('capacity_unit', e.target.value)}
                >
                  {CAPACITY_UNITS.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="timezone">Timezone</label>
              <select
                id="timezone"
                value={formData.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="modal-actions">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Warehouse' : 'Create Warehouse')}
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
          max-width: 800px;
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
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-field input,
        .form-field select,
        .form-field textarea {
          padding: 0.75rem 1rem;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
          background: white;
        }

        .form-field input:focus,
        .form-field select:focus,
        .form-field textarea:focus {
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

        .form-field input[type="checkbox"] {
          width: auto;
          margin: 0;
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

export default WarehouseModal
