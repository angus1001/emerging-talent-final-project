import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, email } = req.body;

    // 验证必需字段
    if (!username && !email) {
      return res.status(400).json({ error: 'email are required' });
    }

    try {
      // 查找用户
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email },
            { first_name: username },
          ],
        },
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // 返回用户ID（在实际应用中应该返回JWT token）
      return res.status(200).json({
        user_id: user.user_id,
        message: 'Login successful',
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 