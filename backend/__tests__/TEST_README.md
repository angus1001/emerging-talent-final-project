# 用户API测试说明

本项目为用户API端点提供了完整的测试代码。

## 测试文件结构

```
backend_v2/
├── __tests__/
│   ├── setup.ts                    # 测试设置和数据库连接
│   └── api/
│       └── v1/
│           ├── users.test.ts       # 使用Jest的完整测试（需要额外依赖）
│           ├── users-simple.test.ts # 使用Jest的简化测试
│           └── users-basic.test.ts # 自定义测试运行器（推荐）
└── jest.config.js                  # Jest配置文件
```

## 安装依赖

首先安装测试相关的依赖：

```bash
npm install --save-dev jest @types/jest ts-jest node-mocks-http
```

## 运行测试

### 方法1: 使用自定义测试运行器（推荐）

这是最简单的测试方法，不需要额外的依赖：

```bash
# 使用ts-node运行测试
npx ts-node __tests__/api/v1/users-basic.test.ts
```

### 方法2: 使用Jest

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test users-simple.test.ts

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

## 测试覆盖范围

测试覆盖了以下功能：

### GET /api/v1/users
- ✅ 返回空数组当没有用户存在
- ✅ 返回所有用户当用户存在

### POST /api/v1/users
- ✅ 用必需字段创建新用户
- ✅ 用所有字段创建新用户
- ✅ 缺少必需字段时返回400错误
- ✅ 邮箱已存在时返回400错误
- ✅ 缺少first_name时返回400错误
- ✅ 缺少last_name时返回400错误
- ✅ 缺少password时返回400错误
- ✅ 缺少email时返回400错误

### 不支持的HTTP方法
- ✅ PUT方法返回405
- ✅ DELETE方法返回405
- ✅ PATCH方法返回405

## 数据库设置

测试需要一个测试数据库。你可以：

1. 使用单独的测试数据库
2. 使用主数据库（测试会清理数据）

设置环境变量：

```bash
# 测试数据库URL（可选）
TEST_DATABASE_URL="mysql://user:password@localhost:3306/test_db"

# 或者使用主数据库
DATABASE_URL="mysql://user:password@localhost:3306/main_db"
```

## 测试输出示例

```
开始运行用户API测试...

测试 1: GET /api/v1/users - 应该返回空数组当没有用户存在
✅ 通过
测试 2: GET /api/v1/users - 应该返回所有用户当用户存在
✅ 通过
测试 3: POST /api/v1/users - 应该用必需字段创建新用户
✅ 通过
测试 4: POST /api/v1/users - 应该用所有字段创建新用户
✅ 通过
测试 5: POST /api/v1/users - 缺少必需字段时应该返回400
✅ 通过
测试 6: POST /api/v1/users - 邮箱已存在时应该返回400
✅ 通过
测试 7: PUT /api/v1/users - 应该返回405
✅ 通过
测试 8: DELETE /api/v1/users - 应该返回405
✅ 通过

测试完成: 8/8 通过
🎉 所有测试都通过了！
```

## 故障排除

### 数据库连接问题
- 确保数据库服务正在运行
- 检查DATABASE_URL环境变量
- 确保Prisma schema已生成：`npm run prisma:generate`

### 测试失败
- 检查控制台输出的具体错误信息
- 确保数据库表结构正确
- 验证API端点的实现

### TypeScript错误
- 运行 `npm run prisma:generate` 重新生成Prisma客户端
- 检查 `tsconfig.json` 配置

## 扩展测试

要添加新的测试用例：

1. 在相应的测试文件中添加新的测试函数
2. 使用 `test()` 函数包装测试逻辑
3. 使用 `expect()` 函数进行断言
4. 确保测试前后正确清理数据

## 持续集成

建议在CI/CD流程中包含这些测试：

```yaml
# GitHub Actions示例
- name: Run API Tests
  run: |
    npm install
    npm run prisma:generate
    npx ts-node __tests__/api/v1/users-basic.test.ts
``` 