import { useState, useEffect } from 'react'
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../types/customer'
import Button from './ui/Button'

interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateCustomerRequest | UpdateCustomerRequest) => Promise<void>
  customer?: Customer
  isEditing?: boolean
}

const PAYMENT_TERMS = [
  { value: '', label: 'Select payment terms' },
  { value: 'NET_30', label: 'Net 30' },
  { value: 'NET_15', label: 'Net 15' },
  { value: 'NET_10', label: 'Net 10' },
  { value: 'COD', label: 'Cash on Delivery' },
  { value: 'PREPAID', label: 'Prepaid' },
  { value: 'CUSTOM', label: 'Custom Terms' },
];

function CustomerModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  customer, 
  isEditing = false 
}: CustomerModalProps) {
  
  const [formData, setFormData] = useState({
    customer_code: '',
    name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    billing_address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    shipping_address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    payment_terms: '',
    credit_limit: '',
    notes: '',
    is_active: true
  })
  
  const [sameAsBilling, setSameAsBilling] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (customer && isEditing) {
      setFormData({
        customer_code: customer.customer_code,
        name: customer.name,
        contact_name: customer.contact_name || '',
        contact_email: customer.email || '',
        contact_phone: customer.contact_phone || '',
        billing_address: {
          street: customer.billing_address?.street || '',
          city: customer.billing_address?.city || '',
          state: customer.billing_address?.state || '',
          zip: customer.billing_address?.zip || '',
          country: customer.billing_address?.country || ''
        },
        shipping_address: {
          street: customer.shipping_address?.street || '',
          city: customer.shipping_address?.city || '',
          state: customer.shipping_address?.state || '',
          zip: customer.shipping_address?.zip || '',
          country: customer.shipping_address?.country || ''
        },
        payment_terms: customer.payment_terms || '',
        credit_limit: customer.credit_limit?.toString() || '',
        notes: customer.notes || '',
        is_active: customer.status === 'active'
      })
    } else {
      setFormData({
        customer_code: '',
        name: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        billing_address: {
          street: '',
          city: '',
          state: '',
          zip: '',
          country: ''
        },
        shipping_address: {
          street: '',
          city: '',
          state: '',
          zip: '',
          country: ''
        },
        payment_terms: '',
        credit_limit: '',
        notes: '',
        is_active: true
      })
    }
    setSameAsBilling(false)
    setErrors({})
  }, [customer, isEditing, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.customer_code.trim()) {
      newErrors.customer_code = 'Customer code is required'
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required'
    }
    
    if (formData.contact_email && !/\S+@\S+\.\S+/.test(formData.contact_email)) {
      newErrors.contact_email = 'Please enter a valid email address'
    }
    
    if (formData.credit_limit && isNaN(Number(formData.credit_limit))) {
      newErrors.credit_limit = 'Credit limit must be a valid number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: string, value: any) => {
    if (field.startsWith('billing_address.')) {
      const addressField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        billing_address: {
          ...prev.billing_address,
          [addressField]: value
        }
      }))
      
      // If same as billing is checked, update shipping address too
      if (sameAsBilling) {
        setFormData(prev => ({
          ...prev,
          shipping_address: {
            ...prev.shipping_address,
            [addressField]: value
          }
        }))
      }
    } else if (field.startsWith('shipping_address.')) {
      const addressField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        shipping_address: {
          ...prev.shipping_address,
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

  const handleSameAsBillingChange = (checked: boolean) => {
    setSameAsBilling(checked)
    if (checked) {
      setFormData(prev => ({
        ...prev,
        shipping_address: { ...prev.billing_address }
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
      const submitData: CreateCustomerRequest | UpdateCustomerRequest = {
        customer_code: formData.customer_code.trim(),
        name: formData.name.trim(),
        contact_name: formData.contact_name.trim() || undefined,
        contact_email: formData.contact_email.trim() || undefined,
        contact_phone: formData.contact_phone.trim() || undefined,
        billing_address: Object.values(formData.billing_address).some(v => v.trim()) ? formData.billing_address : undefined,
        shipping_address: Object.values(formData.shipping_address).some(v => v.trim()) ? formData.shipping_address : undefined,
        payment_terms: formData.payment_terms || undefined,
        credit_limit: formData.credit_limit ? Number(formData.credit_limit) : undefined,
        notes: formData.notes.trim() || undefined,
        is_active: formData.is_active
      }
      
      await onSubmit(submitData)
      onClose()
    } catch (error) {
      console.error('Failed to submit customer:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Customer' : 'Add New Customer'}</h2>
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
                <label htmlFor="customer_code">Customer Code *</label>
                <input
                  id="customer_code"
                  type="text"
                  value={formData.customer_code}
                  onChange={(e) => handleChange('customer_code', e.target.value)}
                  className={errors.customer_code ? 'error' : ''}
                  placeholder="Enter customer code"
                  disabled={isEditing}
                />
                {errors.customer_code && <span className="error-message">{errors.customer_code}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="name">Customer Name *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={errors.name ? 'error' : ''}
                  placeholder="Enter customer name"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
            </div>

            <div className="form-field">
              <label>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                />
                Active Customer
              </label>
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h3 className="form-section-title">Contact Information</h3>
            
            <div className="form-field">
              <label htmlFor="contact_name">Contact Name</label>
              <input
                id="contact_name"
                type="text"
                value={formData.contact_name}
                onChange={(e) => handleChange('contact_name', e.target.value)}
                placeholder="Enter primary contact name"
              />
            </div>

            <div className="form-row">
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

              <div className="form-field">
                <label htmlFor="contact_phone">Contact Phone</label>
                <input
                  id="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  placeholder="Enter contact phone"
                />
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="form-section">
            <h3 className="form-section-title">Billing Address</h3>
            
            <div className="form-field">
              <label htmlFor="billing_street">Street Address</label>
              <input
                id="billing_street"
                type="text"
                value={formData.billing_address.street}
                onChange={(e) => handleChange('billing_address.street', e.target.value)}
                placeholder="Enter street address"
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="billing_city">City</label>
                <input
                  id="billing_city"
                  type="text"
                  value={formData.billing_address.city}
                  onChange={(e) => handleChange('billing_address.city', e.target.value)}
                  placeholder="Enter city"
                />
              </div>

              <div className="form-field">
                <label htmlFor="billing_state">State/Province</label>
                <input
                  id="billing_state"
                  type="text"
                  value={formData.billing_address.state}
                  onChange={(e) => handleChange('billing_address.state', e.target.value)}
                  placeholder="Enter state/province"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="billing_zip">ZIP/Postal Code</label>
                <input
                  id="billing_zip"
                  type="text"
                  value={formData.billing_address.zip}
                  onChange={(e) => handleChange('billing_address.zip', e.target.value)}
                  placeholder="Enter ZIP/postal code"
                />
              </div>

              <div className="form-field">
                <label htmlFor="billing_country">Country</label>
                <input
                  id="billing_country"
                  type="text"
                  value={formData.billing_address.country}
                  onChange={(e) => handleChange('billing_address.country', e.target.value)}
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="form-section">
            <h3 className="form-section-title">Shipping Address</h3>
            
            <div className="form-field">
              <label>
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={(e) => handleSameAsBillingChange(e.target.checked)}
                />
                Same as billing address
              </label>
            </div>

            <div className="form-field">
              <label htmlFor="shipping_street">Street Address</label>
              <input
                id="shipping_street"
                type="text"
                value={formData.shipping_address.street}
                onChange={(e) => handleChange('shipping_address.street', e.target.value)}
                placeholder="Enter street address"
                disabled={sameAsBilling}
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="shipping_city">City</label>
                <input
                  id="shipping_city"
                  type="text"
                  value={formData.shipping_address.city}
                  onChange={(e) => handleChange('shipping_address.city', e.target.value)}
                  placeholder="Enter city"
                  disabled={sameAsBilling}
                />
              </div>

              <div className="form-field">
                <label htmlFor="shipping_state">State/Province</label>
                <input
                  id="shipping_state"
                  type="text"
                  value={formData.shipping_address.state}
                  onChange={(e) => handleChange('shipping_address.state', e.target.value)}
                  placeholder="Enter state/province"
                  disabled={sameAsBilling}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="shipping_zip">ZIP/Postal Code</label>
                <input
                  id="shipping_zip"
                  type="text"
                  value={formData.shipping_address.zip}
                  onChange={(e) => handleChange('shipping_address.zip', e.target.value)}
                  placeholder="Enter ZIP/postal code"
                  disabled={sameAsBilling}
                />
              </div>

              <div className="form-field">
                <label htmlFor="shipping_country">Country</label>
                <input
                  id="shipping_country"
                  type="text"
                  value={formData.shipping_address.country}
                  onChange={(e) => handleChange('shipping_address.country', e.target.value)}
                  placeholder="Enter country"
                  disabled={sameAsBilling}
                />
              </div>
            </div>
          </div>

          {/* Business Terms */}
          <div className="form-section">
            <h3 className="form-section-title">Business Terms</h3>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="payment_terms">Payment Terms</label>
                <select
                  id="payment_terms"
                  value={formData.payment_terms}
                  onChange={(e) => handleChange('payment_terms', e.target.value)}
                >
                  {PAYMENT_TERMS.map((term) => (
                    <option key={term.value} value={term.value}>
                      {term.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="credit_limit">Credit Limit</label>
                <input
                  id="credit_limit"
                  type="number"
                  value={formData.credit_limit}
                  onChange={(e) => handleChange('credit_limit', e.target.value)}
                  className={errors.credit_limit ? 'error' : ''}
                  placeholder="Enter credit limit"
                  min="0"
                  step="0.01"
                />
                {errors.credit_limit && <span className="error-message">{errors.credit_limit}</span>}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="form-section">
            <h3 className="form-section-title">Additional Information</h3>
            
            <div className="form-field">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Enter any additional notes or comments"
                rows={4}
              />
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
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Customer' : 'Create Customer')}
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
          max-width: 900px;
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

export default CustomerModal
