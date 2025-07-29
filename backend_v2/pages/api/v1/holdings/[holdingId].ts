import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { holdingId } = req.query;
  const holdingIdInt = parseInt(holdingId as string);

  if (isNaN(holdingIdInt)) {
    return res.status(400).json({ error: 'Invalid holding ID' });
  }

  if (req.method === 'GET') {
    // 获取持仓详情
    try {
      const holding = await prisma.holding.findUnique({
        where: { holding_id: holdingIdInt },
        include: {
          stock: true,
          user: true,
        },
      });
      
      if (!holding) {
        return res.status(404).json({ error: 'Holding not found' });
      }
      
      return res.status(200).json(holding);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    // 删除持仓（卖出所有股票）
    try {
      const holding = await prisma.holding.findUnique({
        where: { holding_id: holdingIdInt },
        include: {
          stock: true,
        },
      });
      
      if (!holding) {
        return res.status(404).json({ error: 'Holding not found' });
      }

      // 计算卖出价值
      const sellValue = holding.holding_number * holding.stock.current_price;
      
      // 更新用户现金余额
      await prisma.holding.update({
        where: { user_id: holding.user_id },
        data: {
          cash: {
            increment: sellValue,
          },
        },
      });

      // 删除持仓
      await prisma.holding.delete({
        where: { holding_id: holdingIdInt },
      });
      
      return res.status(204).end();
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Holding not found' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['GET', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 