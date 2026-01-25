#!/usr/bin/env node

import { randomBytes } from 'crypto';

console.log('🔐 生成 REVALIDATE_SECRET');

// 生成一个 32 字节的随机密钥，转为 base64
const revalidateSecret = randomBytes(32).toString('base64');

console.log('\n📋 生成的 REVALIDATE_SECRET:');
console.log(`REVALIDATE_SECRET="${revalidateSecret}"`);

console.log('\n🔧 用途说明:');
console.log('REVALIDATE_SECRET 用于保护 Next.js 的缓存刷新端点 /api/revalidate');
console.log('当 Cloudflare Worker 或外部系统需要触发缓存刷新时，需要提供此密钥');

console.log('\n📖 使用场景:');
console.log('1. Cloudflare Worker 完成文章处理后');
console.log('2. 手动触发网站内容刷新时');
console.log('3. Webhook 自动更新缓存时');

console.log('\n🌐 API 调用示例:');
console.log(`POST https://sijigpt.com/api/revalidate?secret=${revalidateSecret}`);

console.log('\n⚙️ 配置步骤:');
console.log('1. 将此密钥添加到 .env.local 文件');
console.log('2. 在 Cloudflare Worker 中设置相同的密钥');
console.log('3. 确保生产环境 Vercel 中也配置了此环境变量');

// 检查当前配置
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

try {
  const envPath = join(process.cwd(), '.env.local');
  let envContent = readFileSync(envPath, 'utf8');
  
  // 检查是否已有 REVALIDATE_SECRET
  if (envContent.includes('REVALIDATE_SECRET')) {
    console.log('\n⚠️  注意: .env.local 中已经存在 REVALIDATE_SECRET');
    console.log('如需更新，请手动替换现有值');
  } else {
    // 添加 REVALIDATE_SECRET
    envContent += `\nREVALIDATE_SECRET="${revalidateSecret}"`;
    writeFileSync(envPath, envContent);
    console.log('\n✅ REVALIDATE_SECRET 已自动添加到 .env.local 文件');
  }
  
} catch (error) {
  console.log('\n📝 请手动将以下行添加到 .env.local 文件:');
  console.log(`REVALIDATE_SECRET="${revalidateSecret}"`);
}