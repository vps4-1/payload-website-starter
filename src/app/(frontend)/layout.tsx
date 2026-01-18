import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://sijigpt.com'),
  title: {
    default: 'SijiGPT - AI驾驶员的全球资讯聚合站',
    template: '%s - SijiGPT',
  },
  description: '本站为AI驾驶员们提供全球AI硬件软件资讯聚合，助力驾驶技术越来越好',
  keywords: ['AI', '人工智能', 'ChatGPT', '大模型', 'AI资讯', 'AI工具', 'AI硬件', 'AI软件'],
  authors: [{ name: 'SijiGPT' }],
  creator: 'SijiGPT',
  publisher: 'SijiGPT',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/',
    title: 'SijiGPT - AI驾驶员的全球资讯聚合站',
    description: '本站为AI驾驶员们提供全球AI硬件软件资讯聚合，助力驾驶技术越来越好',
    siteName: 'SijiGPT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SijiGPT - AI驾驶员的全球资讯聚合站',
    description: '本站为AI驾驶员们提供全球AI硬件软件资讯聚合，助力驾驶技术越来越好',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link 
          rel="alternate" 
          type="application/rss+xml" 
          title="SijiGPT RSS Feed" 
          href="/rss.xml" 
        />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SERVER_URL || 'https://sijigpt.com'} />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
