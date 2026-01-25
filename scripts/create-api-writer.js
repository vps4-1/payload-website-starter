import { getPayload } from 'payload'
import config from '../payload.config.ts'

async function createAPIWriter() {
  console.log('🔧 创建专用 API Writer 用户...')
  
  try {
    const payload = await getPayload({ config })
    console.log('✅ Payload 实例已连接')

    // 检查用户是否已存在
    const existingUser = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'api-writer@sijigpt.com'
        }
      }
    })

    if (existingUser.docs.length > 0) {
      console.log('⚠️  API Writer 用户已存在')
      const user = existingUser.docs[0]
      console.log(`📋 用户信息: ID=${user.id}, Email=${user.email}`)
      
      // 检查是否有 API Key
      if (user.apiKey) {
        console.log(`🔑 现有 API Key: ${user.apiKey.substring(0, 20)}...`)
        return user.apiKey
      } else {
        console.log('🔄 为现有用户生成 API Key...')
        // 更新用户，添加 API Key
        const updatedUser = await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            enableAPIKey: true
          }
        })
        
        console.log('✅ API Key 已为现有用户生成')
        return updatedUser.apiKey
      }
    }

    // 创建新用户
    console.log('👤 创建新的 API Writer 用户...')
    const newUser = await payload.create({
      collection: 'users',
      data: {
        name: 'API Writer',
        email: 'api-writer@sijigpt.com',
        password: 'SijiGPT-API-Writer-2026-Secure!',
        enableAPIKey: true
      }
    })

    console.log('✅ API Writer 用户创建成功')
    console.log(`📋 用户ID: ${newUser.id}`)
    console.log(`📧 邮箱: ${newUser.email}`)
    console.log(`🔑 API Key: ${newUser.apiKey?.substring(0, 20)}...`)
    
    return newUser.apiKey

  } catch (error) {
    console.error('❌ 创建 API Writer 失败:', error.message)
    console.error('🔍 错误详情:', error)
    return null
  }
}

// 执行创建
createAPIWriter().then((apiKey) => {
  if (apiKey) {
    console.log('\n🎉 API Writer 设置完成!')
    console.log('📝 请将以下 API Key 配置到 Worker 中:')
    console.log(`PAYLOAD_API_KEY=${apiKey}`)
  } else {
    console.log('\n❌ API Writer 设置失败，请检查错误信息')
  }
  process.exit(0)
}).catch((error) => {
  console.error('💥 脚本执行失败:', error)
  process.exit(1)
})