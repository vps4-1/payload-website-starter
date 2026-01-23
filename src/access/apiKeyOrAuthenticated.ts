import type { AccessArgs } from 'payload'
import type { User } from '@/payload-types'

type ApiKeyOrAuthenticated = (args: AccessArgs<User>) => boolean

export const apiKeyOrAuthenticated: ApiKeyOrAuthenticated = ({ req }) => {
  console.log('[apiKeyOrAuthenticated] 权限检查开始')
  
  // 检查用户是否已登录
  if (req.user) {
    console.log('[apiKeyOrAuthenticated] 用户已登录，允许访问')
    return true
  }
  
  // 尝试多种方式获取 API 密钥
  let apiKey: string | undefined
  
  // 方式1: Authorization header
  if (req.headers?.authorization) {
    apiKey = req.headers.authorization.replace('Bearer ', '')
  }
  
  // 方式2: 小写的authorization
  if (!apiKey && req.headers?.Authorization) {
    apiKey = req.headers.Authorization.replace('Bearer ', '')
  }
  
  // 方式3: 检查原始的headers对象
  if (!apiKey && req.headers) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization']
    if (authHeader) {
      apiKey = authHeader.replace('Bearer ', '')
    }
  }
  
  // 方式4: 直接从环境变量中的测试密钥
  const validApiKey = process.env.PAYLOAD_API_KEY
  
  console.log('[apiKeyOrAuthenticated] API密钥检查:')
  console.log('  - 请求头:', JSON.stringify(Object.keys(req.headers || {})))
  console.log('  - 接收到的密钥:', apiKey ? `${apiKey.substring(0, 10)}...` : '无')
  console.log('  - 有效密钥:', validApiKey ? `${validApiKey.substring(0, 10)}...` : '无')
  console.log('  - 密钥匹配:', apiKey === validApiKey)
  
  if (apiKey && validApiKey && apiKey === validApiKey) {
    console.log('[apiKeyOrAuthenticated] API密钥验证成功，允许访问')
    return true
  }
  
  console.log('[apiKeyOrAuthenticated] 权限验证失败，拒绝访问')
  return false
}