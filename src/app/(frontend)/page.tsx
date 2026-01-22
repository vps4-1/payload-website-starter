import React from 'react'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'
import InfinitePostList from '@/components/InfinitePostList'
import { SiteHeader, SubscribeSection } from '@/components/SiteComponents'
import { getApiBaseUrl } from '@/utilities/getURL'

export const metadata = {
  title: 'SijiGPT - 斯基GPT - 你的 AI 资讯驾驶员',
  description: '聚合全球优质 AI 资讯，提供中英双语深度解读',
}

// 按需刷新

async function getPosts(limit = 50, retries = 3) {
  try {
    const baseUrl = getApiBaseUrl()
    console.log(`[getPosts] 尝试获取文章，URL: ${baseUrl}/api/posts?limit=${limit}&sort=-createdAt`)
    
    const res = await fetch(`${baseUrl}/api/posts?limit=${limit}&sort=-createdAt`, { 
      next: { revalidate: 0, tags: [] }
    })
    
    if (!res.ok) {
      console.log(`[getPosts] API 响应错误: ${res.status} ${res.statusText}`)
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }
    
    const data = await res.json()
    console.log(`[getPosts] 成功获取 ${data.docs?.length || 0} 篇文章`)
    
    return {
      posts: data.docs || [],
      hasMore: data.hasNextPage || false,
      totalDocs: data.totalDocs || 0
    }
  } catch (error) {
    console.error('获取文章失败:', error)
    
    // 如果还有重试次数，等待一秒后重试
    if (retries > 0) {
      console.log(`[getPosts] 重试中... (剩余 ${retries} 次)`)
      await new Promise(resolve => setTimeout(resolve, 1000))
      return getPosts(limit, retries - 1)
    }
    
    // 所有重试都失败了，返回空结果
    console.log('[getPosts] 所有重试都失败，返回空结果')
    return { posts: [], hasMore: false, totalDocs: 0 }
  }
}

export default async function HomePage() {
  const { posts, hasMore, totalDocs } = await getPosts(50)

  return (
    <TerminalLayout customHeader={<SiteHeader />}>
      <div style={{ marginTop: '-1rem' }} className="mb-4">
        {/* header下方细线 */}
        <div style={{ borderTop: '1px solid var(--terminal-border)', margin: '0 0 0.25rem 0' }}></div>
        
        {/* 介绍信息 */}
        <div className="mb-4" style={{ textAlign: 'center' }}>
          <p className="text-lg text-terminal-text mb-2" style={{ textAlign: 'center' }}>
            你的 AI 资讯驾驶员 | 聚合全球优质 AI 资讯
          </p>
        </div>
        
        <div className="mb-6" style={{ textAlign: 'center' }}>
          <p className="text-terminal-muted text-sm">
            共 {totalDocs} 篇文章 · 每天 4 次更新 · AI 智能筛选 · 双语摘要
          </p>
        </div>

        <SubscribeSection />

        {/* 文章列表 */}
        <InfinitePostList 
          initialPosts={posts} 
          initialHasMore={hasMore} 
          totalDocs={totalDocs} 
        />

        {/* 底部信息 */}
        <div className="pt-4 text-terminal-muted text-sm text-center">
          <p>Powered by Cloudflare Workers + Payload CMS + Claude 3.5</p>
          <p className="mt-1">
            数据源: OpenAI, Google AI, DeepMind, AWS ML Blog, HuggingFace 等
          </p>
        </div>
      </div>
    </TerminalLayout>
  )
}