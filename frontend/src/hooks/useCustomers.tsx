import { useState, useEffect } from 'react';
import { Customer, CustomerSummary, CreateCustomerRequest, UpdateCustomerRequest } from '../types/customer';
import { apiClient } from '../lib/api';

// Mock data for development - will be replaced with API calls
const mockCustomers: Customer[] = [
  {
    id: '1',
    customer_code: 'CUST-001',
    name: 'Customer test',
    email: 'customer@mail.com',
    location: 'Vancouver',
    status: 'active',
    contact_name: 'John Doe',
    created_at: '2025-06-09T00:00:00Z',
    updated_at: '2025-06-09T00:00:00Z',
  },
  {
    id: '2',
    customer_code: 'CUST-002',
    name: 'George Chen',
    email: 'george.chen@rollsright.ca',
    location: 'North Vancouver',
    status: 'active',
    contact_name: 'George Chen',
    created_at: '2025-08-18T00:00:00Z',
    updated_at: '2025-08-18T00:00:00Z',
  },
  {
    id: '3',
    customer_code: 'CUST-003',
    name: 'Testing',
    email: 'testing@test.com',
    status: 'active',
    contact_name: 'Test User',
    created_at: '2025-06-23T00:00:00Z',
    updated_at: '2025-06-23T00:00:00Z',
  },
  {
    id: '4',
    customer_code: 'CUST-004',
    name: 'Testing Company',
    email: 'jane@test.com',
    status: 'active',
    contact_name: 'Jane Smith',
    created_at: '2025-06-25T00:00:00Z',
    updated_at: '2025-06-25T00:00:00Z',
  },
];

const mockSummary: CustomerSummary = {
  totalCustomers: 4,
  activeCustomers: 4,
  inactiveCustomers: 0,
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
      
      const [customersResponse, statsResponse] = await Promise.all([
        apiClient.getCustomers(),
        apiClient.getCustomerStats()
      ]);
      
      if (customersResponse.success && customersResponse.data) {
        setCustomers(customersResponse.data);
      } else {
        throw new Error(customersResponse.error || 'Failed to fetch customers');
      }
      
      if (statsResponse.success && statsResponse.data) {
        setSummary(statsResponse.data);
      } else {
        // Use fallback summary if stats fail
        const customersList = customersResponse.data || [];
        setSummary({
          totalCustomers: customersList.length,
          activeCustomers: customersList.filter((c: any) => c.status === 'active').length,
          thisMonth: 0,
        });
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load customers');
      // Fallback to mock data in case of error
      setCustomers(mockCustomers);
      setSummary(mockSummary);
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customerData: CreateCustomerRequest): Promise<Customer> => {
    try {
      setError(null);
      
      const response = await apiClient.createCustomer(customerData);
      
      if (response.success && response.data) {
        const newCustomer = response.data;
        setCustomers(prev => [...prev, newCustomer]);
        setSummary(prev => ({
          ...prev,
          totalCustomers: prev.totalCustomers + 1,
          activeCustomers: newCustomer.status !== 'inactive' ? prev.activeCustomers + 1 : prev.activeCustomers,
        }));
        
        return newCustomer;
      } else {
        throw new Error(response.error || 'Failed to create customer');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create customer');
      throw err;
    }
  };

  const updateCustomer = async (id: string, customerData: UpdateCustomerRequest): Promise<Customer> => {
    try {
      setError(null);
      
      const response = await apiClient.updateCustomer(id, customerData);
      
      if (response.success && response.data) {
        const updatedCustomer = response.data;
        setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
        
        return updatedCustomer;
      } else {
        throw new Error(response.error || 'Failed to update customer');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update customer');
      throw err;
    }
  };

  const deleteCustomer = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      const customer = customers.find(c => c.id === id);
      const response = await apiClient.deleteCustomer(id);
      
      if (response.success) {
        setCustomers(prev => prev.filter(c => c.id !== id));
        
        if (customer) {
          setSummary(prev => ({
            ...prev,
            totalCustomers: prev.totalCustomers - 1,
            activeCustomers: customer.status === 'active' ? prev.activeCustomers - 1 : prev.activeCustomers,
          }));
        }
      } else {
        throw new Error(response.error || 'Failed to delete customer');
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
