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

// GET /api/suppliers - Get all suppliers (optionally filtered by customer_id)
router.get('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.query;
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    let query = supabaseAdmin
      .from('suppliers')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });
    
    // Filter by customer if provided
    if (customer_id) {
      query = query.eq('customer_id', customer_id);
    }
    
    const { data: suppliers, error } = await query;
    
    if (error) {
      console.error('Error fetching suppliers:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch suppliers'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      data: suppliers || [],
      message: 'Suppliers retrieved successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// GET /api/suppliers/stats - Get supplier statistics
router.get('/stats', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.query;
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    let query = supabaseAdmin
      .from('suppliers')
      .select('id, status, created_at')
      .eq('tenant_id', tenantId);
    
    // Filter by customer if provided
    if (customer_id) {
      query = query.eq('customer_id', customer_id);
    }
    
    const { data: suppliers, error } = await query;
    
    if (error) {
      console.error('Error fetching supplier stats:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch supplier statistics'
      } as ApiResponse);
    }
    
    // Calculate this month's suppliers
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = suppliers?.filter(s => 
      new Date(s.created_at) >= thisMonthStart
    ).length || 0;
    
    const stats = {
      totalSuppliers: suppliers?.length || 0,
      activeSuppliers: suppliers?.filter(s => s.status === 'active').length || 0,
      inactiveSuppliers: suppliers?.filter(s => s.status === 'inactive').length || 0,
      thisMonth
    };
    
    res.json({
      success: true,
      data: stats,
      message: 'Supplier statistics retrieved successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Get supplier stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// POST /api/suppliers - Create a new supplier
router.post('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const {
      customer_id,
      name,
      email,
      phone,
      address,
      contact_person,
      payment_terms,
      status = 'active'
    } = req.body;
    
    // Validate required fields
    if (!name || !email || !customer_id) {
      return res.status(400).json({
        success: false,
        error: 'Supplier name, email, and customer ID are required'
      } as ApiResponse);
    }
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Verify the customer exists and belongs to the tenant
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('id', customer_id)
      .eq('tenant_id', tenantId)
      .single();
    
    if (!customer) {
      return res.status(400).json({
        success: false,
        error: 'Invalid customer ID'
      } as ApiResponse);
    }
    
    // Check if supplier email already exists for this customer
    const { data: existingSupplier } = await supabaseAdmin
      .from('suppliers')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('customer_id', customer_id)
      .eq('email', email)
      .single();
    
    if (existingSupplier) {
      return res.status(400).json({
        success: false,
        error: 'A supplier with this email already exists for this customer'
      } as ApiResponse);
    }
    
    // Create supplier
    const now = new Date().toISOString();
    const { data: supplier, error } = await supabaseAdmin
      .from('suppliers')
      .insert({
        id: crypto.randomUUID(),
        tenant_id: tenantId,
        customer_id,
        name,
        email,
        phone,
        address,
        contact_person,
        payment_terms,
        status,
        is_active: status === 'active',
        created_at: now,
        updated_at: now
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating supplier:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create supplier'
      } as ApiResponse);
    }
    
    res.status(201).json({
      success: true,
      data: supplier,
      message: 'Supplier created successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// PUT /api/suppliers/:id - Update a supplier
router.put('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      address,
      contact_person,
      payment_terms,
      status
    } = req.body;
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Check if supplier exists and belongs to tenant
    const { data: existingSupplier } = await supabaseAdmin
      .from('suppliers')
      .select('id, email, customer_id')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();
    
    if (!existingSupplier) {
      return res.status(404).json({
        success: false,
        error: 'Supplier not found'
      } as ApiResponse);
    }
    
    // If updating email, check for duplicates within the same customer
    if (email && email !== existingSupplier.email) {
      const { data: duplicateSupplier } = await supabaseAdmin
        .from('suppliers')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('customer_id', existingSupplier.customer_id)
        .eq('email', email)
        .neq('id', id)
        .single();
      
      if (duplicateSupplier) {
        return res.status(400).json({
          success: false,
          error: 'A supplier with this email already exists for this customer'
        } as ApiResponse);
      }
    }
    
    // Update supplier
    const { data: supplier, error } = await supabaseAdmin
      .from('suppliers')
      .update({
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(contact_person !== undefined && { contact_person }),
        ...(payment_terms !== undefined && { payment_terms }),
        ...(status && { status, is_active: status === 'active' }),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating supplier:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update supplier'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      data: supplier,
      message: 'Supplier updated successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// DELETE /api/suppliers/:id - Delete a supplier
router.delete('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Check if supplier exists and belongs to tenant
    const { data: existingSupplier } = await supabaseAdmin
      .from('suppliers')
      .select('id')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();
    
    if (!existingSupplier) {
      return res.status(404).json({
        success: false,
        error: 'Supplier not found'
      } as ApiResponse);
    }
    
    // Note: You might want to add checks for related records here
    // For example, check if the supplier is referenced in any orders or items
    
    // Delete supplier
    const { error } = await supabaseAdmin
      .from('suppliers')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);
    
    if (error) {
      console.error('Error deleting supplier:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete supplier'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      message: 'Supplier deleted successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

export default router;
