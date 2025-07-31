// Portfolio data utilities and conversion functions
import { 
  ApiPortfolioSummary, 
  ApiHolding, 
  ApiNetWorth, 
  ApiOrder, 
  ApiStock,
  formatCurrency,
  calculatePercentageChange 
} from '@/lib/api';

// Convert API portfolio data to frontend format
export interface PortfolioAsset {
  id: string;
  name: string;
  type: 'stock' | 'cash';
  symbol: string;
  shares?: number;
  quantity: number; // Required for components
  currentPrice: number; // Required for components
  averagePrice?: number;
  purchasePrice: number; // Required for PortfolioInsights component
  value: number;
  totalValue: number; // Required for components
  change?: number;
  gain: number; // Required for components
  changePercent?: number;
  gainPercent: number; // Required for components
  sector?: string;
}

export interface PortfolioSummary {
  totalValue: number;
  cashBalance: number;
  stockValue: number;
  totalChange: number;
  totalChangePercent: number;
  totalGain: number; // alias for totalChange
  totalGainPercent: number; // alias for totalChangePercent
  dayChange: number; // For now, same as totalChange
  dayChangePercent: number; // For now, same as totalChangePercent
  assets: PortfolioAsset[];
  lastUpdated: string;
}

// Convert API portfolio to frontend format
export function convertApiPortfolioToSummary(
  apiPortfolio: ApiPortfolioSummary,
  cashBalance?: number
): PortfolioSummary {
  const assets: PortfolioAsset[] = [];

  // Safely handle cash balance with fallbacks
  const effectiveCashBalance = cashBalance !== undefined 
    ? cashBalance 
    : (apiPortfolio.cash_balance || 0);

  // Add cash as an asset if there's any cash balance
  if (effectiveCashBalance > 0) {
    assets.push({
      id: 'cash',
      name: 'Cash',
      type: 'cash',
      symbol: 'CASH',
      value: effectiveCashBalance,
      totalValue: effectiveCashBalance,
      quantity: 1,
      shares: 1,
      currentPrice: effectiveCashBalance,
      averagePrice: effectiveCashBalance,
      purchasePrice: effectiveCashBalance,
      change: 0,
      gain: 0,
      changePercent: 0,
      gainPercent: 0,
    });
  }

  // Safely convert holdings to assets with proper null checks
  if (apiPortfolio.holdings && Array.isArray(apiPortfolio.holdings)) {
    apiPortfolio.holdings.forEach(holding => {
      if (!holding || !holding.stock) return; // Skip invalid holdings
      
      const stock = holding.stock;
      const currentValue = (stock.current_price || 0) * (holding.holding_number || 0);
      const costBasis = (holding.average_price || 0) * (holding.holding_number || 0);
      const change = currentValue - costBasis;
      const changePercent = calculatePercentageChange(currentValue, costBasis);

      assets.push({
        id: `stock-${stock.stock_id || holding.holding_id}`,
        name: stock.company_name || 'Unknown Company',
        type: 'stock',
        symbol: stock.symbol || 'N/A',
        shares: holding.holding_number || 0,
        quantity: holding.holding_number || 0,
        currentPrice: stock.current_price || 0,
        averagePrice: holding.average_price || 0,
        purchasePrice: holding.average_price || 0,
        value: currentValue,
        totalValue: currentValue,
        change: change,
        gain: change,
        changePercent: changePercent,
        gainPercent: changePercent,
        sector: stock.sector || 'Unknown',
      });
    });
  }

  // Calculate totals with safe fallbacks
  const totalChange = assets
    .filter(asset => asset.change !== undefined)
    .reduce((sum, asset) => sum + (asset.change || 0), 0);

  // Calculate total value if not provided by API or is null
  const calculatedStockValue = assets
    .filter(asset => asset.type === 'stock')
    .reduce((sum, asset) => sum + (asset.totalValue || 0), 0);
  
  const calculatedTotalValue = calculatedStockValue + effectiveCashBalance;
  
  // Handle null total_value from API
  const finalTotalValue = (apiPortfolio.total_value !== null && apiPortfolio.total_value !== undefined) 
    ? apiPortfolio.total_value 
    : calculatedTotalValue;

  const finalStockValue = (apiPortfolio.stock_value !== null && apiPortfolio.stock_value !== undefined)
    ? apiPortfolio.stock_value
    : calculatedStockValue;

  const totalChangePercent = calculatePercentageChange(
    finalTotalValue,
    finalTotalValue - totalChange
  );

  return {
    totalValue: finalTotalValue || 0,
    cashBalance: effectiveCashBalance,
    stockValue: finalStockValue || 0,
    totalChange: totalChange || 0,
    totalChangePercent: totalChangePercent || 0,
    totalGain: totalChange || 0,
    totalGainPercent: totalChangePercent || 0,
    dayChange: totalChange || 0,
    dayChangePercent: totalChangePercent || 0,
    assets,
    lastUpdated: apiPortfolio.last_updated || new Date().toISOString(),
  };
}

// Convert holdings to user holdings format (for account page)
export interface UserHolding {
  id: string;
  name: string;
  symbol: string;
  shares: number;
  averagePrice: number;
  currentPrice: number;
  value: number;
  change: number;
  changePercent: number;
  sector: string;
}

export function convertApiHoldingsToUserHoldings(apiHoldings: ApiHolding[]): UserHolding[] {
  const userHoldings: UserHolding[] = [];

  apiHoldings.forEach(holding => {
    const stock = holding.stock;
    const currentValue = stock.current_price * holding.holding_number;
    const costBasis = holding.average_price * holding.holding_number;
    const change = currentValue - costBasis;
    const changePercent = calculatePercentageChange(currentValue, costBasis);

    userHoldings.push({
      id: `holding-${holding.holding_id}-${stock.symbol}`,
      name: stock.company_name,
      symbol: stock.symbol,
      shares: holding.holding_number,
      averagePrice: holding.average_price,
      currentPrice: stock.current_price,
      value: currentValue,
      change,
      changePercent,
      sector: stock.sector,
    });
  });

  return userHoldings;
}

// Convert net worth history for charts
export interface NetWorthPoint {
  date: string;
  value: number;
  stockValue: number;
  cashValue: number;
}

export function convertApiNetWorthToChartData(apiNetWorth: ApiNetWorth[]): NetWorthPoint[] {
  return apiNetWorth.map(point => ({
    date: point.date_recorded,
    value: point.total_balance,
    stockValue: point.stock_value,
    cashValue: point.total_balance - point.stock_value,
  }));
}

// Convert orders for transaction history
export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  shares: number;
  price: number;
  total: number;
  date: string;
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED';
}

export function convertApiOrdersToTransactions(apiOrders: ApiOrder[]): Transaction[] {
  return apiOrders.map(order => ({
    id: `order-${order.order_id}`,
    type: order.order_type,
    symbol: `Stock-${order.stock_id}`, // You might want to join with stock data to get actual symbol
    shares: order.quantity,
    price: order.price_per_share,
    total: order.total_value,
    date: order.date,
    status: order.status,
  }));
}

// Portfolio analytics utilities
export function calculatePortfolioMetrics(portfolio: PortfolioSummary) {
  const stockAssets = portfolio.assets.filter(asset => asset.type === 'stock');
  
  // Sector allocation
  const sectorAllocation = stockAssets.reduce((acc, asset) => {
    if (asset.sector) {
      acc[asset.sector] = (acc[asset.sector] || 0) + asset.value;
    }
    return acc;
  }, {} as Record<string, number>);

  // Top holdings
  const topHoldings = stockAssets
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Performance metrics
  const gainers = stockAssets
    .filter(asset => (asset.changePercent || 0) > 0)
    .sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0))
    .slice(0, 3);

  const losers = stockAssets
    .filter(asset => (asset.changePercent || 0) < 0)
    .sort((a, b) => (a.changePercent || 0) - (b.changePercent || 0))
    .slice(0, 3);

  return {
    sectorAllocation,
    topHoldings,
    gainers,
    losers,
    totalStocks: stockAssets.length,
    avgReturn: stockAssets.length > 0 
      ? stockAssets.reduce((sum, asset) => sum + (asset.changePercent || 0), 0) / stockAssets.length 
      : 0,
  };
}

// Format helpers
export function formatHoldingValue(value: number): string {
  return formatCurrency(value);
}

export function formatChange(change: number, changePercent: number): {
  value: string;
  percent: string;
  isPositive: boolean;
} {
  const isPositive = change >= 0;
  const sign = isPositive ? '+' : '';
  
  return {
    value: `${sign}${formatCurrency(change)}`,
    percent: `${sign}${changePercent.toFixed(2)}%`,
    isPositive,
  };
}

export function formatShares(shares: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(shares);
}
