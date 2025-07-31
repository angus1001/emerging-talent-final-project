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
    // 获取用户投资组合摘要
    try {
      // 检查用户是否存在
      const user = await prisma.user.findUnique({
        where: { user_id: userIdInt },
      });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // 获取用户的所有持仓
      const holdings = await prisma.holding.findMany({
        where: { user_id: userIdInt },
        include: {
          stock: true,
        },
      });

      // 计算总价值
      let totalStockValue = 0;
      let cashBalance = user.cash;

      holdings.forEach(holding => {
        const currentValue = holding.holding_number * holding.stock.current_price;
        totalStockValue += currentValue;
      });

      const totalValue = totalStockValue + cashBalance;

      const portfolioSummary = {
        total_value: totalValue,
        cash_balance: cashBalance,
        stock_value: totalStockValue,
        holdings: holdings.map(holding => ({
          ...holding,
          stock: holding.stock,
        })),
        last_updated: new Date().toISOString(),
      };

      return res.status(200).json(portfolioSummary);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 