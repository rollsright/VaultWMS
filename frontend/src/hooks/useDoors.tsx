import { useState, useEffect } from 'react';
import { Door, DoorSummary, CreateDoorRequest, UpdateDoorRequest } from '../types/door';
import { apiClient } from '../lib/api';

// Mock data for development - will be replaced with API calls
const mockDoors: Door[] = [
  {
    id: '1',
    warehouse_id: '1',
    door_number: 'D001',
    name: 'Dock Door 1',
    type: 'inbound',
    status: 'active',
    is_active: true,
    description: 'Primary inbound receiving door',
    location: 'North Side',
    dimensions: { width: 8, height: 9 },
    equipment: ['Loading Dock Leveler', 'Dock Seal'],
    capacity: 5000,
    created_at: '2025-01-10T00:00:00Z',
    updated_at: '2025-01-10T00:00:00Z',
  },
  {
    id: '2',
    warehouse_id: '1',
    door_number: 'D002',
    name: 'Dock Door 2',
    type: 'inbound',
    status: 'active',
    is_active: true,
    description: 'Secondary inbound door',
    location: 'North Side',
    dimensions: { width: 8, height: 9 },
    equipment: ['Loading Dock Leveler'],
    capacity: 4000,
    created_at: '2025-01-10T00:00:00Z',
    updated_at: '2025-01-10T00:00:00Z',
  },
  {
    id: '3',
    warehouse_id: '1',
    door_number: 'D003',
    name: 'Shipping Door 1',
    type: 'outbound',
    status: 'active',
    is_active: true,
    description: 'Primary outbound shipping door',
    location: 'South Side',
    dimensions: { width: 8, height: 9 },
    equipment: ['Loading Dock Leveler', 'Dock Seal', 'Truck Restraint'],
    capacity: 6000,
    created_at: '2025-01-12T00:00:00Z',
    updated_at: '2025-01-12T00:00:00Z',
  },
  {
    id: '4',
    warehouse_id: '2',
    door_number: 'D001',
    name: 'Delta Main Door',
    type: 'inbound',
    status: 'active',
    is_active: true,
    description: 'Main receiving door for Delta warehouse',
    location: 'East Side',
    dimensions: { width: 10, height: 10 },
    equipment: ['Loading Dock Leveler', 'Dock Seal', 'Hydraulic Lift'],
    capacity: 8000,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
  {
    id: '5',
    warehouse_id: '2',
    door_number: 'D002',
    name: 'Delta Shipping Door',
    type: 'outbound',
    status: 'active',
    is_active: true,
    description: 'Primary shipping door for Delta warehouse',
    location: 'West Side',
    dimensions: { width: 9, height: 9 },
    equipment: ['Loading Dock Leveler', 'Vehicle Restraint'],
    capacity: 7000,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
  {
    id: '6',
    warehouse_id: '4',
    door_number: 'D001',
    name: 'East Van Door 1',
    type: 'staging',
    status: 'inactive',
    is_active: false,
    description: 'Staging area door - under maintenance',
    location: 'Center',
    dimensions: { width: 6, height: 8 },
    equipment: ['Manual Dock Plate'],
    capacity: 2000,
    created_at: '2025-01-20T00:00:00Z',
    updated_at: '2025-01-20T00:00:00Z',
  },
];

export function useDoors(warehouseId?: string) {
  const [doors, setDoors] = useState<Door[]>([]);
  const [summary, setSummary] = useState<DoorSummary>({ totalDoors: 0, inboundDoors: 0, outboundDoors: 0, activeDoors: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load doors on mount or when warehouseId changes
  useEffect(() => {
    if (warehouseId && warehouseId !== 'all') {
      loadDoors(warehouseId);
    } else if (warehouseId === 'all') {
      loadAllDoors();
    } else {
      setDoors([]);
      setSummary({ totalDoors: 0, inboundDoors: 0, outboundDoors: 0, activeDoors: 0 });
      setLoading(false);
    }
  }, [warehouseId]);

  const loadDoors = async (warehouseIdFilter?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const [doorsResponse, statsResponse] = await Promise.all([
        warehouseIdFilter ? apiClient.getDoors({ warehouse_id: warehouseIdFilter }) : apiClient.getDoors(),
        apiClient.getDoorStats()
      ]);
      
      if (doorsResponse.success && doorsResponse.data) {
        setDoors(doorsResponse.data);
        calculateSummary(doorsResponse.data);
      } else {
        throw new Error(doorsResponse.error || 'Failed to fetch doors');
      }
      
      if (statsResponse.success && statsResponse.data) {
        setSummary(statsResponse.data);
      }
    } catch (err) {
      console.error('Failed to load doors:', err);
      setError(err instanceof Error ? err.message : 'Failed to load doors');
      // Fallback to mock data in case of error
      const filteredDoors = warehouseIdFilter 
        ? mockDoors.filter(door => door.warehouse_id === warehouseIdFilter)
        : mockDoors;
      setDoors(filteredDoors);
      calculateSummary(filteredDoors);
    } finally {
      setLoading(false);
    }
  };

  const loadAllDoors = async () => {
    await loadDoors();
  };

  const calculateSummary = (doorsList: Door[]) => {
    setSummary({
      totalDoors: doorsList.length,
      inboundDoors: doorsList.filter(door => door.type === 'inbound').length,
      outboundDoors: doorsList.filter(door => door.type === 'outbound').length,
      activeDoors: doorsList.filter(door => door.status === 'active').length,
    });
  };

  const createDoor = async (doorData: CreateDoorRequest): Promise<Door> => {
    try {
      setError(null);
      
      const response = await apiClient.createDoor(doorData);
      
      if (response.success && response.data) {
        const newDoor = response.data;
        setDoors(prev => [...prev, newDoor]);
        calculateSummary([...doors, newDoor]);
        
        return newDoor;
      } else {
        throw new Error(response.error || 'Failed to create door');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create door');
      throw err;
    }
  };

  const updateDoor = async (id: string, doorData: UpdateDoorRequest): Promise<Door> => {
    try {
      setError(null);
      
      const response = await apiClient.updateDoor(id, doorData);
      
      if (response.success && response.data) {
        const updatedDoor = response.data;
        const updatedDoors = doors.map(door => door.id === id ? updatedDoor : door);
        setDoors(updatedDoors);
        calculateSummary(updatedDoors);
        
        return updatedDoor;
      } else {
        throw new Error(response.error || 'Failed to update door');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update door');
      throw err;
    }
  };

  const deleteDoor = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      const response = await apiClient.deleteDoor(id);
      
      if (response.success) {
        const updatedDoors = doors.filter(door => door.id !== id);
        setDoors(updatedDoors);
        calculateSummary(updatedDoors);
      } else {
        throw new Error(response.error || 'Failed to delete door');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete door');
      throw err;
    }
  };

  return {
    doors,
    summary,
    loading,
    error,
    createDoor,
    updateDoor,
    deleteDoor,
    refreshDoors: () => warehouseId === 'all' ? loadAllDoors() : warehouseId && loadDoors(warehouseId),
  };
}
