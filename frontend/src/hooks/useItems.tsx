import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiClient } from '../lib/api'

export interface Item {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

interface ItemsContextType {
  items: Item[]
  loading: boolean
  error: string | null
  createItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Item>
  updateItem: (id: string, updates: Partial<Omit<Item, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Item>
  deleteItem: (id: string) => Promise<void>
  getItem: (id: string) => Item | undefined
  refetch: () => Promise<void>
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined)

interface ItemProviderProps {
  children: ReactNode
}

export function ItemProvider({ children }: ItemProviderProps) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Items fetch: Making API request')
      const response = await apiClient.getItems()
      
      if (response.success && response.data) {
        setItems(response.data)
        console.log('Items fetch: Success - set items:', response.data.length)
      } else {
        throw new Error(response.error || 'Failed to fetch items')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      
      // For demo purposes, set some mock data when API is not available
      console.warn('API not available, using mock data:', errorMessage)
      
      setItems([
        {
          id: '1',
          name: 'Sample Item 1',
          description: 'This is a sample item for demonstration',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Sample Item 2',
          description: 'Another sample item with different content',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const createItem = async (itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.createItem(itemData)
      
      if (response.success && response.data) {
        setItems(prev => [...prev, response.data])
        return response.data
      } else {
        throw new Error(response.error || 'Failed to create item')
      }
    } catch (err) {
      // For demo purposes, create a mock item when API is not available
      const now = new Date().toISOString()
      const newItem: Item = {
        id: Date.now().toString(),
        ...itemData,
        createdAt: now,
        updatedAt: now
      }
      setItems(prev => [...prev, newItem])
      return newItem
    } finally {
      setLoading(false)
    }
  }

  const updateItem = async (id: string, updates: Partial<Omit<Item, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Item> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.updateItem(id, updates)
      
      if (response.success && response.data) {
        setItems(prev => prev.map(item => item.id === id ? response.data : item))
        return response.data
      } else {
        throw new Error(response.error || 'Failed to update item')
      }
    } catch (err) {
      // For demo purposes, update the mock item when API is not available
      const updatedItem = items.find(item => item.id === id)
      if (!updatedItem) {
        throw new Error('Item not found')
      }
      
      const newItem = {
        ...updatedItem,
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      setItems(prev => prev.map(item => item.id === id ? newItem : item))
      return newItem
    } finally {
      setLoading(false)
    }
  }

  const deleteItem = async (id: string): Promise<void> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.deleteItem(id)
      
      if (response.success) {
        setItems(prev => prev.filter(item => item.id !== id))
      } else {
        throw new Error(response.error || 'Failed to delete item')
      }
    } catch (err) {
      // For demo purposes, delete the mock item when API is not available
      setItems(prev => prev.filter(item => item.id !== id))
    } finally {
      setLoading(false)
    }
  }

  const getItem = (id: string): Item | undefined => {
    return items.find(item => item.id === id)
  }

  useEffect(() => {
    // Fetch items on component mount
    console.log('ItemProvider: Fetching items')
    fetchItems()
  }, [])

  const value: ItemsContextType = {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    getItem,
    refetch: fetchItems
  }

  return (
    <ItemsContext.Provider value={value}>
      {children}
    </ItemsContext.Provider>
  )
}

export function useItems(): ItemsContextType {
  const context = useContext(ItemsContext)
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemProvider')
  }
  return context
}
