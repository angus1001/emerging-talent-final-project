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
    // 获取用户详情
    try {
      const user = await prisma.user.findUnique({
        where: { user_id: userIdInt },
      });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    // 更新用户信息
    const { first_name, last_name, password, email, phone, language, location } = req.body;
    
    try {
      const user = await prisma.user.update({
        where: { user_id: userIdInt },
        data: { 
          first_name, 
          last_name, 
          password, 
          email, 
          phone, 
          language, 
          location 
        },
      });
      
      return res.status(200).json(user);
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(400).json({ error: 'Invalid input data' });
    }
  }

  if (req.method === 'DELETE') {
    // 删除用户
    try {
      await prisma.user.delete({
        where: { user_id: userIdInt },
      });
      
      return res.status(204).end();
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 