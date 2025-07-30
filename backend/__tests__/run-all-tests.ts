import { setupTestDB, cleanupTestDB } from './setup';
import { runLoginTests } from './api/v1/login.test';
import { runStocksTests } from './api/v1/stocks.test';
import { runOrdersTests } from './api/v1/orders.test';
import { runUserDetailTests } from './api/v1/user-detail.test';

async function runAllTests() {
  console.log('🚀 开始运行所有API测试...\n');
  
  let totalPassed = 0;
  let totalTests = 0;
  
  try {
    // 运行登录API测试
    const loginResult = await runLoginTests();
    totalPassed += loginResult ? 1 : 0;
    totalTests += 1;
    
    // 运行股票API测试
    const stocksResult = await runStocksTests();
    totalPassed += stocksResult ? 1 : 0;
    totalTests += 1;
    
    // 运行订单API测试
    const ordersResult = await runOrdersTests();
    totalPassed += ordersResult ? 1 : 0;
    totalTests += 1;
    
    // 运行用户详情API测试
    const userDetailResult = await runUserDetailTests();
    totalPassed += userDetailResult ? 1 : 0;
    totalTests += 1;
    
  } catch (error) {
    console.error('❌ 测试运行出错:', error);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 总体测试结果: ${totalPassed}/${totalTests} 个测试套件通过`);
  
  if (totalPassed === totalTests) {
    console.log('🎉 所有API测试都通过了！');
  } else {
    console.log('⚠️  有些API测试失败了');
  }
  
  return totalPassed === totalTests;
}

// 如果直接运行此文件，则执行所有测试
if (require.main === module) {
  (async () => {
    await setupTestDB();
    try {
      await runAllTests();
    } finally {
      await cleanupTestDB();
    }
  })().catch(console.error);
}

export { runAllTests }; 