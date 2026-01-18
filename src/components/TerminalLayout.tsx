import React from 'react'
import Link from 'next/link'

interface TerminalLayoutProps {
  children: React.ReactNode
  title?: string
}

export function TerminalLayout({ children, title }: TerminalLayoutProps) {
  return (
    <div className="terminal-container">
      <header className="terminal-header">
        <Link href="/" className="terminal-logo">
          {title || '斯基GPT'}
        </Link>
      </header>

      <nav className="terminal-nav">
        <Link href="/" className="nav-link">主页</Link>
        <Link href="/posts" className="nav-link">文章</Link>
        <Link href="/tags" className="nav-link">标签</Link>
        <Link href="/archives" className="nav-link">归档</Link>
        <Link href="/rss.xml" className="nav-link">RSS</Link>
      </nav>

      <main className="terminal-content">
        {children}
      </main>
    </div>
  )
}
