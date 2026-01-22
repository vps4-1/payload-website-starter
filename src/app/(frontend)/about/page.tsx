import { TerminalLayout } from '@/components/TerminalLayout'
import { SiteHeader, SubscribeSection } from '@/components/SiteComponents'

export const metadata = {
  title: '关于我们 - SijiGPT',
  description: 'SijiGPT - 你的AI资讯驾驶员，专注于聚合全球优质AI资讯和技术动态',
  keywords: '关于SijiGPT, AI资讯, 人工智能, 团队介绍',
}

export default function AboutPage() {
  return (
    <TerminalLayout customHeader={<SiteHeader />}>
      <div style={{ marginTop: '-1rem' }} className="mb-4">
        {/* header下方细线 */}
        <div style={{ borderTop: '1px solid var(--terminal-border)', margin: '0 0 1.5rem 0' }}></div>
        
        {/* 页面标题 */}
        <div className="mb-6" style={{ textAlign: 'center' }}>
          <h1 className="text-2xl font-bold text-terminal-text mb-2">
            🚗 关于 SijiGPT
          </h1>
          <p className="text-terminal-muted">
            你的 AI 资讯驾驶员，带你遨游人工智能的世界
          </p>
        </div>

        <SubscribeSection />
        
        {/* 内容区域 */}
        <div className="space-y-8 max-w-3xl mx-auto">
          {/* 使命愿景 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              🎯 我们的使命
            </h2>
            <div className="pl-4 space-y-3 text-terminal-text">
              <p>
                SijiGPT 致力于成为最优质的 AI 资讯聚合平台，为关注人工智能发展的用户提供：
              </p>
              <ul className="list-disc list-inside space-y-2 text-terminal-muted">
                <li>📰 全球前沿的AI技术资讯</li>
                <li>🔬 深度的行业分析和趋势解读</li>
                <li>🚀 最新的AI产品和工具发布</li>
                <li>💡 实用的AI应用案例分享</li>
              </ul>
            </div>
          </section>

          {/* 数据来源 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              📡 数据来源
            </h2>
            <div className="pl-4 space-y-3 text-terminal-text">
              <p>我们的内容来源于全球知名的AI机构和技术博客：</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <h3 className="font-semibold text-pistachio-400">研究机构</h3>
                  <ul className="space-y-1 text-terminal-muted">
                    <li>• OpenAI</li>
                    <li>• Google AI</li>
                    <li>• DeepMind</li>
                    <li>• Anthropic</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-pistachio-400">技术平台</h3>
                  <ul className="space-y-1 text-terminal-muted">
                    <li>• HuggingFace</li>
                    <li>• AWS ML Blog</li>
                    <li>• GitHub</li>
                    <li>• arXiv</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-pistachio-400">行业媒体</h3>
                  <ul className="space-y-1 text-terminal-muted">
                    <li>• TechCrunch</li>
                    <li>• VentureBeat</li>
                    <li>• MIT Tech Review</li>
                    <li>• The Verge</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 技术架构 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              ⚙️ 技术架构
            </h2>
            <div className="pl-4 space-y-3">
              <div className="bg-terminal-bg border border-terminal-border p-4 rounded">
                <pre className="text-sm text-terminal-text">
{`🔧 前端架构
├── Next.js 15 (App Router)
├── TypeScript
├── Tailwind CSS
└── Payload CMS

🚀 部署架构  
├── Cloudflare Pages (静态部署)
├── Cloudflare Workers (API服务)
├── PostgreSQL (数据存储)
└── Claude 3.5 (AI处理)`}
                </pre>
              </div>
            </div>
          </section>

          {/* 更新频率 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              🔄 更新频率
            </h2>
            <div className="pl-4 space-y-3 text-terminal-text">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-terminal-border p-4 rounded">
                  <h3 className="font-semibold text-pistachio-400 mb-2">⏰ 自动更新</h3>
                  <p className="text-sm text-terminal-muted">
                    每天定时抓取和更新内容，确保资讯的时效性
                  </p>
                </div>
                <div className="border border-terminal-border p-4 rounded">
                  <h3 className="font-semibold text-pistachio-400 mb-2">🤖 AI筛选</h3>
                  <p className="text-sm text-terminal-muted">
                    使用AI智能筛选，只推送高质量和有价值的内容
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 联系我们 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              📧 联系我们
            </h2>
            <div className="pl-4 space-y-3 text-terminal-text">
              <p>如果您有任何建议或合作意向，欢迎联系我们：</p>
              <div className="space-y-2 text-terminal-muted">
                <p>📮 邮箱：contact@sijigpt.com</p>
                <p>🐦 Twitter：@SijiGPT</p>
                <p>💬 微信：SijiGPT_Official</p>
              </div>
            </div>
          </section>
        </div>

        {/* 底部信息 */}
        <div className="pt-8 text-terminal-muted text-sm text-center border-t border-terminal-border">
          <p>Powered by Cloudflare Workers + Payload CMS + Claude 3.5</p>
          <p className="mt-1">
            © 2024 SijiGPT. All rights reserved.
          </p>
        </div>
      </div>
    </TerminalLayout>
  )
}