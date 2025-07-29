import { NextApiRequest, NextApiResponse } from 'next';
import { getMany, getOne, query } from '../../../../lib/db';
import { errorHandler, validateRequest } from '../../../../middleware/middleware';
import { User } from '../../../../type';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await getUsers(req, res);
      case 'POST':
        return await createUser(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

// Get all users
async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  const users = await getMany(
    'SELECT user_id, first_name, last_name, email, created_at FROM users ORDER BY created_at DESC'
  );
  
  return res.status(200).json(users);
}

// Create new user
async function createUser(req: NextApiRequest, res: NextApiResponse) {
  const requiredFields = ['first_name', 'last_name', 'password', 'email'];
  const validationError = validateRequest(req, res, requiredFields);
  if (validationError) return validationError;

  const { first_name, last_name, password, email } = req.body;

  // Check if email already exists
  const existingUser = await getOne('SELECT user_id FROM users WHERE email = ?', [email]);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  // Create new user
  const newUser = await getOne(
    `INSERT INTO users (first_name, last_name, password, email, created_at) 
     VALUES (?, ?, ?, ?, NOW()) 
     RETURNING user_id, first_name, last_name, email, created_at`,
    [first_name, last_name, password, email]
  );

  return res.status(201).json(newUser);
} 