import { useState, useEffect } from 'react';
import { Zone, CreateZoneRequest, UpdateZoneRequest, ZoneSummary } from '../types/zone';
import { apiClient } from '../lib/api';

// Mock data for development - will be replaced with API calls
const mockZones: Zone[] = [];

export function useZones(warehouseId?: string) {
  const [zones, setZones] = useState<Zone[]>([]);
  const [summary, setSummary] = useState<ZoneSummary>({
    totalZones: 0,
    activeZones: 0,
    inactiveZones: 0,
    storageZones: 0,
    receivingZones: 0,
    shippingZones: 0,
    stagingZones: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadZones();
    loadSummary();
  }, [warehouseId]);

  const loadZones = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = warehouseId ? { warehouse_id: warehouseId } : undefined;
      const response = await apiClient.getZones(params);
      
      if (response.success && response.data) {
        setZones(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch zones');
      }
    } catch (err) {
      console.error('Failed to load zones:', err);
      setError(err instanceof Error ? err.message : 'Failed to load zones');
      // Fallback to mock data in case of error
      setZones(mockZones);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const params = warehouseId ? { warehouse_id: warehouseId } : undefined;
      const response = await apiClient.getZoneStats(params);
      
      if (response.success && response.data) {
        setSummary(response.data);
      }
    } catch (err) {
      console.error('Failed to load zone stats:', err);
      // Calculate from current zones
      const totalZones = zones.length;
      const activeZones = zones.filter(z => z.status === 'active').length;
      const storageZones = zones.filter(z => z.type === 'storage').length;
      const receivingZones = zones.filter(z => z.type === 'receiving').length;
      const shippingZones = zones.filter(z => z.type === 'shipping').length;
      const stagingZones = zones.filter(z => z.type === 'staging').length;
      
      setSummary({
        totalZones,
        activeZones,
        inactiveZones: totalZones - activeZones,
        storageZones,
        receivingZones,
        shippingZones,
        stagingZones
      });
    }
  };

  const createZone = async (zoneData: CreateZoneRequest) => {
    try {
      setError(null);
      
      const response = await apiClient.createZone(zoneData);
      
      if (response.success) {
        await loadZones();
        await loadSummary();
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create zone');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create zone';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateZone = async (id: string, zoneData: UpdateZoneRequest) => {
    try {
      setError(null);
      
      const response = await apiClient.updateZone(id, zoneData);
      
      if (response.success) {
        await loadZones();
        await loadSummary();
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update zone');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update zone';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteZone = async (id: string) => {
    try {
      setError(null);
      
      const response = await apiClient.deleteZone(id);
      
      if (response.success) {
        await loadZones();
        await loadSummary();
      } else {
        throw new Error(response.error || 'Failed to delete zone');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete zone';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    zones,
    summary,
    loading,
    error,
    refreshZones: loadZones,
    createZone,
    updateZone,
    deleteZone,
  };
}
