#!/usr/bin/env node

/**
 * 🧪 SijiGPT 完整流程测试脚本
 * 测试 Payload → Hook → Worker → Telegram 完整流程
 */

import fetch from 'node-fetch';

const CONFIG = {
  // Payload 配置
  payloadUrl: 'https://payload-website-starter-git-main-billboings-projects.vercel.app',
  localPayloadUrl: 'http://localhost:3003',
  
  // Worker 配置  
  workerUrl: 'https://siji-worker-v2.chengqiangshang.workers.dev',
  workerApiKey: 'sijigpt-worker-api-key-2026-secure-notifications',
  
  // 测试配置
  useLocal: true // 设为 false 使用生产环境
};

// 生成测试文章数据
function generateTestArticle() {
  const timestamp = Date.now();
  return {
    title: `完整流程测试 ${timestamp}`,
    title_en: `Full Pipeline Test ${timestamp}`,
    slug: `pipeline-test-${timestamp}`,
    summary_zh: {
      content: "这是一个测试完整 RSS → AI → Payload → Webhook → Telegram 流程的文章。测试包括文章创建、Hook 触发、Worker 响应和通知发送。",
      keywords: ["测试", "自动化", "SijiGPT"]
    },
    summary_en: {
      content: "This is a test article for the complete RSS → AI → Payload → Webhook → Telegram pipeline. Testing includes article creation, hook triggering, worker response and notification sending.",
      keywords: ["test", "automation", "pipeline", "sijigpt", "webhook"]
    },
    source: "Pipeline Test",
    original_language: "zh",
    publishedAt: new Date().toISOString(),
    _status: "published",
    // 测试标记
    tags: ["test", "automation"],
    author: "SijiGPT Test System"
  };
}

// 测试 Worker 端点
async function testWorkerEndpoints() {
  console.log('\\n🔍 === Worker 端点测试 ===');
  
  const endpoints = [
    { path: '/', name: '根路径' },
    { path: '/health', name: '健康检查' },
    { path: '/test', name: '测试端点' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\\n📡 测试 ${endpoint.name}: ${CONFIG.workerUrl}${endpoint.path}`);
      
      const response = await fetch(`${CONFIG.workerUrl}${endpoint.path}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'SijiGPT-Test/1.0'
        }
      });
      
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const content = isJson ? await response.json() : await response.text();
      
      if (response.ok) {
        console.log(`✅ ${endpoint.name}: HTTP ${response.status}`);
        if (isJson) {
          console.log('📄 响应:', JSON.stringify(content, null, 2));
        } else {
          console.log('📄 响应:', content);
        }
      } else {
        console.log(`❌ ${endpoint.name}: HTTP ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name} 请求失败:`, error.message);
    }
  }
}

// 测试 Webhook 端点
async function testWebhookEndpoint() {
  console.log('\\n🔗 === Webhook 端点测试 ===');
  
  const testPayload = {
    id: 9999,
    title: "Webhook 直接测试",
    title_zh: "Webhook 直接测试", 
    source: "Direct Test",
    publishedAt: new Date().toISOString()
  };
  
  try {
    console.log(`📡 测试 Webhook: ${CONFIG.workerUrl}/webhook/article`);
    
    const response = await fetch(`${CONFIG.workerUrl}/webhook/article`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.workerApiKey}`,
        'X-Payload-Source': 'direct-test'
      },
      body: JSON.stringify(testPayload)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Webhook 测试成功:', result);
    } else {
      console.log('❌ Webhook 测试失败:', {
        status: response.status,
        result
      });
    }
  } catch (error) {
    console.log('❌ Webhook 测试请求失败:', error.message);
  }
}

// 测试 Payload 文章创建（触发完整流程）
async function testFullPipeline() {
  console.log('\\n🚀 === 完整流程测试 ===');
  
  const payloadUrl = CONFIG.useLocal ? CONFIG.localPayloadUrl : CONFIG.payloadUrl;
  const testArticle = generateTestArticle();
  
  try {
    console.log(`📡 创建测试文章: ${payloadUrl}/api/posts`);
    console.log('📝 文章数据:', {
      title: testArticle.title,
      slug: testArticle.slug,
      source: testArticle.source
    });
    
    const response = await fetch(`${payloadUrl}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testArticle)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ 文章创建成功:', {
        id: result.id,
        title: result.title,
        createdAt: result.createdAt
      });
      
      console.log('\\n⏳ 等待 Hook 触发和 Webhook 处理...');
      console.log('🔍 请检查:');
      console.log('   1. 服务器日志中的 Hook 触发信息');
      console.log('   2. Worker 日志中的 Webhook 处理信息'); 
      console.log('   3. Telegram 频道中的通知消息');
      console.log('   4. 网站前端是否显示新文章');
      
      return result;
    } else {
      const errorText = await response.text();
      console.log('❌ 文章创建失败:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return null;
    }
  } catch (error) {
    console.log('❌ 文章创建请求失败:', error.message);
    return null;
  }
}

// 验证文章是否在前端显示
async function verifyFrontendDisplay(articleId) {
  if (!articleId) return;
  
  console.log('\\n🌐 === 前端显示验证 ===');
  
  try {
    const frontendUrl = CONFIG.useLocal ? CONFIG.localPayloadUrl : CONFIG.payloadUrl;
    
    // 检查前端 API
    console.log(`📡 检查前端 API: ${frontendUrl}/api/frontend-posts?limit=5`);
    
    const response = await fetch(`${frontendUrl}/api/frontend-posts?limit=5`);
    if (response.ok) {
      const data = await response.json();
      const foundArticle = data.docs?.find(doc => doc.id === articleId);
      
      if (foundArticle) {
        console.log('✅ 文章已在前端 API 中显示:', foundArticle.title);
      } else {
        console.log('⚠️ 文章未在前端 API 中找到，可能需要等待缓存更新');
      }
      
      console.log('📊 前端最新文章:', data.docs?.slice(0, 3).map(doc => ({
        id: doc.id,
        title: doc.title,
        createdAt: doc.createdAt
      })));
    } else {
      console.log('❌ 前端 API 检查失败:', response.status);
    }
  } catch (error) {
    console.log('❌ 前端验证失败:', error.message);
  }
}

// 主测试流程
async function main() {
  console.log('🚀 SijiGPT 完整流程测试开始');
  console.log('⚙️  配置:', {
    environment: CONFIG.useLocal ? 'Local' : 'Production',
    payloadUrl: CONFIG.useLocal ? CONFIG.localPayloadUrl : CONFIG.payloadUrl,
    workerUrl: CONFIG.workerUrl
  });
  
  // 1. 测试 Worker 端点
  await testWorkerEndpoints();
  
  // 2. 测试 Webhook 端点
  await testWebhookEndpoint();
  
  // 3. 测试完整流程
  const article = await testFullPipeline();
  
  // 4. 等待处理完成并验证
  if (article) {
    console.log('\\n⏳ 等待 3 秒后验证前端显示...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await verifyFrontendDisplay(article.id);
  }
  
  console.log('\\n🎯 === 测试完成 ===');
  console.log('📋 检查清单:');
  console.log('   ✓ Worker 端点响应');
  console.log('   ✓ Webhook 端点功能'); 
  console.log('   ✓ Payload 文章创建');
  console.log('   ✓ 前端 API 显示');
  console.log('\\n🔍 手动检查项目:');
  console.log('   □ 服务器控制台中的 Hook 日志');
  console.log('   □ Worker 控制台中的 Webhook 日志');
  console.log('   □ Telegram 通知消息');
  console.log('   □ 网站前端文章显示');
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { testWorkerEndpoints, testWebhookEndpoint, testFullPipeline };