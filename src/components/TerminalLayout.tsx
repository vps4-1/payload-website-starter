import React from 'react'
import Link from 'next/link'

interface TerminalLayoutProps {
  children: React.ReactNode
  title?: string
  showNav?: boolean
}

export function TerminalLayout({ children, title, showNav = false }: TerminalLayoutProps) {
  return (
    <div className="terminal-container">
      <header className="terminal-header">
        <Link href="/" className="terminal-logo">
          {title || '斯基GPT'}
        </Link>
      </header>

      <main className="terminal-content">
        {children}
      </main>
    </div>
  )
}
