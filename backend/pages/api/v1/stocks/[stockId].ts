import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { stockId } = req.query;
  const stockIdInt = parseInt(stockId as string);

  if (isNaN(stockIdInt)) {
    return res.status(400).json({ error: 'Invalid stock ID' });
  }

  if (req.method === 'GET') {
    // 获取股票详情
    try {
      const stock = await prisma.stock.findUnique({
        where: { stock_id: stockIdInt },
        include: {
          stockPriceHistorys: {
            orderBy: {
              date: 'asc'
            }
          }
        }
      });
      
      if (!stock) {
        return res.status(404).json({ error: 'Stock not found' });
      }
      
      // 构建响应，包含历史价格数据
      const response = {
        ...stock,
        history_price: stock.stockPriceHistorys.map(history => ({
          date: history.date,
          close_price: history.close_price
        }))
      };
      
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 