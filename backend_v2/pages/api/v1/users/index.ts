import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 获取所有用户
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  }
  if (req.method === 'POST') {
    // 创建新用户
    const { first_name, last_name, password, email, phone, language, location } = req.body;
    if (!first_name || !last_name || !password || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
      const user = await prisma.user.create({
        data: { first_name, last_name, password, email, phone, language, location },
      });
      return res.status(201).json(user);
    } catch (e) {
      return res.status(400).json({ error: 'Email already exists or invalid input' });
    }
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 