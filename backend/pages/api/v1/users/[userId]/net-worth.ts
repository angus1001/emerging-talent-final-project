import { NextApiRequest, NextApiResponse } from 'next';
import { getOne, getMany } from '../../../../../lib/db';
import { errorHandler } from '../../../../../middleware/middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  

  const { userId } = req.query;
  const { period = '1m' } = req.query;

  if (!userId || Array.isArray(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getNetWorthHistory(req, res, parseInt(userId), period as string);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

// 获取净资产历史
async function getNetWorthHistory(req: NextApiRequest, res: NextApiResponse, userId: number, period: string) {
  // 检查用户是否存在
  const user = await getOne('SELECT user_id FROM users WHERE user_id = $1', [userId]);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // 根据时间段计算日期范围
  const now = new Date();
  let startDate = new Date();
  
  switch (period) {
    case '1d':
      startDate.setDate(now.getDate() - 1);
      break;
    case '1w':
      startDate.setDate(now.getDate() - 7);
      break;
    case '1m':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case '3m':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case '6m':
      startDate.setMonth(now.getMonth() - 6);
      break;
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(now.getMonth() - 1);
  }

  // 获取净资产历史数据
  const netWorthHistory = await getMany(
    `SELECT net_worth_id, user_id, total_balance, stock_value, date_recorded
     FROM net_worth
     WHERE user_id = $1 AND date_recorded >= $2
     ORDER BY date_recorded ASC`,
    [userId, startDate.toISOString().split('T')[0]]
  );

  return res.status(200).json(netWorthHistory);
} 