// 简化的 API Writer 创建脚本
const fetch = require('node-fetch')

async function createAPIWriter() {
  console.log('🔧 通过 Payload API 创建专用用户...')
  
  try {
    // 1. 先尝试登录现有管理员账户
    console.log('🔑 尝试管理员登录...')
    
    // 这里需要你提供管理员登录信息
    const adminEmail = 'admin@sijigpt.com' // 替换为你的管理员邮箱
    const adminPassword = 'your-admin-password' // 替换为你的管理员密码
    
    const loginResponse = await fetch('http://localhost:3003/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword
      })
    })
    
    if (!loginResponse.ok) {
      console.error('❌ 管理员登录失败:', loginResponse.status)
      console.log('💡 请手动在 Payload 后台创建 API Writer 用户')
      return null
    }
    
    const loginData = await loginResponse.json()
    const adminToken = loginData.token
    console.log('✅ 管理员登录成功')
    
    // 2. 创建 API Writer 用户
    console.log('👤 创建 API Writer 用户...')
    
    const createUserResponse = await fetch('http://localhost:3003/api/users', {
      method: 'POST',
      headers: {
        'Authorization': `JWT ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'API Writer',
        email: 'api-writer@sijigpt.com', 
        password: 'SijiGPT-API-Writer-2026-Secure!',
        enableAPIKey: true
      })
    })
    
    if (!createUserResponse.ok) {
      const errorText = await createUserResponse.text()
      console.error('❌ 创建用户失败:', createUserResponse.status)
      console.error('错误详情:', errorText)
      return null
    }
    
    const userData = await createUserResponse.json()
    console.log('✅ API Writer 用户创建成功')
    console.log(`📋 用户ID: ${userData.doc.id}`)
    console.log(`📧 邮箱: ${userData.doc.email}`)
    
    // 3. 检查是否有 API Key
    if (userData.doc.apiKey) {
      console.log(`🔑 API Key: ${userData.doc.apiKey}`)
      return userData.doc.apiKey
    } else {
      console.log('⚠️  API Key 未自动生成，需要手动操作')
      return null
    }
    
  } catch (error) {
    console.error('💥 脚本执行失败:', error.message)
    return null
  }
}

// 手动指导方案
function showManualGuide() {
  console.log('\n📋 手动创建 API Writer 用户指南:')
  console.log('1. 访问: http://localhost:3003/admin')
  console.log('2. 登录管理员账户')
  console.log('3. 进入 Users 页面')
  console.log('4. 点击 "Create New User"')
  console.log('5. 填写用户信息:')
  console.log('   - Name: API Writer')
  console.log('   - Email: api-writer@sijigpt.com')
  console.log('   - Password: SijiGPT-API-Writer-2026-Secure!')
  console.log('6. 启用 "Enable API Key" 选项')
  console.log('7. 保存用户')
  console.log('8. 复制生成的 API Key')
  console.log('9. 在 Cloudflare Worker 中设置:')
  console.log('   wrangler secret put PAYLOAD_API_KEY')
}

// 执行创建
createAPIWriter().then((apiKey) => {
  if (apiKey) {
    console.log('\n🎉 API Writer 设置完成!')
    console.log('📝 请将以下 API Key 配置到 Worker 中:')
    console.log(`PAYLOAD_API_KEY=${apiKey}`)
    console.log('\n🔧 Cloudflare Worker 配置命令:')
    console.log(`wrangler secret put PAYLOAD_API_KEY`)
    console.log('然后输入:', apiKey)
  } else {
    console.log('\n❌ 自动创建失败')
    showManualGuide()
  }
}).catch((error) => {
  console.error('💥 脚本运行失败:', error)
  showManualGuide()
})