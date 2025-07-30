#!/bin/bash

# 用户API测试运行脚本

echo "🚀 开始运行用户API测试..."

# 检查是否安装了ts-node
if ! command -v npx &> /dev/null; then
    echo "❌ 错误: 需要安装Node.js和npm"
    exit 1
fi

# 检查Prisma客户端是否已生成
if [ ! -d "node_modules/.prisma" ]; then
    echo "📦 生成Prisma客户端..."
    npm run prisma:generate
fi

# 运行测试
echo "🧪 运行测试..."
npx ts-node __tests__/api/v1/users-basic.test.ts

# 检查测试结果
if [ $? -eq 0 ]; then
    echo "✅ 测试完成！"
else
    echo "❌ 测试失败！"
    exit 1
fi 