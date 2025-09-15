import { useState, useEffect } from 'react';
import { UOM, UOMSummary, CreateUOMRequest, UpdateUOMRequest } from '../types/uom';

// Mock data for development - will be replaced with API calls
const mockUOMs: UOM[] = [
  {
    id: '1',
    name: 'Carton',
    code: 'Carton',
    type: 'COUNT',
    conversion_factor: 1.0000,
    base_unit: true,
    is_active: true,
    created_at: '2025-07-14T00:00:00Z',
    updated_at: '2025-07-14T00:00:00Z',
  },
  {
    id: '2',
    name: 'Each',
    code: 'EA',
    type: 'COUNT',
    conversion_factor: 1.0000,
    base_unit: true,
    is_active: true,
    created_at: '2025-07-10T00:00:00Z',
    updated_at: '2025-07-10T00:00:00Z',
  },
  {
    id: '3',
    name: 'Each',
    code: 'TEST_UOM',
    type: 'COUNT',
    conversion_factor: 1.0000,
    base_unit: false,
    is_active: true,
    created_at: '2025-07-10T00:00:00Z',
    updated_at: '2025-07-10T00:00:00Z',
  },
  {
    id: '4',
    name: 'Gram',
    code: 'CUST-888',
    type: 'COUNT',
    conversion_factor: 1.0000,
    base_unit: false,
    is_active: true,
    created_at: '2025-08-19T00:00:00Z',
    updated_at: '2025-08-19T00:00:00Z',
  },
  {
    id: '5',
    name: 'Inches',
    code: 'Inches',
    type: 'LENGTH',
    conversion_factor: 1.0000,
    base_unit: true,
    is_active: true,
    created_at: '2025-07-14T00:00:00Z',
    updated_at: '2025-07-14T00:00:00Z',
  },
  {
    id: '6',
    name: 'Kilogram',
    code: 'KG',
    type: 'WEIGHT',
    conversion_factor: 1.0000,
    base_unit: true,
    is_active: true,
    created_at: '2025-07-10T00:00:00Z',
    updated_at: '2025-07-10T00:00:00Z',
  },
  {
    id: '7',
    name: 'Liter',
    code: 'L',
    type: 'VOLUME',
    conversion_factor: 1.0000,
    base_unit: true,
    is_active: true,
    created_at: '2025-08-19T00:00:00Z',
    updated_at: '2025-08-19T00:00:00Z',
  },
  {
    id: '8',
    name: 'PACK',
    code: 'PACK',
    type: 'COUNT',
    conversion_factor: 1.0000,
    base_unit: false,
    is_active: true,
    created_at: '2025-07-14T00:00:00Z',
    updated_at: '2025-07-14T00:00:00Z',
  },
];

const mockSummary: UOMSummary = {
  totalUOMs: 8,
  weightUOMs: 1,
  volumeUOMs: 1,
  lengthUOMs: 1,
};

export function useUOMs() {
  const [uoms, setUOMs] = useState<UOM[]>([]);
  const [summary, setSummary] = useState<UOMSummary>(mockSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load UOMs on mount
  useEffect(() => {
    loadUOMs();
  }, []);

  const loadUOMs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request('/uoms');
      // setUOMs(response.data);
      
      setUOMs(mockUOMs);
      setSummary(mockSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load UOMs');
    } finally {
      setLoading(false);
    }
  };

  const createUOM = async (uomData: CreateUOMRequest): Promise<UOM> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request('/uoms', {
      //   method: 'POST',
      //   body: JSON.stringify(uomData),
      // });
      
      const newUOM: UOM = {
        id: Date.now().toString(),
        ...uomData,
        is_active: uomData.is_active ?? true,
        base_unit: uomData.base_unit ?? false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setUOMs(prev => [...prev, newUOM]);
      
      // Update summary
      setSummary(prev => {
        const newSummary = { ...prev, totalUOMs: prev.totalUOMs + 1 };
        switch (uomData.type) {
          case 'WEIGHT':
            newSummary.weightUOMs += 1;
            break;
          case 'VOLUME':
            newSummary.volumeUOMs += 1;
            break;
          case 'LENGTH':
            newSummary.lengthUOMs += 1;
            break;
        }
        return newSummary;
      });
      
      return newUOM;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create UOM');
      throw err;
    }
  };

  const updateUOM = async (id: string, uomData: UpdateUOMRequest): Promise<UOM> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request(`/uoms/${id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(uomData),
      // });
      
      const updatedUOM: UOM = {
        ...uoms.find(u => u.id === id)!,
        ...uomData,
        updated_at: new Date().toISOString(),
      };
      
      setUOMs(prev => prev.map(u => u.id === id ? updatedUOM : u));
      
      return updatedUOM;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update UOM');
      throw err;
    }
  };

  const deleteUOM = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // await apiClient.request(`/uoms/${id}`, {
      //   method: 'DELETE',
      // });
      
      const uom = uoms.find(u => u.id === id);
      setUOMs(prev => prev.filter(u => u.id !== id));
      
      if (uom) {
        setSummary(prev => {
          const newSummary = { ...prev, totalUOMs: prev.totalUOMs - 1 };
          switch (uom.type) {
            case 'WEIGHT':
              newSummary.weightUOMs -= 1;
              break;
            case 'VOLUME':
              newSummary.volumeUOMs -= 1;
              break;
            case 'LENGTH':
              newSummary.lengthUOMs -= 1;
              break;
          }
          return newSummary;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete UOM');
      throw err;
    }
  };

  return {
    uoms,
    summary,
    loading,
    error,
    createUOM,
    updateUOM,
    deleteUOM,
    refreshUOMs: loadUOMs,
  };
}
