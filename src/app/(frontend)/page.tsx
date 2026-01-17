import React from 'react'
import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'

export const metadata = {
  title: 'SiJiGPT - 你的 AI 资讯驾驶员',
  description: '聚合全球优质 AI 资讯，提供中英双语深度解读',
}

export default function HomePage() {
  return (
    <TerminalLayout>
      <div className="space-y-8">
        {/* ASCII Art Logo */}
        <pre className="text-pistachio-400 text-sm overflow-x-auto">
{`
   _____ _ _ _  _____  _____ _______ 
  / ____(_|_|_)/ ____|/ ____|__   __|
 | (___  _ _  | |  __| |  __   | |   
  \\___ \\| | | | | |_ | | |_ |  | |   
  ____) | | | | |__| | |__| |  | |   
 |_____/|_| |_|\\_____|\\_____|  |_|   
                                      
`}
        </pre>

        {/* whoami */}
        <div className="space-y-2">
          <div className="text-pistachio-400">$ whoami</div>
          <div className="pl-4 text-terminal-text">
            <span className="text-pistachio-300 font-bold">SiJiGPT</span> - 你的 AI 资讯驾驶员
          </div>
        </div>

        {/* 简介 */}
        <div className="space-y-2">
          <div className="text-pistachio-400">$ cat about.txt</div>
          <div className="pl-4 text-terminal-text space-y-2">
            <p>
              聚合全球优质 AI 资讯，通过 Claude 3.5 智能筛选和处理，
              为你提供中英双语的深度解读。
            </p>
            <p className="text-terminal-muted">
              每天 4 次更新 · RSS 聚合 · AI 去重 · 双语摘要 · 关键词提取
            </p>
          </div>
        </div>

        {/* 导航菜单 */}
        <div className="space-y-2">
          <div className="text-pistachio-400">$ ls -la</div>
          <div className="pl-4 space-y-1">
            <Link 
              href="/posts" 
              className="block hover:text-pistachio-300 transition-colors"
            >
              drwxr-xr-x  <span className="text-pistachio-400">posts/</span>
              <span className="text-terminal-muted ml-4">所有文章</span>
            </Link>
            <Link 
              href="/tags" 
              className="block hover:text-pistachio-300 transition-colors"
            >
              drwxr-xr-x  <span className="text-pistachio-400">tags/</span>
              <span className="text-terminal-muted ml-4">标签分类</span>
            </Link>
            <Link 
              href="/archives" 
              className="block hover:text-pistachio-300 transition-colors"
            >
              drwxr-xr-x  <span className="text-pistachio-400">archives/</span>
              <span className="text-terminal-muted ml-4">时间归档</span>
            </Link>
            <Link 
              href="/about" 
              className="block hover:text-pistachio-300 transition-colors"
            >
              -rw-r--r--  <span className="text-terminal-text">about.md</span>
              <span className="text-terminal-muted ml-4">关于本站</span>
            </Link>
            <a 
              href="/rss.xml" 
              className="block hover:text-pistachio-300 transition-colors"
              target="_blank"
            >
              -rw-r--r--  <span className="text-terminal-text">rss.xml</span>
              <span className="text-terminal-muted ml-4">RSS 订阅</span>
            </a>
          </div>
        </div>

        {/* 快速开始 */}
        <div className="space-y-2">
          <div className="text-pistachio-400">$ cd posts && ls</div>
          <div className="pl-4">
            <Link 
              href="/posts"
              className="inline-block px-4 py-2 border border-pistachio-400 text-pistachio-400 hover:bg-pistachio-400 hover:text-terminal-bg transition-colors"
            >
              查看最新文章 →
            </Link>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="pt-8 text-terminal-muted text-sm border-t border-terminal-border">
          <p>Powered by Cloudflare Workers + Payload CMS + Claude 3.5</p>
          <p className="mt-1">
            数据源: OpenAI, Google AI, DeepMind, AWS ML Blog, HuggingFace 等
          </p>
        </div>
      </div>
    </TerminalLayout>
  )
}
