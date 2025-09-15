export interface Customer {
  id: string;
  name: string;
  email: string;
  location?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CustomerSummary {
  totalCustomers: number;
  activeCustomers: number;
  thisMonth: number;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  location?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  location?: string;
  status?: 'active' | 'inactive';
}
