import { useState, useEffect } from 'react';
import { Warehouse, CreateWarehouseRequest, UpdateWarehouseRequest, WarehouseSummary } from '../types/warehouse';
import { apiClient } from '../lib/api';

// Mock data for development - will be replaced with API calls
const mockWarehouses: Warehouse[] = [
  {
    id: '1',
    name: 'Delta Warehouse2',
    code: 'Delta2',
    location: 'Delta, BC',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Delta Warehouse',
    code: 'Delta',
    location: 'Delta, BC',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Coquitlam Test-01',
    code: 'CQ-TEST',
    location: 'Vancouver, BC',
    status: 'inactive',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'East Vancouver Test',
    code: 'EVT-01',
    location: 'Vancouver, BC',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'United',
    code: 'UN-01',
    location: 'Coquitlam, BC',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export function useWarehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [summary, setSummary] = useState<WarehouseSummary>({
    totalWarehouses: 0,
    activeWarehouses: 0,
    inactiveWarehouses: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWarehouses();
    loadSummary();
  }, []);

  const loadWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getWarehouses();
      
      if (response.success && response.data) {
        setWarehouses(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch warehouses');
      }
    } catch (err) {
      console.error('Failed to load warehouses:', err);
      setError(err instanceof Error ? err.message : 'Failed to load warehouses');
      // Fallback to mock data in case of error
      setWarehouses(mockWarehouses);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const response = await apiClient.getWarehouseStats();
      
      if (response.success && response.data) {
        setSummary(response.data);
      }
    } catch (err) {
      console.error('Failed to load warehouse stats:', err);
      // Calculate from mock data or current warehouses
      const totalWarehouses = warehouses.length;
      const activeWarehouses = warehouses.filter(w => w.status === 'active').length;
      setSummary({
        totalWarehouses,
        activeWarehouses,
        inactiveWarehouses: totalWarehouses - activeWarehouses
      });
    }
  };

  const createWarehouse = async (warehouseData: CreateWarehouseRequest) => {
    try {
      setError(null);
      
      const response = await apiClient.createWarehouse(warehouseData);
      
      if (response.success) {
        await loadWarehouses();
        await loadSummary();
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create warehouse');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create warehouse';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateWarehouse = async (id: string, warehouseData: UpdateWarehouseRequest) => {
    try {
      setError(null);
      
      const response = await apiClient.updateWarehouse(id, warehouseData);
      
      if (response.success) {
        await loadWarehouses();
        await loadSummary();
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update warehouse');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update warehouse';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteWarehouse = async (id: string) => {
    try {
      setError(null);
      
      const response = await apiClient.deleteWarehouse(id);
      
      if (response.success) {
        await loadWarehouses();
        await loadSummary();
      } else {
        throw new Error(response.error || 'Failed to delete warehouse');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete warehouse';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    warehouses,
    summary,
    loading,
    error,
    refreshWarehouses: loadWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
  };
}
