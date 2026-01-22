import Link from 'next/link'

export function SiteHeader() {
  return (
    <div className="site-header">
      <Link 
        href="/" 
        className="site-logo"
      >
        斯基GPT
      </Link>
      <nav className="site-nav">
        <Link href="/" className="nav-link">主页</Link>
        <span className="nav-separator">|</span>
        <Link href="/tags" className="nav-link">标签</Link>
        <span className="nav-separator">|</span>
        <Link href="/archives" className="nav-link">归档</Link>
        <span className="nav-separator">|</span>
        <Link href="/about" className="nav-link">关于</Link>
        <span className="nav-separator">|</span>
        <Link href="/rss.xml" className="nav-link">RSS</Link>
      </nav>
    </div>
  )
}

export function SubscribeSection() {
  return (
    <>
      {/* 订阅区域 */}
      <div className="subscribe-section">
        <div className="subscribe-container">
          <span className="subscribe-title">$ 订阅我们</span>
          <span className="subscribe-separator">——</span>
          
          <a 
            href="https://t.me/sijigpt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="subscribe-button"
          >
            <span>📱</span>
            <span>Telegram 频道</span>
          </a>
          
          <span className="subscribe-diamond">◆</span>
          
          <a 
            href="mailto:subscribe@sijigpt.com" 
            className="subscribe-button"
          >
            <span>📧</span>
            <span>邮件订阅</span>
          </a>
          
          <span className="subscribe-diamond">◆</span>
          
          <a 
            href="https://notion.so/sijigpt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="subscribe-button"
          >
            <span>📄</span>
            <span>Notion 订阅</span>
          </a>
        </div>
      </div>

      {/* 分隔线 */}
      <div className="content-separator"></div>
    </>
  )
}