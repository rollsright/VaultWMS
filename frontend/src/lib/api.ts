// API client for backend communication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? 'https://vaultwms.onrender.com/api' : 'http://localhost:3001/api');

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  user: any;
  session: any;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface OAuthRequest {
  provider: 'google' | 'azure';
  redirect_to?: string;
}

export interface OAuthCallbackRequest {
  code: string;
  provider: 'google' | 'azure';
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('access_token');
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store tokens if login successful
    if (response.success && response.data?.session) {
      localStorage.setItem('access_token', response.data.session.access_token);
      localStorage.setItem('refresh_token', response.data.session.refresh_token);
    }

    return response;
  }

  async signup(credentials: SignupRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store tokens if signup successful
    if (response.success && response.data?.session) {
      localStorage.setItem('access_token', response.data.session.access_token);
      localStorage.setItem('refresh_token', response.data.session.refresh_token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });

    // Clear stored tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: any }>> {
    return this.request<{ user: any }>('/auth/me');
  }

  async getProfile(): Promise<ApiResponse<any>> {
    return this.request('/auth/profile');
  }

  async initiateOAuth(provider: 'google' | 'azure', redirectTo?: string): Promise<ApiResponse<{ url: string }>> {
    return this.request<{ url: string }>('/auth/oauth/' + provider, {
      method: 'POST',
      body: JSON.stringify({ redirect_to: redirectTo }),
    });
  }

  async handleOAuthCallback(code: string, provider: 'google' | 'azure'): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/oauth/callback', {
      method: 'POST',
      body: JSON.stringify({ code, provider }),
    });

    // Store tokens if OAuth successful
    if (response.success && response.data?.session) {
      localStorage.setItem('access_token', response.data.session.access_token);
      localStorage.setItem('refresh_token', response.data.session.refresh_token);
    }

    return response;
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return {
        success: false,
        error: 'No refresh token available',
      };
    }

    const response = await this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    // Update stored tokens if refresh successful
    if (response.success && response.data?.session) {
      localStorage.setItem('access_token', response.data.session.access_token);
      localStorage.setItem('refresh_token', response.data.session.refresh_token);
    }

    return response;
  }

  // User management endpoints
  async getUsers(params?: { user_type?: string }): Promise<ApiResponse<any[]>> {
    const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<any[]>(`/users${queryParams}`);
  }

  async getUserStats(): Promise<ApiResponse<any>> {
    return this.request<any>('/users/stats');
  }

  async createUser(userData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse> {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Warehouse endpoints
  async getWarehouses(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/warehouses');
  }

  async getWarehouseStats(): Promise<ApiResponse<any>> {
    return this.request<any>('/warehouses/stats');
  }

  async createWarehouse(warehouseData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/warehouses', {
      method: 'POST',
      body: JSON.stringify(warehouseData),
    });
  }

  async updateWarehouse(id: string, warehouseData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/warehouses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(warehouseData),
    });
  }

  async deleteWarehouse(id: string): Promise<ApiResponse> {
    return this.request(`/warehouses/${id}`, {
      method: 'DELETE',
    });
  }

  // Zone endpoints
  async getZones(params?: { warehouse_id?: string }): Promise<ApiResponse<any[]>> {
    const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<any[]>(`/zones${queryParams}`);
  }

  async getZoneStats(params?: { warehouse_id?: string }): Promise<ApiResponse<any>> {
    const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<any>(`/zones/stats${queryParams}`);
  }

  async createZone(zoneData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/zones', {
      method: 'POST',
      body: JSON.stringify(zoneData),
    });
  }

  async updateZone(id: string, zoneData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/zones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(zoneData),
    });
  }

  async deleteZone(id: string): Promise<ApiResponse> {
    return this.request(`/zones/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

