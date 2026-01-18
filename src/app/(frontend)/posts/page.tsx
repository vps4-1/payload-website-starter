import Link from 'next/link'
import { TerminalLayout } from '@/components/TerminalLayout'

export const metadata = {
  title: '文章列表 - SiJiGPT',
}

export default function PostsPage() {
  return (
    <TerminalLayout>
      <div className="space-y-6">
        <h1 className="text-2xl text-pistachio-400">$ ls posts/</h1>
        <p className="text-terminal-muted">
          文章正在聚合中，Worker 每天会自动发布新内容...
        </p>
        <Link href="/" className="text-pistachio-400 hover:underline">
          ← 返回首页
        </Link>
      </div>
    </TerminalLayout>
  )
}
