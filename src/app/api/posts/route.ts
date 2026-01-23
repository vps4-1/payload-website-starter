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
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const sort = searchParams.get('sort') || '-createdAt'
    
    console.log(`[API /posts] 参数: limit=${limit}, page=${page}, sort=${sort}`)
    
    const payloadInstance = await getPayloadInstance()
    
    const result = await payloadInstance.find({
      collection: 'posts',
      limit,
      page,
      sort: sort.startsWith('-') ? [sort.substring(1), 'desc'] : [sort, 'asc'],
    })
    
    console.log(`[API /posts] 成功获取 ${result.docs?.length || 0} 篇文章`)
    
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=120',
      },
    })
  } catch (error) {
    console.error('[API /posts] 错误:', error)
    
    // 返回空的有效响应而不是错误
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
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    )
  }
}