import { useState, useEffect } from 'react';
import { Contact, ContactSummary, CreateContactRequest, UpdateContactRequest } from '../types/contact';
import { apiClient } from '../lib/api';

// Mock data for development - will be replaced with API calls
const mockContacts: Contact[] = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@testcustomer.ca',
    phone: '+1 (604) 555-0123',
    title: 'Operations Manager',
    department: 'Operations',
    is_primary: true,
    customer_id: '1',
    notes: 'Primary contact for all warehouse operations',
    status: 'active',
    is_active: true,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
  {
    id: '2',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@testcustomer.ca',
    phone: '+1 (604) 555-0456',
    title: 'Logistics Coordinator',
    department: 'Logistics',
    is_primary: false,
    customer_id: '1',
    status: 'active',
    is_active: true,
    created_at: '2025-02-01T00:00:00Z',
    updated_at: '2025-02-01T00:00:00Z',
  },
  {
    id: '3',
    first_name: 'Michael',
    last_name: 'Chen',
    email: 'michael.chen@georgechen.ca',
    phone: '+1 (778) 555-0789',
    title: 'Warehouse Manager',
    is_primary: true,
    customer_id: '2',
    notes: 'Available for emergency calls 24/7',
    status: 'active',
    is_active: true,
    created_at: '2025-01-20T00:00:00Z',
    updated_at: '2025-01-20T00:00:00Z',
  },
  {
    id: '4',
    first_name: 'Emily',
    last_name: 'Davis',
    email: 'emily.davis@testing.com',
    title: 'Supply Chain Manager',
    department: 'Supply Chain',
    is_primary: false,
    customer_id: '3',
    status: 'active',
    is_active: true,
    created_at: '2025-02-15T00:00:00Z',
    updated_at: '2025-02-15T00:00:00Z',
  },
];

const mockSummary: ContactSummary = {
  totalContacts: 2,
  activeContacts: 2,
  inactiveContacts: 0,
  primaryContacts: 1,
};

export function useContacts(customerId?: string) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [summary, setSummary] = useState<ContactSummary>(mockSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load contacts on mount or when customerId changes
  useEffect(() => {
    if (customerId) {
      loadContacts(customerId);
    } else {
      setContacts([]);
      setSummary({ totalContacts: 0, activeContacts: 0, inactiveContacts: 0, primaryContacts: 0 });
      setLoading(false);
    }
  }, [customerId]);

  const loadContacts = async (customerIdFilter?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const [contactsResponse, statsResponse] = await Promise.all([
        customerIdFilter ? apiClient.getContacts({ customer_id: customerIdFilter }) : apiClient.getContacts(),
        apiClient.getContactStats()
      ]);
      
      if (contactsResponse.success && contactsResponse.data) {
        setContacts(contactsResponse.data);
      } else {
        throw new Error(contactsResponse.error || 'Failed to fetch contacts');
      }
      
      if (statsResponse.success && statsResponse.data) {
        setSummary(statsResponse.data);
      } else {
        // Use fallback summary if stats fail
        const filteredContacts = contactsResponse.data || [];
        setSummary({
          totalContacts: filteredContacts.length,
          activeContacts: filteredContacts.filter((contact: any) => contact.status === 'active').length,
          inactiveContacts: filteredContacts.filter((contact: any) => contact.status === 'inactive').length,
          primaryContacts: filteredContacts.filter((contact: any) => contact.is_primary).length,
        });
      }
    } catch (err) {
      console.error('Failed to load contacts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
      // Fallback to mock data in case of error
      const filteredContacts = customerIdFilter 
        ? mockContacts.filter(contact => contact.customer_id === customerIdFilter)
        : mockContacts;
      setContacts(filteredContacts);
      setSummary({
        totalContacts: filteredContacts.length,
        activeContacts: filteredContacts.filter(contact => contact.status === 'active').length,
        inactiveContacts: filteredContacts.filter(contact => contact.status === 'inactive').length,
        primaryContacts: filteredContacts.filter(contact => contact.is_primary).length,
      });
    } finally {
      setLoading(false);
    }
  };

  const createContact = async (contactData: CreateContactRequest): Promise<Contact> => {
    try {
      setError(null);
      
      const response = await apiClient.createContact(contactData);
      
      if (response.success && response.data) {
        const newContact = response.data;
        setContacts(prev => [...prev, newContact]);
        setSummary(prev => ({
          ...prev,
          totalContacts: prev.totalContacts + 1,
          activeContacts: newContact.status !== 'inactive' ? prev.activeContacts + 1 : prev.activeContacts,
          inactiveContacts: newContact.status === 'inactive' ? prev.inactiveContacts + 1 : prev.inactiveContacts,
          primaryContacts: newContact.is_primary ? prev.primaryContacts + 1 : prev.primaryContacts,
        }));
        
        return newContact;
      } else {
        throw new Error(response.error || 'Failed to create contact');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create contact');
      throw err;
    }
  };

  const updateContact = async (id: string, contactData: UpdateContactRequest): Promise<Contact> => {
    try {
      setError(null);
      
      const response = await apiClient.updateContact(id, contactData);
      
      if (response.success && response.data) {
        const updatedContact = response.data;
        const oldContact = contacts.find(contact => contact.id === id);
        
        setContacts(prev => prev.map(contact => contact.id === id ? updatedContact : contact));
        
        // Update summary if relevant fields changed
        if (oldContact) {
          setSummary(prev => {
            let newSummary = { ...prev };
            
            // Update status counts
            if (updatedContact.status !== oldContact.status) {
              if (oldContact.status === 'active' && updatedContact.status === 'inactive') {
                newSummary.activeContacts -= 1;
                newSummary.inactiveContacts += 1;
              } else if (oldContact.status === 'inactive' && updatedContact.status === 'active') {
                newSummary.activeContacts += 1;
                newSummary.inactiveContacts -= 1;
              }
            }
            
            // Update primary contact count
            if (updatedContact.is_primary !== oldContact.is_primary) {
              if (updatedContact.is_primary) {
                newSummary.primaryContacts += 1;
              } else {
                newSummary.primaryContacts -= 1;
              }
            }
            
            return newSummary;
          });
        }
        
        return updatedContact;
      } else {
        throw new Error(response.error || 'Failed to update contact');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update contact');
      throw err;
    }
  };

  const deleteContact = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      const contact = contacts.find(contact => contact.id === id);
      const response = await apiClient.deleteContact(id);
      
      if (response.success) {
        setContacts(prev => prev.filter(contact => contact.id !== id));
        
        if (contact) {
          setSummary(prev => ({
            ...prev,
            totalContacts: prev.totalContacts - 1,
            activeContacts: contact.status === 'active' ? prev.activeContacts - 1 : prev.activeContacts,
            inactiveContacts: contact.status === 'inactive' ? prev.inactiveContacts - 1 : prev.inactiveContacts,
            primaryContacts: contact.is_primary ? prev.primaryContacts - 1 : prev.primaryContacts,
          }));
        }
      } else {
        throw new Error(response.error || 'Failed to delete contact');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete contact');
      throw err;
    }
  };

  return {
    contacts,
    summary,
    loading,
    error,
    createContact,
    updateContact,
    deleteContact,
    refreshContacts: () => loadContacts(customerId),
  };
}
