import { useState, useEffect } from 'react'
import { SetupItem, CreateSetupItemRequest, UpdateSetupItemRequest } from '../types/setupItem'
import { useCategories } from '../hooks/useCategories'
import { useUOMs } from '../hooks/useUOMs'
import Button from './ui/Button'

interface SetupItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateSetupItemRequest | UpdateSetupItemRequest) => Promise<void>
  item?: SetupItem
  customerId: string
  isEditing?: boolean
}

function SetupItemModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  item, 
  customerId, 
  isEditing = false 
}: SetupItemModalProps) {
  const { categories } = useCategories()
  const { uoms } = useUOMs()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    barcode: '',
    category_id: '',
    uom_id: '',
    status: 'active' as 'active' | 'inactive',
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    is_active: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (item && isEditing) {
      setFormData({
        name: item.name,
        description: item.description || '',
        sku: item.sku || '',
        barcode: item.barcode || '',
        category_id: item.category_id || '',
        uom_id: item.uom_id || '',
        status: item.status,
        weight: item.weight || 0,
        length: item.dimensions?.length || 0,
        width: item.dimensions?.width || 0,
        height: item.dimensions?.height || 0,
        is_active: item.is_active
      })
    } else {
      setFormData({
        name: '',
        description: '',
        sku: '',
        barcode: '',
        category_id: '',
        uom_id: '',
        status: 'active',
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        is_active: true
      })
    }
    setErrors({})
  }, [item, isEditing, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required'
    }

    if (formData.weight < 0) {
      newErrors.weight = 'Weight must be 0 or greater'
    }

    if (formData.length < 0) {
      newErrors.length = 'Length must be 0 or greater'
    }

    if (formData.width < 0) {
      newErrors.width = 'Width must be 0 or greater'
    }

    if (formData.height < 0) {
      newErrors.height = 'Height must be 0 or greater'
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
        description: formData.description.trim() || undefined,
        sku: formData.sku.trim() || undefined,
        barcode: formData.barcode.trim() || undefined,
        category_id: formData.category_id || undefined,
        uom_id: formData.uom_id || undefined,
        status: formData.status,
        weight: formData.weight > 0 ? formData.weight : undefined,
        dimensions: (formData.length > 0 || formData.width > 0 || formData.height > 0) ? {
          length: formData.length > 0 ? formData.length : undefined,
          width: formData.width > 0 ? formData.width : undefined,
          height: formData.height > 0 ? formData.height : undefined,
        } : undefined,
        is_active: formData.is_active,
        ...(isEditing ? {} : { customer_id: customerId })
      }
      
      await onSubmit(submitData)
      onClose()
    } catch (error) {
      console.error('Failed to submit item:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Item' : 'Add New Item'}</h2>
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
                <label htmlFor="name">Item Name *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={errors.name ? 'error' : ''}
                  placeholder="Enter item name"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

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
            </div>

            <div className="form-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter item description (optional)"
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="sku">SKU</label>
                <input
                  id="sku"
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleChange('sku', e.target.value.toUpperCase())}
                  placeholder="Enter SKU (optional)"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              <div className="form-field">
                <label htmlFor="barcode">Barcode</label>
                <input
                  id="barcode"
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => handleChange('barcode', e.target.value)}
                  placeholder="Enter barcode (optional)"
                />
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="form-section">
            <h3 className="form-section-title">Classification</h3>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="category_id">Category</label>
                <select
                  id="category_id"
                  value={formData.category_id}
                  onChange={(e) => handleChange('category_id', e.target.value)}
                >
                  <option value="">Select category (optional)</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="uom_id">Unit of Measure</label>
                <select
                  id="uom_id"
                  value={formData.uom_id}
                  onChange={(e) => handleChange('uom_id', e.target.value)}
                >
                  <option value="">Select UOM (optional)</option>
                  {uoms.map((uom) => (
                    <option key={uom.id} value={uom.id}>
                      {uom.name} ({uom.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Physical Properties */}
          <div className="form-section">
            <h3 className="form-section-title">Physical Properties</h3>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  id="weight"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
                  className={errors.weight ? 'error' : ''}
                  placeholder="0.00"
                />
                {errors.weight && <span className="error-message">{errors.weight}</span>}
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
                    Active Item
                  </label>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="length">Length (cm)</label>
                <input
                  id="length"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.length}
                  onChange={(e) => handleChange('length', parseFloat(e.target.value) || 0)}
                  className={errors.length ? 'error' : ''}
                  placeholder="0.0"
                />
                {errors.length && <span className="error-message">{errors.length}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="width">Width (cm)</label>
                <input
                  id="width"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.width}
                  onChange={(e) => handleChange('width', parseFloat(e.target.value) || 0)}
                  className={errors.width ? 'error' : ''}
                  placeholder="0.0"
                />
                {errors.width && <span className="error-message">{errors.width}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="height">Height (cm)</label>
                <input
                  id="height"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.height}
                  onChange={(e) => handleChange('height', parseFloat(e.target.value) || 0)}
                  className={errors.height ? 'error' : ''}
                  placeholder="0.0"
                />
                {errors.height && <span className="error-message">{errors.height}</span>}
              </div>
              <div className="form-field"></div>
            </div>
          </div>

          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Item' : 'Add Item')}
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

        .form-field textarea {
          resize: vertical;
          min-height: 80px;
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

export default SetupItemModal
