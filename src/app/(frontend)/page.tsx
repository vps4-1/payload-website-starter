import { Metadata } from 'next'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'

export const metadata: Metadata = {
  title: 'SiJiGPT - AI 资讯聚合',
  description: '精选 AI 相关文章，双语摘要，Terminal 风格'
}

export default function HomePage() {
  return (
    <TerminalLayout title="SiJiGPT">
      <div className="terminal-section">
        <h1>$ whoami</h1>
        <div className="terminal-output">
          <p>SiJiGPT - 你的 AI 资讯驾驶员</p>
          <p>精选全球 AI 相关资讯，提供中英文双语摘要</p>
        </div>

        <nav className="terminal-nav" style={{ marginTop: '2rem' }}>
          <Link href="/posts" className="terminal-button">文章列表</Link>
          <Link href="/tags" className="terminal-button">标签</Link>
          <Link href="/archives" className="terminal-button">归档</Link>
          <Link href="/about" className="terminal-button">关于</Link>
        </nav>
      </div>
    </TerminalLayout>
  )
}
