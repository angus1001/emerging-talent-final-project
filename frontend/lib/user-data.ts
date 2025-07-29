import { userApi, ApiUser, getFullName, formatDate } from './api';

// Frontend user interface that extends the API user data
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  accountType: string;
  phone?: string;
  location?: string;
  language?: string;
  first_name: string;
  last_name: string;
}

// Mock current user ID - in a real app, this would come from authentication
const CURRENT_USER_ID = 1;

// Transform API user data to frontend user format
const transformApiUser = (apiUser: ApiUser): User => {
  return {
    id: apiUser.user_id.toString(),
    name: getFullName(apiUser),
    first_name: apiUser.first_name,
    last_name: apiUser.last_name,
    email: apiUser.email,
    phone: apiUser.phone,
    location: apiUser.location,
    language: apiUser.language,
    avatar: "/placeholder-user.jpg", // Default avatar
    joinDate: formatDate(apiUser.created_at),
    accountType: "Premium" // Default account type
  };
};

// Fallback user data for when API is not available
const fallbackUser: User = {
  id: "user-001",
  name: "Alex Chen",
  first_name: "Alex",
  last_name: "Chen",
  email: "alex.chen@example.com",
  avatar: "/placeholder-user.jpg",
  joinDate: "January 15, 2024",
  accountType: "Premium",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  language: "English"
};

// Get current user data from API
export const getUserData = async (): Promise<User> => {
  try {
    const apiUser = await userApi.getUserById(CURRENT_USER_ID);
    return transformApiUser(apiUser);
  } catch (error) {
    console.error('Failed to fetch user data from API:', error);
    // Return fallback data if API fails
    return fallbackUser;
  }
};

// Synchronous version for backwards compatibility (returns fallback data)
export const getUserDataSync = (): User => {
  return fallbackUser;
};


// Update user data
export const updateUserData = async (userData: Partial<{
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  language: string;
}>): Promise<User> => {
  try {
    const updatedApiUser = await userApi.updateUser(CURRENT_USER_ID, userData);
    return transformApiUser(updatedApiUser);
  } catch (error) {
    console.error('Failed to update user data:', error);
    throw error;
  }
};
