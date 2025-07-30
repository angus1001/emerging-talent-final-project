# API测试说明文档

本项目为所有API端点提供了完整的测试代码。

## 📁 测试文件结构

```
backend_v2/
├── __tests__/
│   ├── setup.ts                           # 测试设置和数据库连接
│   ├── utils/
│   │   └── test-utils.ts                  # 通用测试工具函数
│   ├── api/
│   │   └── v1/
│   │       ├── users-basic.test.ts        # 用户API测试（推荐）
│   │       ├── login.test.ts              # 登录API测试
│   │       ├── stocks.test.ts             # 股票API测试
│   │       ├── orders.test.ts             # 订单API测试
│   │       └── user-detail.test.ts        # 用户详情API测试
│   └── run-all-tests.ts                   # 综合测试运行器
├── jest.config.js                         # Jest配置文件
└── scripts/
    ├── run-tests.sh                       # Linux/Mac测试脚本
    └── run-tests.bat                      # Windows测试脚本
```

## 🚀 运行测试

### 方法1: 运行所有测试（推荐）

```bash
npm run test:all
```

### 方法2: 运行单个API测试

```bash
# 用户API测试
npm run test:users

# 登录API测试
npm run test:login

# 股票API测试
npm run test:stocks

# 订单API测试
npm run test:orders

# 用户详情API测试
npm run test:user-detail
```

### 方法3: 直接运行测试文件

```bash
# 运行所有测试
npx ts-node __tests__/run-all-tests.ts

# 运行特定测试
npx ts-node __tests__/api/v1/users-basic.test.ts
npx ts-node __tests__/api/v1/login.test.ts
npx ts-node __tests__/api/v1/stocks.test.ts
npx ts-node __tests__/api/v1/orders.test.ts
npx ts-node __tests__/api/v1/user-detail.test.ts
```

### 方法4: 使用脚本

```bash
# Linux/Mac
./scripts/run-tests.sh

# Windows
scripts\run-tests.bat
```

## 📋 测试覆盖范围

### 1. 用户API (`/api/v1/users`)
- ✅ GET - 获取所有用户
- ✅ POST - 创建新用户
- ✅ 验证必需字段
- ✅ 邮箱唯一性验证
- ✅ 错误处理

### 2. 登录API (`/api/v1/login`)
- ✅ POST - 邮箱登录
- ✅ POST - 用户名登录
- ✅ 验证必需字段
- ✅ 用户不存在处理
- ✅ 错误处理

### 3. 股票API (`/api/v1/stocks`)
- ✅ GET - 获取所有股票
- ✅ 按符号排序
- ✅ 错误处理

### 4. 订单API (`/api/v1/orders`)
- ✅ GET - 获取所有订单
- ✅ POST - 创建买入订单
- ✅ POST - 创建卖出订单
- ✅ 验证必需字段
- ✅ 订单类型验证
- ✅ 数量和价格验证
- ✅ 用户和股票存在性验证
- ✅ 现金余额验证
- ✅ 股票持仓验证
- ✅ 错误处理

### 5. 用户详情API (`/api/v1/users/[userId]`)
- ✅ GET - 获取用户详情
- ✅ PUT - 更新用户信息
- ✅ DELETE - 删除用户
- ✅ 用户ID验证
- ✅ 用户存在性验证
- ✅ 错误处理

## 🛠️ 测试工具

### 通用测试工具 (`test-utils.ts`)

提供了以下功能：

1. **Mock函数**
   - `createMockRequest()` - 创建模拟请求
   - `createMockResponse()` - 创建模拟响应

2. **测试运行器**
   - `runTestSuite()` - 运行测试套件

3. **断言函数**
   - `expect().toBe()` - 精确匹配
   - `expect().toEqual()` - 深度匹配
   - `expect().toMatchObject()` - 部分匹配
   - `expect().toHaveLength()` - 数组长度
   - `expect().toBeDefined()` - 定义检查
   - `expect().toBeNull()` - 空值检查
   - `expect().toBeGreaterThan()` - 大于比较
   - `expect().toBeLessThan()` - 小于比较
   - `expect().toContain()` - 包含检查

4. **测试数据创建**
   - `createTestUser()` - 创建测试用户
   - `createTestStock()` - 创建测试股票
   - `createTestOrder()` - 创建测试订单
   - `createTestHolding()` - 创建测试持仓
   - `createTestWatchlist()` - 创建测试观察列表

## 🗄️ 数据库设置

### 环境变量

```bash
# 测试数据库URL（推荐）
TEST_DATABASE_URL="mysql://user:password@localhost:3306/test_db"

# 或者使用主数据库（测试会清理数据）
DATABASE_URL="mysql://user:password@localhost:3306/main_db"
```

### 数据库准备

```bash
# 生成Prisma客户端
npm run prisma:generate

# 运行数据库迁移
npm run prisma:migrate
```

## 📊 测试输出示例

```
🚀 开始运行所有API测试...

🧪 开始运行 用户API 测试...

测试 1: GET /api/v1/users - 应该返回空数组当没有用户存在
✅ 通过
测试 2: GET /api/v1/users - 应该返回所有用户当用户存在
✅ 通过
测试 3: POST /api/v1/users - 应该用必需字段创建新用户
✅ 通过
...

用户API 测试完成: 8/8 通过
🎉 用户API 所有测试都通过了！

🧪 开始运行 登录API 测试...
...

==================================================
📊 总体测试结果: 5/5 个测试套件通过
🎉 所有API测试都通过了！
```

## 🔧 故障排除

### 常见问题

1. **数据库连接失败**
   ```bash
   # 检查数据库服务
   mysql -u root -p
   
   # 检查环境变量
   echo $DATABASE_URL
   ```

2. **Prisma错误**
   ```bash
   # 重新生成客户端
   npm run prisma:generate
   
   # 重置数据库
   npm run prisma:migrate:reset
   ```

3. **TypeScript错误**
   ```bash
   # 检查类型
   npx tsc --noEmit
   
   # 重新安装依赖
   npm install
   ```

### 调试测试

```bash
# 运行单个测试并显示详细输出
DEBUG=* npm run test:users

# 使用Node.js调试器
node --inspect-brk node_modules/.bin/ts-node __tests__/api/v1/users-basic.test.ts
```

## 📈 扩展测试

### 添加新测试

1. 创建测试文件：
   ```typescript
   import handler from '../../../pages/api/v1/your-endpoint';
   import { createMockRequest, createMockResponse, runTestSuite, expect } from '../../utils/test-utils';
   
   async function runYourTests() {
     const tests = [
       {
         name: '测试描述',
         test: async () => {
           // 测试逻辑
         }
       }
     ];
     
     return await runTestSuite('你的API', tests);
   }
   ```

2. 更新综合测试运行器：
   ```typescript
   import { runYourTests } from './api/v1/your-endpoint.test';
   
   // 在runAllTests函数中添加
   const yourResult = await runYourTests();
   ```

3. 添加npm脚本：
   ```json
   {
     "scripts": {
       "test:your-endpoint": "ts-node __tests__/api/v1/your-endpoint.test.ts"
     }
   }
   ```

## 🚀 持续集成

### GitHub Actions示例

```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run prisma:generate
      - run: npm run test:all
```

### 本地CI脚本

```bash
#!/bin/bash
# ci-test.sh

set -e

echo "🧪 运行API测试..."

# 安装依赖
npm install

# 生成Prisma客户端
npm run prisma:generate

# 运行所有测试
npm run test:all

echo "✅ 所有测试通过！"
```

## 📝 最佳实践

1. **测试隔离** - 每个测试独立运行，不依赖其他测试
2. **数据清理** - 测试前后清理数据库
3. **错误覆盖** - 测试正常流程和错误情况
4. **边界测试** - 测试边界值和异常输入
5. **性能考虑** - 避免不必要的数据库操作

## 🤝 贡献

1. 为新功能添加测试
2. 修复失败的测试
3. 改进测试覆盖率
4. 优化测试性能

---

**注意**: 运行测试前请确保数据库服务正在运行，并且环境变量配置正确。 