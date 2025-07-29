// types.ts
export interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    password: string;
    email?: string;
    phone?: string;
    language?: string;
    location?: string;
    created_at?: string;
  }
  
  export interface Stock {
    stock_id: number;
    symbol: string;
    company_name: string;
    company_info?: string;
    exchange?: string;
    market_cap?: string;
    sector?: string;
    current_price: number;
    last_updated?: string;   
    volume?: string;
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
    duration?: string;
    quantity: number;
    total_value: number;
  }
  
  export interface Holding {
    holding_id: number;
    user_id: number;
    stock_id: number;
    total_shares: number;
    holding_number: number;
    total_value: number;
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