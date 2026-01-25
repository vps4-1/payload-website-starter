import { getPayload } from 'payload'

async function createAdminUser() {
  console.log('🔧 创建管理员用户...')
  
  try {
    // 动态导入配置
    const configModule = await import('../payload.config.ts')
    const config = configModule.default
    
    const payload = await getPayload({ config })
    console.log('✅ Payload 实例已连接')

    // 检查是否已有管理员用户
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1
    })

    if (existingUsers.docs.length > 0) {
      console.log('⚠️  已存在用户，尝试更新第一个用户...')
      const user = existingUsers.docs[0]
      console.log(`📋 现有用户: ID=${user.id}, Email=${user.email}`)
      
      // 更新用户启用 API Key
      const updatedUser = await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          enableAPIKey: true
        }
      })
      
      console.log('✅ 用户已更新，API Key 功能已启用')
      if (updatedUser.apiKey) {
        console.log(`🔑 API Key: ${updatedUser.apiKey}`)
        return updatedUser.apiKey
      }
      
      return null
    }

    // 创建新的管理员用户
    console.log('👤 创建新管理员用户...')
    const newUser = await payload.create({
      collection: 'users',
      data: {
        name: 'Admin',
        email: 'admin@sijigpt.com',
        password: 'SijiGPT-Admin-2026-Secure!',
        enableAPIKey: true
      }
    })

    console.log('✅ 管理员用户创建成功')
    console.log(`📋 用户ID: ${newUser.id}`)
    console.log(`📧 邮箱: ${newUser.email}`)
    console.log(`🔑 API Key: ${newUser.apiKey || 'Not generated'}`)
    
    return newUser.apiKey

  } catch (error) {
    console.error('❌ 创建管理员失败:', error.message)
    return null
  }
}

createAdminUser().then((apiKey) => {
  if (apiKey) {
    console.log('\n🎉 管理员用户设置完成!')
    console.log('📝 API Key:', apiKey)
    console.log('\n🔧 登录信息:')
    console.log('邮箱: admin@sijigpt.com')
    console.log('密码: SijiGPT-Admin-2026-Secure!')
  } else {
    console.log('\n❌ 管理员设置失败')
  }
  process.exit(0)
}).catch(console.error)