import { useState, useEffect } from 'react';
import { Customer, CustomerSummary, CreateCustomerRequest, UpdateCustomerRequest } from '../types/customer';

// Mock data for development - will be replaced with API calls
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Customer test',
    email: 'customer@mail.com',
    location: 'Vancouver',
    status: 'active',
    created_at: '2025-06-09T00:00:00Z',
    updated_at: '2025-06-09T00:00:00Z',
  },
  {
    id: '2',
    name: 'George Chen',
    email: 'george.chen@rollsright.ca',
    location: 'North Vancouver',
    status: 'active',
    created_at: '2025-08-18T00:00:00Z',
    updated_at: '2025-08-18T00:00:00Z',
  },
  {
    id: '3',
    name: 'Testing',
    email: 'testing@test.com',
    status: 'active',
    created_at: '2025-06-23T00:00:00Z',
    updated_at: '2025-06-23T00:00:00Z',
  },
  {
    id: '4',
    name: 'Testing Company',
    email: 'jane@test.com',
    status: 'active',
    created_at: '2025-06-25T00:00:00Z',
    updated_at: '2025-06-25T00:00:00Z',
  },
];

const mockSummary: CustomerSummary = {
  totalCustomers: 4,
  activeCustomers: 4,
  thisMonth: 0,
};

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [summary, setSummary] = useState<CustomerSummary>(mockSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load customers on mount
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request('/customers');
      // setCustomers(response.data);
      
      setCustomers(mockCustomers);
      setSummary(mockSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customerData: CreateCustomerRequest): Promise<Customer> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request('/customers', {
      //   method: 'POST',
      //   body: JSON.stringify(customerData),
      // });
      
      const newCustomer: Customer = {
        id: Date.now().toString(),
        ...customerData,
        status: customerData.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setCustomers(prev => [...prev, newCustomer]);
      setSummary(prev => ({
        ...prev,
        totalCustomers: prev.totalCustomers + 1,
        activeCustomers: customerData.status !== 'inactive' ? prev.activeCustomers + 1 : prev.activeCustomers,
      }));
      
      return newCustomer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create customer');
      throw err;
    }
  };

  const updateCustomer = async (id: string, customerData: UpdateCustomerRequest): Promise<Customer> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request(`/customers/${id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(customerData),
      // });
      
      const updatedCustomer: Customer = {
        ...customers.find(c => c.id === id)!,
        ...customerData,
        updated_at: new Date().toISOString(),
      };
      
      setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
      
      return updatedCustomer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update customer');
      throw err;
    }
  };

  const deleteCustomer = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // await apiClient.request(`/customers/${id}`, {
      //   method: 'DELETE',
      // });
      
      const customer = customers.find(c => c.id === id);
      setCustomers(prev => prev.filter(c => c.id !== id));
      
      if (customer) {
        setSummary(prev => ({
          ...prev,
          totalCustomers: prev.totalCustomers - 1,
          activeCustomers: customer.status === 'active' ? prev.activeCustomers - 1 : prev.activeCustomers,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer');
      throw err;
    }
  };

  return {
    customers,
    summary,
    loading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refreshCustomers: loadCustomers,
  };
}
