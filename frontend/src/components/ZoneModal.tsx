import { useState, useEffect } from 'react'
import { Zone, CreateZoneRequest, UpdateZoneRequest, ZoneType } from '../types/zone'
import { useWarehouses } from '../hooks/useWarehouses'
import Button from './ui/Button'

interface ZoneModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateZoneRequest | UpdateZoneRequest) => Promise<void>
  zone?: Zone
  selectedWarehouseId?: string
  isEditing?: boolean
}

const ZONE_TYPES: { value: ZoneType; label: string }[] = [
  { value: 'receiving', label: 'Receiving' },
  { value: 'staging', label: 'Staging' },
  { value: 'storage', label: 'Storage' },
  { value: 'picking', label: 'Picking' },
  { value: 'packing', label: 'Packing' },
  { value: 'shipping', label: 'Shipping' },
  { value: 'quarantine', label: 'Quarantine' },
  { value: 'returns', label: 'Returns' },
  { value: 'cross_dock', label: 'Cross Dock' },
];

const CAPACITY_UNITS = [
  { value: 'pallets', label: 'Pallets' },
  { value: 'cases', label: 'Cases' },
  { value: 'cubic_feet', label: 'Cubic Feet' },
  { value: 'cubic_meters', label: 'Cubic Meters' },
  { value: 'square_feet', label: 'Square Feet' },
  { value: 'square_meters', label: 'Square Meters' },
];

function ZoneModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  zone, 
  selectedWarehouseId,
  isEditing = false 
}: ZoneModalProps) {
  
  const { warehouses } = useWarehouses();
  
  const [formData, setFormData] = useState({
    warehouse_id: selectedWarehouseId || '',
    name: '',
    zone_code: '',
    zone_type: 'storage' as ZoneType,
    description: '',
    capacity: '',
    capacity_unit: 'pallets',
    temperature_controlled: false,
    temperature_min: '',
    temperature_max: '',
    humidity_controlled: false,
    humidity_min: '',
    humidity_max: '',
    is_active: true
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (zone && isEditing) {
      setFormData({
        warehouse_id: zone.warehouse_id,
        name: zone.name,
        zone_code: zone.code,
        zone_type: zone.type,
        description: zone.description || '',
        capacity: zone.capacity?.toString() || '',
        capacity_unit: zone.capacity_unit || 'pallets',
        temperature_controlled: zone.temperature_controlled,
        temperature_min: zone.temperature_min?.toString() || '',
        temperature_max: zone.temperature_max?.toString() || '',
        humidity_controlled: zone.humidity_controlled,
        humidity_min: zone.humidity_min?.toString() || '',
        humidity_max: zone.humidity_max?.toString() || '',
        is_active: zone.status === 'active'
      })
    } else {
      setFormData({
        warehouse_id: selectedWarehouseId || '',
        name: '',
        zone_code: '',
        zone_type: 'storage',
        description: '',
        capacity: '',
        capacity_unit: 'pallets',
        temperature_controlled: false,
        temperature_min: '',
        temperature_max: '',
        humidity_controlled: false,
        humidity_min: '',
        humidity_max: '',
        is_active: true
      })
    }
    setErrors({})
  }, [zone, isEditing, isOpen, selectedWarehouseId])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.warehouse_id) {
      newErrors.warehouse_id = 'Warehouse selection is required'
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Zone name is required'
    }
    
    if (!formData.zone_code.trim()) {
      newErrors.zone_code = 'Zone code is required'
    }
    
    if (formData.capacity && isNaN(Number(formData.capacity))) {
      newErrors.capacity = 'Capacity must be a valid number'
    }
    
    if (formData.temperature_controlled) {
      if (formData.temperature_min && isNaN(Number(formData.temperature_min))) {
        newErrors.temperature_min = 'Minimum temperature must be a valid number'
      }
      if (formData.temperature_max && isNaN(Number(formData.temperature_max))) {
        newErrors.temperature_max = 'Maximum temperature must be a valid number'
      }
      if (formData.temperature_min && formData.temperature_max && 
          Number(formData.temperature_min) >= Number(formData.temperature_max)) {
        newErrors.temperature_max = 'Maximum temperature must be greater than minimum'
      }
    }
    
    if (formData.humidity_controlled) {
      if (formData.humidity_min && (isNaN(Number(formData.humidity_min)) || Number(formData.humidity_min) < 0 || Number(formData.humidity_min) > 100)) {
        newErrors.humidity_min = 'Minimum humidity must be between 0 and 100'
      }
      if (formData.humidity_max && (isNaN(Number(formData.humidity_max)) || Number(formData.humidity_max) < 0 || Number(formData.humidity_max) > 100)) {
        newErrors.humidity_max = 'Maximum humidity must be between 0 and 100'
      }
      if (formData.humidity_min && formData.humidity_max && 
          Number(formData.humidity_min) >= Number(formData.humidity_max)) {
        newErrors.humidity_max = 'Maximum humidity must be greater than minimum'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
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
      const submitData: CreateZoneRequest | UpdateZoneRequest = {
        warehouse_id: formData.warehouse_id,
        name: formData.name.trim(),
        zone_code: formData.zone_code.trim(),
        zone_type: formData.zone_type,
        description: formData.description.trim() || undefined,
        capacity: formData.capacity ? Number(formData.capacity) : undefined,
        capacity_unit: formData.capacity_unit,
        temperature_controlled: formData.temperature_controlled,
        temperature_min: formData.temperature_min ? Number(formData.temperature_min) : undefined,
        temperature_max: formData.temperature_max ? Number(formData.temperature_max) : undefined,
        humidity_controlled: formData.humidity_controlled,
        humidity_min: formData.humidity_min ? Number(formData.humidity_min) : undefined,
        humidity_max: formData.humidity_max ? Number(formData.humidity_max) : undefined,
        is_active: formData.is_active
      }
      
      await onSubmit(submitData)
      onClose()
    } catch (error) {
      console.error('Failed to submit zone:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Zone' : 'Add New Zone'}</h2>
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
            
            <div className="form-field">
              <label htmlFor="warehouse_id">Warehouse *</label>
              <select
                id="warehouse_id"
                value={formData.warehouse_id}
                onChange={(e) => handleChange('warehouse_id', e.target.value)}
                className={errors.warehouse_id ? 'error' : ''}
                disabled={isEditing}
              >
                <option value="">Select warehouse</option>
                {warehouses.filter(w => w.status === 'active').map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
              {errors.warehouse_id && <span className="error-message">{errors.warehouse_id}</span>}
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="name">Zone Name *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={errors.name ? 'error' : ''}
                  placeholder="Enter zone name"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="zone_code">Zone Code *</label>
                <input
                  id="zone_code"
                  type="text"
                  value={formData.zone_code}
                  onChange={(e) => handleChange('zone_code', e.target.value)}
                  className={errors.zone_code ? 'error' : ''}
                  placeholder="Enter zone code"
                  disabled={isEditing}
                />
                {errors.zone_code && <span className="error-message">{errors.zone_code}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="zone_type">Zone Type *</label>
                <select
                  id="zone_type"
                  value={formData.zone_type}
                  onChange={(e) => handleChange('zone_type', e.target.value as ZoneType)}
                  className={errors.zone_type ? 'error' : ''}
                >
                  {ZONE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.zone_type && <span className="error-message">{errors.zone_type}</span>}
              </div>

              <div className="form-field">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => handleChange('is_active', e.target.checked)}
                  />
                  Active Zone
                </label>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter zone description"
                rows={3}
              />
            </div>
          </div>

          {/* Capacity Information */}
          <div className="form-section">
            <h3 className="form-section-title">Capacity</h3>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="capacity">Capacity</label>
                <input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleChange('capacity', e.target.value)}
                  className={errors.capacity ? 'error' : ''}
                  placeholder="Enter capacity"
                  min="0"
                />
                {errors.capacity && <span className="error-message">{errors.capacity}</span>}
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
          </div>

          {/* Environmental Controls */}
          <div className="form-section">
            <h3 className="form-section-title">Environmental Controls</h3>
            
            <div className="form-field">
              <label>
                <input
                  type="checkbox"
                  checked={formData.temperature_controlled}
                  onChange={(e) => handleChange('temperature_controlled', e.target.checked)}
                />
                Temperature Controlled
              </label>
            </div>

            {formData.temperature_controlled && (
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="temperature_min">Min Temperature (°F)</label>
                  <input
                    id="temperature_min"
                    type="number"
                    value={formData.temperature_min}
                    onChange={(e) => handleChange('temperature_min', e.target.value)}
                    className={errors.temperature_min ? 'error' : ''}
                    placeholder="Enter minimum temperature"
                    step="0.01"
                  />
                  {errors.temperature_min && <span className="error-message">{errors.temperature_min}</span>}
                </div>

                <div className="form-field">
                  <label htmlFor="temperature_max">Max Temperature (°F)</label>
                  <input
                    id="temperature_max"
                    type="number"
                    value={formData.temperature_max}
                    onChange={(e) => handleChange('temperature_max', e.target.value)}
                    className={errors.temperature_max ? 'error' : ''}
                    placeholder="Enter maximum temperature"
                    step="0.01"
                  />
                  {errors.temperature_max && <span className="error-message">{errors.temperature_max}</span>}
                </div>
              </div>
            )}

            <div className="form-field">
              <label>
                <input
                  type="checkbox"
                  checked={formData.humidity_controlled}
                  onChange={(e) => handleChange('humidity_controlled', e.target.checked)}
                />
                Humidity Controlled
              </label>
            </div>

            {formData.humidity_controlled && (
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="humidity_min">Min Humidity (%)</label>
                  <input
                    id="humidity_min"
                    type="number"
                    value={formData.humidity_min}
                    onChange={(e) => handleChange('humidity_min', e.target.value)}
                    className={errors.humidity_min ? 'error' : ''}
                    placeholder="Enter minimum humidity"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  {errors.humidity_min && <span className="error-message">{errors.humidity_min}</span>}
                </div>

                <div className="form-field">
                  <label htmlFor="humidity_max">Max Humidity (%)</label>
                  <input
                    id="humidity_max"
                    type="number"
                    value={formData.humidity_max}
                    onChange={(e) => handleChange('humidity_max', e.target.value)}
                    className={errors.humidity_max ? 'error' : ''}
                    placeholder="Enter maximum humidity"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  {errors.humidity_max && <span className="error-message">{errors.humidity_max}</span>}
                </div>
              </div>
            )}
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
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Zone' : 'Create Zone')}
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

export default ZoneModal
