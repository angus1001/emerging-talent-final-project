@echo off
REM 用户API测试运行脚本 (Windows)

echo 🚀 开始运行用户API测试...

REM 检查是否安装了Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: 需要安装Node.js和npm
    exit /b 1
)

REM 检查Prisma客户端是否已生成
if not exist "node_modules\.prisma" (
    echo 📦 生成Prisma客户端...
    call npm run prisma:generate
)

REM 运行测试
echo 🧪 运行测试...
call npx ts-node __tests__/api/v1/users-basic.test.ts

REM 检查测试结果
if %errorlevel% equ 0 (
    echo ✅ 测试完成！
) else (
    echo ❌ 测试失败！
    exit /b 1
) 