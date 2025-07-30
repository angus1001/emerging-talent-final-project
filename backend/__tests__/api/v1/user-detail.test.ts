import handler from '../../../pages/api/v1/users/[userId]';
import { prisma, setupTestDB, cleanupTestDB } from '../../setup';
import { createMockRequest, createMockResponse, runTestSuite, expect, createTestUser } from '../../utils/test-utils';

async function runUserDetailTests() {
  const tests = [
    {
      name: 'GET /api/v1/users/[userId] - 应该成功获取用户详情',
      test: async () => {
        await prisma.user.deleteMany();
        
        const testUser = await createTestUser(prisma, {
          first_name: 'Test',
          last_name: 'User',
          email: 'test.detail@example.com',
        });

        const req = createMockRequest('GET', {}, { userId: testUser.user_id.toString() });
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        const user = res._getData();
        expect(user).toMatchObject({
          user_id: testUser.user_id,
          first_name: 'Test',
          last_name: 'User',
          email: 'test.detail@example.com',
        });
      }
    },
    {
      name: 'GET /api/v1/users/[userId] - 用户不存在时应该返回404',
      test: async () => {
        const req = createMockRequest('GET', {}, { userId: '99999' });
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(404);
        expect(res._getData()).toEqual({
          error: 'User not found',
        });
      }
    },
    {
      name: 'GET /api/v1/users/[userId] - 无效用户ID时应该返回400',
      test: async () => {
        const req = createMockRequest('GET', {}, { userId: 'invalid' });
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(res._getData()).toEqual({
          error: 'Invalid user ID',
        });
      }
    },
    {
      name: 'PUT /api/v1/users/[userId] - 应该成功更新用户信息',
      test: async () => {
        await prisma.user.deleteMany();
        
        const testUser = await createTestUser(prisma, {
          first_name: 'Original',
          last_name: 'Name',
          email: 'original@example.com',
        });

        const updateData = {
          first_name: 'Updated',
          last_name: 'Name',
          email: 'updated@example.com',
          phone: '9876543210',
          language: 'zh',
          location: 'Beijing',
        };

        const req = createMockRequest('PUT', updateData, { userId: testUser.user_id.toString() });
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        const updatedUser = res._getData();
        expect(updatedUser).toMatchObject({
          user_id: testUser.user_id,
          ...updateData,
        });
      }
    },
    {
      name: 'PUT /api/v1/users/[userId] - 用户不存在时应该返回404',
      test: async () => {
        const updateData = {
          first_name: 'Updated',
          last_name: 'Name',
          email: 'updated@example.com',
        };

        const req = createMockRequest('PUT', updateData, { userId: '99999' });
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(404);
        expect(res._getData()).toEqual({
          error: 'User not found',
        });
      }
    },
    {
      name: 'PUT /api/v1/users/[userId] - 无效用户ID时应该返回400',
      test: async () => {
        const updateData = {
          first_name: 'Updated',
          last_name: 'Name',
          email: 'updated@example.com',
        };

        const req = createMockRequest('PUT', updateData, { userId: 'invalid' });
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(res._getData()).toEqual({
          error: 'Invalid user ID',
        });
      }
    },
    {
      name: 'DELETE /api/v1/users/[userId] - 应该成功删除用户',
      test: async () => {
        await prisma.user.deleteMany();
        
        const testUser = await createTestUser(prisma, {
          email: 'delete.test@example.com',
        });

        const req = createMockRequest('DELETE', {}, { userId: testUser.user_id.toString() });
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(204);
        
        // 验证用户已被删除
        const deletedUser = await prisma.user.findUnique({
          where: { user_id: testUser.user_id },
        });
        expect(deletedUser).toBeNull();
      }
    },
    {
      name: 'DELETE /api/v1/users/[userId] - 用户不存在时应该返回404',
      test: async () => {
        const req = createMockRequest('DELETE', {}, { userId: '99999' });
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(404);
        expect(res._getData()).toEqual({
          error: 'User not found',
        });
      }
    },
    {
      name: 'DELETE /api/v1/users/[userId] - 无效用户ID时应该返回400',
      test: async () => {
        const req = createMockRequest('DELETE', {}, { userId: 'invalid' });
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(res._getData()).toEqual({
          error: 'Invalid user ID',
        });
      }
    },
    {
      name: 'POST /api/v1/users/[userId] - 应该返回405',
      test: async () => {
        const req = createMockRequest('POST', {}, { userId: '1' });
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(405);
        expect(res._getData()).toBe('Method POST Not Allowed');
      }
    },
    {
      name: 'PATCH /api/v1/users/[userId] - 应该返回405',
      test: async () => {
        const req = createMockRequest('PATCH', {}, { userId: '1' });
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(405);
        expect(res._getData()).toBe('Method PATCH Not Allowed');
      }
    },
  ];

  return await runTestSuite('用户详情API', tests);
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
  (async () => {
    await setupTestDB();
    try {
      await runUserDetailTests();
    } finally {
      await cleanupTestDB();
    }
  })().catch(console.error);
}

export { runUserDetailTests }; 