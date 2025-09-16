export type DoorType = 'inbound' | 'outbound' | 'staging';

export interface Door {
  id: string;
  warehouse_id: string;
  door_number: string;
  name: string;
  type: DoorType;
  status: 'active' | 'inactive';
  is_active: boolean;
  description?: string;
  location?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  equipment?: string[];
  capacity?: number;
  created_at: string;
  updated_at: string;
}

export interface DoorSummary {
  totalDoors: number;
  inboundDoors: number;
  outboundDoors: number;
  activeDoors: number;
}

export interface CreateDoorRequest {
  warehouse_id: string;
  door_number: string;
  name: string;
  type: DoorType;
  status?: 'active' | 'inactive';
  is_active?: boolean;
  description?: string;
  location?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  equipment?: string[];
  capacity?: number;
}

export interface UpdateDoorRequest {
  door_number?: string;
  name?: string;
  type?: DoorType;
  status?: 'active' | 'inactive';
  is_active?: boolean;
  description?: string;
  location?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  equipment?: string[];
  capacity?: number;
}

// Warehouse interface moved to ./warehouse.ts
