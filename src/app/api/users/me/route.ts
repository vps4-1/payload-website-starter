import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// 缓存payload实例
let payload: any = null

async function getPayloadInstance() {
  if (!payload) {
    payload = await getPayload({ config })
  }
  return payload
}

export async function GET(request: NextRequest) {
  try {
    console.log('[API /users/me] 获取当前用户信息')
    
    // 从请求头获取认证信息
    const authorization = request.headers.get('authorization')
    const cookie = request.headers.get('cookie')
    
    if (!authorization && !cookie) {
      return NextResponse.json(
        { user: null, message: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const payloadInstance = await getPayloadInstance()
    
    try {
      // 这里需要根据 Payload 的认证机制来获取当前用户
      // 通常通过 JWT token 或 session
      const req = {
        headers: {
          authorization,
          cookie,
        }
      }
      
      // 使用 Payload 的 auth 方法验证用户
      const { user } = await payloadInstance.auth({ headers: req.headers })
      
      if (!user) {
        return NextResponse.json(
          { user: null, message: 'Not authenticated' },
          { status: 401 }
        )
      }
      
      console.log('[API /users/me] 用户认证成功:', user.id)
      
      // 返回用户信息（排除敏感字段）
      const { password, ...safeUser } = user
      
      return NextResponse.json(
        { 
          user: safeUser,
          success: true 
        },
        {
          headers: {
            'Cache-Control': 'private, no-cache, no-store, must-revalidate',
          },
        }
      )
    } catch (authError) {
      console.log('[API /users/me] 认证失败:', authError.message)
      
      return NextResponse.json(
        { user: null, message: 'Authentication failed' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('[API /users/me] 错误:', error)
    
    return NextResponse.json(
      { 
        user: null, 
        message: 'Internal server error',
        success: false 
      },
      { status: 500 }
    )
  }
}