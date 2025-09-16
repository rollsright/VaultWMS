import { useState, useEffect } from 'react';
import { Supplier, SupplierSummary, CreateSupplierRequest, UpdateSupplierRequest } from '../types/supplier';
import { apiClient } from '../lib/api';

// Mock data for development - will be replaced with API calls
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'ABC Manufacturing',
    email: 'contact@abcmanufacturing.com',
    phone: '+1 (555) 123-4567',
    address: '123 Industrial Blvd, Vancouver, BC V6B 1A1',
    contact_person: 'John Smith',
    payment_terms: 'Net 30',
    status: 'active',
    customer_id: '1',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Pacific Supplies Ltd',
    email: 'orders@pacificsupplies.ca',
    phone: '+1 (555) 987-6543',
    address: '456 Commerce Way, Richmond, BC V7A 2K8',
    contact_person: 'Sarah Johnson',
    payment_terms: 'Net 15',
    status: 'active',
    customer_id: '1',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Western Components',
    email: 'info@westerncomponents.com',
    phone: '+1 (555) 555-7890',
    contact_person: 'Mike Chen',
    payment_terms: 'Net 30',
    status: 'inactive',
    customer_id: '2',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
];

const mockSummary: SupplierSummary = {
  totalSuppliers: 2,
  activeSuppliers: 2,
  thisMonth: 0,
};

export function useSuppliers(customerId?: string) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [summary, setSummary] = useState<SupplierSummary>(mockSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load suppliers on mount or when customerId changes
  useEffect(() => {
    if (customerId) {
      loadSuppliers(customerId);
    } else {
      setSuppliers([]);
      setSummary({ totalSuppliers: 0, activeSuppliers: 0, thisMonth: 0 });
      setLoading(false);
    }
  }, [customerId]);

  const loadSuppliers = async (customerIdFilter?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const [suppliersResponse, statsResponse] = await Promise.all([
        customerIdFilter ? apiClient.getSuppliers({ customer_id: customerIdFilter }) : apiClient.getSuppliers(),
        apiClient.getSupplierStats()
      ]);
      
      if (suppliersResponse.success && suppliersResponse.data) {
        setSuppliers(suppliersResponse.data);
      } else {
        throw new Error(suppliersResponse.error || 'Failed to fetch suppliers');
      }
      
      if (statsResponse.success && statsResponse.data) {
        setSummary(statsResponse.data);
      } else {
        // Use fallback summary if stats fail
        const filteredSuppliers = suppliersResponse.data || [];
        setSummary({
          totalSuppliers: filteredSuppliers.length,
          activeSuppliers: filteredSuppliers.filter((s: any) => s.status === 'active').length,
          thisMonth: 0,
        });
      }
    } catch (err) {
      console.error('Failed to load suppliers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load suppliers');
      // Fallback to mock data in case of error
      const filteredSuppliers = customerIdFilter 
        ? mockSuppliers.filter(s => s.customer_id === customerIdFilter)
        : mockSuppliers;
      setSuppliers(filteredSuppliers);
      setSummary({
        totalSuppliers: filteredSuppliers.length,
        activeSuppliers: filteredSuppliers.filter(s => s.status === 'active').length,
        thisMonth: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (supplierData: CreateSupplierRequest): Promise<Supplier> => {
    try {
      setError(null);
      
      const response = await apiClient.createSupplier(supplierData);
      
      if (response.success && response.data) {
        const newSupplier = response.data;
        setSuppliers(prev => [...prev, newSupplier]);
        setSummary(prev => ({
          ...prev,
          totalSuppliers: prev.totalSuppliers + 1,
          activeSuppliers: newSupplier.status !== 'inactive' ? prev.activeSuppliers + 1 : prev.activeSuppliers,
        }));
        
        return newSupplier;
      } else {
        throw new Error(response.error || 'Failed to create supplier');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create supplier');
      throw err;
    }
  };

  const updateSupplier = async (id: string, supplierData: UpdateSupplierRequest): Promise<Supplier> => {
    try {
      setError(null);
      
      const response = await apiClient.updateSupplier(id, supplierData);
      
      if (response.success && response.data) {
        const updatedSupplier = response.data;
        setSuppliers(prev => prev.map(s => s.id === id ? updatedSupplier : s));
        
        return updatedSupplier;
      } else {
        throw new Error(response.error || 'Failed to update supplier');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update supplier');
      throw err;
    }
  };

  const deleteSupplier = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      const supplier = suppliers.find(s => s.id === id);
      const response = await apiClient.deleteSupplier(id);
      
      if (response.success) {
        setSuppliers(prev => prev.filter(s => s.id !== id));
        
        if (supplier) {
          setSummary(prev => ({
            ...prev,
            totalSuppliers: prev.totalSuppliers - 1,
            activeSuppliers: supplier.status === 'active' ? prev.activeSuppliers - 1 : prev.activeSuppliers,
          }));
        }
      } else {
        throw new Error(response.error || 'Failed to delete supplier');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete supplier');
      throw err;
    }
  };

  return {
    suppliers,
    summary,
    loading,
    error,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    refreshSuppliers: () => loadSuppliers(customerId),
  };
}
