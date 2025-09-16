import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { authenticateUser } from '../middleware/auth';
import { supabaseAdmin } from '../config/supabase';
import { ApiResponse } from '../types';

const router = express.Router();

// Helper function to get default tenant ID
async function getDefaultTenant(): Promise<string> {
  const { data: tenants, error } = await supabaseAdmin
    .from('tenants')
    .select('id')
    .limit(1);
  
  if (error || !tenants?.length) {
    throw new Error('No tenant found');
  }
  
  return tenants[0].id;
}

// Helper function to format warehouse for frontend
function formatWarehouseForFrontend(dbWarehouse: any) {
  return {
    id: dbWarehouse.id,
    name: dbWarehouse.name,
    code: dbWarehouse.warehouse_code,
    location: dbWarehouse.address ? `${dbWarehouse.address.city || ''}, ${dbWarehouse.address.state || ''}`.trim().replace(/^,\s*/, '') : '',
    status: dbWarehouse.is_active ? 'active' : 'inactive',
    description: dbWarehouse.description,
    manager_name: dbWarehouse.manager_name,
    manager_email: dbWarehouse.manager_email,
    manager_phone: dbWarehouse.manager_phone,
    total_capacity: dbWarehouse.total_capacity,
    capacity_unit: dbWarehouse.capacity_unit,
    timezone: dbWarehouse.timezone,
    operating_hours: dbWarehouse.operating_hours,
    address: dbWarehouse.address,
    created_at: dbWarehouse.created_at,
    updated_at: dbWarehouse.updated_at
  };
}

// GET /api/warehouses - Get all warehouses
router.get('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    const { data: warehouses, error } = await supabaseAdmin
      .from('warehouses')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching warehouses:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch warehouses'
      } as ApiResponse);
    }
    
    // Format warehouses for frontend
    const formattedWarehouses = warehouses?.map(formatWarehouseForFrontend) || [];
    
    res.json({
      success: true,
      data: formattedWarehouses,
      message: 'Warehouses retrieved successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Get warehouses error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// GET /api/warehouses/stats - Get warehouse statistics
router.get('/stats', authenticateUser, async (req: Request, res: Response) => {
  try {
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    const { data: warehouses, error } = await supabaseAdmin
      .from('warehouses')
      .select('id, is_active')
      .eq('tenant_id', tenantId);
    
    if (error) {
      console.error('Error fetching warehouse stats:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch warehouse statistics'
      } as ApiResponse);
    }
    
    const stats = {
      totalWarehouses: warehouses?.length || 0,
      activeWarehouses: warehouses?.filter(w => w.is_active).length || 0,
      inactiveWarehouses: warehouses?.filter(w => !w.is_active).length || 0,
    };
    
    res.json({
      success: true,
      data: stats,
      message: 'Warehouse statistics retrieved successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Get warehouse stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// POST /api/warehouses - Create a new warehouse
router.post('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const {
      name,
      warehouse_code,
      description,
      address,
      manager_name,
      manager_email,
      manager_phone,
      operating_hours,
      timezone,
      total_capacity,
      capacity_unit,
      is_active = true
    } = req.body;
    
    // Validate required fields
    if (!name || !warehouse_code) {
      return res.status(400).json({
        success: false,
        error: 'Name and warehouse code are required'
      } as ApiResponse);
    }
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Check if warehouse code already exists for this tenant
    const { data: existingWarehouse } = await supabaseAdmin
      .from('warehouses')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('warehouse_code', warehouse_code)
      .single();
    
    if (existingWarehouse) {
      return res.status(400).json({
        success: false,
        error: 'Warehouse code already exists'
      } as ApiResponse);
    }
    
    // Create warehouse
    const now = new Date().toISOString();
    const { data: warehouse, error } = await supabaseAdmin
      .from('warehouses')
      .insert({
        id: crypto.randomUUID(),
        tenant_id: tenantId,
        name,
        warehouse_code,
        description,
        address: address || {},
        manager_name,
        manager_email,
        manager_phone,
        operating_hours: operating_hours || {},
        timezone: timezone || 'UTC',
        total_capacity,
        capacity_unit: capacity_unit || 'square_feet',
        is_active,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating warehouse:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create warehouse'
      } as ApiResponse);
    }
    
    res.status(201).json({
      success: true,
      data: formatWarehouseForFrontend(warehouse),
      message: 'Warehouse created successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Create warehouse error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// PUT /api/warehouses/:id - Update a warehouse
router.put('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      warehouse_code,
      description,
      address,
      manager_name,
      manager_email,
      manager_phone,
      operating_hours,
      timezone,
      total_capacity,
      capacity_unit,
      is_active
    } = req.body;
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Check if warehouse exists and belongs to tenant
    const { data: existingWarehouse } = await supabaseAdmin
      .from('warehouses')
      .select('id')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();
    
    if (!existingWarehouse) {
      return res.status(404).json({
        success: false,
        error: 'Warehouse not found'
      } as ApiResponse);
    }
    
    // If updating warehouse code, check for duplicates
    if (warehouse_code) {
      const { data: duplicateWarehouse } = await supabaseAdmin
        .from('warehouses')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('warehouse_code', warehouse_code)
        .neq('id', id)
        .single();
      
      if (duplicateWarehouse) {
        return res.status(400).json({
          success: false,
          error: 'Warehouse code already exists'
        } as ApiResponse);
      }
    }
    
    // Update warehouse
    const { data: warehouse, error } = await supabaseAdmin
      .from('warehouses')
      .update({
        ...(name && { name }),
        ...(warehouse_code && { warehouse_code }),
        ...(description !== undefined && { description }),
        ...(address && { address }),
        ...(manager_name !== undefined && { manager_name }),
        ...(manager_email !== undefined && { manager_email }),
        ...(manager_phone !== undefined && { manager_phone }),
        ...(operating_hours && { operating_hours }),
        ...(timezone && { timezone }),
        ...(total_capacity !== undefined && { total_capacity }),
        ...(capacity_unit && { capacity_unit }),
        ...(is_active !== undefined && { is_active }),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating warehouse:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update warehouse'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      data: formatWarehouseForFrontend(warehouse),
      message: 'Warehouse updated successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Update warehouse error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// DELETE /api/warehouses/:id - Delete a warehouse
router.delete('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Check if warehouse exists and belongs to tenant
    const { data: existingWarehouse } = await supabaseAdmin
      .from('warehouses')
      .select('id')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();
    
    if (!existingWarehouse) {
      return res.status(404).json({
        success: false,
        error: 'Warehouse not found'
      } as ApiResponse);
    }
    
    // Check if warehouse has associated doors, zones, or locations
    const { data: doors } = await supabaseAdmin
      .from('doors')
      .select('id')
      .eq('warehouse_id', id)
      .limit(1);
    
    if (doors && doors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete warehouse with associated doors. Please delete all doors first.'
      } as ApiResponse);
    }
    
    // Delete warehouse
    const { error } = await supabaseAdmin
      .from('warehouses')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);
    
    if (error) {
      console.error('Error deleting warehouse:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete warehouse'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      message: 'Warehouse deleted successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Delete warehouse error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

export default router;
