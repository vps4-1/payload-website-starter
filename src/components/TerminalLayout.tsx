import React from 'react'
import Link from 'next/link'

interface TerminalLayoutProps {
  children: React.ReactNode
  title?: string
  showNav?: boolean
  customHeader?: React.ReactNode
  hideDefaultHeader?: boolean
}

export function TerminalLayout({ children, title, showNav = false, customHeader, hideDefaultHeader = false }: TerminalLayoutProps) {
  return (
    <div className="terminal-container">
      {!hideDefaultHeader && !customHeader && (
        <header className="terminal-header">
          <div className="terminal-title">
            <Link href="/" className="text-pistachio-400 hover:text-pistachio-300 transition-colors duration-200">
              {title || '斯基GPT'}
            </Link>
          </div>
        </header>
      )}
      
      {customHeader && customHeader}

      <main className="terminal-content">
        {children}
      </main>
    </div>
  )
}
