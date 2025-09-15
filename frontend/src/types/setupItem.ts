export interface SetupItem {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  category_id?: string;
  uom_id?: string;
  status: 'active' | 'inactive';
  customer_id: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SetupItemSummary {
  totalItems: number;
  activeItems: number;
  inactiveItems: number;
}

export interface CreateSetupItemRequest {
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  category_id?: string;
  uom_id?: string;
  status?: 'active' | 'inactive';
  customer_id: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  is_active?: boolean;
}

export interface UpdateSetupItemRequest {
  name?: string;
  description?: string;
  sku?: string;
  barcode?: string;
  category_id?: string;
  uom_id?: string;
  status?: 'active' | 'inactive';
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  is_active?: boolean;
}
