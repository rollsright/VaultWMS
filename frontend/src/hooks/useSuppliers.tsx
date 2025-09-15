import { useState, useEffect } from 'react';
import { Supplier, SupplierSummary, CreateSupplierRequest, UpdateSupplierRequest } from '../types/supplier';

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

  const loadSuppliers = async (customerIdFilter: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter suppliers by customer ID
      const filteredSuppliers = mockSuppliers.filter(s => s.customer_id === customerIdFilter);
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request(`/customers/${customerIdFilter}/suppliers`);
      // setSuppliers(response.data);
      
      setSuppliers(filteredSuppliers);
      setSummary({
        totalSuppliers: filteredSuppliers.length,
        activeSuppliers: filteredSuppliers.filter(s => s.status === 'active').length,
        thisMonth: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (supplierData: CreateSupplierRequest): Promise<Supplier> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request(`/customers/${supplierData.customer_id}/suppliers`, {
      //   method: 'POST',
      //   body: JSON.stringify(supplierData),
      // });
      
      const newSupplier: Supplier = {
        id: Date.now().toString(),
        ...supplierData,
        status: supplierData.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setSuppliers(prev => [...prev, newSupplier]);
      setSummary(prev => ({
        ...prev,
        totalSuppliers: prev.totalSuppliers + 1,
        activeSuppliers: supplierData.status !== 'inactive' ? prev.activeSuppliers + 1 : prev.activeSuppliers,
      }));
      
      return newSupplier;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create supplier');
      throw err;
    }
  };

  const updateSupplier = async (id: string, supplierData: UpdateSupplierRequest): Promise<Supplier> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request(`/suppliers/${id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(supplierData),
      // });
      
      const updatedSupplier: Supplier = {
        ...suppliers.find(s => s.id === id)!,
        ...supplierData,
        updated_at: new Date().toISOString(),
      };
      
      setSuppliers(prev => prev.map(s => s.id === id ? updatedSupplier : s));
      
      return updatedSupplier;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update supplier');
      throw err;
    }
  };

  const deleteSupplier = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // await apiClient.request(`/suppliers/${id}`, {
      //   method: 'DELETE',
      // });
      
      const supplier = suppliers.find(s => s.id === id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
      
      if (supplier) {
        setSummary(prev => ({
          ...prev,
          totalSuppliers: prev.totalSuppliers - 1,
          activeSuppliers: supplier.status === 'active' ? prev.activeSuppliers - 1 : prev.activeSuppliers,
        }));
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
    refreshSuppliers: () => customerId && loadSuppliers(customerId),
  };
}
