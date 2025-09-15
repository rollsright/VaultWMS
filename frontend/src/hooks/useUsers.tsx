import { useState, useEffect } from 'react';
import { User, UserSummary, CreateUserRequest, UpdateUserRequest, UserType } from '../types/user';

// Mock data for development - will be replaced with API calls
const mockUsers: User[] = [
  {
    id: '1',
    username: 'ale',
    email: 'ale@test.com',
    first_name: 'Alejandra',
    last_name: 'Test',
    role: 'Tenant Super Admin',
    user_type: 'system',
    status: 'active',
    is_active: true,
    last_login: '2025-06-20T10:30:00Z',
    created_at: '2025-06-25T00:00:00Z',
    updated_at: '2025-06-25T00:00:00Z',
  },
  {
    id: '2',
    username: 'aleja',
    email: 'aleja@test.com',
    first_name: 'Alejandra',
    last_name: 'Test',
    role: 'Staff User',
    user_type: 'system',
    status: 'active',
    is_active: true,
    last_login: '2025-06-15T14:22:00Z',
    created_at: '2025-06-10T00:00:00Z',
    updated_at: '2025-06-10T00:00:00Z',
  },
  {
    id: '3',
    username: 'john.smith',
    email: 'john.smith@testcustomer.ca',
    first_name: 'John',
    last_name: 'Smith',
    role: 'Customer Admin',
    user_type: 'customer',
    status: 'active',
    is_active: true,
    customer_id: '1',
    customer_name: 'Test Customer',
    last_login: '2025-06-22T09:15:00Z',
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
  {
    id: '4',
    username: 'sarah.johnson',
    email: 'sarah.johnson@testcustomer.ca',
    first_name: 'Sarah',
    last_name: 'Johnson',
    role: 'Customer User',
    user_type: 'customer',
    status: 'active',
    is_active: true,
    customer_id: '1',
    customer_name: 'Test Customer',
    last_login: '2025-06-18T16:45:00Z',
    created_at: '2025-02-01T00:00:00Z',
    updated_at: '2025-02-01T00:00:00Z',
  },
  {
    id: '5',
    username: 'mike.chen',
    email: 'mike.chen@georgechen.ca',
    first_name: 'Michael',
    last_name: 'Chen',
    role: 'Customer Admin',
    user_type: 'customer',
    status: 'active',
    is_active: true,
    customer_id: '2',
    customer_name: 'George Chen Ltd.',
    last_login: '2025-06-21T11:30:00Z',
    created_at: '2025-01-20T00:00:00Z',
    updated_at: '2025-01-20T00:00:00Z',
  },
  {
    id: '6',
    username: 'warehouse.manager',
    email: 'wm@company.com',
    first_name: 'David',
    last_name: 'Wilson',
    role: 'Warehouse Manager',
    user_type: 'system',
    status: 'active',
    is_active: true,
    last_login: '2025-06-19T08:00:00Z',
    created_at: '2025-03-01T00:00:00Z',
    updated_at: '2025-03-01T00:00:00Z',
  },
  {
    id: '7',
    username: 'emily.davis',
    email: 'emily.davis@testing.com',
    first_name: 'Emily',
    last_name: 'Davis',
    role: 'Customer User',
    user_type: 'customer',
    status: 'active',
    is_active: true,
    customer_id: '3',
    customer_name: 'Testing Inc.',
    last_login: '2025-06-17T13:20:00Z',
    created_at: '2025-02-15T00:00:00Z',
    updated_at: '2025-02-15T00:00:00Z',
  },
  {
    id: '8',
    username: 'admin.staff',
    email: 'admin@rollsright.com',
    first_name: 'Admin',
    last_name: 'Staff',
    role: 'Staff User',
    user_type: 'system',
    status: 'active',
    is_active: true,
    last_login: '2025-06-23T07:30:00Z',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
];

export function useUsers(userType?: UserType) {
  const [users, setUsers] = useState<User[]>([]);
  const [summary, setSummary] = useState<UserSummary>({ 
    totalUsers: 0, 
    activeUsers: 0, 
    inactiveUsers: 0, 
    administrators: 0,
    systemUsers: 0,
    customerUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load users on mount or when userType changes
  useEffect(() => {
    loadUsers(userType);
  }, [userType]);

  const loadUsers = async (typeFilter?: UserType) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter users by type if specified
      let filteredUsers = mockUsers;
      if (typeFilter) {
        filteredUsers = mockUsers.filter(user => user.user_type === typeFilter);
      }
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request('/users', {
      //   params: { user_type: typeFilter }
      // });
      // setUsers(response.data);
      
      setUsers(filteredUsers);
      calculateSummary(filteredUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (usersList: User[]) => {
    setSummary({
      totalUsers: usersList.length,
      activeUsers: usersList.filter(user => user.status === 'active').length,
      inactiveUsers: usersList.filter(user => user.status === 'inactive').length,
      administrators: usersList.filter(user => 
        user.role === 'Tenant Super Admin' || 
        user.role === 'Customer Admin' || 
        user.role === 'Warehouse Manager'
      ).length,
      systemUsers: usersList.filter(user => user.user_type === 'system').length,
      customerUsers: usersList.filter(user => user.user_type === 'customer').length,
    });
  };

  const createUser = async (userData: CreateUserRequest): Promise<User> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request('/users', {
      //   method: 'POST',
      //   body: JSON.stringify(userData),
      // });
      
      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        status: userData.status || 'active',
        is_active: userData.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setUsers(prev => [...prev, newUser]);
      calculateSummary([...users, newUser]);
      
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    }
  };

  const updateUser = async (id: string, userData: UpdateUserRequest): Promise<User> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request(`/users/${id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(userData),
      // });
      
      const oldUser = users.find(user => user.id === id)!;
      const updatedUser: User = {
        ...oldUser,
        ...userData,
        updated_at: new Date().toISOString(),
      };
      
      const updatedUsers = users.map(user => user.id === id ? updatedUser : user);
      setUsers(updatedUsers);
      calculateSummary(updatedUsers);
      
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // await apiClient.request(`/users/${id}`, {
      //   method: 'DELETE',
      // });
      
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      calculateSummary(updatedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      throw err;
    }
  };

  return {
    users,
    summary,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers: () => loadUsers(userType),
  };
}
