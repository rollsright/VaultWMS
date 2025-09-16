import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { ApiResponse } from '../types';

const router = Router();

// Helper function to get default tenant ID
async function getDefaultTenant(): Promise<string> {
  const { data: tenants, error } = await supabaseAdmin
    .from('tenants')
    .select('id')
    .limit(1)
    .single();

  if (error || !tenants) {
    throw new Error('No default tenant found');
  }

  return tenants.id;
}

// Helper function to map database role to frontend role
function mapDatabaseRoleToFrontend(dbRole: string): string {
  const roleMap: Record<string, string> = {
    'admin': 'Tenant Super Admin',
    'manager': 'Warehouse Manager',
    'operator': 'Staff User',
    'viewer': 'Customer User'
  };
  return roleMap[dbRole] || 'Staff User';
}

// Helper function to map frontend role to database role
function mapFrontendRoleToDatabase(frontendRole: string): string {
  const roleMap: Record<string, string> = {
    'Tenant Super Admin': 'admin',
    'Warehouse Manager': 'manager', 
    'Staff User': 'operator',
    'Customer Admin': 'operator',
    'Customer User': 'viewer'
  };
  return roleMap[frontendRole] || 'operator';
}

// Helper function to determine user type from role
function getUserTypeFromRole(role: string): string {
  const customerRoles = ['Customer Admin', 'Customer User'];
  return customerRoles.includes(role) ? 'customer' : 'system';
}

// Helper function to format user data for frontend
function formatUserForFrontend(dbUser: any) {
  const frontendRole = mapDatabaseRoleToFrontend(dbUser.role);
  return {
    id: dbUser.id,
    username: `${dbUser.first_name.toLowerCase()}.${dbUser.last_name.toLowerCase()}`,
    email: dbUser.email,
    first_name: dbUser.first_name,
    last_name: dbUser.last_name,
    role: frontendRole,
    user_type: getUserTypeFromRole(frontendRole),
    status: dbUser.is_active ? 'active' : 'inactive',
    is_active: dbUser.is_active,
    last_login: dbUser.last_login_at,
    created_at: dbUser.created_at,
    updated_at: dbUser.updated_at
  };
}

// GET /api/users - Get all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const { user_type } = req.query;
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Build query
    let query = supabaseAdmin
      .from('users')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });
    
    // Filter by user_type if provided (map to database roles)
    if (user_type) {
      if (user_type === 'system') {
        query = query.in('role', ['admin', 'manager', 'operator']);
      } else if (user_type === 'customer') {
        query = query.eq('role', 'viewer');
      }
    }
    
    const { data: users, error } = await query;
    
    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch users'
      } as ApiResponse);
    }
    
    // Format users for frontend
    const formattedUsers = users?.map(formatUserForFrontend) || [];
    
    res.json({
      success: true,
      data: formattedUsers,
      message: 'Users retrieved successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// GET /api/users/stats - Get user statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Get user counts
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('role, is_active')
      .eq('tenant_id', tenantId);
    
    if (error) {
      console.error('Error fetching user stats:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch user statistics'
      } as ApiResponse);
    }
    
    const totalUsers = users?.length || 0;
    const activeUsers = users?.filter(u => u.is_active).length || 0;
    const inactiveUsers = totalUsers - activeUsers;
    const administrators = users?.filter(u => u.role === 'admin').length || 0;
    const systemUsers = users?.filter(u => ['admin', 'manager', 'operator'].includes(u.role)).length || 0;
    const customerUsers = users?.filter(u => u.role === 'viewer').length || 0;
    
    const stats = {
      totalUsers,
      activeUsers,
      inactiveUsers,
      administrators,
      systemUsers,
      customerUsers
    };
    
    res.json({
      success: true,
      data: stats,
      message: 'User statistics retrieved successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// POST /api/users - Create a new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      email,
      first_name,
      last_name,
      role,
      status = 'active',
      is_active = true
    } = req.body;
    
    // Validate required fields
    if (!email || !first_name || !last_name || !role) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: email, first_name, last_name, role'
      } as ApiResponse);
    }
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Map frontend role to database role
    const dbRole = mapFrontendRoleToDatabase(role);
    
    // Create user record
    const now = new Date().toISOString();
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        tenant_id: tenantId,
        email,
        first_name,
        last_name,
        role: dbRole,
        is_active: status === 'active' ? is_active : false,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create user'
      } as ApiResponse);
    }
    
    // Format user for frontend
    const formattedUser = formatUserForFrontend(user);
    
    res.status(201).json({
      success: true,
      data: formattedUser,
      message: 'User created successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// PUT /api/users/:id - Update a user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Build update object, mapping frontend role to database role if needed
    const updateFields: any = {
      updated_at: new Date().toISOString()
    };
    
    if (updateData.email) updateFields.email = updateData.email;
    if (updateData.first_name) updateFields.first_name = updateData.first_name;
    if (updateData.last_name) updateFields.last_name = updateData.last_name;
    if (updateData.role) updateFields.role = mapFrontendRoleToDatabase(updateData.role);
    if (updateData.status) updateFields.is_active = updateData.status === 'active';
    if (typeof updateData.is_active === 'boolean') updateFields.is_active = updateData.is_active;
    
    // Update user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update(updateFields)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update user'
      } as ApiResponse);
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse);
    }
    
    // Format user for frontend
    const formattedUser = formatUserForFrontend(user);
    
    res.json({
      success: true,
      data: formattedUser,
      message: 'User updated successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// DELETE /api/users/:id - Delete a user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Delete user
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);
    
    if (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete user'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

export default router;
