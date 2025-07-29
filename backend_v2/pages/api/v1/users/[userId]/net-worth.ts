import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  const { period = '1m' } = req.query;
  const userIdInt = parseInt(userId as string);

  if (isNaN(userIdInt)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  if (req.method === 'GET') {
    // 获取用户净资产历史
    try {
      // 检查用户是否存在
      const user = await prisma.user.findUnique({
        where: { user_id: userIdInt },
      });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // 计算时间范围
      const now = new Date();
      let startDate = new Date();
      
      switch (period) {
        case '1d':
          startDate.setDate(now.getDate() - 1);
          break;
        case '1w':
          startDate.setDate(now.getDate() - 7);
          break;
        case '1m':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case '3m':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case '6m':
          startDate.setMonth(now.getMonth() - 6);
          break;
        case '1y':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(now.getMonth() - 1);
      }

      // 获取净资产历史记录
      const netWorthHistory = await prisma.netWorth.findMany({
        where: {
          user_id: userIdInt,
          date_recorded: {
            gte: startDate,
            lte: now,
          },
        },
        orderBy: {
          date_recorded: 'asc',
        },
      });

      return res.status(200).json(netWorthHistory);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 