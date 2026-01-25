import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3005'
const TEST_EMAIL = 'apitest@example.com'
const TEST_PASSWORD = 'testpassword123'

console.log('🧪 测试 Payload v3.73.0 API Token 创建功能...')

async function testApiTokenCreation() {
  try {
    console.log('\n1️⃣ 尝试创建测试用户...')
    
    // 创建测试用户
    const createUserResponse = await fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        name: 'API Test User'
      }),
    })
    
    if (createUserResponse.status === 201) {
      const userData = await createUserResponse.json()
      console.log(`✅ 用户创建成功，ID: ${userData.doc.id}`)
    } else if (createUserResponse.status === 400) {
      console.log('ℹ️  用户可能已存在，继续测试...')
    } else {
      const error = await createUserResponse.text()
      console.log(`⚠️  用户创建状态: ${createUserResponse.status}, 响应: ${error}`)
    }
    
    console.log('\n2️⃣ 尝试用户登录...')
    
    // 用户登录
    const loginResponse = await fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      }),
    })
    
    if (loginResponse.status !== 200) {
      const error = await loginResponse.text()
      console.log(`❌ 登录失败: ${loginResponse.status}, ${error}`)
      return
    }
    
    const loginData = await loginResponse.json()
    const token = loginData.token
    console.log(`✅ 登录成功，获得 Token: ${token.substring(0, 20)}...`)
    
    console.log('\n3️⃣ 尝试启用 API Key 功能...')
    
    // 更新用户启用 API Key
    const enableApiKeyResponse = await fetch(`${BASE_URL}/api/users/${loginData.user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`,
      },
      body: JSON.stringify({
        enableAPIKey: true,
      }),
    })
    
    if (enableApiKeyResponse.status !== 200) {
      const error = await enableApiKeyResponse.text()
      console.log(`⚠️  启用 API Key 状态: ${enableApiKeyResponse.status}, 响应: ${error}`)
    } else {
      console.log('✅ API Key 功能已启用')
    }
    
    console.log('\n4️⃣ 检查当前用户 API Key 状态...')
    
    // 获取当前用户信息
    const meResponse = await fetch(`${BASE_URL}/api/users/me`, {
      headers: {
        'Authorization': `JWT ${token}`,
      },
    })
    
    if (meResponse.status === 200) {
      const meData = await meResponse.json()
      console.log('✅ 用户信息获取成功：')
      console.log(`   - ID: ${meData.user.id}`)
      console.log(`   - Email: ${meData.user.email}`)
      console.log(`   - API Key 启用: ${meData.user.enableAPIKey || 'false'}`)
      console.log(`   - API Key 存在: ${meData.user.apiKey ? '是' : '否'}`)
      
      if (meData.user.apiKey) {
        console.log(`   - API Key (前20字符): ${meData.user.apiKey.substring(0, 20)}...`)
        
        console.log('\n5️⃣ 测试 API Key 认证...')
        
        // 使用 API Key 测试访问
        const apiTestResponse = await fetch(`${BASE_URL}/api/users/me`, {
          headers: {
            'Authorization': `users API-Key ${meData.user.apiKey}`,
          },
        })
        
        if (apiTestResponse.status === 200) {
          console.log('✅ API Key 认证成功！')
          console.log('🎉 Payload v3.73.0 API Token 功能完全正常！')
        } else {
          console.log(`❌ API Key 认证失败: ${apiTestResponse.status}`)
        }
      }
    }
    
  } catch (error) {
    console.error('❌ 测试过程出错:', error.message)
  }
}

// 检查服务器是否运行
console.log('🔍 检查本地服务器状态...')
fetch(`${BASE_URL}/api/access`)
  .then(response => {
    if (response.ok) {
      console.log('✅ 本地服务器运行正常')
      return testApiTokenCreation()
    } else {
      console.log('❌ 本地服务器未运行，请先启动: npm run dev')
    }
  })
  .catch(error => {
    console.log('❌ 无法连接到本地服务器，请先启动: npm run dev')
    console.log('错误:', error.message)
  })