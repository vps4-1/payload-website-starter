import type { Metadata } from 'next'
import { TerminalLayout } from '@/components/TerminalLayout'

export const metadata: Metadata = {
  title: '归档 - SiJiGPT',
  description: '按时间查看所有文章',
}

const archives = [
  {
    year: '2026',
    months: [
      {
        month: '01',
        monthName: '一月',
        posts: [
          {
            id: '1',
            slug: 'zenken-chatgpt-enterprise',
            title: 'Zenken通过ChatGPT Enterprise增强精简销售团队',
            date: '2026-01-15',
            source: 'OpenAI Blog',
          },
          {
            id: '2',
            slug: 'alibaba-tongyi-qianwen-3',
            title: '阿里云发布通义千问3.0大模型',
            date: '2026-01-14',
            source: '阿里云官方博客',
          },
        ],
      },
    ],
  },
]

export default function ArchivesPage() {
  const totalPosts = archives.reduce((sum, year) => {
    return sum + year.months.reduce((monthSum, month) => monthSum + month.posts.length, 0)
  }, 0)

  return (
    <TerminalLayout title="SiJiGPT">
      <div className="archives-page">
        <header className="archives-header">
          <h1>$ ls posts/ --sort-by date --group-by month</h1>
          <p className="archives-subtitle">共 {totalPosts} 篇文章</p>
        </header>

        <div className="archives-timeline">
          {archives.map((yearData) => (
            <div key={yearData.year} className="archive-year">
              <h2 className="year-title">
                <span className="year-marker">▸</span> {yearData.year} 年
              </h2>
              
              {yearData.months.map((monthData) => (
                <div key={`${yearData.year}-${monthData.month}`} className="archive-month">
                  <h3 className="month-title">
                    <span className="month-marker">├─</span> {monthData.monthName}
                    <span className="month-count">({monthData.posts.length} 篇)</span>
                  </h3>

                  <div className="posts-in-month">
                    {monthData.posts.map((post, index) => (
                      <article key={post.id} className="archive-post-item">
                        <span className="post-marker">
                          {index === monthData.posts.length - 1 ? '└─' : '├─'}
                        </span>
                        <div className="archive-post-content">
                          <time className="archive-post-date">
                            {new Date(post.date).toLocaleDateString('zh-CN', {
                              month: '2-digit',
                              day: '2-digit',
                            })}
                          </time>
                          <a href={`/posts/${post.slug}`} className="archive-post-title">
                            {post.title}
                          </a>
                          <span className="archive-post-source">[{post.source}]</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <section className="archives-stats">
          <h2>$ cat stats.log</h2>
          <div className="terminal-output">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{totalPosts}</div>
                <div className="stat-label">文章总数</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{archives.length}</div>
                <div className="stat-label">年份</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {archives.reduce((sum, year) => sum + year.months.length, 0)}
                </div>
                <div className="stat-label">月份</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {(totalPosts / archives.reduce((sum, year) => sum + year.months.length, 0)).toFixed(1)}
                </div>
                <div className="stat-label">月均产出</div>
              </div>
            </div>
          </div>
        </section>

        <div className="terminal-actions">
          <a href="/posts" className="terminal-button">
            ← 返回文章列表
          </a>
          <a href="/tags" className="terminal-button">
            🏷️ 查看标签
          </a>
        </div>
      </div>
    </TerminalLayout>
  )
}
