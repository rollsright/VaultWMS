import { useState, useEffect } from 'react'
import { Carrier, CreateCarrierRequest, UpdateCarrierRequest, COMMON_SERVICE_TYPES } from '../types/carrier'
import Button from './ui/Button'

interface CarrierModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateCarrierRequest | UpdateCarrierRequest) => Promise<void>
  carrier?: Carrier
  isEditing?: boolean
}

function CarrierModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  carrier, 
  isEditing = false 
}: CarrierModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    service_types: [] as string[],
    tracking_url: '',
    status: 'active' as 'active' | 'inactive',
    is_active: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (carrier && isEditing) {
      setFormData({
        name: carrier.name,
        code: carrier.code,
        contact_name: carrier.contact_name || '',
        contact_email: carrier.contact_email || '',
        contact_phone: carrier.contact_phone || '',
        service_types: [...carrier.service_types],
        tracking_url: carrier.tracking_url || '',
        status: carrier.status,
        is_active: carrier.is_active
      })
    } else {
      setFormData({
        name: '',
        code: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        service_types: [],
        tracking_url: '',
        status: 'active',
        is_active: true
      })
    }
    setErrors({})
  }, [carrier, isEditing, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Carrier name is required'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Carrier code is required'
    }

    if (formData.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Please enter a valid email address'
    }

    if (formData.tracking_url && !formData.tracking_url.startsWith('http')) {
      newErrors.tracking_url = 'Tracking URL must start with http:// or https://'
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
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        contact_name: formData.contact_name.trim() || undefined,
        contact_email: formData.contact_email.trim() || undefined,
        contact_phone: formData.contact_phone.trim() || undefined,
        service_types: formData.service_types,
        tracking_url: formData.tracking_url.trim() || undefined,
        status: formData.status,
        is_active: formData.is_active,
      }
      
      await onSubmit(submitData)
      onClose()
    } catch (error) {
      console.error('Failed to submit carrier:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleServiceTypeToggle = (serviceType: string) => {
    const currentServices = [...formData.service_types]
    const index = currentServices.indexOf(serviceType)
    
    if (index > -1) {
      currentServices.splice(index, 1)
    } else {
      currentServices.push(serviceType)
    }
    
    handleChange('service_types', currentServices)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Carrier' : 'Add New Carrier'}</h2>
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
                <label htmlFor="name">Carrier Name *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={errors.name ? 'error' : ''}
                  placeholder="Enter carrier name"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="code">Carrier Code *</label>
                <input
                  id="code"
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                  className={errors.code ? 'error' : ''}
                  placeholder="Enter carrier code"
                  style={{ textTransform: 'uppercase' }}
                />
                {errors.code && <span className="error-message">{errors.code}</span>}
              </div>
            </div>

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
                    Active Carrier
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h3 className="form-section-title">Contact Information</h3>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="contact_name">Contact Name</label>
                <input
                  id="contact_name"
                  type="text"
                  value={formData.contact_name}
                  onChange={(e) => handleChange('contact_name', e.target.value)}
                  placeholder="Enter contact person name"
                />
              </div>

              <div className="form-field">
                <label htmlFor="contact_email">Contact Email</label>
                <input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className={errors.contact_email ? 'error' : ''}
                  placeholder="Enter contact email"
                />
                {errors.contact_email && <span className="error-message">{errors.contact_email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="contact_phone">Contact Phone</label>
                <input
                  id="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  placeholder="Enter contact phone number"
                />
              </div>

              <div className="form-field">
                <label htmlFor="tracking_url">Tracking URL</label>
                <input
                  id="tracking_url"
                  type="url"
                  value={formData.tracking_url}
                  onChange={(e) => handleChange('tracking_url', e.target.value)}
                  className={errors.tracking_url ? 'error' : ''}
                  placeholder="https://example.com/tracking"
                />
                {errors.tracking_url && <span className="error-message">{errors.tracking_url}</span>}
              </div>
            </div>
          </div>

          {/* Service Types */}
          <div className="form-section">
            <h3 className="form-section-title">Service Types</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Select the shipping services offered by this carrier
            </p>
            
            <div className="service-types-grid">
              {COMMON_SERVICE_TYPES.map((serviceType) => (
                <label key={serviceType} className="service-type-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.service_types.includes(serviceType)}
                    onChange={() => handleServiceTypeToggle(serviceType)}
                  />
                  <span className="checkbox-label">{serviceType}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Carrier' : 'Add Carrier')}
            </Button>
          </div>
        </form>
      </div>

      <style jsx>{`
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

        .error-message {
          color: #dc2626;
          font-size: 0.75rem;
          margin-top: -0.25rem;
        }

        .service-types-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.75rem;
        }

        .service-type-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .service-type-checkbox:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .service-type-checkbox input[type="checkbox"] {
          margin: 0;
          width: auto;
        }

        .checkbox-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
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
          
          .service-types-grid {
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

export default CarrierModal
