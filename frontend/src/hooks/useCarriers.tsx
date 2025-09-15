import { useState, useEffect } from 'react';
import { Carrier, CarrierSummary, CreateCarrierRequest, UpdateCarrierRequest } from '../types/carrier';

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
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request('/carriers');
      // setCarriers(response.data);
      
      setCarriers(mockCarriers);
      setSummary(mockSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load carriers');
    } finally {
      setLoading(false);
    }
  };

  const createCarrier = async (carrierData: CreateCarrierRequest): Promise<Carrier> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request('/carriers', {
      //   method: 'POST',
      //   body: JSON.stringify(carrierData),
      // });
      
      const newCarrier: Carrier = {
        id: Date.now().toString(),
        ...carrierData,
        service_types: carrierData.service_types || [],
        status: carrierData.status || 'active',
        is_active: carrierData.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setCarriers(prev => [...prev, newCarrier]);
      
      // Update summary
      setSummary(prev => ({
        ...prev,
        totalCarriers: prev.totalCarriers + 1,
        activeCarriers: newCarrier.status === 'active' ? prev.activeCarriers + 1 : prev.activeCarriers,
        inactiveCarriers: newCarrier.status === 'inactive' ? prev.inactiveCarriers + 1 : prev.inactiveCarriers,
        totalServices: prev.totalServices + newCarrier.service_types.length,
      }));
      
      return newCarrier;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create carrier');
      throw err;
    }
  };

  const updateCarrier = async (id: string, carrierData: UpdateCarrierRequest): Promise<Carrier> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request(`/carriers/${id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(carrierData),
      // });
      
      const oldCarrier = carriers.find(c => c.id === id)!;
      const updatedCarrier: Carrier = {
        ...oldCarrier,
        ...carrierData,
        updated_at: new Date().toISOString(),
      };
      
      setCarriers(prev => prev.map(c => c.id === id ? updatedCarrier : c));
      
      // Update summary if status changed
      if (carrierData.status && carrierData.status !== oldCarrier.status) {
        setSummary(prev => {
          const newSummary = { ...prev };
          if (oldCarrier.status === 'active' && carrierData.status === 'inactive') {
            newSummary.activeCarriers -= 1;
            newSummary.inactiveCarriers += 1;
          } else if (oldCarrier.status === 'inactive' && carrierData.status === 'active') {
            newSummary.activeCarriers += 1;
            newSummary.inactiveCarriers -= 1;
          }
          return newSummary;
        });
      }
      
      return updatedCarrier;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update carrier');
      throw err;
    }
  };

  const deleteCarrier = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // await apiClient.request(`/carriers/${id}`, {
      //   method: 'DELETE',
      // });
      
      const carrier = carriers.find(c => c.id === id);
      setCarriers(prev => prev.filter(c => c.id !== id));
      
      if (carrier) {
        setSummary(prev => ({
          ...prev,
          totalCarriers: prev.totalCarriers - 1,
          activeCarriers: carrier.status === 'active' ? prev.activeCarriers - 1 : prev.activeCarriers,
          inactiveCarriers: carrier.status === 'inactive' ? prev.inactiveCarriers - 1 : prev.inactiveCarriers,
          totalServices: prev.totalServices - carrier.service_types.length,
        }));
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
