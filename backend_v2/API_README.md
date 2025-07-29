# Portfolio Manager API Documentation

## 概述
基于Next.js和Prisma构建的投资组合管理API，提供完整的股票交易和投资组合管理功能。

## 技术栈
- **框架**: Next.js
- **数据库**: MySQL (通过Prisma ORM)
- **语言**: TypeScript

## API端点

### 认证
- `POST /api/v1/login` - 用户登录

### 用户管理
- `GET /api/v1/users` - 获取所有用户
- `POST /api/v1/users` - 创建新用户
- `GET /api/v1/users/{userId}` - 获取用户详情
- `PUT /api/v1/users/{userId}` - 更新用户信息
- `DELETE /api/v1/users/{userId}` - 删除用户

### 股票管理
- `GET /api/v1/stocks` - 获取所有股票
- `GET /api/v1/stocks/{stockId}` - 获取股票详情

### 投资组合管理
- `GET /api/v1/users/{userId}/portfolio` - 获取用户投资组合摘要
- `GET /api/v1/users/{userId}/net-worth` - 获取净资产历史
- `GET /api/v1/users/{userId}/holdings` - 获取用户持仓
- `GET /api/v1/holdings/{holdingId}` - 获取持仓详情
- `DELETE /api/v1/holdings/{holdingId}` - 删除持仓（卖出所有股票）

### 订单管理
- `GET /api/v1/orders` - 获取所有订单（管理员）
- `POST /api/v1/orders` - 创建新订单
- `GET /api/v1/users/{userId}/orders` - 获取用户订单
- `GET /api/v1/orders/{orderId}` - 获取订单详情
- `PUT /api/v1/orders/{orderId}` - 更新订单状态

### 观察列表管理
- `GET /api/v1/users/{userId}/watchlist` - 获取用户观察列表
- `POST /api/v1/users/{userId}/watchlist` - 添加股票到观察列表
- `DELETE /api/v1/watchlist/{watchlistId}` - 从观察列表移除股票

## 数据模型

### User（用户）
- `user_id`: 用户ID（主键）
- `first_name`: 名字
- `last_name`: 姓氏
- `password`: 密码
- `email`: 邮箱（唯一）
- `phone`: 电话
- `created_at`: 创建时间
- `language`: 语言
- `location`: 位置

### Stock（股票）
- `stock_id`: 股票ID（主键）
- `symbol`: 股票代码
- `company_name`: 公司名称
- `current_price`: 当前价格
- `last_updated`: 最后更新时间
- `exchange`: 交易所
- `volume`: 成交量
- `sector`: 行业
- `market_cap`: 市值
- `company_info`: 公司信息
- `in_list`: 是否在列表中

### Order（订单）
- `order_id`: 订单ID（主键）
- `user_id`: 用户ID（外键）
- `stock_id`: 股票ID（外键）
- `order_type`: 订单类型（BUY/SELL）
- `quantity`: 数量
- `price_per_share`: 每股价格
- `total_value`: 总价值
- `date`: 订单日期
- `status`: 状态（PENDING/EXECUTED/CANCELLED）
- `duration`: 有效期

### Holding（持仓）
- `holding_id`: 持仓ID（主键）
- `user_id`: 用户ID（外键）
- `stock_id`: 股票ID（外键）
- `holding_number`: 持有数量
- `average_price`: 平均价格
- `cash`: 现金余额
- `total_value`: 总价值
- `last_updated`: 最后更新时间

### Watchlist（观察列表）
- `watchlist_id`: 观察列表ID（主键）
- `user_id`: 用户ID（外键）
- `stock_id`: 股票ID（外键）
- `display_name`: 显示名称
- `created_at`: 创建时间

### NetWorth（净资产）
- `net_worth_id`: 净资产ID（主键）
- `user_id`: 用户ID（外键）
- `total_balance`: 总余额
- `stock_value`: 股票价值
- `date_recorded`: 记录日期

## 使用示例

### 创建用户
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "password": "password123",
    "email": "john.doe@example.com"
  }'
```

### 用户登录
```bash
curl -X POST http://localhost:3000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "John",
    "email": "john.doe@example.com"
  }'
```

### 创建订单
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "stock_id": 1,
    "order_type": "BUY",
    "quantity": 10,
    "price_per_share": 150.50
  }'
```

### 获取投资组合
```bash
curl -X GET http://localhost:3000/api/v1/users/1/portfolio
```

## 错误处理
API使用标准HTTP状态码：
- `200`: 成功
- `201`: 创建成功
- `204`: 删除成功
- `400`: 请求错误
- `401`: 未授权
- `404`: 资源未找到
- `405`: 方法不允许
- `500`: 服务器错误

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 设置环境变量：
```bash
DATABASE_URL="mysql://username:password@localhost:3306/portfolio_manager"
```

3. 运行数据库迁移：
```bash
npx prisma migrate dev
```

4. 启动开发服务器：
```bash
npm run dev
```

## 注意事项
- 所有API端点都使用JSON格式进行数据交换
- 用户认证目前使用简单的用户名/邮箱验证，生产环境建议使用JWT
- 订单执行包含完整的交易逻辑，包括持仓更新和现金管理
- 数据库使用MySQL，确保数据库连接配置正确 