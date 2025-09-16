import { useState, useEffect } from 'react';
import { Carrier, CarrierSummary, CreateCarrierRequest, UpdateCarrierRequest } from '../types/carrier';
import { apiClient } from '../lib/api';

// Mock data for development - will be replaced with API calls
const mockCarriers: Carrier[] = [
  {
    id: '1',
    name: 'DHL',
    code: 'DHL',
    contact_name: 'JAne Doe',
    contact_email: 'jane@testcustomer.ca',
    contact_phone: '7787785946',
    service_types: ['Ground', 'Express', 'Weekend Only'],
    tracking_url: 'https://www.dhl.com/tracking',
    status: 'active',
    is_active: true,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Fedex testing',
    code: 'FE-02',
    contact_name: 'Cathy Fedex',
    contact_email: 'cathy@email.com',
    contact_phone: '1223456789',
    service_types: [],
    status: 'active',
    is_active: true,
    created_at: '2025-02-01T00:00:00Z',
    updated_at: '2025-02-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'UPS',
    code: 'UPS',
    contact_name: 'John Doe',
    contact_email: 'contact@carrier.com',
    contact_phone: '555 555 5555',
    service_types: [],
    status: 'active',
    is_active: true,
    created_at: '2025-01-20T00:00:00Z',
    updated_at: '2025-01-20T00:00:00Z',
  },
];

const mockSummary: CarrierSummary = {
  totalCarriers: 3,
  activeCarriers: 3,
  inactiveCarriers: 0,
  totalServices: 3,
};

export function useCarriers() {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [summary, setSummary] = useState<CarrierSummary>(mockSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load carriers on mount
  useEffect(() => {
    loadCarriers();
  }, []);

  const loadCarriers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [carriersResponse, statsResponse] = await Promise.all([
        apiClient.getCarriers(),
        apiClient.getCarrierStats()
      ]);
      
      if (carriersResponse.success && carriersResponse.data) {
        setCarriers(carriersResponse.data);
      } else {
        throw new Error(carriersResponse.error || 'Failed to fetch carriers');
      }
      
      if (statsResponse.success && statsResponse.data) {
        setSummary(statsResponse.data);
      } else {
        // Use fallback summary if stats fail
        setSummary({
          totalCarriers: carriersResponse.data?.length || 0,
          activeCarriers: carriersResponse.data?.filter((c: any) => c.status === 'active').length || 0,
          inactiveCarriers: carriersResponse.data?.filter((c: any) => c.status === 'inactive').length || 0,
          totalServices: carriersResponse.data?.reduce((sum: number, c: any) => sum + (c.service_types?.length || 0), 0) || 0,
        });
      }
    } catch (err) {
      console.error('Failed to load carriers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load carriers');
      // Fallback to mock data in case of error
      setCarriers(mockCarriers);
      setSummary(mockSummary);
    } finally {
      setLoading(false);
    }
  };

  const createCarrier = async (carrierData: CreateCarrierRequest): Promise<Carrier> => {
    try {
      setError(null);
      
      const response = await apiClient.createCarrier(carrierData);
      
      if (response.success && response.data) {
        const newCarrier = response.data;
        setCarriers(prev => [...prev, newCarrier]);
        
        // Update summary
        setSummary(prev => ({
          ...prev,
          totalCarriers: prev.totalCarriers + 1,
          activeCarriers: newCarrier.status === 'active' ? prev.activeCarriers + 1 : prev.activeCarriers,
          inactiveCarriers: newCarrier.status === 'inactive' ? prev.inactiveCarriers + 1 : prev.inactiveCarriers,
          totalServices: prev.totalServices + (newCarrier.service_types?.length || 0),
        }));
        
        return newCarrier;
      } else {
        throw new Error(response.error || 'Failed to create carrier');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create carrier');
      throw err;
    }
  };

  const updateCarrier = async (id: string, carrierData: UpdateCarrierRequest): Promise<Carrier> => {
    try {
      setError(null);
      
      const response = await apiClient.updateCarrier(id, carrierData);
      
      if (response.success && response.data) {
        const updatedCarrier = response.data;
        const oldCarrier = carriers.find(c => c.id === id);
        
        setCarriers(prev => prev.map(c => c.id === id ? updatedCarrier : c));
        
        // Update summary if status changed
        if (oldCarrier && updatedCarrier.status !== oldCarrier.status) {
          setSummary(prev => {
            const newSummary = { ...prev };
            if (oldCarrier.status === 'active' && updatedCarrier.status === 'inactive') {
              newSummary.activeCarriers -= 1;
              newSummary.inactiveCarriers += 1;
            } else if (oldCarrier.status === 'inactive' && updatedCarrier.status === 'active') {
              newSummary.activeCarriers += 1;
              newSummary.inactiveCarriers -= 1;
            }
            return newSummary;
          });
        }
        
        return updatedCarrier;
      } else {
        throw new Error(response.error || 'Failed to update carrier');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update carrier');
      throw err;
    }
  };

  const deleteCarrier = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      const carrier = carriers.find(c => c.id === id);
      const response = await apiClient.deleteCarrier(id);
      
      if (response.success) {
        setCarriers(prev => prev.filter(c => c.id !== id));
        
        if (carrier) {
          setSummary(prev => ({
            ...prev,
            totalCarriers: prev.totalCarriers - 1,
            activeCarriers: carrier.status === 'active' ? prev.activeCarriers - 1 : prev.activeCarriers,
            inactiveCarriers: carrier.status === 'inactive' ? prev.inactiveCarriers - 1 : prev.inactiveCarriers,
            totalServices: prev.totalServices - (carrier.service_types?.length || 0),
          }));
        }
      } else {
        throw new Error(response.error || 'Failed to delete carrier');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete carrier');
      throw err;
    }
  };

  return {
    carriers,
    summary,
    loading,
    error,
    createCarrier,
    updateCarrier,
    deleteCarrier,
    refreshCarriers: loadCarriers,
  };
}
