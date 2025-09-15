import { useState, useEffect } from 'react'
import { UOM, CreateUOMRequest, UpdateUOMRequest, UOMType } from '../types/uom'
import Button from './ui/Button'

interface UOMModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateUOMRequest | UpdateUOMRequest) => Promise<void>
  uom?: UOM
  isEditing?: boolean
}

function UOMModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  uom, 
  isEditing = false 
}: UOMModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'COUNT' as UOMType,
    conversion_factor: 1.0000,
    base_unit: false,
    is_active: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (uom && isEditing) {
      setFormData({
        name: uom.name,
        code: uom.code,
        type: uom.type,
        conversion_factor: uom.conversion_factor,
        base_unit: uom.base_unit || false,
        is_active: uom.is_active
      })
    } else {
      setFormData({
        name: '',
        code: '',
        type: 'COUNT',
        conversion_factor: 1.0000,
        base_unit: false,
        is_active: true
      })
    }
    setErrors({})
  }, [uom, isEditing, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'UOM name is required'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'UOM code is required'
    }

    if (formData.conversion_factor <= 0) {
      newErrors.conversion_factor = 'Conversion factor must be greater than 0'
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
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Failed to submit UOM:', error)
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
          <h2>{isEditing ? 'Edit UOM' : 'Add New UOM'}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="name">UOM Name *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? 'error' : ''}
                placeholder="Enter UOM name (e.g., Kilogram)"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="code">UOM Code *</label>
              <input
                id="code"
                type="text"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                className={errors.code ? 'error' : ''}
                placeholder="Enter UOM code (e.g., KG)"
                style={{ textTransform: 'uppercase' }}
              />
              {errors.code && <span className="error-message">{errors.code}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="type">UOM Type *</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <option value="COUNT">Count</option>
                <option value="WEIGHT">Weight</option>
                <option value="VOLUME">Volume</option>
                <option value="LENGTH">Length</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="conversion_factor">Conversion Factor *</label>
              <input
                id="conversion_factor"
                type="number"
                step="0.0001"
                min="0.0001"
                value={formData.conversion_factor}
                onChange={(e) => handleChange('conversion_factor', parseFloat(e.target.value) || 0)}
                className={errors.conversion_factor ? 'error' : ''}
                placeholder="1.0000"
              />
              {errors.conversion_factor && <span className="error-message">{errors.conversion_factor}</span>}
              <small style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                Factor for converting to base unit
              </small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  id="base_unit"
                  type="checkbox"
                  checked={formData.base_unit}
                  onChange={(e) => handleChange('base_unit', e.target.checked)}
                  style={{ width: 'auto' }}
                />
                <label htmlFor="base_unit" style={{ margin: 0, cursor: 'pointer' }}>
                  Base Unit
                </label>
              </div>
              <small style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                Mark as the primary unit for this type
              </small>
            </div>

            <div className="form-field">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  id="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  style={{ width: 'auto' }}
                />
                <label htmlFor="is_active" style={{ margin: 0, cursor: 'pointer' }}>
                  Active
                </label>
              </div>
              <small style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                Enable this UOM for use in the system
              </small>
            </div>
          </div>

          {/* Examples based on type */}
          <div className="form-field">
            <div style={{ 
              background: '#f8fafc', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px', 
              padding: '1rem',
              fontSize: '0.875rem',
              color: '#64748b'
            }}>
              <strong>Examples for {formData.type}:</strong>
              <div style={{ marginTop: '0.5rem' }}>
                {formData.type === 'COUNT' && (
                  <div>Each (EA), Piece (PC), Carton (CTN), Dozen (DOZ), Pack (PACK)</div>
                )}
                {formData.type === 'WEIGHT' && (
                  <div>Kilogram (KG), Gram (G), Pound (LB), Ounce (OZ), Ton (TON)</div>
                )}
                {formData.type === 'VOLUME' && (
                  <div>Liter (L), Milliliter (ML), Gallon (GAL), Cubic Meter (M³)</div>
                )}
                {formData.type === 'LENGTH' && (
                  <div>Meter (M), Centimeter (CM), Inch (IN), Foot (FT), Yard (YD)</div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update UOM' : 'Add UOM')}
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
          max-width: 600px;
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

export default UOMModal
