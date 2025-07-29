import { useState, useEffect, useCallback } from 'react';
import { 
  Stock, 
  MarketStock, 
  getAllStocks, 
  getStockById, 
  getMarketStocks, 
  getMarketStockById,
  searchStocks,
  getStocksBySector,
  getAvailableSectors
} from '@/lib/stock-data';

interface UseStocksReturn {
  stocks: Stock[];
  marketStocks: MarketStock[];
  loading: boolean;
  error: string | null;
  refetchStocks: () => Promise<void>;
  searchStocks: (query: string) => Promise<Stock[]>;
  getStocksBySector: (sector: string) => Promise<Stock[]>;
  getAvailableSectors: () => Promise<string[]>;
}

/**
 * Hook for managing all stocks data
 */
export const useStocks = (): UseStocksReturn => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [marketStocks, setMarketStocks] = useState<MarketStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [stocksData, marketStocksData] = await Promise.all([
        getAllStocks(),
        getMarketStocks()
      ]);
      
      setStocks(stocksData);
      setMarketStocks(marketStocksData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stocks';
      setError(errorMessage);
      console.error('Error fetching stocks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchStocks = useCallback(async () => {
    await fetchStocks();
  }, [fetchStocks]);

  const handleSearchStocks = useCallback(async (query: string): Promise<Stock[]> => {
    try {
      setError(null);
      return await searchStocks(query);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search stocks';
      setError(errorMessage);
      console.error('Error searching stocks:', err);
      return [];
    }
  }, []);

  const handleGetStocksBySector = useCallback(async (sector: string): Promise<Stock[]> => {
    try {
      setError(null);
      return await getStocksBySector(sector);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get stocks by sector';
      setError(errorMessage);
      console.error('Error getting stocks by sector:', err);
      return [];
    }
  }, []);

  const handleGetAvailableSectors = useCallback(async (): Promise<string[]> => {
    try {
      setError(null);
      return await getAvailableSectors();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get available sectors';
      setError(errorMessage);
      console.error('Error getting available sectors:', err);
      return [];
    }
  }, []);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  return {
    stocks,
    marketStocks,
    loading,
    error,
    refetchStocks,
    searchStocks: handleSearchStocks,
    getStocksBySector: handleGetStocksBySector,
    getAvailableSectors: handleGetAvailableSectors,
  };
};

interface UseStockReturn {
  stock: Stock | null;
  marketStock: MarketStock | null;
  loading: boolean;
  error: string | null;
  refetchStock: () => Promise<void>;
}

/**
 * Hook for managing single stock data
 */
export const useStock = (stockId: number | null): UseStockReturn => {
  const [stock, setStock] = useState<Stock | null>(null);
  const [marketStock, setMarketStock] = useState<MarketStock | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = useCallback(async () => {
    if (!stockId) {
      setStock(null);
      setMarketStock(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [stockData, marketStockData] = await Promise.all([
        getStockById(stockId),
        getMarketStockById(stockId)
      ]);
      
      setStock(stockData);
      setMarketStock(marketStockData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stock';
      setError(errorMessage);
      console.error(`Error fetching stock ${stockId}:`, err);
      setStock(null);
      setMarketStock(null);
    } finally {
      setLoading(false);
    }
  }, [stockId]);

  const refetchStock = useCallback(async () => {
    await fetchStock();
  }, [fetchStock]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  return {
    stock,
    marketStock,
    loading,
    error,
    refetchStock,
  };
};

interface UseMarketDataReturn {
  marketStocks: MarketStock[];
  loading: boolean;
  error: string | null;
  searchResults: MarketStock[];
  isSearching: boolean;
  searchError: string | null;
  refetchMarketData: () => Promise<void>;
  searchMarketStocks: (query: string) => Promise<void>;
  clearSearch: () => void;
}

/**
 * Hook specifically for market page functionality
 */
export const useMarketData = (): UseMarketDataReturn => {
  const [marketStocks, setMarketStocks] = useState<MarketStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<MarketStock[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const fetchMarketData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMarketStocks();
      setMarketStocks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch market data';
      setError(errorMessage);
      console.error('Error fetching market data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchMarketData = useCallback(async () => {
    await fetchMarketData();
  }, [fetchMarketData]);

  const searchMarketStocks = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      setSearchError(null);
      const results = await searchStocks(query);
      const marketResults = results.map(stock => ({
        id: stock.stock_id.toString(),
        symbol: stock.symbol,
        name: stock.company_name,
        price: stock.current_price || 0,
        change: 0, // Would need historical data to calculate
        changePercent: 0, // Would need historical data to calculate
        volume: stock.volume || '0',
        marketCap: stock.market_cap || '0',
        sector: stock.sector || 'Unknown',
        description: stock.company_info || '',
        exchange: stock.exchange || 'Unknown',
      }));
      setSearchResults(marketResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search stocks';
      setSearchError(errorMessage);
      console.error('Error searching market stocks:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
  }, []);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  return {
    marketStocks,
    loading,
    error,
    searchResults,
    isSearching,
    searchError,
    refetchMarketData,
    searchMarketStocks,
    clearSearch,
  };
};
