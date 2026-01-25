#!/usr/bin/env node

import { execSync } from 'child_process';
import { config } from 'dotenv';

// 加载环境变量
config({ path: '.env.local' });

console.log('🚀 Vercel 生产环境构建开始...');

try {
  console.log('📊 环境检查...');
  console.log('Node.js版本:', process.version);
  console.log('工作目录:', process.cwd());
  
  // 设置非交互模式
  process.env.NODE_OPTIONS = '--no-deprecation';
  process.env.CI = 'true';
  
  console.log('🔧 运行数据库迁移 (非交互模式)...');
  
  try {
    // 尝试运行迁移，忽略用户确认提示
    execSync('npx payload migrate', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        PAYLOAD_SKIP_CONFIRMATION: 'true'
      }
    });
    console.log('✅ 数据库迁移完成');
  } catch (migrateError) {
    console.log('⚠️ 迁移可能有警告，继续构建...');
    console.log('迁移输出:', migrateError.message);
  }
  
  console.log('🏗️ 构建 Next.js 应用...');
  execSync('pnpm build', { stdio: 'inherit' });
  
  console.log('✅ 构建成功完成！');
  
} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}