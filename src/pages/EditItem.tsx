import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useItems } from '../hooks/useItems'
import Button from '../components/ui/Button'

function EditItem() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { getItem, updateItem, loading } = useItems()
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [isLoading, setIsLoading] = useState(true)

  const item = id ? getItem(id) : undefined

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description
      })
      setIsLoading(false)
    } else if (!loading) {
      // Item not found and not loading
      setIsLoading(false)
    }
  }, [item, loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!id || !item) {
      alert('Item not found')
      return
    }

    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Please fill in all fields')
      return
    }

    try {
      await updateItem(id, {
        name: formData.name.trim(),
        description: formData.description.trim()
      })
      navigate('/items')
    } catch (error) {
      console.error('Failed to update item:', error)
      alert('Failed to update item. Please try again.')
    }
  }

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          Loading item...
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Item not found</p>
          <Button variant="outline" onClick={() => navigate('/items')}>
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Items
          </Button>
        </div>
      </div>
    )
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
        <h1 className="text-lg font-semibold">Edit Item</h1>
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
            {loading ? 'Updating...' : 'Update Item'}
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

export default EditItem
