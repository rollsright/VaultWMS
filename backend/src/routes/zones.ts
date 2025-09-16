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

// Helper function to format zone for frontend
function formatZoneForFrontend(dbZone: any) {
  return {
    id: dbZone.id,
    warehouse_id: dbZone.warehouse_id,
    name: dbZone.name,
    code: dbZone.zone_code,
    type: dbZone.zone_type,
    status: dbZone.is_active ? 'active' : 'inactive',
    description: dbZone.description,
    capacity: dbZone.capacity,
    capacity_unit: dbZone.capacity_unit,
    temperature_controlled: dbZone.temperature_controlled,
    temperature_min: dbZone.temperature_min,
    temperature_max: dbZone.temperature_max,
    humidity_controlled: dbZone.humidity_controlled,
    humidity_min: dbZone.humidity_min,
    humidity_max: dbZone.humidity_max,
    restrictions: dbZone.restrictions,
    created_at: dbZone.created_at,
    updated_at: dbZone.updated_at
  };
}

// GET /api/zones - Get all zones (optionally filtered by warehouse)
router.get('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { warehouse_id } = req.query;
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Build query - zones belong to warehouses, which belong to tenants
    let query = supabaseAdmin
      .from('zones')
      .select(`
        *,
        warehouses!inner(tenant_id)
      `)
      .eq('warehouses.tenant_id', tenantId)
      .order('created_at', { ascending: false });
    
    // Filter by warehouse if provided
    if (warehouse_id) {
      query = query.eq('warehouse_id', warehouse_id);
    }
    
    const { data: zones, error } = await query;
    
    if (error) {
      console.error('Error fetching zones:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch zones'
      } as ApiResponse);
    }
    
    // Format zones for frontend
    const formattedZones = zones?.map(formatZoneForFrontend) || [];
    
    res.json({
      success: true,
      data: formattedZones,
      message: 'Zones retrieved successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Get zones error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// GET /api/zones/stats - Get zone statistics (optionally filtered by warehouse)
router.get('/stats', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { warehouse_id } = req.query;
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Build query for stats
    let query = supabaseAdmin
      .from('zones')
      .select(`
        id,
        zone_type,
        is_active,
        warehouses!inner(tenant_id)
      `)
      .eq('warehouses.tenant_id', tenantId);
    
    // Filter by warehouse if provided
    if (warehouse_id) {
      query = query.eq('warehouse_id', warehouse_id);
    }
    
    const { data: zones, error } = await query;
    
    if (error) {
      console.error('Error fetching zone stats:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch zone statistics'
      } as ApiResponse);
    }
    
    const stats = {
      totalZones: zones?.length || 0,
      activeZones: zones?.filter(z => z.is_active).length || 0,
      inactiveZones: zones?.filter(z => !z.is_active).length || 0,
      storageZones: zones?.filter(z => z.zone_type === 'storage').length || 0,
      receivingZones: zones?.filter(z => z.zone_type === 'receiving').length || 0,
      shippingZones: zones?.filter(z => z.zone_type === 'shipping').length || 0,
      stagingZones: zones?.filter(z => z.zone_type === 'staging').length || 0,
    };
    
    res.json({
      success: true,
      data: stats,
      message: 'Zone statistics retrieved successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Get zone stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// POST /api/zones - Create a new zone
router.post('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const {
      warehouse_id,
      name,
      zone_code,
      zone_type,
      description,
      capacity,
      capacity_unit,
      temperature_controlled = false,
      temperature_min,
      temperature_max,
      humidity_controlled = false,
      humidity_min,
      humidity_max,
      restrictions,
      is_active = true
    } = req.body;
    
    // Validate required fields
    if (!warehouse_id || !name || !zone_code || !zone_type) {
      return res.status(400).json({
        success: false,
        error: 'Warehouse ID, name, zone code, and zone type are required'
      } as ApiResponse);
    }
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Verify warehouse exists and belongs to tenant
    const { data: warehouse } = await supabaseAdmin
      .from('warehouses')
      .select('id')
      .eq('id', warehouse_id)
      .eq('tenant_id', tenantId)
      .single();
    
    if (!warehouse) {
      return res.status(400).json({
        success: false,
        error: 'Warehouse not found or does not belong to your tenant'
      } as ApiResponse);
    }
    
    // Check if zone code already exists for this warehouse
    const { data: existingZone } = await supabaseAdmin
      .from('zones')
      .select('id')
      .eq('warehouse_id', warehouse_id)
      .eq('zone_code', zone_code)
      .single();
    
    if (existingZone) {
      return res.status(400).json({
        success: false,
        error: 'Zone code already exists in this warehouse'
      } as ApiResponse);
    }
    
    // Create zone
    const now = new Date().toISOString();
    const { data: zone, error } = await supabaseAdmin
      .from('zones')
      .insert({
        id: crypto.randomUUID(),
        warehouse_id,
        name,
        zone_code,
        zone_type,
        description,
        capacity,
        capacity_unit: capacity_unit || 'pallets',
        temperature_controlled,
        temperature_min,
        temperature_max,
        humidity_controlled,
        humidity_min,
        humidity_max,
        restrictions: restrictions || {},
        is_active,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating zone:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create zone'
      } as ApiResponse);
    }
    
    res.status(201).json({
      success: true,
      data: formatZoneForFrontend(zone),
      message: 'Zone created successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Create zone error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// PUT /api/zones/:id - Update a zone
router.put('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      zone_code,
      zone_type,
      description,
      capacity,
      capacity_unit,
      temperature_controlled,
      temperature_min,
      temperature_max,
      humidity_controlled,
      humidity_min,
      humidity_max,
      restrictions,
      is_active
    } = req.body;
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Check if zone exists and belongs to tenant (through warehouse)
    const { data: existingZone } = await supabaseAdmin
      .from('zones')
      .select(`
        id,
        warehouse_id,
        zone_code,
        warehouses!inner(tenant_id)
      `)
      .eq('id', id)
      .eq('warehouses.tenant_id', tenantId)
      .single();
    
    if (!existingZone) {
      return res.status(404).json({
        success: false,
        error: 'Zone not found'
      } as ApiResponse);
    }
    
    // If updating zone code, check for duplicates in the same warehouse
    if (zone_code && zone_code !== existingZone.zone_code) {
      const { data: duplicateZone } = await supabaseAdmin
        .from('zones')
        .select('id')
        .eq('warehouse_id', existingZone.warehouse_id)
        .eq('zone_code', zone_code)
        .neq('id', id)
        .single();
      
      if (duplicateZone) {
        return res.status(400).json({
          success: false,
          error: 'Zone code already exists in this warehouse'
        } as ApiResponse);
      }
    }
    
    // Update zone
    const { data: zone, error } = await supabaseAdmin
      .from('zones')
      .update({
        ...(name && { name }),
        ...(zone_code && { zone_code }),
        ...(zone_type && { zone_type }),
        ...(description !== undefined && { description }),
        ...(capacity !== undefined && { capacity }),
        ...(capacity_unit && { capacity_unit }),
        ...(temperature_controlled !== undefined && { temperature_controlled }),
        ...(temperature_min !== undefined && { temperature_min }),
        ...(temperature_max !== undefined && { temperature_max }),
        ...(humidity_controlled !== undefined && { humidity_controlled }),
        ...(humidity_min !== undefined && { humidity_min }),
        ...(humidity_max !== undefined && { humidity_max }),
        ...(restrictions && { restrictions }),
        ...(is_active !== undefined && { is_active }),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating zone:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update zone'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      data: formatZoneForFrontend(zone),
      message: 'Zone updated successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Update zone error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// DELETE /api/zones/:id - Delete a zone
router.delete('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Check if zone exists and belongs to tenant (through warehouse)
    const { data: existingZone } = await supabaseAdmin
      .from('zones')
      .select(`
        id,
        warehouses!inner(tenant_id)
      `)
      .eq('id', id)
      .eq('warehouses.tenant_id', tenantId)
      .single();
    
    if (!existingZone) {
      return res.status(404).json({
        success: false,
        error: 'Zone not found'
      } as ApiResponse);
    }
    
    // Check if zone has associated locations
    const { data: locations } = await supabaseAdmin
      .from('locations')
      .select('id')
      .eq('zone_id', id)
      .limit(1);
    
    if (locations && locations.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete zone with associated locations. Please delete all locations first.'
      } as ApiResponse);
    }
    
    // Delete zone
    const { error } = await supabaseAdmin
      .from('zones')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting zone:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete zone'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      message: 'Zone deleted successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Delete zone error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

export default router;
