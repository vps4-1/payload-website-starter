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
          {title || 'Terminal Blog'}
        </Link>
      </header>
      <main className="terminal-content">
        {children}
      </main>
    </div>
  )
}
