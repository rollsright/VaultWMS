export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  title?: string;
  department?: string;
  is_primary: boolean;
  customer_id: string;
  notes?: string;
  status: 'active' | 'inactive';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactSummary {
  totalContacts: number;
  activeContacts: number;
  inactiveContacts: number;
  primaryContacts: number;
}

export interface CreateContactRequest {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  title?: string;
  department?: string;
  is_primary?: boolean;
  customer_id: string;
  notes?: string;
  status?: 'active' | 'inactive';
  is_active?: boolean;
}

export interface UpdateContactRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  title?: string;
  department?: string;
  is_primary?: boolean;
  notes?: string;
  status?: 'active' | 'inactive';
  is_active?: boolean;
}
