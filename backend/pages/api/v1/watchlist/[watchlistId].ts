import { NextApiRequest, NextApiResponse } from 'next';
import { getOne, query } from '../../../../lib/db';
import { errorHandler  } from '../../../../middleware/middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { watchlistId } = req.query;

  if (!watchlistId || Array.isArray(watchlistId)) {
    return res.status(400).json({ error: 'Invalid watchlist ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getWatchlistItemById(req, res, parseInt(watchlistId));
      case 'DELETE':
        return await removeFromWatchlist(req, res, parseInt(watchlistId));
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

// 根据ID获取观察列表项目
async function getWatchlistItemById(req: NextApiRequest, res: NextApiResponse, watchlistId: number) {
  const watchlistItem = await getOne(
    `SELECT w.watchlist_id, w.user_id, w.stock_id, w.display_name, w.added_at,
            s.symbol, s.company_name, s.current_price
     FROM watchlist w
     JOIN stocks s ON w.stock_id = s.stock_id
     WHERE w.watchlist_id = $1`,
    [watchlistId]
  );

  if (!watchlistItem) {
    return res.status(404).json({ error: 'Watchlist item not found' });
  }

  return res.status(200).json(watchlistItem);
}

// 从观察列表中移除
async function removeFromWatchlist(req: NextApiRequest, res: NextApiResponse, watchlistId: number) {
  // 检查观察列表项目是否存在
  const existingWatchlistItem = await getOne('SELECT watchlist_id FROM watchlist WHERE watchlist_id = $1', [watchlistId]);
  if (!existingWatchlistItem) {
    return res.status(404).json({ error: 'Watchlist item not found' });
  }

  // 删除观察列表项目
  await query('DELETE FROM watchlist WHERE watchlist_id = $1', [watchlistId]);

  return res.status(204).end();
} 