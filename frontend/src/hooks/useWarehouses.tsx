import { useState, useEffect } from 'react';
import { Warehouse } from '../types/door';

// Mock data for development - will be replaced with API calls
const mockWarehouses: Warehouse[] = [
  {
    id: '1',
    name: 'Delta Warehouse2',
    code: 'Delta2',
    location: 'Delta, BC',
    status: 'active'
  },
  {
    id: '2',
    name: 'Delta Warehouse',
    code: 'Delta',
    location: 'Delta, BC',
    status: 'active'
  },
  {
    id: '3',
    name: 'Coquitlam Test-01',
    code: 'CQ-TEST',
    location: 'Vancouver, BC',
    status: 'inactive'
  },
  {
    id: '4',
    name: 'East Vancouver Test',
    code: 'EVT-01',
    location: 'Vancouver, BC',
    status: 'active'
  },
  {
    id: '5',
    name: 'United',
    code: 'UN-01',
    location: 'Coquitlam, BC',
    status: 'active'
  }
];

export function useWarehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request('/warehouses');
      // setWarehouses(response.data);
      
      setWarehouses(mockWarehouses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load warehouses');
    } finally {
      setLoading(false);
    }
  };

  return {
    warehouses,
    loading,
    error,
    refreshWarehouses: loadWarehouses,
  };
}
