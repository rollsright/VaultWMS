export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: string;
  status: 'active' | 'inactive';
  description?: string;
  manager_name?: string;
  manager_email?: string;
  manager_phone?: string;
  total_capacity?: number;
  capacity_unit?: string;
  timezone?: string;
  operating_hours?: any;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateWarehouseRequest {
  name: string;
  warehouse_code: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  manager_name?: string;
  manager_email?: string;
  manager_phone?: string;
  operating_hours?: any;
  timezone?: string;
  total_capacity?: number;
  capacity_unit?: string;
  is_active?: boolean;
}

export interface UpdateWarehouseRequest {
  name?: string;
  warehouse_code?: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  manager_name?: string;
  manager_email?: string;
  manager_phone?: string;
  operating_hours?: any;
  timezone?: string;
  total_capacity?: number;
  capacity_unit?: string;
  is_active?: boolean;
}

export interface WarehouseSummary {
  totalWarehouses: number;
  activeWarehouses: number;
  inactiveWarehouses: number;
}
