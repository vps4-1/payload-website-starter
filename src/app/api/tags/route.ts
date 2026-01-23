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
    console.log('[API /tags] 获取所有标签')
    
    const payloadInstance = await getPayloadInstance()
    
    // 获取所有文章来提取标签
    const result = await payloadInstance.find({
      collection: 'posts',
      limit: 1000, // 获取足够多的文章
      sort: ['-createdAt'],
    })
    
    const posts = result.docs || []
    const tagCount: Record<string, number> = {}
    
    // 统计所有标签的使用频率
    posts.forEach((post: any) => {
      // 中文关键词
      if (post.summary_zh?.keywords) {
        post.summary_zh.keywords.forEach((kw: any) => {
          const keyword = typeof kw === 'string' ? kw : kw.keyword
          if (keyword) {
            tagCount[keyword] = (tagCount[keyword] || 0) + 1
          }
        })
      }
      
      // 英文关键词
      if (post.summary_en?.keywords) {
        post.summary_en.keywords.forEach((kw: any) => {
          const keyword = typeof kw === 'string' ? kw : kw.keyword
          if (keyword) {
            tagCount[keyword] = (tagCount[keyword] || 0) + 1
          }
        })
      }
    })
    
    // 转换为标签数组并按使用频率排序
    const tags = Object.entries(tagCount)
      .map(([keyword, count]) => ({
        keyword,
        count,
        slug: encodeURIComponent(keyword)
      }))
      .sort((a, b) => b.count - a.count) // 按使用频率降序排序
    
    console.log(`[API /tags] 成功提取 ${tags.length} 个标签`)
    
    return NextResponse.json({
      tags,
      totalTags: tags.length,
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600', // 5分钟缓存
      },
    })
  } catch (error) {
    console.error('[API /tags] 错误:', error)
    
    // 返回空标签列表
    return NextResponse.json(
      {
        tags: [],
        totalTags: 0,
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