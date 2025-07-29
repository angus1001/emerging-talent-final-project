import { useState, useEffect } from 'react';
import { User, getUserData, updateUserData } from '@/lib/user-data';

interface UseUserDataReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
  updateUser: (userData: Partial<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    location: string;
    language: string;
  }>) => Promise<void>;
}

export const useUserData = (): UseUserDataReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getUserData();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userData: Partial<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    location: string;
    language: string;
  }>) => {
    try {
      setError(null);
      const updatedUser = await updateUserData(userData);
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user data');
      throw err;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    refetchUser: fetchUser,
    updateUser: handleUpdateUser,
  };
};
