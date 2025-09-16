export interface Customer {
  id: string;
  customer_code: string;
  name: string;
  email?: string;
  location?: string;
  status: 'active' | 'inactive';
  contact_name?: string;
  contact_phone?: string;
  billing_address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  shipping_address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  payment_terms?: string;
  credit_limit?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerSummary {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  thisMonth: number;
}

export interface CreateCustomerRequest {
  customer_code: string;
  name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  billing_address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  shipping_address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  payment_terms?: string;
  credit_limit?: number;
  notes?: string;
  is_active?: boolean;
}

export interface UpdateCustomerRequest {
  customer_code?: string;
  name?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  billing_address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  shipping_address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  payment_terms?: string;
  credit_limit?: number;
  notes?: string;
  is_active?: boolean;
}
