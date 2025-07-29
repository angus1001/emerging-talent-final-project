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
      });
      
      if (!stock) {
        return res.status(404).json({ error: 'Stock not found' });
      }
      
      return res.status(200).json(stock);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 