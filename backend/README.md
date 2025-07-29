# Financial Portfolio Management API Backend

这是一个基于Next.js的金融投资组合管理API后端项目。

## 功能特性

- 用户管理（注册、登录、个人信息管理）
- 股票信息管理
- 投资组合管理
- 订单管理（买入、卖出）
- 持仓管理
- 观察列表管理
- 净资产历史追踪

## 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **数据库**: PostgreSQL
- **ORM**: 原生SQL查询
- **认证**: JWT
- **API文档**: Swagger/OpenAPI

## 项目结构

```
backend/
├── lib/
│   └── db.ts                 # 数据库连接和工具函数
├── middleware.ts             # 中间件（错误处理、验证、CORS）
├── pages/
│   └── api/
│       └── v1/
│           ├── users/        # 用户相关API
│           ├── stocks/       # 股票相关API
│           ├── orders/       # 订单相关API
│           ├── holdings/     # 持仓相关API
│           └── watchlist/    # 观察列表相关API
├── type.ts                   # TypeScript类型定义
├── package.json              # 项目依赖
├── next.config.js           # Next.js配置
├── tsconfig.json            # TypeScript配置
└── README.md                # 项目说明
```

## 安装和运行

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 环境配置

复制环境变量示例文件并配置：

```bash
cp env.example .env.local
```

编辑 `.env.local` 文件，配置数据库连接信息：

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=portfolio_db
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key_here
```

### 3. 数据库设置

确保PostgreSQL数据库已安装并运行，然后执行SQL脚本：

```bash
# 创建数据库
createdb portfolio_db

# 执行DDL脚本
psql -d portfolio_db -f ddl.sql

# 插入示例数据
psql -d portfolio_db -f data.sql
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动。

## API端点

### 用户管理
- `GET /api/v1/users` - 获取所有用户
- `POST /api/v1/users` - 创建新用户
- `GET /api/v1/users/{userId}` - 获取用户详情
- `PUT /api/v1/users/{userId}` - 更新用户信息
- `DELETE /api/v1/users/{userId}` - 删除用户

### 股票管理
- `GET /api/v1/stocks` - 获取所有股票
- `GET /api/v1/stocks/{stockId}` - 获取股票详情

### 投资组合
- `GET /api/v1/users/{userId}/portfolio` - 获取投资组合摘要
- `GET /api/v1/users/{userId}/net-worth` - 获取净资产历史
- `GET /api/v1/users/{userId}/holdings` - 获取用户持仓

### 订单管理
- `GET /api/v1/orders` - 获取所有订单
- `POST /api/v1/orders` - 创建新订单
- `GET /api/v1/users/{userId}/orders` - 获取用户订单
- `GET /api/v1/orders/{orderId}` - 获取订单详情
- `PUT /api/v1/orders/{orderId}` - 更新订单状态

### 持仓管理
- `GET /api/v1/holdings/{holdingId}` - 获取持仓详情
- `DELETE /api/v1/holdings/{holdingId}` - 删除持仓

### 观察列表
- `GET /api/v1/users/{userId}/watchlist` - 获取用户观察列表
- `POST /api/v1/users/{userId}/watchlist` - 添加到观察列表
- `GET /api/v1/watchlist/{watchlistId}` - 获取观察列表项目
- `DELETE /api/v1/watchlist/{watchlistId}` - 从观察列表移除

## 开发

### 代码规范

- 使用TypeScript进行类型检查
- 遵循ESLint规则
- 使用Prettier进行代码格式化

### 测试

```bash
npm test
```

### 构建

```bash
npm run build
```

### 生产部署

```bash
npm start
```

## 数据库设计

项目包含以下主要数据表：

- `users` - 用户信息
- `stocks` - 股票信息
- `orders` - 交易订单
- `holdings` - 持仓信息
- `watchlist` - 观察列表
- `net_worth` - 净资产历史

详细的数据库结构请参考 `ddl.sql` 文件。

## 贡献

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。 