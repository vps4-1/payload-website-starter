#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), '.env.local') });

const POSTGRES_URL = process.env.POSTGRES_URL;

async function analyzeAdminPanelFields() {
  console.log('🔍 Admin Panel 字段可见性分析');
  
  if (!POSTGRES_URL) {
    console.error('❌ POSTGRES_URL environment variable is not set');
    return;
  }

  const sql = neon(POSTGRES_URL);
  
  try {
    // 获取用户表的完整字段信息
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `;
    
    console.log('\n📊 Users 表的完整字段结构:');
    columns.forEach((col, index) => {
      const info = [
        `${col.data_type}${col.character_maximum_length ? `(${col.character_maximum_length})` : ''}`,
        col.is_nullable === 'YES' ? 'nullable' : 'NOT NULL',
        col.column_default ? `default: ${col.column_default}` : ''
      ].filter(Boolean).join(' ');
      
      console.log(`  ${index + 1}. ${col.column_name}: ${info}`);
    });
    
    // 检查当前用户的数据
    const users = await sql`
      SELECT id, name, email, "enableAPIKey", enable_a_p_i_key, 
             CASE WHEN api_key IS NOT NULL THEN '已生成' ELSE '未生成' END as api_key_status,
             created_at, updated_at
      FROM users
      ORDER BY id
    `;
    
    console.log('\n👤 当前用户数据:');
    users.forEach(user => {
      console.log(`\n  用户 ID ${user.id}:`);
      console.log(`    - 姓名: ${user.name}`);
      console.log(`    - 邮箱: ${user.email}`);
      console.log(`    - enableAPIKey: ${user.enableAPIKey ? '✅ true' : '❌ false'}`);
      console.log(`    - enable_a_p_i_key: ${user.enable_a_p_i_key ? '✅ true' : '❌ false'}`);
      console.log(`    - API Token 状态: ${user.api_key_status}`);
      console.log(`    - 创建时间: ${user.created_at}`);
      console.log(`    - 更新时间: ${user.updated_at}`);
    });
    
    console.log('\n🎯 Admin Panel 字段配置检查:');
    
    // 检查 Users 集合配置
    console.log('\n  根据配置文件，Users 集合应该包含以下字段:');
    console.log('  1. ✅ name (text) - 基础字段');
    console.log('  2. 🔑 enableAPIKey (checkbox) - "Enable API Key" 选项');
    console.log('  3. 🔧 内置字段: email, password, timestamps');
    
    console.log('\n🔧 可能导致字段不显示的原因:');
    console.log('  1. 字段权限配置 - 检查字段的 access 属性');
    console.log('  2. 条件显示配置 - 检查字段的 admin.condition 属性'); 
    console.log('  3. 字段类型问题 - 检查字段类型是否正确');
    console.log('  4. Admin UI 渲染问题 - 检查 admin.hidden 属性');
    console.log('  5. 浏览器缓存问题 - 尝试硬刷新浏览器');
    
    console.log('\n🧪 故障排除步骤:');
    console.log('  1. 确认当前服务器运行正常');
    console.log('  2. 清空浏览器缓存并硬刷新');
    console.log('  3. 检查浏览器控制台是否有JavaScript错误');
    console.log('  4. 确认登录用户有足够的权限');
    console.log('  5. 检查字段是否有条件显示逻辑');
    
    console.log('\n🌐 当前测试环境:');
    console.log('  - 本地开发: http://localhost:3000/admin');
    console.log('  - 公共访问: https://3000-iv1utm22vom9yyelf9754-de59bda9.sandbox.novita.ai/admin');
    console.log('  - 生产环境: https://sijigpt.com/admin');
    
    console.log('\n🔍 调试建议:');
    console.log('  如果 "Enable API Key" 选项仍然不显示，请检查:');
    console.log('  1. 浏览器开发者工具 -> Network 标签页，查看是否有API请求失败');
    console.log('  2. Console 标签页，查看是否有JavaScript错误');
    console.log('  3. 尝试直接访问 API: /api/users/1 查看字段数据');
    
  } catch (error) {
    console.error('❌ 数据库查询失败:', error.message);
  }
}

analyzeAdminPanelFields();