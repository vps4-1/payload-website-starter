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

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    const tag = decodeURIComponent(slug)
    
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '100')
    const page = parseInt(searchParams.get('page') || '1')
    const sort = searchParams.get('sort') || '-createdAt'
    
    console.log(`[API /tags/${slug}] 获取标签文章: "${tag}", limit=${limit}, page=${page}`)
    
    const payloadInstance = await getPayloadInstance()
    
    // 获取所有文章，然后在应用层过滤
    // 这是因为 Payload 的查询系统对于嵌套数组字段的搜索比较复杂
    const result = await payloadInstance.find({
      collection: 'posts',
      limit: 1000, // 先获取足够的文章进行过滤
      sort: sort.startsWith('-') ? [sort.substring(1), 'desc'] : [sort, 'asc'],
    })
    
    const allPosts = result.docs || []
    
    // 在应用层过滤包含指定标签的文章
    const filteredPosts = allPosts.filter((post: any) => {
      const zhKeywords = post.summary_zh?.keywords?.map((k: any) => 
        typeof k === 'string' ? k : k.keyword
      ) || []
      const enKeywords = post.summary_en?.keywords?.map((k: any) => 
        typeof k === 'string' ? k : k.keyword
      ) || []

      return [...zhKeywords, ...enKeywords].some((keyword: string) => 
        keyword.toLowerCase() === tag.toLowerCase()
      )
    })
    
    // 手动分页
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex)
    
    const totalDocs = filteredPosts.length
    const totalPages = Math.ceil(totalDocs / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
    console.log(`[API /tags/${slug}] 找到 ${totalDocs} 篇文章，返回第 ${page} 页 ${paginatedPosts.length} 篇`)
    
    const response = {
      docs: paginatedPosts,
      totalDocs,
      limit,
      page,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null,
      pagingCounter: startIndex + 1,
    }
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=120, s-maxage=300', // 2分钟缓存
      },
    })
  } catch (error) {
    console.error('[API /tags/[slug]] 错误:', error)
    
    // 返回空结果
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