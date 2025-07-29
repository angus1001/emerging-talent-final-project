import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiDocs = {
    title: 'Financial Portfolio Management API',
    version: '1.0.0',
    description: 'API for managing financial portfolios including stocks, bonds, and cash',
    baseUrl: '/api/v1',
    endpoints: {
      users: {
        'GET /users': {
          description: 'Get all users',
          parameters: [],
          responses: {
            200: 'List of users',
            500: 'Internal server error'
          }
        },
        'POST /users': {
          description: 'Create a new user',
          parameters: [
            { name: 'first_name', type: 'string', required: true },
            { name: 'last_name', type: 'string', required: true },
            { name: 'email', type: 'string', required: true },
            { name: 'password', type: 'string', required: true }
          ],
          responses: {
            201: 'User created successfully',
            400: 'Invalid input or email already exists',
            500: 'Internal server error'
          }
        },
        'GET /users/{userId}': {
          description: 'Get user by ID',
          parameters: [
            { name: 'userId', type: 'integer', required: true, in: 'path' }
          ],
          responses: {
            200: 'User details',
            404: 'User not found',
            500: 'Internal server error'
          }
        },
        'PUT /users/{userId}': {
          description: 'Update user details',
          parameters: [
            { name: 'userId', type: 'integer', required: true, in: 'path' },
            { name: 'first_name', type: 'string', required: false },
            { name: 'last_name', type: 'string', required: false },
            { name: 'email', type: 'string', required: false }
          ],
          responses: {
            200: 'User updated successfully',
            404: 'User not found',
            400: 'Invalid input',
            500: 'Internal server error'
          }
        },
        'DELETE /users/{userId}': {
          description: 'Delete a user',
          parameters: [
            { name: 'userId', type: 'integer', required: true, in: 'path' }
          ],
          responses: {
            204: 'User deleted successfully',
            404: 'User not found',
            500: 'Internal server error'
          }
        }
      },
      stocks: {
        'GET /stocks': {
          description: 'Get all stocks',
          parameters: [],
          responses: {
            200: 'List of stocks',
            500: 'Internal server error'
          }
        },
        'GET /stocks/{stockId}': {
          description: 'Get stock by ID',
          parameters: [
            { name: 'stockId', type: 'integer', required: true, in: 'path' }
          ],
          responses: {
            200: 'Stock details',
            404: 'Stock not found',
            500: 'Internal server error'
          }
        }
      },
      portfolio: {
        'GET /users/{userId}/portfolio': {
          description: 'Get user portfolio summary',
          parameters: [
            { name: 'userId', type: 'integer', required: true, in: 'path' }
          ],
          responses: {
            200: 'Portfolio summary',
            404: 'User not found',
            500: 'Internal server error'
          }
        },
        'GET /users/{userId}/net-worth': {
          description: 'Get net worth history',
          parameters: [
            { name: 'userId', type: 'integer', required: true, in: 'path' },
            { name: 'period', type: 'string', required: false, in: 'query', enum: ['1d', '1w', '1m', '3m', '6m', '1y'] }
          ],
          responses: {
            200: 'Net worth history',
            404: 'User not found',
            500: 'Internal server error'
          }
        },
        'GET /users/{userId}/holdings': {
          description: 'Get all holdings for a user',
          parameters: [
            { name: 'userId', type: 'integer', required: true, in: 'path' }
          ],
          responses: {
            200: 'List of holdings',
            404: 'User not found',
            500: 'Internal server error'
          }
        }
      },
      orders: {
        'GET /orders': {
          description: 'Get all orders (admin only)',
          parameters: [],
          responses: {
            200: 'List of orders',
            500: 'Internal server error'
          }
        },
        'POST /orders': {
          description: 'Create a new order',
          parameters: [
            { name: 'user_id', type: 'integer', required: true },
            { name: 'order_type', type: 'string', required: true, enum: ['BUY', 'SELL'] },
            { name: 'stock_id', type: 'integer', required: true },
            { name: 'shares', type: 'integer', required: true },
            { name: 'price_per_share', type: 'number', required: true }
          ],
          responses: {
            201: 'Order created successfully',
            400: 'Invalid order or insufficient shares',
            500: 'Internal server error'
          }
        },
        'GET /users/{userId}/orders': {
          description: 'Get orders for a user',
          parameters: [
            { name: 'userId', type: 'integer', required: true, in: 'path' }
          ],
          responses: {
            200: 'List of user orders',
            404: 'User not found',
            500: 'Internal server error'
          }
        },
        'GET /orders/{orderId}': {
          description: 'Get order by ID',
          parameters: [
            { name: 'orderId', type: 'integer', required: true, in: 'path' }
          ],
          responses: {
            200: 'Order details',
            404: 'Order not found',
            500: 'Internal server error'
          }
        },
        'PUT /orders/{orderId}': {
          description: 'Update order status',
          parameters: [
            { name: 'orderId', type: 'integer', required: true, in: 'path' },
            { name: 'status', type: 'string', required: true, enum: ['PENDING', 'EXECUTED', 'CANCELLED'] }
          ],
          responses: {
            200: 'Order updated successfully',
            404: 'Order not found',
            400: 'Invalid status',
            500: 'Internal server error'
          }
        }
      },
      holdings: {
        'GET /holdings/{holdingId}': {
          description: 'Get holding by ID',
          parameters: [
            { name: 'holdingId', type: 'integer', required: true, in: 'path' }
          ],
          responses: {
            200: 'Holding details',
            404: 'Holding not found',
            500: 'Internal server error'
          }
        },
        'DELETE /holdings/{holdingId}': {
          description: 'Delete a holding (sell all shares)',
          parameters: [
            { name: 'holdingId', type: 'integer', required: true, in: 'path' }
          ],
          responses: {
            204: 'Holding deleted successfully',
            404: 'Holding not found',
            500: 'Internal server error'
          }
        }
      },
      watchlist: {
        'GET /users/{userId}/watchlist': {
          description: 'Get user watchlist',
          parameters: [
            { name: 'userId', type: 'integer', required: true, in: 'path' }
          ],
          responses: {
            200: 'Watchlist items',
            404: 'User not found',
            500: 'Internal server error'
          }
        },
        'POST /users/{userId}/watchlist': {
          description: 'Add item to watchlist',
          parameters: [
            { name: 'userId', type: 'integer', required: true, in: 'path' },
            { name: 'stock_id', type: 'integer', required: true },
            { name: 'display_name', type: 'string', required: false }
          ],
          responses: {
            201: 'Item added to watchlist',
            400: 'Invalid input or stock already in watchlist',
            404: 'User or stock not found',
            500: 'Internal server error'
          }
        },
        'GET /watchlist/{watchlistId}': {
          description: 'Get watchlist item by ID',
          parameters: [
            { name: 'watchlistId', type: 'integer', required: true, in: 'path' }
          ],
          responses: {
            200: 'Watchlist item details',
            404: 'Item not found',
            500: 'Internal server error'
          }
        },
        'DELETE /watchlist/{watchlistId}': {
          description: 'Remove item from watchlist',
          parameters: [
            { name: 'watchlistId', type: 'integer', required: true, in: 'path' }
          ],
          responses: {
            204: 'Item removed successfully',
            404: 'Item not found',
            500: 'Internal server error'
          }
        }
      }
    },
    dataModels: {
      User: {
        user_id: 'integer',
        first_name: 'string',
        last_name: 'string',
        email: 'string',
        password: 'string (hashed)',
        created_at: 'datetime'
      },
      Stock: {
        stock_id: 'integer',
        symbol: 'string (1-5 characters)',
        company_name: 'string',
        current_price: 'number',
        last_updated: 'datetime'
      },
      Order: {
        order_id: 'integer',
        user_id: 'integer',
        order_type: 'string (BUY/SELL)',
        stock_id: 'integer',
        shares: 'integer',
        price_per_share: 'number',
        date: 'datetime',
        status: 'string (PENDING/EXECUTED/CANCELLED)'
      },
      Holding: {
        holding_id: 'integer',
        user_id: 'integer',
        stock_id: 'integer',
        total_shares: 'integer',
        average_price: 'number',
        last_updated: 'datetime'
      },
      Watchlist: {
        watchlist_id: 'integer',
        user_id: 'integer',
        stock_id: 'integer',
        display_name: 'string (optional)',
        added_at: 'datetime'
      },
      PortfolioSummary: {
        total_value: 'number',
        cash_balance: 'number',
        stock_value: 'number',
        holdings: 'array of Holding objects',
        last_updated: 'datetime'
      }
    }
  };

  res.status(200).json(apiDocs);
} 