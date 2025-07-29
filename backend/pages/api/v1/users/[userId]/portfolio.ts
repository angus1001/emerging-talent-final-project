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
        return await getPortfolioSummary(req, res, parseInt(userId));
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

// 获取用户投资组合摘要
async function getPortfolioSummary(req: NextApiRequest, res: NextApiResponse, userId: number) {
  // 检查用户是否存在
  const user = await getOne('SELECT user_id FROM users WHERE user_id = $1', [userId]);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // 获取持仓信息
  const holdings = await getMany(
    `SELECT h.holding_id, h.user_id, h.stock_id, h.total_shares, h.average_price, h.last_updated,
            s.symbol, s.company_name, s.current_price
     FROM holdings h
     JOIN stocks s ON h.stock_id = s.stock_id
     WHERE h.user_id = $1 AND h.total_shares > 0
     ORDER BY s.symbol`,
    [userId]
  );

  // 计算股票总价值
  const stockValue = holdings.reduce((total, holding) => {
    return total + (holding.total_shares * holding.current_price);
  }, 0);

  // 获取现金余额（这里假设有一个cash_balance字段，实际可能需要从其他表获取）
  const cashBalance = 10000; // 示例值，实际应该从数据库获取

  const portfolioSummary = {
    total_value: stockValue + cashBalance,
    cash_balance: cashBalance,
    stock_value: stockValue,
    holdings: holdings,
    last_updated: new Date().toISOString()
  };

  return res.status(200).json(portfolioSummary);
} 