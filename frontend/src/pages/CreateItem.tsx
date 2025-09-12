import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useItems } from '../hooks/useItems'
import Button from '../components/ui/Button'

function CreateItem() {
  const navigate = useNavigate()
  const { createItem, loading } = useItems()
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Please fill in all fields')
      return
    }

    try {
      await createItem({
        name: formData.name.trim(),
        description: formData.description.trim()
      })
      navigate('/items')
    } catch (error) {
      console.error('Failed to create item:', error)
      alert('Failed to create item. Please try again.')
    }
  }

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div className="card">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/items')}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Items
        </Button>
        <h1 className="text-lg font-semibold">Create New Item</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name *
          </label>
          <input
            type="text"
            id="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange('name')}
            placeholder="Enter item name"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description *
          </label>
          <textarea
            id="description"
            className="form-input form-textarea"
            value={formData.description}
            onChange={handleChange('description')}
            placeholder="Enter item description"
            rows={4}
            required
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Item'}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/items')}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateItem
