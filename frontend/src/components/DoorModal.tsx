import { useState, useEffect } from 'react'
import { Door, CreateDoorRequest, UpdateDoorRequest, DoorType } from '../types/door'
import { useWarehouses } from '../hooks/useWarehouses'
import Button from './ui/Button'

interface DoorModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateDoorRequest | UpdateDoorRequest) => Promise<void>
  door?: Door
  selectedWarehouseId?: string
  isEditing?: boolean
}

const DOOR_TYPES: DoorType[] = ['inbound', 'outbound', 'staging'];

const COMMON_EQUIPMENT = [
  'Loading Dock Leveler',
  'Dock Seal',
  'Dock Shelter',
  'Vehicle Restraint',
  'Truck Restraint',
  'Hydraulic Lift',
  'Manual Dock Plate',
  'Automatic Dock Plate',
  'Edge of Dock Leveler',
  'Pit Leveler',
  'Overhead Door',
  'Roll-up Door',
  'Safety Lights',
  'Communication System',
  'Wheel Chocks'
];

function DoorModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  door, 
  selectedWarehouseId,
  isEditing = false 
}: DoorModalProps) {
  const { warehouses } = useWarehouses()
  
  const [formData, setFormData] = useState({
    warehouse_id: selectedWarehouseId || '',
    door_number: '',
    name: '',
    type: 'inbound' as DoorType,
    status: 'active' as 'active' | 'inactive',
    is_active: true,
    description: '',
    location: '',
    width: '',
    height: '',
    capacity: '',
    equipment: [] as string[]
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (door && isEditing) {
      setFormData({
        warehouse_id: door.warehouse_id,
        door_number: door.door_number,
        name: door.name,
        type: door.type,
        status: door.status,
        is_active: door.is_active,
        description: door.description || '',
        location: door.location || '',
        width: door.dimensions?.width.toString() || '',
        height: door.dimensions?.height.toString() || '',
        capacity: door.capacity?.toString() || '',
        equipment: door.equipment || []
      })
    } else {
      setFormData({
        warehouse_id: selectedWarehouseId || '',
        door_number: '',
        name: '',
        type: 'inbound',
        status: 'active',
        is_active: true,
        description: '',
        location: '',
        width: '',
        height: '',
        capacity: '',
        equipment: []
      })
    }
    setErrors({})
  }, [door, isEditing, isOpen, selectedWarehouseId])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.warehouse_id) {
      newErrors.warehouse_id = 'Warehouse is required'
    }

    if (!formData.door_number.trim()) {
      newErrors.door_number = 'Door number is required'
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Door name is required'
    }

    if (formData.width && isNaN(Number(formData.width))) {
      newErrors.width = 'Width must be a valid number'
    }

    if (formData.height && isNaN(Number(formData.height))) {
      newErrors.height = 'Height must be a valid number'
    }

    if (formData.capacity && isNaN(Number(formData.capacity))) {
      newErrors.capacity = 'Capacity must be a valid number'
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
        warehouse_id: formData.warehouse_id,
        door_number: formData.door_number.trim(),
        name: formData.name.trim(),
        type: formData.type,
        status: formData.status,
        is_active: formData.is_active,
        description: formData.description.trim() || undefined,
        location: formData.location.trim() || undefined,
        dimensions: (formData.width && formData.height) ? {
          width: Number(formData.width),
          height: Number(formData.height)
        } : undefined,
        capacity: formData.capacity ? Number(formData.capacity) : undefined,
        equipment: formData.equipment.length > 0 ? formData.equipment : undefined
      }
      
      await onSubmit(submitData)
      onClose()
    } catch (error) {
      console.error('Failed to submit door:', error)
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

  const handleEquipmentToggle = (equipment: string) => {
    const currentEquipment = formData.equipment
    if (currentEquipment.includes(equipment)) {
      handleChange('equipment', currentEquipment.filter(e => e !== equipment))
    } else {
      handleChange('equipment', [...currentEquipment, equipment])
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Door' : 'Add New Door'}</h2>
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
                <label htmlFor="door_number">Door Number *</label>
                <input
                  id="door_number"
                  type="text"
                  value={formData.door_number}
                  onChange={(e) => handleChange('door_number', e.target.value)}
                  className={errors.door_number ? 'error' : ''}
                  placeholder="e.g., D001, A-01"
                />
                {errors.door_number && <span className="error-message">{errors.door_number}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="name">Door Name *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={errors.name ? 'error' : ''}
                  placeholder="e.g., Main Receiving Door"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="type">Door Type</label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                >
                  {DOOR_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter description of the door's purpose or special notes"
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Location & Physical Properties */}
          <div className="form-section">
            <h3 className="form-section-title">Location & Physical Properties</h3>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g., North Side, East Wall"
                />
              </div>

              <div className="form-field">
                <label htmlFor="capacity">Capacity (lbs)</label>
                <input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleChange('capacity', e.target.value)}
                  className={errors.capacity ? 'error' : ''}
                  placeholder="e.g., 5000"
                  min="0"
                />
                {errors.capacity && <span className="error-message">{errors.capacity}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="width">Width (ft)</label>
                <input
                  id="width"
                  type="number"
                  step="0.1"
                  value={formData.width}
                  onChange={(e) => handleChange('width', e.target.value)}
                  className={errors.width ? 'error' : ''}
                  placeholder="e.g., 8.0"
                  min="0"
                />
                {errors.width && <span className="error-message">{errors.width}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="height">Height (ft)</label>
                <input
                  id="height"
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                  className={errors.height ? 'error' : ''}
                  placeholder="e.g., 9.0"
                  min="0"
                />
                {errors.height && <span className="error-message">{errors.height}</span>}
              </div>
            </div>
          </div>

          {/* Equipment */}
          <div className="form-section">
            <h3 className="form-section-title">Equipment</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Select the equipment available at this door
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '0.75rem' 
            }}>
              {COMMON_EQUIPMENT.map((equipment) => (
                <div key={equipment} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id={`equipment-${equipment}`}
                    checked={formData.equipment.includes(equipment)}
                    onChange={() => handleEquipmentToggle(equipment)}
                    style={{ width: 'auto' }}
                  />
                  <label 
                    htmlFor={`equipment-${equipment}`} 
                    style={{ margin: 0, cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    {equipment}
                  </label>
                </div>
              ))}
            </div>
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
                    Door is operationally active
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
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Door' : 'Add Door')}
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

export default DoorModal
