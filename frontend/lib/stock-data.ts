import { ApiError } from './utils';

// Stock data types based on API documentation
export interface StockHistoryPrice {
  date: string;
  price: number;
}

export interface Stock {
  stock_id: number;
  symbol: string;
  company_name: string;
  current_price?: number;
  last_updated?: string;
  exchange?: string;
  volume?: string;
  sector?: string;
  market_cap?: string;
  company_info?: string;
  in_list?: boolean;
  history_price?: StockHistoryPrice[];
}

// Legacy interface for backward compatibility with existing components
export interface MarketStock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  sector: string;
  description: string;
  exchange: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4523/m1/6849797-6564098-default';

/**
 * Fetch all stocks from the API
 */
export async function getAllStocks(): Promise<Stock[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/stocks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new ApiError(
        `Failed to fetch stocks: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const stocks: Stock[] = await response.json();
    return stocks;
  } catch (error) {
    console.error('Error fetching all stocks:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to fetch stocks', 500);
  }
}

/**
 * Fetch a specific stock by ID
 */
export async function getStockById(stockId: number): Promise<Stock> {
  try {
    const response = await fetch(`${API_BASE_URL}/stocks/${stockId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError('Stock not found', 404);
      }
      throw new ApiError(
        `Failed to fetch stock: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const stock: Stock = await response.json();
    return stock;
  } catch (error) {
    console.error(`Error fetching stock ${stockId}:`, error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to fetch stock', 500);
  }
}

/**
 * Convert API Stock data to MarketStock format for backward compatibility
 */
export function convertStockToMarketStock(stock: Stock): MarketStock {
  // Calculate change and change percent from history if available
  let change = 0;
  let changePercent = 0;
  
  if (stock.history_price && stock.history_price.length >= 2 && stock.current_price) {
    const sortedHistory = stock.history_price.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const previousPrice = sortedHistory[1]?.price;
    if (previousPrice) {
      change = stock.current_price - previousPrice;
      changePercent = (change / previousPrice) * 100;
    }
  }

  return {
    id: stock.stock_id.toString(),
    symbol: stock.symbol,
    name: stock.company_name,
    price: stock.current_price || 0,
    change,
    changePercent,
    volume: stock.volume || '0',
    marketCap: stock.market_cap || '0',
    sector: stock.sector || 'Unknown',
    description: stock.company_info || '',
    exchange: stock.exchange || 'Unknown',
  };
}

/**
 * Get all stocks formatted for market display
 */
export async function getMarketStocks(): Promise<MarketStock[]> {
  try {
    const stocks = await getAllStocks();
    return stocks.map(convertStockToMarketStock);
  } catch (error) {
    console.error('Error fetching market stocks:', error);
    throw error;
  }
}

/**
 * Get a specific stock formatted for market display
 */
export async function getMarketStockById(stockId: number): Promise<MarketStock> {
  try {
    const stock = await getStockById(stockId);
    return convertStockToMarketStock(stock);
  } catch (error) {
    console.error(`Error fetching market stock ${stockId}:`, error);
    throw error;
  }
}

/**
 * Search stocks by symbol or company name
 */
export async function searchStocks(query: string): Promise<Stock[]> {
  try {
    const allStocks = await getAllStocks();
    const searchTerm = query.toLowerCase();
    
    return allStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(searchTerm) ||
      stock.company_name.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching stocks:', error);
    throw error;
  }
}

/**
 * Get stocks by sector
 */
export async function getStocksBySector(sector: string): Promise<Stock[]> {
  try {
    const allStocks = await getAllStocks();
    return allStocks.filter(stock => 
      stock.sector?.toLowerCase() === sector.toLowerCase()
    );
  } catch (error) {
    console.error(`Error fetching stocks for sector ${sector}:`, error);
    throw error;
  }
}

/**
 * Get unique sectors from all stocks
 */
export async function getAvailableSectors(): Promise<string[]> {
  try {
    const allStocks = await getAllStocks();
    const sectors = new Set<string>();
    
    allStocks.forEach(stock => {
      if (stock.sector) {
        sectors.add(stock.sector);
      }
    });
    
    return Array.from(sectors).sort();
  } catch (error) {
    console.error('Error fetching available sectors:', error);
    throw error;
  }
}
