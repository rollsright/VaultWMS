import { useState, useEffect } from 'react';
import { UOM, UOMSummary, CreateUOMRequest, UpdateUOMRequest } from '../types/uom';
import { apiClient } from '../lib/api';

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
      
      const [uomsResponse, statsResponse] = await Promise.all([
        apiClient.getUOMs(),
        apiClient.getUOMStats()
      ]);
      
      if (uomsResponse.success && uomsResponse.data) {
        setUOMs(uomsResponse.data);
      } else {
        throw new Error(uomsResponse.error || 'Failed to fetch UOMs');
      }
      
      if (statsResponse.success && statsResponse.data) {
        setSummary(statsResponse.data);
      } else {
        // Use fallback summary if stats fail
        const uomsList = uomsResponse.data || [];
        setSummary({
          totalUOMs: uomsList.length,
          weightUOMs: uomsList.filter((u: any) => u.type === 'WEIGHT').length,
          volumeUOMs: uomsList.filter((u: any) => u.type === 'VOLUME').length,
          lengthUOMs: uomsList.filter((u: any) => u.type === 'LENGTH').length,
        });
      }
    } catch (err) {
      console.error('Failed to load UOMs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load UOMs');
      // Fallback to mock data in case of error
      setUOMs(mockUOMs);
      setSummary(mockSummary);
    } finally {
      setLoading(false);
    }
  };

  const createUOM = async (uomData: CreateUOMRequest): Promise<UOM> => {
    try {
      setError(null);
      
      const response = await apiClient.createUOM(uomData);
      
      if (response.success && response.data) {
        const newUOM = response.data;
        setUOMs(prev => [...prev, newUOM]);
        
        // Update summary
        setSummary(prev => {
          const newSummary = { ...prev, totalUOMs: prev.totalUOMs + 1 };
          switch (newUOM.type) {
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
      } else {
        throw new Error(response.error || 'Failed to create UOM');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create UOM');
      throw err;
    }
  };

  const updateUOM = async (id: string, uomData: UpdateUOMRequest): Promise<UOM> => {
    try {
      setError(null);
      
      const response = await apiClient.updateUOM(id, uomData);
      
      if (response.success && response.data) {
        const updatedUOM = response.data;
        setUOMs(prev => prev.map(u => u.id === id ? updatedUOM : u));
        
        return updatedUOM;
      } else {
        throw new Error(response.error || 'Failed to update UOM');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update UOM');
      throw err;
    }
  };

  const deleteUOM = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      const uom = uoms.find(u => u.id === id);
      const response = await apiClient.deleteUOM(id);
      
      if (response.success) {
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
      } else {
        throw new Error(response.error || 'Failed to delete UOM');
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
