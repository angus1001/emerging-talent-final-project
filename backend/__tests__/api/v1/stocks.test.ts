import handler from '../../../pages/api/v1/stocks/index';
import { prisma, setupTestDB, cleanupTestDB } from '../../setup';
import { createMockRequest, createMockResponse, runTestSuite, expect, createTestStock } from '../../utils/test-utils';

async function runStocksTests() {
  const tests = [
    {
      name: 'GET /api/v1/stocks - 应该返回空数组当没有股票存在',
      test: async () => {
        await prisma.stock.deleteMany();
        
        const req = createMockRequest('GET');
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        expect(res._getData()).toEqual([]);
      }
    },
    {
      name: 'GET /api/v1/stocks - 应该返回所有股票当股票存在',
      test: async () => {
        await prisma.stock.deleteMany();
        
        const testStock1 = await createTestStock(prisma, {
          symbol: 'AAPL',
          company_name: 'Apple Inc.',
          current_price: 150.0,
        });

        const testStock2 = await createTestStock(prisma, {
          symbol: 'GOOGL',
          company_name: 'Alphabet Inc.',
          current_price: 2500.0,
        });

        const req = createMockRequest('GET');
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        const stocks = res._getData();
        expect(stocks).toHaveLength(2);
        expect(stocks[0].symbol).toBe('AAPL');
        expect(stocks[1].symbol).toBe('GOOGL');
      }
    },
    {
      name: 'POST /api/v1/stocks - 应该返回405',
      test: async () => {
        const req = createMockRequest('POST', {});
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(405);
        expect(res._getData()).toBe('Method POST Not Allowed');
      }
    },
    {
      name: 'PUT /api/v1/stocks - 应该返回405',
      test: async () => {
        const req = createMockRequest('PUT');
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(405);
        expect(res._getData()).toBe('Method PUT Not Allowed');
      }
    },
    {
      name: 'DELETE /api/v1/stocks - 应该返回405',
      test: async () => {
        const req = createMockRequest('DELETE');
        const res = createMockResponse();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(405);
        expect(res._getData()).toBe('Method DELETE Not Allowed');
      }
    },
  ];

  return await runTestSuite('股票API', tests);
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
  (async () => {
    await setupTestDB();
    try {
      await runStocksTests();
    } finally {
      await cleanupTestDB();
    }
  })().catch(console.error);
}

export { runStocksTests }; 