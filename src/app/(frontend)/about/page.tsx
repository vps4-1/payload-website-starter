import { TerminalLayout } from '@/components/TerminalLayout'
import { SiteHeader, SubscribeSection } from '@/components/SiteComponents'

export const metadata = {
  title: '关于斯基GPT - AI驾驶员的全球资讯聚合站',
  description: '斯基GPT是基于AI的自动化内容聚合平台，专注收集全球AI/ML技术资讯，使用Cloudflare Workers和多模型AI提供高质量双语内容',
  keywords: '斯基GPT, AI资讯聚合, Cloudflare Workers, AI内容分析, 多模型AI, RSS聚合, GenSpark AI',
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
            🚗 关于斯基GPT
          </h1>
          <p className="text-terminal-muted">
            斯基GPT - 做你的AI驾驶员！
          </p>
        </div>

        <SubscribeSection />
        
        {/* 内容区域 */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* 平台介绍 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              🤖 平台介绍
            </h2>
            <div className="pl-4 space-y-3 text-terminal-text">
              <p>
                斯基GPT是一个基于 AI 人工智能的自动化内容聚合平台，专注于收集、筛选和发布全球最新的AI/ML技术资讯。
                通过智能化的RSS源监控、AI内容分析和多平台自动发布，为AI从业者和爱好者提供高质量的中英双语技术内容。
              </p>
              <p className="text-terminal-muted">
                使用 <strong className="text-pistachio-400">GenSpark AI</strong> 技术驱动，确保内容的专业性和时效性。
              </p>
            </div>
          </section>

          {/* 技术架构 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              🛠️ 技术架构
            </h2>
            
            {/* 核心技术栈 */}
            <div className="pl-4 space-y-4">
              <h3 className="font-semibold text-terminal-text">核心技术栈</h3>
              <div className="bg-terminal-bg border border-terminal-border p-4 rounded">
                <pre className="text-sm text-terminal-text">
{`🚀 Runtime: Cloudflare Workers (Edge Computing)
💾 存储: Cloudflare KV (键值对数据库)  
⏰ 定时任务: Cron Triggers (4次/日自动执行)
🌐 API网关: OpenRouter (多模型AI API聚合)`}
                </pre>
              </div>
              
              <h3 className="font-semibold text-terminal-text mt-6">前端展示</h3>
              <div className="bg-terminal-bg border border-terminal-border p-4 rounded">
                <pre className="text-sm text-terminal-text">
{`📝 CMS: Payload CMS (Headless内容管理)
🚀 部署: Vercel (自动化部署)`}
                </pre>
              </div>
            </div>
          </section>

          {/* 内容处理流程 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              🔄 内容处理流程
            </h2>
            
            <div className="pl-4 space-y-6">
              {/* RSS源聚合 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-terminal-text">1. RSS源聚合</h3>
                <ul className="list-disc list-inside space-y-2 text-terminal-muted">
                  <li><strong>100+以上高质量RSS源</strong>，覆盖全球AI/ML领域</li>
                  <li><strong>智能轮换策略</strong>: 每次处理35个源(15核心+20轮换)</li>
                </ul>
                
                <div className="bg-terminal-bg border border-terminal-border p-4 rounded mt-3">
                  <h4 className="text-sm font-semibold text-pistachio-400 mb-2">分时段处理:</h4>
                  <div className="text-sm text-terminal-muted space-y-1">
                    <div>🕛 00:00 UTC → 美洲AI机构</div>
                    <div>🕐 04:00 UTC → 欧洲AI研究</div>
                    <div>🕗 08:00 UTC → 亚洲AI公司</div>
                    <div>🕞 15:00 UTC → 全球综合内容</div>
                  </div>
                </div>
              </div>

              {/* 智能内容筛选 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-terminal-text">2. 智能内容筛选</h3>
                <ul className="list-disc list-inside space-y-2 text-terminal-muted">
                  <li><strong>三层去重机制</strong>: URL精确匹配 → 标题相似度 → AI内容指纹</li>
                  <li><strong>AI相关性判断</strong>: 极宽松标准，涵盖直接/间接/潜在AI相关内容</li>
                  <li><strong>多模型降级</strong>: 确保高可用性和成本控制</li>
                </ul>
              </div>

              {/* AI内容生成 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-terminal-text">3. AI内容生成</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-terminal-border p-4 rounded">
                    <h4 className="font-semibold text-pistachio-400 mb-2">📝 双语摘要</h4>
                    <p className="text-sm text-terminal-muted">
                      专业术语标注: 中文后自动添加英文对照
                    </p>
                  </div>
                  <div className="border border-terminal-border p-4 rounded">
                    <h4 className="font-semibold text-pistachio-400 mb-2">🔍 SEO优化</h4>
                    <p className="text-sm text-terminal-muted">
                      基于英文标题/关键词生成友好URL
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI模型配置 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              🤖 AI模型配置
            </h2>
            
            <div className="pl-4 space-y-4">
              <h3 className="font-semibold text-terminal-text">模型选择策略 (性价比优先)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="border border-terminal-border p-3 rounded">
                    <h4 className="text-sm font-semibold text-pistachio-400">🌙 Kimi (moonshot-v1-8k)</h4>
                    <p className="text-xs text-terminal-muted">中文理解优秀，主力模型</p>
                  </div>
                  <div className="border border-terminal-border p-3 rounded">
                    <h4 className="text-sm font-semibold text-pistachio-400">🧠 DeepSeek Chat</h4>
                    <p className="text-xs text-terminal-muted">AI/ML技术内容专家，成本极低</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="border border-terminal-border p-3 rounded">
                    <h4 className="text-sm font-semibold text-pistachio-400">⚡ Groq (Llama-3.1-70B)</h4>
                    <p className="text-xs text-terminal-muted">极快推理，批量筛选首选</p>
                  </div>
                  <div className="border border-terminal-border p-3 rounded">
                    <h4 className="text-sm font-semibold text-pistachio-400">🔧 Qwen 2.5-72B</h4>
                    <p className="text-xs text-terminal-muted">中文术语准确，稳定备用</p>
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-terminal-text mt-6">不同场景的模型调度</h3>
              <div className="bg-terminal-bg border border-terminal-border p-4 rounded">
                <pre className="text-sm text-terminal-text">
{`📊 内容筛选: Groq → DeepSeek → Kimi → Qwen
📝 详细摘要: Kimi → DeepSeek → Groq → Qwen  
🌐 翻译标注: Kimi → DeepSeek → Qwen → Groq`}
                </pre>
              </div>
            </div>
          </section>

          {/* 多平台发布 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              📱 多平台发布
            </h2>
            <div className="pl-4 space-y-3 text-terminal-text">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-terminal-border p-4 rounded">
                  <h3 className="font-semibold text-pistachio-400 mb-2">📝 Payload CMS集成</h3>
                  <p className="text-sm text-terminal-muted">
                    Headless CMS自动内容管理和发布
                  </p>
                </div>
                <div className="border border-terminal-border p-4 rounded">
                  <h3 className="font-semibold text-pistachio-400 mb-2">💬 Telegram频道</h3>
                  <p className="text-sm text-terminal-muted">
                    自动推送到Telegram频道，实时资讯推送
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 技术亮点 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-pistachio-400 border-l-4 border-pistachio-400 pl-4">
              🎯 技术亮点
            </h2>
            <div className="pl-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="border border-terminal-border p-3 rounded">
                    <h4 className="text-sm font-semibold text-pistachio-400">🌍 Edge Computing</h4>
                    <p className="text-xs text-terminal-muted">利用Cloudflare全球边缘网络，毫秒级响应</p>
                  </div>
                  <div className="border border-terminal-border p-3 rounded">
                    <h4 className="text-sm font-semibold text-pistachio-400">🔄 智能轮换</h4>
                    <p className="text-xs text-terminal-muted">RSS源动态调度，确保内容覆盖和系统稳定</p>
                  </div>
                  <div className="border border-terminal-border p-3 rounded">
                    <h4 className="text-sm font-semibold text-pistachio-400">🔧 多模型降级</h4>
                    <p className="text-xs text-terminal-muted">AI服务高可用，单点故障自动切换</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="border border-terminal-border p-3 rounded">
                    <h4 className="text-sm font-semibold text-pistachio-400">🔍 SEO友好</h4>
                    <p className="text-xs text-terminal-muted">英文slug生成，搜索引擎优化</p>
                  </div>
                  <div className="border border-terminal-border p-3 rounded">
                    <h4 className="text-sm font-semibold text-pistachio-400">⚡ 实时预热</h4>
                    <p className="text-xs text-terminal-muted">内容发布后自动预热核心页面</p>
                  </div>
                  <div className="border border-terminal-border p-3 rounded">
                    <h4 className="text-sm font-semibold text-pistachio-400">💰 成本控制</h4>
                    <p className="text-xs text-terminal-muted">性价比模型组合，大幅降低运营成本</p>
                  </div>
                </div>
              </div>
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
          <p>Powered by Cloudflare Workers + Payload CMS + GenSpark AI</p>
          <p className="mt-1">
            © 2024 斯基GPT. All rights reserved.
          </p>
          <p className="mt-2 text-pistachio-400 font-semibold">
            斯基GPT - 做你的AI驾驶员！
          </p>
        </div>
      </div>
    </TerminalLayout>
  )
}