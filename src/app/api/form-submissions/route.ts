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

export async function POST(request: NextRequest) {
  try {
    console.log('[API /form-submissions] 处理表单提交')
    
    const body = await request.json()
    console.log('[API /form-submissions] 表单数据:', body)
    
    const payloadInstance = await getPayloadInstance()
    
    // 这里需要根据实际的 Payload 集合结构来处理
    // 假设有一个 'form-submissions' 集合
    const result = await payloadInstance.create({
      collection: 'form-submissions',
      data: body,
    })
    
    console.log('[API /form-submissions] 表单提交成功:', result.id)
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Form submitted successfully',
        id: result.id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[API /form-submissions] 错误:', error)
    
    // 返回错误响应
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to submit form',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    
    console.log('[API /form-submissions] 获取表单提交记录')
    
    const payloadInstance = await getPayloadInstance()
    
    const result = await payloadInstance.find({
      collection: 'form-submissions',
      limit,
      page,
      sort: ['-createdAt'],
    })
    
    console.log(`[API /form-submissions] 获取 ${result.docs?.length || 0} 条记录`)
    
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('[API /form-submissions GET] 错误:', error)
    
    return NextResponse.json(
      {
        docs: [],
        totalDocs: 0,
        limit: 20,
        page: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null,
        pagingCounter: 0,
      },
      { status: 200 }
    )
  }
}