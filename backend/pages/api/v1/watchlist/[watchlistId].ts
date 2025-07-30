import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { watchlistId } = req.query;
  const watchlistIdInt = parseInt(watchlistId as string);

  if (isNaN(watchlistIdInt)) {
    return res.status(400).json({ error: 'Invalid watchlist ID' });
  }

  if (req.method === 'DELETE') {
    // 从观察列表中移除股票
    try {
      const watchlistItem = await prisma.watchlist.findUnique({
        where: { watchlist_id: watchlistIdInt },
      });
      
      if (!watchlistItem) {
        return res.status(404).json({ error: 'Watchlist item not found' });
      }

      // 删除观察列表项
      await prisma.watchlist.delete({
        where: { watchlist_id: watchlistIdInt },
      });
      
      return res.status(204).end();
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Watchlist item not found' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 