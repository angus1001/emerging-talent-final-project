import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 获取所有订单（管理员功能）
    try {
      const orders = await prisma.order.findMany({
        include: {
          user: true,
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

  if (req.method === 'POST') {
    // 创建新订单
    const { 
      user_id, 
      stock_id, 
      order_type, 
      quantity, 
      price_per_share, 
      duration = 'DAY' 
    } = req.body;

    // 验证必需字段
    if (!user_id || !stock_id || !order_type || !quantity || !price_per_share) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 验证订单类型
    if (!['BUY', 'SELL'].includes(order_type)) {
      return res.status(400).json({ error: 'Invalid order type' });
    }

    // 验证数量
    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be positive' });
    }

    // 验证价格
    if (price_per_share <= 0) {
      return res.status(400).json({ error: 'Price must be positive' });
    }

    try {
      // 检查用户和股票是否存在
      const user = await prisma.user.findUnique({
        where: { user_id: parseInt(user_id) },
      });

      const stock = await prisma.stock.findUnique({
        where: { stock_id: parseInt(stock_id) },
      });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      if (!stock) {
        return res.status(400).json({ error: 'Stock not found' });
      }

      const totalValue = quantity * price_per_share;

      // 如果是买入订单，检查用户是否有足够的现金
      if (order_type === 'BUY') {
        if (!user.cash || user.cash < totalValue) {
          return res.status(400).json({ error: 'Insufficient funds' });
        }
      }

      // 如果是卖出订单，检查用户是否有足够的股票
      if (order_type === 'SELL') {
        const userHolding = await prisma.holding.findFirst({
          where: { 
            user_id: parseInt(user_id),
            stock_id: parseInt(stock_id),
          },
        });

        if (!userHolding || userHolding.holding_number < quantity) {
          return res.status(400).json({ error: 'Insufficient shares' });
        }
      }

      // 创建订单
      const order = await prisma.order.create({
        data: {
          user_id: parseInt(user_id),
          stock_id: parseInt(stock_id),
          order_type,
          quantity: parseInt(quantity),
          price_per_share: parseFloat(price_per_share),
          total_value: totalValue,
          date: new Date(),
          status: 'PENDING',
          duration,
        },
        include: {
          user: true,
          stock: true,
        },
      });
      // 买入后扣减用户现金并更新持仓
      if (order_type === 'BUY') {
        // 使用事务确保数据一致性
        await prisma.$transaction(async (tx) => {
          // 扣减用户现金
          await tx.user.update({
            where: { user_id: user.user_id },
            data: {
              cash: {
                decrement: totalValue
              }
            }
          });

          // 查找用户持仓
          let holding = await tx.holding.findFirst({
            where: {
              user_id: user.user_id,
              stock_id: stock.stock_id
            }
          });

          const newTotalValue = Math.round(parseInt(quantity) * parseFloat(price_per_share));

          if (!holding) {
            // 如果没有持仓，创建新持仓
            await tx.holding.create({
              data: {
                user_id: user.user_id,
                stock_id: stock.stock_id,
                holding_number: parseInt(quantity),
                average_price: parseFloat(price_per_share),
                total_value: newTotalValue,
                last_updated: new Date()
              }
            });
          } else {
            // 已有持仓，更新持仓数量和平均买入价格
            const oldTotalShares = holding.holding_number;
            const oldAvgPrice = holding.average_price;
            const newTotalShares = oldTotalShares + parseInt(quantity);
            // 重新计算加权平均买入价格
            const newAvgPrice = ((oldTotalShares * oldAvgPrice) + (parseInt(quantity) * parseFloat(price_per_share))) / newTotalShares;
            const updatedTotalValue = Math.round(newTotalShares * newAvgPrice);

            await tx.holding.update({
              where: { holding_id: holding.holding_id },
              data: {
                holding_number: newTotalShares,
                average_price: newAvgPrice,
                total_value: updatedTotalValue,
                last_updated: new Date()
              }
            });
          }
        });
       }
      return res.status(201).json(order);
    } catch (error) {
      console.error('Order creation error:', error);
      return res.status(400).json({ error: 'Invalid order data', details: error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 