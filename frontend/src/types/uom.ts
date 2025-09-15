export interface UOM {
  id: string;
  name: string;
  code: string;
  type: 'COUNT' | 'WEIGHT' | 'VOLUME' | 'LENGTH';
  conversion_factor: number;
  base_unit?: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UOMSummary {
  totalUOMs: number;
  weightUOMs: number;
  volumeUOMs: number;
  lengthUOMs: number;
}

export interface CreateUOMRequest {
  name: string;
  code: string;
  type: 'COUNT' | 'WEIGHT' | 'VOLUME' | 'LENGTH';
  conversion_factor: number;
  base_unit?: boolean;
  is_active?: boolean;
}

export interface UpdateUOMRequest {
  name?: string;
  code?: string;
  type?: 'COUNT' | 'WEIGHT' | 'VOLUME' | 'LENGTH';
  conversion_factor?: number;
  base_unit?: boolean;
  is_active?: boolean;
}

export type UOMType = 'COUNT' | 'WEIGHT' | 'VOLUME' | 'LENGTH';

export const UOM_TYPE_COLORS = {
  COUNT: { bg: '#f3f4f6', text: '#6b7280' },
  WEIGHT: { bg: '#dbeafe', text: '#2563eb' },
  VOLUME: { bg: '#dcfce7', text: '#16a34a' },
  LENGTH: { bg: '#e9d5ff', text: '#9333ea' }
} as const;
