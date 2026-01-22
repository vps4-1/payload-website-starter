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
        <div className="terminal-title">
          <Link href="/" className="text-pistachio-400 hover:text-pistachio-300 transition-colors duration-200">
            {title || '斯基GPT'}
          </Link>
        </div>
      </header>

      <main className="terminal-content">
        {children}
      </main>
    </div>
  )
}
