import { NextApiRequest, NextApiResponse } from 'next';

// 错误处理中间件
export function errorHandler(err: any, req: NextApiRequest, res: NextApiResponse) {
  console.error('API Error:', err);
  
  if (err.code === '23505') { // PostgreSQL unique constraint violation
    return res.status(400).json({ error: 'Duplicate entry' });
  }
  
  if (err.code === '23503') { // PostgreSQL foreign key constraint violation
    return res.status(400).json({ error: 'Referenced record not found' });
  }
  
  return res.status(500).json({ error: 'Internal server error' });
}

// 验证中间件
export function validateRequest(req: NextApiRequest, res: NextApiResponse, requiredFields: string[]) {
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Missing required fields',
      missingFields
    });
  }
  
  return null;
}

// CORS中间件
export function corsMiddleware(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  
  return false;
}

// 日志中间件
export function logMiddleware(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
} 