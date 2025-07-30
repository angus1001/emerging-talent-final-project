import { PrismaClient } from '@prisma/client';

// 创建测试数据库连接
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

// 导出prisma实例供测试使用
export { prisma };

// 全局测试设置
export const setupTestDB = async () => {
  // 清理测试数据库
  await prisma.user.deleteMany();
  await prisma.order.deleteMany();
  await prisma.holding.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.netWorth.deleteMany();
  await prisma.stockPriceHistory.deleteMany();
  await prisma.stock.deleteMany();
};

// 全局测试清理
export const cleanupTestDB = async () => {
  await prisma.$disconnect();
}; 