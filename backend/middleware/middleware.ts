import { NextRequest, NextResponse } from 'next/server';

// Next.js middleware function (required export)
export function middleware(request: NextRequest) {
  // CORS handling
  const response = NextResponse.next();
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200 });
  }
  
  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: '/api/:path*',
};

// Keep your existing utility functions for use in API routes
export function errorHandler(err: any, req: any, res: any) {
  console.error('API Error:', err);
  
  if (err.code === '23505') {
    return res.status(400).json({ error: 'Duplicate entry' });
  }
  
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Referenced record not found' });
  }
  
  return res.status(500).json({ error: 'Internal server error' });
}

export function validateRequest(req: any, res: any, requiredFields: string[]) {
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Missing required fields',
      missingFields
    });
  }
  
  return null;
}

export function logMiddleware(req: any, res: any, next: () => void) {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
} 