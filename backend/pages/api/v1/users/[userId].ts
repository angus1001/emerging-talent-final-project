import { NextApiRequest, NextApiResponse } from 'next';
import { getOne, query } from '../../../../lib/db';
import { errorHandler, validateRequest, corsMiddleware } from '../../../../middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS处理
  if (corsMiddleware(req, res)) return;

  const { userId } = req.query;

  if (!userId || Array.isArray(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getUserById(req, res, parseInt(userId));
      case 'PUT':
        return await updateUser(req, res, parseInt(userId));
      case 'DELETE':
        return await deleteUser(req, res, parseInt(userId));
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

// 根据ID获取用户
async function getUserById(req: NextApiRequest, res: NextApiResponse, userId: number) {
  const user = await getOne(
    'SELECT user_id, first_name, last_name, email, created_at FROM users WHERE user_id = $1',
    [userId]
  );

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json(user);
}

// 更新用户信息
async function updateUser(req: NextApiRequest, res: NextApiResponse, userId: number) {
  const { first_name, last_name, email } = req.body;

  // 检查用户是否存在
  const existingUser = await getOne('SELECT user_id FROM users WHERE user_id = $1', [userId]);
  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  // 如果更新邮箱，检查是否已被其他用户使用
  if (email) {
    const emailExists = await getOne(
      'SELECT user_id FROM users WHERE email = $1 AND user_id != $2',
      [email, userId]
    );
    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }
  }

  // 构建更新查询
  const updates = [];
  const values = [];
  let paramCount = 1;

  if (first_name) {
    updates.push(`first_name = $${paramCount++}`);
    values.push(first_name);
  }
  if (last_name) {
    updates.push(`last_name = $${paramCount++}`);
    values.push(last_name);
  }
  if (email) {
    updates.push(`email = $${paramCount++}`);
    values.push(email);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  values.push(userId);
  const updatedUser = await getOne(
    `UPDATE users SET ${updates.join(', ')} WHERE user_id = $${paramCount} 
     RETURNING user_id, first_name, last_name, email, created_at`,
    values
  );

  return res.status(200).json(updatedUser);
}

// 删除用户
async function deleteUser(req: NextApiRequest, res: NextApiResponse, userId: number) {
  // 检查用户是否存在
  const existingUser = await getOne('SELECT user_id FROM users WHERE user_id = $1', [userId]);
  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  // 删除用户（注意：这里可能需要先删除相关的订单、持仓等数据）
  await query('DELETE FROM users WHERE user_id = $1', [userId]);

  return res.status(204).end();
} 