export type UserRole = 'Tenant Super Admin' | 'Staff User' | 'Customer Admin' | 'Customer User' | 'Warehouse Manager';
export type UserType = 'system' | 'customer';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  user_type: UserType;
  status: UserStatus;
  is_active: boolean;
  customer_id?: string;
  customer_name?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSummary {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  administrators: number;
  systemUsers: number;
  customerUsers: number;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  user_type: UserType;
  status?: UserStatus;
  is_active?: boolean;
  customer_id?: string;
  password?: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  user_type?: UserType;
  status?: UserStatus;
  is_active?: boolean;
  customer_id?: string;
}

export const ROLE_COLORS: Record<UserRole, { bg: string; text: string }> = {
  'Tenant Super Admin': { bg: '#dc2626', text: 'white' },
  'Staff User': { bg: '#16a34a', text: 'white' },
  'Customer Admin': { bg: '#2563eb', text: 'white' },
  'Customer User': { bg: '#7c3aed', text: 'white' },
  'Warehouse Manager': { bg: '#ea580c', text: 'white' },
};

export const USER_ROLES: UserRole[] = [
  'Tenant Super Admin',
  'Staff User', 
  'Customer Admin',
  'Customer User',
  'Warehouse Manager'
];
