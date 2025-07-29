import { NextApiRequest, NextApiResponse } from 'next';
import { getMany } from '../../../../lib/db';
import { errorHandler  } from '../../../../middleware/middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


  try {
    switch (req.method) {
      case 'GET':
        return await getStocks(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

// 获取所有股票
async function getStocks(req: NextApiRequest, res: NextApiResponse) {
  const stocks = await getMany(
    `SELECT stock_id, symbol, company_name, current_price, last_updated 
     FROM stocks 
     ORDER BY symbol ASC`
  );
  
  return res.status(200).json(stocks);
} 