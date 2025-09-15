export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contact_person?: string;
  payment_terms?: string;
  status: 'active' | 'inactive';
  customer_id: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierSummary {
  totalSuppliers: number;
  activeSuppliers: number;
  thisMonth: number;
}

export interface CreateSupplierRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contact_person?: string;
  payment_terms?: string;
  status?: 'active' | 'inactive';
  customer_id: string;
}

export interface UpdateSupplierRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  contact_person?: string;
  payment_terms?: string;
  status?: 'active' | 'inactive';
}
