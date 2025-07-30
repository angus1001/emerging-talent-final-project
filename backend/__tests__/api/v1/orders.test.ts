import handler from '../../../pages/api/v1/orders/index';
import { prisma, setupTestDB, cleanupTestDB } from '../../setup';
import { createMockRequest, createMockResponse, runTestSuite, expect, createTestUser, createTestStock, createTestOrder } from '../../utils/test-utils';

async function runOrdersTests() {
  const tests = [
    {
      name: 'GET /api/v1/orders - 应该返回空数组当没有订单存在',
      test: async () => {
        await prisma.order.deleteMany();
        
        const req = createMockRequest('GET');
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        expect(res._getData()).toEqual([]);
      }
    },
    {
      name: 'GET /api/v1/orders - 应该返回所有订单当订单存在',
      test: async () => {
        await prisma.order.deleteMany();
        await prisma.user.deleteMany();
        await prisma.stock.deleteMany();
        
        const testUser = await createTestUser(prisma);
        const testStock = await createTestStock(prisma);
        
        const testOrder1 = await createTestOrder(prisma, {
          user_id: testUser.user_id,
          stock_id: testStock.stock_id,
          order_type: 'BUY',
          quantity: 10,
          price_per_share: 100.0,
        });

        const testOrder2 = await createTestOrder(prisma, {
          user_id: testUser.user_id,
          stock_id: testStock.stock_id,
          order_type: 'SELL',
          quantity: 5,
          price_per_share: 110.0,
        });

        const req = createMockRequest('GET');
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        const orders = res._getData();
        expect(orders).toHaveLength(2);
      }
    },
    {
      name: 'POST /api/v1/orders - 应该成功创建买入订单',
      test: async () => {
        await prisma.order.deleteMany();
        await prisma.user.deleteMany();
        await prisma.stock.deleteMany();
        
        const testUser = await createTestUser(prisma, { cash: 10000 });
        const testStock = await createTestStock(prisma, { current_price: 100.0 });

        const orderData = {
          user_id: testUser.user_id,
          stock_id: testStock.stock_id,
          order_type: 'BUY',
          quantity: 10,
          price_per_share: 100.0,
        };

        const req = createMockRequest('POST', orderData);
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(201);
        const createdOrder = res._getData();
        expect(createdOrder).toMatchObject({
          user_id: testUser.user_id,
          stock_id: testStock.stock_id,
          order_type: 'BUY',
          quantity: 10,
          price_per_share: 100.0,
          total_value: 1000,
          status: 'PENDING',
        });
      }
    },
    {
      name: 'POST /api/v1/orders - 缺少必需字段时应该返回400',
      test: async () => {
        const orderData = {
          user_id: 1,
          // 缺少 stock_id, order_type, quantity, price_per_share
        };

        const req = createMockRequest('POST', orderData);
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(res._getData()).toEqual({
          error: 'Missing required fields',
        });
      }
    },
    {
      name: 'POST /api/v1/orders - 无效订单类型时应该返回400',
      test: async () => {
        const orderData = {
          user_id: 1,
          stock_id: 1,
          order_type: 'INVALID',
          quantity: 10,
          price_per_share: 100.0,
        };

        const req = createMockRequest('POST', orderData);
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(res._getData()).toEqual({
          error: 'Invalid order type',
        });
      }
    },
    {
      name: 'POST /api/v1/orders - 数量为负数时应该返回400',
      test: async () => {
        const orderData = {
          user_id: 1,
          stock_id: 1,
          order_type: 'BUY',
          quantity: -5,
          price_per_share: 100.0,
        };

        const req = createMockRequest('POST', orderData);
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(res._getData()).toEqual({
          error: 'Quantity must be positive',
        });
      }
    },
    {
      name: 'POST /api/v1/orders - 价格为负数时应该返回400',
      test: async () => {
        const orderData = {
          user_id: 1,
          stock_id: 1,
          order_type: 'BUY',
          quantity: 10,
          price_per_share: -50.0,
        };

        const req = createMockRequest('POST', orderData);
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(res._getData()).toEqual({
          error: 'Price must be positive',
        });
      }
    },
    {
      name: 'POST /api/v1/orders - 用户不存在时应该返回400',
      test: async () => {
        await prisma.stock.deleteMany();
        const testStock = await createTestStock(prisma);

        const orderData = {
          user_id: 99999, // 不存在的用户ID
          stock_id: testStock.stock_id,
          order_type: 'BUY',
          quantity: 10,
          price_per_share: 100.0,
        };

        const req = createMockRequest('POST', orderData);
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(res._getData()).toEqual({
          error: 'User not found',
        });
      }
    },
    {
      name: 'POST /api/v1/orders - 股票不存在时应该返回400',
      test: async () => {
        await prisma.user.deleteMany();
        const testUser = await createTestUser(prisma);

        const orderData = {
          user_id: testUser.user_id,
          stock_id: 99999, // 不存在的股票ID
          order_type: 'BUY',
          quantity: 10,
          price_per_share: 100.0,
        };

        const req = createMockRequest('POST', orderData);
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(res._getData()).toEqual({
          error: 'Stock not found',
        });
      }
    },
    {
      name: 'POST /api/v1/orders - 现金不足时应该返回400',
      test: async () => {
        await prisma.order.deleteMany();
        await prisma.user.deleteMany();
        await prisma.stock.deleteMany();
        
        const testUser = await createTestUser(prisma, { cash: 500 }); // 现金不足
        const testStock = await createTestStock(prisma, { current_price: 100.0 });

        const orderData = {
          user_id: testUser.user_id,
          stock_id: testStock.stock_id,
          order_type: 'BUY',
          quantity: 10,
          price_per_share: 100.0, // 需要1000现金
        };

        const req = createMockRequest('POST', orderData);
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(res._getData()).toEqual({
          error: 'Insufficient funds',
        });
      }
    },
    {
      name: 'PUT /api/v1/orders - 应该返回405',
      test: async () => {
        const req = createMockRequest('PUT');
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(405);
        expect(res._getData()).toBe('Method PUT Not Allowed');
      }
    },
    {
      name: 'DELETE /api/v1/orders - 应该返回405',
      test: async () => {
        const req = createMockRequest('DELETE');
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(405);
        expect(res._getData()).toBe('Method DELETE Not Allowed');
      }
    },
  ];

  return await runTestSuite('订单API', tests);
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
  (async () => {
    await setupTestDB();
    try {
      await runOrdersTests();
    } finally {
      await cleanupTestDB();
    }
  })().catch(console.error);
}

export { runOrdersTests }; 