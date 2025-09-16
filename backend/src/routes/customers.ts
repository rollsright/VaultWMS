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

// Helper function to format customer for frontend
function formatCustomerForFrontend(dbCustomer: any) {
  // Determine location from addresses
  let location = '';
  if (dbCustomer.shipping_address?.city && dbCustomer.shipping_address?.state) {
    location = `${dbCustomer.shipping_address.city}, ${dbCustomer.shipping_address.state}`;
  } else if (dbCustomer.billing_address?.city && dbCustomer.billing_address?.state) {
    location = `${dbCustomer.billing_address.city}, ${dbCustomer.billing_address.state}`;
  }

  return {
    id: dbCustomer.id,
    customer_code: dbCustomer.customer_code,
    name: dbCustomer.name,
    email: dbCustomer.contact_email,
    location: location || undefined,
    status: dbCustomer.is_active ? 'active' : 'inactive',
    contact_name: dbCustomer.contact_name,
    contact_phone: dbCustomer.contact_phone,
    billing_address: dbCustomer.billing_address,
    shipping_address: dbCustomer.shipping_address,
    payment_terms: dbCustomer.payment_terms,
    credit_limit: dbCustomer.credit_limit,
    notes: dbCustomer.notes,
    created_at: dbCustomer.created_at,
    updated_at: dbCustomer.updated_at
  };
}

// GET /api/customers - Get all customers
router.get('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    const { data: customers, error } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching customers:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch customers'
      } as ApiResponse);
    }
    
    // Format customers for frontend
    const formattedCustomers = customers?.map(formatCustomerForFrontend) || [];
    
    res.json({
      success: true,
      data: formattedCustomers,
      message: 'Customers retrieved successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// GET /api/customers/stats - Get customer statistics
router.get('/stats', authenticateUser, async (req: Request, res: Response) => {
  try {
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    const { data: customers, error } = await supabaseAdmin
      .from('customers')
      .select('id, is_active, created_at')
      .eq('tenant_id', tenantId);
    
    if (error) {
      console.error('Error fetching customer stats:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch customer statistics'
      } as ApiResponse);
    }
    
    // Calculate this month's customers
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = customers?.filter(c => 
      new Date(c.created_at) >= thisMonthStart
    ).length || 0;
    
    const stats = {
      totalCustomers: customers?.length || 0,
      activeCustomers: customers?.filter(c => c.is_active).length || 0,
      inactiveCustomers: customers?.filter(c => !c.is_active).length || 0,
      thisMonth
    };
    
    res.json({
      success: true,
      data: stats,
      message: 'Customer statistics retrieved successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// POST /api/customers - Create a new customer
router.post('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const {
      customer_code,
      name,
      contact_name,
      contact_email,
      contact_phone,
      billing_address,
      shipping_address,
      payment_terms,
      credit_limit,
      notes,
      is_active = true
    } = req.body;
    
    // Validate required fields
    if (!name || !customer_code) {
      return res.status(400).json({
        success: false,
        error: 'Customer name and code are required'
      } as ApiResponse);
    }
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Check if customer code already exists for this tenant
    const { data: existingCustomer } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('customer_code', customer_code)
      .single();
    
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        error: 'Customer code already exists'
      } as ApiResponse);
    }
    
    // Create customer
    const now = new Date().toISOString();
    const { data: customer, error } = await supabaseAdmin
      .from('customers')
      .insert({
        id: crypto.randomUUID(),
        tenant_id: tenantId,
        customer_code,
        name,
        contact_name,
        contact_email,
        contact_phone,
        billing_address: billing_address || {},
        shipping_address: shipping_address || {},
        payment_terms,
        credit_limit,
        notes,
        is_active,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating customer:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create customer'
      } as ApiResponse);
    }
    
    res.status(201).json({
      success: true,
      data: formatCustomerForFrontend(customer),
      message: 'Customer created successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// PUT /api/customers/:id - Update a customer
router.put('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      customer_code,
      name,
      contact_name,
      contact_email,
      contact_phone,
      billing_address,
      shipping_address,
      payment_terms,
      credit_limit,
      notes,
      is_active
    } = req.body;
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Check if customer exists and belongs to tenant
    const { data: existingCustomer } = await supabaseAdmin
      .from('customers')
      .select('id, customer_code')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();
    
    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      } as ApiResponse);
    }
    
    // If updating customer code, check for duplicates
    if (customer_code && customer_code !== existingCustomer.customer_code) {
      const { data: duplicateCustomer } = await supabaseAdmin
        .from('customers')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('customer_code', customer_code)
        .neq('id', id)
        .single();
      
      if (duplicateCustomer) {
        return res.status(400).json({
          success: false,
          error: 'Customer code already exists'
        } as ApiResponse);
      }
    }
    
    // Update customer
    const { data: customer, error } = await supabaseAdmin
      .from('customers')
      .update({
        ...(customer_code && { customer_code }),
        ...(name && { name }),
        ...(contact_name !== undefined && { contact_name }),
        ...(contact_email !== undefined && { contact_email }),
        ...(contact_phone !== undefined && { contact_phone }),
        ...(billing_address && { billing_address }),
        ...(shipping_address && { shipping_address }),
        ...(payment_terms !== undefined && { payment_terms }),
        ...(credit_limit !== undefined && { credit_limit }),
        ...(notes !== undefined && { notes }),
        ...(is_active !== undefined && { is_active }),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating customer:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update customer'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      data: formatCustomerForFrontend(customer),
      message: 'Customer updated successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// DELETE /api/customers/:id - Delete a customer
router.delete('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get default tenant ID
    const tenantId = await getDefaultTenant();
    
    // Check if customer exists and belongs to tenant
    const { data: existingCustomer } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();
    
    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      } as ApiResponse);
    }
    
    // Check if customer has associated contacts or users
    const { data: contacts } = await supabaseAdmin
      .from('contacts')
      .select('id')
      .eq('customer_id', id)
      .limit(1);
    
    if (contacts && contacts.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete customer with associated contacts. Please delete all contacts first.'
      } as ApiResponse);
    }
    
    // Delete customer
    const { error } = await supabaseAdmin
      .from('customers')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);
    
    if (error) {
      console.error('Error deleting customer:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete customer'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      message: 'Customer deleted successfully'
    } as ApiResponse);
    return;
    
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

export default router;