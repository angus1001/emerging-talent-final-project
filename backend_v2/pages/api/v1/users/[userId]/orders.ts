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
    // 获取用户的所有订单
    try {
      // 检查用户是否存在
      const user = await prisma.user.findUnique({
        where: { user_id: userIdInt },
      });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // 获取用户的所有订单
      const orders = await prisma.order.findMany({
        where: { user_id: userIdInt },
        include: {
          stock: true,
        },
        orderBy: {
          date: 'desc',
        },
      });

      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 