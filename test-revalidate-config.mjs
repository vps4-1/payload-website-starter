#!/usr/bin/env node

console.log('🔍 REVALIDATE_SECRET 配置验证');

const REVALIDATE_SECRET = "dQ9VX8lN6pQ8w9OhEWxvxKhYUIIoeqhYNuzLEjzA5EA=";

async function testRevalidateEndpoint(baseUrl, secretValue) {
  console.log(`\n🧪 测试 ${baseUrl}`);
  
  const testCases = [
    {
      name: '无密钥',
      url: `${baseUrl}/api/revalidate`,
      expectedStatus: 401
    },
    {
      name: '错误密钥',
      url: `${baseUrl}/api/revalidate?secret=wrong-secret`,
      expectedStatus: 401
    },
    {
      name: '正确密钥',
      url: `${baseUrl}/api/revalidate?secret=${secretValue}`,
      expectedStatus: 200
    }
  ];
  
  for (const test of testCases) {
    try {
      const response = await fetch(test.url, { method: 'POST' });
      const data = await response.json();
      
      console.log(`  ${test.name}:`);
      console.log(`    状态: ${response.status} ${response.status === test.expectedStatus ? '✅' : '❌'}`);
      console.log(`    响应: ${JSON.stringify(data)}`);
      
    } catch (error) {
      console.log(`  ${test.name}: ❌ 网络错误 - ${error.message}`);
    }
  }
}

async function main() {
  console.log('📋 当前配置:');
  console.log(`REVALIDATE_SECRET: ${REVALIDATE_SECRET}`);
  
  // 测试本地环境
  await testRevalidateEndpoint('http://localhost:3001', REVALIDATE_SECRET);
  
  // 测试生产环境
  await testRevalidateEndpoint('https://sijigpt.com', REVALIDATE_SECRET);
  
  console.log('\n📝 检查清单:');
  console.log('□ Vercel 环境变量中是否添加了 REVALIDATE_SECRET');
  console.log('□ Cloudflare Worker 中是否配置了相同的密钥');
  console.log('□ 生产环境是否已部署最新代码');
  console.log('□ 环境变量配置后是否重新部署了');
  
  console.log('\n🔧 故障排除:');
  console.log('1. 检查 Vercel Dashboard → Project → Settings → Environment Variables');
  console.log('2. 确认 REVALIDATE_SECRET 变量存在且值正确');
  console.log('3. 如果刚添加变量，需要触发重新部署');
  console.log('4. 在 Vercel 中点击 "Redeploy" 按钮');
  
  console.log('\n🚀 Worker 配置示例:');
  console.log('在 Cloudflare Worker 中使用:');
  console.log(`const revalidateUrl = \`\${env.PAYLOAD_URL}/api/revalidate?secret=\${env.REVALIDATE_SECRET}\`;`);
  console.log(`await fetch(revalidateUrl, { method: 'POST' });`);
}

main().catch(console.error);