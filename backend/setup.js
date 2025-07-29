#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Financial Portfolio Management API Backend...\n');

// 检查Node.js版本
const nodeVersion = process.version;
console.log(`📦 Node.js version: ${nodeVersion}`);

// 检查是否已安装依赖
if (!fs.existsSync('node_modules')) {
  console.log('\n📥 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed');
}

// 检查环境变量文件
const envFile = '.env.local';
if (!fs.existsSync(envFile)) {
  console.log('\n🔧 Creating environment configuration...');
  const envExample = fs.readFileSync('env.example', 'utf8');
  fs.writeFileSync(envFile, envExample);
  console.log(`✅ Environment file created: ${envFile}`);
  console.log('⚠️  Please update the environment variables in .env.local');
} else {
  console.log('✅ Environment file already exists');
}

// 检查数据库连接
console.log('\n🔍 Checking database connection...');
console.log('⚠️  Please ensure PostgreSQL is running and the database is created');
console.log('   You can run the following commands:');
console.log('   createdb portfolio_db');
console.log('   psql -d portfolio_db -f ddl.sql');
console.log('   psql -d portfolio_db -f data.sql');

// 显示启动说明
console.log('\n🎯 Setup complete! To start the development server:');
console.log('   npm run dev');
console.log('\n📚 Available scripts:');
console.log('   npm run dev     - Start development server');
console.log('   npm run build   - Build for production');
console.log('   npm run start   - Start production server');
console.log('   npm run lint    - Run ESLint');
console.log('   npm test        - Run tests');

console.log('\n🌐 API Documentation:');
console.log('   http://localhost:3000/api/docs');

console.log('\n📖 For more information, see README.md'); 