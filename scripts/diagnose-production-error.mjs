#!/usr/bin/env node

/**
 * 🔍 SijiGPT 生产环境诊断工具
 * 诊断 Digest: 2157796927 错误和 Admin Panel 问题
 */

const ENDPOINTS = {
  production: 'https://payload-website-starter-git-main-billboings-projects.vercel.app',
  sijigpt: 'https://sijigpt.com',
  local: 'http://localhost:3006'
};

// 测试各个端点
async function testEndpoint(url, description) {
  try {
    console.log(`\\n🔍 测试: ${description}`);
    console.log(`📍 URL: ${url}`);
    
    const response = await fetch(url, { 
      method: 'HEAD',
      headers: {
        'User-Agent': 'SijiGPT-Diagnostic/1.0'
      }
    });
    
    const status = response.status;
    const headers = {
      server: response.headers.get('server'),
      xPoweredBy: response.headers.get('x-powered-by'),
      xVercelId: response.headers.get('x-vercel-id'),
      contentType: response.headers.get('content-type')
    };
    
    if (status === 200) {
      console.log(`✅ HTTP ${status} - 正常`);
      console.log(`🏷️  服务器: ${headers.server || 'Unknown'}`);
      console.log(`⚡ 驱动: ${headers.xPoweredBy || 'Unknown'}`);
      if (headers.xVercelId) {
        console.log(`🆔 Vercel ID: ${headers.xVercelId}`);
      }
    } else {
      console.log(`❌ HTTP ${status} - 异常`);
    }
    
    return { url, status, headers, success: status === 200 };
  } catch (error) {
    console.log(`💥 请求失败: ${error.message}`);
    return { url, error: error.message, success: false };
  }
}

// 测试具体的 API 端点
async function testAPIEndpoints(baseUrl) {
  console.log(`\\n🌐 测试 API 端点: ${baseUrl}`);
  
  const apiTests = [
    { path: '/api/posts?limit=1', name: 'Posts API' },
    { path: '/api/users/me', name: 'Users API' },
    { path: '/admin/api/access', name: 'Access API' },
  ];
  
  const results = [];
  for (const test of apiTests) {
    const url = baseUrl + test.path;
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const status = response.status;
      const success = status === 200 || status === 401 || status === 403; // 401/403 也算正常，说明端点存在
      
      console.log(`  ${success ? '✅' : '❌'} ${test.name}: HTTP ${status}`);
      results.push({ ...test, url, status, success });
    } catch (error) {
      console.log(`  💥 ${test.name}: ${error.message}`);
      results.push({ ...test, url, error: error.message, success: false });
    }
  }
  
  return results;
}

// 尝试重现 Digest 错误
async function reproduceDigestError(baseUrl) {
  console.log(`\\n🕵️ 尝试重现 Digest 错误: ${baseUrl}`);
  
  // 尝试多种可能触发错误的请求
  const errorProneRequests = [
    { path: '/admin', method: 'GET', name: 'Admin Panel GET' },
    { path: '/admin/collections/users', method: 'GET', name: 'Users Collection' },
    { path: '/admin/account', method: 'GET', name: 'Account Page' },
    { path: '/api/users/login', method: 'POST', name: 'Login API', body: '{"email":"test@test.com","password":"test"}' },
    { path: '/api/users', method: 'GET', name: 'Users List API' }
  ];
  
  console.log('🎯 执行可能触发错误的请求...');
  
  for (const req of errorProneRequests) {
    try {
      const options = {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SijiGPT-Error-Reproduction/1.0'
        }
      };
      
      if (req.body) {
        options.body = req.body;
      }
      
      const response = await fetch(baseUrl + req.path, options);
      const contentLength = response.headers.get('content-length');
      const responseText = await response.text();
      
      console.log(`  📡 ${req.name}: HTTP ${response.status}`);
      
      // 检查响应中是否包含错误信息
      if (responseText.includes('2157796927') || 
          responseText.includes('server-side exception') ||
          responseText.includes('Application error')) {
        console.log(`  🎯 发现 Digest 错误!`);
        console.log(`  📄 响应内容:`, responseText.substring(0, 200) + '...');
        return { found: true, request: req, response: responseText };
      }
      
      if (response.status >= 500) {
        console.log(`  ⚠️  服务器错误 (${response.status})，可能相关`);
        if (responseText && responseText.length < 500) {
          console.log(`  📄 错误内容:`, responseText);
        }
      }
    } catch (error) {
      console.log(`  💥 ${req.name}: ${error.message}`);
    }
  }
  
  return { found: false };
}

// 主诊断函数
async function runDiagnostics() {
  console.log('🚀 SijiGPT 生产环境诊断开始');
  console.log('🎯 目标: 诊断 Digest: 2157796927 错误');
  console.log('📅 时间:', new Date().toLocaleString('zh-CN'));
  
  // 1. 测试基本连通性
  console.log('\\n' + '='.repeat(50));
  console.log('📋 第一阶段: 基本连通性测试');
  console.log('='.repeat(50));
  
  const basicTests = [
    { url: ENDPOINTS.production, desc: 'Vercel 生产环境' },
    { url: ENDPOINTS.sijigpt, desc: 'SijiGPT 主域名' },
    { url: ENDPOINTS.production + '/admin', desc: 'Vercel Admin Panel' },
    { url: ENDPOINTS.sijigpt + '/admin', desc: 'SijiGPT Admin Panel' }
  ];
  
  const basicResults = [];
  for (const test of basicTests) {
    const result = await testEndpoint(test.url, test.desc);
    basicResults.push(result);
  }
  
  // 2. API 端点测试
  console.log('\\n' + '='.repeat(50));
  console.log('📋 第二阶段: API 端点测试');
  console.log('='.repeat(50));
  
  const vercelApiResults = await testAPIEndpoints(ENDPOINTS.production);
  const sijigptApiResults = await testAPIEndpoints(ENDPOINTS.sijigpt);
  
  // 3. 错误重现尝试
  console.log('\\n' + '='.repeat(50));
  console.log('📋 第三阶段: Digest 错误重现');
  console.log('='.repeat(50));
  
  const vercelErrorTest = await reproduceDigestError(ENDPOINTS.production);
  const sijigptErrorTest = await reproduceDigestError(ENDPOINTS.sijigpt);
  
  // 4. 生成诊断报告
  console.log('\\n' + '='.repeat(50));
  console.log('📊 诊断结果总结');
  console.log('='.repeat(50));
  
  console.log('\\n🔍 基本连通性:');
  basicResults.forEach(result => {
    console.log(`  ${result.success ? '✅' : '❌'} ${result.url}: ${result.success ? 'OK' : (result.error || 'FAILED')}`);
  });
  
  console.log('\\n🌐 API 端点状态:');
  console.log('  Vercel 生产环境:');
  vercelApiResults.forEach(result => {
    console.log(`    ${result.success ? '✅' : '❌'} ${result.name}: ${result.status || result.error}`);
  });
  console.log('  SijiGPT 域名:');
  sijigptApiResults.forEach(result => {
    console.log(`    ${result.success ? '✅' : '❌'} ${result.name}: ${result.status || result.error}`);
  });
  
  console.log('\\n🕵️ Digest 错误检测:');
  console.log(`  Vercel: ${vercelErrorTest.found ? '🎯 发现错误' : '✅ 未发现'}`);
  console.log(`  SijiGPT: ${sijigptErrorTest.found ? '🎯 发现错误' : '✅ 未发现'}`);
  
  // 5. 建议
  console.log('\\n💡 建议和下一步:');
  
  if (vercelErrorTest.found || sijigptErrorTest.found) {
    console.log('  🚨 检测到 Digest 错误，建议:');
    console.log('    1. 检查 Vercel 部署日志');
    console.log('    2. 重新部署最新代码');
    console.log('    3. 检查数据库连接状态');
  } else {
    console.log('  ✅ 未检测到明显错误，可能的情况:');
    console.log('    1. 错误是间歇性的，在特定条件下才出现');
    console.log('    2. 错误只在浏览器特定交互时出现');
    console.log('    3. 错误已经自动修复');
    console.log('    4. 错误与用户认证状态相关');
  }
  
  console.log('\\n🔄 如果问题持续存在，建议:');
  console.log('  1. 清除浏览器缓存并重新访问');
  console.log('  2. 尝试无痕模式访问');
  console.log('  3. 检查浏览器控制台的 JavaScript 错误');
  console.log('  4. 联系 Vercel 支持查看详细错误日志');
  
  console.log('\\n✅ 诊断完成');
}

// 运行诊断
if (import.meta.url === `file://${process.argv[1]}`) {
  runDiagnostics().catch(console.error);
}