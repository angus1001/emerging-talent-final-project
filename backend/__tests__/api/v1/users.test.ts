import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import handler from '../../../pages/api/v1/users/index';
import { prisma, setupTestDB, cleanupTestDB } from '../../setup';

describe('/api/v1/users', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await cleanupTestDB();
  });

  beforeEach(async () => {
    // 每个测试前清理用户数据
    await prisma.user.deleteMany();
  });

  describe('GET /api/v1/users', () => {
    it('should return empty array when no users exist', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual([]);
    });

    it('should return all users when users exist', async () => {
      // 创建测试用户
      const testUser1 = await prisma.user.create({
        data: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
          phone: '1234567890',
          language: 'en',
          location: 'New York',
        },
      });

      const testUser2 = await prisma.user.create({
        data: {
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane.smith@example.com',
          password: 'password456',
          phone: '0987654321',
          language: 'en',
          location: 'Los Angeles',
        },
      });

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const users = JSON.parse(res._getData());
      expect(users).toHaveLength(2);
      expect(users).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user_id: testUser1.user_id,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
          }),
          expect.objectContaining({
            user_id: testUser2.user_id,
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
          }),
        ])
      );
    });
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user with required fields', async () => {
      const userData = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test.user@example.com',
        password: 'password123',
      };

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: userData,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(201);
      const createdUser = JSON.parse(res._getData());
      expect(createdUser).toMatchObject({
        first_name: 'Test',
        last_name: 'User',
        email: 'test.user@example.com',
        password: 'password123',
      });
      expect(createdUser.user_id).toBeDefined();
      expect(createdUser.created_at).toBeDefined();
    });

    it('should create a new user with all fields', async () => {
      const userData = {
        first_name: 'Complete',
        last_name: 'User',
        email: 'complete.user@example.com',
        password: 'password123',
        phone: '1234567890',
        language: 'en',
        location: 'San Francisco',
      };

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: userData,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(201);
      const createdUser = JSON.parse(res._getData());
      expect(createdUser).toMatchObject(userData);
    });

    it('should return 400 when missing required fields', async () => {
      const userData = {
        first_name: 'Test',
        // 缺少 last_name, password, email
      };

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: userData,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Missing required fields',
      });
    });

    it('should return 400 when email already exists', async () => {
      // 先创建一个用户
      await prisma.user.create({
        data: {
          first_name: 'Existing',
          last_name: 'User',
          email: 'existing.user@example.com',
          password: 'password123',
        },
      });

      // 尝试创建相同邮箱的用户
      const userData = {
        first_name: 'New',
        last_name: 'User',
        email: 'existing.user@example.com', // 重复的邮箱
        password: 'password456',
      };

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: userData,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Email already exists or invalid input',
      });
    });

    it('should return 400 when missing first_name', async () => {
      const userData = {
        last_name: 'User',
        email: 'test.user@example.com',
        password: 'password123',
      };

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: userData,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Missing required fields',
      });
    });

    it('should return 400 when missing last_name', async () => {
      const userData = {
        first_name: 'Test',
        email: 'test.user@example.com',
        password: 'password123',
      };

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: userData,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Missing required fields',
      });
    });

    it('should return 400 when missing password', async () => {
      const userData = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test.user@example.com',
      };

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: userData,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Missing required fields',
      });
    });

    it('should return 400 when missing email', async () => {
      const userData = {
        first_name: 'Test',
        last_name: 'User',
        password: 'password123',
      };

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: userData,
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Missing required fields',
      });
    });
  });

  describe('Unsupported HTTP methods', () => {
    it('should return 405 for PUT method', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'PUT',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(res._getData()).toBe('Method PUT Not Allowed');
    });

    it('should return 405 for DELETE method', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'DELETE',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(res._getData()).toBe('Method DELETE Not Allowed');
    });

    it('should return 405 for PATCH method', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'PATCH',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(res._getData()).toBe('Method PATCH Not Allowed');
    });
  });
}); 