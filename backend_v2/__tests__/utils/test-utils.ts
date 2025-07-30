import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

// 简单的mock函数
export function createMockRequest(method: string, body?: any, query?: any): NextApiRequest {
  return {
    method,
    body,
    query: query || {},
    headers: {},
  } as NextApiRequest;
}

export function createMockResponse(): any {
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
export async function runTestSuite(suiteName: string, tests: Array<{name: string, test: () => Promise<void>}>) {
  console.log(`\n🧪 开始运行 ${suiteName} 测试...\n`);
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (let i = 0; i < tests.length; i++) {
    const { name, test } = tests[i];
    console.log(`测试 ${i + 1}: ${name}`);
    
    try {
      await test();
      console.log(`✅ 通过`);
      passedTests++;
    } catch (error) {
      console.log(`❌ 失败: ${error.message}`);
    }
  }
  
  console.log(`\n${suiteName} 测试完成: ${passedTests}/${totalTests} 通过`);
  
  if (passedTests === totalTests) {
    console.log(`🎉 ${suiteName} 所有测试都通过了！`);
  } else {
    console.log(`⚠️  ${suiteName} 有些测试失败了`);
  }
  
  return passedTests === totalTests;
}

// 断言函数
export const expect = (actual: any) => ({
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
  toBeNull: () => {
    if (actual !== null) {
      throw new Error(`期望 null，但得到 ${actual}`);
    }
  },
  toBeGreaterThan: (expected: number) => {
    if (actual <= expected) {
      throw new Error(`期望大于 ${expected}，但得到 ${actual}`);
    }
  },
  toBeLessThan: (expected: number) => {
    if (actual >= expected) {
      throw new Error(`期望小于 ${expected}，但得到 ${actual}`);
    }
  },
  toContain: (expected: any) => {
    if (!Array.isArray(actual)) {
      throw new Error('期望数组，但得到非数组');
    }
    if (!actual.includes(expected)) {
      throw new Error(`期望数组包含 ${expected}`);
    }
  }
});

// 测试数据创建函数
export async function createTestUser(prisma: PrismaClient, userData?: any) {
  return await prisma.user.create({
    data: {
      first_name: userData?.first_name || 'Test',
      last_name: userData?.last_name || 'User',
      email: userData?.email || `test.user.${Date.now()}@example.com`,
      password: userData?.password || 'password123',
      phone: userData?.phone || '1234567890',
      language: userData?.language || 'en',
      location: userData?.location || 'Test City',
      cash: userData?.cash || 10000,
    },
  });
}

export async function createTestStock(prisma: PrismaClient, stockData?: any) {
  return await prisma.stock.create({
    data: {
      symbol: stockData?.symbol || `TEST${Date.now()}`,
      company_name: stockData?.company_name || 'Test Company',
      current_price: stockData?.current_price || 100.0,
      exchange: stockData?.exchange || 'NYSE',
      volume: stockData?.volume || '1000000',
      sector: stockData?.sector || 'Technology',
      market_cap: stockData?.market_cap || '1000000000',
      company_info: stockData?.company_info || 'Test company information',
    },
  });
}

export async function createTestOrder(prisma: PrismaClient, orderData: any) {
  return await prisma.order.create({
    data: {
      user_id: orderData.user_id,
      stock_id: orderData.stock_id,
      order_type: orderData.order_type,
      quantity: orderData.quantity,
      price_per_share: orderData.price_per_share,
      total_value: orderData.quantity * orderData.price_per_share,
      date: new Date(),
      status: orderData.status || 'PENDING',
      duration: orderData.duration || 'DAY',
    },
  });
}

export async function createTestHolding(prisma: PrismaClient, holdingData: any) {
  return await prisma.holding.create({
    data: {
      user_id: holdingData.user_id,
      stock_id: holdingData.stock_id,
      holding_number: holdingData.holding_number,
      average_price: holdingData.average_price,
      cash: holdingData.holding_number * holdingData.average_price,
      total_value: holdingData.holding_number * holdingData.average_price,
      last_updated: new Date(),
    },
  });
}

export async function createTestWatchlist(prisma: PrismaClient, watchlistData: any) {
  return await prisma.watchlist.create({
    data: {
      user_id: watchlistData.user_id,
      stock_id: watchlistData.stock_id,
      display_name: watchlistData.display_name || 'Test Watchlist',
    },
  });
} 