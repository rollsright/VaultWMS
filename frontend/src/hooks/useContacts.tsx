import { useState, useEffect } from 'react';
import { Contact, ContactSummary, CreateContactRequest, UpdateContactRequest } from '../types/contact';

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

  const loadContacts = async (customerIdFilter: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter contacts by customer ID
      const filteredContacts = mockContacts.filter(contact => contact.customer_id === customerIdFilter);
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request(`/customers/${customerIdFilter}/contacts`);
      // setContacts(response.data);
      
      setContacts(filteredContacts);
      setSummary({
        totalContacts: filteredContacts.length,
        activeContacts: filteredContacts.filter(contact => contact.status === 'active').length,
        inactiveContacts: filteredContacts.filter(contact => contact.status === 'inactive').length,
        primaryContacts: filteredContacts.filter(contact => contact.is_primary).length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const createContact = async (contactData: CreateContactRequest): Promise<Contact> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request(`/customers/${contactData.customer_id}/contacts`, {
      //   method: 'POST',
      //   body: JSON.stringify(contactData),
      // });
      
      const newContact: Contact = {
        id: Date.now().toString(),
        ...contactData,
        is_primary: contactData.is_primary || false,
        status: contactData.status || 'active',
        is_active: contactData.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setContacts(prev => [...prev, newContact]);
      setSummary(prev => ({
        ...prev,
        totalContacts: prev.totalContacts + 1,
        activeContacts: contactData.status !== 'inactive' ? prev.activeContacts + 1 : prev.activeContacts,
        inactiveContacts: contactData.status === 'inactive' ? prev.inactiveContacts + 1 : prev.inactiveContacts,
        primaryContacts: contactData.is_primary ? prev.primaryContacts + 1 : prev.primaryContacts,
      }));
      
      return newContact;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create contact');
      throw err;
    }
  };

  const updateContact = async (id: string, contactData: UpdateContactRequest): Promise<Contact> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await apiClient.request(`/contacts/${id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(contactData),
      // });
      
      const oldContact = contacts.find(contact => contact.id === id)!;
      const updatedContact: Contact = {
        ...oldContact,
        ...contactData,
        updated_at: new Date().toISOString(),
      };
      
      setContacts(prev => prev.map(contact => contact.id === id ? updatedContact : contact));
      
      // Update summary if relevant fields changed
      setSummary(prev => {
        let newSummary = { ...prev };
        
        // Update status counts
        if (contactData.status && contactData.status !== oldContact.status) {
          if (oldContact.status === 'active' && contactData.status === 'inactive') {
            newSummary.activeContacts -= 1;
            newSummary.inactiveContacts += 1;
          } else if (oldContact.status === 'inactive' && contactData.status === 'active') {
            newSummary.activeContacts += 1;
            newSummary.inactiveContacts -= 1;
          }
        }
        
        // Update primary contact count
        if (contactData.is_primary !== undefined && contactData.is_primary !== oldContact.is_primary) {
          if (contactData.is_primary) {
            newSummary.primaryContacts += 1;
          } else {
            newSummary.primaryContacts -= 1;
          }
        }
        
        return newSummary;
      });
      
      return updatedContact;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update contact');
      throw err;
    }
  };

  const deleteContact = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      // TODO: Replace with actual API call
      // await apiClient.request(`/contacts/${id}`, {
      //   method: 'DELETE',
      // });
      
      const contact = contacts.find(contact => contact.id === id);
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
    refreshContacts: () => customerId && loadContacts(customerId),
  };
}
