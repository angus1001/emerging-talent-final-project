import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../../pages/api/v1/users/index';
import { prisma, setupTestDB, cleanupTestDB } from '../../setup';

// 简单的mock函数
function createMockRequest(method: string, body?: any): NextApiRequest {
  return {
    method,
    body,
    headers: {},
    query: {},
  } as NextApiRequest;
}

function createMockResponse(): any {
  let statusCode = 200;
  let responseData: any = null;
  
  const res = {
    status: (code: number) => {
      statusCode = code;
      return res;
    },
    json: (data: any) => {
      responseData = data;
      return res;
    },
    end: (data: any) => {
      responseData = data;
      return res;
    },
    setHeader: () => res,
    _getStatusCode: () => statusCode,
    _getData: () => responseData,
  };
  
  return res;
}

// 简单的测试运行器
async function runTests() {
  console.log('开始运行用户API测试...\n');
  
  let passedTests = 0;
  let totalTests = 0;
  
  const test = (name: string, testFn: () => Promise<void>) => {
    totalTests++;
    console.log(`测试 ${totalTests}: ${name}`);
    return testFn().then(() => {
      console.log(`✅ 通过`);
      passedTests++;
    }).catch((error) => {
      console.log(`❌ 失败: ${error.message}`);
    });
  };
  
  const expect = (actual: any) => ({
    toBe: (expected: any) => {
      if (actual !== expected) {
        throw new Error(`期望 ${expected}，但得到 ${actual}`);
      }
    },
    toEqual: (expected: any) => {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`期望 ${JSON.stringify(expected)}，但得到 ${JSON.stringify(actual)}`);
      }
    },
    toMatchObject: (expected: any) => {
      for (const key in expected) {
        if (actual[key] !== expected[key]) {
          throw new Error(`期望 ${key} 为 ${expected[key]}，但得到 ${actual[key]}`);
        }
      }
    },
    toHaveLength: (expected: number) => {
      if (actual.length !== expected) {
        throw new Error(`期望长度为 ${expected}，但得到 ${actual.length}`);
      }
    },
    toBeDefined: () => {
      if (actual === undefined) {
        throw new Error('期望值被定义，但得到 undefined');
      }
    },
    toContaining: (expected: any) => {
      if (!Array.isArray(actual)) {
        throw new Error('期望数组，但得到非数组');
      }
      // 简化的数组包含检查
      const found = actual.some(item => 
        JSON.stringify(item) === JSON.stringify(expected)
      );
      if (!found) {
        throw new Error(`期望数组包含 ${JSON.stringify(expected)}`);
      }
    }
  });

  // 测试设置
  await setupTestDB();
  
  try {
    // 测试1: GET - 空用户列表
    await test('GET /api/v1/users - 应该返回空数组当没有用户存在', async () => {
      await prisma.user.deleteMany();
      
      const req = createMockRequest('GET');
      const res = createMockResponse();
      
      await handler(req, res);
      
      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toEqual([]);
    });

    // 测试2: GET - 有用户存在
    await test('GET /api/v1/users - 应该返回所有用户当用户存在', async () => {
      await prisma.user.deleteMany();
      
      const testUser1 = await prisma.user.create({
        data: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
        },
      });

      const testUser2 = await prisma.user.create({
        data: {
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane.smith@example.com',
          password: 'password456',
        },
      });

      const req = createMockRequest('GET');
      const res = createMockResponse();
      
      await handler(req, res);
      
      expect(res._getStatusCode()).toBe(200);
      const users = res._getData();
      expect(users).toHaveLength(2);
    });

    // 测试3: POST - 创建用户（必需字段）
    await test('POST /api/v1/users - 应该用必需字段创建新用户', async () => {
      await prisma.user.deleteMany();
      
      const userData = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test.user@example.com',
        password: 'password123',
      };

      const req = createMockRequest('POST', userData);
      const res = createMockResponse();
      
      await handler(req, res);
      
      expect(res._getStatusCode()).toBe(201);
      const createdUser = res._getData();
      expect(createdUser).toMatchObject(userData);
      expect(createdUser.user_id).toBeDefined();
    });

    // 测试4: POST - 创建用户（所有字段）
    await test('POST /api/v1/users - 应该用所有字段创建新用户', async () => {
      await prisma.user.deleteMany();
      
      const userData = {
        first_name: 'Complete',
        last_name: 'User',
        email: 'complete.user@example.com',
        password: 'password123',
        phone: '1234567890',
        language: 'en',
        location: 'San Francisco',
      };

      const req = createMockRequest('POST', userData);
      const res = createMockResponse();
      
      await handler(req, res);
      
      expect(res._getStatusCode()).toBe(201);
      const createdUser = res._getData();
      expect(createdUser).toMatchObject(userData);
    });

    // 测试5: POST - 缺少必需字段
    await test('POST /api/v1/users - 缺少必需字段时应该返回400', async () => {
      const userData = {
        first_name: 'Test',
        // 缺少 last_name, password, email
      };

      const req = createMockRequest('POST', userData);
      const res = createMockResponse();
      
      await handler(req, res);
      
      expect(res._getStatusCode()).toBe(400);
      expect(res._getData()).toEqual({
        error: 'Missing required fields',
      });
    });

    // 测试6: POST - 邮箱已存在
    await test('POST /api/v1/users - 邮箱已存在时应该返回400', async () => {
      await prisma.user.deleteMany();
      
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

      const req = createMockRequest('POST', userData);
      const res = createMockResponse();
      
      await handler(req, res);
      
      expect(res._getStatusCode()).toBe(400);
      expect(res._getData()).toEqual({
        error: 'Email already exists or invalid input',
      });
    });

    // 测试7: 不支持的HTTP方法
    await test('PUT /api/v1/users - 应该返回405', async () => {
      const req = createMockRequest('PUT');
      const res = createMockResponse();
      
      await handler(req, res);
      
      expect(res._getStatusCode()).toBe(405);
      expect(res._getData()).toBe('Method PUT Not Allowed');
    });

    await test('DELETE /api/v1/users - 应该返回405', async () => {
      const req = createMockRequest('DELETE');
      const res = createMockResponse();
      
      await handler(req, res);
      
      expect(res._getStatusCode()).toBe(405);
      expect(res._getData()).toBe('Method DELETE Not Allowed');
    });

  } finally {
    await cleanupTestDB();
  }
  
  console.log(`\n测试完成: ${passedTests}/${totalTests} 通过`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有测试都通过了！');
  } else {
    console.log('⚠️  有些测试失败了');
  }
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
  runTests().catch(console.error);
}

export { runTests }; 