export interface Carrier {
  id: string;
  name: string;
  code: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  service_types: string[];
  tracking_url?: string;
  status: 'active' | 'inactive';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CarrierSummary {
  totalCarriers: number;
  activeCarriers: number;
  inactiveCarriers: number;
  totalServices: number;
}

export interface CreateCarrierRequest {
  name: string;
  code: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  service_types?: string[];
  tracking_url?: string;
  status?: 'active' | 'inactive';
  is_active?: boolean;
}

export interface UpdateCarrierRequest {
  name?: string;
  code?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  service_types?: string[];
  tracking_url?: string;
  status?: 'active' | 'inactive';
  is_active?: boolean;
}

export const COMMON_SERVICE_TYPES = [
  'Ground',
  'Express',
  'Overnight',
  'Two Day',
  'Weekend Only',
  'Same Day',
  'International',
  'Freight',
  'Standard',
  'Priority'
] as const;
