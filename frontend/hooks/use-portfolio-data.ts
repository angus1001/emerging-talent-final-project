import { useState, useEffect } from 'react';
import { 
  portfolioApi, 
  ordersApi, 
  watchlistApi,
  ApiPortfolioSummary, 
  ApiNetWorth, 
  ApiHolding, 
  ApiOrder, 
  ApiWatchlist 
} from '@/lib/api';

// Portfolio Summary Hook
export function usePortfolioSummary(userId: number) {
  const [portfolio, setPortfolio] = useState<ApiPortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        setLoading(true);
        setError(null);
        const data = await portfolioApi.getPortfolioSummary(userId);
        setPortfolio(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch portfolio');
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchPortfolio();
    }
  }, [userId]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await portfolioApi.getPortfolioSummary(userId);
      setPortfolio(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio');
    } finally {
      setLoading(false);
    }
  };

  return { portfolio, loading, error, refetch };
}

// Net Worth History Hook
export function useNetWorthHistory(userId: number, period?: '1d' | '1w' | '1m' | '3m' | '6m' | '1y') {
  const [netWorthHistory, setNetWorthHistory] = useState<ApiNetWorth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNetWorthHistory() {
      try {
        setLoading(true);
        setError(null);
        const data = await portfolioApi.getNetWorthHistory(userId, period);
        setNetWorthHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch net worth history');
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchNetWorthHistory();
    }
  }, [userId, period]);

  return { netWorthHistory, loading, error };
}

// User Holdings Hook
export function useUserHoldings(userId: number) {
  const [holdings, setHoldings] = useState<ApiHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHoldings() {
      try {
        setLoading(true);
        setError(null);
        const data = await portfolioApi.getUserHoldings(userId);
        setHoldings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch holdings');
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchHoldings();
    }
  }, [userId]);

  const deleteHolding = async (holdingId: number) => {
    try {
      await portfolioApi.deleteHolding(holdingId);
      setHoldings(holdings.filter(h => h.holding_id !== holdingId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete holding');
      return false;
    }
  };

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await portfolioApi.getUserHoldings(userId);
      setHoldings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch holdings');
    } finally {
      setLoading(false);
    }
  };

  return { holdings, loading, error, deleteHolding, refetch };
}

// User Orders Hook
export function useUserOrders(userId: number) {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        setError(null);
        const data = await ordersApi.getUserOrders(userId);
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const createOrder = async (orderData: Omit<ApiOrder, 'order_id'>) => {
    try {
      const newOrder = await ordersApi.createOrder(orderData);
      setOrders([newOrder, ...orders]);
      return newOrder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      return null;
    }
  };

  const updateOrderStatus = async (orderId: number, status: 'PENDING' | 'EXECUTED' | 'CANCELLED') => {
    try {
      const updatedOrder = await ordersApi.updateOrderStatus(orderId, status);
      setOrders(orders.map(order => 
        order.order_id === orderId ? updatedOrder : order
      ));
      return updatedOrder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
      return null;
    }
  };

  return { orders, loading, error, createOrder, updateOrderStatus };
}

// User Watchlist Hook
export function useUserWatchlist(userId: number) {
  const [watchlist, setWatchlist] = useState<ApiWatchlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWatchlist() {
      try {
        setLoading(true);
        setError(null);
        const data = await watchlistApi.getUserWatchlist(userId);
        setWatchlist(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch watchlist');
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchWatchlist();
    }
  }, [userId]);

  const addToWatchlist = async (watchlistData: Omit<ApiWatchlist, 'watchlist_id' | 'user_id'>) => {
    try {
      const newItem = await watchlistApi.addToWatchlist(userId, watchlistData);
      setWatchlist([...watchlist, newItem]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to watchlist');
      return null;
    }
  };

  const removeFromWatchlist = async (watchlistId: number) => {
    try {
      await watchlistApi.removeFromWatchlist(watchlistId);
      setWatchlist(watchlist.filter(item => item.watchlist_id !== watchlistId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from watchlist');
      return false;
    }
  };

  return { watchlist, loading, error, addToWatchlist, removeFromWatchlist };
}
