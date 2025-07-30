import handler from '../../../pages/api/v1/login';
import { prisma, setupTestDB, cleanupTestDB } from '../../setup';
import { createMockRequest, createMockResponse, runTestSuite, expect, createTestUser } from '../../utils/test-utils';

async function runLoginTests() {
  const tests = [
    {
      name: 'POST /api/v1/login - 应该用邮箱成功登录',
      test: async () => {
        await prisma.user.deleteMany();
        
        const testUser = await createTestUser(prisma, {
          email: 'test.login@example.com',
          first_name: 'Login',
          last_name: 'User',
        });

        const req = createMockRequest('POST', {
          email: 'test.login@example.com',
        });
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        const response = res._getData();
        expect(response).toMatchObject({
          user_id: testUser.user_id,
          message: 'Login successful',
        });
      }
    },
    {
      name: 'POST /api/v1/login - 应该用用户名成功登录',
      test: async () => {
        await prisma.user.deleteMany();
        
        const testUser = await createTestUser(prisma, {
          email: 'test.username@example.com',
          first_name: 'LoginUser',
          last_name: 'Test',
        });

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
      }
    },
    {
      name: 'POST /api/v1/login - 缺少邮箱和用户名时应该返回400',
      test: async () => {
        const req = createMockRequest('POST', {});
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(res._getData()).toEqual({
          error: 'email are required',
        });
      }
    },
    {
      name: 'POST /api/v1/login - 用户不存在时应该返回401',
      test: async () => {
        await prisma.user.deleteMany();

        const req = createMockRequest('POST', {
          email: 'nonexistent@example.com',
        });
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(401);
        expect(res._getData()).toEqual({
          error: 'Invalid credentials',
        });
      }
    },
    {
      name: 'GET /api/v1/login - 应该返回405',
      test: async () => {
        const req = createMockRequest('GET');
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(405);
        expect(res._getData()).toBe('Method GET Not Allowed');
      }
    },
    {
      name: 'PUT /api/v1/login - 应该返回405',
      test: async () => {
        const req = createMockRequest('PUT');
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(405);
        expect(res._getData()).toBe('Method PUT Not Allowed');
      }
    },
  ];

  return await runTestSuite('登录API', tests);
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
  (async () => {
    await setupTestDB();
    try {
      await runLoginTests();
    } finally {
      await cleanupTestDB();
    }
  })().catch(console.error);
}

export { runLoginTests }; 