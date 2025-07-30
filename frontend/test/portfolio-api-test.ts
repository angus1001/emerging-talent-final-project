// Test script to verify portfolio API integration
import { portfolioApi, ordersApi, watchlistApi } from '../lib/api';

async function testPortfolioAPIs() {
  console.log('Testing Portfolio APIs...');
  
  const userId = 1; // Test user ID
  
  try {
    // Test portfolio summary
    console.log('1. Testing portfolio summary...');
    const portfolio = await portfolioApi.getPortfolioSummary(userId);
    console.log('Portfolio:', portfolio);
    
    // Test user holdings
    console.log('2. Testing user holdings...');
    const holdings = await portfolioApi.getUserHoldings(userId);
    console.log('Holdings:', holdings);
    
    // Test net worth history
    console.log('3. Testing net worth history...');
    const netWorth = await portfolioApi.getNetWorthHistory(userId, '1m');
    console.log('Net Worth History:', netWorth);
    
    // Test user orders
    console.log('4. Testing user orders...');
    const orders = await ordersApi.getUserOrders(userId);
    console.log('Orders:', orders);
    
    // Test watchlist
    console.log('5. Testing user watchlist...');
    const watchlist = await watchlistApi.getUserWatchlist(userId);
    console.log('Watchlist:', watchlist);
    
    console.log('All API tests completed successfully!');
    
  } catch (error) {
    console.error('API test failed:', error);
  }
}

// Export test function for use in browser console
(window as any).testPortfolioAPIs = testPortfolioAPIs;

console.log('Portfolio API test script loaded. Run testPortfolioAPIs() in console to test.');
