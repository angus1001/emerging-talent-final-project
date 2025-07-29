import { NextApiRequest, NextApiResponse } from 'next';
import { getOne, getMany } from '../../../../../lib/db';
import { errorHandler, corsMiddleware } from '../../../../../middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS处理
  if (corsMiddleware(req, res)) return;

  const { userId } = req.query;

  if (!userId || Array.isArray(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getHoldings(req, res, parseInt(userId));
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

// 获取用户所有持仓
async function getHoldings(req: NextApiRequest, res: NextApiResponse, userId: number) {
  // 检查用户是否存在
  const user = await getOne('SELECT user_id FROM users WHERE user_id = $1', [userId]);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // 获取持仓信息，包括股票详情
  const holdings = await getMany(
    `SELECT h.holding_id, h.user_id, h.stock_id, h.total_shares, h.average_price, h.last_updated,
            s.symbol, s.company_name, s.current_price,
            (h.total_shares * s.current_price) as current_value,
            ((s.current_price - h.average_price) / h.average_price * 100) as gain_loss_percentage
     FROM holdings h
     JOIN stocks s ON h.stock_id = s.stock_id
     WHERE h.user_id = $1
     ORDER BY s.symbol`,
    [userId]
  );

  return res.status(200).json(holdings);
} 