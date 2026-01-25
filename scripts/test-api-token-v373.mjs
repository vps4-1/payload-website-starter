/**
 * 测试 Payload v3.73.0 API Token 创建功能
 * 通过程序化方式检查 API Token 字段是否正常工作
 */

import fetch from 'node-fetch';

const CONFIG = {
  adminUrl: 'http://localhost:3005/admin',
  apiUrl: 'http://localhost:3005/api',
  testEmail: 'dev@payloadcms.com',
  testPassword: 'test'
};

// 测试用户登录
async function testUserLogin() {
  console.log('🔑 测试用户登录...');
  
  try {
    const response = await fetch(`${CONFIG.apiUrl}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: CONFIG.testEmail,
        password: CONFIG.testPassword
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ 登录成功');
      console.log('👤 用户信息:', {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name
      });
      
      // 检查用户对象是否包含 API Key 相关字段
      const hasApiKeyField = 'apiKey' in data.user;
      const hasEnableApiKeyField = 'enableAPIKey' in data.user;
      
      console.log('🔍 API Key 字段检查:');
      console.log('  - apiKey 字段:', hasApiKeyField ? '✅ 存在' : '❌ 不存在');
      console.log('  - enableAPIKey 字段:', hasEnableApiKeyField ? '✅ 存在' : '❌ 不存在');
      
      if (hasApiKeyField) {
        console.log('  - apiKey 值:', data.user.apiKey ? '✅ 已设置' : '⚠️ 未设置');
      }
      
      return data;
    } else {
      const errorText = await response.text();
      console.log('❌ 登录失败:', {
        status: response.status,
        error: errorText
      });
      return null;
    }
  } catch (error) {
    console.log('❌ 登录请求失败:', error.message);
    return null;
  }
}

// 测试 API Token 生成（通过更新用户）
async function testApiTokenGeneration(authToken) {
  console.log('\\n🔧 测试 API Token 生成...');
  
  try {
    // 获取当前用户信息
    const meResponse = await fetch(`${CONFIG.apiUrl}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!meResponse.ok) {
      console.log('❌ 获取用户信息失败:', meResponse.status);
      return false;
    }
    
    const userData = await meResponse.json();
    console.log('👤 当前用户ID:', userData.user.id);
    
    // 尝试更新用户以生成 API Key（如果字段存在）
    const updatePayload = {
      enableAPIKey: true
    };
    
    const updateResponse = await fetch(`${CONFIG.apiUrl}/users/${userData.user.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `JWT ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatePayload)
    });
    
    if (updateResponse.ok) {
      const updatedData = await updateResponse.json();
      console.log('✅ 用户更新成功');
      
      if (updatedData.doc.apiKey) {
        console.log('🎉 API Key 生成成功!');
        console.log('🔑 API Key:', updatedData.doc.apiKey.substring(0, 20) + '...');
        console.log('📏 API Key 长度:', updatedData.doc.apiKey.length, '字符');
        return updatedData.doc.apiKey;
      } else {
        console.log('⚠️ API Key 未生成，可能需要额外配置');
        return false;
      }
    } else {
      const errorText = await updateResponse.text();
      console.log('❌ 用户更新失败:', {
        status: updateResponse.status,
        error: errorText
      });
      return false;
    }
  } catch (error) {
    console.log('❌ API Token 生成测试失败:', error.message);
    return false;
  }
}

// 测试生成的 API Key
async function testGeneratedApiKey(apiKey) {
  console.log('\\n🧪 测试生成的 API Key...');
  
  try {
    const response = await fetch(`${CONFIG.apiUrl}/posts?limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': `users API-Key ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Key 认证成功!');
      console.log('📊 获取到文章数量:', data.totalDocs);
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ API Key 认证失败:', {
        status: response.status,
        error: errorText
      });
      return false;
    }
  } catch (error) {
    console.log('❌ API Key 测试失败:', error.message);
    return false;
  }
}

// 主测试函数
async function main() {
  console.log('🚀 Payload v3.73.0 API Token 功能测试');
  console.log('⚙️  配置:', CONFIG);
  
  // 1. 测试登录
  const loginData = await testUserLogin();
  if (!loginData) {
    console.log('\\n❌ 测试终止：登录失败');
    return;
  }
  
  // 2. 测试 API Token 生成
  const apiKey = await testApiTokenGeneration(loginData.token);
  if (!apiKey) {
    console.log('\\n⚠️ API Token 生成失败，但这可能是正常的');
    console.log('💡 建议：');
    console.log('   1. 在 Admin Panel 中手动尝试创建 API Token');
    console.log('   2. 检查 Users 集合配置中的 useAPIKey 设置');
    console.log('   3. 确保数据库 schema 已正确更新');
    return;
  }
  
  // 3. 测试生成的 API Key
  const apiKeyWorks = await testGeneratedApiKey(apiKey);
  
  // 4. 总结
  console.log('\\n🎯 === 测试结果总结 ===');
  console.log('Payload 版本: v3.73.0');
  console.log('用户登录: ✅ 成功');
  console.log('API Token 生成:', apiKey ? '✅ 成功' : '❌ 失败');
  console.log('API Key 认证:', apiKeyWorks ? '✅ 成功' : '❌ 失败');
  
  if (apiKey && apiKeyWorks) {
    console.log('\\n🎉 恭喜！Payload v3.73.0 的 API Token 功能完全正常！');
    console.log('🔑 你可以在 Worker 中使用这个 API Key 进行认证');
    console.log('💾 建议将 API Key 保存到 Cloudflare Worker 的 secrets 中');
  } else {
    console.log('\\n⚠️ API Token 功能仍有问题，建议：');
    console.log('1. 继续使用无认证方案 (access: { create: "anyone" })');
    console.log('2. 等待 Payload 后续版本修复');
    console.log('3. 或者考虑降级到更早的稳定版本');
  }
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}