import React from 'react'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'
import InfinitePostList from '@/components/InfinitePostList'

export const metadata = {
  title: 'SijiGPT - 斯基GPT - 你的 AI 资讯驾驶员',
  description: '聚合全球优质 AI 资讯，提供中英双语深度解读',
}

// 按需刷新

async function getPosts(limit = 50) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?limit=${limit}&sort=-createdAt`, { next: { revalidate: 0, tags: [] } })
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    return {
      posts: data.docs || [],
      hasMore: data.hasNextPage || false,
      totalDocs: data.totalDocs || 0
    }
  } catch (error) {
    console.error('获取文章失败:', error)
    return { posts: [], hasMore: false, totalDocs: 0 }
  }
}

export default async function HomePage() {
  const { posts, hasMore, totalDocs } = await getPosts(50)

  const CustomHeader = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '1.5rem 2rem' }}>
      <Link 
        href="/" 
        style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--pistachio-400)', textDecoration: 'none' }}
      >
        斯基GPT
      </Link>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/posts" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--pistachio-400)', textDecoration: 'none' }}>主页</Link>
        <span style={{ color: 'var(--terminal-gray)', fontSize: '1.1rem' }}>|</span>
        <Link href="/posts" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--pistachio-400)', textDecoration: 'none' }}>文章</Link>
        <span style={{ color: 'var(--terminal-gray)', fontSize: '1.1rem' }}>|</span>
        <Link href="/tags" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--pistachio-400)', textDecoration: 'none' }}>标签</Link>
        <span style={{ color: 'var(--terminal-gray)', fontSize: '1.1rem' }}>|</span>
        <Link href="/archives" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--pistachio-400)', textDecoration: 'none' }}>归档</Link>
        <span style={{ color: 'var(--terminal-gray)', fontSize: '1.1rem' }}>|</span>
        <Link href="/rss.xml" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--pistachio-400)', textDecoration: 'none' }}>RSS</Link>
      </nav>
    </div>
  )

  return (
    <TerminalLayout customHeader={<CustomHeader />}>
      <div style={{ marginTop: '-1rem' }} className="mb-4">
        {/* 介绍信息 */}
        <div className="mb-4" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--pistachio-400)', marginBottom: '1rem' }}>
            斯基GPT
          </h1>
          <p className="text-lg text-terminal-text mb-2" style={{ textAlign: 'center' }}>
            你的 AI 资讯驾驶员 | 聚合全球优质 AI 资讯
          </p>
        </div>
        
        <div className="mb-6" style={{ textAlign: 'center' }}>
          <p className="text-terminal-muted text-sm">
            共 {totalDocs} 篇文章 · 每天 4 次更新 · AI 智能筛选 · 双语摘要
          </p>
        </div>

        {/* 订阅区域 */}
        <div className="mb-8" style={{ textAlign: 'center', width: '100%' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '1.5rem'
          }}>
            <span className="text-pistachio-400 font-bold">$ 订阅我们</span>
            <span className="text-pistachio-400">——</span>
            
            <a 
              href="https://t.me/sijigpt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border-2 border-pistachio-400 text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg transition-all duration-200 rounded whitespace-nowrap"
            >
              <span>📱</span>
              <span>Telegram 频道</span>
            </a>
            
            <span style={{ margin: '0 0.75rem', display: 'inline-block', color: 'var(--pistachio-400)', fontSize: '1.25rem', fontWeight: 'bold' }}>◆</span>
            
            <a 
              href="mailto:subscribe@sijigpt.com" 
              className="flex items-center gap-2 px-4 py-2 border-2 border-pistachio-400 text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg transition-all duration-200 rounded whitespace-nowrap"
            >
              <span>📧</span>
              <span>邮件订阅</span>
            </a>
            
            <span style={{ margin: '0 0.75rem', display: 'inline-block', color: 'var(--pistachio-400)', fontSize: '1.25rem', fontWeight: 'bold' }}>◆</span>
            
            <a 
              href="https://notion.so/sijigpt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border-2 border-pistachio-400 text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg transition-all duration-200 rounded whitespace-nowrap"
            >
              <span>📄</span>
              <span>Notion 订阅</span>
            </a>
          </div>
        </div>

        {/* 分隔线 */}
        <div 
          style={{
            borderTop: '4px solid var(--pistachio-400)',
            margin: '2rem 0',
            width: '100%'
          }}
        ></div>

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