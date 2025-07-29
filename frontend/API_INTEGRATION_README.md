# Frontend API Integration Guide

## 概述

本指南说明如何设置前端以连接到后端API，特别是用户数据管理功能。

## 环境配置

### 1. 环境变量设置

在 `frontend` 目录下创建 `.env.local` 文件：

```bash
# API配置
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# 开发环境设置
NODE_ENV=development
```

### 2. 安装必要的依赖

确保已安装以下依赖项（如果项目中还没有）：

```bash
# 在frontend目录下运行
npm install
```

## API接口说明

### 用户API接口

基于后端提供的用户接口结构：

```typescript
interface ApiUser {
  user_id: number;
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  phone?: string;
  created_at: string;
  language?: string;
  location?: string;
}
```

### 可用的API方法

- `userApi.getUsers()` - 获取所有用户
- `userApi.getUserById(userId)` - 根据ID获取用户
- `userApi.createUser(userData)` - 创建新用户
- `userApi.updateUser(userId, userData)` - 更新用户信息
- `userApi.deleteUser(userId)` - 删除用户

## 文件结构

```
frontend/
├── .env.local                    # 环境变量配置
├── lib/
│   ├── api.ts                   # API服务层
│   └── user-data.ts             # 用户数据管理层
├── hooks/
│   └── use-user-data.ts         # 用户数据React Hook
├── components/
│   ├── edit-user-dialog.tsx     # 用户信息编辑对话框
│   └── toast.tsx                # Toast通知组件
└── app/
    └── profile/
        └── page.tsx             # 个人资料页面
```

## 主要功能

### 1. 用户数据获取
- 自动从API获取用户数据
- 加载状态管理
- 错误处理和回退机制

### 2. 用户信息编辑
- 弹窗式编辑界面
- 表单验证
- 实时更新

### 3. 状态管理
- 加载状态指示器
- 错误状态显示
- 成功/失败通知

### 4. 响应式设计
- 移动端友好
- 自适应布局

## 使用方法

### 在组件中使用用户数据

```typescript
import { useUserData } from '@/hooks/use-user-data';

function MyComponent() {
  const { user, loading, error, refetchUser, updateUser } = useUserData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      {/* 其他组件内容 */}
    </div>
  );
}
```

### 更新用户信息

```typescript
const handleUpdate = async () => {
  try {
    await updateUser({
      first_name: 'New First Name',
      last_name: 'New Last Name',
      email: 'new@example.com'
    });
    // 更新成功
  } catch (error) {
    // 处理错误
  }
};
```

## 开发注意事项

### 1. 错误处理
- 所有API调用都包含错误处理
- 提供友好的错误消息
- 自动回退到模拟数据

### 2. 类型安全
- 使用TypeScript接口定义所有数据结构
- API响应类型化
- 编译时类型检查

### 3. 性能优化
- 避免不必要的API调用
- 实现数据缓存
- 加载状态优化

### 4. 安全考虑
- 不在客户端存储敏感信息
- API URL通过环境变量配置
- 输入验证和清理

## 测试

### 1. 本地开发测试

1. 启动后端服务器（确保运行在端口3000）
2. 在frontend目录运行：
   ```bash
   npm run dev
   ```
3. 访问 http://localhost:3001/profile

### 2. API连接测试

检查以下功能：
- [ ] 用户数据加载
- [ ] 编辑用户信息
- [ ] 错误处理
- [ ] 加载状态
- [ ] Toast通知

## 故障排除

### 常见问题

1. **API连接失败**
   - 检查后端服务器是否运行
   - 验证环境变量配置
   - 检查网络连接

2. **数据不显示**
   - 检查API响应结构
   - 验证数据转换逻辑
   - 查看浏览器控制台错误

3. **更新失败**
   - 检查请求数据格式
   - 验证API权限
   - 查看网络请求日志

## 未来改进

- [ ] 添加数据缓存
- [ ] 实现离线支持
- [ ] 添加更多字段验证
- [ ] 优化加载性能
- [ ] 添加用户头像上传功能
