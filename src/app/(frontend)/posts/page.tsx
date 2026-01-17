import React from 'react'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'

export default async function PostsPage() {
  // 示例文章数据
  const posts = [
    {
      id: '1',
      slug: 'zenken-chatgpt-enterprise',
      title: 'Zenken通过ChatGPT Enterprise增强精简销售团队',
      publishedAt: '2026-01-14',
      source: {
        name: 'OpenAI Blog'
      },
      summary_zh: {
        content: '日本企业Zenken成功部署ChatGPT Enterprise版本，显著提升了其精简销售团队的工作效率和业务成果...'
      }
    },
    {
      id: '2',
      slug: 'alibaba-tongyi-qianwen-3',
      title: '阿里云发布通义千问3.0大模型',
      publishedAt: '2026-01-14',
      source: {
        name: '阿里云官方博客'
      },
      summary_zh: {
        content: '阿里云正式发布通义千问3.0大语言模型，标志着中国AI技术取得重大突破...'
      }
    }
  ]

  return (
    <TerminalLayout title="我的终端博客">
      <div className="index-content">
        <div className="framed">
          <p>
            欢迎来到终端博客！这里汇集了 AI 领域最新的技术进展和深度观点，提供中英文双语摘要。
          </p>
          <p>
            <Link href="/posts">所有文章</Link>
            {' :: '}
            <Link href="/about">关于</Link>
          </p>
        </div>
      </div>

      <div className="posts">
        {posts.map((post) => (
          <article className="post" key={post.id}>
            <h2 className="post-title">
              <Link href={`/posts/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            
            <div className="post-meta">
              发布于 {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
              {' :: '}
              来源：{post.source.name}
            </div>

            <div className="post-content">
              <p>{post.summary_zh.content}</p>
            </div>

            <div>
              <Link className="button" href={`/posts/${post.slug}`}>
                阅读更多 →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </TerminalLayout>
  )
}
