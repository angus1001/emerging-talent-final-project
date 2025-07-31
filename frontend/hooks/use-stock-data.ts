import { useState, useEffect } from 'react';
import { 
  stockApi,
  ApiStock,
} from '@/lib/api';

// Stock Hook - simplified to match portfolio pattern
export function useStocks() {
  const [stocks, setStocks] = useState<ApiStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStocks() {
      try {
        setLoading(true);
        setError(null);
        const data = await stockApi.getAllStocks();
        setStocks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stocks');
      } finally {
        setLoading(false);
      }
    }

    fetchStocks();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stockApi.getAllStocks();
      setStocks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stocks');
    } finally {
      setLoading(false);
    }
  };

  return { stocks, loading, error, refetch };
}

// Individual Stock Hook
export function useStock(stockId: number) {
  const [stock, setStock] = useState<ApiStock | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStock() {
      try {
        setLoading(true);
        setError(null);
        const data = await stockApi.getStockById(stockId);
        setStock(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stock');
      } finally {
        setLoading(false);
      }
    }

    if (stockId) {
      fetchStock();
    }
  }, [stockId]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stockApi.getStockById(stockId);
      setStock(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock');
    } finally {
      setLoading(false);
    }
  };

  return { stock, loading, error, refetch };
}
