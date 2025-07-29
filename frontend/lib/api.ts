// API service layer for handling all backend API calls

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// API Error class
export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.message || `HTTP Error: ${response.status}`,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'Network error or server unavailable');
  }
}

// User API functions
export const userApi = {
  // Get all users
  getUsers: () => apiRequest<ApiUser[]>('/users'),
  
  // Get user by ID
  getUserById: (userId: number) => apiRequest<ApiUser>(`/users/${userId}`),
  
  // Create new user
  createUser: (userData: CreateUserData) => 
    apiRequest<ApiUser>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  // Update user
  updateUser: (userId: number, userData: Partial<CreateUserData>) =>
    apiRequest<ApiUser>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  
  // Delete user
  deleteUser: (userId: number) =>
    apiRequest<{ message: string }>(`/users/${userId}`, {
      method: 'DELETE',
    }),
};

// Type definitions based on your API interface
export interface ApiUser {
  user_id: number;
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  phone?: string;
  created_at: string;
  language?: string;
  location?: string;
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  phone?: string;
  language?: string;
  location?: string;
}

// Helper function to get full name
export const getFullName = (user: ApiUser): string => {
  return `${user.first_name} ${user.last_name}`;
};

// Helper function to format date
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
