import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../../pages/api/v1/login';
import { PrismaClient } from '@prisma/client';

// Mock functions
function createMockRequest(method: string, body?: any): NextApiRequest {
  return {
    method,
    body,
    headers: {},
    query: {},
  } as NextApiRequest;
}

function createMockResponse(): any {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    _getStatusCode: () => (res.status as any).mock.calls[0]?.[0],
    _getData: () => (res.json as any).mock.calls[0]?.[0] || (res.end as any).mock.calls[0]?.[0],
  };
  return res;
}

// Create test database connection - use same connection as the API
const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL || 'mysql://root:presence@8.153.67.100:3306/portfolio_test',
    },
  },
});

// Helper function to create test user
async function createTestUser(userData: any) {
  // First, try to delete any existing user with the same email to avoid conflicts
  await testPrisma.user.deleteMany({
    where: { email: userData.email }
  });
  
  return await testPrisma.user.create({
    data: {
      first_name: userData.first_name || 'Test',
      last_name: userData.last_name || 'User',
      email: userData.email || 'test@example.com',
      password: userData.password || 'password123',
      phone: userData.phone,
      language: userData.language,
      location: userData.location,
    },
  });
}

// Helper function to clean up test data
async function cleanupTestData() {
  // Delete in order to respect foreign key constraints
  await testPrisma.order.deleteMany();
  await testPrisma.holding.deleteMany();
  await testPrisma.watchlist.deleteMany();
  await testPrisma.netWorth.deleteMany();
  await testPrisma.stockPriceHistory.deleteMany();
  await testPrisma.stock.deleteMany();
  await testPrisma.user.deleteMany();
}

describe('/api/v1/login', () => {
  beforeAll(async () => {
    // Test database connection
    try {
      await testPrisma.$connect();
      console.log('✅ Database connection successful');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
    
    // Clean up any existing test data
    await cleanupTestData();
  });

  afterAll(async () => {
    // Clean up test data and close connection
    await cleanupTestData();
    await testPrisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up data before each test
    await cleanupTestData();
    
    // Verify cleanup worked
    const remainingUsers = await testPrisma.user.findMany();
    if (remainingUsers.length > 0) {
      console.log('Warning: Users still exist after cleanup:', remainingUsers.map(u => u.email));
    }
  });

  describe('POST /api/v1/login', () => {
    it('should login successfully with email', async () => {
      // Create test user in database
      const testUser = await createTestUser({
        email: 'test.login@example.com',
        first_name: 'Login',
        last_name: 'User',
        password: 'password123',
      });

      // Verify user was created
      const createdUser = await testPrisma.user.findFirst({
        where: { email: 'test.login@example.com' }
      });
      expect(createdUser).toBeDefined();
      console.log('Created user:', createdUser);

      const req = createMockRequest('POST', {
        email: 'test.login@example.com',
      });
      const res = createMockResponse();

      await handler(req, res);

      console.log('Response status:', res._getStatusCode());
      console.log('Response data:', res._getData());
      
      expect(res._getStatusCode()).toBe(200);
      const response = res._getData();
      expect(response).toMatchObject({
        user_id: testUser.user_id,
        message: 'Login successful',
      });
    });

    it('should login successfully with username', async () => {
      // Create test user in database
      const testUser = await createTestUser({
        email: 'test.username@example.com',
        first_name: 'LoginUser',
        last_name: 'Test',
        password: 'password123',
      });

      // Verify user was created
      const createdUser = await testPrisma.user.findFirst({
        where: { first_name: 'LoginUser' }
      });
      expect(createdUser).toBeDefined();

      const req = createMockRequest('POST', {
        username: 'LoginUser',
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const response = res._getData();
      expect(response).toMatchObject({
        user_id: testUser.user_id,
        message: 'Login successful',
      });
    });

    it('should return 400 when email and username are missing', async () => {
      const req = createMockRequest('POST', {});
      const res = createMockResponse();

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getData()).toEqual({
        error: 'email are required',
      });
    });

    it('should return 401 when user does not exist', async () => {
      // Ensure no users exist in database
      await testPrisma.user.deleteMany();

      const req = createMockRequest('POST', {
        email: 'nonexistent@example.com',
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res._getStatusCode()).toBe(401);
      expect(res._getData()).toEqual({
        error: 'Invalid credentials',
      });
    });

    it('should return 401 when user exists but wrong credentials', async () => {
      // Create a user with different email
      await createTestUser({
        email: 'correct@example.com',
        first_name: 'Correct',
        last_name: 'User',
      });

      const req = createMockRequest('POST', {
        email: 'wrong@example.com',
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res._getStatusCode()).toBe(401);
      expect(res._getData()).toEqual({
        error: 'Invalid credentials',
      });
    });
  });

  describe('Unsupported HTTP methods', () => {
    it('should return 405 for GET method', async () => {
      const req = createMockRequest('GET');
      const res = createMockResponse();

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(res._getData()).toBe('Method GET Not Allowed');
    });

    it('should return 405 for PUT method', async () => {
      const req = createMockRequest('PUT');
      const res = createMockResponse();

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(res._getData()).toBe('Method PUT Not Allowed');
    });

    it('should return 405 for DELETE method', async () => {
      const req = createMockRequest('DELETE');
      const res = createMockResponse();

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(res._getData()).toBe('Method DELETE Not Allowed');
    });
  });

  describe('Database integration tests', () => {
    it('should handle multiple users correctly', async () => {
      // Create multiple users
      const user1 = await createTestUser({
        email: 'user1@example.com',
        first_name: 'User1',
        last_name: 'Test',
      });

      const user2 = await createTestUser({
        email: 'user2@example.com',
        first_name: 'User2',
        last_name: 'Test',
      });

      // Test login for user1
      const req1 = createMockRequest('POST', {
        email: 'user1@example.com',
      });
      const res1 = createMockResponse();

      await handler(req1, res1);

      expect(res1._getStatusCode()).toBe(200);
      expect(res1._getData().user_id).toBe(user1.user_id);

      // Test login for user2
      const req2 = createMockRequest('POST', {
        email: 'user2@example.com',
      });
      const res2 = createMockResponse();

      await handler(req2, res2);

      expect(res2._getStatusCode()).toBe(200);
      expect(res2._getData().user_id).toBe(user2.user_id);
    });

    it('should handle case sensitivity correctly', async () => {
      // Create user with lowercase email
      const testUser = await createTestUser({
        email: 'testcase@example.com',
        first_name: 'TestCase',
        last_name: 'User',
      });

      // Test with uppercase email (MySQL is case-insensitive, so this should work)
      const req = createMockRequest('POST', {
        email: 'TESTCASE@EXAMPLE.COM',
      });
      const res = createMockResponse();

      await handler(req, res);

      // MySQL is case-insensitive by default, so this should succeed
      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toMatchObject({
        user_id: testUser.user_id,
        message: 'Login successful',
      });
    });
  });
}); 