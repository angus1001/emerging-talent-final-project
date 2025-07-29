import { NextApiRequest, NextApiResponse } from 'next';
import { getOne, query } from '../../../../lib/db';
import { errorHandler, corsMiddleware } from '../../../../middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS处理
  if (corsMiddleware(req, res)) return;

  const { holdingId } = req.query;

  if (!holdingId || Array.isArray(holdingId)) {
    return res.status(400).json({ error: 'Invalid holding ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getHoldingById(req, res, parseInt(holdingId));
      case 'DELETE':
        return await deleteHolding(req, res, parseInt(holdingId));
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

// 根据ID获取持仓
async function getHoldingById(req: NextApiRequest, res: NextApiResponse, holdingId: number) {
  const holding = await getOne(
    `SELECT h.holding_id, h.user_id, h.stock_id, h.total_shares, h.average_price, h.last_updated,
            s.symbol, s.company_name, s.current_price,
            (h.total_shares * s.current_price) as current_value,
            ((s.current_price - h.average_price) / h.average_price * 100) as gain_loss_percentage
     FROM holdings h
     JOIN stocks s ON h.stock_id = s.stock_id
     WHERE h.holding_id = $1`,
    [holdingId]
  );

  if (!holding) {
    return res.status(404).json({ error: 'Holding not found' });
  }

  return res.status(200).json(holding);
}

// 删除持仓（卖出所有股票）
async function deleteHolding(req: NextApiRequest, res: NextApiResponse, holdingId: number) {
  // 检查持仓是否存在
  const existingHolding = await getOne('SELECT holding_id FROM holdings WHERE holding_id = $1', [holdingId]);
  if (!existingHolding) {
    return res.status(404).json({ error: 'Holding not found' });
  }

  // 删除持仓
  await query('DELETE FROM holdings WHERE holding_id = $1', [holdingId]);

  return res.status(204).end();
} 