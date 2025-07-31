import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId } = req.query;
  const orderIdInt = parseInt(orderId as string);

  if (isNaN(orderIdInt)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  if (req.method === 'GET') {
    // 获取订单详情
    try {
      const order = await prisma.order.findUnique({
        where: { order_id: orderIdInt },
        include: {
          user: true,
          stock: true,
        },
      });
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    // 更新订单状态
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    if (!['PENDING', 'EXECUTED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    try {
      const order = await prisma.order.findUnique({
        where: { order_id: orderIdInt },
        include: {
          user: true,
          stock: true,
        },
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // 如果订单状态从PENDING变为EXECUTED，执行交易逻辑
      if (order.status === 'PENDING' && status === 'EXECUTED') {
        await executeOrder(order);
      }

      // 更新订单状态
      const updatedOrder = await prisma.order.update({
        where: { order_id: orderIdInt },
        data: { status },
        include: {
          user: true,
          stock: true,
        },
      });

      return res.status(200).json(updatedOrder);
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Order not found' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

// 执行订单的交易逻辑
async function executeOrder(order: any) {
  const { user_id, stock_id, order_type, quantity, price_per_share } = order;

  if (order_type === 'BUY') {
    // 买入逻辑
    const existingHolding = await prisma.holding.findFirst({
      where: { 
        user_id: user_id,
        stock_id: stock_id,
      },
    });

    if (existingHolding) {
      // 更新现有持仓
      const newQuantity = existingHolding.holding_number + quantity;
      const newAveragePrice = ((existingHolding.average_price * existingHolding.holding_number) + (price_per_share * quantity)) / newQuantity;

      await prisma.holding.update({
        where: { holding_id: existingHolding.holding_id },
        data: {
          holding_number: newQuantity,
          average_price: newAveragePrice,
          total_value: newQuantity * price_per_share,
          last_updated: new Date(),
        },
      });
    } else {
      // 创建新持仓
      await prisma.holding.create({
        data: {
          user_id: user_id,
          stock_id: stock_id,
          holding_number: quantity,
          average_price: price_per_share,
          cash: 0, // 需要从用户现金中扣除
          total_value: quantity * price_per_share,
          last_updated: new Date(),
        },
      });
    }
  } else if (order_type === 'SELL') {
    // 卖出逻辑
    const existingHolding = await prisma.holding.findFirst({
      where: { 
        user_id: user_id,
        stock_id: stock_id,
      },
    });

    if (existingHolding && existingHolding.holding_number >= quantity) {
      const newQuantity = existingHolding.holding_number - quantity;
      
      if (newQuantity === 0) {
        // 如果卖出所有股票，删除持仓
        await prisma.holding.delete({
          where: { holding_id: existingHolding.holding_id },
        });
      } else {
        // 更新持仓
        await prisma.holding.update({
          where: { holding_id: existingHolding.holding_id },
          data: {
            holding_number: newQuantity,
            cash: existingHolding.cash + (quantity * price_per_share),
            total_value: newQuantity * price_per_share,
            last_updated: new Date(),
          },
        });
      }
    }
  }
} 