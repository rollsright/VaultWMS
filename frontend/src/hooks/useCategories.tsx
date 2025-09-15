import { useState, useEffect } from 'react';
import { Category, CategorySummary, CreateCategoryRequest, UpdateCategoryRequest } from '../types/category';

// Mock data for development - will be replaced with API calls
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Alcohol',
    description: '',
    status: 'active',
    sort_order: 0,
    is_active: true,
    created_at: '2025-08-24T00:00:00Z',
    updated_at: '2025-08-24T00:00:00Z',
  },
  {
    id: '2',
    name: 'Apparel',
    description: '',
    status: 'active',
    sort_order: 0,
    is_active: true,
    created_at: '2025-08-24T00:00:00Z',
    updated_at: '2025-08-24T00:00:00Z',
  },
  {
    id: '3',
    name: 'Documents',
    description: '',
    status: 'active',
    sort_order: 0,
    is_active: true,
    created_at: '2025-08-24T00:00:00Z',
    updated_at: '2025-08-24T00:00:00Z',
  },
  {
    id: '4',
    name: 'Electronics',
    description: 'Devices from Rogers',
    status: 'active',
    sort_order: 0,
    is_active: true,
    created_at: '2025-07-17T00:00:00Z',
    updated_at: '2025-07-17T00:00:00Z',
  },
  {
    id: '5',
    name: 'Product',
    description: 'General Product',
    status: 'active',
    sort_order: 0,
    is_active: true,
    created_at: '2025-07-17T00:00:00Z',
    updated_at: '2025-07-17T00:00:00Z',
  },
  {
    id: '6',
    name: 'apparel',
    description: '',
    status: 'active',
    sort_order: 0,
    is_active: true,
    created_at: '2025-08-24T00:00:00Z',
    updated_at: '2025-08-24T00:00:00Z',
  },
  {
    id: '7',
    name: 'test',
    description: '',
    status: 'active',
    sort_order: 0,
    is_active: true,
    created_at: '2025-08-24T00:00:00Z',
    updated_at: '2025-08-24T00:00:00Z',
  },
];

const mockSummary: CategorySummary = {
  totalCategories: 7,
  activeCategories: 7,
  inactiveCategories: 0,
};

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState<CategorySummary>(mockSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request('/categories');
      // setCategories(response.data);
      
      setCategories(mockCategories);
      setSummary(mockSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: CreateCategoryRequest): Promise<Category> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request('/categories', {
      //   method: 'POST',
      //   body: JSON.stringify(categoryData),
      // });
      
      const newCategory: Category = {
        id: Date.now().toString(),
        ...categoryData,
        status: categoryData.status || 'active',
        sort_order: categoryData.sort_order || 0,
        is_active: categoryData.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setCategories(prev => [...prev, newCategory]);
      
      // Update summary
      setSummary(prev => ({
        ...prev,
        totalCategories: prev.totalCategories + 1,
        activeCategories: newCategory.status === 'active' ? prev.activeCategories + 1 : prev.activeCategories,
        inactiveCategories: newCategory.status === 'inactive' ? prev.inactiveCategories + 1 : prev.inactiveCategories,
      }));
      
      return newCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      throw err;
    }
  };

  const updateCategory = async (id: string, categoryData: UpdateCategoryRequest): Promise<Category> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request(`/categories/${id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(categoryData),
      // });
      
      const oldCategory = categories.find(c => c.id === id)!;
      const updatedCategory: Category = {
        ...oldCategory,
        ...categoryData,
        updated_at: new Date().toISOString(),
      };
      
      setCategories(prev => prev.map(c => c.id === id ? updatedCategory : c));
      
      // Update summary if status changed
      if (categoryData.status && categoryData.status !== oldCategory.status) {
        setSummary(prev => {
          const newSummary = { ...prev };
          if (oldCategory.status === 'active' && categoryData.status === 'inactive') {
            newSummary.activeCategories -= 1;
            newSummary.inactiveCategories += 1;
          } else if (oldCategory.status === 'inactive' && categoryData.status === 'active') {
            newSummary.activeCategories += 1;
            newSummary.inactiveCategories -= 1;
          }
          return newSummary;
        });
      }
      
      return updatedCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
      throw err;
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // await apiClient.request(`/categories/${id}`, {
      //   method: 'DELETE',
      // });
      
      const category = categories.find(c => c.id === id);
      setCategories(prev => prev.filter(c => c.id !== id));
      
      if (category) {
        setSummary(prev => ({
          ...prev,
          totalCategories: prev.totalCategories - 1,
          activeCategories: category.status === 'active' ? prev.activeCategories - 1 : prev.activeCategories,
          inactiveCategories: category.status === 'inactive' ? prev.inactiveCategories - 1 : prev.inactiveCategories,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      throw err;
    }
  };

  return {
    categories,
    summary,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: loadCategories,
  };
}
