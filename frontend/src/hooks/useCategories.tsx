import { useState, useEffect } from 'react';
import { Category, CategorySummary, CreateCategoryRequest, UpdateCategoryRequest } from '../types/category';
import { apiClient } from '../lib/api';

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
      
      const [categoriesResponse, statsResponse] = await Promise.all([
        apiClient.getCategories(),
        apiClient.getCategoryStats()
      ]);
      
      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      } else {
        throw new Error(categoriesResponse.error || 'Failed to fetch categories');
      }
      
      if (statsResponse.success && statsResponse.data) {
        setSummary(statsResponse.data);
      } else {
        // Use fallback summary if stats fail
        setSummary({
          totalCategories: categoriesResponse.data?.length || 0,
          activeCategories: categoriesResponse.data?.filter((c: any) => c.status === 'active').length || 0,
          inactiveCategories: categoriesResponse.data?.filter((c: any) => c.status === 'inactive').length || 0,
        });
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to load categories');
      // Fallback to mock data in case of error
      setCategories(mockCategories);
      setSummary(mockSummary);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: CreateCategoryRequest): Promise<Category> => {
    try {
      setError(null);
      
      const response = await apiClient.createCategory(categoryData);
      
      if (response.success && response.data) {
        const newCategory = response.data;
        setCategories(prev => [...prev, newCategory]);
        
        // Update summary
        setSummary(prev => ({
          ...prev,
          totalCategories: prev.totalCategories + 1,
          activeCategories: newCategory.status === 'active' ? prev.activeCategories + 1 : prev.activeCategories,
          inactiveCategories: newCategory.status === 'inactive' ? prev.inactiveCategories + 1 : prev.inactiveCategories,
        }));
        
        return newCategory;
      } else {
        throw new Error(response.error || 'Failed to create category');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      throw err;
    }
  };

  const updateCategory = async (id: string, categoryData: UpdateCategoryRequest): Promise<Category> => {
    try {
      setError(null);
      
      const response = await apiClient.updateCategory(id, categoryData);
      
      if (response.success && response.data) {
        const updatedCategory = response.data;
        const oldCategory = categories.find(c => c.id === id);
        
        setCategories(prev => prev.map(c => c.id === id ? updatedCategory : c));
        
        // Update summary if status changed
        if (oldCategory && updatedCategory.status !== oldCategory.status) {
          setSummary(prev => {
            const newSummary = { ...prev };
            if (oldCategory.status === 'active' && updatedCategory.status === 'inactive') {
              newSummary.activeCategories -= 1;
              newSummary.inactiveCategories += 1;
            } else if (oldCategory.status === 'inactive' && updatedCategory.status === 'active') {
              newSummary.activeCategories += 1;
              newSummary.inactiveCategories -= 1;
            }
            return newSummary;
          });
        }
        
        return updatedCategory;
      } else {
        throw new Error(response.error || 'Failed to update category');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
      throw err;
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      const category = categories.find(c => c.id === id);
      const response = await apiClient.deleteCategory(id);
      
      if (response.success) {
        setCategories(prev => prev.filter(c => c.id !== id));
        
        if (category) {
          setSummary(prev => ({
            ...prev,
            totalCategories: prev.totalCategories - 1,
            activeCategories: category.status === 'active' ? prev.activeCategories - 1 : prev.activeCategories,
            inactiveCategories: category.status === 'inactive' ? prev.inactiveCategories - 1 : prev.inactiveCategories,
          }));
        }
      } else {
        throw new Error(response.error || 'Failed to delete category');
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
