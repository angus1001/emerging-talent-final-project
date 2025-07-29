import { NextApiRequest, NextApiResponse } from 'next';
import { getOne, getMany, query } from '../../../../../lib/db';
import { errorHandler, validateRequest } from '../../../../../middleware/middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  

  const { userId } = req.query;

  if (!userId || Array.isArray(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getWatchlist(req, res, parseInt(userId));
      case 'POST':
        return await addToWatchlist(req, res, parseInt(userId));
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

// 获取用户的观察列表
async function getWatchlist(req: NextApiRequest, res: NextApiResponse, userId: number) {
  // 检查用户是否存在
  const user = await getOne('SELECT user_id FROM users WHERE user_id = $1', [userId]);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // 获取观察列表
  const watchlist = await getMany(
    `SELECT w.watchlist_id, w.user_id, w.stock_id, w.display_name, w.added_at,
            s.symbol, s.company_name, s.current_price
     FROM watchlist w
     JOIN stocks s ON w.stock_id = s.stock_id
     WHERE w.user_id = $1
     ORDER BY w.added_at DESC`,
    [userId]
  );

  return res.status(200).json(watchlist);
}

// 添加到观察列表
async function addToWatchlist(req: NextApiRequest, res: NextApiResponse, userId: number) {
  const requiredFields = ['stock_id'];
  const validationError = validateRequest(req, res, requiredFields);
  if (validationError) return validationError;

  const { stock_id, display_name } = req.body;

  // 检查用户是否存在
  const user = await getOne('SELECT user_id FROM users WHERE user_id = $1', [userId]);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // 检查股票是否存在
  const stock = await getOne('SELECT stock_id FROM stocks WHERE stock_id = $1', [stock_id]);
  if (!stock) {
    return res.status(400).json({ error: 'Stock not found' });
  }

  // 检查是否已经在观察列表中
  const existingWatchlist = await getOne(
    'SELECT watchlist_id FROM watchlist WHERE user_id = $1 AND stock_id = $2',
    [userId, stock_id]
  );
  if (existingWatchlist) {
    return res.status(400).json({ error: 'Stock already in watchlist' });
  }

  // 添加到观察列表
  const newWatchlistItem = await getOne(
    `INSERT INTO watchlist (user_id, stock_id, display_name, added_at) 
     VALUES ($1, $2, $3, NOW()) 
     RETURNING watchlist_id, user_id, stock_id, display_name, added_at`,
    [userId, stock_id, display_name]
  );

  return res.status(201).json(newWatchlistItem);
} 