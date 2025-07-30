# Portfolio API Integration - UPDATED

This document describes the comprehensive portfolio-related API integration implemented in the frontend application.

## Overview

The portfolio API integration provides the following functionality:
- Portfolio summary and asset management
- Holdings management 
- Net worth history tracking
- Order management
- Watchlist functionality

## API Endpoints Used

Based on the Portfolio Manager.md specification, the following endpoints are integrated:

### Portfolio Endpoints
- `GET /users/{userId}/portfolio` - Get user's portfolio summary
- `GET /users/{userId}/net-worth` - Get net worth history
- `GET /users/{userId}/holdings` - Get all holdings for a user
- `GET /holdings/{holdingId}` - Get holding by ID
- `DELETE /holdings/{holdingId}` - Delete a holding (sell all shares)

### Order Endpoints
- `POST /orders` - Create a new order
- `GET /users/{userId}/orders` - Get orders for a user
- `GET /orders/{orderId}` - Get order by ID
- `PUT /orders/{orderId}` - Update order status

### Watchlist Endpoints
- `GET /users/{userId}/watchlist` - Get user's watchlist
- `POST /users/{userId}/watchlist` - Add item to watchlist
- `DELETE /watchlist/{watchlistId}` - Remove item from watchlist

## Files Modified/Created

### New Files
1. **`/hooks/use-portfolio-data.ts`** - React hooks for portfolio data
   - `usePortfolioSummary(userId)` - Get portfolio summary
   - `useUserHoldings(userId)` - Get user holdings  
   - `useNetWorthHistory(userId, period)` - Get net worth history
   - `useUserOrders(userId)` - Get user orders
   - `useUserWatchlist(userId)` - Get user watchlist

2. **`/lib/portfolio-data.ts`** - Data transformation utilities
   - Type definitions for portfolio data
   - Conversion functions from API to frontend format
   - Utility functions for calculations and formatting

3. **`/test/portfolio-api-test.ts`** - API testing utilities

### Modified Files
1. **`/lib/api.ts`** - Added portfolio API functions and types
   - Added `portfolioApi`, `ordersApi`, `watchlistApi` objects
   - Added TypeScript interfaces for API responses
   - Added helper functions for currency formatting

2. **`/app/account/page.tsx`** - Updated to use real API data
   - Replaced hardcoded `userHoldings` with API data
   - Added loading and error states
   - Updated property names to match API response

3. **`/app/page.tsx`** - Updated main portfolio page
   - Integrated portfolio API for real-time data
   - Added loading and error handling
   - Updated to use new portfolio data structure

## Usage Examples

### Basic Portfolio Data Fetching
```typescript
import { usePortfolioSummary } from '@/hooks/use-portfolio-data';

function PortfolioComponent() {
  const userId = 1;
  const { portfolio, loading, error, refetch } = usePortfolioSummary(userId);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>Portfolio Value: ${portfolio?.total_value}</h2>
      <p>Cash Balance: ${portfolio?.cash_balance}</p>
    </div>
  );
}
```

### Holdings Management
```typescript
import { useUserHoldings } from '@/hooks/use-portfolio-data';
import { convertApiHoldingsToUserHoldings } from '@/lib/portfolio-data';

function HoldingsComponent() {
  const userId = 1;
  const { holdings, loading, error, deleteHolding } = useUserHoldings(userId);
  
  const userHoldings = holdings ? convertApiHoldingsToUserHoldings(holdings) : [];
  
  return (
    <div>
      {userHoldings.map(holding => (
        <div key={holding.id}>
          <span>{holding.symbol}: {holding.shares} shares</span>
          <button onClick={() => deleteHolding(parseInt(holding.id.split('-')[1]))}>
            Sell All
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Net Worth History for Charts
```typescript
import { useNetWorthHistory } from '@/hooks/use-portfolio-data';
import { convertApiNetWorthToChartData } from '@/lib/portfolio-data';

function NetWorthChart() {
  const userId = 1;
  const { netWorthHistory, loading, error } = useNetWorthHistory(userId, '1m');
  
  const chartData = convertApiNetWorthToChartData(netWorthHistory);
  
  // Use chartData with your charting library
  return <div>Chart component here</div>;
}
```

## Data Flow

1. **API Layer** (`/lib/api.ts`) - Handles HTTP requests to backend
2. **Hooks Layer** (`/hooks/use-portfolio-data.ts`) - Manages state and data fetching
3. **Transformation Layer** (`/lib/portfolio-data.ts`) - Converts API data to frontend format
4. **Component Layer** - React components consume transformed data

## Type Safety

All API responses are typed with TypeScript interfaces:
- `ApiPortfolioSummary` - Portfolio summary from API
- `ApiHolding` - Individual holding data
- `ApiNetWorth` - Net worth history point
- `ApiOrder` - Order data
- `UserHolding` - Frontend holding format
- `PortfolioSummary` - Frontend portfolio format

## Error Handling

- All hooks include error states
- Network errors are caught and displayed to users
- Loading states prevent UI flickering
- Graceful fallbacks for missing data

## Configuration

The API base URL is configured in `/lib/api.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4523/m1/6849797-6564098-default';
```

## Testing

Use the test script to verify API integration:
```javascript
// In browser console
testPortfolioAPIs()
```

This will test all portfolio-related endpoints and log responses.

## Migration Summary

### From Hardcoded Data to API Integration

#### Account Page Changes
- **Before**: Used hardcoded `userHoldings` array
- **After**: Uses `useUserHoldings()` hook with real API data
- **Benefits**: Real-time data, accurate holdings information

#### Main Portfolio Page Changes  
- **Before**: Used mock `mockPortfolio` object with static data
- **After**: Uses `usePortfolioSummary()` hook with live portfolio data
- **Benefits**: Real portfolio values, live stock prices, accurate calculations

#### New Data Transformation Layer
- Created `portfolio-data.ts` for converting API responses to frontend format
- Added type-safe interfaces for all data structures
- Implemented helper functions for calculations and formatting

## Integration Checklist

- [x] Portfolio summary API integration
- [x] Holdings management API integration  
- [x] Net worth history API integration
- [x] Order management API integration
- [x] Watchlist API integration
- [x] Account page updated to use real data
- [x] Main portfolio page updated to use real data
- [x] Loading states added throughout
- [x] Error handling implemented
- [x] Type safety with TypeScript interfaces
- [x] Data transformation utilities created
- [x] Documentation and testing utilities

## Next Steps

1. Implement real-time updates using WebSockets
2. Add caching for better performance
3. Implement optimistic updates for better UX
4. Add comprehensive error boundaries
5. Implement order creation/execution flows
6. Add pagination for large data sets
7. Implement search and filtering capabilities
