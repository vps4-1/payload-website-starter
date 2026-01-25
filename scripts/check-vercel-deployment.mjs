#!/usr/bin/env node

/**
 * 🚀 Vercel 部署状态监控脚本
 * 监控 Payload v3.73.0 升级的部署状态
 */

import https from 'https';

const CONFIG = {
  // 生产环境 URL
  productionUrl: 'https://payload-website-starter-git-main-billboings-projects.vercel.app',
  
  // 检查间隔（秒）
  checkInterval: 10,
  
  // 最大检查次数
  maxChecks: 30
};

// 检查 URL 状态
function checkUrl(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    https.get(url, (res) => {
      const duration = Date.now() - startTime;
      resolve({
        success: true,
        status: res.statusCode,
        duration: duration,
        headers: {
          server: res.headers.server,
          xPoweredBy: res.headers['x-powered-by'],
          xVercelId: res.headers['x-vercel-id']
        }
      });
    }).on('error', (error) => {
      const duration = Date.now() - startTime;
      resolve({
        success: false,
        error: error.message,
        duration: duration
      });
    });
  });
}

// 检查 API 端点
async function checkApiEndpoint(baseUrl, endpoint) {
  const url = `${baseUrl}${endpoint}`;
  return await checkUrl(url);
}

// 检查部署状态
async function checkDeployment() {
  console.log(`🔍 检查部署状态: ${CONFIG.productionUrl}`);
  console.log(`⏰ ${new Date().toLocaleString('zh-CN')}`);
  
  // 1. 检查主页
  console.log('\n📍 检查主页...');
  const homeResult = await checkUrl(CONFIG.productionUrl);
  if (homeResult.success) {
    console.log(`✅ 主页: HTTP ${homeResult.status} (${homeResult.duration}ms)`);
    console.log(`🏷️  服务器: ${homeResult.headers.server || 'Unknown'}`);
    console.log(`⚡ 驱动: ${homeResult.headers.xPoweredBy || 'Unknown'}`);
  } else {
    console.log(`❌ 主页: ${homeResult.error} (${homeResult.duration}ms)`);
    return false;
  }
  
  // 2. 检查 Admin Panel
  console.log('\n🔐 检查 Admin Panel...');
  const adminResult = await checkApiEndpoint(CONFIG.productionUrl, '/admin');
  if (adminResult.success) {
    console.log(`✅ Admin Panel: HTTP ${adminResult.status} (${adminResult.duration}ms)`);
  } else {
    console.log(`❌ Admin Panel: ${adminResult.error} (${adminResult.duration}ms)`);
  }
  
  // 3. 检查前端 API
  console.log('\n🌐 检查前端 API...');
  const apiResult = await checkApiEndpoint(CONFIG.productionUrl, '/api/frontend-posts?limit=1');
  if (apiResult.success) {
    console.log(`✅ 前端 API: HTTP ${apiResult.status} (${apiResult.duration}ms)`);
  } else {
    console.log(`❌ 前端 API: ${apiResult.error} (${apiResult.duration}ms)`);
  }
  
  // 4. 检查文章创建 API（测试）
  console.log('\n📝 检查文章 API...');
  const postsResult = await checkApiEndpoint(CONFIG.productionUrl, '/api/posts?limit=1');
  if (postsResult.success) {
    if (postsResult.status === 200) {
      console.log(`✅ 文章 API: HTTP ${postsResult.status} (${postsResult.duration}ms)`);
    } else if (postsResult.status === 401 || postsResult.status === 403) {
      console.log(`⚠️  文章 API: HTTP ${postsResult.status} - 需要认证 (${postsResult.duration}ms)`);
    } else {
      console.log(`⚠️  文章 API: HTTP ${postsResult.status} (${postsResult.duration}ms)`);
    }
  } else {
    console.log(`❌ 文章 API: ${postsResult.error} (${postsResult.duration}ms)`);
  }
  
  // 5. 总体评估
  const allSuccessful = homeResult.success && adminResult.success && apiResult.success;
  
  console.log('\n📊 === 部署状态总结 ===');
  console.log(`🏠 主页: ${homeResult.success ? '✅' : '❌'}`);
  console.log(`🔐 Admin: ${adminResult.success ? '✅' : '❌'}`);
  console.log(`🌐 前端API: ${apiResult.success ? '✅' : '❌'}`);
  console.log(`📝 文章API: ${postsResult.success ? '✅' : '❌'}`);
  console.log(`🎯 总体状态: ${allSuccessful ? '✅ 健康' : '⚠️  部分问题'}`);
  
  if (allSuccessful) {
    console.log('\n🎉 Payload v3.73.0 升级部署成功！');
    console.log('🔗 访问链接:');
    console.log(`   主站: ${CONFIG.productionUrl}`);
    console.log(`   后台: ${CONFIG.productionUrl}/admin`);
    console.log(`   API: ${CONFIG.productionUrl}/api/frontend-posts`);
  }
  
  return allSuccessful;
}

// 监控部署完成
async function monitorDeployment() {
  console.log('🚀 开始监控 Vercel 部署状态...');
  console.log(`📍 目标: ${CONFIG.productionUrl}`);
  console.log(`⏱️  检查间隔: ${CONFIG.checkInterval} 秒`);
  console.log(`🔄 最大检查: ${CONFIG.maxChecks} 次`);
  
  for (let i = 0; i < CONFIG.maxChecks; i++) {
    console.log(`\n🔄 检查 ${i + 1}/${CONFIG.maxChecks}:`);
    console.log('─'.repeat(50));
    
    const isHealthy = await checkDeployment();
    
    if (isHealthy) {
      console.log('\n🎯 部署监控完成，系统正常运行！');
      break;
    }
    
    if (i < CONFIG.maxChecks - 1) {
      console.log(`\n⏳ 等待 ${CONFIG.checkInterval} 秒后重试...`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.checkInterval * 1000));
    } else {
      console.log('\n⚠️  达到最大检查次数，请手动检查部署状态');
    }
  }
}

// 单次检查模式
async function singleCheck() {
  await checkDeployment();
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const isMonitorMode = args.includes('--monitor') || args.includes('-m');
  
  if (isMonitorMode) {
    await monitorDeployment();
  } else {
    await singleCheck();
  }
}

// 运行
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { checkDeployment, monitorDeployment };