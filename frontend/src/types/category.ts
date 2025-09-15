export interface Category {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  sort_order: number;
  parent_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategorySummary {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  status?: 'active' | 'inactive';
  sort_order?: number;
  parent_id?: string;
  is_active?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive';
  sort_order?: number;
  parent_id?: string;
  is_active?: boolean;
}
