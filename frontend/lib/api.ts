// API service layer for handling all backend API calls

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/proxy';

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

    // Handle 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }

    // Check if response has content before parsing JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // For non-JSON responses, return empty object
      return {} as T;
    }
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
  cash?: number;
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

// Portfolio & Holdings Type Definitions
export interface ApiStock {
  stock_id: number;
  symbol: string;
  company_name: string;
  current_price: number;
  last_updated: string;
  exchange: string;
  volume: string;
  sector: string;
  market_cap: string;
  company_info: string;
  in_list: boolean;
  history_price?: Array<{
    date: string;
    price?: number;
    close_price?: number;
  }>;
  added_at?: string;
}

export interface ApiHolding {
  holding_id: number;
  user_id: number;
  stock_id: number;
  holding_number: number;
  average_price: number;
  stock: ApiStock;  // 单个股票对象，不是数组
  cash: number;
  total_value: number;
  last_updated: string;
}

export interface ApiPortfolioSummary {
  total_value: number | null;
  cash_balance?: number; // Optional since API may not return this
  stock_value: number | null;
  holdings: ApiHolding[];
  last_updated: string;
}

export interface ApiNetWorth {
  net_worth_id: number;
  user_id: number;
  total_balance: number;
  stock_value: number;
  date_recorded: string;
}

export interface ApiOrder {
  order_id: number;
  user_id: number;
  stock_id: number;
  order_type: 'BUY' | 'SELL';
  quantity: number;
  price_per_share: number;
  total_value: number;
  date: string;
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED';
  duration: string;
}

export interface ApiWatchlist {
  watchlist_id: number;
  user_id: number;
  stock_id: number;
  stock: ApiStock; // Single stock object, not array
  display_name: string;
  created_at: string;
}

// Portfolio API functions
export const portfolioApi = {
  // Get user's portfolio summary
  getPortfolioSummary: (userId: number) => 
    apiRequest<ApiPortfolioSummary>(`/users/${userId}/portfolio`),
  
  // Get net worth history
  getNetWorthHistory: (userId: number, period?: '1d' | '1w' | '1m' | '3m' | '6m' | '1y') => {
    const params = period ? `?period=${period}` : '';
    return apiRequest<ApiNetWorth[]>(`/users/${userId}/net-worth${params}`);
  },
  
  // Get all holdings for a user
  getUserHoldings: (userId: number) => 
    apiRequest<ApiHolding[]>(`/users/${userId}/holdings`),
  
  // Get holding by ID
  getHoldingById: (holdingId: number) => 
    apiRequest<ApiHolding>(`/holdings/${holdingId}`),
  
  // Delete a holding (sell all shares)
  deleteHolding: (holdingId: number) =>
    apiRequest<{ message: string }>(`/holdings/${holdingId}`, {
      method: 'DELETE',
    }),
};

// Orders API functions
export const ordersApi = {
  // Create a new order
  createOrder: (orderData: Omit<ApiOrder, 'order_id'>) =>
    apiRequest<ApiOrder>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  
  // Get all orders (admin only)
  getAllOrders: () => apiRequest<ApiOrder[]>('/orders'),
  
  // Get orders for a user
  getUserOrders: (userId: number) => 
    apiRequest<ApiOrder[]>(`/users/${userId}/orders`),
  
  // Get order by ID
  getOrderById: (orderId: number) => 
    apiRequest<ApiOrder>(`/orders/${orderId}`),
  
  // Update order status
  updateOrderStatus: (orderId: number, status: 'PENDING' | 'EXECUTED' | 'CANCELLED') =>
    apiRequest<ApiOrder>(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// Watchlist API functions
export const watchlistApi = {
  // Get user's watchlist
  getUserWatchlist: (userId: number) => 
    apiRequest<ApiWatchlist[]>(`/users/${userId}/watchlist`),
  
  // Add item to watchlist
  addToWatchlist: (userId: number, watchlistData: Omit<ApiWatchlist, 'watchlist_id' | 'user_id'>) =>
    apiRequest<ApiWatchlist>(`/users/${userId}/watchlist`, {
      method: 'POST',
      body: JSON.stringify(watchlistData),
    }),
  
  // Get watchlist item by ID
  getWatchlistItemById: (watchlistId: number) => 
    apiRequest<ApiWatchlist>(`/watchlist/${watchlistId}`),
  
  // Remove item from watchlist
  removeFromWatchlist: (watchlistId: number) =>
    apiRequest<{ message: string }>(`/watchlist/${watchlistId}`, {
      method: 'DELETE',
    }),
};

// Stock API functions
export const stockApi = {
  // Get all stocks
  getAllStocks: () => apiRequest<ApiStock[]>('/stocks'),
  
  // Get stock by ID
  getStockById: (stockId: number) => 
    apiRequest<ApiStock>(`/stocks/${stockId}`),
};

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

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Helper function to calculate percentage change
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (!current || !previous || previous === 0 || isNaN(current) || isNaN(previous)) return 0;
  const result = ((current - previous) / previous) * 100;
  return isNaN(result) ? 0 : result;
};
