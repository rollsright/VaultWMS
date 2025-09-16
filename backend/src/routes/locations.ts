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

// Helper function to format location for frontend
function formatLocationForFrontend(dbLocation: any) {
  return {
    id: dbLocation.id,
    warehouse_id: dbLocation.warehouse_id,
    zone_id: dbLocation.zone_id,
    code: dbLocation.location_code,
    name: dbLocation.name,
    type: dbLocation.location_type,
    status: dbLocation.is_active ? 'active' : 'inactive',
    aisle: dbLocation.aisle,
    bay: dbLocation.bay,
    level: dbLocation.level,
    position: dbLocation.position,
    coordinates: dbLocation.coordinates,
    dimensions: dbLocation.dimensions,
    capacity: dbLocation.capacity,
    capacity_unit: dbLocation.capacity_unit,
    weight_limit: dbLocation.weight_limit,
    weight_unit: dbLocation.weight_unit,
    barcode: dbLocation.barcode,
    qr_code: dbLocation.qr_code,
    picking_sequence: dbLocation.picking_sequence,
    is_pickable: dbLocation.is_pickable,
    is_bulk_location: dbLocation.is_bulk_location,
    restrictions: dbLocation.restrictions,
    created_at: dbLocation.created_at,
    updated_at: dbLocation.updated_at
  };
}

// GET /api/locations - Get all locations (optionally filtered by warehouse or zone)
router.get('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { warehouse_id, zone_id } = req.query;
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Build query - locations belong to warehouses, which belong to tenants
    let query = supabaseAdmin
      .from('locations')
      .select(`
        *,
        warehouses!inner(tenant_id),
        zones(name, zone_code, zone_type)
      `)
      .eq('warehouses.tenant_id', tenantId)
      .order('created_at', { ascending: false });
    
    // Filter by warehouse if provided
    if (warehouse_id) {
      query = query.eq('warehouse_id', warehouse_id);
    }
    
    // Filter by zone if provided
    if (zone_id) {
      query = query.eq('zone_id', zone_id);
    }
    
    const { data: locations, error } = await query;
    
    if (error) {
      console.error('Error fetching locations:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch locations'
      } as ApiResponse);
    }
    
    // Format locations for frontend
    const formattedLocations = locations?.map(formatLocationForFrontend) || [];
    
    res.json({
      success: true,
      data: formattedLocations,
      message: 'Locations retrieved successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// GET /api/locations/stats - Get location statistics (optionally filtered by warehouse or zone)
router.get('/stats', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { warehouse_id, zone_id } = req.query;
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Build query for stats
    let query = supabaseAdmin
      .from('locations')
      .select(`
        id,
        location_type,
        is_active,
        is_pickable,
        is_bulk_location,
        warehouses!inner(tenant_id)
      `)
      .eq('warehouses.tenant_id', tenantId);
    
    // Filter by warehouse if provided
    if (warehouse_id) {
      query = query.eq('warehouse_id', warehouse_id);
    }
    
    // Filter by zone if provided
    if (zone_id) {
      query = query.eq('zone_id', zone_id);
    }
    
    const { data: locations, error } = await query;
    
    if (error) {
      console.error('Error fetching location stats:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch location statistics'
      } as ApiResponse);
    }
    
    const stats = {
      totalLocations: locations?.length || 0,
      activeLocations: locations?.filter(l => l.is_active).length || 0,
      inactiveLocations: locations?.filter(l => !l.is_active).length || 0,
      pickableLocations: locations?.filter(l => l.is_pickable).length || 0,
      bulkLocations: locations?.filter(l => l.is_bulk_location).length || 0,
      floorLocations: locations?.filter(l => l.location_type === 'floor').length || 0,
      rackLocations: locations?.filter(l => l.location_type === 'rack').length || 0,
      shelfLocations: locations?.filter(l => l.location_type === 'shelf').length || 0,
      binLocations: locations?.filter(l => l.location_type === 'bin').length || 0,
    };
    
    res.json({
      success: true,
      data: stats,
      message: 'Location statistics retrieved successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Get location stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// POST /api/locations - Create a new location
router.post('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const {
      warehouse_id,
      zone_id,
      location_code,
      name,
      location_type,
      aisle,
      bay,
      level,
      position,
      coordinates,
      dimensions,
      capacity,
      capacity_unit,
      weight_limit,
      weight_unit,
      barcode,
      qr_code,
      picking_sequence,
      is_pickable = true,
      is_bulk_location = false,
      restrictions,
      is_active = true
    } = req.body;
    
    // Validate required fields
    if (!warehouse_id || !location_code || !location_type) {
      return res.status(400).json({
        success: false,
        error: 'Warehouse ID, location code, and location type are required'
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
    
    // Verify zone exists and belongs to the warehouse (if zone_id provided)
    if (zone_id) {
      const { data: zone } = await supabaseAdmin
        .from('zones')
        .select('id')
        .eq('id', zone_id)
        .eq('warehouse_id', warehouse_id)
        .single();
      
      if (!zone) {
        return res.status(400).json({
          success: false,
          error: 'Zone not found or does not belong to the specified warehouse'
        } as ApiResponse);
      }
    }
    
    // Check if location code already exists for this warehouse
    const { data: existingLocation } = await supabaseAdmin
      .from('locations')
      .select('id')
      .eq('warehouse_id', warehouse_id)
      .eq('location_code', location_code)
      .single();
    
    if (existingLocation) {
      return res.status(400).json({
        success: false,
        error: 'Location code already exists in this warehouse'
      } as ApiResponse);
    }
    
    // Check if barcode is unique (if provided)
    if (barcode) {
      const { data: barcodeLocation } = await supabaseAdmin
        .from('locations')
        .select('id')
        .eq('barcode', barcode)
        .single();
      
      if (barcodeLocation) {
        return res.status(400).json({
          success: false,
          error: 'Barcode already exists'
        } as ApiResponse);
      }
    }
    
    // Check if QR code is unique (if provided)
    if (qr_code) {
      const { data: qrLocation } = await supabaseAdmin
        .from('locations')
        .select('id')
        .eq('qr_code', qr_code)
        .single();
      
      if (qrLocation) {
        return res.status(400).json({
          success: false,
          error: 'QR code already exists'
        } as ApiResponse);
      }
    }
    
    // Create location
    const now = new Date().toISOString();
    const { data: location, error } = await supabaseAdmin
      .from('locations')
      .insert({
        id: crypto.randomUUID(),
        warehouse_id,
        zone_id: zone_id || null,
        location_code,
        name,
        location_type,
        aisle,
        bay,
        level,
        position,
        coordinates: coordinates || {},
        dimensions: dimensions || {},
        capacity,
        capacity_unit: capacity_unit || 'units',
        weight_limit,
        weight_unit: weight_unit || 'lbs',
        barcode,
        qr_code,
        picking_sequence,
        is_pickable,
        is_bulk_location,
        restrictions: restrictions || {},
        is_active,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating location:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create location'
      } as ApiResponse);
    }
    
    res.status(201).json({
      success: true,
      data: formatLocationForFrontend(location),
      message: 'Location created successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// PUT /api/locations/:id - Update a location
router.put('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      zone_id,
      location_code,
      name,
      location_type,
      aisle,
      bay,
      level,
      position,
      coordinates,
      dimensions,
      capacity,
      capacity_unit,
      weight_limit,
      weight_unit,
      barcode,
      qr_code,
      picking_sequence,
      is_pickable,
      is_bulk_location,
      restrictions,
      is_active
    } = req.body;
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Check if location exists and belongs to tenant (through warehouse)
    const { data: existingLocation } = await supabaseAdmin
      .from('locations')
      .select(`
        id,
        warehouse_id,
        location_code,
        barcode,
        qr_code,
        warehouses!inner(tenant_id)
      `)
      .eq('id', id)
      .eq('warehouses.tenant_id', tenantId)
      .single();
    
    if (!existingLocation) {
      return res.status(404).json({
        success: false,
        error: 'Location not found'
      } as ApiResponse);
    }
    
    // If updating location code, check for duplicates in the same warehouse
    if (location_code && location_code !== existingLocation.location_code) {
      const { data: duplicateLocation } = await supabaseAdmin
        .from('locations')
        .select('id')
        .eq('warehouse_id', existingLocation.warehouse_id)
        .eq('location_code', location_code)
        .neq('id', id)
        .single();
      
      if (duplicateLocation) {
        return res.status(400).json({
          success: false,
          error: 'Location code already exists in this warehouse'
        } as ApiResponse);
      }
    }
    
    // If updating barcode, check for duplicates
    if (barcode && barcode !== existingLocation.barcode) {
      const { data: barcodeLocation } = await supabaseAdmin
        .from('locations')
        .select('id')
        .eq('barcode', barcode)
        .neq('id', id)
        .single();
      
      if (barcodeLocation) {
        return res.status(400).json({
          success: false,
          error: 'Barcode already exists'
        } as ApiResponse);
      }
    }
    
    // If updating QR code, check for duplicates
    if (qr_code && qr_code !== existingLocation.qr_code) {
      const { data: qrLocation } = await supabaseAdmin
        .from('locations')
        .select('id')
        .eq('qr_code', qr_code)
        .neq('id', id)
        .single();
      
      if (qrLocation) {
        return res.status(400).json({
          success: false,
          error: 'QR code already exists'
        } as ApiResponse);
      }
    }
    
    // Verify zone exists and belongs to the warehouse (if zone_id provided)
    if (zone_id) {
      const { data: zone } = await supabaseAdmin
        .from('zones')
        .select('id')
        .eq('id', zone_id)
        .eq('warehouse_id', existingLocation.warehouse_id)
        .single();
      
      if (!zone) {
        return res.status(400).json({
          success: false,
          error: 'Zone not found or does not belong to the warehouse'
        } as ApiResponse);
      }
    }
    
    // Update location
    const { data: location, error } = await supabaseAdmin
      .from('locations')
      .update({
        ...(zone_id !== undefined && { zone_id: zone_id || null }),
        ...(location_code && { location_code }),
        ...(name !== undefined && { name }),
        ...(location_type && { location_type }),
        ...(aisle !== undefined && { aisle }),
        ...(bay !== undefined && { bay }),
        ...(level !== undefined && { level }),
        ...(position !== undefined && { position }),
        ...(coordinates && { coordinates }),
        ...(dimensions && { dimensions }),
        ...(capacity !== undefined && { capacity }),
        ...(capacity_unit && { capacity_unit }),
        ...(weight_limit !== undefined && { weight_limit }),
        ...(weight_unit && { weight_unit }),
        ...(barcode !== undefined && { barcode }),
        ...(qr_code !== undefined && { qr_code }),
        ...(picking_sequence !== undefined && { picking_sequence }),
        ...(is_pickable !== undefined && { is_pickable }),
        ...(is_bulk_location !== undefined && { is_bulk_location }),
        ...(restrictions && { restrictions }),
        ...(is_active !== undefined && { is_active }),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating location:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update location'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      data: formatLocationForFrontend(location),
      message: 'Location updated successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// DELETE /api/locations/:id - Delete a location
router.delete('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Check if location exists and belongs to tenant (through warehouse)
    const { data: existingLocation } = await supabaseAdmin
      .from('locations')
      .select(`
        id,
        warehouses!inner(tenant_id)
      `)
      .eq('id', id)
      .eq('warehouses.tenant_id', tenantId)
      .single();
    
    if (!existingLocation) {
      return res.status(404).json({
        success: false,
        error: 'Location not found'
      } as ApiResponse);
    }
    
    // Note: In a real system, you might want to check if location has inventory
    // For now, we'll allow deletion
    
    // Delete location
    const { error } = await supabaseAdmin
      .from('locations')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting location:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete location'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      message: 'Location deleted successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

export default router;
