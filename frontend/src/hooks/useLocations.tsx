import { useState, useEffect } from 'react';
import { Location, CreateLocationRequest, UpdateLocationRequest, LocationSummary } from '../types/location';
import { apiClient } from '../lib/api';

// Mock data for development - will be replaced with API calls
const mockLocations: Location[] = [];

export function useLocations(warehouseId?: string, zoneId?: string) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [summary, setSummary] = useState<LocationSummary>({
    totalLocations: 0,
    activeLocations: 0,
    inactiveLocations: 0,
    pickableLocations: 0,
    bulkLocations: 0,
    floorLocations: 0,
    rackLocations: 0,
    shelfLocations: 0,
    binLocations: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLocations();
    loadSummary();
  }, [warehouseId, zoneId]);

  const loadLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: { warehouse_id?: string; zone_id?: string } = {};
      if (warehouseId) params.warehouse_id = warehouseId;
      if (zoneId) params.zone_id = zoneId;
      
      const response = await apiClient.getLocations(Object.keys(params).length > 0 ? params : undefined);
      
      if (response.success && response.data) {
        setLocations(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch locations');
      }
    } catch (err) {
      console.error('Failed to load locations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load locations');
      // Fallback to mock data in case of error
      setLocations(mockLocations);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const params: { warehouse_id?: string; zone_id?: string } = {};
      if (warehouseId) params.warehouse_id = warehouseId;
      if (zoneId) params.zone_id = zoneId;
      
      const response = await apiClient.getLocationStats(Object.keys(params).length > 0 ? params : undefined);
      
      if (response.success && response.data) {
        setSummary(response.data);
      }
    } catch (err) {
      console.error('Failed to load location stats:', err);
      // Calculate from current locations
      const totalLocations = locations.length;
      const activeLocations = locations.filter(l => l.status === 'active').length;
      const pickableLocations = locations.filter(l => l.is_pickable).length;
      const bulkLocations = locations.filter(l => l.is_bulk_location).length;
      const floorLocations = locations.filter(l => l.type === 'floor').length;
      const rackLocations = locations.filter(l => l.type === 'rack').length;
      const shelfLocations = locations.filter(l => l.type === 'shelf').length;
      const binLocations = locations.filter(l => l.type === 'bin').length;
      
      setSummary({
        totalLocations,
        activeLocations,
        inactiveLocations: totalLocations - activeLocations,
        pickableLocations,
        bulkLocations,
        floorLocations,
        rackLocations,
        shelfLocations,
        binLocations
      });
    }
  };

  const createLocation = async (locationData: CreateLocationRequest) => {
    try {
      setError(null);
      
      const response = await apiClient.createLocation(locationData);
      
      if (response.success) {
        await loadLocations();
        await loadSummary();
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create location');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create location';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateLocation = async (id: string, locationData: UpdateLocationRequest) => {
    try {
      setError(null);
      
      const response = await apiClient.updateLocation(id, locationData);
      
      if (response.success) {
        await loadLocations();
        await loadSummary();
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update location');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update location';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      setError(null);
      
      const response = await apiClient.deleteLocation(id);
      
      if (response.success) {
        await loadLocations();
        await loadSummary();
      } else {
        throw new Error(response.error || 'Failed to delete location');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete location';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    locations,
    summary,
    loading,
    error,
    refreshLocations: loadLocations,
    createLocation,
    updateLocation,
    deleteLocation,
  };
}
