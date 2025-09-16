import { useState, useEffect } from 'react'
import { Location, CreateLocationRequest, UpdateLocationRequest, LocationType } from '../types/location'
import { useWarehouses } from '../hooks/useWarehouses'
import { useZones } from '../hooks/useZones'
import Button from './ui/Button'

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateLocationRequest | UpdateLocationRequest) => Promise<void>
  location?: Location
  selectedWarehouseId?: string
  selectedZoneId?: string
  isEditing?: boolean
}

const LOCATION_TYPES: { value: LocationType; label: string }[] = [
  { value: 'floor', label: 'Floor' },
  { value: 'rack', label: 'Rack' },
  { value: 'shelf', label: 'Shelf' },
  { value: 'bin', label: 'Bin' },
  { value: 'dock', label: 'Dock' },
  { value: 'staging_area', label: 'Staging Area' },
  { value: 'bulk_area', label: 'Bulk Area' },
];

const CAPACITY_UNITS = [
  { value: 'units', label: 'Units' },
  { value: 'pallets', label: 'Pallets' },
  { value: 'cases', label: 'Cases' },
  { value: 'cubic_feet', label: 'Cubic Feet' },
  { value: 'cubic_meters', label: 'Cubic Meters' },
];

const WEIGHT_UNITS = [
  { value: 'lbs', label: 'Pounds (lbs)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'tons', label: 'Tons' },
];

function LocationModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  location, 
  selectedWarehouseId,
  selectedZoneId,
  isEditing = false 
}: LocationModalProps) {
  
  const { warehouses } = useWarehouses();
  const { zones } = useZones(selectedWarehouseId);
  
  const [formData, setFormData] = useState({
    warehouse_id: selectedWarehouseId || '',
    zone_id: selectedZoneId || '',
    location_code: '',
    name: '',
    location_type: 'floor' as LocationType,
    aisle: '',
    bay: '',
    level: '',
    position: '',
    coordinates: {
      x: '',
      y: '',
      z: ''
    },
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    capacity: '',
    capacity_unit: 'units',
    weight_limit: '',
    weight_unit: 'lbs',
    barcode: '',
    qr_code: '',
    picking_sequence: '',
    is_pickable: true,
    is_bulk_location: false,
    is_active: true
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (location && isEditing) {
      setFormData({
        warehouse_id: location.warehouse_id,
        zone_id: location.zone_id || '',
        location_code: location.code,
        name: location.name || '',
        location_type: location.type,
        aisle: location.aisle || '',
        bay: location.bay || '',
        level: location.level || '',
        position: location.position || '',
        coordinates: {
          x: location.coordinates?.x?.toString() || '',
          y: location.coordinates?.y?.toString() || '',
          z: location.coordinates?.z?.toString() || ''
        },
        dimensions: {
          length: location.dimensions?.length?.toString() || '',
          width: location.dimensions?.width?.toString() || '',
          height: location.dimensions?.height?.toString() || ''
        },
        capacity: location.capacity?.toString() || '',
        capacity_unit: location.capacity_unit || 'units',
        weight_limit: location.weight_limit?.toString() || '',
        weight_unit: location.weight_unit || 'lbs',
        barcode: location.barcode || '',
        qr_code: location.qr_code || '',
        picking_sequence: location.picking_sequence?.toString() || '',
        is_pickable: location.is_pickable,
        is_bulk_location: location.is_bulk_location,
        is_active: location.status === 'active'
      })
    } else {
      setFormData({
        warehouse_id: selectedWarehouseId || '',
        zone_id: selectedZoneId || '',
        location_code: '',
        name: '',
        location_type: 'floor',
        aisle: '',
        bay: '',
        level: '',
        position: '',
        coordinates: {
          x: '',
          y: '',
          z: ''
        },
        dimensions: {
          length: '',
          width: '',
          height: ''
        },
        capacity: '',
        capacity_unit: 'units',
        weight_limit: '',
        weight_unit: 'lbs',
        barcode: '',
        qr_code: '',
        picking_sequence: '',
        is_pickable: true,
        is_bulk_location: false,
        is_active: true
      })
    }
    setErrors({})
  }, [location, isEditing, isOpen, selectedWarehouseId, selectedZoneId])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.warehouse_id) {
      newErrors.warehouse_id = 'Warehouse selection is required'
    }
    
    if (!formData.location_code.trim()) {
      newErrors.location_code = 'Location code is required'
    }
    
    if (formData.capacity && isNaN(Number(formData.capacity))) {
      newErrors.capacity = 'Capacity must be a valid number'
    }
    
    if (formData.weight_limit && isNaN(Number(formData.weight_limit))) {
      newErrors.weight_limit = 'Weight limit must be a valid number'
    }
    
    if (formData.picking_sequence && isNaN(Number(formData.picking_sequence))) {
      newErrors.picking_sequence = 'Picking sequence must be a valid number'
    }
    
    if (formData.coordinates.x && isNaN(Number(formData.coordinates.x))) {
      newErrors['coordinates.x'] = 'X coordinate must be a valid number'
    }
    
    if (formData.coordinates.y && isNaN(Number(formData.coordinates.y))) {
      newErrors['coordinates.y'] = 'Y coordinate must be a valid number'
    }
    
    if (formData.coordinates.z && isNaN(Number(formData.coordinates.z))) {
      newErrors['coordinates.z'] = 'Z coordinate must be a valid number'
    }
    
    if (formData.dimensions.length && isNaN(Number(formData.dimensions.length))) {
      newErrors['dimensions.length'] = 'Length must be a valid number'
    }
    
    if (formData.dimensions.width && isNaN(Number(formData.dimensions.width))) {
      newErrors['dimensions.width'] = 'Width must be a valid number'
    }
    
    if (formData.dimensions.height && isNaN(Number(formData.dimensions.height))) {
      newErrors['dimensions.height'] = 'Height must be a valid number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: string, value: any) => {
    if (field.startsWith('coordinates.')) {
      const coordinateField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [coordinateField]: value
        }
      }))
    } else if (field.startsWith('dimensions.')) {
      const dimensionField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimensionField]: value
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
      const submitData: CreateLocationRequest | UpdateLocationRequest = {
        warehouse_id: formData.warehouse_id,
        zone_id: formData.zone_id || undefined,
        location_code: formData.location_code.trim(),
        name: formData.name.trim() || undefined,
        location_type: formData.location_type,
        aisle: formData.aisle.trim() || undefined,
        bay: formData.bay.trim() || undefined,
        level: formData.level.trim() || undefined,
        position: formData.position.trim() || undefined,
        coordinates: (formData.coordinates.x || formData.coordinates.y || formData.coordinates.z) ? {
          x: formData.coordinates.x ? Number(formData.coordinates.x) : undefined,
          y: formData.coordinates.y ? Number(formData.coordinates.y) : undefined,
          z: formData.coordinates.z ? Number(formData.coordinates.z) : undefined,
        } : undefined,
        dimensions: (formData.dimensions.length || formData.dimensions.width || formData.dimensions.height) ? {
          length: formData.dimensions.length ? Number(formData.dimensions.length) : undefined,
          width: formData.dimensions.width ? Number(formData.dimensions.width) : undefined,
          height: formData.dimensions.height ? Number(formData.dimensions.height) : undefined,
        } : undefined,
        capacity: formData.capacity ? Number(formData.capacity) : undefined,
        capacity_unit: formData.capacity_unit,
        weight_limit: formData.weight_limit ? Number(formData.weight_limit) : undefined,
        weight_unit: formData.weight_unit,
        barcode: formData.barcode.trim() || undefined,
        qr_code: formData.qr_code.trim() || undefined,
        picking_sequence: formData.picking_sequence ? Number(formData.picking_sequence) : undefined,
        is_pickable: formData.is_pickable,
        is_bulk_location: formData.is_bulk_location,
        is_active: formData.is_active
      }
      
      await onSubmit(submitData)
      onClose()
    } catch (error) {
      console.error('Failed to submit location:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Location' : 'Add New Location'}</h2>
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

              <div className="form-field">
                <label htmlFor="zone_id">Zone</label>
                <select
                  id="zone_id"
                  value={formData.zone_id}
                  onChange={(e) => handleChange('zone_id', e.target.value)}
                  disabled={!formData.warehouse_id}
                >
                  <option value="">Select zone (optional)</option>
                  {zones.filter(z => z.status === 'active').map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} ({zone.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="location_code">Location Code *</label>
                <input
                  id="location_code"
                  type="text"
                  value={formData.location_code}
                  onChange={(e) => handleChange('location_code', e.target.value)}
                  className={errors.location_code ? 'error' : ''}
                  placeholder="Enter location code"
                  disabled={isEditing}
                />
                {errors.location_code && <span className="error-message">{errors.location_code}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="name">Location Name</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter location name (optional)"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="location_type">Location Type *</label>
                <select
                  id="location_type"
                  value={formData.location_type}
                  onChange={(e) => handleChange('location_type', e.target.value as LocationType)}
                  className={errors.location_type ? 'error' : ''}
                >
                  {LOCATION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.location_type && <span className="error-message">{errors.location_type}</span>}
              </div>

              <div className="form-field">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => handleChange('is_active', e.target.checked)}
                  />
                  Active Location
                </label>
              </div>
            </div>
          </div>

          {/* Position Information */}
          <div className="form-section">
            <h3 className="form-section-title">Position</h3>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="aisle">Aisle</label>
                <input
                  id="aisle"
                  type="text"
                  value={formData.aisle}
                  onChange={(e) => handleChange('aisle', e.target.value)}
                  placeholder="e.g., A, B, 01"
                />
              </div>

              <div className="form-field">
                <label htmlFor="bay">Bay</label>
                <input
                  id="bay"
                  type="text"
                  value={formData.bay}
                  onChange={(e) => handleChange('bay', e.target.value)}
                  placeholder="e.g., 01, 02, A"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="level">Level</label>
                <input
                  id="level"
                  type="text"
                  value={formData.level}
                  onChange={(e) => handleChange('level', e.target.value)}
                  placeholder="e.g., 1, 2, Ground"
                />
              </div>

              <div className="form-field">
                <label htmlFor="position">Position</label>
                <input
                  id="position"
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  placeholder="e.g., Left, Right, Center"
                />
              </div>
            </div>
          </div>

          {/* Coordinates */}
          <div className="form-section">
            <h3 className="form-section-title">Coordinates</h3>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="coordinates_x">X Coordinate</label>
                <input
                  id="coordinates_x"
                  type="number"
                  value={formData.coordinates.x}
                  onChange={(e) => handleChange('coordinates.x', e.target.value)}
                  className={errors['coordinates.x'] ? 'error' : ''}
                  placeholder="X position"
                  step="0.01"
                />
                {errors['coordinates.x'] && <span className="error-message">{errors['coordinates.x']}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="coordinates_y">Y Coordinate</label>
                <input
                  id="coordinates_y"
                  type="number"
                  value={formData.coordinates.y}
                  onChange={(e) => handleChange('coordinates.y', e.target.value)}
                  className={errors['coordinates.y'] ? 'error' : ''}
                  placeholder="Y position"
                  step="0.01"
                />
                {errors['coordinates.y'] && <span className="error-message">{errors['coordinates.y']}</span>}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="coordinates_z">Z Coordinate (Height)</label>
              <input
                id="coordinates_z"
                type="number"
                value={formData.coordinates.z}
                onChange={(e) => handleChange('coordinates.z', e.target.value)}
                className={errors['coordinates.z'] ? 'error' : ''}
                placeholder="Z position (height)"
                step="0.01"
              />
              {errors['coordinates.z'] && <span className="error-message">{errors['coordinates.z']}</span>}
            </div>
          </div>

          {/* Dimensions */}
          <div className="form-section">
            <h3 className="form-section-title">Dimensions</h3>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="dimensions_length">Length</label>
                <input
                  id="dimensions_length"
                  type="number"
                  value={formData.dimensions.length}
                  onChange={(e) => handleChange('dimensions.length', e.target.value)}
                  className={errors['dimensions.length'] ? 'error' : ''}
                  placeholder="Length"
                  min="0"
                  step="0.01"
                />
                {errors['dimensions.length'] && <span className="error-message">{errors['dimensions.length']}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="dimensions_width">Width</label>
                <input
                  id="dimensions_width"
                  type="number"
                  value={formData.dimensions.width}
                  onChange={(e) => handleChange('dimensions.width', e.target.value)}
                  className={errors['dimensions.width'] ? 'error' : ''}
                  placeholder="Width"
                  min="0"
                  step="0.01"
                />
                {errors['dimensions.width'] && <span className="error-message">{errors['dimensions.width']}</span>}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="dimensions_height">Height</label>
              <input
                id="dimensions_height"
                type="number"
                value={formData.dimensions.height}
                onChange={(e) => handleChange('dimensions.height', e.target.value)}
                className={errors['dimensions.height'] ? 'error' : ''}
                placeholder="Height"
                min="0"
                step="0.01"
              />
              {errors['dimensions.height'] && <span className="error-message">{errors['dimensions.height']}</span>}
            </div>
          </div>

          {/* Capacity & Weight */}
          <div className="form-section">
            <h3 className="form-section-title">Capacity & Weight</h3>
            
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

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="weight_limit">Weight Limit</label>
                <input
                  id="weight_limit"
                  type="number"
                  value={formData.weight_limit}
                  onChange={(e) => handleChange('weight_limit', e.target.value)}
                  className={errors.weight_limit ? 'error' : ''}
                  placeholder="Enter weight limit"
                  min="0"
                  step="0.01"
                />
                {errors.weight_limit && <span className="error-message">{errors.weight_limit}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="weight_unit">Weight Unit</label>
                <select
                  id="weight_unit"
                  value={formData.weight_unit}
                  onChange={(e) => handleChange('weight_unit', e.target.value)}
                >
                  {WEIGHT_UNITS.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Properties */}
          <div className="form-section">
            <h3 className="form-section-title">Additional Properties</h3>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="barcode">Barcode</label>
                <input
                  id="barcode"
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => handleChange('barcode', e.target.value)}
                  placeholder="Enter barcode"
                />
              </div>

              <div className="form-field">
                <label htmlFor="qr_code">QR Code</label>
                <input
                  id="qr_code"
                  type="text"
                  value={formData.qr_code}
                  onChange={(e) => handleChange('qr_code', e.target.value)}
                  placeholder="Enter QR code"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="picking_sequence">Picking Sequence</label>
              <input
                id="picking_sequence"
                type="number"
                value={formData.picking_sequence}
                onChange={(e) => handleChange('picking_sequence', e.target.value)}
                className={errors.picking_sequence ? 'error' : ''}
                placeholder="Enter picking sequence number"
                min="0"
              />
              {errors.picking_sequence && <span className="error-message">{errors.picking_sequence}</span>}
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_pickable}
                    onChange={(e) => handleChange('is_pickable', e.target.checked)}
                  />
                  Pickable Location
                </label>
              </div>

              <div className="form-field">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_bulk_location}
                    onChange={(e) => handleChange('is_bulk_location', e.target.checked)}
                  />
                  Bulk Location
                </label>
              </div>
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
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Location' : 'Create Location')}
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

export default LocationModal
