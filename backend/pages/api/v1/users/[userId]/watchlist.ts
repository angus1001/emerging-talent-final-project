import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  const userIdInt = parseInt(userId as string);

  if (isNaN(userIdInt)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  if (req.method === 'GET') {
    // 获取用户的观察列表
    try {
      // 检查用户是否存在
      const user = await prisma.user.findUnique({
        where: { user_id: userIdInt },
      });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // 获取用户的观察列表
      const watchlist = await prisma.watchlist.findMany({
        where: { user_id: userIdInt },
        include: {
          stock: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return res.status(200).json(watchlist);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    // 添加股票到观察列表
    const { stock_id, display_name } = req.body;

    if (!stock_id) {
      return res.status(400).json({ error: 'Stock ID is required' });
    }

    try {
      // 检查用户是否存在
      const user = await prisma.user.findUnique({
        where: { user_id: userIdInt },
      });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // 检查股票是否存在
      const stock = await prisma.stock.findUnique({
        where: { stock_id: parseInt(stock_id) },
      });

      if (!stock) {
        return res.status(400).json({ error: 'Stock not found' });
      }

      // 检查是否已经在观察列表中
      const existingWatchlist = await prisma.watchlist.findFirst({
        where: {
          user_id: userIdInt,
          stock_id: parseInt(stock_id),
        },
      });

      if (existingWatchlist) {
        return res.status(400).json({ error: 'Stock already in watchlist' });
      }

      // 添加到观察列表
      const watchlistItem = await prisma.watchlist.create({
        data: {
          user_id: userIdInt,
          stock_id: parseInt(stock_id),
          display_name: display_name || stock.symbol,
          created_at: new Date(),
        },
        include: {
          stock: true,
        },
      });

      return res.status(201).json(watchlistItem);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 