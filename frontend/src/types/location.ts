export type LocationType = 
  | 'floor' 
  | 'rack' 
  | 'shelf' 
  | 'bin' 
  | 'dock' 
  | 'staging_area' 
  | 'bulk_area';

export interface Location {
  id: string;
  warehouse_id: string;
  zone_id?: string;
  code: string;
  name?: string;
  type: LocationType;
  status: 'active' | 'inactive';
  aisle?: string;
  bay?: string;
  level?: string;
  position?: string;
  coordinates?: {
    x?: number;
    y?: number;
    z?: number;
  };
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  capacity?: number;
  capacity_unit?: string;
  weight_limit?: number;
  weight_unit?: string;
  barcode?: string;
  qr_code?: string;
  picking_sequence?: number;
  is_pickable: boolean;
  is_bulk_location: boolean;
  restrictions?: any;
  created_at: string;
  updated_at: string;
}

export interface CreateLocationRequest {
  warehouse_id: string;
  zone_id?: string;
  location_code: string;
  name?: string;
  location_type: LocationType;
  aisle?: string;
  bay?: string;
  level?: string;
  position?: string;
  coordinates?: {
    x?: number;
    y?: number;
    z?: number;
  };
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  capacity?: number;
  capacity_unit?: string;
  weight_limit?: number;
  weight_unit?: string;
  barcode?: string;
  qr_code?: string;
  picking_sequence?: number;
  is_pickable?: boolean;
  is_bulk_location?: boolean;
  restrictions?: any;
  is_active?: boolean;
}

export interface UpdateLocationRequest {
  zone_id?: string;
  location_code?: string;
  name?: string;
  location_type?: LocationType;
  aisle?: string;
  bay?: string;
  level?: string;
  position?: string;
  coordinates?: {
    x?: number;
    y?: number;
    z?: number;
  };
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  capacity?: number;
  capacity_unit?: string;
  weight_limit?: number;
  weight_unit?: string;
  barcode?: string;
  qr_code?: string;
  picking_sequence?: number;
  is_pickable?: boolean;
  is_bulk_location?: boolean;
  restrictions?: any;
  is_active?: boolean;
}

export interface LocationSummary {
  totalLocations: number;
  activeLocations: number;
  inactiveLocations: number;
  pickableLocations: number;
  bulkLocations: number;
  floorLocations: number;
  rackLocations: number;
  shelfLocations: number;
  binLocations: number;
}
