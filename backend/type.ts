// types.ts
export interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    password: string;
    email?: string;
    created_at?: string;
  }
  
  export interface Stock {
    stock_id: number;
    symbol: string;
    company_name: string;
    current_price: number;
    last_updated?: string;
  }
  
  export interface NetWorth {
    net_worth_id: number;
    user_id: number;
    total_balance: number;
    stock_value: number;
    date_recorded: string;
  }
  
  export interface Order {
    order_id: number;
    user_id: number;
    order_type: 'BUY' | 'SELL';
    stock_id: number;
    shares: number;
    price_per_share: number;
    date?: string;
    status?: 'PENDING' | 'EXECUTED' | 'CANCELLED';
  }
  
  export interface Holding {
    holding_id: number;
    user_id: number;
    stock_id: number;
    total_shares: number;
    average_price: number;
    last_updated?: string;
  }
  
  export interface Watchlist {
    watchlist_id: number;
    user_id: number;
    stock_id: number;
    display_name?: string;
    added_at?: string;
  }
  
  export interface PortfolioSummary {
    total_value: number;
    cash_balance: number;
    stock_value: number;
    holdings?: Holding[];
    last_updated?: string;
  }