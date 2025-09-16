import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
      // Replace with your actual API endpoint with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      try {
        console.log('Items fetch: Making request to', `${(import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3002'}/api/items`)
        const response = await fetch(`${(import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3002'}/api/items`, {
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        console.log('Items fetch: Response received', { status: response.status, statusText: response.statusText, ok: response.ok })
      
        if (!response.ok) {
          throw new Error(`Failed to fetch items: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        if (data.success && data.data) {
          setItems(data.data)
        } else {
          throw new Error(data.error || 'Failed to fetch items')
        }
      } catch (fetchError) {
        clearTimeout(timeoutId)
        throw fetchError
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      
      // For demo purposes, set some mock data when API is not available
      console.warn('API not available, using mock data:', errorMessage)
      
      // Additional logging for debugging
      if (err instanceof Error && err.name === 'AbortError') {
        console.warn('Request timed out after 5 seconds')
      }
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
      const response = await fetch(`${(import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3002'}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to create item: ${response.statusText}`)
      }
      
      const data = await response.json()
      if (data.success && data.data) {
        setItems(prev => [...prev, data.data])
        return data.data
      } else {
        throw new Error(data.error || 'Failed to create item')
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
      const response = await fetch(`${(import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3002'}/api/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update item: ${response.statusText}`)
      }
      
      const data = await response.json()
      if (data.success && data.data) {
        setItems(prev => prev.map(item => item.id === id ? data.data : item))
        return data.data
      } else {
        throw new Error(data.error || 'Failed to update item')
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
      const response = await fetch(`${(import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3002'}/api/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.statusText}`)
      }
      
      const data = await response.json()
      if (data.success) {
        setItems(prev => prev.filter(item => item.id !== id))
      } else {
        throw new Error(data.error || 'Failed to delete item')
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
