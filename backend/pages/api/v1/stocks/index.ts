import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 获取所有股票
    try {
      const stocks = await prisma.stock.findMany({
        orderBy: { symbol: 'asc' },
      });
      
      return res.status(200).json(stocks);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 