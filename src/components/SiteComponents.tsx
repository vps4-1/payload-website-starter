import Link from 'next/link'

export function SiteHeader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '1rem 2rem' }}>
      <Link 
        href="/" 
        style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--pistachio-400)', textDecoration: 'none' }}
      >
        斯基GPT
      </Link>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--pistachio-400)', textDecoration: 'none' }}>主页</Link>
        <span style={{ color: 'var(--terminal-gray)', fontSize: '1.1rem' }}>|</span>
        <Link href="/tags" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--pistachio-400)', textDecoration: 'none' }}>标签</Link>
        <span style={{ color: 'var(--terminal-gray)', fontSize: '1.1rem' }}>|</span>
        <Link href="/archives" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--pistachio-400)', textDecoration: 'none' }}>归档</Link>
        <span style={{ color: 'var(--terminal-gray)', fontSize: '1.1rem' }}>|</span>
        <Link href="/about" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--pistachio-400)', textDecoration: 'none' }}>关于</Link>
        <span style={{ color: 'var(--terminal-gray)', fontSize: '1.1rem' }}>|</span>
        <Link href="/rss.xml" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--pistachio-400)', textDecoration: 'none' }}>RSS</Link>
      </nav>
    </div>
  )
}

export function SubscribeSection() {
  return (
    <>
      {/* 订阅区域 */}
      <div className="mb-6" style={{ textAlign: 'center', width: '100%' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1.5rem'
        }}>
          <span className="text-pistachio-400 font-bold">$ 订阅我们</span>
          <span className="text-pistachio-400">——</span>
          
          <a 
            href="https://t.me/sijigpt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border-2 border-pistachio-400 text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg transition-all duration-200 rounded whitespace-nowrap"
          >
            <span>📱</span>
            <span>Telegram 频道</span>
          </a>
          
          <span style={{ margin: '0 0.75rem', display: 'inline-block', color: 'var(--pistachio-400)', fontSize: '1.25rem', fontWeight: 'bold' }}>◆</span>
          
          <a 
            href="mailto:subscribe@sijigpt.com" 
            className="flex items-center gap-2 px-4 py-2 border-2 border-pistachio-400 text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg transition-all duration-200 rounded whitespace-nowrap"
          >
            <span>📧</span>
            <span>邮件订阅</span>
          </a>
          
          <span style={{ margin: '0 0.75rem', display: 'inline-block', color: 'var(--pistachio-400)', fontSize: '1.25rem', fontWeight: 'bold' }}>◆</span>
          
          <a 
            href="https://notion.so/sijigpt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border-2 border-pistachio-400 text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg transition-all duration-200 rounded whitespace-nowrap"
          >
            <span>📄</span>
            <span>Notion 订阅</span>
          </a>
        </div>
      </div>

      {/* 分隔线 */}
      <div 
        style={{
          borderTop: '4px solid var(--pistachio-400)',
          margin: '1.5rem 0 1rem 0',
          width: '100%'
        }}
      ></div>
    </>
  )
}