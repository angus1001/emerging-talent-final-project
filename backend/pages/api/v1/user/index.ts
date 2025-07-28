// pages/api/v1/users/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../../../types';

let users: User[] = [
  {
    user_id: 1,
    first_name: 'John',
    last_name: 'Doe',
    password: 'hashedpassword123',
    email: 'john.doe@example.com',
    created_at: '2023-01-01T00:00:00Z'
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // Get all users
      res.status(200).json(users);
      break;
    case 'POST':
      // Create new user
      try {
        const newUser: User = req.body;
        if (!newUser.first_name || !newUser.last_name || !newUser.password) {
          return res.status(400).json({ message: 'Missing required fields' });
        }
        
        newUser.user_id = users.length > 0 ? Math.max(...users.map(u => u.user_id)) + 1 : 1;
        newUser.created_at = new Date().toISOString();
        users.push(newUser);
        
        res.status(201).json(newUser);
      } catch (error) {
        res.status(400).json({ message: 'Invalid input' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}