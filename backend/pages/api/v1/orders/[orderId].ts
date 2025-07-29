import { NextApiRequest, NextApiResponse } from 'next';
import { getOne, query } from '../../../../lib/db';
import { errorHandler} from '../../../../middleware/middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  

  const { orderId } = req.query;

  if (!orderId || Array.isArray(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getOrderById(req, res, parseInt(orderId));
      case 'PUT':
        return await updateOrderStatus(req, res, parseInt(orderId));
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

// 根据ID获取订单
async function getOrderById(req: NextApiRequest, res: NextApiResponse, orderId: number) {
  const order = await getOne(
    `SELECT o.order_id, o.user_id, o.order_type, o.stock_id, o.shares, o.price_per_share, o.date, o.status,
            s.symbol, s.company_name,
            u.first_name, u.last_name,
            (o.shares * o.price_per_share) as total_amount
     FROM orders o
     JOIN stocks s ON o.stock_id = s.stock_id
     JOIN users u ON o.user_id = u.user_id
     WHERE o.order_id = $1`,
    [orderId]
  );

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  return res.status(200).json(order);
}

// 更新订单状态
async function updateOrderStatus(req: NextApiRequest, res: NextApiResponse, orderId: number) {
  const { status } = req.body;

  // 验证状态值
  if (!['PENDING', 'EXECUTED', 'CANCELLED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  // 检查订单是否存在
  const existingOrder = await getOne('SELECT order_id FROM orders WHERE order_id = $1', [orderId]);
  if (!existingOrder) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // 更新订单状态
  const updatedOrder = await getOne(
    `UPDATE orders SET status = $1 WHERE order_id = $2 
     RETURNING order_id, user_id, order_type, stock_id, shares, price_per_share, date, status`,
    [status, orderId]
  );

  return res.status(200).json(updatedOrder);
} 