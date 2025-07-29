import { NextApiRequest, NextApiResponse } from 'next';
import { getOne, getMany } from '../../../../../lib/db';
import { errorHandler } from '../../../../../middleware/middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  

  const { userId } = req.query;

  if (!userId || Array.isArray(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getUserOrders(req, res, parseInt(userId));
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

// 获取用户的订单
async function getUserOrders(req: NextApiRequest, res: NextApiResponse, userId: number) {
  // 检查用户是否存在
  const user = await getOne('SELECT user_id FROM users WHERE user_id = $1', [userId]);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // 获取用户的订单
  const orders = await getMany(
    `SELECT o.order_id, o.user_id, o.order_type, o.stock_id, o.shares, o.price_per_share, o.date, o.status,
            s.symbol, s.company_name,
            (o.shares * o.price_per_share) as total_amount
     FROM orders o
     JOIN stocks s ON o.stock_id = s.stock_id
     WHERE o.user_id = $1
     ORDER BY o.date DESC`,
    [userId]
  );

  return res.status(200).json(orders);
} 