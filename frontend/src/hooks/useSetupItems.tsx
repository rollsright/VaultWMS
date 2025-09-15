import { useState, useEffect } from 'react';
import { SetupItem, SetupItemSummary, CreateSetupItemRequest, UpdateSetupItemRequest } from '../types/setupItem';

// Mock data for development - will be replaced with API calls
const mockSetupItems: SetupItem[] = [
  {
    id: '1',
    name: 'Sample Product A',
    description: 'High-quality electronic device',
    sku: 'SPR-001',
    barcode: '1234567890123',
    category_id: '4', // Electronics
    uom_id: '2', // Each
    status: 'active',
    customer_id: '1',
    weight: 0.5,
    dimensions: {
      length: 10,
      width: 8,
      height: 2
    },
    is_active: true,
    created_at: '2025-07-15T00:00:00Z',
    updated_at: '2025-07-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Office Supplies Kit',
    description: 'Complete office supplies bundle',
    sku: 'OSK-002',
    category_id: '3', // Documents
    uom_id: '8', // Pack
    status: 'active',
    customer_id: '1',
    weight: 1.2,
    is_active: true,
    created_at: '2025-07-20T00:00:00Z',
    updated_at: '2025-07-20T00:00:00Z',
  },
  {
    id: '3',
    name: 'Winter Jacket',
    description: 'Waterproof winter jacket',
    sku: 'WJ-003',
    barcode: '9876543210987',
    category_id: '2', // Apparel
    uom_id: '2', // Each
    status: 'active',
    customer_id: '2',
    weight: 0.8,
    dimensions: {
      length: 30,
      width: 25,
      height: 5
    },
    is_active: true,
    created_at: '2025-08-01T00:00:00Z',
    updated_at: '2025-08-01T00:00:00Z',
  },
];

const mockSummary: SetupItemSummary = {
  totalItems: 2,
  activeItems: 2,
  inactiveItems: 0,
};

export function useSetupItems(customerId?: string) {
  const [items, setItems] = useState<SetupItem[]>([]);
  const [summary, setSummary] = useState<SetupItemSummary>(mockSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load items on mount or when customerId changes
  useEffect(() => {
    if (customerId) {
      loadItems(customerId);
    } else {
      setItems([]);
      setSummary({ totalItems: 0, activeItems: 0, inactiveItems: 0 });
      setLoading(false);
    }
  }, [customerId]);

  const loadItems = async (customerIdFilter: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter items by customer ID
      const filteredItems = mockSetupItems.filter(item => item.customer_id === customerIdFilter);
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request(`/customers/${customerIdFilter}/items`);
      // setItems(response.data);
      
      setItems(filteredItems);
      setSummary({
        totalItems: filteredItems.length,
        activeItems: filteredItems.filter(item => item.status === 'active').length,
        inactiveItems: filteredItems.filter(item => item.status === 'inactive').length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData: CreateSetupItemRequest): Promise<SetupItem> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request(`/customers/${itemData.customer_id}/items`, {
      //   method: 'POST',
      //   body: JSON.stringify(itemData),
      // });
      
      const newItem: SetupItem = {
        id: Date.now().toString(),
        ...itemData,
        status: itemData.status || 'active',
        is_active: itemData.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setItems(prev => [...prev, newItem]);
      setSummary(prev => ({
        ...prev,
        totalItems: prev.totalItems + 1,
        activeItems: itemData.status !== 'inactive' ? prev.activeItems + 1 : prev.activeItems,
        inactiveItems: itemData.status === 'inactive' ? prev.inactiveItems + 1 : prev.inactiveItems,
      }));
      
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item');
      throw err;
    }
  };

  const updateItem = async (id: string, itemData: UpdateSetupItemRequest): Promise<SetupItem> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request(`/items/${id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(itemData),
      // });
      
      const updatedItem: SetupItem = {
        ...items.find(item => item.id === id)!,
        ...itemData,
        updated_at: new Date().toISOString(),
      };
      
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
      throw err;
    }
  };

  const deleteItem = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // await apiClient.request(`/items/${id}`, {
      //   method: 'DELETE',
      // });
      
      const item = items.find(item => item.id === id);
      setItems(prev => prev.filter(item => item.id !== id));
      
      if (item) {
        setSummary(prev => ({
          ...prev,
          totalItems: prev.totalItems - 1,
          activeItems: item.status === 'active' ? prev.activeItems - 1 : prev.activeItems,
          inactiveItems: item.status === 'inactive' ? prev.inactiveItems - 1 : prev.inactiveItems,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      throw err;
    }
  };

  const exportItems = () => {
    // Create CSV content
    const headers = ['Name', 'SKU', 'Description', 'Category', 'UOM', 'Status', 'Weight', 'Created'];
    const csvContent = [
      headers.join(','),
      ...items.map(item => [
        `"${item.name}"`,
        item.sku || '',
        `"${item.description || ''}"`,
        item.category_id || '',
        item.uom_id || '',
        item.status,
        item.weight || '',
        new Date(item.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `items-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    items,
    summary,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    exportItems,
    refreshItems: () => customerId && loadItems(customerId),
  };
}
