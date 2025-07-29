import { NextApiRequest, NextApiResponse } from 'next';
import { getOne } from '../../../../lib/db';
import { errorHandler, corsMiddleware } from '../../../../middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS处理
  if (corsMiddleware(req, res)) return;

  const { stockId } = req.query;

  if (!stockId || Array.isArray(stockId)) {
    return res.status(400).json({ error: 'Invalid stock ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getStockById(req, res, parseInt(stockId));
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

// 根据ID获取股票
async function getStockById(req: NextApiRequest, res: NextApiResponse, stockId: number) {
  const stock = await getOne(
    `SELECT stock_id, symbol, company_name, current_price, last_updated 
     FROM stocks 
     WHERE stock_id = $1`,
    [stockId]
  );

  if (!stock) {
    return res.status(404).json({ error: 'Stock not found' });
  }

  return res.status(200).json(stock);
} 