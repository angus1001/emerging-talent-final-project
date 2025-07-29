import { NextApiRequest, NextApiResponse } from 'next';
import { getMany, getOne, query } from '../../../../lib/db';
import { errorHandler, validateRequest, corsMiddleware } from '../../../../middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS处理
  if (corsMiddleware(req, res)) return;

  try {
    switch (req.method) {
      case 'GET':
        return await getOrders(req, res);
      case 'POST':
        return await createOrder(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

// 获取所有订单（管理员功能）
async function getOrders(req: NextApiRequest, res: NextApiResponse) {
  const orders = await getMany(
    `SELECT o.order_id, o.user_id, o.order_type, o.stock_id, o.shares, o.price_per_share, o.date, o.status,
            s.symbol, s.company_name,
            u.first_name, u.last_name
     FROM orders o
     JOIN stocks s ON o.stock_id = s.stock_id
     JOIN users u ON o.user_id = u.user_id
     ORDER BY o.date DESC`
  );
  
  return res.status(200).json(orders);
}

// 创建新订单
async function createOrder(req: NextApiRequest, res: NextApiResponse) {
  const requiredFields = ['user_id', 'order_type', 'stock_id', 'shares', 'price_per_share'];
  const validationError = validateRequest(req, res, requiredFields);
  if (validationError) return validationError;

  const { user_id, order_type, stock_id, shares, price_per_share } = req.body;

  // 验证订单类型
  if (!['BUY', 'SELL'].includes(order_type)) {
    return res.status(400).json({ error: 'Invalid order type' });
  }

  // 验证股票是否存在
  const stock = await getOne('SELECT stock_id FROM stocks WHERE stock_id = $1', [stock_id]);
  if (!stock) {
    return res.status(400).json({ error: 'Stock not found' });
  }

  // 验证用户是否存在
  const user = await getOne('SELECT user_id FROM users WHERE user_id = $1', [user_id]);
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  // 如果是卖出订单，检查是否有足够的持仓
  if (order_type === 'SELL') {
    const holding = await getOne(
      'SELECT total_shares FROM holdings WHERE user_id = $1 AND stock_id = $2',
      [user_id, stock_id]
    );
    
    if (!holding || holding.total_shares < shares) {
      return res.status(400).json({ error: 'Insufficient shares to sell' });
    }
  }

  // 创建订单
  const newOrder = await getOne(
    `INSERT INTO orders (user_id, order_type, stock_id, shares, price_per_share, date, status) 
     VALUES ($1, $2, $3, $4, $5, NOW(), 'PENDING') 
     RETURNING order_id, user_id, order_type, stock_id, shares, price_per_share, date, status`,
    [user_id, order_type, stock_id, shares, price_per_share]
  );

  return res.status(201).json(newOrder);
} 