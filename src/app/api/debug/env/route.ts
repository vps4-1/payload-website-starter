import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // 只在开发环境中提供调试信息
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ message: 'Not available in production' }, { status: 404 })
  }

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    hasRevalidateSecret: !!process.env.REVALIDATE_SECRET,
    revalidateSecretLength: process.env.REVALIDATE_SECRET?.length || 0,
    revalidateSecretPrefix: process.env.REVALIDATE_SECRET?.substring(0, 10) + '...' || 'not set',
    timestamp: Date.now()
  })
}