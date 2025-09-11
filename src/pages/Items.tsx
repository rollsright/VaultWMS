import { Link } from 'react-router-dom'
import { TrashIcon, Pencil1Icon, PlusIcon } from '@radix-ui/react-icons'
import { useItems } from '../hooks/useItems'
import Button from '../components/ui/Button'

function Items() {
  const { items, loading, error, deleteItem } = useItems()

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteItem(id)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          Loading items...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-red-600">
          <p>Error loading items: {error}</p>
          <p className="text-sm mt-2">Using mock data for demonstration.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold">Items</h1>
        <Link to="/items/create">
          <Button>
            <PlusIcon className="w-4 h-4" />
            Create New Item
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No items found.</p>
          <Link to="/items/create">
            <Button variant="outline">Create your first item</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td className="font-medium">{item.name}</td>
                  <td>{item.description}</td>
                  <td className="text-sm text-gray-600">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-sm text-gray-600">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Link to={`/items/${item.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Pencil1Icon className="w-3 h-3" />
                          Edit
                        </Button>
                      </Link>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDelete(item.id, item.name)}
                      >
                        <TrashIcon className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Items
