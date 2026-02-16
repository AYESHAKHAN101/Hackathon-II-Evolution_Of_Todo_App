// Base API URL - should be configured via environment variable
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Type definitions for API responses
export interface ApiResponse<T = any> {
  success?: boolean;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  data?: T;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  position: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  jwtToken: string;
  expiresIn: number;
}

export interface TaskListResponse {
  data: Task[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}

/**
 * Centralized API client with JWT attachment and error handling
 */
class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwtToken');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add JWT token if available
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jwtToken');
          document.cookie = 'auth_token=; path=/; max-age=0';
          window.location.href = '/login';
        }
        throw new Error('Unauthorized - redirecting to login');
      }

      // Handle 204 No Content (e.g., DELETE)
      if (response.status === 204) {
        return { success: true };
      }

      const responseData = await response.json();

      if (!response.ok) {
        // Backend returns { detail: { code, message, details } }
        const detail = responseData.detail;
        return {
          error: {
            code: detail?.code || `HTTP_${response.status}`,
            message: detail?.message || responseData.message || response.statusText,
            details: detail?.details || responseData.details,
          },
        };
      }

      return { data: responseData as T, success: true };
    } catch (error: any) {
      if (error.message?.includes('Unauthorized')) {
        return { error: { code: 'UNAUTHORIZED', message: error.message } };
      }
      return {
        error: {
          code: 'NETWORK_ERROR',
          message: error.message || 'Network error occurred',
        },
      };
    }
  }

  // Authentication endpoints
  async signup(email: string, password: string, confirmPassword: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, confirmPassword }),
    });
  }

  async signin(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signout(): Promise<ApiResponse> {
    return this.request('/auth/signout', {
      method: 'POST',
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Task management endpoints — backend routes: /api/{user_id}/  and /api/{user_id}/{task_id}
  async getUserTasks(userId: string, filters?: { completed?: boolean }): Promise<ApiResponse<TaskListResponse>> {
    const params = new URLSearchParams();
    if (filters?.completed !== undefined) {
      params.append('completed', String(filters.completed));
    }

    const queryString = params.toString();
    const endpoint = `/api/${userId}/${queryString ? `?${queryString}` : ''}`;

    return this.request<TaskListResponse>(endpoint);
  }

  async createTask(userId: string, taskData: { title: string; description?: string; position?: number }): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/api/${userId}/`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async getTask(userId: string, taskId: number): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/api/${userId}/${taskId}`);
  }

  async updateTask(userId: string, taskId: number, taskData: Partial<Task>): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/api/${userId}/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(userId: string, taskId: number): Promise<ApiResponse> {
    return this.request(`/api/${userId}/${taskId}`, {
      method: 'DELETE',
    });
  }

  async toggleTaskCompletion(userId: string, taskId: number): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/api/${userId}/${taskId}/complete`, {
      method: 'PATCH',
    });
  }

  // Utility methods
  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwtToken', token);
    }
  }

  removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwtToken');
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

// Export a singleton instance of the API client
export const apiClient = new ApiClient();

export default apiClient;
