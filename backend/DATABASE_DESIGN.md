# VaultWMS Database Design

## Overview
This document contains the database schema design for the **Tenants table** in the VaultWMS multi-tenant warehouse management system. This is the foundation table that represents companies/organizations using the WMS.

## Multi-Tenant Architecture
- **Strategy**: Shared Database, Shared Schema with `tenant_id`
- **Security**: Row-Level Security (RLS) policies for data isolation
- **Authentication**: Supabase Auth with custom users table
- **Isolation**: Every table includes `tenant_id` for data segregation

## Tenants Table (MVP Version)

### Purpose
Root table representing companies/organizations using the WMS. This is the foundation of our multi-tenant architecture.

### Table Structure

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique tenant identifier |
| `name` | VARCHAR(255) | NOT NULL | Company name |
| `slug` | VARCHAR(100) | UNIQUE, NOT NULL | URL-friendly identifier |
| `contact_name` | VARCHAR(255) | NULLABLE | Primary contact person |
| `contact_email` | VARCHAR(255) | NULLABLE | Primary contact email |
| `contact_phone` | VARCHAR(50) | NULLABLE | Primary contact phone |
| `address` | JSONB | DEFAULT '{}' | Company address |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Active status |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Update timestamp |

### Field Specifications

#### 1. `id` (UUID, Primary Key)
- **Purpose**: Unique identifier for each tenant
- **Type**: UUID v4
- **Constraints**: PRIMARY KEY, NOT NULL
- **Default**: uuid_generate_v4()
- **Example**: `550e8400-e29b-41d4-a716-446655440000`

#### 2. `name` (VARCHAR(255), NOT NULL)
- **Purpose**: Display name of the company/organization
- **Type**: VARCHAR(255)
- **Constraints**: NOT NULL
- **Validation**: 2-255 characters
- **Example**: `"Acme Corporation"`, `"Tech Solutions Inc."`

#### 3. `slug` (VARCHAR(100), UNIQUE, NOT NULL)
- **Purpose**: URL-friendly identifier for the tenant
- **Type**: VARCHAR(100)
- **Constraints**: UNIQUE, NOT NULL
- **Validation**: 2-100 characters, lowercase, alphanumeric + hyphens only
- **Example**: `"acme-corp"`, `"tech-solutions-inc"`
- **Usage**: Used in URLs, API endpoints, subdomains

#### 4. `contact_name` (VARCHAR(255), NULLABLE)
- **Purpose**: Primary contact person's name
- **Type**: VARCHAR(255)
- **Constraints**: NULLABLE
- **Example**: `"John Doe"`, `"Jane Smith"`

#### 5. `contact_email` (VARCHAR(255), NULLABLE)
- **Purpose**: Primary contact email address
- **Type**: VARCHAR(255)
- **Constraints**: NULLABLE
- **Validation**: Valid email format
- **Example**: `"john@acme.com"`, `"jane@techsolutions.com"`

#### 6. `contact_phone` (VARCHAR(50), NULLABLE)
- **Purpose**: Primary contact phone number
- **Type**: VARCHAR(50)
- **Constraints**: NULLABLE
- **Example**: `"+1-555-0123"`, `"555-0124"`

#### 7. `address` (JSONB, DEFAULT '{}')
- **Purpose**: Company address information
- **Type**: JSONB
- **Default**: `'{}'`
- **Structure**:
```json
{
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "country": "US"
}
```

#### 8. `is_active` (BOOLEAN, NOT NULL, DEFAULT true)
- **Purpose**: Whether the tenant is active
- **Type**: BOOLEAN
- **Constraints**: NOT NULL
- **Default**: `true`
- **Usage**: Soft delete functionality

#### 9. `created_at` (TIMESTAMP, NOT NULL, DEFAULT NOW())
- **Purpose**: Record creation timestamp
- **Type**: TIMESTAMP WITH TIME ZONE
- **Constraints**: NOT NULL
- **Default**: NOW()

#### 10. `updated_at` (TIMESTAMP, NOT NULL, DEFAULT NOW())
- **Purpose**: Record last update timestamp
- **Type**: TIMESTAMP WITH TIME ZONE
- **Constraints**: NOT NULL
- **Default**: NOW()

### Indexes

#### Primary Index
- `PRIMARY KEY (id)`

#### Unique Indexes
- `UNIQUE INDEX idx_tenants_slug ON tenants(slug)`

#### Performance Indexes
- `INDEX idx_tenants_is_active ON tenants(is_active)`
- `INDEX idx_tenants_contact_email ON tenants(contact_email)`
- `INDEX idx_tenants_created_at ON tenants(created_at)`

### Constraints

#### Check Constraints
- `CHECK (LENGTH(name) >= 2 AND LENGTH(name) <= 255)`
- `CHECK (LENGTH(slug) >= 2 AND LENGTH(slug) <= 100)`
- `CHECK (slug ~ '^[a-z0-9-]+$')` (lowercase, alphanumeric, hyphens only)

#### Foreign Key Constraints
- None (this is the root table)

### Relationships

#### One-to-Many Relationships (Tenant owns)
- `users` (employees of the tenant)
- `customers` (customers of the tenant)
- `warehouses` (warehouses owned by the tenant)
- `carriers` (shipping carriers used by the tenant)
- `suppliers` (suppliers for the tenant)
- `categories` (product categories for the tenant)

### Business Rules

1. **Tenant Creation**: Only super admins can create new tenants
2. **Slug Uniqueness**: Slug must be globally unique across all tenants
3. **Soft Delete**: Use `is_active` flag instead of hard delete
4. **Address Validation**: JSONB address must conform to defined schema

### Sample Data

```sql
INSERT INTO tenants (name, slug, contact_name, contact_email, address) VALUES 
('Acme Corporation', 'acme-corp', 'John Doe', 'john@acme.com', '{"street": "123 Main St", "city": "New York", "state": "NY", "zip": "10001"}'),
('Tech Solutions Inc', 'tech-solutions', 'Jane Smith', 'jane@techsolutions.com', '{"street": "456 Tech Ave", "city": "San Francisco", "state": "CA", "zip": "94105"}');
```
