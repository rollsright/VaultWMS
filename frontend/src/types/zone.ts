export type ZoneType = 
  | 'receiving' 
  | 'staging' 
  | 'storage' 
  | 'picking' 
  | 'packing' 
  | 'shipping' 
  | 'quarantine' 
  | 'returns' 
  | 'cross_dock';

export interface Zone {
  id: string;
  warehouse_id: string;
  name: string;
  code: string;
  type: ZoneType;
  status: 'active' | 'inactive';
  description?: string;
  capacity?: number;
  capacity_unit?: string;
  temperature_controlled: boolean;
  temperature_min?: number;
  temperature_max?: number;
  humidity_controlled: boolean;
  humidity_min?: number;
  humidity_max?: number;
  restrictions?: any;
  created_at: string;
  updated_at: string;
}

export interface CreateZoneRequest {
  warehouse_id: string;
  name: string;
  zone_code: string;
  zone_type: ZoneType;
  description?: string;
  capacity?: number;
  capacity_unit?: string;
  temperature_controlled?: boolean;
  temperature_min?: number;
  temperature_max?: number;
  humidity_controlled?: boolean;
  humidity_min?: number;
  humidity_max?: number;
  restrictions?: any;
  is_active?: boolean;
}

export interface UpdateZoneRequest {
  name?: string;
  zone_code?: string;
  zone_type?: ZoneType;
  description?: string;
  capacity?: number;
  capacity_unit?: string;
  temperature_controlled?: boolean;
  temperature_min?: number;
  temperature_max?: number;
  humidity_controlled?: boolean;
  humidity_min?: number;
  humidity_max?: number;
  restrictions?: any;
  is_active?: boolean;
}

export interface ZoneSummary {
  totalZones: number;
  activeZones: number;
  inactiveZones: number;
  storageZones: number;
  receivingZones: number;
  shippingZones: number;
  stagingZones: number;
}
