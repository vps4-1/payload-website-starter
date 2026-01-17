import type { Metadata } from 'next'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'

export const metadata: Metadata = {
  title: '关于 - SiJiGPT',
  description: 'AI驾驶员的全球资讯聚合站 - 关于 SiJiGPT 和站长的介绍',
}

export default function AboutPage() {
  return (
    <TerminalLayout title="SiJiGPT">
      <div className="about-page">
        {/* 站点标语 */}
        <section className="about-section">
          <div className="terminal-output">
            <pre className="ascii-art">
{`
   _____ _ _ _  _____ _____ _______ 
  / ____(_|_) |/ ____|  __ \\__   __|
 | (___  _| | | |  __| |__) | | |   
  \\___ \\| | | | | |_ |  ___/  | |   
  ____) | | | | |__| | |      | |   
 |_____/|_| |_|\\_____|_|      |_|   
                                     
   AI驾驶员的全球资讯聚合站
`}
            </pre>
          </div>
        </section>

        {/* 关于本站 */}
        <section className="about-section">
          <h2>$ cat about.txt</h2>
          <div className="terminal-output">
            <p>
              <strong>SiJiGPT（斯基GPT）</strong>是一个专注于 AI 资讯聚合的站点，为 AI 驾驶员们提供全球 AI 硬件软件资讯，助力驾驶技术越来越好。
            </p>
            <p>
              本站采用双语摘要模式（中文 + English），每篇文章都包含：
            </p>
            <ul>
              <li>📝 约 300 字的中文摘要</li>
              <li>🌍 约 300 字的英文摘要</li>
              <li>🔗 带内链的关键词系统</li>
              <li>🏷️ 完整的标签分类</li>
            </ul>
            <p style={{ marginTop: '15px' }}>
              <a href="/rss.xml" target="_blank" rel="noopener" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>
                📡 RSS 订阅
              </Link>
              <span> :: </span>
              <a href="https://github.com/vps4-1/payload-website-starter" target="_blank" rel="noopener" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>
                GitHub 仓库
              </Link>
            </p>
          </div>
        </section>

        {/* 关于站长 */}
        <section className="about-section">
          <h2>$ whoami</h2>
          <div className="terminal-output">
            <p>
              我是一名非技术背景的 AI 爱好者，完全依靠 AI 工具构建了这个网站。
            </p>
            <p>
              使用的工具：
            </p>
            <ul>
              <li><strong>Genspark</strong> - AI 搜索和内容整理</li>
              <li><strong>Manus</strong> - AI 辅助开发</li>
              <li><strong>ChatGPT</strong> - 文案优化</li>
            </ul>
            <p>
              这证明了：在 AI 时代，想法比技术更重要。任何人都可以创造自己的数字产品！
            </p>
          </div>
        </section>

        {/* 技术栈 */}
        <section className="about-section">
          <h2>$ cat tech-stack.json</h2>
          <div className="terminal-output">
            <div className="tech-stack">
              <div className="tech-item">
                <strong>前端框架</strong>
                <span>Next.js 15 + React 19</span>
              </div>
              <div className="tech-item">
                <strong>内容管理</strong>
                <span>Payload CMS 3.0</span>
              </div>
              <div className="tech-item">
                <strong>数据库</strong>
                <span>PostgreSQL (Neon)</span>
              </div>
              <div className="tech-item">
                <strong>文件存储</strong>
                <span>Vercel Blob</span>
              </div>
              <div className="tech-item">
                <strong>部署平台</strong>
                <span>Vercel</span>
              </div>
              <div className="tech-item">
                <strong>主题风格</strong>
                <span>Terminal (移植自 aigc-weekly)</span>
              </div>
            </div>
          </div>
        </section>

        {/* 联系方式 */}
        <section className="about-section">
          <h2>$ cat contact.txt</h2>
          <div className="terminal-output contact-grid">
            <div>
              <strong>📧 邮箱</strong>
              <a href="mailto:contact@sijigpt.com">contact@sijigpt.com</Link>
            </div>
            <div>
              <strong>🌐 网站</strong>
              <a href="https://sijigpt.com" target="_blank" rel="noopener">sijigpt.com</Link>
            </div>
            <div>
              <strong>🏠 主站</strong>
              <a href="https://zhuji.gd" target="_blank" rel="noopener">zhuji.gd</Link>
            </div>
          </div>
        </section>

        {/* 内容主题 */}
        <section className="about-section">
          <h2>$ ls topics/</h2>
          <div className="terminal-output">
            <div className="topics-grid">
              <div className="topic-card">
                <h3>🖥️ AI 硬件</h3>
                <p>GPU、AI 芯片、算力资讯</p>
              </div>
              <div className="topic-card">
                <h3>💻 AI 软件</h3>
                <p>大模型、工具、应用案例</p>
              </div>
              <div className="topic-card">
                <h3>📊 行业观察</h3>
                <p>趋势分析、商业模式</p>
              </div>
              <div className="topic-card">
                <h3>🛠️ 实用指南</h3>
                <p>教程、最佳实践、工具对比</p>
              </div>
            </div>
          </div>
        </section>

        {/* 站点统计 */}
        <section className="about-section">
          <h2>$ cat stats.log</h2>
          <div className="terminal-output">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">2</div>
                <div className="stat-label">文章总数</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">10</div>
                <div className="stat-label">标签分类</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">3</div>
                <div className="stat-label">运行天数</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">100%</div>
                <div className="stat-label">AI 驱动</div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO 相关 */}
        <section className="about-section">
          <h2>$ ls seo/</h2>
          <div className="terminal-output">
            <p>搜索引擎优化相关：</p>
            <ul className="links-list">
              <li>
                <a href="/sitemap.xml" target="_blank" rel="noopener">
                  Sitemap.xml
                </Link> - 网站地图
              </li>
              <li>
                <a href="/robots.txt" target="_blank" rel="noopener">
                  Robots.txt
                </Link> - 爬虫协议
              </li>
              <li>
                <a href="/rss.xml" target="_blank" rel="noopener">
                  RSS Feed
                </Link> - 订阅源
              </li>
            </ul>
          </div>
        </section>

        {/* 致谢 */}
        <section className="about-section">
          <h2>$ cat thanks.md</h2>
          <div className="terminal-output">
            <p>本站的诞生离不开以下项目和资源：</p>
            <ul className="links-list">
              <li>
                <a href="https://aigc-weekly.agi.li" target="_blank" rel="noopener">
                  Agili 的 AIGC 周刊
                </Link> - Terminal 主题的灵感来源
              </li>
              <li>
                <a href="https://payloadcms.com" target="_blank" rel="noopener">
                  Payload CMS
                </Link> - 强大的内容管理系统
              </li>
              <li>
                <a href="https://nextjs.org" target="_blank" rel="noopener">
                  Next.js
                </Link> - 现代化的 React 框架
              </li>
              <li>
                <a href="https://neon.tech" target="_blank" rel="noopener">
                  Neon
                </Link> - Serverless PostgreSQL
              </li>
            </ul>
          </div>
        </section>

        {/* 结束语 */}
        <section className="about-section">
          <div className="terminal-output">
            <pre>
{`
> 在 AI 时代，每个人都可以是创造者
> 让我们一起探索 AI 的无限可能 🚀

$ █
`}
            </pre>
          </div>
        </section>

        {/* 导航按钮 */}
        <div className="terminal-actions">
          <Link href="/posts" className="terminal-button">
            📚 浏览文章
          </Link>
          <Link href="/search" className="terminal-button">
            🔍 搜索内容
          </Link>
        </div>
      </div>
    </TerminalLayout>
  )
}
